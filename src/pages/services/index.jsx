import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Activity, Clock, DollarSign, Eye, Layers, Pencil, Plus } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { ServiceFormSheet } from "@/components/services/service-form-sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCreateService } from "@/pages/services/hooks/useCreateService"
import { useGetServiceList } from "@/pages/services/hooks/useGetServiceList"

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

function formatCount(value) {
  return Number(value || 0).toLocaleString("en-US")
}

function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`
}

export default function ServicesPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const {
    services,
    summary,
    pagination,
    isLoading,
    error,
    search,
    status,
    setSearch,
    setStatus,
    setPage,
    setPerPage,
    reload,
  } = useGetServiceList()
  const { createService, isSubmitting, error: createError, clearError } = useCreateService()

  const goToDetail = (id) => navigate(`/services/${id}`)

  const handleCreate = async (form) => {
    await createService(form)
    reload()
  }

  const openCreate = () => {
    clearError()
    setOpen(true)
  }

  const stats = [
    {
      title: "Total Services",
      value: formatCount(summary.total),
      description: `${formatCount(summary.active)} active services`,
      icon: Layers,
    },
    {
      title: "Most Popular",
      value: summary.popularName,
      description: `${formatCount(summary.popularBookings)} bookings`,
      icon: Activity,
    },
    {
      title: "Avg. Duration",
      value: summary.avgDuration ? `${summary.avgDuration} min` : "-",
      description: "Per session",
      icon: Clock,
    },
    {
      title: "Avg. Price",
      value: summary.avgPrice ? formatRupiah(summary.avgPrice) : "-",
      description: "Across loaded services",
      icon: DollarSign,
    },
  ]

  const columns = [
    {
      key: "name",
      label: "Service Name",
      render: (row) => <span className="font-medium">{row.name || "-"}</span>,
    },
    {
      key: "category",
      label: "Category",
      render: (row) => <Badge variant="outline">{row.category || "-"}</Badge>,
    },
    { key: "duration", label: "Duration", render: (row) => row.duration || "-" },
    { key: "price", label: "Price", render: (row) => row.price || "-" },
    {
      key: "bookings",
      label: "Total Bookings",
      render: (row) => formatCount(row.bookings),
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
    <>
      <PageLayout
        title="Services"
        stats={stats}
        searchPlaceholder="Cari layanan..."
        statusFilters={STATUS_FILTERS}
        columns={columns}
        data={services}
        isLoading={isLoading}
        error={error}
        emptyMessage="Tidak ada layanan."
        searchValue={search}
        onSearchChange={setSearch}
        selectedStatus={status}
        onStatusChange={setStatus}
        pagination={{
          ...pagination,
          onPageChange: setPage,
          onPerPageChange: setPerPage,
        }}
        onRowClick={(row) => goToDetail(row.id)}
        showDatePicker={false}
        headerActions={
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        }
      />

      <ServiceFormSheet
        open={open}
        onOpenChange={setOpen}
        title="Add Service"
        description="Lengkapi detail layanan baru untuk ditambahkan ke katalog."
        submitLabel="Simpan Layanan"
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        error={createError}
      />
    </>
  )
}
