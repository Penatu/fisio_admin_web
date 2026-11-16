export const paymentMethodColors = {
  "Bank Transfer": "outline",
  "E-Wallet": "info",
  "Credit Card": "secondary",
}

const METHOD_LABELS = {
  bank_transfer: "Bank Transfer",
  e_wallet: "E-Wallet",
  credit_card: "Credit Card",
}

export function paymentMethodLabel(method) {
  const key = String(method || "").trim().toLowerCase()
  if (!key) return ""
  return METHOD_LABELS[key] || method
}
