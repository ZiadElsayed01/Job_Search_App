export const errorHandlerMiddleware = (api) => {
  return (req, res, next) => {
    api(req, res, next).catch((error) => {
      console.log(`Error in ${req.url}`, error);
      return next(new Error(error.message, { cause: 500 }));
    });
  };
};
export const globalErrorHandler = (err, req, res, next) => {
  console.log(`Global error handler: ${err.message}`);
  return res
    .status(500)
    .json({ message: `Some thing went error`, err: err.message });
};
