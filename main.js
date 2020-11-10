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
app.use('/', router);

router.get('/', (req, res) => {
  res.send("Welcome to this food website");
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
router.post('/users/create', usersController.create, usersController.redirectView);
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