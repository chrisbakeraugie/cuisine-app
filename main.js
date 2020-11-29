const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe_db', { useNewUrlParser: true });


const db = mongoose.connection;
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator'); // Tool to check that data matches a criteria
const passport = require("passport");
const User = require("./models/user");// See passport serialization for information
const router = require('./routes/index');


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
app.set("token", process.env.TOKEN || "recipeT0k3n");
app.set('view engine', 'ejs'); // Set app to use ejs
app.use(layouts); // Set the app to use the layout
app.use(express.static("public"));

/**
 * urlencoded uses body-parser, extended is an option that chooses
 * whether the urlencoded data is parsed with "querystring" library (false)
 * or "qs" library (true)
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressValidator());

app.use(cookieParser("secret_passcode")); // configure application to use cookie parser as middleware
app.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); // initializes passport
app.use(passport.session()); // Configure passport to use sessions. Any other sessions must be defined before this line
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

app.use(connectFlash()); // configure application to use connect flash as middleware
app.use((req, res, next) => { // assign flash messages to the local flashMessages variable on the response object
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});


app.get('/', (req, res) => {
  res.render("home");
});

app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));



/**
 * Connects main.js to the routes through routes/index.js
 */
app.use('/', router);

const server = app.listen(app.get("port"), () => {
  console.log(
    `Server running at http:// localhost:${app.get("port")}`
  );
}),
io = require("socket.io")(server);
/**
 * Below: Passing the io object to chatController to manage the socket connections from there
 */
require('./controllers/chatController')(io);