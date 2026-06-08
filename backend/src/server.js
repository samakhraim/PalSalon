import app from "./app.js"
import { connectDb } from "./config/db.js"
import { env } from "./config/env.js"

const logDatabaseError = (error) => {
  const connectionCode =
    error?.original?.code || error?.parent?.code || error?.code || "UNKNOWN"

  console.error("Failed to start server:", error)
  console.error(
    `Database connection target: mysql://${env.dbUser}@${env.dbHost}:${env.dbPort}/${env.dbName}`
  )

  if (connectionCode === "ECONNREFUSED") {
    console.error(
      "MySQL refused the connection. Make sure the MySQL service is running and listening on the configured host/port."
    )
  }
}

const startServer = async () => {
  try {
    await connectDb()
    console.log("Database connected successfully")

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`)
    })
  } catch (error) {
    logDatabaseError(error)
    process.exit(1)
  }
}

startServer()
