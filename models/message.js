const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  user: { // Require User id with each message
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)
