import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronDown } from "lucide-react"
import { AreaChart } from "@/components/reports/area-chart"
import { ChangeBadge } from "@/components/reports/change-badge"
import { DateRangeFilter, getPresetRange } from "@/components/reports/date-range-filter"
import { StatusBadge } from "@/components/shared/status-badge"
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
import { occupancyReport } from "@/lib/reports-data"

function FilterChip({ label }) {
  return (
    <Button variant="outline" className="h-9 gap-2 font-normal">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  )
}

export default function OccupancyReportPage() {
  const navigate = useNavigate()
  const [range, setRange] = useState(() => getPresetRange("last7"))
  const data = occupancyReport

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Occupancy</h1>
        <p className="text-sm text-muted-foreground">
          Utilisasi jam dan okupansi terapis.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DateRangeFilter value={range} onChange={setRange} />
        <Button variant="outline" className="h-9 gap-2 bg-foreground text-background hover:bg-foreground/90 hover:text-background">
          <Calendar className="h-4 w-4" />
          {data.filters.compare}
        </Button>
        <FilterChip label={data.filters.service} />
        <FilterChip label={data.filters.therapist} />
        <FilterChip label={data.filters.location} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {data.metrics.map((metric) => (
          <Card key={metric.label} className="shadow-none">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
              <ChangeBadge change={metric.change} label={metric.changeLabel} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Occupied Hours Trend</CardTitle>
          <Badge variant="outline">Day</Badge>
        </CardHeader>
        <CardContent>
          <AreaChart
            labels={data.chart.labels}
            current={data.chart.current}
            previous={data.chart.previous}
            unit={data.chart.unit}
          />
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Occupancy by Therapist</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Therapist</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Occupied Hrs</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.list.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/reports/occupancy/${row.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">{row.period}</p>
                    </div>
                  </TableCell>
                  <TableCell>{row.subtitle}</TableCell>
                  <TableCell>{row.occupiedHours}</TableCell>
                  <TableCell className="font-medium">{row.rate}</TableCell>
                  <TableCell>
                    <ChangeBadge change={row.change} label="" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
