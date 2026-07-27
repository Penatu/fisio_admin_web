import { useNavigate } from "react-router-dom"
import { ArrowDownLeft, ArrowUpRight, CreditCard, Eye, Wallet } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { payments, paymentMethodColors } from "@/lib/payments-data"

const stats = [
  { title: "Total Revenue", value: "Rp 124.5M", description: "This month", icon: Wallet, trend: { value: "+18.3% from last month", positive: true } },
  { title: "Transactions", value: "1,156", description: "892 completed", icon: CreditCard },
  { title: "Pending Payments", value: "Rp 12.4M", description: "124 transactions", icon: ArrowDownLeft },
  { title: "Refunds", value: "Rp 2.1M", description: "18 refund requests", icon: ArrowUpRight },
]

export default function PaymentsPage() {
  const navigate = useNavigate()
  const goToDetail = (id) => navigate(`/payments/${id}`)

  const columns = [
    { key: "date", label: "Date" },
    { key: "invoice", label: "Invoice", render: (row) => <span className="font-mono text-xs">{row.invoice}</span> },
    { key: "booking", label: "Booking Code", render: (row) => <span className="font-mono text-xs">{row.booking}</span> },
    { key: "patient", label: "Patient" },
    { key: "method", label: "Method", render: (row) => <Badge variant={paymentMethodColors[row.method]}>{row.method}</Badge> },
    { key: "amount", label: "Amount", render: (row) => <span className="font-medium">{row.amount}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
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
        </div>
      ),
    },
  ]

  return (
    <PageLayout
      title="Payments"
      stats={stats}
      searchPlaceholder="Filter payments..."
      statusFilters={["Paid", "Unpaid", "Refunded"]}
      paymentFilters={["Bank Transfer", "E-Wallet", "Credit Card"]}
      columns={columns}
      data={payments}
      onRowClick={(row) => goToDetail(row.id)}
    />
  )
}
