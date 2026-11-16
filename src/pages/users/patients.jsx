import { useNavigate } from "react-router-dom"
import { Eye, Pencil, Users } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useGetPatientList } from "@/pages/users/hooks/useGetPatientList"

function displayValue(value) {
  return String(value ?? "").trim() || "-"
}

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "?"
  return parts.map((part) => part[0]).join("").slice(0, 2).toUpperCase()
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

export default function PatientsPage() {
  const navigate = useNavigate()
  const {
    patients,
    totalPatients,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    setPage,
    setPerPage,
  } = useGetPatientList()

  const goToDetail = (code) => navigate(`/users/patients/${code}`)

  const stats = [
    {
      title: "Total Patients",
      value: Number(totalPatients || 0).toLocaleString("en-US"),
      description: "Semua pasien",
      icon: Users,
    },
  ]

  const columns = [
    {
      key: "name",
      label: "Patient",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-50 text-xs text-blue-600">
              {initials(row.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{displayValue(row.name)}</span>
        </div>
      ),
    },
    { key: "email", label: "Email", render: (row) => displayValue(row.email) },
    { key: "phone", label: "Phone", render: (row) => displayValue(row.phone) },
    { key: "address", label: "Address", render: (row) => displayValue(row.address) },
    { key: "joinedAt", label: "Joined At", render: (row) => formatDate(row.joinedAt) },
    { key: "sessions", label: "Sessions", render: (row) => row.totalSessions ?? 0 },
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
      title="Patient Management"
      stats={stats}
      searchPlaceholder="Cari pasien..."
      columns={columns}
      data={patients}
      isLoading={isLoading}
      error={error}
      emptyMessage="Tidak ada pasien."
      searchValue={search}
      onSearchChange={setSearch}
      pagination={{
        ...pagination,
        onPageChange: setPage,
        onPerPageChange: setPerPage,
      }}
      onRowClick={(row) => goToDetail(row.code)}
    />
  )
}
