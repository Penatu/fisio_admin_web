import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserCog,
} from "lucide-react"
import { getAdminById, roleBadge, updateAdmin } from "@/lib/admins-data"
import { AdminFormSheet } from "@/components/users/admin-form-sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
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

const levelBadge = {
  "Full Access": "success",
  "Branch Only": "info",
  "View Only": "warning",
  "No Access": "secondary",
}

export default function AdminDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const admin = getAdminById(id)
  const [editOpen, setEditOpen] = useState(false)
  const [, forceUpdate] = useState(0)

  function handleUpdate(form) {
    updateAdmin(id, form)
    forceUpdate((n) => n + 1)
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Admin tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          Data admin yang Anda cari tidak tersedia.
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
        <Button variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Edit Admin
        </Button>
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
              <Badge variant={roleBadge[admin.role] || "secondary"}>{admin.role}</Badge>
              <StatusBadge status={admin.status} />
            </div>
            <p className="text-sm text-muted-foreground">{admin.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {admin.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {admin.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {admin.branch}
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
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cabang</p>
              <p className="text-base font-bold tracking-tight">{admin.branch}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Login Terakhir</p>
              <p className="text-sm font-bold tracking-tight">{admin.lastLogin}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">2FA</p>
              <p className="text-base font-bold tracking-tight">
                {admin.twoFactor ? "Aktif" : "Nonaktif"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="information">
        <TabsList className="max-w-md">
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <InfoRow icon={Mail} label="Email" value={admin.email} />
              <InfoRow icon={Phone} label="Telepon" value={admin.phone} />
              <InfoRow icon={UserCog} label="Peran" value={admin.role} />
              <InfoRow icon={Building2} label="Cabang" value={admin.branch} />
              <InfoRow icon={MapPin} label="Lokasi" value={admin.location} />
              <InfoRow icon={CalendarDays} label="Bergabung Sejak" value={admin.joinedAt} />
              <InfoRow icon={Clock} label="Login Terakhir" value={admin.lastLogin} />
              <InfoRow
                icon={KeyRound}
                label="Autentikasi 2 Faktor"
                value={admin.twoFactor ? "Aktif" : "Nonaktif"}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="shadow-none overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Modul</TableHead>
                    <TableHead className="text-right">Tingkat Akses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admin.permissions.map((perm) => (
                    <TableRow key={perm.module}>
                      <TableCell className="font-medium">{perm.module}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={levelBadge[perm.level] || "secondary"}>
                          {perm.level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Log Aktivitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {admin.activity.map((item, idx) => (
                <div
                  key={item.id}
                  className={
                    idx !== admin.activity.length - 1
                      ? "flex items-start gap-3 border-b py-3"
                      : "flex items-start gap-3 py-3"
                  }
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    {item.target !== "-" && (
                      <p className="text-xs text-muted-foreground">Target: {item.target}</p>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AdminFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Admin"
        description="Perbarui informasi dan status admin."
        submitLabel="Simpan Perubahan"
        initialValues={{
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          branch: admin.branch,
          location: admin.location,
          bio: admin.bio,
          status: admin.status,
          twoFactor: admin.twoFactor,
        }}
        onSubmit={handleUpdate}
      />
    </div>
  )
}
