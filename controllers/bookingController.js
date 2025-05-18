const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createBooking = catchAsync(async (req, res, next) => {
  const tourId = req.params.tourId;
  const userId = req.user.id;
  const { startDate, passengers } = req.body;
  const numberOfPeople = passengers.length;

  // 1. Load the tour and validate
  const tour = await Tour.findById(tourId);
  if (!tour) return next(new AppError('No tour found with that ID', 404));
  const dateIndex = tour.startDates.findIndex(
    (date) => new Date(date).toISOString() === new Date(startDate).toISOString()
  );
  if (dateIndex === -1)
    return next(new AppError('Selected start date is not available.', 400));
  if (tour.spotsLeftPerDate[dateIndex] < numberOfPeople)
    return next(
      new AppError('Not enough spots left for the selected date.', 400)
    );

  // 2. Deduct spots in memory
  tour.spotsLeftPerDate[dateIndex] -= numberOfPeople;
  if (tour.spotsLeftPerDate[dateIndex] < 0)
    return next(new AppError('Spots count cannot be negative.', 400));

  // 3. Try to create booking first
  let booking;
  try {
    booking = await Booking.create({
      tour: tourId,
      user: userId,
      price: numberOfPeople * tour.price,
      startDate,
      passengers,
    });
  } catch (err) {
    // Booking creation failed (e.g. unique index). No tour.save() was called, so tour unchanged.
    return next(err);
  }

  // 4. Now try to persist the tour update
  try {
    await tour.save();
  } catch (err) {
    // Tour save failed → roll back the booking we just created
    await Booking.findByIdAndDelete(booking._id);
    return next(
      new AppError(
        'Booking failed due to tour update error. Please try again.',
        500
      )
    );
  }

  // 5. Success
  res.status(201).json({
    status: 'success',
    data: { booking },
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const bookings = await Booking.find({ user: userID }).populate('tour');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

// ✅ Final version of getBookingById
exports.getBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId).populate('tour');

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.updateBookingPeople = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { passengersToAdd = [], passengersToDelete = [] } = req.body;

  // 1. Load booking & tour
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  if (booking.user.toString() !== req.user.id) {
    return next(new AppError('Not your booking', 403));
  }

  const tour = await Tour.findById(booking.tour);
  if (!tour) return next(new AppError('Tour not found', 404));

  const dateIndex = tour.startDates.findIndex(
    (d) =>
      new Date(d).toISOString() === new Date(booking.startDate).toISOString()
  );
  if (dateIndex === -1) {
    return next(new AppError('Invalid start date', 400));
  }

  // 2. Compute original state for rollback
  const originalSpots = tour.spotsLeftPerDate[dateIndex];
  const originalPassengers = booking.passengers.slice();
  const originalPrice = booking.price;

  // 3. Apply in-memory changes
  //   a) Delete
  let deletedCount = 0;
  if (passengersToDelete.length) {
    const before = booking.passengers.length;
    booking.passengers = booking.passengers.filter(
      (p) => !passengersToDelete.includes(p._id.toString())
    );
    deletedCount = before - booking.passengers.length;
    tour.spotsLeftPerDate[dateIndex] += deletedCount;
  }

  //   b) Add
  let addedCount = 0;
  if (passengersToAdd.length) {
    if (tour.spotsLeftPerDate[dateIndex] < passengersToAdd.length) {
      return next(new AppError('Not enough spots left', 400));
    }
    passengersToAdd.forEach((np) => {
      if (
        !booking.passengers.some(
          (p) =>
            p.name === np.name && p.age === np.age && p.gender === np.gender
        )
      ) {
        booking.passengers.push(np);
        addedCount++;
      }
    });
    tour.spotsLeftPerDate[dateIndex] -= addedCount;
  }

  //   c) No zero-passenger bookings
  if (booking.passengers.length === 0) {
    return next(new AppError('Must have at least one passenger', 400));
  }

  //   d) Recalculate price
  const pricePerPerson = originalPrice / originalPassengers.length;
  booking.price =
    originalPrice +
    addedCount * pricePerPerson -
    deletedCount * pricePerPerson * 0.8;

  // 4. Persist **Tour** first, so we can rollback it if Booking fails
  try {
    await tour.save();
  } catch (err) {
    // revert in-memory booking changes
    booking.passengers = originalPassengers;
    booking.price = originalPrice;
    // revert tour in-memory
    tour.spotsLeftPerDate[dateIndex] = originalSpots;
    return next(new AppError('Failed to update tour slots. Try again.', 500));
  }

  // 5. Persist **Booking** next
  try {
    await booking.save();
  } catch (err) {
    // roll back tour if booking save fails
    tour.spotsLeftPerDate[dateIndex] = originalSpots;
    await tour.save();
    return next(new AppError('Failed to update booking. Try again.', 500));
  }

  // 6. Success
  res.status(200).json({
    status: 'success',
    data: {
      booking,
      ...(addedCount && { extraPayment: addedCount * pricePerPerson }),
      ...(deletedCount && { refund: deletedCount * pricePerPerson * 0.8 }),
    },
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;

  // 1. Load the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // 2. Ensure user owns it
  if (booking.user.toString() !== req.user.id) {
    return next(
      new AppError('You do not have permission to cancel this booking.', 403)
    );
  }

  // 3. Load tour and record original spots
  const tour = await Tour.findById(booking.tour);
  const refundAmount = 0.8 * booking.price;
  let originalSpots, dateIndex;

  if (tour) {
    dateIndex = tour.startDates.findIndex(
      (d) =>
        new Date(d).toISOString() === new Date(booking.startDate).toISOString()
    );
    if (dateIndex !== -1) {
      originalSpots = tour.spotsLeftPerDate[dateIndex];
      tour.spotsLeftPerDate[dateIndex] += booking.passengers.length;
    }
  }

  // 4. Persist Tour update first
  if (tour && dateIndex !== -1) {
    try {
      await tour.save();
    } catch (err) {
      // Rollback in-memory change
      tour.spotsLeftPerDate[dateIndex] = originalSpots;
      return next(
        new AppError('Failed to restore tour spots; cancellation aborted.', 500)
      );
    }
  }

  // 5. Delete the booking
  try {
    await Booking.findByIdAndDelete(bookingId);
  } catch (err) {
    // Roll back tour spots if booking deletion fails
    if (tour && dateIndex !== -1) {
      tour.spotsLeftPerDate[dateIndex] = originalSpots;
      await tour.save();
    }
    return next(
      new AppError('Failed to delete booking; cancellation aborted.', 500)
    );
  }

  // 6. Success response
  res.status(200).json({
    status: 'success',
    message: 'Booking cancelled successfully.',
    data: {
      refundAmount,
      passengersCancelled: booking.passengers.length,
      bookingId,
    },
  });
});
