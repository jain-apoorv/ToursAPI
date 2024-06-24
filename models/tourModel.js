const mongoose = require('mongoose');

const schemaa = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
    },

    summary: {
      type: String,
      trim: true, // removes thewhitespace in the end and beginning gets cut.
      required: [true, 'A tour must have a summary'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'a tour must have  an image'],
    },

    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schemaa.virtual('durationWeeks').get(function (req, res) {
  return this.duration / 7;
});
schemaa.pre('save', function () {
  console.log(this);
});
const Tour = mongoose.model('Tour', schemaa); // like a constructor function.

module.exports = Tour;
