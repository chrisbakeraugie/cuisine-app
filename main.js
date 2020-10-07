const express = require('express');
const app = express();
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recipe_db', { useNewUrlParser: true });
const db = mongoose.connection;

db.once("open", () => {
  console.log('Successfully connected to MongoDB using Mongoose');
});

// Define the Subscriber schema
const subscriberSchema = mongoose.Schema({
  name: String,
  email: String,
  zipCode: Number
});

// The model that can be used to create new Subscribers
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Creating a new subscriber example
let subscriber1 = new Subscriber({
  name: 'New Subscriber',
  email: 'subscriber@subscriber.sUbScriBe'
});

// Saving a subscriber to the database
subscriber1.save((err, savedDocument) => {
  if (err) {
    console.log(err);
  }
  console.log(savedDocument)
});

Subscriber.create({
  name: "Another Subscriber, but done in one step",
  email: "icantthinkofanyfunnamesrightnow@gmail.com"
}, (err, savedDocument) => {
  if (err) {
    console.log(err);
  }
  console.log(savedDocument)
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

app.get('/', (req, res) => {
  res.send("Welcome to this food website");
});

app.get('/courses', homeController.showCourses);
app.get('/contact', homeController.showSignUp);
app.post('/contact', homeController.postedSignUpForm);

// Errors need to be last routes - act as a catch all for your website
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(
    `Server running at http:// localhost:${app.get("port")}`
  );
});