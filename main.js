const express = require('express');
const app = express();
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recipe_db', { useNewUrlParser: true });
const db = mongoose.connection;
const subscriberController = require('./controllers/subscribersController');
const usersController = require('./controllers/usersController');
const router = express.Router();
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator'); // Tool to check that data matches a criteria
const passport = require("passport");
const User = require("./models/user");// See passport serialization for information




/**
 * method-override package because HTML forms only support
 * GET and POST requests. This package will let Express interpret
 * POST requests as PUT requests, for example
 */
const methodOverride = require("method-override");



db.once("open", () => {
  console.log('Successfully connected to MongoDB using Mongoose');
});


app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs'); // Set app to use ejs
app.use(layouts); // Set the app to use the layout


/**
 * urlencoded uses body-parser, extended is an option that chooses
 * whether the urlencoded data is parsed with "querystring" library (false)
 * or "qs" library (true)
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', router);
router.use(expressValidator());

router.use(cookieParser("secret_passcode")); // configure application to use cookie parser as middleware
router.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));
router.use(connectFlash()); // configure application to use connect flash as middleware
router.use((req, res, next) => { // assign flash messages to the local flashMessages variable on the response object
  res.locals.flashMessages = req.flash();
  next();
});

router.use(passport.initialize()); // initializes passport
router.use(passport.session()); // Configure passport to use sessions. Any other sessions must be defined before this line
/**
 * Make sure the User model is imported.
 * Normally, you'd need to set up some configurations to
 * create a login strategy for a model, but because you're using
 * the default local login strategy, you only need
 * to tell passport to use the strategy created for 
 * the user model.
 * The bottom two lines direct the process of encrypting and 
 * decrypting user data stored in sessions
 */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(User.createStrategy());

router.get('/', (req, res) => {
  res.render("home");
});

router.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

router.get('/courses', homeController.showCourses);
router.get('/contact', homeController.showSignUp);
router.post('/contact', homeController.postedSignUpForm);
router.get('/subscribers', subscriberController.getAllSubscribers);
router.post('/subscribe', subscriberController.saveSubscriber);

// For /users, I separated the index and indexView. This means the query and the view are separate
// int the app.get(), I used two controllers instead of one and used the next() method in the exports object
router.get('/users', usersController.index, usersController.indexView);
router.get('/users/new', usersController.new);
router.post('/users/create', usersController.validate, usersController.create, usersController.redirectView);

router.get('/users/login', usersController.login);
router.post('/users/login', usersController.authenticate);
// router.post('/users/login',
//   passport.authenticate('local', { failureRedirect: '/users/login' }),
//   function (req, res) {
//     res.redirect('/');
//   });

router.get('/users/:id', usersController.show, usersController.showView);
router.get('/users/:id/edit', usersController.edit);
router.put('/users/:id/update', usersController.update, usersController.redirectView);
router.delete('/users/:id/delete', usersController.delete, usersController.redirectView);

// Errors need to be last routes - act as a catch all for your website
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(
    `Server running at http:// localhost:${app.get("port")}`
  );
});