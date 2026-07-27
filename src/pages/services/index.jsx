import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Activity, Clock, DollarSign, Eye, Layers, Pencil, Plus } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { ServiceFormSheet } from "@/components/services/service-form-sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { services as servicesData, createService } from "@/lib/services-data"

const stats = [
  { title: "Total Services", value: "24", description: "18 active services", icon: Layers },
  { title: "Most Popular", value: "Home Visit", description: "42% of all bookings", icon: Activity },
  { title: "Avg. Duration", value: "60 min", description: "Per session", icon: Clock },
  { title: "Avg. Price", value: "Rp 385K", description: "Across all services", icon: DollarSign },
]

export default function ServicesPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState(servicesData)
  const [open, setOpen] = useState(false)

  const goToDetail = (id) => navigate(`/services/${id}`)

  const handleCreate = (form) => {
    createService(form)
    setServices([...servicesData])
  }

  const columns = [
    { key: "name", label: "Service Name", render: (row) => <span className="font-medium">{row.name}</span> },
    { key: "category", label: "Category", render: (row) => <Badge variant="outline">{row.category}</Badge> },
    { key: "duration", label: "Duration" },
    { key: "price", label: "Price" },
    { key: "bookings", label: "Total Bookings" },
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
        searchPlaceholder="Filter services..."
        statusFilters={["Active", "Inactive"]}
        columns={columns}
        data={services}
        onRowClick={(row) => goToDetail(row.id)}
        showDatePicker={false}
        headerActions={
          <Button className="gap-2" onClick={() => setOpen(true)}>
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
      />
    </>
  )
}
