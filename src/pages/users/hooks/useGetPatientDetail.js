import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

function text(value) {
  const trimmed = String(value ?? "").trim()
  return trimmed || ""
}

function formatDate(value) {
  if (!value) return ""
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatAmount(booking) {
  if (text(booking.amountFormatted)) return text(booking.amountFormatted)
  const amount = Number(booking.amount)
  if (!Number.isFinite(amount)) return ""
  return `Rp ${amount.toLocaleString("id-ID")}`
}

function mapMedicalRecords(records) {
  if (!Array.isArray(records)) return []

  const labels = {
    condition: "Kondisi",
    complaint: "Keluhan",
    diagnosis: "Diagnosis",
    notes: "Catatan",
    note: "Catatan",
    allergies: "Alergi",
    chronicConditions: "Kondisi Kronis",
    subjective: "Subjective",
    objective: "Objective",
    assessment: "Assessment",
    plan: "Plan",
  }

  return records.map((item, index) => {
    const source = item && typeof item === "object" ? item : { catatan: String(item ?? "") }
    const fields = Object.entries(source)
      .filter(([key, value]) => !["id", "code"].includes(key) && value !== null && value !== "")
      .map(([key, value]) => ({
        label: labels[key] || key,
        value: Array.isArray(value)
          ? value.filter(Boolean).join(", ")
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value),
      }))
      .filter((field) => field.value)

    return {
      id: source.code || source.id || index,
      fields,
    }
  })
}

function mapPatientDetail(data) {
  const bookings = Array.isArray(data.bookings) ? data.bookings : []
  const latest = [...bookings].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))[0]
  const addressLine = text(data.address)
  const location = [addressLine, text(data.city), text(data.province), text(data.kodepos)]
    .filter(Boolean)
    .join(", ")

  const history = bookings.map((booking) => ({
    id: booking.code || `${booking.date}-${booking.therapist}`,
    code: booking.code || "",
    date: formatDate(booking.date) || "-",
    time: text(booking.time),
    therapist: text(booking.therapist) || "-",
    therapistCode: booking.therapistCode || "",
    service: text(booking.service) || "-",
    city: text(booking.city),
    status: booking.orderStatus || "",
    paymentStatus: booking.paymentStatus || "",
    amount: formatAmount(booking) || "-",
  }))

  return {
    code: data.code || "",
    name: text(data.name) || "-",
    email: text(data.email) || "-",
    phone: text(data.phone) || "-",
    profile: text(data.profile),
    status: text(data.status),
    address: location || "-",
    addressLine: addressLine || "-",
    province: text(data.province),
    city: text(data.city),
    postalCode: text(data.kodepos),
    joinedAt: formatDate(data.joinedAt) || "-",
    lastActive: formatDate(data.lastActive) || "-",
    sessions: Number(data.totalSessions || 0),
    primaryTherapist: text(latest?.therapist) || "-",
    history,
    payments: history.map((booking) => ({
      id: booking.id,
      date: booking.date,
      code: booking.code || "-",
      status: booking.paymentStatus,
      amount: booking.amount,
    })),
    medicalRecords: mapMedicalRecords(data.medicalRecords),
  }
}

export function useGetPatientDetail(code) {
  const { token } = useAuth()
  const [patient, setPatient] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token || !code) return

    const controller = new AbortController()
    let active = true

    async function loadDetail() {
      setIsLoading(true)
      setError("")
      setPatient(null)

      try {
        const url = ENDPOINTS.USER_GET_DETAIL_PATIENT.replace(":code", encodeURIComponent(code))
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
          throw new Error(body?.message || "Pasien tidak ditemukan.")
        }

        if (!active) return
        setPatient(mapPatientDetail(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setPatient(null)
        setError(err.message || "Gagal memuat detail pasien.")
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

  return { patient, setPatient, isLoading, error }
}
