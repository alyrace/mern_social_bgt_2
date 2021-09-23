const express = require('express');
const config = require('config');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

const app = express();
//connect db
connectDB();

//cors
app.use(cors());
//helmet
app.use(helmet());


//init middleware
//allows to get data from req.body
app.use(express.json({extended:false}));

//logging middleware
if (config.get('nodeENV') == "development") {
  app.use(morgan("dev"));
}
//routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);


/* attempt 2
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT} ...`)
});