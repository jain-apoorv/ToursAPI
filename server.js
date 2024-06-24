const app = require('./app');
const mongoose = require('mongoose');

mongoose
  .connect(
    `mongodb+srv://apoorv:aRrFcKeZ1RORIzxL@cluster0.wjthyde.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0`
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
