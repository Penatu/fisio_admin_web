export const serviceCategories = [
  "Home Care",
  "Sports",
  "Clinical",
  "Therapy",
  "Pediatric",
  "Elderly",
]

export const services = [
  {
    id: 1,
    name: "Home Visit Physiotherapy",
    category: "Home Care",
    duration: "60 min",
    price: "Rp 350.000",
    priceValue: 350000,
    bookings: 542,
    status: "active",
    description:
      "Layanan fisioterapi di rumah pasien untuk kenyamanan dan pemulihan optimal tanpa perlu datang ke klinik.",
    therapistSharePct: 60,
    operationalCost: 40000,
  },
  {
    id: 2,
    name: "Sports Rehabilitation",
    category: "Sports",
    duration: "90 min",
    price: "Rp 450.000",
    priceValue: 450000,
    bookings: 328,
    status: "active",
    description:
      "Program rehabilitasi cedera olahraga untuk atlet dan penggemar olahraga agar kembali aktif dengan aman.",
    therapistSharePct: 65,
    operationalCost: 25000,
  },
  {
    id: 3,
    name: "Post-Surgery Rehabilitation",
    category: "Clinical",
    duration: "60 min",
    price: "Rp 500.000",
    priceValue: 500000,
    bookings: 215,
    status: "active",
    description:
      "Rehabilitasi pasca operasi untuk memulihkan fungsi gerak dan mempercepat proses penyembuhan.",
    therapistSharePct: 65,
    operationalCost: 30000,
  },
  {
    id: 4,
    name: "Manual Therapy",
    category: "Therapy",
    duration: "45 min",
    price: "Rp 300.000",
    priceValue: 300000,
    bookings: 189,
    status: "active",
    description:
      "Terapi manual untuk mengatasi nyeri otot dan sendi melalui teknik mobilisasi dan manipulasi.",
    therapistSharePct: 70,
    operationalCost: 20000,
  },
  {
    id: 5,
    name: "Pediatric Physiotherapy",
    category: "Pediatric",
    duration: "45 min",
    price: "Rp 400.000",
    priceValue: 400000,
    bookings: 98,
    status: "inactive",
    description:
      "Fisioterapi anak dengan pendekatan bermain untuk membantu perkembangan motorik dan pemulihan.",
    therapistSharePct: 65,
    operationalCost: 25000,
  },
  {
    id: 6,
    name: "Geriatric Care",
    category: "Elderly",
    duration: "60 min",
    price: "Rp 375.000",
    priceValue: 375000,
    bookings: 156,
    status: "active",
    description:
      "Perawatan fisioterapi geriatri untuk menjaga mobilitas dan kualitas hidup lansia.",
    therapistSharePct: 60,
    operationalCost: 35000,
  },
]

export function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`
}

export function getServiceById(id) {
  return services.find((s) => String(s.id) === String(id))
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

export function createService(form) {
  const nextId = services.reduce((max, s) => Math.max(max, s.id), 0) + 1
  const priceValue = Number(String(form.price).replace(/\D/g, "")) || 0
  const newService = {
    id: nextId,
    name: form.name,
    category: form.category || "Uncategorized",
    duration: form.duration ? `${form.duration} min` : "-",
    price: priceValue ? formatRupiah(priceValue) : "-",
    priceValue,
    bookings: 0,
    status: form.status,
    description: form.description,
    therapistSharePct: Number(form.therapistSharePct) || 0,
    operationalCost: Number(form.operationalCost) || 0,
  }
  services.unshift(newService)
  return newService
}

export function updateService(id, form) {
  const service = getServiceById(id)
  if (!service) return null
  const priceValue = Number(String(form.price).replace(/\D/g, "")) || 0
  service.name = form.name
  service.category = form.category || "Uncategorized"
  service.duration = form.duration ? `${form.duration} min` : "-"
  service.priceValue = priceValue
  service.price = priceValue ? formatRupiah(priceValue) : "-"
  service.status = form.status
  service.description = form.description
  service.therapistSharePct = Number(form.therapistSharePct) || 0
  service.operationalCost = Number(form.operationalCost) || 0
  return service
}
