export const reportTabs = [
  { value: "revenue", label: "Revenue" },
  { value: "occupancy", label: "Occupancy" },
  { value: "payroll", label: "Payroll" },
]

export const revenueReport = {
  filters: {
    period: "Last 7 days",
    compare: "Previous period",
    service: "All Services",
    therapist: "All Therapists",
    location: "All Locations",
  },
  metrics: [
    {
      label: "Total Revenue",
      value: "Rp 48.2M",
      change: 12.4,
      changeLabel: "vs previous period",
    },
    {
      label: "Paid Bookings",
      value: "186",
      change: 8.1,
      changeLabel: "vs previous period",
    },
    {
      label: "Avg. Revenue / Day",
      value: "Rp 6.9M",
      change: -3.2,
      changeLabel: "vs previous period",
    },
  ],
  chart: {
    labels: ["19 Jul", "20 Jul", "21 Jul", "22 Jul", "23 Jul", "24 Jul", "25 Jul"],
    current: [5.2, 6.1, 7.8, 6.4, 8.2, 7.5, 7.0],
    previous: [4.8, 5.5, 6.0, 7.2, 6.8, 6.2, 5.9],
    unit: "jt",
  },
  list: [
    {
      id: "rev-1",
      title: "Home Visit Physiotherapy",
      subtitle: "Home Care",
      period: "19–25 Jul 2026",
      amount: "Rp 18.4M",
      bookings: 52,
      change: 14.2,
      status: "completed",
    },
    {
      id: "rev-2",
      title: "Sports Rehabilitation",
      subtitle: "Sports",
      period: "19–25 Jul 2026",
      amount: "Rp 12.1M",
      bookings: 28,
      change: 9.5,
      status: "completed",
    },
    {
      id: "rev-3",
      title: "Post-Surgery Rehabilitation",
      subtitle: "Clinical",
      period: "19–25 Jul 2026",
      amount: "Rp 9.8M",
      bookings: 20,
      change: -2.1,
      status: "completed",
    },
    {
      id: "rev-4",
      title: "Manual Therapy",
      subtitle: "Therapy",
      period: "19–25 Jul 2026",
      amount: "Rp 5.2M",
      bookings: 18,
      change: 4.0,
      status: "completed",
    },
    {
      id: "rev-5",
      title: "Geriatric Care",
      subtitle: "Elderly",
      period: "19–25 Jul 2026",
      amount: "Rp 2.7M",
      bookings: 8,
      change: -6.4,
      status: "pending",
    },
  ],
}

export const occupancyReport = {
  filters: {
    period: "Last 7 days",
    compare: "Previous period",
    service: "All Services",
    therapist: "All Therapists",
    location: "All Locations",
  },
  metrics: [
    {
      label: "Occupied Hours",
      value: "95",
      change: -11.3,
      changeLabel: "vs previous period",
    },
    {
      label: "Active Therapists",
      value: "12",
      change: 0,
      changeLabel: "No change",
    },
    {
      label: "Hours / Therapist / Day",
      value: "6.8",
      change: -11.3,
      changeLabel: "vs previous period",
    },
  ],
  chart: {
    labels: ["19 Jul", "20 Jul", "21 Jul", "22 Jul", "23 Jul", "24 Jul", "25 Jul"],
    current: [12, 14, 21, 11, 13, 12, 12],
    previous: [14, 16, 18, 15, 17, 14, 13],
    unit: "hrs",
  },
  list: [
    {
      id: "occ-1",
      title: "Dr. Sari Wulandari",
      subtitle: "Jakarta Selatan",
      period: "19–25 Jul 2026",
      occupiedHours: 42,
      availableHours: 48,
      rate: "87.5%",
      change: 4.2,
      status: "active",
    },
    {
      id: "occ-2",
      title: "Dr. Andi Pratama",
      subtitle: "Bandung",
      period: "19–25 Jul 2026",
      occupiedHours: 36,
      availableHours: 40,
      rate: "90%",
      change: -2.5,
      status: "active",
    },
    {
      id: "occ-3",
      title: "Dr. Maya Sari",
      subtitle: "Surabaya",
      period: "19–25 Jul 2026",
      occupiedHours: 38,
      availableHours: 48,
      rate: "79.2%",
      change: -8.1,
      status: "active",
    },
    {
      id: "occ-4",
      title: "Dr. Rudi Hartono",
      subtitle: "Yogyakarta",
      period: "19–25 Jul 2026",
      occupiedHours: 22,
      availableHours: 32,
      rate: "68.8%",
      change: 1.4,
      status: "pending",
    },
    {
      id: "occ-5",
      title: "Dr. Linda Kusuma",
      subtitle: "Semarang",
      period: "19–25 Jul 2026",
      occupiedHours: 0,
      availableHours: 0,
      rate: "0%",
      change: -100,
      status: "inactive",
    },
  ],
}

