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

/*
  These exports have been refactored below to make the file more readable
*/
// exports.showCourses = (req, res) => {
//   res.render('courses', {
//     offeredCourses: courses
//   });
// }
// exports.showSignUp = (req,res) => {
//   res.render('contact');
// }
// exports.postedSignUpForm = (req,res) => {
//   res.render('thanks');
// }

// !!! Express.js will find the views you are referencing in the render statement

module.exports = {
  showCourses: (req, res) => {
    res.render('courses', {
      offeredCourses: courses
    });
  },

  showSignUp: (req,res) => {
    res.render('contact');
  },

  postedSignUpForm: (req,res) => {
    res.render('thanks');
  }



}