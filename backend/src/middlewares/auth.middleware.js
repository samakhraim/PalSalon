import { User } from "../models/index.js"
import { verifyToken } from "../utils/generateToken.js"

export default async function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization || ""
    const [scheme, token] = authorization.split(" ")

    if (scheme !== "Bearer" || !token) {
      const error = new Error("Authorization token is required")
      error.statusCode = 401
      throw error
    }

    const payload = verifyToken(token)
    const user = await User.findByPk(payload.sub)

    if (!user) {
      const error = new Error("User not found")
      error.statusCode = 401
      throw error
    }

    req.user = user.toSafeJSON()
    req.auth = payload

    return next()
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401
    }

    return next(error)
  }
}
