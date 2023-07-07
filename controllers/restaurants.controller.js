const dotenv = require('dotenv');

// Models
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { filterObject } = require('../utils/filterObject');

dotenv.config({ path: './config.env' });

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'active' },
  });

  if (!restaurants) {
    return next(new AppError('There are not restaurants to show', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      restaurants,
    },
  });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(200).json({
    status: 'success',
    data: {
      newRestaurant,
    },
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurants = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurants) {
    return next(new AppError('There is not found given ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      restaurants,
    },
  });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObject(req.body, 'name', 'address');

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('The restaurant is not found given ID', 404));
  }

  await restaurant.update({ ...data });

  res.status(200).json({ status: 'success' });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('The restaurant is not found given ID', 404));
  }

  await restaurant.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

const createReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment, rating } = req.body;
  const { sessionUser } = req;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('The restaurant is not found given ID', 404));
  }

  const newReview = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId: id,
    rating,
  });

  res.status(200).json({
    status: 'success',
    data: { newReview },
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;
  const { sessionUser } = req;
  const data = filterObject(req.body, 'comment', 'rating');

  const restaurant = await Restaurant.findOne({
    where: { id: restaurantId, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('The restaurant is not found given ID', 404));
  }

  const review = await Review.findOne({
    where: {
      id,
      restaurantId,
      status: 'active',
    },
  });

  if (!review) {
    return next(new AppError('The review doesnt exist', 404));
  }

  if (review.userId !== sessionUser.id) {
    return next(
      new AppError(
        'You are not the owner of this review, you can not update this file'
      )
    );
  }

  await review.update({ ...data });

  res.status(200).json({ status: 'success' });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;
  const { sessionUser } = req;

  const restaurant = await Restaurant.findOne({
    where: { id: restaurantId, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('The restaurant is not found given ID', 404));
  }

  const review = await Review.findOne({
    where: {
      id,
      restaurantId,
      status: 'active',
    },
  });

  if (!review) {
    return next(new AppError('The review doesnt exist 😒', 404));
  }

  if (review.userId !== sessionUser.id) {
    return next(
      new AppError(
        'You are not the owner of this review, you can not delete this file 😶'
      )
    );
  }

  await review.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
};
