import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronDown, Eye, Plus, Search } from "lucide-react"
import { CreatePayrollSheet } from "@/components/reports/create-payroll-sheet"
import { DateRangeFilter, getPresetRange } from "@/components/reports/date-range-filter"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatPayrollAmount,
  formatPayrollDate,
  groupPayrollByTherapist,
  payrollReport,
} from "@/lib/reports-data"

function AmountCell({ amount, sessions }) {
  return (
    <div>
      <p className="font-medium">{formatPayrollAmount(amount)}</p>
      <p className="text-xs text-muted-foreground">{Number(sessions || 0).toLocaleString("id-ID")} sesi</p>
    </div>
  )
}

function parseRupiah(value) {
  if (typeof value === "number") return value
  const text = String(value || "").replace(/rp/i, "").trim().replace(/\s/g, "")
  if (/m$/i.test(text)) {
    const amount = Number(text.replace(/m$/i, "").replace(",", "."))
    return Number.isFinite(amount) ? amount * 1_000_000 : 0
  }

  const amount = Number(text.replace(/\./g, "").replace(",", "."))
  return Number.isFinite(amount) ? amount : 0
}

function summarizePayroll(list) {
  const summary = {
    total: { amount: 0, sessions: 0 },
    paid: { amount: 0, sessions: 0 },
    outstanding: { amount: 0, sessions: 0 },
  }

  for (const row of list || []) {
    const amount = parseRupiah(row.amount)
    const sessions = Number(row.sessions) || 0
    summary.total.amount += amount
    summary.total.sessions += sessions

    if (String(row.status || "").toLowerCase() === "paid") {
      summary.paid.amount += amount
      summary.paid.sessions += sessions
    } else {
      summary.outstanding.amount += amount
      summary.outstanding.sessions += sessions
    }
  }

  return [
    { label: "Total Payroll", ...summary.total },
    { label: "Paid Payroll", ...summary.paid },
    { label: "Outstanding Payroll", ...summary.outstanding },
  ]
}

function FilterChip({ label }) {
  return (
    <Button variant="outline" className="h-9 gap-2 font-normal">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  )
}

export default function PayrollReportPage() {
  const navigate = useNavigate()
  const [payrollOpen, setPayrollOpen] = useState(false)
  const [payrollList, setPayrollList] = useState(payrollReport)
  const [range, setRange] = useState(() => getPresetRange("last7"))
  const [search, setSearch] = useState("")

  function handlePayrollCreated() {
    setPayrollList({ ...payrollReport, list: [...payrollReport.list] })
  }

  const summary = summarizePayroll(payrollList.list)
  const therapists = useMemo(
    () => groupPayrollByTherapist(payrollList.list),
    [payrollList]
  )
  const query = search.trim().toLowerCase()
  const filteredTherapists = therapists.filter((row) =>
    row.name.toLowerCase().includes(query) || row.city.toLowerCase().includes(query)
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payroll</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan payout terapis.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter value={range} onChange={setRange} />
          <Button variant="outline" className="h-9 gap-2 bg-foreground text-background hover:bg-foreground/90 hover:text-background">
            <Calendar className="h-4 w-4" />
            {payrollList.filters.compare}
          </Button>
          <FilterChip label={payrollList.filters.service} />
          <FilterChip label={payrollList.filters.therapist} />
          <FilterChip label={payrollList.filters.location} />
        </div>
        <Button className="h-9 gap-2" onClick={() => setPayrollOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Payroll
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="shadow-none">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-3xl font-bold tracking-tight">{formatPayrollAmount(item.amount)}</p>
              <p className="text-sm text-muted-foreground">
                {item.sessions.toLocaleString("id-ID")} sesi
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Payroll by Therapist</CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama terapis..."
              className="h-9 pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Therapist</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Total Payout</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTherapists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Tidak ada terapis yang cocok.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTherapists.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>
                      <AmountCell amount={row.totalAmount} sessions={row.totalSessions} />
                    </TableCell>
                    <TableCell>
                      <AmountCell amount={row.paidAmount} sessions={row.paidSessions} />
                    </TableCell>
                    <TableCell>
                      <AmountCell amount={row.outstandingAmount} sessions={row.outstandingSessions} />
                    </TableCell>
                    <TableCell>{formatPayrollDate(row.lastPayment)}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => navigate(`/reports/payroll/${row.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreatePayrollSheet
        open={payrollOpen}
        onOpenChange={setPayrollOpen}
        onCreated={handlePayrollCreated}
      />
    </div>
  )
}
