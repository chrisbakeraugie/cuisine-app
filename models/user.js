const mongoose = require('mongoose');

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
})
const User = mongoose.model('User', userSchema);

module.exports = User;