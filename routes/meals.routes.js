const express = require('express');

const router = express.Router();

// Controllers
const {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controller');
const {
  protectToken,
  protectAdmin,
} = require('../middlewares/users.middlewares');

// Middleware
const {
  createMealValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

router.get('/', getAllMeals);
router.get('/:id', getMealById);
//Validation session
router.use(protectToken);
router
  .route('/:id')
  .post(createMealValidations, checkValidations, createMeal)
  .patch(protectAdmin, updateMeal)
  .delete(protectAdmin, deleteMeal);

module.exports = { mealsRouter: router };
