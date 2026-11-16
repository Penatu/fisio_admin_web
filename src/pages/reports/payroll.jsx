import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Plus, Search } from "lucide-react"
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
import { formatPayrollDate } from "@/lib/reports-data"
import { useGetPayrollList } from "@/pages/reports/hooks/useGetPayrollList"

function AmountCell({ amount, sessions }) {
  return (
    <div>
      <p className="font-medium">{amount || "Rp 0"}</p>
      <p className="text-xs text-muted-foreground">{Number(sessions || 0).toLocaleString("id-ID")} sesi</p>
    </div>
  )
}

export default function PayrollReportPage() {
  const navigate = useNavigate()
  const [payrollOpen, setPayrollOpen] = useState(false)
  const [range, setRange] = useState(() => getPresetRange("last7"))
  const [search, setSearch] = useState("")
  const { report, isLoading, error, reload } = useGetPayrollList(range)
  const metrics = report?.metrics || []
  const query = search.trim().toLowerCase()
  const therapists = (report?.list || []).filter((row) =>
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
        <DateRangeFilter value={range} onChange={setRange} />
        <Button className="h-9 gap-2" onClick={() => setPayrollOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Payroll
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading && metrics.length === 0 ? (
          <Card className="shadow-none md:col-span-3">
            <CardContent className="p-5 text-sm text-muted-foreground">Memuat data...</CardContent>
          </Card>
        ) : error && metrics.length === 0 ? (
          <Card className="shadow-none md:col-span-3">
            <CardContent className="p-5 text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : (
          metrics.map((item) => (
            <Card key={item.label} className="shadow-none">
              <CardContent className="space-y-3 p-5">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-bold tracking-tight">{item.value}</p>
                <p className="text-sm text-muted-foreground">
                  {Number(item.sessions || 0).toLocaleString("id-ID")} sesi
                </p>
              </CardContent>
            </Card>
          ))
        )}
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
              {isLoading && therapists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : error && therapists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : therapists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    {query ? "Tidak ada terapis yang cocok." : "Tidak ada payroll pada periode ini."}
                  </TableCell>
                </TableRow>
              ) : (
                therapists.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>
                      <AmountCell amount={row.totalPayout} sessions={row.totalSessions} />
                    </TableCell>
                    <TableCell>
                      <AmountCell amount={row.paid} sessions={row.paidSessions} />
                    </TableCell>
                    <TableCell>
                      <AmountCell amount={row.outstanding} sessions={row.outstandingSessions} />
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
                        onClick={() => navigate(`/reports/payroll/${row.id}`, { state: { therapist: row } })}
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
        onCreated={reload}
      />
    </div>
  )
}
