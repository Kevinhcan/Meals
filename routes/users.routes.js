const express = require('express');

// Middlewares
const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controller
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderById,
  login,
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/signup', createUserValidations, checkValidations, createUser);
router.post('/login', login);
// Validation sessions
router.use(protectToken);
router.get('/', getAllUsers);
router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);

module.exports = { usersRouter: router };
