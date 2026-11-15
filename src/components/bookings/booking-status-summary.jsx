import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CircleCheck,
  MapPin,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const STATUS_ITEMS = [
  { key: "new", title: "New", icon: CalendarClock },
  { key: "confirmed", title: "Confirmed", icon: CalendarCheck },
  { key: "visit", title: "Visit", icon: MapPin },
  { key: "finished", title: "Finished", icon: CircleCheck },
  { key: "canceled", title: "Canceled", icon: CalendarX },
]

function formatCount(value) {
  return Number(value || 0).toLocaleString("en-US")
}

export function BookingStatusSummary({ summary }) {
  return (
    <Card className="h-full min-w-0 overflow-hidden shadow-none">
      <CardContent className="grid h-full min-w-0 grid-cols-5 items-center gap-2 p-4">
        {STATUS_ITEMS.map((item) => (
          <div key={item.key} className="flex min-w-0 flex-col items-center gap-1 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="w-full truncate text-xs text-muted-foreground">{item.title}</p>
            <p className="text-xl font-bold tracking-tight">{formatCount(summary?.[item.key])}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
