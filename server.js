const express = require('express');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
require('dotenv').config();
const authRouter = require('./routes/authRouter');
const reservationRouter = require('./routes/reservationRouter');
const staffRouter = require('./routes/staffRouter');
const userRouter = require('./routes/userRouter');
const db = require('./db'); // Connect to MongoDB

const app = express();

// Middleware
app.use(logger('dev')); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(methodOverride('_method')); // Support PUT/DELETE in forms
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
});
app.use(express.static('public')); // Serve static files

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/reservations', reservationRouter);
app.use('/timeSlots', staffRouter);

// Set up the base route
app.get('/', (req, res) => {
    res.render('index.ejs')
});

// Listen on PORT
const PORT = process.env.PORT? process.env.PORT: 3000;
app.listen(PORT, () => {
    console.log(`Running Server on Port ${PORT} ...`);
});