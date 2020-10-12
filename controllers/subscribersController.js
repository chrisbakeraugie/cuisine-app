const Subscriber = require('../models/subscriber');

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({})
    .exec()
    .then((subs) => {
      res.render("subscribers", {
        subscribers: subs
      });
    })
    .catch((error) => {
      console.log(error.message);
      return[];
    })
    .then(() => {
      console.log("Promise complete");
    });
}

exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
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