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
  popularName: "-",
  popularBookings: 0,
  avgDuration: 0,
  avgPrice: 0,
}

function mapService(service) {
  const duration = Number(service.duration) || 0
  return {
    id: service.id,
    name: service.name || "-",
    category: service.category || "-",
    duration: service.durationFormatted || (duration ? `${duration} min` : "-"),
    durationMinutes: duration,
    price: service.priceFormatted || "-",
    priceValue: Number(service.price) || 0,
    bookings: Number(service.bookings) || 0,
    status: service.status || "",
  }
}

function summarize(services, total) {
  if (!services.length) {
    return { ...EMPTY_SUMMARY, total }
  }

  const popular = services.reduce((best, service) =>
    service.bookings > best.bookings ? service : best
  )
  const durationTotal = services.reduce((sum, service) => sum + service.durationMinutes, 0)
  const priceTotal = services.reduce((sum, service) => sum + service.priceValue, 0)

  return {
    total,
    active: services.filter((service) => service.status === "active").length,
    popularName: popular.name,
    popularBookings: popular.bookings,
    avgDuration: Math.round(durationTotal / services.length),
    avgPrice: Math.round(priceTotal / services.length),
  }
}

export function useGetServiceList() {
  const { token } = useAuth()
  const [services, setServices] = useState([])
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
    if (status) params.set("status", status)

    async function loadServices() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.GET_SERVICE_LIST}?${params.toString()}`, {
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
          throw new Error(body?.message || "Gagal memuat daftar layanan.")
        }

        if (!active) return
        const items = (body.data?.data || []).map(mapService)
        const nextPagination = {
          ...EMPTY_PAGINATION,
          ...(body.data?.pagination || {}),
        }
        setServices(items)
        if (!status && !debouncedSearch) {
          setSummary(summarize(items, nextPagination.total || items.length))
        }
        setPagination(nextPagination)
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setServices([])
        setSummary(EMPTY_SUMMARY)
        setPagination(EMPTY_PAGINATION)
        setError(err.message || "Gagal memuat daftar layanan.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadServices()

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
    services,
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
