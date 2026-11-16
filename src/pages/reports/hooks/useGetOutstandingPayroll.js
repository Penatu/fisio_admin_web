import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"
import { formatPayrollAmount } from "@/lib/reports-data"

function firstDefined(item, keys) {
  for (const key of keys) {
    const value = item?.[key]
    if (value !== undefined && value !== null && value !== "") return value
  }
  return undefined
}

function parseAmount(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  const text = String(value || "").replace(/rp/i, "").trim().replace(/\s/g, "")
  if (!text) return 0
  if (/m$/i.test(text)) {
    const amount = Number(text.replace(/m$/i, "").replace(",", "."))
    return Number.isFinite(amount) ? amount * 1_000_000 : 0
  }
  const amount = Number(text.replace(/\./g, "").replace(",", "."))
  return Number.isFinite(amount) ? amount : 0
}

function displayAmount(value, numeric) {
  if (typeof value === "string" && value.trim()) return value
  return formatPayrollAmount(numeric)
}

function mapOutstandingItem(item, index) {
  if (typeof item === "string") {
    return {
      id: item,
      code: item,
      patient: "-",
      service: "-",
      date: "",
      time: "",
      payment: "",
      priceLabel: "",
      payoutValue: 0,
      payoutLabel: formatPayrollAmount(0),
      grossValue: 0,
    }
  }

  const code = String(
    firstDefined(item, ["payrollCode", "bookingCode", "code", "orderCode"]) || ""
  )
  const payoutRaw = firstDefined(item, [
    "payoutValue",
    "therapistEarning",
    "amountValue",
    "payout",
    "amount",
    "totalPayout",
  ])
  const payoutValue = parseAmount(payoutRaw)
  const grossRaw = firstDefined(item, ["priceValue", "grossValue", "servicePriceValue", "price"])
  const grossValue = parseAmount(grossRaw)
  const payoutLabel = firstDefined(item, [
    "payoutFormatted",
    "therapistEarningFormatted",
    "amountFormatted",
    "payout",
  ])
  const priceLabel = firstDefined(item, ["priceFormatted", "price", "grossFormatted"])

  return {
    id: code || `payroll-${index}`,
    code,
    patient: String(firstDefined(item, ["patient", "patientName"]) || "-"),
    service: String(firstDefined(item, ["service", "serviceName"]) || "-"),
    date: String(firstDefined(item, ["date", "bookingDate"]) || ""),
    time: String(firstDefined(item, ["time"]) || ""),
    payment: String(firstDefined(item, ["paymentStatus", "payment", "status"]) || ""),
    priceLabel: priceLabel ? displayAmount(priceLabel, grossValue) : "",
    payoutValue,
    payoutLabel: displayAmount(payoutLabel, payoutValue),
    grossValue,
  }
}

function extractList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.payrolls)) return data.payrolls
  if (Array.isArray(data?.bookings)) return data.bookings
  if (Array.isArray(data?.list)) return data.list
  return []
}

export function useGetOutstandingPayroll(therapistCode) {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token || !therapistCode) {
      setItems([])
      setError("")
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    let active = true
    const params = new URLSearchParams({ therapistCode })

    async function loadOutstanding() {
      setIsLoading(true)
      setError("")
      setItems([])

      try {
        const response = await fetch(
          `${ENDPOINTS.PAYROLL_GET_OUTSTANDING_PAYROLL_BY_THERAPIST}?${params.toString()}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        )

        let body = null
        try {
          body = await response.json()
        } catch {
          body = null
        }

        if (!response.ok || !body?.success) {
          throw new Error(body?.message || body?.messageTitle || "Gagal memuat tagihan belum dibayar.")
        }

        if (!active) return
        setItems(extractList(body.data).map(mapOutstandingItem).filter((item) => item.code))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setItems([])
        setError(err.message || "Gagal memuat tagihan belum dibayar.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadOutstanding()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, therapistCode])

  return { items, isLoading, error }
}
