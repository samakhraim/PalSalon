import { sequelize } from "../config/db.js"
import { env } from "../config/env.js"

const target = `mysql://${env.dbUser}@${env.dbHost}:${env.dbPort}/${env.dbName}`

try {
  await sequelize.authenticate()
  console.log(`Database connection successful: ${target}`)
  process.exit(0)
} catch (error) {
  const connectionCode =
    error?.original?.code || error?.parent?.code || error?.code || "UNKNOWN"

  console.error(`Database connection failed: ${target}`)
  console.error("Connection code:", connectionCode)
  console.error(error)

  if (connectionCode === "ECONNREFUSED") {
    console.error(
      "MySQL is not accepting connections. Start the MySQL service or verify the configured port."
    )
  }

  process.exit(1)
} finally {
  await sequelize.close().catch(() => {})
}
