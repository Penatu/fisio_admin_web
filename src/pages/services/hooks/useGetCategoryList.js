import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

export function useGetCategoryList(enabled = true) {
  const { token } = useAuth()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!enabled || !token) return

    const controller = new AbortController()
    let active = true

    async function loadCategories() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(ENDPOINTS.GET_CATEGORY_LIST, {
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

        if (!response.ok || !body?.success) {
          throw new Error(body?.message || "Gagal memuat daftar kategori.")
        }

        if (!active) return
        const list = Array.isArray(body.data) ? body.data : []
        setCategories(
          list.map((item) => ({
            id: item.id,
            name: item.name || "-",
          }))
        )
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setCategories([])
        setError(err.message || "Gagal memuat daftar kategori.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadCategories()

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, token])

  return { categories, isLoading, error }
}
