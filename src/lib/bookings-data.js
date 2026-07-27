export const ORDER_STATUS = {
  received_request: {
    label: "Received Request",
    description: "Request masuk",
    badge: "info",
    dot: "bg-blue-500",
  },
  ongoing: {
    label: "On Going",
    description: "Request diterima dan menunggu visit",
    badge: "warning",
    dot: "bg-amber-500",
  },
  done: {
    label: "Done",
    description: "Visit selesai",
    badge: "success",
    dot: "bg-emerald-500",
  },
  report: {
    label: "Report",
    description: "Informed consent diupload setelah selesai",
    badge: "success",
    dot: "bg-emerald-600",
  },
  canceled: {
    label: "Canceled",
    description: "Visit dibatalkan",
    badge: "destructive",
    dot: "bg-red-500",
  },
}

export const ORDER_STATUS_FLOW = ["received_request", "ongoing", "done", "report"]

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(
  ([value, cfg]) => ({ value, ...cfg })
)

export const bookings = [
  {
    id: 1,
    date: "Jul 24, 2026",
    time: "09:00",
    code: "BK-2026-001",
    paymentId: 1,
    patient: "Ahmad Rizki",
    patientId: 1,
    patientPhone: "+62 821-1111-2222",
    patientEmail: "ahmad.r@email.com",
    therapist: "Dr. Sari Wulandari",
    therapistId: 1,
    therapistPhone: "+62 812-3456-7890",
    service: "Home Visit",
    duration: "60 min",
    price: "Rp 350.000",
    location: "Jakarta Selatan",
    address: "Jl. Merdeka No. 12, Jakarta Selatan",
    status: "confirmed",
    payment: "paid",
    priceValue: 350000,
    therapistSharePct: 60,
    payrollPaid: false,
    orderStatus: "ongoing",
    notes: "Pasien meminta kunjungan pagi hari.",
    informedConsent: null,
    treatmentReport: null,
    statusHistory: [
      { status: "received_request", note: "Request booking masuk dari aplikasi.", time: "Jul 23, 2026 18:20" },
      { status: "ongoing", note: "Request diterima, therapist ditugaskan.", time: "Jul 23, 2026 19:05" },
    ],
  },
  {
    id: 2,
    date: "Jul 24, 2026",
    time: "10:30",
    code: "BK-2026-002",
    paymentId: 2,
    patient: "Budi Santoso",
    patientId: 2,
    patientPhone: "+62 822-2222-3333",
    patientEmail: "budi.s@email.com",
    therapist: "Dr. Andi Pratama",
    therapistId: 2,
    therapistPhone: "+62 813-4567-8901",
    service: "Sports Rehab",
    duration: "90 min",
    price: "Rp 450.000",
    location: "Jakarta Pusat",
    address: "Jl. Thamrin No. 8, Jakarta Pusat",
    status: "new",
    payment: "unpaid",
    priceValue: 450000,
    therapistSharePct: 65,
    payrollPaid: false,
    orderStatus: "received_request",
    notes: "",
    informedConsent: null,
    treatmentReport: null,
    statusHistory: [
      { status: "received_request", note: "Request booking masuk dari aplikasi.", time: "Jul 24, 2026 07:40" },
    ],
  },
  {
    id: 3,
    date: "Jul 24, 2026",
    time: "11:00",
    code: "BK-2026-003",
    paymentId: 3,
    patient: "Citra Dewi",
    patientId: 3,
    patientPhone: "+62 823-3333-4444",
    patientEmail: "citra.d@email.com",
    therapist: "Dr. Maya Sari",
    therapistId: 3,
    therapistPhone: "+62 814-5678-9012",
    service: "Post-Surgery",
    duration: "60 min",
    price: "Rp 500.000",
    location: "Surabaya",
    address: "Jl. Sudirman No. 88, Surabaya",
    status: "pending",
    payment: "unpaid",
    priceValue: 500000,
    therapistSharePct: 65,
    payrollPaid: false,
    orderStatus: "received_request",
    notes: "Menunggu konfirmasi pembayaran.",
    informedConsent: null,
    treatmentReport: null,
    statusHistory: [
      { status: "received_request", note: "Request booking masuk dari aplikasi.", time: "Jul 24, 2026 08:15" },
    ],
  },
  {
    id: 4,
    date: "Jul 24, 2026",
    time: "13:00",
    code: "BK-2026-004",
    paymentId: 4,
    patient: "Dewi Lestari",
    patientId: 4,
    patientPhone: "+62 824-4444-5555",
    patientEmail: "dewi.l@email.com",
    therapist: "Dr. Rudi Hartono",
    therapistId: 4,
    therapistPhone: "+62 815-6789-0123",
    service: "Manual Therapy",
    duration: "45 min",
    price: "Rp 300.000",
    location: "Bandung",
    address: "Jl. Gajah Mada No. 21, Bandung",
    status: "completed",
    payment: "paid",
    priceValue: 300000,
    therapistSharePct: 70,
    payrollPaid: false,
    orderStatus: "report",
    notes: "Visit selesai, informed consent telah diupload.",
    informedConsent: { name: "informed-consent-dewi.pdf", url: "https://placehold.co/1000x1414/e2e8f0/1e293b?text=Informed+Consent" },
    treatmentReport: {
      medicalRecordNumber: "RM-2026-01455",
      subjective: "Nyeri punggung bawah menjalar ke paha kanan, memberat saat duduk lama. Skala nyeri 6/10.",
      objective: "SLR test positif 45° kanan, tightness hamstring, nyeri tekan paravertebra L4-L5.",
      assessment: "Low back pain mekanik dengan iritasi radikuler ringan.",
      plan: "Mobilisasi lumbal, core stability exercise, edukasi postur duduk.",
      supportingExamination: "X-ray lumbosakral: tidak ada fraktur, mild disc space narrowing L4-L5.",
      evidenceBasedPractice: "Latihan stabilisasi lumbal dan edukasi aktivitas sesuai clinical guideline low back pain (NICE NG59).",
    },
    statusHistory: [
      { status: "received_request", note: "Request booking masuk dari aplikasi.", time: "Jul 23, 2026 14:00" },
      { status: "ongoing", note: "Request diterima, therapist ditugaskan.", time: "Jul 23, 2026 15:10" },
      { status: "done", note: "Visit selesai dilakukan.", time: "Jul 24, 2026 13:50" },
      { status: "report", note: "Informed consent diupload.", time: "Jul 24, 2026 14:05" },
    ],
  },
  {
    id: 5,
    date: "Jul 24, 2026",
    time: "14:30",
    code: "BK-2026-005",
    paymentId: 5,
    patient: "Eko Prasetyo",
    patientId: 5,
    patientPhone: "+62 825-5555-6666",
    patientEmail: "eko.p@email.com",
    therapist: "Dr. Sari Wulandari",
    therapistId: 1,
    therapistPhone: "+62 812-3456-7890",
    service: "Home Visit",
    duration: "60 min",
    price: "Rp 350.000",
    location: "Jakarta Barat",
    address: "Jl. Kebon Jeruk No. 3, Jakarta Barat",
    status: "cancelled",
    payment: "refunded",
    priceValue: 350000,
    therapistSharePct: 60,
    payrollPaid: false,
    orderStatus: "canceled",
    notes: "Pasien membatalkan karena ada keperluan mendadak.",
    informedConsent: null,
    treatmentReport: null,
    statusHistory: [
      { status: "received_request", note: "Request booking masuk dari aplikasi.", time: "Jul 23, 2026 20:00" },
      { status: "ongoing", note: "Request diterima, therapist ditugaskan.", time: "Jul 23, 2026 20:30" },
      { status: "canceled", note: "Dibatalkan oleh pasien.", time: "Jul 24, 2026 09:00" },
    ],
  },
  {
    id: 6,
    date: "Jul 25, 2026",
    time: "08:00",
    code: "BK-2026-006",
    paymentId: 6,
    patient: "Fitri Handayani",
    patientId: null,
    patientPhone: "+62 826-6666-7777",
    patientEmail: "fitri.h@email.com",
    therapist: "Dr. Linda Kusuma",
    therapistId: 5,
    therapistPhone: "+62 816-7890-1234",
    service: "Geriatric Care",
    duration: "60 min",
    price: "Rp 375.000",
    location: "Jakarta Timur",
    address: "Jl. Matraman No. 45, Jakarta Timur",
    status: "confirmed",
    payment: "paid",
    priceValue: 375000,
    therapistSharePct: 60,
    payrollPaid: false,
    orderStatus: "done",
    notes: "Visit selesai, menunggu upload informed consent.",
    informedConsent: null,
    treatmentReport: {
      medicalRecordNumber: "RM-2026-01640",
      subjective: "Lansia merasa tidak stabil saat berjalan, riwayat hampir jatuh 1 kali minggu lalu.",
      objective: "Berg Balance Scale 40/56, Timed Up and Go 15 detik, kelemahan otot tungkai ringan.",
      assessment: "Risiko jatuh sedang pada lansia dengan gangguan keseimbangan.",
      plan: "Latihan keseimbangan progresif, penguatan tungkai, edukasi modifikasi lingkungan rumah.",
      supportingExamination: "Tidak ada; penilaian Berg Balance Scale dan Timed Up and Go.",
      evidenceBasedPractice: "Multicomponent fall prevention exercise sesuai WHO dan Cochrane evidence untuk lansia berisiko jatuh.",
    },
    statusHistory: [
      { status: "received_request", note: "Request booking masuk dari aplikasi.", time: "Jul 24, 2026 10:00" },
      { status: "ongoing", note: "Request diterima, therapist ditugaskan.", time: "Jul 24, 2026 11:00" },
      { status: "done", note: "Visit selesai dilakukan.", time: "Jul 25, 2026 09:05" },
    ],
  },
]

