import { useMemo, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return startOfDay(next)
}

function startOfWeek(date) {
  const next = startOfDay(date)
  const day = next.getDay()
  const diff = day === 0 ? -6 : 1 - day
  return addDays(next, diff)
}

function startOfMonth(date) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
}

function endOfMonth(date) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

function startOfQuarter(date) {
  const month = Math.floor(date.getMonth() / 3) * 3
  return startOfDay(new Date(date.getFullYear(), month, 1))
}

function endOfQuarter(date) {
  const start = startOfQuarter(date)
  return startOfDay(new Date(start.getFullYear(), start.getMonth() + 3, 0))
}

function isSameDay(left, right) {
  if (!left || !right) return false
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function formatDay(date) {
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`
}

function formatMonth(date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function formatRange(start, end) {
  if (!start || !end) return ""
  if (isSameDay(start, end)) return formatDay(start)
  return `${formatDay(start)} - ${formatDay(end)}`
}

function presetHint(id, start, end) {
  if (id === "thisMonth" || id === "lastMonth") return formatMonth(start)
  if (id === "thisQuarter" || id === "lastQuarter") return `${formatMonth(start)} - ${formatMonth(end)}`
  return formatRange(start, end)
}

export function getPresetRange(id, today = new Date()) {
  const current = startOfDay(today)

  if (id === "today") return { id, start: current, end: current }
  if (id === "yesterday") {
    const day = addDays(current, -1)
    return { id, start: day, end: day }
  }
  if (id === "thisWeek") return { id, start: startOfWeek(current), end: addDays(startOfWeek(current), 6) }
  if (id === "lastWeek") {
    const start = addDays(startOfWeek(current), -7)
    return { id, start, end: addDays(start, 6) }
  }
  if (id === "weekToDate") return { id, start: startOfWeek(current), end: current }
  if (id === "last7") return { id, start: addDays(current, -6), end: current }
  if (id === "last30") return { id, start: addDays(current, -29), end: current }
  if (id === "thisMonth") return { id, start: startOfMonth(current), end: endOfMonth(current) }
  if (id === "lastMonth") {
    const start = startOfMonth(new Date(current.getFullYear(), current.getMonth() - 1, 1))
    return { id, start, end: endOfMonth(start) }
  }
  if (id === "thisQuarter") return { id, start: startOfQuarter(current), end: endOfQuarter(current) }
  if (id === "lastQuarter") {
    const start = startOfQuarter(new Date(current.getFullYear(), current.getMonth() - 3, 1))
    return { id, start, end: endOfQuarter(start) }
  }

  return { id: "last7", start: addDays(current, -6), end: current }
}

const PRESETS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "thisWeek", label: "This week" },
  { id: "lastWeek", label: "Last week" },
  { id: "weekToDate", label: "Week to date" },
  { id: "last7", label: "Last 7 days" },
  { id: "last30", label: "Last 30 days" },
  { id: "thisMonth", label: "This month" },
  { id: "lastMonth", label: "Last month" },
  { id: "thisQuarter", label: "This quarter" },
  { id: "lastQuarter", label: "Last quarter" },
]

function monthCells(viewDate) {
  const first = startOfMonth(viewDate)
  const leading = (first.getDay() + 6) % 7
  const count = endOfMonth(viewDate).getDate()
  const cells = Array.from({ length: leading }, () => null)
  for (let day = 1; day <= count; day += 1) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function RangeCalendar({ start, end, onSelect }) {
  const [viewDate, setViewDate] = useState(() => startOfMonth(end || start || new Date()))
  const cells = useMemo(() => monthCells(viewDate), [viewDate])
  const today = startOfDay(new Date())
  const rangeStart = start && end && start > end ? end : start
  const rangeEnd = start && end && start > end ? start : end

  return (
    <div className="w-[280px] p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-medium">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </p>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />
          const selectedStart = isSameDay(day, rangeStart)
          const selectedEnd = isSameDay(day, rangeEnd)
          const inside =
            rangeStart &&
            rangeEnd &&
            day >= rangeStart &&
            day <= rangeEnd
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm",
                inside && !selectedStart && !selectedEnd && "bg-foreground/10",
                (selectedStart || selectedEnd) && "bg-foreground text-background",
                !inside && !selectedStart && !selectedEnd && "hover:bg-muted",
                isSameDay(day, today) && !selectedStart && !selectedEnd && "ring-1 ring-foreground/30"
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Pilih tanggal mulai, lalu tanggal selesai.</p>
    </div>
  )
}

export function DateRangeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [draftStart, setDraftStart] = useState(null)
  const presets = useMemo(
    () =>
      PRESETS.map((preset) => {
        const range = getPresetRange(preset.id)
        return { ...preset, ...range, hint: presetHint(preset.id, range.start, range.end) }
      }),
    []
  )
  const selected = presets.find((preset) => preset.id === value?.id)
  const triggerLabel =
    value?.id === "custom" && value.start && value.end
      ? formatRange(value.start, value.end)
      : selected?.label || "Last 7 days"

  function selectPreset(preset) {
    onChange({ id: preset.id, start: preset.start, end: preset.end })
    setDraftStart(null)
  }

  function selectCustomDay(day) {
    const picked = startOfDay(day)
    if (!draftStart) {
      setDraftStart(picked)
      onChange({ id: "custom", start: picked, end: picked })
      return
    }
    const start = draftStart <= picked ? draftStart : picked
    const end = draftStart <= picked ? picked : draftStart
    onChange({ id: "custom", start, end })
    setDraftStart(null)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 gap-2 bg-foreground text-background hover:bg-foreground/90 hover:text-background"
        >
          <Calendar className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[340px] rounded-xl p-2">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm",
              value?.id === "custom" && "bg-neutral-900 text-white focus:bg-neutral-900 focus:text-white data-[state=open]:bg-neutral-900 data-[state=open]:text-white"
            )}
          >
            Custom
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-xl p-0">
            <RangeCalendar
              start={value?.id === "custom" ? value.start : draftStart}
              end={value?.id === "custom" ? value.end : null}
              onSelect={selectCustomDay}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {presets.map((preset) => {
          const active = value?.id === preset.id
          return (
            <DropdownMenuItem
              key={preset.id}
              onSelect={() => selectPreset(preset)}
              className={cn(
                "justify-between rounded-lg px-3 py-2.5 text-sm",
                active && "bg-neutral-900 text-white focus:bg-neutral-900 focus:text-white"
              )}
            >
              <span>{preset.label}</span>
              <span className={cn("text-sm", active ? "text-white/70" : "text-muted-foreground")}>
                {preset.hint}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
