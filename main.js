const express = require('express');
const app = express();
const homeController = require('./controllers/homeController');

app.set('port', process.env.PORT || 3000);


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

app.listen(app.get("port"), () => {
  console.log(
    `Server running at http:// localhost:${app.get("port")}`
  );
});