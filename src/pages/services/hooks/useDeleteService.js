import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

export function useDeleteService() {
  const { token } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const deleteService = async (serviceId) => {
    setIsDeleting(true)
    setError("")

    try {
      const url = ENDPOINTS.DELETE_SERVICE.replace(":serviceId", encodeURIComponent(serviceId))
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      let body = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok || !body?.success) {
        throw new Error(body?.message || body?.messageTitle || "Gagal menghapus layanan.")
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal menghapus layanan."
      setError(message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteService,
    isDeleting,
    error,
    clearError: () => setError(""),
  }
}
