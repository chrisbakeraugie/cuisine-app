/**
 * This file is for testing in the REPL environment.
 * It will load this file to save time importing all the
 * required files.
 *
 * To load this file, open the REPL environment and load it
 *
 *  .load repl.js
 */

const mongoose = require('mongoose')

const User = require('./models/user')

const Subscriber = require('./models/subscriber')

const Course = require('./models/course')


mongoose.connect('mongodb://localhost:27017/recipe_db', { useNewUrlParser: true })

mongoose.Promise = global.Promise
