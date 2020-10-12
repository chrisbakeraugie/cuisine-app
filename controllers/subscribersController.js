const Subscriber = require('../models/subscriber');

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({}, (error, subscribers) => {
    if (error) {
      next(error); // Pass an error to the next middleware function
    }
    req.data = subscribers;
    next(); // Continues to next middleware function
  })
}

exports.saveSubscriber = (req,res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });
  
  newSubscriber.save((error, result) => {
    if (error){
      res.send(error);
    }
    res.render("thanks");
  })
}