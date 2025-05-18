const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const { type } = require('os');
const userSchemma = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name: The Faceless man'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email id: Arya'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please fill a valid email address'],
  },
  photo: { type: String },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: { type: String, required: true, minLength: 8, select: false },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return this.password == el;
      },
      message: 'pass and passCnfm dont match',
    },
  }, // a validator

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false, // will not show in  results.
  },
});

userSchemma.pre('save', async function (next) {
  console.log(this.password);
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  console.log('what i am doing');
  this.passwordConfirm = undefined;
  next();
});

userSchemma.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchemma.methods.matchPassword = async (entered, actual) => {
  const correct = await bcrypt.compare(entered, actual);

  return correct;
};

// not using catch async inside the userModel
userSchemma.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // need to understand it fully
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// userSchemma.methods.passwordChanged = async
const User = mongoose.model('User', userSchemma);
module.exports = User;
