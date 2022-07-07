// Models
const { Comment } = require('../models/comment.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const commentExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ where: { id } });

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  req.comment = comment;
  next();
});

module.exports = { commentExist };
