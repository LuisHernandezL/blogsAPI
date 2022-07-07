const express = require('express');

// Controllers
const {
  getAllComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

// Middlewares
const { commentExist } = require('../middlewares/comment.middleware');
const { protectSession } = require('../middlewares/auth.middleware');
const commentsRouter = express.Router();

commentsRouter.use(protectSession);

commentsRouter.route('/').get(getAllComments).post(createComment);

commentsRouter
  .use('/:id', commentExist)
  .route('/:id')
  .get(getCommentById)
  .patch(updateComment)
  .delete(deleteComment);

module.exports = { commentsRouter };
