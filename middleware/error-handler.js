const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-api");
const UnauthenticatedError = require("../errors/unauthenticated");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Try again later",
  };

  if (err instanceof CustomAPIError || err instanceof UnauthenticatedError) {
    customError.msg = err.message;
    customError.statusCode = err.statusCode;
  } else if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.code && err.code === 11000) {
    customError.msg = `Duplicate field value entered for ${Object.keys(
      err.keyValue
    )} field. Please use another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  console.error(`${customError.statusCode}: ${customError.msg}`);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
