const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxLength: [40, "A tour name must have less or equal 40 Character"],
        minLength: [10, "A tour name must have more or equal 10 Character"],
        // validate using validator package: for example: "isAlpha" take three prams 1. value, 2. ['en-US'] 3. { ignore: " -" }
        validate: {
            validator: function(value) {
                return validator.isAlpha(value, ['en-US'], { ignore: " -" });
            },
            message: `Name should be only Character ({VALUE})`
        }
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have group size"]
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],

    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price;
            },
            message: "Discount Price ({VALUE}) should be below the regular price."
        },

    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a Description"]
    },
    description: {
        type: String,
        trim: true,

    },
    imageCover: {
        type: String,
        required: [true, "A tour must have cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    }

},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
    }

);

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});
// document MIDDLEWARE : this middleware runs before .save() or .create() 
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
// tourSchema.pre('save', function(next) {
//     console.log('Will save document.....');
//     next();
// });
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE 

tourSchema.pre(/^find/, function(next) {

    this.find({ secretTour: { $ne: true } });
    this.start = new Date();
    next();
});
tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query Took ${Date.now() - this.start} milliseconds `);
    // console.log(docs);

    next();
});
// tourSchema.pre('findOne', function(next) {

//     this.find({ secretTour: { $ne: true } });

//     next();
// });


// AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this);
    next();

});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;