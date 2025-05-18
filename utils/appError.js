class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // like calling Error(mess) cxonstructor)
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // this does not pollute the stack trace
  }
}

module.exports = AppError;
