/**
 * This includes a routes object that maps to GET requests
 * through the get function, and POST requests through
 * the post function. The handle function is refered to as the 
 * callback function to createServer in main.js.
 */
const httpStatus = require('http-status-codes');
const contentType = require('./contentTypes');
const utils = require('./utils');

// Routes object to hold route functions
const routes = {
  'GET': {},
  'POST': {}
};

// Handlers to handle requests
exports.handle = (req,res) => {
  try {
    routes[req.method][req.url](req, res);
  } catch (error) {
    res.writeHead(httpStatus.OK, contentType.html);
    utils.getFile('views/error.html', res);
    }
};

// GET and POST functions to map route functions
exports.get = (url, action) => {
  routes['GET'][url] = action;
};
exports.post = (url, action) => {
  routes['POST'][url] = action;
};