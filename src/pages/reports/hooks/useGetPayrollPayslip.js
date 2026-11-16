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

function mapPayslip(data) {
  const rows = Array.isArray(data?.data) ? data.data : []

  return {
    list: rows.map((item, index) => ({
      id: `${item.bookCode || "order"}-${index}`,
      code: item.bookCode || "-",
      city: item.cityName || "-",
      totalPayout: item.totalPayout || "Rp 0",
      paid: item.paid || "Rp 0",
      outstanding: item.outstanding || "Rp 0",
      paidAt: item.lastPayment || "",
      status: item.status || "",
    })),
    pagination: {
      perPage: Number(data?.pagination?.perPage) || DEFAULT_PER_PAGE,
      total: Number(data?.pagination?.total) || 0,
      currentPage: Number(data?.pagination?.currentPage) || 1,
      previousPage: Number(data?.pagination?.previousPage) || 0,
      nextPage: Number(data?.pagination?.nextPage) || 0,
    },
  }
}

export function useGetPayrollPayslip(therapistCode) {
  const { token } = useAuth()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState("")
  const [payrolls, setPayrolls] = useState([])
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const appliedSearch = useRef("")

  useEffect(() => {
    appliedSearch.current = ""
    setSearch("")
    setDebouncedSearch("")
    setStatus("")
    setPage(1)
    setPerPage(DEFAULT_PER_PAGE)
  }, [therapistCode])

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
    if (!token || !therapistCode) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    let active = true
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    })
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (status) params.set("status", status)
    const url = ENDPOINTS.DETAIL_PAYROLL_GET_PAYSLIP.replace(
      ":therapistCode",
      encodeURIComponent(therapistCode)
    )

    async function loadPayslip() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${url}?${params.toString()}`, {
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
          throw new Error(body?.message || body?.messageTitle || "Gagal memuat payslip.")
        }

        if (!active) return
        const mapped = mapPayslip(body.data)
        setPayrolls(mapped.list)
        setPagination(mapped.pagination)
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setPayrolls([])
        setPagination(EMPTY_PAGINATION)
        setError(err.message || "Gagal memuat payslip.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadPayslip()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, therapistCode, page, perPage, debouncedSearch, status])

  const changeStatus = (value) => {
    setStatus(value)
    setPage(1)
  }

  const changePerPage = (value) => {
    setPerPage(value)
    setPage(1)
  }

  return {
    payrolls,
    pagination,
    isLoading,
    error,
    search,
    status,
    setSearch,
    setStatus: changeStatus,
    setPage,
    setPerPage: changePerPage,
  }
}
