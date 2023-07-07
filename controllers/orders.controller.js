const dotenv = require('dotenv');

// Models
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

const createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({
    where: { id: mealId, status: 'active' },
  });

  if (!meal) {
    return next(new AppError('The meal is doesnt exist', 404));
  }

  const price = meal.price * quantity;

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser.id,
    price,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    data: { newOrder },
  });
});

const completeOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({ where: { id, status: 'active' } });

  if (!order) {
    return next(new AppError('Order is not found given ID 🤔', 404));
  }

  if (order.userId !== sessionUser.id) {
    return next(new AppError('You are not the owner of this order 😶', 403));
  }

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
  });
});

const cancelOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({ where: { id, status: 'active' } });

  if (!order) {
    return next(new AppError('Order is not found given ID 🤔', 404));
  }

  if (order.userId !== sessionUser.id) {
    return next(new AppError('You are not the owner of this order 😶', 403));
  }

  await order.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

module.exports = {
  createOrder,
  completeOrder,
  cancelOrder,
};
