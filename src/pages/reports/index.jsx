import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  ChevronDown,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { AreaChart } from "@/components/reports/area-chart"
import { CreatePayrollSheet } from "@/components/reports/create-payroll-sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"
import {
  occupancyReport,
  payrollReport,
  reportTabs,
  revenueReport,
} from "@/lib/reports-data"

function ChangeBadge({ change, label }) {
  if (change === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        {label || "No change"}
      </span>
    )
  }

  const positive = change > 0
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
        positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      )}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}
      {change}%
      {label ? ` ${label}` : ""}
    </span>
  )
}

function FilterChip({ label }) {
  return (
    <Button variant="outline" className="h-9 gap-2 font-normal">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  )
}

function ReportTabPanel({ type, data, onCreatePayroll }) {
  const navigate = useNavigate()

  const columns =
    type === "revenue"
      ? [
          { key: "title", label: "Service" },
          { key: "subtitle", label: "Category" },
          { key: "bookings", label: "Bookings" },
          { key: "amount", label: "Revenue" },
          { key: "change", label: "Change" },
          { key: "status", label: "Status" },
        ]
      : type === "occupancy"
        ? [
            { key: "title", label: "Therapist" },
            { key: "subtitle", label: "Location" },
            { key: "occupiedHours", label: "Occupied Hrs" },
            { key: "rate", label: "Occupancy" },
            { key: "change", label: "Change" },
            { key: "status", label: "Status" },
          ]
        : [
            { key: "title", label: "Therapist" },
            { key: "subtitle", label: "Specialty" },
            { key: "sessions", label: "Sessions" },
            { key: "amount", label: "Payout" },
            { key: "change", label: "Change" },
            { key: "status", label: "Status" },
          ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 gap-2 bg-foreground text-background hover:bg-foreground/90 hover:text-background">
            <Calendar className="h-4 w-4" />
            {data.filters.period}
          </Button>
          <Button variant="outline" className="h-9 gap-2 bg-foreground text-background hover:bg-foreground/90 hover:text-background">
            <Calendar className="h-4 w-4" />
            {data.filters.compare}
          </Button>
          <FilterChip label={data.filters.service} />
          <FilterChip label={data.filters.therapist} />
          <FilterChip label={data.filters.location} />
        </div>
        {type === "payroll" ? (
          <Button className="h-9 gap-2" onClick={onCreatePayroll}>
            <Plus className="h-4 w-4" />
            Create Payroll
          </Button>
        ) : null}
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
          <CardTitle className="text-base">
            {type === "revenue"
              ? "Revenue Trend"
              : type === "occupancy"
                ? "Occupied Hours Trend"
                : "Payroll Trend"}
          </CardTitle>
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

      <Card className="shadow-none overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">
            {type === "revenue"
              ? "Revenue by Service"
              : type === "occupancy"
                ? "Occupancy by Therapist"
                : "Payroll by Therapist"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.list.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/reports/${type}/${row.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">{row.period}</p>
                    </div>
                  </TableCell>
                  <TableCell>{row.subtitle}</TableCell>
                  <TableCell>
                    {type === "revenue"
                      ? row.bookings
                      : type === "occupancy"
                        ? row.occupiedHours
                        : row.sessions}
                  </TableCell>
                  <TableCell className="font-medium">
                    {type === "revenue"
                      ? row.amount
                      : type === "occupancy"
                        ? row.rate
                        : row.amount}
                  </TableCell>
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

export default function ReportsPage() {
  const [payrollOpen, setPayrollOpen] = useState(false)
  const [payrollList, setPayrollList] = useState(payrollReport)

  function handlePayrollCreated() {
    setPayrollList({ ...payrollReport, list: [...payrollReport.list] })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Analitik revenue, utilisasi terapis, dan payroll dalam satu tempat.
        </p>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
          {reportTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <ReportTabPanel type="revenue" data={revenueReport} />
        </TabsContent>
        <TabsContent value="occupancy" className="mt-6">
          <ReportTabPanel type="occupancy" data={occupancyReport} />
        </TabsContent>
        <TabsContent value="payroll" className="mt-6">
          <ReportTabPanel
            type="payroll"
            data={payrollList}
            onCreatePayroll={() => setPayrollOpen(true)}
          />
        </TabsContent>
      </Tabs>

      <CreatePayrollSheet
        open={payrollOpen}
        onOpenChange={setPayrollOpen}
        onCreated={handlePayrollCreated}
      />
    </div>
  )
}
