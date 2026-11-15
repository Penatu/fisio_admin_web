import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"
import { paymentMethodLabel } from "@/lib/payments-data"

function text(value) {
  const trimmed = String(value ?? "").trim()
  return trimmed || "-"
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

function formatDateTime(value) {
  if (!value) return "-"
  const [datePart, timePart = ""] = String(value).trim().split(/\s+/)
  const date = formatDate(datePart)
  return timePart ? `${date} ${timePart}` : date
}

function fileUrl(value) {
  const raw = String(value || "").trim()
  if (!raw) return ""
  if (/^https?:\/\//i.test(raw)) return raw
  return `${ENDPOINTS.GET_FILE}?name=${encodeURIComponent(raw)}`
}

function mapTransferProof(proof) {
  if (!proof?.url && !proof?.name) return null
  return {
    name: proof.name || "Bukti transfer",
    uploadedAt: proof.uploadedAt ? formatDateTime(proof.uploadedAt) : "-",
    image: fileUrl(proof.url),
  }
}

function mapPaymentDetail(data) {
  const booking = data.booking || {}
  const breakdown = data.breakdown || {}

  return {
    code: data.code || "",
    invoice: text(data.invoice),
    status: data.status || "",
    method: data.method || "",
    methodLabel: paymentMethodLabel(data.method),
    date: formatDate(data.date),
    amount: text(data.amountFormatted),
    transactionId: text(data.transactionId),
    paidAt: data.paidAt ? formatDateTime(data.paidAt) : "-",
    notes: data.notes || "",
    bankName: text(data.bankName),
    bankCode: text(data.bankCode),
    accountNumber: text(data.accountNumber),
    accountName: text(data.accountName),
    bookingCode: booking.code || "",
    service: text(booking.service),
    bookingDate: formatDate(booking.date),
    bookingTime: text(booking.time),
    patientCode: booking.patientCode || "",
    patient: text(booking.patient),
    servicePrice: text(breakdown.servicePriceFormatted),
    adminFee: text(breakdown.adminFeeFormatted),
    transferProof: mapTransferProof(data.transferProof),
  }
}

export function useGetPaymentDetail(code) {
  const { token } = useAuth()
  const [payment, setPayment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const loadedCode = useRef("")

  useEffect(() => {
    if (!token || !code) return

    const controller = new AbortController()
    let active = true
    const replacePayment = loadedCode.current !== code
    loadedCode.current = code

    async function loadDetail() {
      setIsLoading(true)
      setError("")
      if (replacePayment) setPayment(null)

      try {
        const url = ENDPOINTS.GET_PAYMENT_DETAIL.replace(":code", encodeURIComponent(code))
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

        if (!response.ok || !body?.success || !body?.data?.code) {
          throw new Error(body?.message || "Pembayaran tidak ditemukan.")
        }

        if (!active) return
        setPayment(mapPaymentDetail(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setPayment((current) => (current?.code === code ? current : null))
        setError(err.message || "Gagal memuat detail pembayaran.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadDetail()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, code, refreshKey])

  return {
    payment,
    setPayment,
    isLoading,
    error,
    reload: () => setRefreshKey((value) => value + 1),
  }
}
