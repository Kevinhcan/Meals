const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError');

const createUserValidations = [
  body('name').notEmpty().withMessage('Name can not be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email can not be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password can not be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const createOrderValidations = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isNumeric()
    .withMessage('Quantity must be a numeric value'),
  body('mealId')
    .notEmpty()
    .withMessage('MealId cannot be empty')
    .isNumeric()
    .withMessage('MealtId must be a numeric value'),
];

const createRestaurantValidations = [
  body('name').notEmpty().withMessage('Name can not be empty'),
  body('address').notEmpty().withMessage('Address can not be empty'),
  body('rating')
    .notEmpty()
    .withMessage('Ranting can not be empty')
    .isNumeric()
    .withMessage('Ranting must be a numeric value')
    .custom((value) => value > 0)
    .withMessage('Ranting must be a value greater than 0')
    .custom((value) => value < 6)
    .withMessage('Ranting must be a value less than 5'),
];

const createReviewValidations = [
  body('comment').notEmpty().withMessage('Comment cannot be empty'),
  body('rating')
    .notEmpty()
    .withMessage('Ranting can not be empty')
    .isNumeric()
    .withMessage('Ranting must be a numeric value')
    .custom((value) => value > 0)
    .withMessage('Ranting must be a value greater than 0')
    .custom((value) => value < 6)
    .withMessage('Ranting must be a value less than 5'),
];

const createMealValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Price can not be empty')
    .isNumeric()
    .withMessage('Ranting must be a numeric value')
    .custom((value) => value > 0)
    .withMessage('Ranting must be a value greater than 0'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

module.exports = {
  createUserValidations,
  createOrderValidations,
  createRestaurantValidations,
  createReviewValidations,
  createMealValidations,
  checkValidations,
};
