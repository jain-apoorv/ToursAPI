const fs = require('fs');
const express = require('express');
const userControllers = require('./../controllers/userControllers');

const userRouter = express.Router();

userRouter.param('id', userControllers.checkID);

userRouter.route('/').get(userControllers.getUsers);
userRouter.route('/').post(userControllers.postUser);

module.exports = userRouter;
