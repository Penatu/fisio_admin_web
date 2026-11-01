import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

async function requestAdminLogin(email, password) {
  let response

  try {
    response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    })
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Anda.")
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok || !body?.success || !body?.data?.token) {
    throw new Error(body?.message || "Email atau password salah.")
  }

  return body.data
}

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const login = async (email, password) => {
    setError("")
    setIsSubmitting(true)

    try {
      const data = await requestAdminLogin(email, password)
      setSession(data)
      const from = location.state?.from?.pathname || "/"
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || "Login gagal. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return { login, isSubmitting, error, clearError: () => setError("") }
}
