import { useEffect, useMemo, useState } from "react"
import { Check, Plus } from "lucide-react"
import {
  getUnpaidPayrollBookings,
  markBookingsPayrollPaid,
  parsePriceValue,
} from "@/lib/bookings-data"
import { createPayroll, formatPayrollAmount } from "@/lib/reports-data"
import { therapists } from "@/lib/therapists-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

const PAYMENT_METHODS = ["Bank Transfer", "E-Wallet", "Cash"]

export function CreatePayrollSheet({ open, onOpenChange, onCreated }) {
  const [therapistId, setTherapistId] = useState("")
  const [period, setPeriod] = useState("19–25 Jul 2026")
  const [sharePct, setSharePct] = useState("60")
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer")
  const [bankAccount, setBankAccount] = useState("")
  const [status, setStatus] = useState("unpaid")
  const [notes, setNotes] = useState("")
  const [selectedIds, setSelectedIds] = useState([])

  const unpaidBookings = useMemo(
    () => getUnpaidPayrollBookings(therapistId || undefined),
    [therapistId, open]
  )

  const selectedTherapist = therapists.find(
    (t) => String(t.id) === String(therapistId)
  )

  useEffect(() => {
    if (!open) return
    setTherapistId("")
    setPeriod("19–25 Jul 2026")
    setSharePct("60")
    setPaymentMethod("Bank Transfer")
    setBankAccount("")
    setStatus("unpaid")
    setNotes("")
    setSelectedIds([])
  }, [open])

  useEffect(() => {
    if (selectedTherapist) {
      setBankAccount(selectedTherapist.bankAccount || "")
      setSharePct("60")
    } else {
      setBankAccount("")
    }
    setSelectedIds([])
  }, [therapistId])

  const selectedBookings = unpaidBookings.filter((b) =>
    selectedIds.includes(b.id)
  )

  const totalGross = selectedBookings.reduce(
    (sum, b) => sum + parsePriceValue(b),
    0
  )
  const effectiveShare = Number(sharePct) || 0
  const totalPayout = selectedBookings.reduce((sum, b) => {
    const price = parsePriceValue(b)
    return sum + Math.round((price * effectiveShare) / 100)
  }, 0)

  function toggleBooking(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selectedIds.length === unpaidBookings.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(unpaidBookings.map((b) => b.id))
    }
  }

  const canSubmit =
    therapistId &&
    selectedIds.length > 0 &&
    bankAccount.trim() &&
    period.trim()

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    const payroll = createPayroll({
      therapistId,
      therapistName: selectedTherapist?.name || "Therapist",
      period,
      sharePct: effectiveShare,
      paymentMethod,
      bankAccount,
      status,
      notes,
      bookingIds: selectedIds,
      totalPayout,
    })

    if (status === "paid") {
      markBookingsPayrollPaid(selectedIds)
    }

    onCreated?.(payroll)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0 sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Create Payroll</SheetTitle>
            <SheetDescription>
              Pilih booking yang belum dibayar ke terapis, lalu lengkapi detail
              pembayaran.
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="therapist">Terapis</Label>
              <select
                id="therapist"
                className={fieldClass}
                value={therapistId}
                onChange={(e) => setTherapistId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Pilih terapis
                </option>
                {therapists.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="period">Periode</Label>
                <Input
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="share">Bagi Hasil (%)</Label>
                <Input
                  id="share"
                  type="number"
                  min="0"
                  max="100"
                  value={sharePct}
                  onChange={(e) => setSharePct(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Booking Belum Dibayar</Label>
                {unpaidBookings.length > 0 ? (
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {selectedIds.length === unpaidBookings.length
                      ? "Batalkan semua"
                      : "Pilih semua"}
                  </button>
                ) : null}
              </div>

              {!therapistId ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                  Pilih terapis terlebih dahulu untuk melihat booking yang belum
                  dibayar.
                </p>
              ) : unpaidBookings.length === 0 ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                  Tidak ada booking belum dibayar untuk terapis ini.
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-2">
                  {unpaidBookings.map((booking) => {
                    const checked = selectedIds.includes(booking.id)
                    const payout = Math.round(
                      (parsePriceValue(booking) * effectiveShare) / 100
                    )
                    return (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() => toggleBooking(booking.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                          checked
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:bg-muted/50"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          )}
                        >
                          {checked ? <Check className="h-3 w-3" /> : null}
                        </span>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-medium">
                              {booking.code}
                            </span>
                            <StatusBadge status={booking.payment} />
                            {booking.payment === "unpaid" ? (
                              <Badge variant="warning">Patient unpaid</Badge>
                            ) : null}
                          </div>
                          <p className="text-sm font-medium">
                            {booking.patient} • {booking.service}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.date} • {booking.time} • {booking.price}
                          </p>
                          <p className="text-xs font-medium text-foreground">
                            Payout terapis: {formatPayrollAmount(payout)}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3">
              <div>
                <p className="text-xs text-muted-foreground">Booking dipilih</p>
                <p className="text-sm font-semibold">{selectedIds.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Gross</p>
                <p className="text-sm font-semibold">
                  {formatPayrollAmount(totalGross)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">
                  Total Payout Terapis ({effectiveShare}%)
                </p>
                <p className="text-lg font-bold tracking-tight">
                  {formatPayrollAmount(totalPayout)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank">No. Rekening</Label>
              <Input
                id="bank"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Bank - nomor rekening a.n. nama"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="method">Metode Pembayaran</Label>
                <select
                  id="method"
                  className={fieldClass}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status Payroll</Label>
                <select
                  id="status"
                  className={fieldClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Catatan tambahan untuk payroll ini..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </SheetBody>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="gap-2" disabled={!canSubmit}>
              <Plus className="h-4 w-4" />
              Buat Payroll
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
