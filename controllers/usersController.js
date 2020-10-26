const User = require('../models/user');


module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(users => {
        console.log("Ran index");
        res.locals.users = users; // This is storing the user data on the response.
        next();
      })
      .catch(err => {
        console.log(`Error fetching users: ${err.message}`);
        next(err); // Catches error and sends it to next middleware
      });
  },

  indexView: (req, res) => {
    console.log("ran indexView")
    res.render("users/index");
  }
}