import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Eye,
  FileImage,
  FileText,
  Hash,
  Pencil,
  Receipt,
  Upload,
  User,
  X,
} from "lucide-react"
import {
  getPaymentById,
  paymentMethodColors,
  PAYMENT_STATUS_OPTIONS,
  updatePaymentStatus,
} from "@/lib/payments-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

function AmountRow({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between py-2">
      <p className={strong ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>{label}</p>
      <p className={strong ? "text-base font-bold" : "text-sm font-medium"}>{value}</p>
    </div>
  )
}

export default function PaymentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const payment = getPaymentById(id)
  const [proofOpen, setProofOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [, forceUpdate] = useState(0)

  const [statusValue, setStatusValue] = useState("")
  const [note, setNote] = useState("")
  const [proof, setProof] = useState(null)

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Pembayaran tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          Data pembayaran yang Anda cari tidak tersedia.
        </p>
        <Button variant="outline" onClick={() => navigate("/payments")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Button>
      </div>
    )
  }

  function openEdit() {
    setStatusValue(payment.status)
    setNote("")
    setProof(payment.transferProof)
    setEditOpen(true)
  }

  function handleProofUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      setProof({
        name: file.name,
        uploadedAt: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        image: URL.createObjectURL(file),
      })
    }
  }

  function handleSave() {
    updatePaymentStatus(id, {
      status: statusValue,
      note: note.trim(),
      transferProof: statusValue === "paid" ? proof : payment.transferProof,
    })
    forceUpdate((n) => n + 1)
    setEditOpen(false)
  }

  const paidRequiresProof = statusValue === "paid" && !proof
  const canSave = !!statusValue && !paidRequiresProof
  const transferProof = payment.transferProof

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/payments")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <Button variant="outline" className="gap-2" onClick={openEdit}>
          <Pencil className="h-4 w-4" />
          Update Status
        </Button>
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-xl font-bold tracking-tight">{payment.invoice}</h1>
              <StatusBadge status={payment.status} />
              <Badge variant={paymentMethodColors[payment.method] || "secondary"}>
                {payment.method}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {payment.patient} • {payment.date}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold tracking-tight">{payment.amount}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <InfoRow icon={Receipt} label="Invoice" value={payment.invoice} />
            <InfoRow icon={Hash} label="ID Transaksi" value={payment.transactionId} />
            <InfoRow icon={ClipboardList} label="Kode Booking" value={payment.booking} />
            <InfoRow icon={User} label="Pasien" value={payment.patient} />
            <InfoRow icon={CreditCard} label="Metode Pembayaran" value={payment.method} />
            <InfoRow icon={CalendarDays} label="Dibayar Pada" value={payment.paidAt} />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Rincian Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <AmountRow label={payment.service} value={payment.servicePrice} />
              <AmountRow label="Biaya Admin" value={payment.adminFee} />
              <AmountRow label="Total" value={payment.amount} strong />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={payment.status} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileImage className="h-4 w-4 text-muted-foreground" />
            Bukti Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transferProof?.image ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{transferProof.name}</p>
                <p className="text-xs text-muted-foreground">
                  Diupload: {transferProof.uploadedAt || "-"}
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setProofOpen(true)}
              >
                <Eye className="h-4 w-4" />
                Lihat Bukti Transfer
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Bukti transfer belum diupload.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={proofOpen} onOpenChange={setProofOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bukti Transfer</DialogTitle>
            <DialogDescription>
              {transferProof
                ? `${transferProof.name} • ${payment.invoice}`
                : payment.invoice}
            </DialogDescription>
          </DialogHeader>
          {transferProof?.image ? (
            <div className="max-h-[70vh] overflow-auto rounded-lg border bg-muted/30 p-2">
              <img
                src={transferProof.image}
                alt={transferProof.name || "Bukti Transfer"}
                className="mx-auto h-auto w-full rounded-md object-contain"
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
              Gambar bukti transfer tidak tersedia
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Update Status Pembayaran</SheetTitle>
            <SheetDescription>
              Ubah status pembayaran dan unggah bukti transfer bila perlu.
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Status Pembayaran</Label>
              <div className="grid gap-2">
                {PAYMENT_STATUS_OPTIONS.map((option) => {
                  const selected = statusValue === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatusValue(option.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-input hover:bg-muted/50"
                      )}
                    >
                      <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", option.dot)} />
                      <span>
                        <span className="block text-sm font-medium">{option.label}</span>
                        <span className="block text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {statusValue === "paid" ? (
              <div className="space-y-2">
                <Label htmlFor="transfer-proof">
                  Bukti Transfer <span className="text-destructive">*</span>
                </Label>
                {proof ? (
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                    <span className="inline-flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{proof.name}</span>
                    </span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setProof(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
                    <Upload className="h-4 w-4" />
                    Pilih file untuk diupload
                    <input
                      id="transfer-proof"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleProofUpload}
                    />
                  </label>
                )}
                {paidRequiresProof ? (
                  <p className="text-xs text-destructive">
                    Bukti transfer wajib diupload untuk status Paid.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="note">Catatan</Label>
              <Textarea
                id="note"
                placeholder="Tambahkan catatan perubahan status..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </SheetBody>

          <SheetFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Simpan Perubahan
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