export const payrollReport = {
  filters: {
    period: "Last 7 days",
    compare: "Previous period",
    service: "All Services",
    therapist: "All Therapists",
    location: "All Locations",
  },
  metrics: [
    {
      label: "Total Payroll",
      value: "Rp 28.6M",
      change: 6.8,
      changeLabel: "vs previous period",
    },
    {
      label: "Therapists Paid",
      value: "11",
      change: 0,
      changeLabel: "No change",
    },
    {
      label: "Avg. Payout",
      value: "Rp 2.6M",
      change: 5.1,
      changeLabel: "vs previous period",
    },
  ],
  chart: {
    labels: ["19 Jul", "20 Jul", "21 Jul", "22 Jul", "23 Jul", "24 Jul", "25 Jul"],
    current: [3.2, 3.8, 4.5, 3.6, 4.8, 4.2, 4.5],
    previous: [3.0, 3.4, 4.0, 3.8, 4.2, 3.9, 4.0],
    unit: "jt",
  },
  list: [
    {
      id: "pay-1",
      title: "Dr. Sari Wulandari",
      subtitle: "Sports Rehabilitation",
      period: "19–25 Jul 2026",
      amount: "Rp 6.4M",
      sessions: 28,
      sharePct: "60%",
      change: 8.2,
      status: "paid",
    },
    {
      id: "pay-2",
      title: "Dr. Andi Pratama",
      subtitle: "Manual Therapy",
      period: "19–25 Jul 2026",
      amount: "Rp 5.1M",
      sessions: 22,
      sharePct: "70%",
      change: 3.4,
      status: "paid",
    },
    {
      id: "pay-3",
      title: "Dr. Maya Sari",
      subtitle: "Post-Surgery Rehab",
      period: "19–25 Jul 2026",
      amount: "Rp 7.2M",
      sessions: 24,
      sharePct: "65%",
      change: -1.8,
      status: "paid",
    },
    {
      id: "pay-4",
      title: "Dr. Rudi Hartono",
      subtitle: "Pediatric Physio",
      period: "19–25 Jul 2026",
      amount: "Rp 3.4M",
      sessions: 14,
      sharePct: "65%",
      change: 12.0,
      status: "unpaid",
    },
    {
      id: "pay-5",
      title: "Dr. Linda Kusuma",
      subtitle: "Geriatric Care",
      period: "19–25 Jul 2026",
      amount: "Rp 2.5M",
      sessions: 10,
      sharePct: "60%",
      change: -4.5,
      status: "paid",
    },
  ],
}

