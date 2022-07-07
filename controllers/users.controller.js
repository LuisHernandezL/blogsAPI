const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Models database
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Comment } = require('../models/comment.model');

//error handle fuction
//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

// gen secrest for jwt, require('crypto').randomBytes(64).toString('hex')
dotenv.config({ path: './config.env' });

//definiendo los verbos
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    order: [['id', 'ASC']],
    include: [
      { model: Post, include: { model: Comment, model: User } },
      { model: Comment },
    ],
  });
  res.status(200).json({
    status: 'success',
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, age, email, password } = req.body;

  //Hash password
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt); //salt
  const newUser = await User.create({
    name,
    age,
    email,
    password: hashPassword,
  });

  //remove password from response
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, age, email, password } = req.body;

  await user.update({ name, age, email, password });

  res.status(201).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({
    status: 'success',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: 'active' } });
  if (!user) {
    return next(new AppError('Credentials invalid', 400));
  }
  //validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError('Credentials invalid', 400));
  }
  //Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  //Send response
  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  login,
};
