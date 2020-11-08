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
  },

  new: (req,res) => {
    res.render("users/new");
  },

  create: (req,res,next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },

      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };

    User.create(userParams).then((user) => {
      res.locals.redirect = "/users";
      res.locals.user = user;
      next();
    }).catch(error => {
      console.log(`Error saving user: ${error}`);
      next(error);
    });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else {
      next();
    }
  }
}