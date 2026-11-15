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
  totalBookings: 0,
  new: 0,
  confirmed: 0,
  visit: 0,
  finished: 0,
  canceled: 0,
}

export function useGetBookingList() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [summary, setSummary] = useState(EMPTY_SUMMARY)
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
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
    if (status) params.set("status", status)
    if (paymentStatus) params.set("paymentStatus", paymentStatus)

    async function loadBookings() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.GET_BOOKING_LIST}?${params.toString()}`, {
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
          throw new Error(body?.message || "Gagal memuat daftar booking.")
        }

        if (!active) return
        setBookings(body.data?.bookings || [])
        if (!status && !paymentStatus) {
          setSummary({
            ...EMPTY_SUMMARY,
            ...(body.data?.summary || {}),
          })
        }
        setPagination({
          ...EMPTY_PAGINATION,
          ...(body.data?.pagination || {}),
        })
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setBookings([])
        setSummary(EMPTY_SUMMARY)
        setPagination(EMPTY_PAGINATION)
        setError(err.message || "Gagal memuat daftar booking.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadBookings()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, page, perPage, debouncedSearch, status, paymentStatus])

  const changeStatus = (value) => {
    setStatus(value)
    setPage(1)
  }

  const changePaymentStatus = (value) => {
    setPaymentStatus(value)
    setPage(1)
  }

  const changePerPage = (value) => {
    setPerPage(value)
    setPage(1)
  }

  return {
    bookings,
    summary,
    pagination,
    isLoading,
    error,
    search,
    status,
    paymentStatus,
    setSearch,
    setStatus: changeStatus,
    setPaymentStatus: changePaymentStatus,
    setPage,
    setPerPage: changePerPage,
  }
}
