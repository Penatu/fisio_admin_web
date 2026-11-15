import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CalendarDays, FileText } from "lucide-react"
import { getReportDetail } from "@/lib/reports-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ReportDetailPage() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const detail = getReportDetail(type, id)
  const listPath = ["revenue", "occupancy", "payroll"].includes(type)
    ? `/reports/${type}`
    : "/reports/revenue"

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Detail laporan tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          Data laporan yang Anda cari tidak tersedia.
        </p>
        <Button variant="outline" onClick={() => navigate(listPath)}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke reports
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(listPath)}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card className="shadow-none">
        <CardContent className="space-y-3 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{detail.title}</h1>
            <Badge variant="outline">{detail.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{detail.summary}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {detail.period}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {detail.metrics.map((metric) => (
          <Card key={metric.label} className="shadow-none">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-lg font-bold tracking-tight">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">Rincian Harian</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tanggal</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead className="text-right">Sesi / Booking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.daily.map((row) => (
                <TableRow key={row.date}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell className="text-right">{row.bookings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Catatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{detail.notes}</p>
        </CardContent>
      </Card>
    </div>
  )
}
