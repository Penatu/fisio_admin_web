import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"
import { formatAdminRole } from "@/pages/users/hooks/useGetAdminList"

function formatDateTime(value) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function mapAdminDetail(data) {
  return {
    code: data.code || "",
    name: data.name || "-",
    email: data.email || "-",
    role: formatAdminRole(data.role),
    status: data.isActive || "",
    lastActive: formatDateTime(data.lastActive),
    joinedAt: formatDateTime(data.joinAt),
    destVisited: Number(data.destVisited) || 0,
  }
}

export function useGetAdminDetail(code) {
  const { token } = useAuth()
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token || code == null || code === "") return

    const controller = new AbortController()
    let active = true

    async function loadDetail() {
      setIsLoading(true)
      setError("")
      setAdmin(null)

      try {
        const url = ENDPOINTS.GET_ADMIN_DETAIL.replace(":code", encodeURIComponent(code))
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        let body = null
        try {
          body = await response.json()
        } catch {
          body = null
        }

        if (!response.ok || !body?.success || !body?.data?.code) {
          throw new Error(body?.message || body?.messageTitle || "Admin tidak ditemukan.")
        }

        if (!active) return
        setAdmin(mapAdminDetail(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setAdmin(null)
        setError(err.message || "Gagal memuat detail admin.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadDetail()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, code])

  return { admin, isLoading, error }
}
