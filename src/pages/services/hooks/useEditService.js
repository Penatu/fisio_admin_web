import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

function numberValue(value) {
  const digits = String(value ?? "").replace(/\D/g, "")
  return digits ? Number(digits) : 0
}

export function useEditService() {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const editService = async (serviceId, form) => {
    setIsSubmitting(true)
    setError("")

    try {
      const url = ENDPOINTS.EDIT_SERVICE.replace(":serviceId", encodeURIComponent(serviceId))
      const response = await fetch(url, {
        method: "PUT",
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
          iD: Number(serviceId) || 0,
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
        throw new Error(body?.message || body?.messageTitle || "Gagal memperbarui layanan.")
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal memperbarui layanan."
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    editService,
    isSubmitting,
    error,
    clearError: () => setError(""),
  }
}
