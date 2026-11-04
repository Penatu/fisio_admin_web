import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Receipt,
  Stethoscope,
  StickyNote,
  Upload,
  User,
  X,
} from "lucide-react"
import { ORDER_STATUS, ORDER_STATUS_FLOW, ORDER_STATUS_OPTIONS } from "@/lib/bookings-data"
import { useGetBookingDetail } from "@/pages/bookings/hooks/useGetBookingDetail"
import { cn } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { StatusBadge } from "@/components/shared/status-badge"

const DISPLAY_STATUS = {
  ...ORDER_STATUS,
  new: {
    label: "New",
    description: "Request masuk",
    badge: "info",
    dot: "bg-blue-500",
  },
  cancelled: ORDER_STATUS.canceled,
}

function stepperStatus(status) {
  if (status === "new") return "received_request"
  if (status === "cancelled") return "canceled"
  return status
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

function SoapSection({ label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-relaxed">{value || "-"}</p>
    </div>
  )
}

function StatusStepper({ current }) {
  if (current === "canceled") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-white">
          <X className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-destructive">Canceled</p>
          <p className="text-xs text-muted-foreground">{ORDER_STATUS.canceled.description}</p>
        </div>
      </div>
    )
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(current)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const done = index < currentIndex
        const active = index === currentIndex
        const cfg = ORDER_STATUS[status]
        return (
          <div key={status} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
            <div className="flex items-center gap-3 sm:w-full sm:flex-col">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  active && "border-primary bg-primary text-primary-foreground",
                  !done && !active && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < ORDER_STATUS_FLOW.length - 1 ? (
                <div
                  className={cn(
                    "hidden h-0.5 w-full flex-1 sm:block",
                    done ? "bg-emerald-500" : "bg-muted"
                  )}
                />
              ) : null}
            </div>
            <div className="sm:mt-2">
              <p className={cn("text-sm font-medium", active && "text-primary")}>{cfg.label}</p>
              <p className="text-xs text-muted-foreground">{cfg.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { booking, setBooking, isLoading, error } = useGetBookingDetail(id)
  const payment = booking?.paymentDetail || null
  const [editOpen, setEditOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  const [statusValue, setStatusValue] = useState("")
  const [note, setNote] = useState("")
  const [consent, setConsent] = useState(null)
  const [medicalRecordNumber, setMedicalRecordNumber] = useState("")
  const [subjective, setSubjective] = useState("")
  const [objective, setObjective] = useState("")
  const [assessment, setAssessment] = useState("")
  const [plan, setPlan] = useState("")
  const [supportingExamination, setSupportingExamination] = useState("")
  const [evidenceBasedPractice, setEvidenceBasedPractice] = useState("")

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Booking tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          {error || "Data booking yang Anda cari tidak tersedia."}
        </p>
        <Button variant="outline" onClick={() => navigate("/bookings")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Button>
      </div>
    )
  }

  function openEdit() {
    setStatusValue(booking.orderStatus)
    setNote("")
    setConsent(booking.informedConsent)
    setMedicalRecordNumber(booking.treatmentReport?.medicalRecordNumber || "")
    setSubjective(booking.treatmentReport?.subjective || "")
    setObjective(booking.treatmentReport?.objective || "")
    setAssessment(booking.treatmentReport?.assessment || "")
    setPlan(booking.treatmentReport?.plan || "")
    setSupportingExamination(booking.treatmentReport?.supportingExamination || "")
    setEvidenceBasedPractice(booking.treatmentReport?.evidenceBasedPractice || "")
    setEditOpen(true)
  }

  function handleConsentUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      setConsent({ name: file.name, url: URL.createObjectURL(file) })
    }
  }

  function handleSave() {
    const trimmedNote = note.trim()
    setBooking((current) => ({
      ...current,
      orderStatus: statusValue,
      informedConsent: statusValue === "report" ? consent : current.informedConsent,
      treatmentReport:
        statusValue === "report" || statusValue === "done"
          ? {
              medicalRecordNumber: medicalRecordNumber.trim(),
              subjective: subjective.trim(),
              objective: objective.trim(),
              assessment: assessment.trim(),
              plan: plan.trim(),
              supportingExamination: supportingExamination.trim(),
              evidenceBasedPractice: evidenceBasedPractice.trim(),
            }
          : current.treatmentReport,
      notes: trimmedNote || current.notes,
      statusHistory: [
        ...(current.statusHistory || []),
        {
          status: statusValue,
          note: trimmedNote || ORDER_STATUS[statusValue]?.description || "",
          time: new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ],
    }))
    setEditOpen(false)
  }

  const reportRequiresConsent = statusValue === "report" && !consent
  const reportRequiresMedicalRecord =
    (statusValue === "report" || statusValue === "done") && !medicalRecordNumber.trim()
  const canSave = !!statusValue && !reportRequiresConsent && !reportRequiresMedicalRecord
  const treatmentReport = booking.treatmentReport
  const hasTreatmentReport =
    treatmentReport &&
    (treatmentReport.medicalRecordNumber ||
      treatmentReport.subjective ||
      treatmentReport.objective ||
      treatmentReport.assessment ||
      treatmentReport.plan ||
      treatmentReport.supportingExamination ||
      treatmentReport.evidenceBasedPractice)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/bookings")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <Button variant="outline" className="gap-2" onClick={openEdit}>
          <Pencil className="h-4 w-4" />
          Edit Status
        </Button>
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-xl font-bold tracking-tight">{booking.code}</h1>
              <Badge variant={DISPLAY_STATUS[booking.orderStatus]?.badge || "secondary"}>
                {DISPLAY_STATUS[booking.orderStatus]?.label || booking.orderStatus || "-"}
              </Badge>
              <StatusBadge status={booking.payment} />
            </div>
            <p className="text-sm text-muted-foreground">
              {booking.service} • {booking.date} • {booking.time}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusStepper current={stepperStatus(booking.orderStatus)} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Pasien</CardTitle>
            {booking.patientCode ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(`/users/patients/${booking.patientCode}`)}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Detail Pasien
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-5">
            <InfoRow icon={User} label="Nama" value={booking.patient} />
            <InfoRow icon={Phone} label="Telepon" value={booking.patientPhone} />
            <InfoRow icon={Mail} label="Email" value={booking.patientEmail} />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Terapis</CardTitle>
            {booking.therapistCode ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(`/users/therapists/${booking.therapistCode}`)}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Detail Terapis
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-5">
            <InfoRow icon={Stethoscope} label="Nama" value={booking.therapist} />
            <InfoRow icon={Phone} label="Telepon" value={booking.therapistPhone} />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Detail Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <InfoRow icon={CalendarDays} label="Tanggal" value={`${booking.date} • ${booking.time}`} />
            <InfoRow icon={Clock} label="Durasi" value={booking.duration} />
            <InfoRow icon={DollarSign} label="Harga" value={booking.price} />
            <InfoRow icon={MapPin} label="Alamat" value={booking.address} />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Informasi Pembayaran
          </CardTitle>
          {payment ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/payments/${payment.id}`)}
            >
              <Receipt className="h-3.5 w-3.5" />
              Detail Payment
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {payment ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InfoRow icon={Receipt} label="Invoice" value={payment.invoice} />
              <InfoRow icon={CreditCard} label="Metode" value={payment.method} />
              <InfoRow icon={DollarSign} label="Nominal" value={payment.amount} />
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Check className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-0.5">
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              </div>
              <InfoRow icon={FileText} label="Transaction ID" value={payment.transactionId} />
              <InfoRow icon={CalendarDays} label="Tanggal Bayar" value={payment.paidAt} />
              <InfoRow icon={DollarSign} label="Harga Layanan" value={payment.servicePrice} />
              <InfoRow icon={DollarSign} label="Biaya Admin" value={payment.adminFee} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Data pembayaran untuk booking ini belum tersedia.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Riwayat Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {booking.statusHistory?.map((item, idx) => (
              <div
                key={idx}
                className={
                  idx !== booking.statusHistory.length - 1
                    ? "flex items-start gap-3 border-b py-3"
                    : "flex items-start gap-3 py-3"
                }
              >
                <span
                  className={cn(
                    "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                    DISPLAY_STATUS[item.status]?.dot || "bg-muted-foreground"
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{DISPLAY_STATUS[item.status]?.label || item.status}</p>
                  {item.note ? (
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  ) : null}
                </div>
                <span className="whitespace-nowrap text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Laporan Treatment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasTreatmentReport ? (
                <>
                  <InfoRow
                    icon={ClipboardList}
                    label="No. Rekam Medik"
                    value={treatmentReport.medicalRecordNumber || "-"}
                  />
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setReportOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                    Lihat Laporan Treatment
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Laporan treatment belum tersedia.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                Catatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.notes?.trim() || booking.complaint?.trim() ? (
                <div className="space-y-3 text-sm text-muted-foreground">
                  {booking.notes?.trim() ? <p>{booking.notes}</p> : null}
                  {booking.complaint?.trim() ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Keluhan</p>
                      <p className="mt-1">{booking.complaint}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada catatan.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Laporan Treatment</DialogTitle>
            <DialogDescription>
              {booking.code} • {booking.patient} • {booking.service}
            </DialogDescription>
          </DialogHeader>

          {hasTreatmentReport ? (
            <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
              <div className="rounded-lg border bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  No. Rekam Medik / History Treatment
                </p>
                <p className="font-mono text-sm font-semibold">
                  {treatmentReport.medicalRecordNumber || "-"}
                </p>
              </div>

              <SoapSection label="Subjective" value={treatmentReport.subjective} />
              <SoapSection label="Objective" value={treatmentReport.objective} />
              <SoapSection label="Assessment" value={treatmentReport.assessment} />
              <SoapSection label="Plan" value={treatmentReport.plan} />
              <SoapSection
                label="Pemeriksaan Penunjang"
                value={treatmentReport.supportingExamination}
              />
              <SoapSection
                label="EBP — Evidence Based Practice"
                value={treatmentReport.evidenceBasedPractice}
              />

              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Informed Consent
                </p>
                {booking.informedConsent?.url ? (
                  <a
                    href={booking.informedConsent.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {booking.informedConsent.name}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Informed consent belum diupload.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Laporan treatment belum tersedia.
            </p>
          )}

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Order Status</SheetTitle>
            <SheetDescription>
              Ubah status booking dan tambahkan catatan.
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Order Status</Label>
              <div className="grid gap-2">
                {ORDER_STATUS_OPTIONS.map((option) => {
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

            {statusValue === "report" ? (
              <div className="space-y-2">
                <Label htmlFor="consent">
                  Upload Informed Consent <span className="text-destructive">*</span>
                </Label>
                {consent ? (
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                    <span className="inline-flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{consent.name}</span>
                    </span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setConsent(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
                    <Upload className="h-4 w-4" />
                    Pilih file untuk diupload
                    <input
                      id="consent"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleConsentUpload}
                    />
                  </label>
                )}
                {reportRequiresConsent ? (
                  <p className="text-xs text-destructive">
                    Informed consent wajib diupload untuk status Report.
                  </p>
                ) : null}
              </div>
            ) : null}

            {statusValue === "report" || statusValue === "done" ? (
              <div className="space-y-4 rounded-lg border p-3">
                <p className="text-sm font-medium">Laporan Treatment</p>

                <div className="space-y-2">
                  <Label htmlFor="medical-record">
                    No. Rekam Medik / History Treatment{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="medical-record"
                    placeholder="Contoh: RM-2026-01455"
                    value={medicalRecordNumber}
                    onChange={(e) => setMedicalRecordNumber(e.target.value)}
                  />
                  {reportRequiresMedicalRecord ? (
                    <p className="text-xs text-destructive">
                      Nomor rekam medik wajib diisi.
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjective">Subjective</Label>
                  <Textarea
                    id="subjective"
                    placeholder="Keluhan subjektif pasien..."
                    value={subjective}
                    onChange={(e) => setSubjective(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Objective</Label>
                  <Textarea
                    id="objective"
                    placeholder="Temuan objektif pemeriksaan..."
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessment">Assessment</Label>
                  <Textarea
                    id="assessment"
                    placeholder="Assessment / diagnosis fisioterapi..."
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Textarea
                    id="plan"
                    placeholder="Rencana terapi..."
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supporting-exam">Pemeriksaan Penunjang</Label>
                  <Textarea
                    id="supporting-exam"
                    placeholder="Hasil pemeriksaan penunjang..."
                    value={supportingExamination}
                    onChange={(e) => setSupportingExamination(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ebp">EBP — Evidence Based Practice</Label>
                  <Textarea
                    id="ebp"
                    placeholder="Referensi evidence based practice..."
                    value={evidenceBasedPractice}
                    onChange={(e) => setEvidenceBasedPractice(e.target.value)}
                  />
                </div>
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
