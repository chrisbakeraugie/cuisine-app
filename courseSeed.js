const mongoose = require('mongoose')
const Course = require('./models/course')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb+srv://chrisbakerdev:12345pass@cuisineappcluster.a9aus.mongodb.net/CuisineAppCluster?retryWrites=true&w=majority',
  { useNewUrlParser: true }
)

Course.remove({})
  .then(() => {
    return Course.create({
      title: 'Beets sitting at home',
      description: 'Seasonal beets from the guy down the street.',
      zipCode: 12323,
      items: ['beets']
    })
  })
  .then(course => {
    console.log(course.title)
  }).then(() => {
    return (Course.create({
      title: 'Barley even listening',
      description: 'Organic wheats and barleys for bread, sou, and fun~',
      zipCode: 203325,
      items: ['barley', 'rye', 'wheat']
    }))
  }).then(() => {
    return (Course.create({
      title: 'Preaching to the choir',
      description: 'Get fresh peaches from the local farm.',
      zipCode: 10065,
      items: ['peaches', 'plums']
    }))
  }).then(course => {
    console.log(course.title)
  }).catch(error => {
    console.log(error.message)
  })
  .then(() => {
    console.log('DONE')
    mongoose.connection.close()
  });
