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

const EMPTY_SUMMARY = {
  total: 0,
  active: 0,
  suspended: 0,
}

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

export function formatAdminRole(value) {
  const raw = String(value ?? "").trim()
  if (!raw) return "-"
  return raw
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function mapAdmin(item) {
  return {
    code: item.code || "",
    name: item.name || "-",
    email: item.email || "-",
    roleKey: item.roleKey || "",
    role: formatAdminRole(item.roleKey),
    status: item.statusKey || "",
    lastActive: formatDateTime(item.lastActive),
  }
}

export function useGetAdminList() {
  const { token } = useAuth()
  const [admins, setAdmins] = useState([])
  const [summary, setSummary] = useState(EMPTY_SUMMARY)
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [refreshKey, setRefreshKey] = useState(0)
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
    if (status) params.set("statusKey", status)

    async function loadAdmins() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.GET_ADMIN_LIST}?${params.toString()}`, {
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
          throw new Error(body?.message || body?.messageTitle || "Gagal memuat daftar admin.")
        }

        if (!active) return
        const rows = Array.isArray(body.data?.data) ? body.data.data.map(mapAdmin) : []
        setAdmins(rows)
        if (!debouncedSearch && !status && page === 1) {
          setSummary({
            total: Number(body.data?.pagination?.total) || rows.length,
            active: rows.filter((item) => item.status === "active").length,
            suspended: rows.filter((item) => item.status === "suspended").length,
          })
        }
        setPagination({
          ...EMPTY_PAGINATION,
          ...(body.data?.pagination || {}),
        })
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setAdmins([])
        setSummary(EMPTY_SUMMARY)
        setPagination(EMPTY_PAGINATION)
        setError(err.message || "Gagal memuat daftar admin.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadAdmins()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, page, perPage, debouncedSearch, status, refreshKey])

  const changeStatus = (value) => {
    setStatus(value)
    setPage(1)
  }

  const changePerPage = (value) => {
    setPerPage(value)
    setPage(1)
  }

  return {
    admins,
    summary,
    pagination,
    isLoading,
    error,
    search,
    status,
    setSearch,
    setStatus: changeStatus,
    setPage,
    setPerPage: changePerPage,
    reload: () => setRefreshKey((value) => value + 1),
  }
}
