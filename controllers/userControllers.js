const fs = require('fs');
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
exports.getUsers = function (req, res) {
  res.status(200).json({
    status: 'normal',
    description: 'allUsers',
    data: {
      allUsers,
    },
  });
};

exports.postUser = (req, res) => {
  const newUser = req.body;

  allUsers.push(newUser);

  fs.writeFileSync(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(allUsers)
  );

  res.send(`${newUser.name} added into the db`);
};
