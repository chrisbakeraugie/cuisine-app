const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    required: true
  },

  maxStudents: {
    type: Number,
    default: 0,
    min: [0, 'Course cannot have negative number of students']
  },

  cost: {
    type: Number,
    default: 0,
    min: [0, 'Negative means you\'d be paying your students. Don\'t do that']
  }
}, { timestamps: true }
)

module.exports = mongoose.model('Course', courseSchema)
