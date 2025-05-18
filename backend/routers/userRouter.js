const fs = require('fs');
const express = require('express');
const userControllers = require('./../controllers/userControllers');
const authController = require('./../controllers/authController');
const { signup, login } = require('./../controllers/authController');

const userRouter = express.Router();

userRouter.use(authController.protect);

userRouter.param('id', userControllers.checkID);

userRouter.route('/').get(userControllers.getUsers);
userRouter.route('/').post(userControllers.postUser);
userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);

userRouter.route('/forgotPassword').post(authController.forgotPassword);
userRouter
  .route('/resetPassword/:resetToken')
  .patch(authController.resetPassword);

userRouter
  .route('/updateData')
  .patch(authController.protect, userControllers.updateMe);

userRouter
  .route('/deleteAccount')
  .delete(authController.protect, userControllers.deleteMe);

module.exports = userRouter;
