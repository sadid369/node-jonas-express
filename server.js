const app = require('./app');
const mongoose = require('mongoose');
console.log(app.get('env'));

require('dotenv').config();

const port = process.env.PORT || 5000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const LOCAL_DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then((con) => {
    // console.log(con.connections);
    console.log('DB Connection Successful');
});


app.listen(port, () => console.log('> Server is up and running on port : ' + port));

