// errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500);
  res.json({
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  });
};

export default errorHandler;
