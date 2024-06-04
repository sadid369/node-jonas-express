
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/ApiFeatures');



exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = 'name,price,ratingsAverage,difficulty';
    next();
};






exports.getAllTours = async (req, res) => {
    try {

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
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error });
    }

};
exports.getTour = async (req, res) => {
    const id = req.params.id;
    try {

        const tour = await Tour.findById(id);
        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (error) {

    }



};
exports.updateTour = async (req, res) => {
    const id = req.params.id;

    try {
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
        res.status(404).json({ status: 'fail', message: error });
    }
};


exports.deleteTour = async (req, res) => {
    const id = req.params.id;
    try {
        await Tour.findByIdAndDelete(id);
        res.status(204).json({
            status: 'success', data: null,
        });
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error });
    }

};
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }

};


exports.getTourStatus = async (req, res) => {
    try {
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
            // {
            //     $match: { _id: { $ne: "EASY" } }
            // }
        ]);
        res.status(200).json({
            status: 'success', data: {
                stats,

            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
};