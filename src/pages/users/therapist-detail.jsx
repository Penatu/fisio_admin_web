import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Crosshair,
  Download,
  Eye,
  FileBadge,
  FileText,
  GraduationCap,
  IdCard,
  Landmark,
  Languages,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Loader2,
  Star,
  StickyNote,
  User,
  Users,
} from "lucide-react";
import { useGetTherapistDetail } from "@/pages/users/hooks/useGetTherapistDetail";
import { useUpdateTherapistStatus } from "@/pages/users/hooks/useUpdateTherapistStatus";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";

const DAY_ORDER = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

function formatShortDate(date) {
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

function parseScheduleDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfWeek(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const diffToMonday = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - diffToMonday);
  return copy;
}

function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function weekTitle(weekStart) {
  const diffWeeks = Math.round(
    (weekStart.getTime() - startOfWeek(new Date()).getTime()) / 604800000,
  );
  if (diffWeeks === 0) return "Minggu Ini";
  if (diffWeeks === 1) return "Minggu Depan";
  if (diffWeeks === 2) return "2 Minggu Lagi";
  return `Minggu ${formatShortDate(weekStart)}`;
}

function buildScheduleWeeks(scheduleDates) {
  const dates = scheduleDates.map(parseScheduleDate).filter(Boolean);
  if (!dates.length) return [];

  const scheduled = new Set(scheduleDates);
  let weekStart = startOfWeek(new Date(Math.min(...dates.map((date) => date.getTime()))));
  const lastWeek = startOfWeek(new Date(Math.max(...dates.map((date) => date.getTime()))));
  const weeks = [];

  while (weekStart <= lastWeek) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const days = DAY_ORDER.map((dayName, dayIndex) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayIndex);
      const iso = toISODate(date);
      return {
        dayName,
        dateLabel: formatShortDate(date),
        scheduled: scheduled.has(iso),
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });

    weeks.push({
      key: toISODate(weekStart),
      label: weekTitle(weekStart),
      range: `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`,
      days,
    });

    weekStart = new Date(weekStart);
    weekStart.setDate(weekStart.getDate() + 7);
  }

  return weeks;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active", dot: "bg-emerald-500" },
  { value: "rejected", label: "Rejected", dot: "bg-red-500" },
];

function initials(name, email) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  const source = parts.length > 1 ? parts.slice(1) : parts;
  const letters = source
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  if (letters) return letters.toUpperCase();
  return (email || "?").slice(0, 1).toUpperCase();
}

function displayValue(value) {
  if (value == null) return "";
  return String(value).trim();
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
  );
}

