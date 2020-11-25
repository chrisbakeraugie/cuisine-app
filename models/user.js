const mongoose = require('mongoose');
const Subscriber = require('./subscriber');
// const bcrypt = require('bcrypt'); Removed for passport-local-mongoose login strategy
const passportLocalMongoose = require('passport-local-mongoose');
const randToken = require('rand-token');

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      trim: true
    },
    middle: {
      type: String,
      trim: true
    }
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },

  zipCode: {
    type: Number,
    min: 00500,
    max: 99950
  },

  // Removed on addition of Passport.js, which manages this for us
  // password: {
  //   type: String,
  //   required: true
  // },

  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  subscribedAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },

  apiToken: {type:String}
},
  { timestamps: true } // Timestamp property to record createdAt and updatedAt dates
);

userSchema.virtual("fullName").get(function () {
  return (`${this.name.first} ${this.name.last}`)
});

userSchema.virtual("middleName").get(function() {
  if (this.name.middle){
    return("Yes");
  } else {
    return("No");
  }
});

/**
 * This "pre save hook" checks to see if the user already has an associated subscriber,
 * and stops the save operation if it does.
 */
userSchema.pre("save", function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    }).then(subscriber => {
      user.subscribedAccount = subscriber;
      next();
    }).catch(error => {
      console.log(`Error in connecting subscriber: ${error}`);
    });
  } else {
    next(); 
  }
});

/**
 * This method checks for a user token to be used with api security.
 */
userSchema.pre("save", function (next) {
  let user = this;
  if (!user.apiToken) { // Checks for an existing API token and generates a new one with randToken.generate
    user.apiToken = randToken.generate(16); 
  }
  next();
});


/**
 * Applying the passport-local-mongoose module as 
 * a plugin to the user schema
 * 
 * NOTE
 * 
 * When this is functioning, Passport.js automatically takes care of
 * password storage, so you can remove the password property.
 * It modifies your schema behind the scenes to add ash and salt fields to your User model
 * 
 */
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

const User = mongoose.model('User', userSchema);

module.exports = User;