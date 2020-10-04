const express = require('express');
const app = express();
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const layouts =  require('express-ejs-layouts');


app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs'); // Set app to use ejs
app.use(layouts); // Set the app to use the layout


/**
 * urlencoded uses body-parser, extended is an option that chooses
 * whether the urlencoded data is parsed with "querystring" library (false)
 * or "qs" library (true)
 */
app.use(express.urlencoded({ extended: false }));

app.get('/', (req,res) => {
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