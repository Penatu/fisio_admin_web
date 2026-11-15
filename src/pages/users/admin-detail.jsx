import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Hash,
  Mail,
  MapPin,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react"
import { useDeleteAdmin } from "@/pages/users/hooks/useDeleteAdmin"
import { useGetAdminDetail } from "@/pages/users/hooks/useGetAdminDetail"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { useAuth } from "@/context/auth-context"
import { isSuperAdminRole } from "@/lib/auth-data"

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

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const canManageAdmins = isSuperAdminRole(user?.role)
  const { admin, isLoading, error } = useGetAdminDetail(id)
  const { deleteAdmin, isDeleting, error: deleteError, clearError } = useDeleteAdmin()
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    try {
      await deleteAdmin(id)
      setDeleteOpen(false)
      navigate("/users/admins")
    } catch {
      // The hook stores the message shown in the dialog.
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Admin tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          {error || "Data admin yang Anda cari tidak tersedia."}
        </p>
        <Button variant="outline" onClick={() => navigate("/users/admins")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/users/admins")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        {canManageAdmins ? (
          <Button
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => {
              clearError()
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Admin
          </Button>
        ) : null}
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-violet-50 text-xl font-semibold text-violet-600">
              {initials(admin.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{admin.name}</h1>
              <Badge variant={roleVariant(admin.role)}>{admin.role}</Badge>
              <StatusBadge status={admin.status} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Hash className="h-4 w-4" />
                {admin.code}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {admin.email}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <UserCog className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peran</p>
              <p className="text-base font-bold tracking-tight">{admin.role}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-base font-bold tracking-tight">
                <StatusBadge status={admin.status} />
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Terakhir Aktif</p>
              <p className="text-sm font-bold tracking-tight">{admin.lastActive}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destinasi Dikunjungi</p>
              <p className="text-base font-bold tracking-tight">
                {admin.destVisited.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <InfoRow icon={Hash} label="Kode" value={admin.code} />
          <InfoRow icon={Mail} label="Email" value={admin.email} />
          <InfoRow icon={UserCog} label="Peran" value={admin.role} />
          <InfoRow icon={CalendarDays} label="Bergabung" value={admin.joinedAt} />
          <InfoRow icon={Clock} label="Terakhir Aktif" value={admin.lastActive} />
          <InfoRow
            icon={MapPin}
            label="Destinasi Dikunjungi"
            value={admin.destVisited.toLocaleString("id-ID")}
          />
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus admin?</DialogTitle>
            <DialogDescription>
              Admin <span className="font-medium text-foreground">{admin.name}</span> akan dihapus.
              Tindakan ini tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
