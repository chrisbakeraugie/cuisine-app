const mongoose = require('mongoose')

// Define the Subscriber schema
const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  zipCode: {
    type: Number,
    min: [501, 'Zip code too short'],
    max: [99999, 'Zip code too long']
  },

  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Referencing the course.js model. The [] are just to represent it will be an array
}, { timestamps: true })

subscriberSchema.methods.getInfo = function () {
  return (`Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`)
}

subscriberSchema.methods.findLocalSubscribers = function () {
  return this.model('Subscriber').find({ zipCode: this.zipCode }).exec()
}

module.exports = mongoose.model('Subscriber', subscriberSchema)
