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

export function useGetPatientList() {
  const { token } = useAuth()
  const [patients, setPatients] = useState([])
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [totalPatients, setTotalPatients] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
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

    async function loadPatients() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.USER_GETT_PATIENT_LIST}?${params.toString()}`, {
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
          throw new Error(body?.message || "Gagal memuat daftar pasien.")
        }

        if (!active) return
        const nextPagination = {
          ...EMPTY_PAGINATION,
          ...(body.data?.pagination || {}),
        }
        setPatients(body.data?.data || [])
        setPagination(nextPagination)
        if (!debouncedSearch) setTotalPatients(nextPagination.total || 0)
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setPatients([])
        setPagination(EMPTY_PAGINATION)
        if (!debouncedSearch) setTotalPatients(0)
        setError(err.message || "Gagal memuat daftar pasien.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadPatients()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, page, perPage, debouncedSearch])

  const changePerPage = (value) => {
    setPerPage(value)
    setPage(1)
  }

  return {
    patients,
    totalPatients,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    setPage,
    setPerPage: changePerPage,
  }
}
