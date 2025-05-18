const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const express = require('express');

const bookingRouter = express.Router();
bookingRouter.use(authController.protect);

bookingRouter.get('/', bookingController.getMyBookings);

bookingRouter.patch(
  '/:bookingId/updatePeople',
  bookingController.updateBookingPeople
);
bookingRouter.delete('/:bookingId/cancel', bookingController.cancelBooking);

bookingRouter.get('/:bookingId', bookingController.getBookingById);

module.exports = bookingRouter;
