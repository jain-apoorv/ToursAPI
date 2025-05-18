const { decode } = require('punycode');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { sendEmail } = require('../controllers/email');
const crypto = require('crypto');

const createJWT = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const createdUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  console.log(createdUser);

  // const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRY,
  // });

  res.status(200).json({
    status: 'success',
    // token: token,
    message: 'a new user created',
    payload: createdUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new AppError('enter the email id and password', 404);
    return next(err);
  }

  const user = await User.findOne({ email }).select('+password');
  // console.log(user);

  if (!user) {
    return next(new AppError('incorrect password or email', 401));
  }
  const correct = await user.matchPassword(password, user.password);

  if (!correct) {
    return next(new AppError('incorrect password or email', 401));
  }
  const token = createJWT(user._id);

  return res
    .status(200)
    .cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
      ),
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    })
    .json({
      status: 'success',
      message: 'logged in successfully',
      token,
      user,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check the token
  //check if it matches
  //check if user exists anymore
  // check if user changed the password?
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not logged in', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('user doesnot exist', 401));
  }

  // TODO: if (user.changedPassword) {
  //   console.log(user.changedPassword, decoded.iat);
  // } will implement it later
  req.user = user;
  next();
});

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(roles);
      console.log(req.user.role);
      return next(
        new AppError('🚫🚫U are not allowed to delete a tour, Stay Away', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. find the user by email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError('there is no user associated with the provided email', 404)
    );
  }

  //2. generate reset token

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  //3. send it to user

  const resetLink = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/usrs/resetPassword/${resetToken}`;

  //
  try {
    await sendEmail({
      email: user.email,
      message: `this is the reset link ${resetLink}. send a patch request with password and password confirm on this link.`,
      subject: 'passowrd reset request',
    });
  } catch {
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('server faled to send the token to the mail', 400)
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'token sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // check if the user with token exists
  // if the token expired or not
  // passowrd and confirm password provided or not
  const token = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('password token invalid', 400));
  }

  user.resetPasswordExpires = undefined;
  user.resetPasswordExpires = undefined;
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  /// TODO: pssword changed at remaining

  res.status(200).json({
    status: 'ok',
    message: 'password reset successfull',
  });
});
