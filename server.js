const app = require('./app');
const mongoose = require('mongoose');

mongoose
  .connect(
    `<MONGODB URI>`
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
