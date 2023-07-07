const express = require('express');

const router = express.Router();

// Middlewares
const {
  createRestaurantValidations,
  createReviewValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');
const {
  protectToken,
  protectAdmin,
} = require('../middlewares/users.middlewares');

// Controllers
const {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurants.controller');

router
  .route('/')
  .get(getAllRestaurants)
  .post(createRestaurantValidations, checkValidations, createRestaurant);
router.get('/:id', getRestaurantById);
// Validation session
router.use(protectToken);
router
  .route('/:id')
  .patch(protectAdmin, updateRestaurant)
  .delete(protectAdmin, deleteRestaurant);
router.post(
  '/reviews/:id',
  createReviewValidations,
  checkValidations,
  createReview
);
router
  .route('/reviews/:restaurantId/:id')
  .patch(updateReview)
  .delete(deleteReview);

module.exports = { restauratsRouter: router };
