import { cn } from "@/lib/utils"

export function StatusBadge({ status }) {
  const config = {
    active: { label: "Active", variant: "success", dot: "bg-emerald-500" },
    inactive: { label: "Inactive", variant: "secondary", dot: "bg-gray-400" },
    "in review": { label: "In Review", variant: "warning", dot: "bg-amber-500" },
    rejected: { label: "Rejected", variant: "destructive", dot: "bg-red-500" },
    pending: { label: "Pending", variant: "warning", dot: "bg-amber-500" },
    declined: { label: "Declined", variant: "destructive", dot: "bg-red-500" },
    new: { label: "New", variant: "success", dot: "bg-emerald-500" },
    confirmed: { label: "Confirmed", variant: "info", dot: "bg-blue-500" },
    visit: { label: "Visit", variant: "warning", dot: "bg-amber-500" },
    completed: { label: "Completed", variant: "success", dot: "bg-emerald-500" },
    finished: { label: "Finished", variant: "success", dot: "bg-emerald-500" },
    cancelled: { label: "Cancelled", variant: "destructive", dot: "bg-red-500" },
    canceled: { label: "Canceled", variant: "destructive", dot: "bg-red-500" },
    paid: { label: "Paid", variant: "success", dot: "bg-emerald-500" },
    unpaid: { label: "Unpaid", variant: "warning", dot: "bg-amber-500" },
    refunded: { label: "Refunded", variant: "secondary", dot: "bg-gray-400" },
    verified: { label: "Verified", variant: "success", dot: "bg-emerald-500" },
    suspended: { label: "Suspended", variant: "destructive", dot: "bg-red-500" },
  }

  const raw = String(status ?? "").trim()
  const normalized = raw.toLowerCase().replace(/[_-]+/g, " ")
  const key = normalized === "innactive" ? "inactive" : normalized
  const item = config[key] || {
    label: raw || "-",
    variant: "secondary",
    dot: "bg-gray-400",
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium">
      <span className={cn("h-1.5 w-1.5 rounded-full", item.dot)} />
      {item.label}
    </span>
  )
}
