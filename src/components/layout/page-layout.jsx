import { PageToolbar } from "@/components/shared/page-toolbar"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function PageLayout({
  title,
  stats = [],
  searchPlaceholder,
  statusFilters = [],
  paymentFilters = [],
  showDatePicker = true,
  showExport = true,
  columns = [],
  data = [],
  onRowClick,
  headerActions,
  children,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {headerActions}
      </div>

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      )}

      <Card className="shadow-none">
        <CardContent className="p-4">
          <PageToolbar
            searchPlaceholder={searchPlaceholder}
            statusFilters={statusFilters}
            paymentFilters={paymentFilters}
            showDatePicker={showDatePicker}
            showExport={showExport}
          />
        </CardContent>
      </Card>

      <Card className="shadow-none overflow-hidden">
        <CardContent className="p-0">
          {children || (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableHead key={col.key} className={col.className}>
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow
                    key={row.id || idx}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? "cursor-pointer" : undefined}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
