import {
  CalendarCheck,
  CreditCard,
  Stethoscope,
  Users,
} from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { ActionButtons } from "@/components/shared/page-toolbar"
import { StatusBadge } from "@/components/shared/status-badge"

const stats = [
  {
    title: "Total Bookings",
    value: "1,284",
    description: "78 bookings today",
    icon: CalendarCheck,
    trend: { value: "+12.5% from last month", positive: true },
  },
  {
    title: "Active Therapists",
    value: "48",
    description: "6 available now",
    icon: Stethoscope,
  },
  {
    title: "Registered Patients",
    value: "3,562",
    description: "+234 new this month",
    icon: Users,
    trend: { value: "+8.2% from last month", positive: true },
  },
  {
    title: "Revenue",
    value: "Rp 124.5M",
    description: "This month",
    icon: CreditCard,
    trend: { value: "+18.3% from last month", positive: true },
  },
]

const recentBookings = [
  { id: 1, date: "Jul 24, 2026", time: "09:00", code: "BK-2026-001", patient: "Ahmad Rizki", therapist: "Dr. Sari", service: "Home Visit", status: "confirmed", amount: "Rp 350.000" },
  { id: 2, date: "Jul 24, 2026", time: "10:30", code: "BK-2026-002", patient: "Budi Santoso", therapist: "Dr. Andi", service: "Sports Rehab", status: "new", amount: "Rp 450.000" },
  { id: 3, date: "Jul 24, 2026", time: "11:00", code: "BK-2026-003", patient: "Citra Dewi", therapist: "Dr. Maya", service: "Post-Surgery", status: "pending", amount: "Rp 500.000" },
  { id: 4, date: "Jul 24, 2026", time: "13:00", code: "BK-2026-004", patient: "Dewi Lestari", therapist: "Dr. Rudi", service: "Manual Therapy", status: "completed", amount: "Rp 300.000" },
  { id: 5, date: "Jul 24, 2026", time: "14:30", code: "BK-2026-005", patient: "Eko Prasetyo", therapist: "Dr. Sari", service: "Home Visit", status: "cancelled", amount: "Rp 350.000" },
]

const columns = [
  { key: "date", label: "Booking Date" },
  { key: "time", label: "Time" },
  { key: "code", label: "Booking Code" },
  { key: "patient", label: "Patient" },
  { key: "therapist", label: "Therapist" },
  { key: "service", label: "Service" },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "amount", label: "Amount" },
  { key: "actions", label: "Action", render: () => <ActionButtons /> },
]

export default function DashboardPage() {
  return (
    <PageLayout
      title="Dashboard"
      stats={stats}
      searchPlaceholder="Filter bookings..."
      statusFilters={["New", "Confirmed", "Completed", "Cancelled"]}
      paymentFilters={["Paid", "Unpaid"]}
      columns={columns}
      data={recentBookings}
    />
  )
}
