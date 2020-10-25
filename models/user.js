const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    first: {
      type: String,
      trim: true
    },
    last: {
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

  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],

  subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" }
},
  { timestamps: true } // Timestamp property to record createdAt and updatedAt dates
);

userSchema.virtual("fullName").get(function () {
  return (`${this.name.first} ${this.name.last}`)
});

const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);