const details = {
  revenue: {
    "rev-1": {
      title: "Home Visit Physiotherapy",
      type: "Revenue",
      period: "19–25 Jul 2026",
      summary: "Rp 18.4M dari 52 booking home visit.",
      metrics: [
        { label: "Total Revenue", value: "Rp 18.4M" },
        { label: "Bookings", value: "52" },
        { label: "Avg. Ticket", value: "Rp 353.846" },
        { label: "Growth", value: "+14.2%" },
      ],
      daily: [
        { date: "19 Jul", amount: "Rp 2.1M", bookings: 6 },
        { date: "20 Jul", amount: "Rp 2.4M", bookings: 7 },
        { date: "21 Jul", amount: "Rp 3.1M", bookings: 9 },
        { date: "22 Jul", amount: "Rp 2.5M", bookings: 7 },
        { date: "23 Jul", amount: "Rp 3.2M", bookings: 9 },
        { date: "24 Jul", amount: "Rp 2.8M", bookings: 8 },
        { date: "25 Jul", amount: "Rp 2.3M", bookings: 6 },
      ],
      notes: "Layanan home visit menjadi kontributor revenue terbesar minggu ini.",
    },
    "rev-2": {
      title: "Sports Rehabilitation",
      type: "Revenue",
      period: "19–25 Jul 2026",
      summary: "Rp 12.1M dari 28 booking sports rehab.",
      metrics: [
        { label: "Total Revenue", value: "Rp 12.1M" },
        { label: "Bookings", value: "28" },
        { label: "Avg. Ticket", value: "Rp 432.143" },
        { label: "Growth", value: "+9.5%" },
      ],
      daily: [
        { date: "19 Jul", amount: "Rp 1.4M", bookings: 3 },
        { date: "20 Jul", amount: "Rp 1.8M", bookings: 4 },
        { date: "21 Jul", amount: "Rp 2.2M", bookings: 5 },
        { date: "22 Jul", amount: "Rp 1.6M", bookings: 4 },
        { date: "23 Jul", amount: "Rp 1.9M", bookings: 4 },
        { date: "24 Jul", amount: "Rp 1.8M", bookings: 4 },
        { date: "25 Jul", amount: "Rp 1.4M", bookings: 4 },
      ],
      notes: "Permintaan sports rehab meningkat di akhir pekan.",
    },
  },
  occupancy: {
    "occ-1": {
      title: "Dr. Sari Wulandari",
      type: "Occupancy",
      period: "19–25 Jul 2026",
      summary: "Utilisasi 87.5% dari total jam tersedia.",
      metrics: [
        { label: "Occupied Hours", value: "42" },
        { label: "Available Hours", value: "48" },
        { label: "Occupancy Rate", value: "87.5%" },
        { label: "Growth", value: "+4.2%" },
      ],
      daily: [
        { date: "19 Jul", amount: "6 hrs", bookings: 4 },
        { date: "20 Jul", amount: "7 hrs", bookings: 5 },
        { date: "21 Jul", amount: "8 hrs", bookings: 5 },
        { date: "22 Jul", amount: "5 hrs", bookings: 3 },
        { date: "23 Jul", amount: "6 hrs", bookings: 4 },
        { date: "24 Jul", amount: "6 hrs", bookings: 4 },
        { date: "25 Jul", amount: "4 hrs", bookings: 3 },
      ],
      notes: "Jadwal padat di weekday, Sabtu lebih longgar.",
    },
    "occ-2": {
      title: "Dr. Andi Pratama",
      type: "Occupancy",
      period: "19–25 Jul 2026",
      summary: "Utilisasi 90% dengan 36 jam terisi.",
      metrics: [
        { label: "Occupied Hours", value: "36" },
        { label: "Available Hours", value: "40" },
        { label: "Occupancy Rate", value: "90%" },
        { label: "Growth", value: "-2.5%" },
      ],
      daily: [
        { date: "19 Jul", amount: "5 hrs", bookings: 3 },
        { date: "20 Jul", amount: "6 hrs", bookings: 4 },
        { date: "21 Jul", amount: "6 hrs", bookings: 4 },
        { date: "22 Jul", amount: "0 hrs", bookings: 0 },
        { date: "23 Jul", amount: "7 hrs", bookings: 4 },
        { date: "24 Jul", amount: "7 hrs", bookings: 5 },
        { date: "25 Jul", amount: "5 hrs", bookings: 3 },
      ],
      notes: "Kamis libur sesuai jadwal cabang Bandung.",
    },
  },
  payroll: {
    "pay-1": {
      title: "Dr. Sari Wulandari",
      type: "Payroll",
      period: "19–25 Jul 2026",
      summary: "Payout Rp 6.4M dari 28 sesi (share 60%).",
      metrics: [
        { label: "Total Payout", value: "Rp 6.4M" },
        { label: "Sessions", value: "28" },
        { label: "Share", value: "60%" },
        { label: "Status", value: "Paid" },
      ],
      daily: [
        { date: "19 Jul", amount: "Rp 0.8M", bookings: 4 },
        { date: "20 Jul", amount: "Rp 0.9M", bookings: 4 },
        { date: "21 Jul", amount: "Rp 1.1M", bookings: 5 },
        { date: "22 Jul", amount: "Rp 0.7M", bookings: 3 },
        { date: "23 Jul", amount: "Rp 1.0M", bookings: 4 },
        { date: "24 Jul", amount: "Rp 1.0M", bookings: 4 },
        { date: "25 Jul", amount: "Rp 0.9M", bookings: 4 },
      ],
      notes: "Pembayaran sudah ditransfer ke rekening BCA terdaftar.",
    },
    "pay-2": {
      title: "Dr. Andi Pratama",
      type: "Payroll",
      period: "19–25 Jul 2026",
      summary: "Payout Rp 5.1M dari 22 sesi (share 70%).",
      metrics: [
        { label: "Total Payout", value: "Rp 5.1M" },
        { label: "Sessions", value: "22" },
        { label: "Share", value: "70%" },
        { label: "Status", value: "Paid" },
      ],
      daily: [
        { date: "19 Jul", amount: "Rp 0.6M", bookings: 3 },
        { date: "20 Jul", amount: "Rp 0.8M", bookings: 3 },
        { date: "21 Jul", amount: "Rp 0.9M", bookings: 4 },
        { date: "22 Jul", amount: "Rp 0.0M", bookings: 0 },
        { date: "23 Jul", amount: "Rp 1.0M", bookings: 4 },
        { date: "24 Jul", amount: "Rp 1.0M", bookings: 4 },
        { date: "25 Jul", amount: "Rp 0.8M", bookings: 4 },
      ],
      notes: "Share tertinggi karena layanan manual therapy.",
    },
  },
}

