import { useNavigate } from "react-router-dom"
import { CheckCircle, Clock, Eye, Pencil, Star, Users } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useGetTherapist } from "@/pages/users/hooks/useGetTherapist"

const stats = [
  { title: "Total Therapists", value: "48", description: "42 active, 6 inactive", icon: Users },
  { title: "Available Today", value: "32", description: "67% availability rate", icon: CheckCircle },
  { title: "Avg. Rating", value: "4.8", description: "Based on 1,240 reviews", icon: Star },
  { title: "Pending Verification", value: "5", description: "Awaiting document review", icon: Clock },
]

const STATUS_FILTERS = [
  { label: "Inactive", value: "inactive" },
  { label: "Active", value: "active" },
  { label: "In Review", value: "in_review" },
  { label: "Rejected", value: "rejected" },
]

function displayValue(value) {
  return value?.trim() ? value : "-"
}

function nameInitials(name, email) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean)
  const source = parts.length > 1 ? parts.slice(1) : parts
  const letters = source.map((part) => part[0]).join("").slice(0, 2)
  if (letters) return letters.toUpperCase()
  return (email || "?").slice(0, 1).toUpperCase()
}

function formatRegisteredAt(value) {
  if (!value) return "-"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function TherapistsPage() {
  const navigate = useNavigate()
  const {
    therapists,
    pagination,
    isLoading,
    error,
    search,
    latestStatus,
    setSearch,
    setLatestStatus,
    setPage,
    setPerPage,
  } = useGetTherapist()

  const goToDetail = (code) => navigate(`/users/therapists/${code}`)

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {nameInitials(row.name, row.email)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{displayValue(row.name)}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (row) => displayValue(row.email) },
    { key: "phone", label: "Phone", render: (row) => displayValue(row.phone) },
    { key: "address", label: "Address", render: (row) => displayValue(row.address) },
    {
      key: "registeredAt",
      label: "Registered At",
      render: (row) => formatRegisteredAt(row.registeredAt),
    },
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
      title="Therapist Management"
      stats={stats}
      searchPlaceholder="Search by name..."
      statusFilters={STATUS_FILTERS}
      columns={columns}
      data={therapists}
      onRowClick={(row) => goToDetail(row.code)}
      showDatePicker={false}
      isLoading={isLoading}
      error={error}
      emptyMessage="Tidak ada therapist."
      searchValue={search}
      onSearchChange={setSearch}
      selectedStatus={latestStatus}
      onStatusChange={setLatestStatus}
      pagination={{
        ...pagination,
        onPageChange: setPage,
        onPerPageChange: setPerPage,
      }}
    />
  )
}
