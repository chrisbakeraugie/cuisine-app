const Subscriber = require('../models/subscriber');

/**
 * These exports were rewritten for readability, below
 */
// exports.getAllSubscribers = (req, res, next) => {
//   Subscriber.find({})
//     .exec()
//     .then((subs) => {
//       res.render("subscribers", {
//         subscribers: subs
//       });
//     })
//     .catch((error) => {
//       console.log(error.message);
//       return[];
//     })
//     .then(() => {
//       console.log("Promise complete");
//     });
// }

// exports.getSubscriptionPage = (req, res) => {
//   res.render("contact");
// }

// exports.saveSubscriber = (req,res) => {
//   let newSubscriber = new Subscriber({
//     name: req.body.name,
//     email: req.body.email,
//     zipCode: req.body.zipCode
//   });
  
//   newSubscriber.save((error, result) => {
//     if (error){
//       res.send(error);
//     }
//     res.render("thanks");
//   })
// }

module.exports = {
  getAllSubscribers: (req, res, next) => {
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
  },

  getSubscriptionPage: (req, res) => {
    res.render("contact");
  },

  saveSubscriber: (req,res) => {
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
}