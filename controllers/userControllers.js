const fs = require('fs');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const allUsers = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.checkID = function (req, resp, next, val) {
  if (val >= allTours.length || val < 0) {
    return res.status(404).json({
      status: 'invalid id',
    });
  }

  next();
};
exports.getUsers = catchAsync(async function (req, res, next) {
  const allUsers = await User.find();
  res.status(200).json({
    status: 'normal',
    description: 'allUsers',
    data: {
      allUsers,
    },
  });
});

exports.postUser = (req, res) => {
  const newUser = req.body;

  allUsers.push(newUser);

  fs.writeFileSync(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(allUsers)
  );

  res.send(`${newUser.name} added into the db`);
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates!', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
