import { useCallback, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

function errorMessage(body, fallback) {
  if (body?.message) return body.message
  if (body?.messageTitle) return body.messageTitle
  const data = body?.data
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const first = Object.values(data).flat().find(Boolean)
    if (first) return String(first)
  }
  return fallback
}

export function useCreatePayroll() {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const clearError = useCallback(() => setError(""), [])

  const createPayroll = async ({ payrollCodes, therapistCode, note }) => {
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(ENDPOINTS.PAYROLL_CREATE_PAYMENT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payrollCodes,
          therapistCode,
          note: note || "",
        }),
      })

      let body = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok || !body?.success) {
        throw new Error(errorMessage(body, "Gagal membuat payroll."))
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal membuat payroll."
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { createPayroll, isSubmitting, error, clearError }
}
