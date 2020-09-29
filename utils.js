/**
 * This file exports the getFile function.
 * This function looks for a file at the provided path. If 
 * a file doesn't exist, it will quickly return an error page.
 */
const fs = require('fs');
const httpStatus = require('http-status-codes');
const contentTypes = require('./contentTypes');


module.exports = {
  getFile: (file, res) => {
    fs.readFile(`./${file}`, (error, data) => {
      if (error) {
        res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html);
        // res.end('There was an error serving the content');
      }
      res.end(data); // This line is not working?
    });
  }
}