// A little courses placeholder (to mock-up coruses view)
var courses = [
  {
    title: 'Event Driven Cakes',
    cost: 50
  },
  {
    title: 'Asynchronous Artichoke',
    cost: 25
  },
  {
    title: 'Object Oriented Orange Juice',
    cost: 10
  }
];

// !!! Express.js will find the views you are referencing in the render statement
exports.showCourses = (req, res) => {
  res.render('courses', {
    offeredCourses: courses
  });
}
exports.showSignUp = (req,res) => {
  res.render('contact');
}
exports.postedSignUpForm = (req,res) => {
  res.render('thanks');
}