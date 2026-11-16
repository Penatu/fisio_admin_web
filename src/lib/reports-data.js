export function formatPayrollDate(value) {
  if (!value) return "-"
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatPayrollAmount(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`
}
