import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  buildSessionUser,
  isTokenExpired,
} from "@/lib/auth-data"

const AuthContext = createContext(null)

function clearStoredSession() {
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

function readStoredSession() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const rawUser = localStorage.getItem(AUTH_USER_KEY)

  if (!token || !rawUser || isTokenExpired(token)) {
    clearStoredSession()
    return { user: null, token: null }
  }

  try {
    return { user: JSON.parse(rawUser), token }
  } catch {
    clearStoredSession()
    return { user: null, token: null }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = readStoredSession()
    setUser(session.user)
    setToken(session.token)
    setIsLoading(false)
  }, [])

  const setSession = useCallback((data) => {
    if (!data?.token) {
      throw new Error("Token tidak ditemukan.")
    }

    const sessionUser = buildSessionUser(data)
    setUser(sessionUser)
    setToken(data.token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser))
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    return sessionUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    clearStoredSession()
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      setSession,
      logout,
    }),
    [user, token, isLoading, setSession, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
