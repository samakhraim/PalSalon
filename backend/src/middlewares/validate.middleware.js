export default function validateMiddleware(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })

    if (!result.success) {
      const error = new Error("Validation failed")
      error.statusCode = 400
      error.errors = result.error.flatten()
      return next(error)
    }

    if (result.data.body) {
      req.body = result.data.body
    }

    if (result.data.params) {
      req.params = result.data.params
    }

    if (result.data.query) {
      req.query = result.data.query
    }

    return next()
  }
}
