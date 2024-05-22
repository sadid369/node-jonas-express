
const Tour = require('../models/tourModel');





exports.getAllTours = async (req, res) => {
    try {     //1) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        console.log(req.query, queryObj);

        // const query = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // }).where('duration').equals(5).where('difficulty').equals('easy');


        //2) Advance Filtering

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } else {
            query = query.select('-__v');
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