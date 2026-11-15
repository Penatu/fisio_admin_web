import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

const EMPTY_SUMMARY = {
  totalBookings: 0,
  bookingsToday: 0,
  bookingsTrend: 0,
  bookingsTrendLabel: "",
  activeTherapists: 0,
  availableTherapists: 0,
  availableTherapistsLabel: "",
  registeredPatients: 0,
  newPatientsThisMonth: 0,
  patientsTrend: 0,
  patientsTrendLabel: "",
  revenueThisMonth: 0,
  revenueThisMonthFormatted: "Rp 0",
  revenueTrend: 0,
  revenueTrendLabel: "",
}

export function useGetDashboardSummary() {
  const { token } = useAuth()
  const [summary, setSummary] = useState(EMPTY_SUMMARY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return

    const controller = new AbortController()
    let active = true

    async function loadSummary() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(ENDPOINTS.GET_DASHBOARD_SUMMARY, {
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
          throw new Error(body?.message || body?.messageTitle || "Gagal memuat ringkasan dashboard.")
        }

        if (!active) return
        setSummary({
          ...EMPTY_SUMMARY,
          ...(body.data || {}),
        })
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setSummary(EMPTY_SUMMARY)
        setError(err.message || "Gagal memuat ringkasan dashboard.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadSummary()

    return () => {
      active = false
      controller.abort()
    }
  }, [token])

  return { summary, isLoading, error }
}
