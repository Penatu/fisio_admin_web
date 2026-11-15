import { useNavigate } from "react-router-dom"
import { ArrowDownLeft, ArrowUpRight, CreditCard, Eye, Wallet } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { paymentMethodColors } from "@/lib/payments-data"
import { useGetPaymentList } from "@/pages/payments/hooks/useGetPaymentList"

const STATUS_FILTERS = [
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Pending", value: "pending" },
  { label: "Refunded", value: "refunded" },
]

const METHOD_FILTERS = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "E-Wallet", value: "e_wallet" },
  { label: "Credit Card", value: "credit_card" },
]

function formatCount(value) {
  return Number(value || 0).toLocaleString("en-US")
}

export default function PaymentsPage() {
  const navigate = useNavigate()
  const {
    payments,
    summary,
    pagination,
    isLoading,
    error,
    search,
    status,
    method,
    setSearch,
    setStatus,
    setMethod,
    setPage,
    setPerPage,
  } = useGetPaymentList()

  const goToDetail = (code) => navigate(`/payments/${code}`)

  const stats = [
    {
      title: "Total Revenue",
      value: summary.totalRevenueFormatted || "Rp 0",
      description: "Total pendapatan",
      icon: Wallet,
    },
    {
      title: "Transactions",
      value: formatCount(summary.totalTransactions),
      description: "Semua transaksi",
      icon: CreditCard,
    },
    {
      title: "Pending Payments",
      value: summary.pendingAmountFormatted || "Rp 0",
      description: `${formatCount(summary.pendingCount)} transaksi`,
      icon: ArrowDownLeft,
    },
    {
      title: "Refunds",
      value: summary.refundAmountFormatted || "Rp 0",
      description: `${formatCount(summary.refundCount)} transaksi`,
      icon: ArrowUpRight,
    },
  ]

  const columns = [
    { key: "date", label: "Date", render: (row) => row.date || "-" },
    {
      key: "invoice",
      label: "Invoice",
      render: (row) => <span className="font-mono text-xs">{row.invoice || "-"}</span>,
    },
    {
      key: "bookingCode",
      label: "Booking Code",
      render: (row) => <span className="font-mono text-xs">{row.bookingCode || "-"}</span>,
    },
    { key: "patient", label: "Patient", render: (row) => row.patient || "-" },
    {
      key: "method",
      label: "Method",
      render: (row) =>
        row.methodLabel ? (
          <Badge variant={paymentMethodColors[row.methodLabel] || "secondary"}>{row.methodLabel}</Badge>
        ) : (
          "-"
        ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <span className="font-medium">{row.amount || "-"}</span>,
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
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
        </div>
      ),
    },
  ]

  return (
    <PageLayout
      title="Payments"
      stats={stats}
      searchPlaceholder="Cari invoice..."
      statusFilters={STATUS_FILTERS}
      paymentFilters={METHOD_FILTERS}
      showDatePicker={false}
      columns={columns}
      data={payments}
      isLoading={isLoading}
      error={error}
      emptyMessage="Tidak ada pembayaran."
      searchValue={search}
      onSearchChange={setSearch}
      selectedStatus={status}
      onStatusChange={setStatus}
      selectedPayment={method}
      onPaymentChange={setMethod}
      pagination={{
        ...pagination,
        onPageChange: setPage,
        onPerPageChange: setPerPage,
      }}
      onRowClick={(row) => goToDetail(row.code)}
    />
  )
}
