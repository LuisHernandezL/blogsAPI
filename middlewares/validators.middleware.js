const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //array has errors
    errors.array(); //[{value,msg,param,location},{value,msg,param,location},{value,msg,param,location}....]
    //step1 loop through array of errors
    //step2 get all error msg [msg,msg,msg]
    //step3 combie(join) all stirngs in the array
    //step 4 send the combined msg in the response
    const errorMsg = errors.array().map((err) => err.msg);
    const message = errorMsg.join('. ');
    return next(new AppError(message, 400));
  }

  next();
};

const createUserValidators = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isAlphanumeric()
    .withMessage('Password must contain letters and numbers'),
  checkResult,
];

module.exports = { createUserValidators };
