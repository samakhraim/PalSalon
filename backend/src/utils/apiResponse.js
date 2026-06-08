export const successResponse = (
  res,
  { statusCode = 200, message = "Success", data = null } = {}
) => {
  const payload = {
    success: true,
    message,
  }

  if (data !== null) {
    payload.data = data
  }

  return res.status(statusCode).json(payload)
}

export const errorResponse = (
  res,
  { statusCode = 500, message = "Something went wrong", errors } = {}
) => {
  const payload = {
    success: false,
    message,
  }

  if (errors) {
    payload.errors = errors
  }

  return res.status(statusCode).json(payload)
}
