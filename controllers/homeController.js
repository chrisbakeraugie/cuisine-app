
module.exports = {

  showSignUp: (req, res) => {
    res.render('contact')
  },

  postedSignUpForm: (req, res) => {
    res.render('thanks')
  },

  chat: (req, res) => {
    res.render('chat')
  }
}
