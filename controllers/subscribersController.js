const Subscriber = require('../models/subscriber')

module.exports = {
  getAllSubscribers: (req, res, next) => {
    Subscriber.find({})
      .exec()
      .then((subs) => {
        res.render('subscribers', {
          subscribers: subs
        })
      })
      .catch((error) => {
        console.log(error.message)
        return []
      })
      .then(() => {
        console.log('Promise complete')
      })
  },

  getSubscriptionPage: (req, res) => {
    res.render('contact')
  },

  saveSubscriber: (req, res) => {
    const newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    })

    newSubscriber.save((error, result) => {
      if (error) {
        res.send(error)
      }
      res.render('thanks')
    })
  }
}
