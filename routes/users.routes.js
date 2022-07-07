//importando la libreria
const express = require('express');

const usersRouter = express.Router();

//Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  login,
} = require('../controllers/users.controller');

//middlewares
const {
  createUserValidators,
} = require('../middlewares/validators.middleware');
const { userExist } = require('../middlewares/users.middleware');
const {
  protectSession,
  verifyUserAccount,
} = require('../middlewares/auth.middleware');

//definiendo endpoints
usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/', getAllUsers);

usersRouter
  .use('/:id', userExist)
  .route('/:id')
  .get(getUserById)
  .patch(verifyUserAccount, updateUser)
  .delete(verifyUserAccount, deleteUser);

/* usersRouter.use('/:id', userExist);

usersRouter.get('/:id', getUserById);

usersRouter.patch('/:id', updateUser);

usersRouter.delete('/:id', deleteUser);
 */
module.exports = { usersRouter };
