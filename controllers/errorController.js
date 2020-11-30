const httpStatus = require('http-status-codes');

/**
 * These exports have been refactored for readability below
 */
// exports.pageNotFoundError = (req, res) => {
//   let errorCode =  httpStatus.NOT_FOUND;
//   res.status(errorCode);
//   res.render("error", {
//     errorCode
//   });
// }

// exports.internalServerError = (error, req, res, next) => {
//   let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
//   console.log(`ERROR occured: ${error.stack}`);
//   res.status(errorCode);
//   res.send(`${errorCode} | Technical issues: Application thingy broken.`);
// }

module.exports = {
  internalServerError: (error, req, res, next) => {
    const errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.send(`${errorCode} | Technical issues: Application thingy broken.`);
  },

  pageNotFoundError: (req, res) => {
    const errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render('error', {
      errorCode
    });
  }
};
