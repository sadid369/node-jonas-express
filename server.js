process.on('uncaughtException', (err) => {
  console.log(`uncaught Exception  🔥 Shutting down`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
const app = require('./app');
const mongoose = require('mongoose');

// const globalErrorHandler = require('./controllers/errorController');
console.log(app.get('env'));

require('dotenv').config();

const port = process.env.PORT || 5000;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const LOCAL_DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then((con) => {
  console.log('DB Connection Successful');
  // console.log(con.connections);
});
//   .catch((err) => {
//     console.log('Mongo bd connection failed !!!', err);
//   });
const server = app.listen(port, () =>
  console.log('> Server is up and running on port : ' + port)
);

process.on('unhandledRejection', function (err) {
  console.log(`unhandled rejection 🔥 Shutting down`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
