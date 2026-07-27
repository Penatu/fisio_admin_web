import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Download,
  Droplet,
  Eye,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Ruler,
  Shield,
  Stethoscope,
  StickyNote,
  User,
  Weight,
} from "lucide-react";
import { getPatientById } from "@/lib/patients-data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
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

const STATUS_OPTIONS = [
  { value: "active", label: "Active", dot: "bg-emerald-500" },
  { value: "pending", label: "Pending", dot: "bg-amber-500" },
  { value: "inactive", label: "Inactive", dot: "bg-gray-400" },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  condition: "",
  address: "",
  emergencyContact: "",
  insurance: "",
  status: "active",
};

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
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

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = getPatientById(id);
  const [activeHistory, setActiveHistory] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function openEdit() {
    if (!patient) return;
    setForm({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      condition: patient.condition,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      insurance: patient.insurance,
      status: patient.status,
    });
    setEditOpen(true);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    patient.name = form.name;
    patient.email = form.email;
    patient.phone = form.phone;
    patient.age = form.age;
    patient.gender = form.gender;
    patient.condition = form.condition;
    patient.address = form.address;
    patient.emergencyContact = form.emergencyContact;
    patient.insurance = form.insurance;
    patient.status = form.status;
    setEditOpen(false);
  }

  const canSave = form.name.trim() && form.email.trim();

  function handleDownloadPdf(item) {
    if (!item) return;
    const rows = [
      ["Subjective", item.subjective],
      ["Objective", item.objective],
      ["Assessment", item.assessment],
      ["Plan", item.plan],
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
<title>Treatment Record - ${patient.name}</title>
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
  <p class="muted">${patient.name} — ${patient.condition}</p>
  <div class="meta">
    <div><strong>Terapis:</strong> ${item.therapist}</div>
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

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Pasien tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          Data pasien yang Anda cari tidak tersedia.
        </p>
        <Button variant="outline" onClick={() => navigate("/users/patients")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Button>
      </div>
    );
  }

  const summary = [
    { label: "Total Sesi", value: patient.sessions, icon: ClipboardList },
    { label: "Usia", value: `${patient.age} thn`, icon: User },
    { label: "Kondisi", value: patient.condition, icon: HeartPulse },
    {
      label: "Terapis Utama",
      value: patient.primaryTherapist,
      icon: Stethoscope,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/users/patients")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <Button variant="outline" className="gap-2" onClick={openEdit}>
          <Pencil className="h-4 w-4" />
          Edit Pasien
        </Button>
      </div>

      <Card className="shadow-none">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-blue-50 text-xl font-semibold text-blue-600">
              {initials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {patient.name}
              </h1>
              <StatusBadge status={patient.status} />
            </div>
            <p className="text-sm text-muted-foreground">{patient.condition}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {patient.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {patient.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {patient.address}
              </span>
            </div>
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
                <p className="text-base font-bold tracking-tight">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="information">
        <TabsList className="max-w-xl">
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="shadow-none lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Data Pribadi</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <InfoRow
                  icon={User}
                  label="Jenis Kelamin"
                  value={patient.gender}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Bergabung Sejak"
                  value={patient.joinedAt}
                />
                <InfoRow
                  icon={Droplet}
                  label="Golongan Darah"
                  value={patient.bloodType}
                />
                <InfoRow
                  icon={Ruler}
                  label="Tinggi Badan"
                  value={patient.height}
                />
                <InfoRow
                  icon={Weight}
                  label="Berat Badan"
                  value={patient.weight}
                />
                <InfoRow
                  icon={Shield}
                  label="Asuransi"
                  value={patient.insurance}
                />
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Kontak Darurat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <InfoRow
                  icon={Phone}
                  label="Kontak Darurat"
                  value={patient.emergencyContact}
                />
                <InfoRow icon={Mail} label="Email" value={patient.email} />
                <InfoRow icon={MapPin} label="Alamat" value={patient.address} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="shadow-none lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Catatan Medis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={HeartPulse}
                  label="Kondisi Utama"
                  value={patient.condition}
                />
                <InfoRow
                  icon={Activity}
                  label="Catatan Terapis"
                  value={patient.medical.notes}
                />
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Riwayat Kesehatan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Alergi</p>
                  <p className="text-sm font-medium">
                    {patient.medical.allergies.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Kondisi Kronis
                  </p>
                  <p className="text-sm font-medium">
                    {patient.medical.chronicConditions.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-none overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Terapis</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead className="text-right">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.history.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer"
                      onClick={() => setActiveHistory(item)}
                    >
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="font-medium">
                        {item.therapist}
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="shadow-none overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.payments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="font-medium">
                        {item.invoice}
                      </TableCell>
                      <TableCell>{item.method}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {item.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!activeHistory}
        onOpenChange={(open) => !open && setActiveHistory(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Treatment</DialogTitle>
            <DialogDescription>
              {activeHistory
                ? `${activeHistory.therapist} • ${activeHistory.service} • ${activeHistory.date}`
                : null}
            </DialogDescription>
          </DialogHeader>

          {activeHistory ? (
            <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
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
            <SheetTitle>Edit Pasien</SheetTitle>
            <SheetDescription>
              Perbarui informasi dan status pasien.
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telepon</Label>
              <Input
                id="edit-phone"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-age">Usia</Label>
                <Input
                  id="edit-age"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Jenis Kelamin</Label>
                <Input
                  id="edit-gender"
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-condition">Kondisi</Label>
              <Input
                id="edit-condition"
                value={form.condition}
                onChange={(e) => updateField("condition", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Alamat</Label>
              <Textarea
                id="edit-address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-emergency">Kontak Darurat</Label>
              <Input
                id="edit-emergency"
                value={form.emergencyContact}
                onChange={(e) =>
                  updateField("emergencyContact", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-insurance">Asuransi</Label>
              <Input
                id="edit-insurance"
                value={form.insurance}
                onChange={(e) => updateField("insurance", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((option) => {
                  const selected = form.status === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField("status", option.value)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
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
  );
}
