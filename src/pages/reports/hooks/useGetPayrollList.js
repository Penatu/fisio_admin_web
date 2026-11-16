import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

function toQueryDate(date) {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function mapPayrollList(data) {
  const rows = Array.isArray(data?.list) ? data.list : []

  return {
    metrics: Array.isArray(data?.metrics) ? data.metrics : [],
    list: rows.map((item) => ({
      id: item.therapistCode || String(item.therapistId ?? ""),
      name: item.therapistName || "-",
      city: item.cityName || "-",
      totalPayout: item.totalPayout || "Rp 0",
      totalSessions: Number(item.totalSessions) || 0,
      paid: item.paid || "Rp 0",
      paidSessions: Number(item.paidSessions) || 0,
      outstanding: item.outstanding || "Rp 0",
      outstandingSessions: Number(item.outstandingSessions) || 0,
      lastPayment: item.lastPayment || "",
      status: item.status || "",
    })),
  }
}

export function useGetPayrollList(range) {
  const { token } = useAuth()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [requestId, setRequestId] = useState(0)
  const periodStart = toQueryDate(range?.start)
  const periodEnd = toQueryDate(range?.end)

  const reload = useCallback(() => {
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!token || !periodStart || !periodEnd) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    let active = true
    const params = new URLSearchParams({ periodStart, periodEnd })

    async function loadPayroll() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.PAYROLL_LIST}?${params.toString()}`, {
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
          throw new Error(body?.message || body?.messageTitle || "Gagal memuat laporan payroll.")
        }

        if (!active) return
        setReport(mapPayrollList(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setReport(null)
        setError(err.message || "Gagal memuat laporan payroll.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadPayroll()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, periodStart, periodEnd, requestId])

  return { report, isLoading, error, reload }
}
