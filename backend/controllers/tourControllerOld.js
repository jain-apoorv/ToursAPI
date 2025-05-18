const { checkID } = require('./userControllers');

fs = require('fs');
const allTours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = function (req, res, next, val) {
  if (val >= allTours.length || val < 0) {
    return res.status(404).json({
      status: 'invalid id',
    });
  }

  next();
};
exports.getAllTours = function (req, res) {
  console.log('i am the middle ware get');
  res.status(200).json({
    status: 'normal',
    data: {
      allTours,
    },
  });
};

exports.postTour = function (req, res) {
  console.log('i am the middle ware Post');
  const tour = req.body;
  tour.id = allTours[allTours.length - 1].id + 1;
  allTours.push(tour);

  fs.writeFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(allTours)
  );
  res.send('tour added');
};

exports.deleteTour = function (req, res) {
  console.log(req.params);

  const id = req.params.id;

  const tours = allTours.filter((el) => el.id != id);
  fs.writeFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours)
  );
  res.send('tour deleted');
};

exports.patchTour = function (req, res) {
  const targetId = req.params.id * 1;
  const index = allTours.findIndex((element) => element.id === targetId);

  if (index === -1) {
    res.send('No such tour found');

    res.end();
  } else {
    Object.assign(allTours[index], req.body);

    fs.writeFileSync(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(allTours)
    );

    res.send(`tour ${req.params.id} got patched`);
  }
};

/// creating a controller to check that its a valid rewuest body

exports.checkBody = function (req, res, next) {
  const el = req.body;
  const has = Object.hasOwn(el, 'name');

  const has2 = Object.hasOwn(el, 'price');

  console.log('has: ', has, has2);

  if (has && has2) {
    next();
  } else {
    return res.status(400).json({
      status: 'enter name and price',
    });
  }
};
