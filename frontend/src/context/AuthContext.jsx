import { createContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { logoutRequest } from "@/features/auth/authService"

const AuthContext = createContext(null)

const USER_STORAGE_KEY = "user"
const TOKEN_STORAGE_KEY = "accessToken"

const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))

  useEffect(() => {
    if (!token) {
      return
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  }, [token])

  useEffect(() => {
    if (!user) {
      return
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }, [user])

  const login = ({ user: nextUser, token: nextToken }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const logout = async () => {
    try {
      if (token) {
        await logoutRequest()
      }
    } catch {
      // Clear local auth state even if the backend logout response fails.
    } finally {
      clearAuth()
    }

    navigate("/login", { replace: true })
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
