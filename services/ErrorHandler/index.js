const {statusCodes} = require('../../utilities');

const ErrorHandler = function(){
  return function(error, req, res, next) {
    let message = '';

    console.log(error);
    if (error.name === 'UnauthorizedError') {
      return res.status(statusCodes.badRequest).json({
        statusCode: statusCodes.badRequest,
        message: 'INVALID TOKEN'
      })
    } else if (error.name == 'Input Validation Error') {
      return res.status(statusCodes.badRequest).json({
        statusCode: statusCodes.badRequest,
        validationErrors: error.errors,
        message: 'Input Validation Failed'
      })
    } else if (error.name === 'CastError') {
      message = 'Please provide a valid ObjectID'
    } else if (error.name === 'ValidationError') {
      message = error.message
    } else if (error.code === 11000) {
      message = 'The resource already exists';
    } else {
      console.log(error);
      return res.status(statusCodes.internalServerError).json({
        statusCode: statusCodes.internalServerError,
        message: 'Request failed.'
      })
    }

    return res.status(statusCodes.badRequest).json({
      statusCode: statusCodes.badRequest,
      message: message
    })
  }
}

module.exports = ErrorHandler