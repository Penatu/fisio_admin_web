import { getBookingById } from "@/lib/bookings-data"

export const paymentMethodColors = {
  "Bank Transfer": "outline",
  "E-Wallet": "info",
  "Credit Card": "secondary",
}

const METHOD_LABELS = {
  bank_transfer: "Bank Transfer",
  e_wallet: "E-Wallet",
  credit_card: "Credit Card",
}

export function paymentMethodLabel(method) {
  const key = String(method || "").trim().toLowerCase()
  if (!key) return ""
  return METHOD_LABELS[key] || method
}

export const PAYMENT_STATUS = {
  unpaid: {
    label: "Unpaid",
    description: "Pembayaran belum diterima",
    badge: "warning",
    dot: "bg-amber-500",
  },
  paid: {
    label: "Paid",
    description: "Pembayaran sudah diterima",
    badge: "success",
    dot: "bg-emerald-500",
  },
  refunded: {
    label: "Refunded",
    description: "Pembayaran dikembalikan",
    badge: "secondary",
    dot: "bg-gray-400",
  },
}

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS).map(
  ([value, cfg]) => ({ value, ...cfg })
)

export const payments = [
  {
    id: 1,
    date: "Jul 24, 2026",
    invoice: "INV-2026-4521",
    booking: "BK-2026-001",
    bookingId: 1,
    patient: "Ahmad Rizki",
    patientId: 1,
    method: "Bank Transfer",
    amount: "Rp 350.000",
    status: "paid",
    transactionId: "TRX-8842104521",
    paidAt: "Jul 24, 2026 08:12",
    service: "Home Visit",
    servicePrice: "Rp 350.000",
    adminFee: "Rp 0",
    transferProof: {
      name: "bukti-transfer-ahmad.jpg",
      uploadedAt: "Jul 24, 2026 08:10",
      image: "https://placehold.co/1000x1414/e2e8f0/1e293b?text=Bukti+Transfer",
    },
  },
  {
    id: 2,
    date: "Jul 24, 2026",
    invoice: "INV-2026-4522",
    booking: "BK-2026-002",
    bookingId: 2,
    patient: "Budi Santoso",
    patientId: 2,
    method: "E-Wallet",
    amount: "Rp 450.000",
    status: "unpaid",
    transactionId: "-",
    paidAt: "-",
    service: "Sports Rehab",
    servicePrice: "Rp 450.000",
    adminFee: "Rp 0",
    transferProof: null,
  },
  {
    id: 3,
    date: "Jul 24, 2026",
    invoice: "INV-2026-4523",
    booking: "BK-2026-003",
    bookingId: 3,
    patient: "Citra Dewi",
    patientId: 3,
    method: "Credit Card",
    amount: "Rp 500.000",
    status: "unpaid",
    transactionId: "-",
    paidAt: "-",
    service: "Post-Surgery",
    servicePrice: "Rp 500.000",
    adminFee: "Rp 0",
    transferProof: null,
  },
  {
    id: 4,
    date: "Jul 23, 2026",
    invoice: "INV-2026-4520",
    booking: "BK-2026-004",
    bookingId: 4,
    patient: "Dewi Lestari",
    patientId: 4,
    method: "Bank Transfer",
    amount: "Rp 300.000",
    status: "paid",
    transactionId: "TRX-8842104520",
    paidAt: "Jul 23, 2026 12:40",
    service: "Manual Therapy",
    servicePrice: "Rp 300.000",
    adminFee: "Rp 0",
    transferProof: {
      name: "bukti-transfer-dewi.jpg",
      uploadedAt: "Jul 23, 2026 12:35",
      image: "https://placehold.co/1000x1414/e2e8f0/1e293b?text=Bukti+Transfer",
    },
  },
  {
    id: 5,
    date: "Jul 23, 2026",
    invoice: "INV-2026-4519",
    booking: "BK-2026-005",
    bookingId: 5,
    patient: "Eko Prasetyo",
    patientId: 5,
    method: "E-Wallet",
    amount: "Rp 350.000",
    status: "refunded",
    transactionId: "TRX-8842104519",
    paidAt: "Jul 23, 2026 10:05",
    service: "Home Visit",
    servicePrice: "Rp 350.000",
    adminFee: "Rp 0",
    transferProof: {
      name: "bukti-transfer-eko.jpg",
      uploadedAt: "Jul 23, 2026 10:00",
      image: "https://placehold.co/1000x1414/e2e8f0/1e293b?text=Bukti+Transfer",
    },
  },
  {
    id: 6,
    date: "Jul 22, 2026",
    invoice: "INV-2026-4518",
    booking: "BK-2026-006",
    bookingId: 6,
    patient: "Fitri Handayani",
    patientId: null,
    method: "Bank Transfer",
    amount: "Rp 375.000",
    status: "paid",
    transactionId: "TRX-8842104518",
    paidAt: "Jul 22, 2026 16:22",
    service: "Geriatric Care",
    servicePrice: "Rp 375.000",
    adminFee: "Rp 0",
    transferProof: {
      name: "bukti-transfer-fitri.jpg",
      uploadedAt: "Jul 22, 2026 16:18",
      image: "https://placehold.co/1000x1414/e2e8f0/1e293b?text=Bukti+Transfer",
    },
  },
]

export function getPaymentById(id) {
  return payments.find((p) => String(p.id) === String(id))
}

export function getPaymentByBookingId(bookingId) {
  return payments.find((p) => String(p.bookingId) === String(bookingId))
}

export function updatePaymentStatus(id, { status, note, transferProof }) {
  const payment = getPaymentById(id)
  if (!payment) return null

  payment.status = status

  if (status === "paid") {
    if (!payment.transactionId || payment.transactionId === "-") {
      payment.transactionId = `TRX-${Date.now().toString().slice(-10)}`
    }
    if (!payment.paidAt || payment.paidAt === "-") {
      payment.paidAt = new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    }
  }

  if (status === "unpaid") {
    payment.transactionId = "-"
    payment.paidAt = "-"
  }

  if (transferProof !== undefined) {
    payment.transferProof = transferProof
  }

  if (note) {
    payment.notes = note
  }

  // Keep linked booking payment status in sync when available
  if (payment.bookingId != null) {
    const booking = getBookingById(payment.bookingId)
    if (booking) booking.payment = status
  }

  return payment
}
