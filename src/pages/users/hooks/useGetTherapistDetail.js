import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

const STATUS_MAP = {
  verified: "active",
  unverified: "inactive",
  innactive: "inactive",
  inactive: "inactive",
  active: "active",
  rejected: "rejected",
  declined: "rejected",
  "in review": "in_review",
  in_review: "in_review",
  pending: "in_review",
}

function mapStatus(status) {
  const key = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
  return STATUS_MAP[key] || STATUS_MAP[key.replace(/ /g, "_")] || ""
}

function normalizeScheduleDates(schedules) {
  if (!Array.isArray(schedules)) return []

  return schedules
    .map((item) => {
      if (typeof item === "string") return item.slice(0, 10)
      const value = item?.date || item?.scheduleDate || ""
      return String(value).slice(0, 10)
    })
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
}

function formatDate(value) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatPeriod(start, end) {
  if (start && end) return `${start} - ${end}`
  return start || end || ""
}

function formatBankAccount(data) {
  const account = [data.bankName, data.accNumber].filter(Boolean).join(" - ")
  if (data.accName && account) return `${account} a.n. ${data.accName}`
  return account || data.accName || ""
}

function documentLabel(url) {
  return url ? "Dokumen tersedia" : ""
}

export function mapTherapistDetail(data) {
  const address = data.address || {}
  const practiceLocations = address.practiceLocations || []
  const educationHistories = data.educationHistories || []
  const primaryEducation = educationHistories[0]

  return {
    code: data.therapistCode || "",
    onboardingCode: data.code || "",
    name: data.therapistName || "",
    email: data.therapistEmail || "",
    phone: data.therapistPhone || "",
    photo: data.therapistProfile || "",
    status: mapStatus(data.labeledStatus || data.latestStatus),
    declineNotes: data.latestReason || "",
    approvalByName: data.approvalByName || "",
    specialty: "",
    bio: "",
    gender: "",
    joinedAt: formatDate(data.createdAt),
    updatedAt: formatDate(data.updatedAt),
    licenseNumber: "",
    education: primaryEducation
      ? [primaryEducation.degree, primaryEducation.major, primaryEducation.institution]
          .filter(Boolean)
          .join(" · ")
      : "",
    languages: [],
    location: practiceLocations.filter(Boolean).join(", "),
    address: address.fullAddress || "",
    latitude: address.latitude ?? null,
    longitude: address.longitude ?? null,
    ktp: documentLabel(data.ktpDoc),
    ktpImage: data.ktpDoc || "",
    str: documentLabel(data.strDoc),
    strImage: data.strDoc || "",
    sip: documentLabel(data.sipDoc),
    sipImage: data.sipDoc || "",
    ijazah: documentLabel(data.ijazahDoc),
    ijazahImage: data.ijazahDoc || "",
    ukomCertificate: null,
    bankAccount: formatBankAccount(data),
    workHistory: (data.workHistories || []).map((item, index) => ({
      id: `work-${index}`,
      position: item.position || "-",
      company: item.workplace || "-",
      period: formatPeriod(item.startYear, item.endYear) || "-",
      description: item.description || "",
    })),
    educationHistory: educationHistories.map((item, index) => ({
      id: `edu-${index}`,
      degree: [item.degree, item.major].filter(Boolean).join(" · ") || "-",
      institution: item.institution || "-",
      period: formatPeriod(item.startYear, item.endYear) || "-",
      fileUrl: item.ijazah || "",
    })),
    trainings: (data.trainings || []).map((item, index) => ({
      id: `training-${index}`,
      name: item.name || "-",
      organizer: item.organizer || "-",
      year: item.year || "-",
      fileUrl: item.certificate || "",
    })),
    coverageAreas: practiceLocations.filter(Boolean),
    schedule: normalizeScheduleDates(data.schedules),
    services: [],
    history: [],
    reviews: [],
    completedSessions: null,
    totalPatients: null,
    rating: null,
    experience: "",
  }
}

export function useGetTherapistDetail(code) {
  const { token } = useAuth()
  const [therapist, setTherapist] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(code))
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token || !code) return

    const controller = new AbortController()
    let active = true

    async function loadDetail() {
      setIsLoading(true)
      setError("")
      setTherapist(null)

      try {
        const url = ENDPOINTS.USER_GET_DETAIL_THERAPIST.replace(
          ":code",
          encodeURIComponent(code)
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

        if (!response.ok || !body?.success || !body?.data) {
          throw new Error(body?.message || "Gagal memuat detail therapist.")
        }

        if (!active) return
        setTherapist(mapTherapistDetail(body.data))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setTherapist(null)
        setError(err.message || "Gagal memuat detail therapist.")
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

  return { therapist, setTherapist, isLoading, error }
}
