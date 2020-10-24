const mongoose = require('mongoose');

// Define the Subscriber schema
const subscriberSchema = mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  zipCode: {
    type: Number,
    min: [00501, "Zip code too short"],
    max: [99999, "Zi[ code too long"]
  }
});


subscriberSchema.methods.getInfo = function() {
  return (`Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`);
};

subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber").find({zipCode: this.zipCode}).exec();
};

// The model that can be used to create new Subscribers
const Subscriber = mongoose.model('Subscriber', subscriberSchema);



module.exports = mongoose.model('Subscriber', subscriberSchema);
