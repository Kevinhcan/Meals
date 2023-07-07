const express = require('express');

// Middlewares
const { protectToken } = require('../middlewares/users.middlewares');
const {
  createOrderValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controllers
const {
  createOrder,
  completeOrder,
  cancelOrder,
} = require('../controllers/orders.controller');
const { getAllOrders } = require('../controllers/users.controller');

const router = express.Router();

router.use(protectToken);
router.post('/', createOrderValidations, checkValidations, createOrder);
router.get('/me', getAllOrders);
router.route('/:id').patch(completeOrder).delete(cancelOrder);

module.exports = { ordersRouter: router };