export function getBookingById(id) {
  return bookings.find((b) => String(b.id) === String(id))
}

/** Bookings that are still unpaid to the therapist (eligible for payroll). */
export function getUnpaidPayrollBookings(therapistId) {
  return bookings.filter((b) => {
    if (b.payrollPaid) return false
    if (b.payment === "refunded" || b.orderStatus === "canceled") return false
    if (therapistId && String(b.therapistId) !== String(therapistId)) return false
    return true
  })
}

export function parsePriceValue(booking) {
  if (booking.priceValue) return booking.priceValue
  return Number(String(booking.price || "").replace(/\D/g, "")) || 0
}

export function getTherapistPayout(booking) {
  const price = parsePriceValue(booking)
  const share = booking.therapistSharePct || 60
  return Math.round((price * share) / 100)
}

export function markBookingsPayrollPaid(bookingIds) {
  bookingIds.forEach((id) => {
    const booking = getBookingById(id)
    if (booking) booking.payrollPaid = true
  })
}

export function updateBookingStatus(id, { orderStatus, note, informedConsent, treatmentReport }) {
  const booking = getBookingById(id)
  if (!booking) return null

  booking.orderStatus = orderStatus
  if (informedConsent) {
    booking.informedConsent = informedConsent
  }
  if (treatmentReport) {
    booking.treatmentReport = treatmentReport
  }
  if (note) {
    booking.notes = note
  }

  booking.statusHistory = [
    ...(booking.statusHistory || []),
    {
      status: orderStatus,
      note: note || ORDER_STATUS[orderStatus]?.description || "",
      time: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    },
  ]

  return booking
}
