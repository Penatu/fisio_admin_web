import { useNavigate } from "react-router-dom";
import { ClipboardList, Eye, Pencil } from "lucide-react";
import { BookingStatusSummary } from "@/components/bookings/booking-status-summary";
import { PageLayout } from "@/components/layout/page-layout";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useGetBookingList } from "@/pages/bookings/hooks/useGetBookingList";

const STATUS_FILTERS = [
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Visit", value: "visit" },
  { label: "Finished", value: "finished" },
  { label: "Canceled", value: "canceled" },
];

const PAYMENT_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Refunded", value: "refunded" },
];

function formatCount(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const {
    bookings,
    summary,
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
  } = useGetBookingList();

  const goToDetail = (code) => navigate(`/bookings/${code}`);

  const stats = [
    {
      title: "Total Bookings",
      value: formatCount(summary.totalBookings),
      description: "Semua booking",
      icon: ClipboardList,
    },
  ];

  const columns = [
    {
      key: "date",
      label: "Booking Date",
      render: (row) => formatDate(row.date),
    },
    { key: "time", label: "Time", render: (row) => row.time?.trim() || "-" },
    {
      key: "code",
      label: "Booking Code",
      render: (row) => (
        <span className="font-mono text-xs">{row.code || "-"}</span>
      ),
    },
    { key: "patient", label: "Patient", render: (row) => row.patient || "-" },
    {
      key: "therapist",
      label: "Therapist",
      render: (row) => row.therapist || "-",
    },
    { key: "service", label: "Service", render: (row) => row.service || "-" },
    {
      key: "orderStatus",
      label: "Order Status",
      render: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      key: "payment",
      label: "Payment",
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
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
  ];

  return (
    <PageLayout
      title="Booking List"
      stats={stats}
      summary={<BookingStatusSummary summary={summary} />}
      searchPlaceholder="Cari booking..."
      statusFilters={STATUS_FILTERS}
      paymentFilters={PAYMENT_FILTERS}
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
  );
}
