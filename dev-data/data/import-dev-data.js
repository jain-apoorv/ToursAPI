const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');

const fs = require('fs');

mongoose
  .connect(
    `mongodb+srv://apoorv:aRrFcKeZ1RORIzxL@cluster0.wjthyde.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then((con) => {
    console.log('db connection is succesfull');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const addtourdata = async function () {
  try {
    await Tour.create(tours).then(console.log('all tours got inserted'));
    process.exit();
  } catch (err) {
    console.log('caught an err', err);
  }
};

const deleteTours = async function () {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log('caught an err', err);
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  addtourdata();
} else if (process.argv[2] === '--delete') {
  deleteTours();
}
