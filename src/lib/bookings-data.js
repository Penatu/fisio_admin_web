export const ORDER_STATUS = {
  received_request: {
    label: "Received Request",
    description: "Request masuk",
    badge: "info",
    dot: "bg-blue-500",
  },
  ongoing: {
    label: "On Going",
    description: "Request diterima dan menunggu visit",
    badge: "warning",
    dot: "bg-amber-500",
  },
  done: {
    label: "Done",
    description: "Visit selesai",
    badge: "success",
    dot: "bg-emerald-500",
  },
  report: {
    label: "Report",
    description: "Informed consent diupload setelah selesai",
    badge: "success",
    dot: "bg-emerald-600",
  },
  canceled: {
    label: "Canceled",
    description: "Visit dibatalkan",
    badge: "destructive",
    dot: "bg-red-500",
  },
}
