import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { AUTH_STORAGE_KEY, validateCredentials } from "@/lib/auth-data"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    const authenticatedUser = validateCredentials(email, password)
    if (!authenticatedUser) {
      throw new Error("Email atau password salah.")
    }

    setUser(authenticatedUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser))
    return authenticatedUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, isLoading]
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
