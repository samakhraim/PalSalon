import bcrypt from "bcrypt"

import { env } from "../config/env.js"

export const hashPassword = async (value) =>
  bcrypt.hash(value, env.bcryptSaltRounds)

export const comparePassword = async (value, hashedValue) =>
  bcrypt.compare(value, hashedValue)
