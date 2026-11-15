import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

export function useCreateAdmin() {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const createAdmin = async (form) => {
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(ENDPOINTS.CREATE_ADMIN, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: String(form.fullName || "").trim(),
          email: String(form.email || "").trim(),
          password: String(form.password || ""),
        }),
      })

      let body = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok || !body?.success) {
        throw new Error(body?.message || body?.messageTitle || "Gagal menambahkan admin.")
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal menambahkan admin."
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    createAdmin,
    isSubmitting,
    error,
    clearError: () => setError(""),
  }
}
