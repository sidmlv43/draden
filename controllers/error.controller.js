module.exports = (err, req, res, next) => {
  const status = err.status;
  const message = err.message;
  const statusCode = err.statusCode || 500;

  console.log(err);

  return res.status(statusCode).json({
    status,
    message,
    error: err,
  });
};
