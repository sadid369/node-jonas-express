const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStatus,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect } = require('../controllers/authController');
const tourRouter = express.Router();

// tourRouter.param('id', checkID)

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(getTourStatus);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/').get(protect, getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
