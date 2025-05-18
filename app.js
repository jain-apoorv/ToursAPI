const express = require('express');
const { get } = require('http');
const { type } = require('os');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRouter');
const cors = require('cors');

const userRouter = require('./routers/userRouter');
const AppError = require('./utils/appError');
const bookingRouter = require('./routers/bookingRouter');
const app = express();

// added by me
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log(req.headers['authentication']);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`${req.url} is not a valid endpoint`, 404));
});

// global error handling middleware
app.use((err, req, res, next) => {
  console.log('$$$status code', err.statusCode);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
