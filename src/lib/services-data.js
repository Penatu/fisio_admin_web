export function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`
}

export function computeProfit(service) {
  const price = service.priceValue || 0
  const therapistSharePct = service.therapistSharePct || 0
  const operationalCost = service.operationalCost || 0

  const therapistEarning = Math.round((price * therapistSharePct) / 100)
  const platformGross = price - therapistEarning
  const netProfit = platformGross - operationalCost
  const marginPct = price > 0 ? Math.round((netProfit / price) * 100) : 0

  return {
    price,
    therapistSharePct,
    platformSharePct: 100 - therapistSharePct,
    therapistEarning,
    platformGross,
    operationalCost,
    netProfit,
    marginPct,
  }
}
