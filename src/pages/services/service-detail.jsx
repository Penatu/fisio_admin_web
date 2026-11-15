import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Layers,
  Pencil,
  PiggyBank,
  Receipt,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import {
  computeProfit,
  formatRupiah,
} from "@/lib/services-data"
import { useDeleteService } from "@/pages/services/hooks/useDeleteService"
import { useEditService } from "@/pages/services/hooks/useEditService"
import { useGetServiceDetail } from "@/pages/services/hooks/useGetServiceDetail"
import { ServiceFormSheet } from "@/components/services/service-form-sheet"
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

function ProfitRow({ label, value, hint, strong }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className={strong ? "text-sm font-semibold" : "text-sm"}>{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <p className={strong ? "text-sm font-bold" : "text-sm font-medium"}>{value}</p>
    </div>
  )
}

export default function ServiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { service, isLoading, error, reload } = useGetServiceDetail(id)
  const { editService, isSubmitting, error: saveError, clearError } = useEditService()
  const {
    deleteService,
    isDeleting,
    error: deleteError,
    clearError: clearDeleteError,
  } = useDeleteService()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleUpdate(form) {
    await editService(id, form)
    reload()
  }

  async function handleDelete() {
    try {
      await deleteService(id)
      setDeleteOpen(false)
      navigate("/services")
    } catch {
      // The hook stores the message shown in the dialog.
    }
  }

  if (isLoading && !service) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Layanan tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          {error || "Data layanan yang Anda cari tidak tersedia."}
        </p>
        <Button variant="outline" onClick={() => navigate("/services")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Button>
      </div>
    )
  }

  const profit = service.profit || computeProfit(service)

  const summary = [
    { label: "Harga", value: service.price, icon: DollarSign },
    { label: "Durasi", value: service.duration, icon: Clock },
    { label: "Total Booking", value: service.bookings.toLocaleString("id-ID"), icon: Users },
    { label: "Keuntungan / Sesi", value: formatRupiah(profit.netProfit), icon: PiggyBank },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/services")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => {
              clearDeleteError()
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Service
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              clearError()
              setEditOpen(true)
            }}
          >
            <Pencil className="h-4 w-4" />
            Edit Service
          </Button>
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{service.name}</h1>
              <Badge variant="outline">{service.category}</Badge>
              <StatusBadge status={service.status} />
            </div>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="shadow-none">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-base font-bold tracking-tight">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Informasi Layanan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <InfoRow icon={Layers} label="Kategori" value={service.category} />
            <InfoRow icon={Clock} label="Durasi" value={service.duration} />
            <InfoRow icon={DollarSign} label="Harga" value={service.price} />
            <InfoRow icon={Users} label="Total Booking" value={service.bookings.toLocaleString("id-ID")} />
          </CardContent>
        </Card>

        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Informasi Bagi Untung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Bagian Terapis</span>
                </div>
                <p className="text-lg font-bold tracking-tight">
                  {formatRupiah(profit.therapistEarning)}
                </p>
                <p className="text-xs text-muted-foreground">{profit.therapistSharePct}% dari harga</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs">Bagian Platform</span>
                </div>
                <p className="text-lg font-bold tracking-tight">
                  {formatRupiah(profit.platformGross)}
                </p>
                <p className="text-xs text-muted-foreground">{profit.platformSharePct}% dari harga</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-emerald-700">
                  <PiggyBank className="h-4 w-4" />
                  <span className="text-xs">Keuntungan Bersih</span>
                </div>
                <p className="text-lg font-bold tracking-tight text-emerald-700">
                  {formatRupiah(profit.netProfit)}
                </p>
                <p className="text-xs text-emerald-700/80">Margin {profit.marginPct}%</p>
              </div>
            </div>

            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="bg-blue-500"
                style={{ width: `${profit.therapistSharePct}%` }}
                title={`Terapis ${profit.therapistSharePct}%`}
              />
              <div
                className="bg-primary"
                style={{ width: `${profit.platformSharePct}%` }}
                title={`Platform ${profit.platformSharePct}%`}
              />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Terapis {profit.therapistSharePct}%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Platform {profit.platformSharePct}%
              </span>
            </div>

            <div className="divide-y rounded-lg border px-4">
              <ProfitRow label="Harga Layanan" value={formatRupiah(profit.price)} />
              <ProfitRow
                label="Bagi Hasil Terapis"
                hint={`${profit.therapistSharePct}% dari harga`}
                value={`- ${formatRupiah(profit.therapistEarning)}`}
              />
              <ProfitRow label="Pendapatan Kotor Platform" value={formatRupiah(profit.platformGross)} />
              <ProfitRow
                label="Biaya Operasional"
                hint="Transport, alat, dll."
                value={`- ${formatRupiah(profit.operationalCost)}`}
              />
              <ProfitRow
                label="Keuntungan Bersih"
                value={formatRupiah(profit.netProfit)}
                strong
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <Receipt className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Estimasi total keuntungan dari layanan ini:{" "}
                <span className="font-semibold text-foreground">
                  {service.totalEstimatedProfitFormatted}
                </span>{" "}
                dari {service.bookings.toLocaleString("id-ID")} booking.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ServiceFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Service"
        description="Perbarui detail dan informasi bagi untung layanan."
        submitLabel="Simpan Perubahan"
        submitIcon={false}
        initialValues={{
          name: service.name,
          categoryId: service.categoryId ? String(service.categoryId) : "",
          duration: String(service.duration).replace(/\D/g, ""),
          price: String(service.priceValue || ""),
          description: service.description,
          status: service.status,
          therapistSharePct: String(service.therapistSharePct ?? ""),
          operationalCost: String(service.operationalCost ?? ""),
        }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        error={saveError}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus layanan?</DialogTitle>
            <DialogDescription>
              Layanan <span className="font-medium text-foreground">{service.name}</span> akan
              dihapus. Tindakan ini tidak bisa dibatalkan.
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
