import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Pencil, Plus, UserCog } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { AdminFormSheet } from "@/components/users/admin-form-sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { isSuperAdminRole } from "@/lib/auth-data"
import { useCreateAdmin } from "@/pages/users/hooks/useCreateAdmin"
import { useGetAdminList } from "@/pages/users/hooks/useGetAdminList"

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
]

function formatCount(value) {
  return Number(value || 0).toLocaleString("en-US")
}

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean)
  if (!parts.length || parts[0] === "-") return "?"
  return parts.map((part) => part[0]).join("").slice(0, 2).toUpperCase()
}

function roleVariant(role) {
  if (role === "Super Admin") return "default"
  if (role === "Admin") return "info"
  return "secondary"
}

export default function AdminsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const canManageAdmins = isSuperAdminRole(user?.role)
  const [createOpen, setCreateOpen] = useState(false)
  const {
    admins,
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
  } = useGetAdminList()
  const { createAdmin, isSubmitting, error: createError, clearError } = useCreateAdmin()

  const goToDetail = (code) => navigate(`/users/admins/${code}`)

  async function handleCreate(form) {
    await createAdmin(form)
    reload()
  }

  const stats = [
    {
      title: "Total Admins",
      value: formatCount(summary.total),
      description: "Semua admin",
      icon: UserCog,
    },
  ]

  const columns = [
    {
      key: "name",
      label: "Admin",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-violet-50 text-xs text-violet-600">
              {initials(row.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => <Badge variant={roleVariant(row.role)}>{row.role}</Badge>,
    },
    { key: "lastActive", label: "Last Active" },
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
    <>
      <PageLayout
        title="Admin Management"
        stats={stats}
        searchPlaceholder="Filter admins..."
        statusFilters={STATUS_FILTERS}
        columns={columns}
        data={admins}
        isLoading={isLoading}
        error={error}
        emptyMessage="Tidak ada admin."
        searchValue={search}
        onSearchChange={setSearch}
        selectedStatus={status}
        onStatusChange={setStatus}
        onRowClick={(row) => goToDetail(row.code)}
        showDatePicker={false}
        pagination={{
          ...pagination,
          onPageChange: setPage,
          onPerPageChange: setPerPage,
        }}
        headerActions={
          canManageAdmins ? (
            <Button
              className="gap-2"
              onClick={() => {
                clearError()
                setCreateOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Create Admin
            </Button>
          ) : null
        }
      />

      {canManageAdmins ? (
        <AdminFormSheet
          open={createOpen}
          onOpenChange={setCreateOpen}
          title="Create Admin"
          description="Tambahkan admin baru dengan nama, email, dan password."
          submitLabel="Buat Admin"
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
          error={createError}
        />
      ) : null}
    </>
  )
}
