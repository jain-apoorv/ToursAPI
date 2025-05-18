const mongoose = require('mongoose');
const Tour = require('./tourModel');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  // numberOfPeople: {
  //   type: Number,
  //   required: true,
  //   default: 1,
  // },
  price: {
    type: Number,
    required: true,
  },
  bookedAt: {
    type: Date,
    default: Date.now(),
  },
  startDate: {
    type: Date,
    required: true, // Ensure a start date is provided
  },
  passengers: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
        gender: {
          type: String,
          enum: ['Male', 'Female', 'Other'],
          required: true,
        },
      },
    ],
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'A booking must have at least one passenger.',
    },
  },
});

bookingSchema.index({ tour: 1, user: 1, startDate: 1 }, { unique: true });

bookingSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const tour = await Tour.findById(this.tour);
    if (!tour) {
      return next(new Error('Tour not found for booking'));
    }

    this.price = tour.price * this.passengers.length;

    // Check if the selected start date is valid and exists in the tour's startDates
    const startDateExists = tour.startDates.some(
      (date) => date.toISOString() === this.startDate.toISOString()
    );
    if (!startDateExists) {
      return next(
        new Error('Selected start date is not available for this tour')
      );
    }

    const dateIndex = tour.startDates.findIndex(
      (date) => date.toISOString() === this.startDate.toISOString()
    );

    if (tour.spotsLeftPerDate[dateIndex] < this.passengers.length) {
      return next(new Error('Not enough spots left for the selected date'));
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
