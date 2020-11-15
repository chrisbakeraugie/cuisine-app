const mongoose = require('mongoose');
const Subscriber = require('./subscriber');
const bcrypt = require('bcrypt');

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

  password: {
    type: String,
    required: true
  },

  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  subscribedAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" }
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
 * Pre save will run whenever a user is saved. on creation or
 * updated via the  ave method
 */
userSchema.pre("save", function(next) {
  let user = this; // Storing "this" because you lose context in a pre-hook
  
  /**
   * bcrypt takes a password and a number. The "number" represents
   * the level of complexity of the hash (10 is considered reliable)
   * 
   * Then, the hash is accepted as the user password.
   * Calling next saves the user to the database.
   * 
   * Errors are logged
   */
  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash;
    next();
  }).catch(error => {
    console.log(`Error in hashing password: ${error.message}`);
    next(error);
  });
});

userSchema.methods.passwordComparison = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;