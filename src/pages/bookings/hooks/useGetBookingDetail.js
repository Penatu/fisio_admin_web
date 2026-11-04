import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

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

function mapConsent(value) {
  if (!value) return null
  if (typeof value === "string") {
    return { name: "Informed consent", url: value }
  }
  const url = value.url || value.fileUrl || ""
  if (!url && !value.name) return null
  return { name: value.name || "Informed consent", url }
}

function mapPayment(payment) {
  if (!payment?.code) return null
  return {
    id: payment.code,
    code: payment.code,
    invoice: text(payment.invoice),
    method: text(payment.method),
    amount: text(payment.amount),
    status: payment.status || "",
    transactionId: text(payment.transactionId),
    paidAt: payment.paidAt ? formatDateTime(payment.paidAt) : "-",
    servicePrice: text(payment.servicePrice),
    adminFee: text(payment.adminFee),
  }
}

function mapBookingDetail(data) {
  const patient = data.patient || {}
  const therapist = data.therapist || {}
  const address = [data.address, data.detailAddress]
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join(", ")

  return {
    code: data.code || "",
    orderStatus: data.orderStatus || "",
    payment: data.paymentStatus || "",
    service: text(data.service),
    date: formatDate(data.date),
    time: text(data.time),
    duration: text(data.duration),
    price: text(data.price),
    address: text(address),
    notes: data.notes || "",
    complaint: data.complaint || "",
    informedConsent: mapConsent(data.informedConsent),
    treatmentReport: data.treatmentReport || null,
    patientCode: patient.code || "",
    patient: text(patient.name),
    patientPhone: text(patient.phone),
    patientEmail: text(patient.email),
    therapistCode: therapist.code || "",
    therapist: text(therapist.name),
    therapistPhone: text(therapist.phone),
    paymentDetail: mapPayment(data.payment),
    statusHistory: (data.statusHistory || []).map((item) => ({
      status: item.status || "",
      note: item.note || "",
      time: item.time ? formatDateTime(item.time) : "-",
    })),
  }
}

export function useGetBookingDetail(code) {
  const { token } = useAuth()
  const [booking, setBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token || !code) return

    const controller = new AbortController()
    let active = true

    async function loadDetail() {
      setIsLoading(true)
      setError("")
      setBooking(null)

      try {
        const url = ENDPOINTS.GET_BOOKING_DETAIL.replace(":code", encodeURIComponent(code))
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
          throw new Error(body?.message || "Booking tidak ditemukan.")
        }

        if (!active) return
        setBooking(mapBookingDetail(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setBooking(null)
        setError(err.message || "Gagal memuat detail booking.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadDetail()

    return () => {
      active = false
      controller.abort()
    }
  }, [token, code])

  return { booking, setBooking, isLoading, error }
}
