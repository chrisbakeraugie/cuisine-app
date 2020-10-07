const mongoose = require('mongoose');

// Define the Subscriber schema
const subscriberSchema = mongoose.Schema({
  name: String,
  email: String,
  zipCode: Number
});

// The model that can be used to create new Subscribers
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = mongoose.model('Subscriber', subscriberSchema);
