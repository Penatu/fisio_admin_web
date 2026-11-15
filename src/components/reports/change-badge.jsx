import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChangeBadge({ change, label }) {
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
