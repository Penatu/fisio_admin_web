import { ChevronLeft, ChevronRight } from "lucide-react"
import { PageToolbar } from "@/components/shared/page-toolbar"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
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
  summary,
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
  isLoading = false,
  error = "",
  emptyMessage = "Tidak ada data.",
  searchValue,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPayment,
  onPaymentChange,
  pagination,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {headerActions}
      </div>

      {summary ? (
        <div className="grid items-stretch gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
          {stats.length > 0 ? (
            <div className="grid gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          ) : null}
          <div className="min-w-0">{summary}</div>
        </div>
      ) : stats.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      ) : null}

      <Card className="shadow-none">
        <CardContent className="p-4">
          <PageToolbar
            searchPlaceholder={searchPlaceholder}
            statusFilters={statusFilters}
            paymentFilters={paymentFilters}
            showDatePicker={showDatePicker}
            showExport={showExport}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            selectedStatus={selectedStatus}
            onStatusChange={onStatusChange}
            selectedPayment={selectedPayment}
            onPaymentChange={onPaymentChange}
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
                {isLoading && data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : error && data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-red-600">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, idx) => (
                    <TableRow
                      key={row.id || row.code || idx}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      className={onRowClick ? "cursor-pointer" : undefined}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          {col.render ? col.render(row) : row[col.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          {pagination ? <TablePagination pagination={pagination} isLoading={isLoading} /> : null}
        </CardContent>
      </Card>
    </div>
  )
}

function TablePagination({ pagination, isLoading }) {
  const total = pagination.total || 0
  const perPage = pagination.perPage || 10
  const currentPage = pagination.currentPage || 1
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const rangeEnd = Math.min(currentPage * perPage, total)

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total === 0 ? "0 data" : `${rangeStart}–${rangeEnd} dari ${total}`}
        {isLoading ? " · Memuat..." : ""}
      </p>
      <div className="flex items-center gap-2">
        <select
          value={perPage}
          onChange={(event) => pagination.onPerPageChange?.(Number(event.target.value))}
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
          onClick={() => pagination.onPageChange?.(pagination.previousPage)}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <span className="min-w-16 text-center text-sm">Hal. {currentPage}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.nextPage}
          onClick={() => pagination.onPageChange?.(pagination.nextPage)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
