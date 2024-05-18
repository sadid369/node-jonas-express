
const Tour = require('../models/tourModel');





exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find({})
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: { tours }
        })
    } catch (error) {
        res.status(404).json({ status: 'fail', message: error })
    }

}
exports.getTour = async (req, res) => {
    const id = req.params.id;
    try {

        const tour = await Tour.findById(id)
        res.status(200).json({
            status: 'success',
            data: { tour }
        })
    } catch (error) {

    }



}
exports.updateTour = (req, res) => {

    console.log(req.body);
    res.status(200).json({
        status: 'success', data: {
            tour: '<Updated tour here...> ',

        }
    })

}
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success', data: null
    })

}
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Data sent',
        })
    }

}