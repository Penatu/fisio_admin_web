import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { AreaChart } from "@/components/reports/area-chart"
import { DateRangeFilter, getPresetRange } from "@/components/reports/date-range-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetOccupancyReport } from "@/pages/reports/hooks/useGetOccupancyReport"

const CHART_PERIODS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
]

export default function OccupancyReportPage() {
  const [range, setRange] = useState(() => getPresetRange("last7"))
  const [chartPeriodType, setChartPeriodType] = useState("day")
  const { report, isLoading, error } = useGetOccupancyReport(range, chartPeriodType)
  const metrics = report?.metrics || []
  const chart = report?.chart || { labels: [], current: [], previous: [], unit: "" }
  const cities = report?.cities || []
  const cityUnit = report?.cityUnit || ""

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Occupancy</h1>
        <p className="text-sm text-muted-foreground">
          Utilisasi jam dan okupansi terapis.
        </p>
      </div>

      <DateRangeFilter value={range} onChange={setRange} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="shadow-none">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Session Trend</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 gap-1 capitalize">
                {CHART_PERIODS.find((item) => item.value === chartPeriodType)?.label || "Day"}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {CHART_PERIODS.map((item) => (
                <DropdownMenuItem key={item.value} onSelect={() => setChartPeriodType(item.value)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {isLoading && chart.current.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              Memuat data...
            </div>
          ) : error && chart.current.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-red-600">
              {error}
            </div>
          ) : (
            <AreaChart
              labels={chart.labels}
              current={chart.current}
              previous={chart.previous}
              unit={chart.unit}
            />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Occupancy by City</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && cities.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              Memuat data...
            </div>
          ) : error && cities.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-red-600">
              {error}
            </div>
          ) : cities.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              Tidak ada data occupancy.
            </div>
          ) : (
            <AreaChart
              labels={cities.map((city) => city.name)}
              current={cities.map((city) => city.value)}
              unit={cityUnit}
              currentLabel="Sessions"
              gradientId="occupancyCityAreaGradient"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
