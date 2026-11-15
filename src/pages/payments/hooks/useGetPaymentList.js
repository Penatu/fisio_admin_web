import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"
import { paymentMethodLabel } from "@/lib/payments-data"

const DEFAULT_PER_PAGE = 10

const EMPTY_PAGINATION = {
  perPage: DEFAULT_PER_PAGE,
  total: 0,
  currentPage: 1,
  previousPage: 0,
  nextPage: 0,
}

const EMPTY_SUMMARY = {
  totalRevenueFormatted: "Rp 0",
  totalTransactions: 0,
  pendingAmountFormatted: "Rp 0",
  pendingCount: 0,
  unpaidAmountFormatted: "Rp 0",
  unpaidCount: 0,
  refundAmountFormatted: "Rp 0",
  refundCount: 0,
}

function formatDate(value) {
  if (!value) return "-"
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function mapPayment(payment) {
  return {
    code: payment.code || "",
    date: formatDate(payment.date),
    invoice: payment.invoice || "-",
    bookingCode: payment.bookingCode || "-",
    patient: payment.patient || "-",
    patientCode: payment.patientCode || "",
    method: payment.method || "",
    methodLabel: paymentMethodLabel(payment.method),
    amount: payment.amountFormatted || "-",
    status: payment.status || "",
  }
}

export function useGetPaymentList() {
  const { token } = useAuth()
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState(EMPTY_SUMMARY)
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState("")
  const [method, setMethod] = useState("")
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
    if (method) params.set("method", method)

    async function loadPayments() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.GET_PAYMENT_LIST}?${params.toString()}`, {
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
          throw new Error(body?.message || "Gagal memuat daftar pembayaran.")
        }

        if (!active) return
        setPayments((body.data?.payments || []).map(mapPayment))
        if (!status && !method) {
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
        setPayments([])
        setSummary(EMPTY_SUMMARY)
        setPagination(EMPTY_PAGINATION)
        setError(err.message || "Gagal memuat daftar pembayaran.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadPayments()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, page, perPage, debouncedSearch, status, method])

  const changeStatus = (value) => {
    setStatus(value)
    setPage(1)
  }

  const changeMethod = (value) => {
    setMethod(value)
    setPage(1)
  }

  const changePerPage = (value) => {
    setPerPage(value)
    setPage(1)
  }

  return {
    payments,
    summary,
    pagination,
    isLoading,
    error,
    search,
    status,
    method,
    setSearch,
    setStatus: changeStatus,
    setMethod: changeMethod,
    setPage,
    setPerPage: changePerPage,
  }
}
