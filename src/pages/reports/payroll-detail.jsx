import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Eye } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
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
  getTherapistOrders,
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

export default function PayrollDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const therapist = groupPayrollByTherapist(payrollReport.list).find(
    (row) => String(row.id) === String(id)
  )
  const orders = therapist ? getTherapistOrders(therapist) : []
  const selectedOrders = (selectedPayroll?.orders || []).map((order) => ({
    ...order,
    status: String(selectedPayroll?.status).toLowerCase() === "paid" ? "paid" : "unpaid",
  }))

  if (!therapist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Detail payroll tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          Data terapis yang Anda cari tidak tersedia.
        </p>
        <Button variant="outline" onClick={() => navigate("/reports/payroll")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke payroll
        </Button>
      </div>
    )
  }

  const summary = [
    { label: "Total Payout", amount: therapist.totalAmount, sessions: therapist.totalSessions },
    { label: "Paid", amount: therapist.paidAmount, sessions: therapist.paidSessions },
    { label: "Outstanding", amount: therapist.outstandingAmount, sessions: therapist.outstandingSessions },
  ]

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
          <h1 className="text-2xl font-bold tracking-tight">{therapist.name}</h1>
          <p className="text-sm text-muted-foreground">{therapist.city}</p>
        </div>
        <StatusBadge status={therapist.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="shadow-none">
            <CardContent className="space-y-2 p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold tracking-tight">{formatPayrollAmount(item.amount)}</p>
              <p className="text-sm text-muted-foreground">
                {item.sessions.toLocaleString("id-ID")} sesi
              </p>
            </CardContent>
          </Card>
        ))}
        <Card className="shadow-none">
          <CardContent className="space-y-2 p-5">
            <p className="text-sm text-muted-foreground">Last Payment</p>
            <p className="whitespace-nowrap text-xl font-bold tracking-tight">{formatPayrollDate(therapist.lastPayment)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-none">
        <CardHeader>
          <CardTitle className="text-base">List Order</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Order</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Belum ada order untuk terapis ini.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={`${order.payrollId || "open"}-${order.code}`}>
                    <TableCell className="font-medium">{order.code}</TableCell>
                    <TableCell>{order.patient}</TableCell>
                    <TableCell>{order.service}</TableCell>
                    <TableCell>{formatPayrollDate(order.date)}</TableCell>
                    <TableCell>{formatPayrollAmount(order.payout)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5"
                        onClick={() => navigate(`/bookings/${order.code}`)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Payroll yang sudah dibuat</CardTitle>
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
              {therapist.payrolls.map((payroll) => (
                <TableRow
                  key={payroll.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedPayroll(payroll)}
                >
                  <TableCell className="font-medium">{payroll.period}</TableCell>
                  <TableCell>
                    <AmountCell amount={payroll.amount} sessions={payroll.sessions} />
                  </TableCell>
                  <TableCell>{formatPayrollDate(payroll.paidAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={payroll.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedPayroll)} onOpenChange={(open) => !open && setSelectedPayroll(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Payroll {selectedPayroll?.period}</DialogTitle>
            <DialogDescription>
              {selectedPayroll?.paidAt
                ? `${selectedOrders.length} order pada payroll ini, dibayar ${formatPayrollDate(selectedPayroll.paidAt)}.`
                : `${selectedOrders.length} order pada payroll ini.`}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[420px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Tidak ada order pada payroll ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedOrders.map((order) => (
                    <TableRow key={order.code}>
                      <TableCell className="font-medium">{order.code}</TableCell>
                      <TableCell>{order.patient}</TableCell>
                      <TableCell>{order.service}</TableCell>
                      <TableCell>{formatPayrollDate(order.date)}</TableCell>
                      <TableCell>{formatPayrollAmount(order.payout)}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
