import { errorResponse } from "../utils/apiResponse.js"

export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return errorResponse(res, {
      statusCode: 409,
      message: "Email already exists",
    })
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid or expired token",
    })
  }

  return errorResponse(res, {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal server error",
    errors: err.errors,
  })
}
