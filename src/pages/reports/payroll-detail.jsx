import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useGetPaidPayroll } from "@/pages/reports/hooks/useGetPaidPayroll"

function AmountCell({ amount, sessions }) {
  return (
    <div>
      <p className="font-medium">{amount || "Rp 0"}</p>
      <p className="text-xs text-muted-foreground">{Number(sessions || 0).toLocaleString("id-ID")} sesi</p>
    </div>
  )
}

const STATUS_FILTERS = [
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
]

function formatPeriod(start, end) {
  const startLabel = formatPayrollDate(start)
  const endLabel = formatPayrollDate(end)
  if (!start && !end) return "-"
  if (startLabel === endLabel) return startLabel
  return `${startLabel} – ${endLabel}`
}

export default function PayrollDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const therapist = location.state?.therapist
  const {
    payrolls,
    pagination,
    isLoading,
    error,
    search,
    status,
    setSearch,
    setStatus,
    setPage,
    setPerPage,
  } = useGetPaidPayroll(id)
  const total = pagination.total || 0
  const perPage = pagination.perPage || 10
  const currentPage = pagination.currentPage || 1
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const rangeEnd = Math.min(currentPage * perPage, total)
  const selectedStatus = STATUS_FILTERS.find((filter) => filter.value === status)

  const summary = therapist
    ? [
        { label: "Total Payout", amount: therapist.totalPayout, sessions: therapist.totalSessions },
        { label: "Paid", amount: therapist.paid, sessions: therapist.paidSessions },
        { label: "Outstanding", amount: therapist.outstanding, sessions: therapist.outstandingSessions },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/reports/payroll")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{therapist?.name || id}</h1>
          {therapist?.city && therapist.city !== "-" ? (
            <p className="text-sm text-muted-foreground">{therapist.city}</p>
          ) : null}
        </div>
        {therapist?.status ? <StatusBadge status={therapist.status} /> : null}
      </div>

      {summary.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-4">
          {summary.map((item) => (
            <Card key={item.label} className="shadow-none">
              <CardContent className="space-y-2 p-5">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold tracking-tight">{item.amount || "Rp 0"}</p>
                <p className="text-sm text-muted-foreground">
                  {Number(item.sessions || 0).toLocaleString("id-ID")} sesi
                </p>
              </CardContent>
            </Card>
          ))}
          <Card className="shadow-none">
            <CardContent className="space-y-2 p-5">
              <p className="text-sm text-muted-foreground">Last Payment</p>
              <p className="whitespace-nowrap text-xl font-bold tracking-tight">
                {formatPayrollDate(therapist.lastPayment)}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card className="overflow-hidden shadow-none">
        <CardHeader className="gap-4">
          <CardTitle className="text-base">Payroll yang sudah dibuat</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari payroll..."
                className="h-9 pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-1 border-dashed">
                  <Plus className="h-4 w-4" />
                  {selectedStatus ? selectedStatus.label : "Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  {STATUS_FILTERS.map((filter) => (
                    <DropdownMenuRadioItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Periode</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Memuat payroll...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : payrolls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    {search.trim() || status ? "Tidak ada payroll yang cocok dengan filter." : "Belum ada payroll yang sudah dibayar."}
                  </TableCell>
                </TableRow>
              ) : (
                payrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell className="font-medium">
                      {formatPeriod(payroll.periodStart, payroll.periodEnd)}
                    </TableCell>
                    <TableCell>
                      <AmountCell amount={payroll.amount} sessions={payroll.sessions} />
                    </TableCell>
                    <TableCell>{formatPayrollDate(payroll.paidAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={payroll.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {total === 0 ? "0 data" : `${rangeStart}–${rangeEnd} dari ${total}`}
              {isLoading ? " · Memuat..." : ""}
            </p>
            <div className="flex items-center gap-2">
              <select
                value={perPage}
                onChange={(event) => setPerPage(Number(event.target.value))}
                className="h-8 rounded-md border bg-background px-2 text-sm"
                aria-label="Rows per page"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / halaman
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.previousPage}
                onClick={() => setPage(pagination.previousPage)}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="min-w-16 text-center text-sm">Hal. {currentPage}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.nextPage}
                onClick={() => setPage(pagination.nextPage)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
