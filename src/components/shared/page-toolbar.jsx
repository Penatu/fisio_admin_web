import { Calendar, Download, Eye, LayoutGrid, Pencil, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function filterLabel(filter) {
  return typeof filter === "string" ? filter : filter.label
}

function filterValue(filter) {
  return typeof filter === "string" ? filter : filter.value
}

export function PageToolbar({
  searchPlaceholder = "Filter...",
  statusFilters = [],
  paymentFilters = [],
  showDatePicker = true,
  showExport = true,
  searchValue = "",
  onSearchChange,
  selectedStatus = "",
  onStatusChange,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {showDatePicker && (
          <Button variant="outline" className="h-9 gap-2 font-normal">
            <Calendar className="h-4 w-4" />
            Jul 24, 2026
          </Button>
        )}
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="h-9 pl-9"
            value={onSearchChange ? searchValue : undefined}
            onChange={onSearchChange ? (event) => onSearchChange(event.target.value) : undefined}
          />
        </div>
        {statusFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-1 border-dashed">
                <Plus className="h-4 w-4" />
                {selectedStatus
                  ? filterLabel(
                      statusFilters.find((filter) => filterValue(filter) === selectedStatus) ||
                        selectedStatus
                    )
                  : "Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {onStatusChange ? (
                <DropdownMenuRadioGroup
                  value={selectedStatus || "all"}
                  onValueChange={(value) => onStatusChange(value === "all" ? "" : value)}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  {statusFilters.map((filter) => (
                    <DropdownMenuRadioItem key={filterValue(filter)} value={filterValue(filter)}>
                      {filterLabel(filter)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              ) : (
                statusFilters.map((filter) => (
                  <DropdownMenuCheckboxItem key={filterValue(filter)} defaultChecked>
                    {filterLabel(filter)}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {paymentFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-1 border-dashed">
                <Plus className="h-4 w-4" />
                Payment Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {paymentFilters.map((filter) => (
                <DropdownMenuCheckboxItem key={filter} defaultChecked>
                  {filter}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showExport && (
          <Button className="h-9 gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        )}
        <Button variant="outline" className="h-9 gap-2">
          <LayoutGrid className="h-4 w-4" />
          View
        </Button>
      </div>
    </div>
  )
}

export function ActionButtons() {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
}
