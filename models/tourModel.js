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
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have an image'],
    },

    images: [String],

    startDates: [Date],

    spotsLeftPerDate: {
      type: [Number],
      default: function () {
        return this.startDates?.map(() => this.maxGroupSize) || [];
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// schemaa.virtual('durationWeeks').get(function (req, res) {
//   return this.duration / 7;
// });
// schemaa.pre('save', function () {
//   console.log(this);
// });

const Tour = mongoose.model('Tour', schemaa); // like a constructor function. telling Mongoose to create or access a MongoDB collection named "tours" plural

module.exports = Tour;
