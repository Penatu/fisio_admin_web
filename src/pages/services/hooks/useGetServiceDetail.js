import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"
import { computeProfit, formatRupiah } from "@/lib/services-data"

function mapServiceDetail(data) {
  const priceValue = Number(data.price) || 0
  const bookings = Number(data.bookings) || 0
  const therapistSharePct = Number(data.therapistSharePct) || 0
  const operationalCost = Number(data.operationalCost) || 0
  const base = {
    id: data.id,
    name: data.name || "-",
    category: data.category || "-",
    categoryId: data.categoryId ?? "",
    description: data.description || "",
    duration: data.durationFormatted || (data.duration ? `${data.duration} min` : "-"),
    price: data.priceFormatted || formatRupiah(priceValue),
    priceValue,
    bookings,
    status: data.status || "",
    therapistSharePct,
    operationalCost,
  }
  const profit = data.profit
    ? {
        price: Number(data.profit.price) || priceValue,
        therapistSharePct: Number(data.profit.therapistSharePct) || therapistSharePct,
        platformSharePct: Number(data.profit.platformSharePct) || 100 - therapistSharePct,
        therapistEarning: Number(data.profit.therapistEarning) || 0,
        platformGross: Number(data.profit.platformGross) || 0,
        operationalCost: Number(data.profit.operationalCost) || operationalCost,
        netProfit: Number(data.profit.netProfit) || 0,
        marginPct: Number(data.profit.marginPct) || 0,
      }
    : computeProfit(base)

  return {
    ...base,
    profit,
    totalEstimatedProfitFormatted:
      data.totalEstimatedProfitFormatted || formatRupiah(profit.netProfit * bookings),
  }
}

export function useGetServiceDetail(serviceId) {
  const { token } = useAuth()
  const [service, setService] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const loadedId = useRef("")

  useEffect(() => {
    if (!token || serviceId == null || serviceId === "") return

    const controller = new AbortController()
    let active = true
    const replaceService = loadedId.current !== String(serviceId)
    loadedId.current = String(serviceId)

    async function loadDetail() {
      setIsLoading(true)
      setError("")
      if (replaceService) setService(null)

      try {
        const url = ENDPOINTS.GET_SERVICE_DETAIL.replace(
          ":serviceId",
          encodeURIComponent(serviceId)
        )
        const response = await fetch(url, {
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

        if (!response.ok || !body?.success || body?.data?.id == null) {
          throw new Error(body?.message || "Layanan tidak ditemukan.")
        }

        if (!active) return
        setService(mapServiceDetail(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setService((current) => (String(current?.id) === String(serviceId) ? current : null))
        setError(err.message || "Gagal memuat detail layanan.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadDetail()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, serviceId, refreshKey])

  return {
    service,
    setService,
    isLoading,
    error,
    reload: () => setRefreshKey((value) => value + 1),
  }
}
