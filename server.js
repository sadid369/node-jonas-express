const app = require('./app');
const mongoose = require('mongoose');
// const globalErrorHandler = require('./controllers/errorController');
console.log(app.get('env'));

require('dotenv').config();

const port = process.env.PORT || 5000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const LOCAL_DB = process.env.DATABASE_LOCAL;
// app.use(globalErrorHandler);
mongoose.connect(DB).then((con) => {
    // console.log(con.connections);
    app.listen(port, () => console.log('> Server is up and running on port : ' + port));
    console.log('DB Connection Successful');
}).catch((err) => {
    console.log("Mongo bd connection failed !!!", err);
});


// app.listen(port, () => console.log('> Server is up and running on port : ' + port));

