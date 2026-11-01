import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

const DEFAULT_PER_PAGE = 10

const EMPTY_PAGINATION = {
  perPage: DEFAULT_PER_PAGE,
  total: 0,
  currentPage: 1,
  previousPage: 0,
  nextPage: 0,
}

export function useGetTherapist() {
  const { token } = useAuth()
  const [therapists, setTherapists] = useState([])
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [latestStatus, setLatestStatus] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const appliedSearch = useRef("")

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = search.trim()
      if (appliedSearch.current === nextSearch) return
      appliedSearch.current = nextSearch
      setDebouncedSearch(nextSearch)
      setPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!token) return

    const controller = new AbortController()
    let active = true

    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    })
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (latestStatus) params.set("latestStatus", latestStatus)

    async function loadTherapists() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.USERS_GET_THERAPISTS_LIST}?${params.toString()}`, {
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
          throw new Error(body?.message || "Gagal memuat daftar therapist.")
        }

        if (!active) return
        setTherapists(body.data?.data || [])
        setPagination({
          ...EMPTY_PAGINATION,
          ...(body.data?.pagination || {}),
        })
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setTherapists([])
        setPagination(EMPTY_PAGINATION)
        setError(err.message || "Gagal memuat daftar therapist.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadTherapists()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, page, perPage, debouncedSearch, latestStatus])

  const changeStatus = (value) => {
    setLatestStatus(value)
    setPage(1)
  }

  const changePerPage = (value) => {
    setPerPage(value)
    setPage(1)
  }

  return {
    therapists,
    pagination,
    isLoading,
    error,
    search,
    latestStatus,
    setSearch,
    setLatestStatus: changeStatus,
    setPage,
    setPerPage: changePerPage,
  }
}
