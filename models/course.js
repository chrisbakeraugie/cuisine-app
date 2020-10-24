const mongoose = require('mongoose');

const courseSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    required: true
  },

  items: [],

  zipCode: {
    type: Number,
    min: [00501, "Zip code too short"],
    max: [99950, "Zip code too large"]
  }
});

module.exports = mongoose.model("Course", courseSchema);