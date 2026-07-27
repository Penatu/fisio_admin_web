import { useNavigate } from "react-router-dom"
import { CalendarCheck, CalendarClock, CalendarX, ClipboardList, Eye, Pencil } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { bookings, ORDER_STATUS } from "@/lib/bookings-data"

const stats = [
  { title: "Total Bookings", value: "1,284", description: "78 bookings today", icon: ClipboardList },
  { title: "Confirmed", value: "856", description: "67% confirmation rate", icon: CalendarCheck },
  { title: "Pending", value: "124", description: "Awaiting confirmation", icon: CalendarClock },
  { title: "Cancelled", value: "48", description: "3.7% cancellation rate", icon: CalendarX },
]

export default function BookingsPage() {
  const navigate = useNavigate()
  const goToDetail = (id) => navigate(`/bookings/${id}`)

  const columns = [
    { key: "date", label: "Booking Date" },
    { key: "time", label: "Time" },
    { key: "code", label: "Booking Code", render: (row) => <span className="font-mono text-xs">{row.code}</span> },
    { key: "patient", label: "Patient" },
    { key: "therapist", label: "Therapist" },
    { key: "service", label: "Service" },
    {
      key: "orderStatus",
      label: "Order Status",
      render: (row) => (
        <Badge variant={ORDER_STATUS[row.orderStatus]?.badge || "secondary"}>
          {ORDER_STATUS[row.orderStatus]?.label || row.orderStatus}
        </Badge>
      ),
    },
    { key: "payment", label: "Payment", render: (row) => <StatusBadge status={row.payment} /> },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => goToDetail(row.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            onClick={() => goToDetail(row.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <PageLayout
      title="Booking List"
      stats={stats}
      searchPlaceholder="Filter bookings..."
      statusFilters={["New", "Confirmed", "Pending", "Completed", "Cancelled"]}
      paymentFilters={["Paid", "Unpaid", "Refunded"]}
      columns={columns}
      data={bookings}
      onRowClick={(row) => goToDetail(row.id)}
    />
  )
}
