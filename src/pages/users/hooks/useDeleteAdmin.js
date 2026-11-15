import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

export function useDeleteAdmin() {
  const { token } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const deleteAdmin = async (code) => {
    setIsDeleting(true)
    setError("")

    try {
      const url = ENDPOINTS.DELETE_ADMIN.replace(":code", encodeURIComponent(code))
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
        throw new Error(body?.message || body?.messageTitle || "Gagal menghapus admin.")
      }

      return body.data
    } catch (err) {
      const message = err.message || "Gagal menghapus admin."
      setError(message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteAdmin,
    isDeleting,
    error,
    clearError: () => setError(""),
  }
}
