const User = require('../models/user');
const passport = require('passport');
const token = process.env.TOKEN || "recipeT0k3n"; // Temporary for token testing


module.exports = {
  // getUserParams: (body) => { // This comes way later, apparently
  //   return {
  //     name: {
  //       first: body.first,
  //       last: body.last
  //     },
  //     email: body.email,
  //     password: body.password,
  //     zipCode: body.zipCode
  //   };
  // },

  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users; // This is storing the user data on the response.
        next();
      })
      .catch(err => {
        console.log(`Error fetching users: ${err.message}`);
        next(err); // Catches error and sends it to next middleware
      });
  },

  indexView: (req, res) => {
    res.render("users/index");
  },

  new: (req, res) => {
    res.render("users/new");
  },

  create: (req, res, next) => {
    if (req.skip) {
      next();
    }

    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode

    };

    let newUser = new User(userParams);
    console.log("\n\n" + newUser + "\n\n");
    User.register(newUser, req.body.password, (error, user) => {
      if (user) { // If user created successfully
        req.flash("success", `${user.fullName}'s account created`);
        res.locals.redirect = "/users";
        next();
      } else { // If user doesn't create successfully
        req.flash("error", `Failed to create user account because: ${error.message}.`);
        res.locals.redirect = "/users/new";
        next();
      }
    })

  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else {
      next();
    }
  },

  show: (req, res, next) => {
    let userID = req.params.id;
    User.findById(userID).then(user => {
      res.locals.user = user;
      next();
    }).catch(error => {
      console.log(`Error retching user by ID: ${error.message}`);
      next(error);
    });
  },

  showView: (req, res) => {
    res.render("users/show");
  },

  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId).then(user => {
      res.render("users/edit", {
        user: user // renders the user edit page for a specific user
      });
    }).catch(error => {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    })
  },

  update: (req, res, next) => {
    let userID = req.params.id;
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };

    User.findByIdAndUpdate(userID, {
      $set: userParams
    }).then(user => {
      res.locals.redirect = `/users/${userID}`;
      res.locals.user = user;
      next();
    }).catch(error => {
      console.log(`Error updating user by ID: ${error.message}`);
      next(error);
    });
  },

  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndDelete(userId).then(() => {
      res.locals.redirect = "/users";
      next();
    }).catch(error => {
      console.log(`Error deleting user: ${error.message}`);
      next();
    })
  },

  login: (req, res) => {
    res.render("users/login");
  },

  /**
   * This method replaces the bcrypt authentication method,
   * since passport.js handles this for us.
   */
  authenticate:
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: "Failed to login.",
      successRedirect: "/",
      successFlash: "Logged In!"
    })
  ,

  validate: (req, res, next) => {
    req.sanitizeBody("email").normalizeEmail({
      all_lowercase: true
    }).trim();
    req.check("email", "Email is invalid").isEmail();
    req.check("zipCode", "Zip code is invalid").notEmpty().isInt().isLength({ min: 5, max: 5 }).equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then(error => { // collect results of the sanitize method
      if (!error.isEmpty()) {
        let messages = error.array().map(e => {
          e.msg;
        });
        req.skip = true; // Skip property to true ???
        req.flash("error", messages.join(" and ")); // Add error messages as flash messages
        res.locals.redirect = "/users/new"; // Set redirect path to new
        next();
      } else {
        next(); // Call next middleware
      }
    })
  },

  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out");
    res.locals.redirect = '/users/logged-out';
    next();
  },

  loggedOut: (req, res) => {
    res.render('users/loggedOut');
  },

  verifyToken: (req, res, next) => {
    // First attempt at using tokens.
    // if (req.query.apiToken === token) {
    //   next();
    // } else {
    //   next(new Error("Invalid API token."));
    // }
    let token = req.query.apiToken;
    if (token) {
      User.findOne({apiToken: token}).then(user => { // Search for user with API token
        if (user) {
          next(); // WARNING - this will allow access if ANY user has the token submitted
        } else {
          next(new Error('Invalid API token'));
        }
      }).catch(error => {
        next(new Error(error.message));
      });
    } else {
      next(new Error('Invalid API token'));
    }
  }
}