const fs = require('fs')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
const tours = JSON.parse(fs.readFileSync('C:/Users/User/Desktop/nodejs-jonas/complete-node-bootcamp-master/4-natours/starter/dev-data/data/tours-simple.json'))

exports.checkID = (req, res, next, val) => {
    console.log(`tour id is: ${val}`);
    if (parseInt(req.params.id) > tours.length) {
        return res.status(404).json({ status: 'fail', message: 'Invalid ID' })
    }
    next()
}

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next()
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({ status: 'success', requestTime: req.requestTime, result: tours.length, data: { tours } })

}
exports.getTour = (req, res) => {
    const tour = tours.find((tour) => tour.id === parseInt(req.params.id))
    res.status(200).json({ status: 'success', data: { tours: tour } })


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
exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = { ...req.body, id: newId }
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (error) => {
        res.status(201).json({ status: 'success', data: { tour: newTour } })
    })

}