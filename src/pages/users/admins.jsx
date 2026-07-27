import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Pencil, Plus, Shield, ShieldCheck, ShieldOff, UserCog } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { AdminFormSheet } from "@/components/users/admin-form-sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { admins, createAdmin, roleBadge } from "@/lib/admins-data"

const stats = [
  { title: "Total Admins", value: "12", description: "Across all branches", icon: UserCog },
  { title: "Super Admins", value: "2", description: "Full platform access", icon: ShieldCheck },
  { title: "Branch Admins", value: "8", description: "Branch-level access", icon: Shield },
  { title: "Suspended", value: "2", description: "Access revoked", icon: ShieldOff },
]

export default function AdminsPage() {
  const navigate = useNavigate()
  const [adminList, setAdminList] = useState(admins)
  const [createOpen, setCreateOpen] = useState(false)

  const goToDetail = (id) => navigate(`/users/admins/${id}`)

  function handleCreate(form) {
    createAdmin(form)
    setAdminList([...admins])
  }

  const columns = [
    {
      key: "name",
      label: "Admin",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-violet-50 text-xs text-violet-600">
              {row.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "role",
      label: "Role",
      render: (row) => <Badge variant={roleBadge[row.role] || "secondary"}>{row.role}</Badge>,
    },
    { key: "branch", label: "Branch" },
    { key: "lastLogin", label: "Last Login" },
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
        title="Admin Management"
        stats={stats}
        searchPlaceholder="Filter admins..."
        statusFilters={["Active", "Suspended"]}
        columns={columns}
        data={adminList}
        onRowClick={(row) => goToDetail(row.id)}
        showDatePicker={false}
        headerActions={
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Admin
          </Button>
        }
      />

      <AdminFormSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Admin"
        description="Tambahkan admin baru ke platform."
        submitLabel="Buat Admin"
        onSubmit={handleCreate}
      />
    </>
  )
}