export function getReportByTab(tab) {
  if (tab === "occupancy") return occupancyReport
  if (tab === "payroll") return payrollReport
  return revenueReport
}

export function getReportDetail(type, id) {
  const byType = details[type]
  if (!byType) return null
  if (byType[id]) return byType[id]

  // Fallback: build a detail from list item if specific detail is missing
  const report = getReportByTab(type)
  const item = report.list.find((row) => row.id === id)
  if (!item) return null

  return {
    title: item.title,
    type: type.charAt(0).toUpperCase() + type.slice(1),
    period: item.period,
    summary: `${item.title} — periode ${item.period}.`,
    metrics: [
      { label: "Primary Value", value: item.amount || item.rate || `${item.occupiedHours || 0} hrs` },
      { label: "Period", value: item.period },
      { label: "Change", value: `${item.change > 0 ? "+" : ""}${item.change}%` },
      { label: "Status", value: item.status },
    ],
    daily: report.chart.labels.map((date, i) => ({
      date,
      amount: `${report.chart.current[i]} ${report.chart.unit}`,
      bookings: Math.max(1, Math.round(report.chart.current[i] / 2)),
    })),
    notes: "Detail ringkas digenerate dari data laporan.",
  }
}

export const createdPayrolls = []

export function formatPayrollAmount(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`
}

export function createPayroll(form) {
  const id = `pay-new-${createdPayrolls.length + 1}`
  const entry = {
    id,
    title: form.therapistName,
    subtitle: form.period || "Custom period",
    period: form.period,
    amount: formatPayrollAmount(form.totalPayout),
    sessions: form.bookingIds.length,
    sharePct: `${form.sharePct}%`,
    change: 0,
    status: form.status,
    therapistId: form.therapistId,
    bankAccount: form.bankAccount,
    paymentMethod: form.paymentMethod,
    notes: form.notes,
    bookingIds: form.bookingIds,
    totalPayout: form.totalPayout,
    createdAt: new Date().toLocaleString("id-ID"),
  }

  createdPayrolls.unshift(entry)
  payrollReport.list.unshift({
    id: entry.id,
    title: entry.title,
    subtitle: entry.subtitle,
    period: entry.period,
    amount: entry.amount,
    sessions: entry.sessions,
    sharePct: entry.sharePct,
    change: 0,
    status: entry.status,
  })

  return entry
}
