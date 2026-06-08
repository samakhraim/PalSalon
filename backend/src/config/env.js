import dotenv from "dotenv"

dotenv.config({ quiet: true })

export const env = {
  port: Number(process.env.PORT) || 5000,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME || "palsalon_db",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD ?? "",
  jwtSecret: process.env.JWT_SECRET || "change_this_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
}
