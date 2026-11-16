import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

function toQueryDate(date) {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function mapOccupancyReport(data) {
  const chart = data?.chart || {}
  const cityChart = data?.cityChart || {}
  const cityLabels = Array.isArray(cityChart.labels) ? cityChart.labels : []
  const cityValues = Array.isArray(cityChart.values) ? cityChart.values : []

  return {
    metrics: Array.isArray(data?.metrics) ? data.metrics : [],
    chart: {
      labels: Array.isArray(chart.labels) ? chart.labels : [],
      current: Array.isArray(chart.values) ? chart.values : [],
      previous: [],
      unit: chart.unit || "",
    },
    cities: cityLabels.map((city, index) => ({
      id: city?.cityId ?? index,
      name: city?.cityName || "-",
      value: cityValues[index] ?? 0,
    })),
    cityUnit: cityChart.unit || "",
  }
}

export function useGetOccupancyReport(range, chartPeriodType) {
  const { token } = useAuth()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const periodStart = toQueryDate(range?.start)
  const periodEnd = toQueryDate(range?.end)

  useEffect(() => {
    if (!token || !periodStart || !periodEnd) return

    const controller = new AbortController()
    let active = true

    const params = new URLSearchParams({
      periodStart,
      periodEnd,
      chartPeriodType: chartPeriodType || "day",
    })

    async function loadReport() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(`${ENDPOINTS.GER_REPORTS_OCCUPANCY}?${params.toString()}`, {
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
          throw new Error(body?.message || body?.messageTitle || "Gagal memuat laporan occupancy.")
        }

        if (!active) return
        setReport(mapOccupancyReport(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setReport(null)
        setError(err.message || "Gagal memuat laporan occupancy.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadReport()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, periodStart, periodEnd, chartPeriodType])

  return { report, isLoading, error }
}
