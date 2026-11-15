import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

const ALLOWED_STATUS = new Set(["paid", "rejected"])

export function useUpdatePaymentStatus() {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const updateStatus = async (code, { status, note = "" }) => {
    if (!ALLOWED_STATUS.has(status)) {
      const message = "Status hanya bisa diubah menjadi Paid atau Rejected."
      setError(message)
      throw new Error(message)
    }

    setIsSubmitting(true)
    setError("")

    try {
      const url = ENDPOINTS.UPDATE_PAYMENT_STATUS.replace(":code", encodeURIComponent(code))
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          note: note.trim(),
          status,
        }),
      })

      let body = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok || !body?.success) {
        throw new Error(body?.message || body?.messageTitle || "Gagal memperbarui status pembayaran.")
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal memperbarui status pembayaran."
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    updateStatus,
    isSubmitting,
    error,
    clearError: () => setError(""),
  }
}
