import cors from "cors"
import express from "express"

import { env } from "./config/env.js"
import errorHandler from "./middlewares/error.middleware.js"
import routes from "./routes/index.js"

const app = express()

const allowedOrigins = [env.clientUrl].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      const error = new Error("Not allowed by CORS")
      error.statusCode = 403

      return callback(error)
    },
    credentials: true,
  })
)

app.use(express.json())
app.use("/api", routes)
app.use(errorHandler)

export default app
