import { useNavigate } from "react-router-dom"
import {
  CalendarCheck,
  CreditCard,
  Eye,
  Pencil,
  Stethoscope,
  Users,
} from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { useGetDashboardSummary } from "@/pages/dashboard/hooks/useGetDashboardSummary"
import { useGetRecentBookings } from "@/pages/dashboard/hooks/useGetRecentBookings"

const STATUS_FILTERS = [
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Visit", value: "visit" },
  { label: "Finished", value: "finished" },
  { label: "Canceled", value: "canceled" },
]

const PAYMENT_FILTERS = [
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Rejected", value: "rejected" },
]

function formatCount(value) {
  return Number(value || 0).toLocaleString("en-US")
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

function trendFrom(label, value) {
  if (!label) return undefined
  return { value: label, positive: Number(value) >= 0 }
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { summary, isLoading: isSummaryLoading } = useGetDashboardSummary()
  const {
    bookings,
    pagination,
    isLoading,
    error,
    search,
    status,
    paymentStatus,
    setSearch,
    setStatus,
    setPaymentStatus,
    setPage,
    setPerPage,
  } = useGetRecentBookings()

  const goToDetail = (code) => navigate(`/bookings/${code}`)
  const count = (value) => (isSummaryLoading ? "..." : formatCount(value))

  const stats = [
    {
      title: "Total Bookings",
      value: count(summary.totalBookings),
      description: isSummaryLoading ? "Memuat..." : `${formatCount(summary.bookingsToday)} bookings today`,
      icon: CalendarCheck,
      trend: trendFrom(summary.bookingsTrendLabel, summary.bookingsTrend),
    },
    {
      title: "Active Therapists",
      value: count(summary.activeTherapists),
      description: isSummaryLoading
        ? "Memuat..."
        : summary.availableTherapistsLabel || `${formatCount(summary.availableTherapists)} available now`,
      icon: Stethoscope,
    },
    {
      title: "Registered Patients",
      value: count(summary.registeredPatients),
      description: isSummaryLoading
        ? "Memuat..."
        : `+${formatCount(summary.newPatientsThisMonth)} new this month`,
      icon: Users,
      trend: trendFrom(summary.patientsTrendLabel, summary.patientsTrend),
    },
    {
      title: "Revenue",
      value: isSummaryLoading ? "..." : summary.revenueThisMonthFormatted || "Rp 0",
      description: "This month",
      icon: CreditCard,
      trend: trendFrom(summary.revenueTrendLabel, summary.revenueTrend),
    },
  ]

  const columns = [
    { key: "date", label: "Booking Date", render: (row) => formatDate(row.date) },
    { key: "time", label: "Time", render: (row) => row.time?.trim() || "-" },
    {
      key: "code",
      label: "Booking Code",
      render: (row) => <span className="font-mono text-xs">{row.code || "-"}</span>,
    },
    { key: "patient", label: "Patient", render: (row) => row.patient || "-" },
    { key: "therapist", label: "Therapist", render: (row) => row.therapist || "-" },
    { key: "service", label: "Service", render: (row) => row.service || "-" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: "amount", label: "Amount", render: (row) => row.amountFormatted || "-" },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => goToDetail(row.code)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            onClick={() => goToDetail(row.code)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <PageLayout
      title="Dashboard"
      stats={stats}
      searchPlaceholder="Filter bookings..."
      statusFilters={STATUS_FILTERS}
      paymentFilters={PAYMENT_FILTERS}
      showDatePicker={false}
      columns={columns}
      data={bookings}
      isLoading={isLoading}
      error={error}
      emptyMessage="Tidak ada booking."
      searchValue={search}
      onSearchChange={setSearch}
      selectedStatus={status}
      onStatusChange={setStatus}
      selectedPayment={paymentStatus}
      onPaymentChange={setPaymentStatus}
      pagination={{
        ...pagination,
        onPageChange: setPage,
        onPerPageChange: setPerPage,
      }}
      onRowClick={(row) => goToDetail(row.code)}
    />
  )
}
