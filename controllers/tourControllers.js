const { Error } = require('mongoose');
const Tour = require('./../models/tourModel');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    /// filtering ...
    const queryExcluded = ['page', 'sort', 'limit', 'fields'];
    let x = { ...this.queryString };
    /// filter 1
    queryExcluded.forEach((el) => delete x[el]);
    let xString = JSON.stringify(x);
    //filter 2
    xString = xString.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(xString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // console.log(req.query.sort);
      // query = query.sort(req.query.sort);

      let sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  field() {
    if (this.queryString.fields) {
      // console.log(req.query.fields);

      let fieldSelect = this.queryString.fields.split(',').join(' ');
      // console.log(fieldSelect);
      this.query = this.query.select(fieldSelect);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paging() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTours = async function (req, res) {
  try {
    let query = Tour.find();

    const ans = new APIfeatures(query, req.query)
      .filter()
      .sort()
      .field()
      .paging();

    const allTours = await ans.query;
    // return arrays of all the document.
    res.status(200).json({
      status: 'normal',
      results: allTours.length,
      data: {
        allTours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      meassage: err.message,
    });
  }
};

exports.getTour = async function (req, res) {
  try {
    const tour = await Tour.findById(req.params.id);
    // return the doc with that id // alternative to findOne() method.
    res.status(200).json({
      status: 'normal',
      results: tour.length,
      data: {
        tour,
      },
    });
  } catch {
    res.status(404).json({
      status: 'failed',
    });
  }
};

exports.postTour = async function (req, res) {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'posted',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      err: 'invalid post request',
    });
  }
};

exports.deleteTour = async function (req, res) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'deleted',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
    });
  }
};

exports.patchTour = async function (req, res) {
  try {
    const targetId = req.params.id * 1;

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'normal',
      tour,
    });
  } catch (err) {
    res.status(404).json({
      err,
    });
  }
};

/// aggregation pipeline
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          tours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgRatingQuantity: { $avg: '$ratingsQuantity' },

          avgPrice: { $avg: '$price' },
        },
      },
      {
        $sort: {
          avgRating: -1,
        },
      },

      // we can also repeat the stages.
    ]);

    res.status(200).json({
      status: 'normal',
      stats,
    });
  } catch (err) {
    res.status(404).json({
      err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
    ]);

    res.status(200).json({
      status: 'normal',
      resutls: plan.length,
      plan,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      err: err.message,
    });
  }
};
