const express = require('express');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const User = require('./models/User');
require('dotenv').config();
const db = require('./db'); // Connect to MongoDB

const authRouter = require('./routes/authRouter.js')
const reservationRouter = require('./routes/reservationRouter.js')
const staffRouter = require('./routes/staffRouter.js')
const userRouter = require('./routes/userRouter.js')

const app = express()

// Middleware
app.use(logger('dev')) // Logging
app.use(express.json()) // Parse JSON
app.use(express.urlencoded({ extended: false })) // Parse form data
app.use(methodOverride('_method')) // Support PUT/DELETE in forms
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

// Fetch user from database based on session userId
app.use(async (req, res, next) => {
  if (req.session.user) {
    res.locals.user = await User.findById(req.session.user.id);
  } else {
    res.locals.user = null;
  }
  next();
});

// Serve static files
app.use(express.static('public'))

// View engine
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/reservations', reservationRouter)
app.use('/staff', staffRouter)

// Set up the base route
app.get('/', (req, res) => {
    res.render('index.ejs', { user: req.session.user? req.session.user: null })
})

// Listen on PORT
const PORT = process.env.PORT? process.env.PORT: 3000;
app.listen(PORT, () => {
    console.log(`Running Server on Port ${PORT} ...`)
})