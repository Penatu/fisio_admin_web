import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

const API_STATUS = {
  active: "VERIFIED",
  rejected: "REJECTED",
}

export function useUpdateTherapistStatus() {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const updateStatus = async (therapistCode, { status, reason = "" }) => {
    const apiStatus = API_STATUS[status]
    if (!apiStatus) {
      const message = "Status hanya bisa diubah menjadi Active atau Rejected."
      setError(message)
      throw new Error(message)
    }

    const trimmedReason = reason.trim()
    if (apiStatus === "REJECTED" && !trimmedReason) {
      const message = "Alasan penolakan wajib diisi."
      setError(message)
      throw new Error(message)
    }

    setIsSubmitting(true)
    setError("")

    try {
      const url = ENDPOINTS.UPDATE_THERAPIST_STATUS.replace(
        ":therapistCode",
        encodeURIComponent(therapistCode)
      )
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: apiStatus,
          reason: apiStatus === "REJECTED" ? trimmedReason : "",
        }),
      })

      let body = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok || !body?.success) {
        throw new Error(body?.message || "Gagal memperbarui status therapist.")
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal memperbarui status therapist."
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
