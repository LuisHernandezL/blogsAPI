const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//models
const { User } = require('../models/user.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  //Extract the token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Invalid session', 403));
  }

  //Ask JWT lubrary,  if the token is still valid
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  //check in db if the user still exists
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(new AppError('The owner of this token its not active', 403));
  }

  //Grant access
  req.sessionUser = user;
  next();
});

const verifyUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;
  //const {id}=req.params ---> alternative

  //if the ids dont match return error 403
  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
};

module.exports = { protectSession, verifyUserAccount };
