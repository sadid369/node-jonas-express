
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/ApiFeatures');
const asyncHanlder = require('express-async-handler');


exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = 'name,price,ratingsAverage,difficulty';
    next();
};






exports.getAllTours = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;
    res.status(200).json({

        status: 'success',
        result: tours.length,
        data: { tours }
    });



});


exports.getTour = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.id);


        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (error) {
        next(new AppError(error, "No tour found with that id", 404));
    }


};

exports.updateTour = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success', data: {
                tour,

            }
        });
    } catch (error) {
        next(new AppError(error, "No tour found with that id", 404));
    }

};


exports.deleteTour = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Tour.findByIdAndDelete(id);
        res.status(204).json({
            status: 'success', data: null,
        });
    } catch (error) {
        next(new AppError(error, "No tour found with that id", 404));
    }
};




exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { tour: newTour }
    });

});


exports.getTourStatus = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 }
            }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                // _id: '$ratingsAverage',
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRatings: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: {
                avgPrice: -1
            }
        },

    ]);
    res.status(200).json({
        status: 'success', data: {
            stats,

        }
    });

});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStart: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStart: -1 }
        },
        {
            $limit: 12
        }

    ]);
    res.status(200).json({
        status: 'success', data: {
            plan,

        }
    });

});