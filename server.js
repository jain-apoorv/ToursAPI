const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(
    DB
    // {
    //   useNewUrlParser: true,
    //   // useCreateIndex: true,
    //   // useFindAndModify: false,
    // }
  )
  .then((con) => {
    // console.log(con.connections);
    console.log('db connection successful');
  });
app.listen(3000, () => {
  console.log(`server is running`);
});
