const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');
const bookingController = require('../controllers/bookingController');

const tourRouter = express.Router();

// tourRouter.param('id', tourControllers.checkID);

const top5cheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price';

  next();
};

tourRouter.route('/tour-stats').get(tourControllers.getTourStats);
// alias routing : change the query using middleware.
tourRouter.route('/top-5-cheap').get(top5cheap, tourControllers.getAllTours);

tourRouter.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

tourRouter
  .route('/')
  .get(authController.protect, tourControllers.getAllTours)
  .post(tourControllers.postTour);

tourRouter
  .route('/:tourId/createBooking')
  .post(authController.protect, bookingController.createBooking);

tourRouter
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  )
  .patch(tourControllers.patchTour)
  .get(tourControllers.getTour);

module.exports = tourRouter;
