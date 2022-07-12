const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

//Routers
const { usersRouter } = require('./routes/users.routes');
const { postsRouter } = require('./routes/posts.routes');
const { commentsRouter } = require('./routes/comments.routes');
const { viewsRouter } = require('./routes/views.routes');

//Global error controller
const { globalErrorHandler } = require('./controllers/error.controller');
//Utils
const { AppError } = require('./utils/appError.util');

//Init express app
const app = express();

//enable incoming json
app.use(express.json());

//set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(path.join(__dirname + '/public')));

//limit the number of request
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Number of request have been exceded',
});

app.use(limiter);

//Add security headers
app.use(helmet());

//compress responses
app.use(compression());

//log incoming request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

//define endpoints

app.use('/', viewsRouter);

//http://localhost:4000/ap1/v1/users
app.use('/api/v1/users', usersRouter); //next(error)
//http://localhost:400/ap1/v1/posts
app.use('/api/v1/posts', postsRouter);
//http://localhost:400/ap1/v1/comments
app.use('/api/v1/comments', commentsRouter);

//Handle incoming unknown routes to the server
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

//Implementation of globalErrorHandler
app.use(globalErrorHandler);

module.exports = { app };
