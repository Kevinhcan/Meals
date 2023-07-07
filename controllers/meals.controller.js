const dotenv = require('dotenv');

// Models
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { filterObject } = require('../utils/filterObject');

dotenv.config({ path: './config.env' });

const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: { status: 'active' },
    include: [{ model: Restaurant }],
  });

  if (!meals) {
    return next(new AppError('Meals are not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { meals },
  });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
    include: [{ model: Restaurant }],
  });

  if (!meal) {
    return next(new AppError('The meal is not exist given ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { meal },
  });
});

const createMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(200).json({
    status: 'success',
    data: {
      newMeal,
    },
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObject(req.body, 'name', 'price');

  const meal = await Meal.findOne({ where: { id, status: 'active' } });

  if (!meal) {
    return next(new AppError('The meal is not exist given ID 🤔', 404));
  }

  await meal.update({ ...data });

  res.status(200).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({ where: { id, status: 'active' } });

  if (!meal) {
    return next(new AppError('The meal is not exist given ID 🤔', 404));
  }

  await meal.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
