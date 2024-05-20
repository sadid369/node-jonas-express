const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const dotenv = require('dotenv');
dotenv.config({ path: "C:/Users/User/Desktop/nodejs-jonas/complete-node-bootcamp-master/4-natours/starter/.env" });
console.log(process.env.PORT);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


mongoose.connect(DB).then((con) => {
    // console.log(con.connections);
    console.log('DB Connection Successful');
});

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));
console.log(tours);
//IMPORT DATA INTO DATABASE

const importData = async () => {
    try
    {
        await Tour.create(tours);
        console.log('Data Successfully Loaded!');
        process.exit();
    } catch (error)
    {
        console.log(error);
    }
};

//Delete All Dat From BD
const deleteData = async () => {
    try
    {
        await Tour.deleteMany({});
        console.log('Data Successfully Deleted');
        process.exit();
    } catch (error)
    {
        console.log(error);
    }
};
if (process.argv[2] === "--import")
{
    importData();
} else if (process.argv[2] === "--delete")
{
    deleteData();
}
console.log(process.argv);