function DocumentRow({ icon: Icon, label, value, onView }) {
  return (
    <button
      type="button"
      onClick={onView}
      className="group flex w-full items-start gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
      <Eye className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

function TimelineList({
  items,
  emptyLabel,
  primaryKey,
  secondaryKey,
  metaKey,
  noteKey,
  onView,
}) {
  if (!items?.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{item[primaryKey]}</p>
            <p className="text-sm text-muted-foreground">
              {item[secondaryKey]}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item[metaKey]}
            </p>
            {noteKey && item[noteKey] ? (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item[noteKey]}
              </p>
            ) : null}
            {item.fileUrl && onView ? (
              <button
                type="button"
                onClick={() => onView(item)}
                className="mt-1 text-xs font-medium text-primary hover:underline"
              >
                Lihat dokumen
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function SoapSection({ label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-relaxed">{value || "-"}</p>
    </div>
  );
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < value
              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
              : "h-3.5 w-3.5 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  specialty: "",
  experience: "",
  status: "in_review",
  declineNotes: "",
};

export default function TherapistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { therapist, setTherapist, isLoading, error } =
    useGetTherapistDetail(id);
  const {
    updateStatus,
    isSubmitting,
    error: updateError,
    clearError,
  } = useUpdateTherapistStatus();
  const [activeDoc, setActiveDoc] = useState(null);
  const [activeHistory, setActiveHistory] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function openEdit() {
    if (!therapist) return;
    clearError();
    const status =
      therapist.status === "active" || therapist.status === "rejected"
        ? therapist.status
        : "";
    setForm({
      name: therapist.name,
      email: therapist.email,
      phone: therapist.phone,
      location: therapist.location,
      specialty: therapist.specialty,
      experience: therapist.experience,
      status,
      declineNotes: status === "rejected" ? therapist.declineNotes || "" : "",
    });
    setEditOpen(true);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    const reason = form.status === "rejected" ? form.declineNotes.trim() : "";

    try {
      await updateStatus(therapist.code || id, {
        status: form.status,
        reason,
      });
      setTherapist((current) => ({
        ...current,
        status: form.status,
        declineNotes: reason,
      }));
      setEditOpen(false);
    } catch {
      // The hook stores the message shown in the sheet.
    }
  }

  function handleDownloadPdf(item) {
    if (!item) return;
    const rows = [
      ["Subjective", item.subjective],
      ["Objective", item.objective],
      ["Assessment", item.assessment],
      ["Plan", item.plan],
      ["Pemeriksaan Penunjang", item.supportingExamination],
      ["Evidence Based Practice", item.evidenceBasedPractice],
      ["Jadwal Kunjungan Berikutnya", item.nextVisit],
      ["Catatan", item.notes],
    ]
      .map(
        ([label, value]) =>
          `<div class="section"><h3>${label}</h3><p>${value || "-"}</p></div>`,
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Treatment Record - ${item.patient}</title>
<style>
  * { font-family: Arial, Helvetica, sans-serif; color: #1e293b; }
  body { margin: 40px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .muted { color: #64748b; font-size: 13px; margin: 0; }
  .meta { margin: 16px 0 24px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; }
  .meta div { font-size: 13px; margin: 2px 0; }
  .section { margin-bottom: 16px; }
  .section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .04em; color: #64748b; margin: 0 0 4px; }
  .section p { font-size: 14px; margin: 0; line-height: 1.5; white-space: pre-wrap; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
</style>
</head>
<body>
  <h1>Rekam Treatment Fisioterapi</h1>
  <p class="muted">${therapist.name} — ${therapist.specialty}</p>
  <div class="meta">
    <div><strong>No. Rekam Medik:</strong> ${item.medicalRecordNumber || "-"}</div>
    <div><strong>Pasien:</strong> ${item.patient}</div>
    <div><strong>Tanggal:</strong> ${item.date}</div>
    <div><strong>Layanan:</strong> ${item.service}</div>
    <div><strong>Inform Consent:</strong> ${item.informConsent?.name || "-"}</div>
  </div>
  ${rows}
  <hr />
  <p class="muted">Dokumen dibuat otomatis oleh Fisiobook Admin pada ${new Date().toLocaleString("id-ID")}</p>
  <script>window.onload = function () { window.print(); }</script>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  const declineNotesRequired = form.status === "rejected";
  const canSave =
    (form.status === "active" || form.status === "rejected") &&
    (!declineNotesRequired || form.declineNotes.trim()) &&
    !isSubmitting;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Therapist tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          {error || "Data therapist yang Anda cari tidak tersedia."}
        </p>
        <Button variant="outline" onClick={() => navigate("/users/therapists")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Button>
      </div>
    );
  }

  const scheduleWeeks = therapist.schedule?.length
    ? buildScheduleWeeks(therapist.schedule)
    : [];

  const summary = [
    {
      label: "Total Sesi",
      value: therapist.completedSessions,
      icon: ClipboardList,
    },
    { label: "Total Pasien", value: therapist.totalPatients, icon: Users },
    { label: "Rating", value: therapist.rating, icon: Star },
    { label: "Pengalaman", value: therapist.experience, icon: Briefcase },
  ].filter((item) => item.value != null && item.value !== "");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/users/therapists")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <Button variant="outline" className="gap-2" onClick={openEdit}>
          <Pencil className="h-4 w-4" />
          Edit Therapist Status
        </Button>
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            {therapist.photo ? (
              <AvatarImage src={therapist.photo} alt={therapist.name} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
              {initials(therapist.name, therapist.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {therapist.name || "-"}
              </h1>
              <StatusBadge status={therapist.status} />
            </div>
            {therapist.specialty || therapist.code ? (
              <p className="text-sm text-muted-foreground">
                {therapist.specialty || therapist.code}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {therapist.email || "-"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {therapist.phone || "-"}
              </span>
              {therapist.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {therapist.location}
                </span>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {therapist.status === "rejected" && therapist.declineNotes ? (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">
              Alasan Ditolak
            </p>
            <p className="text-sm text-muted-foreground">
              {therapist.declineNotes}
            </p>
          </div>
        </div>
      ) : null}

      {summary.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => (
            <Card key={item.label} className="shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold tracking-tight">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <Tabs defaultValue="information">
        <TabsList className="max-w-2xl">
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="shadow-none lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Tentang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {therapist.bio ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {therapist.bio}
                  </p>
                ) : null}
                <div className="grid gap-5 sm:grid-cols-2">
                  {displayValue(therapist.code) ? (
                    <InfoRow
                      icon={User}
                      label="Kode Terapis"
                      value={therapist.code}
                    />
                  ) : null}
                  {displayValue(therapist.onboardingCode) ? (
                    <InfoRow
                      icon={FileText}
                      label="Kode Onboarding"
                      value={therapist.onboardingCode}
                    />
                  ) : null}
                  {displayValue(therapist.gender) ? (
                    <InfoRow
                      icon={User}
                      label="Jenis Kelamin"
                      value={therapist.gender}
                    />
                  ) : null}
                  {displayValue(therapist.joinedAt) ? (
                    <InfoRow
                      icon={CalendarDays}
                      label="Bergabung Sejak"
                      value={therapist.joinedAt}
                    />
                  ) : null}
                  {displayValue(therapist.licenseNumber) ? (
                    <InfoRow
                      icon={Award}
                      label="Nomor Lisensi"
                      value={therapist.licenseNumber}
                    />
                  ) : null}
                  {displayValue(therapist.specialty) ? (
                    <InfoRow
                      icon={Briefcase}
                      label="Spesialisasi"
                      value={therapist.specialty}
                    />
                  ) : null}
                  {displayValue(therapist.education) ? (
                    <InfoRow
                      icon={GraduationCap}
                      label="Pendidikan"
                      value={therapist.education}
                    />
                  ) : null}
                  {therapist.languages?.length ? (
                    <InfoRow
                      icon={Languages}
                      label="Bahasa"
                      value={therapist.languages.join(", ")}
                    />
                  ) : null}
                  {displayValue(therapist.approvalByName) ? (
                    <InfoRow
                      icon={User}
                      label="Disetujui Oleh"
                      value={therapist.approvalByName}
                    />
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Kontak & Alamat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={therapist.email || "-"}
                />
                <InfoRow
                  icon={Phone}
                  label="Telepon"
                  value={therapist.phone || "-"}
                />
                <InfoRow
                  icon={MapPin}
                  label="Lokasi"
                  value={therapist.location || "-"}
                />
                <InfoRow
                  icon={Building2}
                  label="Alamat"
                  value={therapist.address || "-"}
                />
                <InfoRow
                  icon={Crosshair}
                  label="Koordinat (Lat, Long)"
                  value={
                    therapist.latitude != null && therapist.longitude != null
                      ? `${therapist.latitude}, ${therapist.longitude}`
                      : "-"
                  }
                />
              </CardContent>
            </Card>

            <Card className="shadow-none lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-base">Dokumen & Legalitas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {therapist.ktpImage ? (
                  <DocumentRow
                    icon={IdCard}
                    label="KTP — Nomor Identitas"
                    value={therapist.ktp}
                    onView={() =>
                      setActiveDoc({
                        title: "KTP — Nomor Identitas",
                        value: therapist.ktp,
                        image: therapist.ktpImage,
                      })
                    }
                  />
                ) : null}
                {therapist.strImage ? (
                  <DocumentRow
                    icon={FileBadge}
                    label="STR — Surat Tanda Registrasi"
                    value={therapist.str}
                    onView={() =>
                      setActiveDoc({
                        title: "STR — Surat Tanda Registrasi",
                        value: therapist.str,
                        image: therapist.strImage,
                      })
                    }
                  />
                ) : null}
                {therapist.sipImage ? (
                  <DocumentRow
                    icon={FileText}
                    label="SIP — Surat Izin Praktik"
                    value={therapist.sip}
                    onView={() =>
                      setActiveDoc({
                        title: "SIP — Surat Izin Praktik",
                        value: therapist.sip,
                        image: therapist.sipImage,
                      })
                    }
                  />
                ) : null}
                {therapist.ijazahImage ? (
                  <DocumentRow
                    icon={GraduationCap}
                    label="Ijazah — Nomor Ijazah"
                    value={therapist.ijazah}
                    onView={() =>
                      setActiveDoc({
                        title: "Ijazah — Nomor Ijazah",
                        value: therapist.ijazah,
                        image: therapist.ijazahImage,
                      })
                    }
                  />
                ) : null}
                {therapist.ukomCertificate ? (
                  <DocumentRow
                    icon={Award}
                    label="Sertifikat UKOM"
                    value={`${therapist.ukomCertificate.number} · ${therapist.ukomCertificate.issuedAt}`}
                    onView={() =>
                      setActiveDoc({
                        title: "Sertifikat UKOM",
                        value: `${therapist.ukomCertificate.number} · Diterbitkan ${therapist.ukomCertificate.issuedAt}`,
                        image: therapist.ukomCertificate.image,
                      })
                    }
                  />
                ) : null}
                <InfoRow
                  icon={Landmark}
                  label="No. Rekening"
                  value={therapist.bankAccount || "-"}
                />
              </CardContent>
            </Card>

            <Card className="shadow-none lg:col-span-3 xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Riwayat Pekerjaan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineList
                  items={therapist.workHistory}
                  emptyLabel="Belum ada riwayat pekerjaan."
                  primaryKey="position"
                  secondaryKey="company"
                  metaKey="period"
                  noteKey="description"
                />
              </CardContent>
            </Card>

            <Card className="shadow-none lg:col-span-3 xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Riwayat Pendidikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineList
                  items={therapist.educationHistory}
                  emptyLabel="Belum ada riwayat pendidikan."
                  primaryKey="degree"
                  secondaryKey="institution"
                  metaKey="period"
                  onView={(item) =>
                    setActiveDoc({
                      title: "Ijazah",
                      value: `${item.degree} · ${item.institution}`,
                      image: item.fileUrl,
                    })
                  }
                />
              </CardContent>
            </Card>

            <Card className="shadow-none lg:col-span-3 xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  Pelatihan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineList
                  items={therapist.trainings}
                  emptyLabel="Belum ada data pelatihan."
                  primaryKey="name"
                  secondaryKey="organizer"
                  metaKey="year"
                  onView={(item) =>
                    setActiveDoc({
                      title: item.name,
                      value: `${item.organizer} · ${item.year}`,
                      image: item.fileUrl,
                    })
                  }
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card className="shadow-none overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Layanan</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {therapist.services?.length ? (
                    therapist.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">
                          {service.name}
                        </TableCell>
                        <TableCell>{service.duration}</TableCell>
                        <TableCell>{service.price}</TableCell>
                        <TableCell>
                          <StatusBadge status={service.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Belum ada layanan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-none overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. Rekam Medik</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead className="text-right">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {therapist.history?.length ? (
                    therapist.history.map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => setActiveHistory(item)}
                      >
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.medicalRecordNumber || "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.patient}
                        </TableCell>
                        <TableCell>{item.service}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {item.amount}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHistory(item);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            Lihat
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Belum ada riwayat treatment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid gap-4">
            {therapist.reviews?.length ? (
              therapist.reviews.map((review) => (
                <Card key={review.id} className="shadow-none">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">
                            {review.patient.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {review.patient}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <StarRating value={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-none">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Belum ada ulasan.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="flex flex-col gap-6">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Area Cakupan
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {therapist.coverageAreas?.length ? (
                  therapist.coverageAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {area}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada area cakupan.
                  </p>
                )}
              </CardContent>
            </Card>

            {scheduleWeeks.length ? (
              scheduleWeeks.map((week) => (
                <Card key={week.key} className="shadow-none">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {week.label}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {week.range}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {week.days.map((day) => (
                      <div
                        key={day.dayName}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-4 py-3",
                          day.isToday && "border-primary bg-primary/5",
                        )}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {day.dayName}
                            {day.isToday ? (
                              <span className="ml-2 text-xs font-normal text-primary">
                                Hari ini
                              </span>
                            ) : null}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {day.dateLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {day.scheduled ? (
                            <StatusBadge status={therapist.status} />
                          ) : (
                            <Badge variant="secondary">Libur</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Jadwal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Jadwal belum tersedia.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!activeDoc}
        onOpenChange={(open) => !open && setActiveDoc(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeDoc?.title}</DialogTitle>
            <DialogDescription>{activeDoc?.value}</DialogDescription>
          </DialogHeader>
          {activeDoc?.image ? (
            <div className="max-h-[70vh] overflow-auto rounded-lg border bg-muted/30 p-2">
              <img
                src={activeDoc.image}
                alt={activeDoc.title}
                className="mx-auto h-auto w-full rounded-md object-contain"
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
              Gambar dokumen tidak tersedia
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!activeHistory}
        onOpenChange={(open) => !open && setActiveHistory(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Treatment</DialogTitle>
            <DialogDescription>
              {activeHistory
                ? `${activeHistory.patient} • ${activeHistory.service} • ${activeHistory.date}`
                : null}
            </DialogDescription>
          </DialogHeader>

          {activeHistory ? (
            <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
              <div className="rounded-lg border bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground">No. Rekam Medik</p>
                <p className="font-mono text-sm font-semibold">
                  {activeHistory.medicalRecordNumber || "-"}
                </p>
              </div>

              <SoapSection
                label="Subjective"
                value={activeHistory.subjective}
              />
              <SoapSection label="Objective" value={activeHistory.objective} />
              <SoapSection
                label="Assessment"
                value={activeHistory.assessment}
              />
              <SoapSection label="Plan" value={activeHistory.plan} />
              <SoapSection
                label="Pemeriksaan Penunjang"
                value={activeHistory.supportingExamination}
              />
              <SoapSection
                label="Evidence Based Practice"
                value={activeHistory.evidenceBasedPractice}
              />

              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Uploaded Inform Consent
                </p>
                {activeHistory.informConsent?.url ? (
                  <a
                    href={activeHistory.informConsent.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {activeHistory.informConsent.name}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada dokumen
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Jadwal Kunjungan Berikutnya
                    </p>
                    <p className="text-sm font-medium">
                      {activeHistory.nextVisit || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Catatan</p>
                    <p className="text-sm font-medium">
                      {activeHistory.notes || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setActiveHistory(null)}>
              Tutup
            </Button>
            <Button
              className="gap-2"
              onClick={() => handleDownloadPdf(activeHistory)}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Therapist Status</SheetTitle>
            <SheetDescription>
              Active menyimpan status VERIFIED. Rejected menyimpan status
              REJECTED dan wajib menyertakan alasan.
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((option) => {
                  const selected = form.status === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("status", option.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        selected
                          ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                          : "border-input text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      <span
                        className={cn("h-2 w-2 rounded-full", option.dot)}
                      />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {form.status === "rejected" ? (
              <div className="space-y-2">
                <Label htmlFor="edit-decline-notes">
                  Catatan Penolakan <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="edit-decline-notes"
                  placeholder="Jelaskan alasan mengubah status menjadi rejected..."
                  value={form.declineNotes}
                  onChange={(e) => updateField("declineNotes", e.target.value)}
                />
                {!form.declineNotes.trim() ? (
                  <p className="text-xs text-destructive">
                    Catatan wajib diisi untuk status rejected.
                  </p>
                ) : null}
              </div>
            ) : null}

            {updateError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {updateError}
              </div>
            ) : null}
          </SheetBody>

          <SheetFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
