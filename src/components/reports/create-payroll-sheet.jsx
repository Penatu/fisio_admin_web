import { useEffect, useState } from "react"
import { Check, Plus } from "lucide-react"
import { formatPayrollAmount, formatPayrollDate } from "@/lib/reports-data"
import { useCreatePayroll } from "@/pages/reports/hooks/useCreatePayroll"
import { useGetOutstandingPayroll } from "@/pages/reports/hooks/useGetOutstandingPayroll"
import { useGetPayrollTherapists } from "@/pages/reports/hooks/useGetPayrollTherapists"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Autocomplete } from "@/components/ui/autocomplete"
import { Button } from "@/components/ui/button"
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

export function CreatePayrollSheet({ open, onOpenChange, onCreated }) {
  const [therapist, setTherapist] = useState(null)
  const [therapistSearch, setTherapistSearch] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const therapistCode = therapist?.code || ""
  const { therapists, isLoading: isTherapistsLoading, error: therapistsError } =
    useGetPayrollTherapists(open, therapistSearch)
  const {
    items: unpaidItems,
    isLoading: isOutstandingLoading,
    error: outstandingError,
  } = useGetOutstandingPayroll(open ? therapistCode : "")
  const { createPayroll, isSubmitting, error: submitError, clearError } = useCreatePayroll()

  useEffect(() => {
    if (!open) return
    setTherapist(null)
    setTherapistSearch("")
    setNotes("")
    setSelectedIds([])
    clearError()
  }, [open, clearError])

  useEffect(() => {
    setSelectedIds([])
  }, [therapistCode])

  const selectedItems = unpaidItems.filter((item) => selectedIds.includes(item.code))
  const bankAccount = therapist?.bankAccount || ""
  const paymentMethod = therapist?.paymentMethod || ""
  const totalGross = selectedItems.reduce((sum, item) => sum + item.grossValue, 0)
  const totalPayout = selectedItems.reduce((sum, item) => sum + item.payoutValue, 0)
  const canSubmit = Boolean(therapistCode && selectedIds.length > 0 && !isSubmitting)

  function toggleBooking(code) {
    setSelectedIds((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    )
  }

  function toggleAll() {
    if (selectedIds.length === unpaidItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(unpaidItems.map((item) => item.code))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit) return

    try {
      const payroll = await createPayroll({
        payrollCodes: selectedIds,
        therapistCode,
        note: notes.trim(),
      })
      onCreated?.(payroll)
      onOpenChange(false)
    } catch {
      // The hook stores the message shown in the sheet.
    }
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
              <Autocomplete
                id="therapist"
                inputValue={therapistSearch}
                onInputChange={setTherapistSearch}
                options={therapists}
                value={therapist}
                onValueChange={setTherapist}
                getOptionValue={(item) => item.code}
                getOptionLabel={(item) => item.name}
                placeholder="Cari nama terapis..."
                emptyText="Tidak ada terapis yang cocok."
                loadingText="Memuat terapis..."
                loading={isTherapistsLoading}
                disabled={isSubmitting}
                error={therapistsError}
              />
            </div>

            {therapistCode ? (
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">No. Rekening</p>
                  <p className="text-sm font-medium">{bankAccount || "-"}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Metode Pembayaran</p>
                  <p className="text-sm font-medium">{paymentMethod || "-"}</p>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Booking Belum Dibayar</Label>
                {unpaidItems.length > 0 ? (
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-xs font-medium text-primary hover:underline"
                    disabled={isSubmitting}
                  >
                    {selectedIds.length === unpaidItems.length
                      ? "Batalkan semua"
                      : "Pilih semua"}
                  </button>
                ) : null}
              </div>

              {!therapistCode ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                  Pilih terapis terlebih dahulu untuk melihat booking yang belum
                  dibayar.
                </p>
              ) : isOutstandingLoading ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                  Memuat tagihan...
                </p>
              ) : outstandingError ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-destructive">
                  {outstandingError}
                </p>
              ) : unpaidItems.length === 0 ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                  Tidak ada booking belum dibayar untuk terapis ini.
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-2">
                  {unpaidItems.map((booking) => {
                    const checked = selectedIds.includes(booking.code)
                    const meta = [
                      booking.date ? formatPayrollDate(booking.date) : "",
                      booking.time,
                      booking.priceLabel,
                    ]
                      .filter(Boolean)
                      .join(" • ")
                    return (
                      <button
                        key={booking.code}
                        type="button"
                        onClick={() => toggleBooking(booking.code)}
                        disabled={isSubmitting}
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
                            {booking.payment ? <StatusBadge status={booking.payment} /> : null}
                            {booking.payment === "unpaid" ? (
                              <Badge variant="warning">Patient unpaid</Badge>
                            ) : null}
                          </div>
                          <p className="text-sm font-medium">
                            {booking.patient} • {booking.service}
                          </p>
                          {meta ? (
                            <p className="text-xs text-muted-foreground">{meta}</p>
                          ) : null}
                          <p className="text-xs font-medium text-foreground">
                            Payout terapis: {booking.payoutLabel || formatPayrollAmount(booking.payoutValue)}
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
                <p className="text-xs text-muted-foreground">Total Payout Terapis</p>
                <p className="text-lg font-bold tracking-tight">
                  {formatPayrollAmount(totalPayout)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Catatan tambahan untuk payroll ini..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </SheetBody>

          {submitError ? <p className="px-6 text-sm text-destructive">{submitError}</p> : null}

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" className="gap-2" disabled={!canSubmit}>
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Menyimpan..." : "Buat Payroll"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
