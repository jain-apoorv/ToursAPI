const express = require('express');
const tourControllers = require('./../controllers/tourControllers');

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
  .get(tourControllers.getAllTours)
  .post(tourControllers.postTour);

tourRouter
  .route('/:id')
  .delete(tourControllers.deleteTour)
  .patch(tourControllers.patchTour)
  .get(tourControllers.getTour);

module.exports = tourRouter;
