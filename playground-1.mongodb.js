use('natours-test')

db.tours.find()
// db.tours.find({ price: { $gt: 500 }, ratings: { $gte: 4.8 } })
// db.tours.find({ price: { $lte: 500 } })
// db.tours.find({ ratings: { $gte: 4.8 }, price: { $lte: 500 } })
// db.tours.find({ $or: [{ price: { $lt: 500 } }, { ratings: { $gte: 4.8 } }] })
// db.tours.find({ $or: [{ price: { $lt: 500 } }, { ratings: { $gte: 4.8 } }] }, { name: 1, _id: 0 })

// db.tours.insertMany([
//     { name: "The See Explorer", price: 497, ratings: 4.8 }, { name: "The Snow Adventurer", price: 997, ratings: 4.9, difficulty: "easy" }
// ])
// db.tours.updateOne({ name: "The Snow Adventurer" }, { $set: { price: 597 } })
// db.tours.updateMany({ price: { $gt: 500 }, ratings: { $gte: 4.8 } }, { $set: { premium: true } })