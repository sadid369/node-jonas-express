
const Tour = require('../models/tourModel');



exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = 'name,price,ratingsAverage,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {     //1) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        console.log(req.query, queryObj);



        //2) Advance Filtering

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            console.log(sortBy);
            query.sort(sortBy);
        } else {
            // query = query.sort('-createdAt');
        }
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } else {
            // query = query.select('-__v');
        }
        //pagination
        const page = req.query.page * 1;
        const limit = req.query.limit * 1;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) {
                throw new Error('This page does not exits');
            }
        }

        const tours = await query;
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
            returnDocument: 'after',
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