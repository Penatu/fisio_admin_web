import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

function numberValue(value) {
  const digits = String(value ?? "").replace(/\D/g, "")
  return digits ? Number(digits) : 0
}

export function useCreateService() {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const createService = async (form) => {
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(ENDPOINTS.CREATE_SERVICE, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: Number(form.categoryId),
          commission: Number(form.therapistSharePct) || 0,
          description: String(form.description || "").trim(),
          duration: Number(form.duration),
          name: String(form.name || "").trim(),
          operationalCost: Number(form.operationalCost) || 0,
          price: numberValue(form.price),
          status: form.status || "active",
        }),
      })

      let body = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok || !body?.success) {
        throw new Error(body?.message || body?.messageTitle || "Gagal menambahkan layanan.")
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal menambahkan layanan."
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    createService,
    isSubmitting,
    error,
    clearError: () => setError(""),
  }
}
