export const admins = [
  {
    id: 1,
    name: "Admin Utama",
    email: "admin@fisiobook.com",
    phone: "+62 811-0000-0001",
    role: "Super Admin",
    branch: "All Branches",
    lastLogin: "Jul 24, 2026 09:15",
    status: "active",
    joinedAt: "01 Jan 2020",
    location: "Jakarta Pusat",
    bio: "Administrator utama platform dengan akses penuh ke seluruh modul dan cabang.",
    twoFactor: true,
    permissions: [
      { module: "User Management", level: "Full Access" },
      { module: "Booking Management", level: "Full Access" },
      { module: "Payment & Finance", level: "Full Access" },
      { module: "Reports & Analytics", level: "Full Access" },
      { module: "System Settings", level: "Full Access" },
    ],
    activity: [
      { id: "a1", action: "Mengubah pengaturan sistem", target: "Payment Gateway", time: "Jul 24, 2026 09:20" },
      { id: "a2", action: "Menyetujui verifikasi therapist", target: "Dr. Rudi Hartono", time: "Jul 24, 2026 09:18" },
      { id: "a3", action: "Login ke dashboard", target: "-", time: "Jul 24, 2026 09:15" },
      { id: "a4", action: "Mengekspor laporan bulanan", target: "Report Juni 2026", time: "Jul 23, 2026 16:40" },
    ],
  },
  {
    id: 2,
    name: "Rina Wijaya",
    email: "rina.w@fisiobook.com",
    phone: "+62 811-0000-0002",
    role: "Branch Admin",
    branch: "Jakarta",
    lastLogin: "Jul 24, 2026 08:30",
    status: "active",
    joinedAt: "15 Jun 2021",
    location: "Jakarta Selatan",
    bio: "Administrator cabang Jakarta yang mengelola operasional harian dan therapist lokal.",
    twoFactor: true,
    permissions: [
      { module: "User Management", level: "Branch Only" },
      { module: "Booking Management", level: "Full Access" },
      { module: "Payment & Finance", level: "View Only" },
      { module: "Reports & Analytics", level: "Branch Only" },
      { module: "System Settings", level: "No Access" },
    ],
    activity: [
      { id: "a1", action: "Menambah therapist baru", target: "Dr. Sari Wulandari", time: "Jul 24, 2026 08:45" },
      { id: "a2", action: "Login ke dashboard", target: "-", time: "Jul 24, 2026 08:30" },
      { id: "a3", action: "Membatalkan booking", target: "BOOK-2026-1204", time: "Jul 23, 2026 15:10" },
    ],
  },
  {
    id: 3,
    name: "Bambang Surya",
    email: "bambang.s@fisiobook.com",
    phone: "+62 811-0000-0003",
    role: "Branch Admin",
    branch: "Surabaya",
    lastLogin: "Jul 23, 2026 17:45",
    status: "active",
    joinedAt: "02 Sep 2021",
    location: "Surabaya",
    bio: "Administrator cabang Surabaya yang menangani penjadwalan dan koordinasi pasien.",
    twoFactor: false,
    permissions: [
      { module: "User Management", level: "Branch Only" },
      { module: "Booking Management", level: "Full Access" },
      { module: "Payment & Finance", level: "View Only" },
      { module: "Reports & Analytics", level: "Branch Only" },
      { module: "System Settings", level: "No Access" },
    ],
    activity: [
      { id: "a1", action: "Memperbarui jadwal therapist", target: "Dr. Maya Sari", time: "Jul 23, 2026 17:50" },
      { id: "a2", action: "Login ke dashboard", target: "-", time: "Jul 23, 2026 17:45" },
    ],
  },
  {
    id: 4,
    name: "Fitri Handayani",
    email: "fitri.h@fisiobook.com",
    phone: "+62 811-0000-0004",
    role: "Support Admin",
    branch: "Jakarta",
    lastLogin: "Jul 22, 2026 14:20",
    status: "active",
    joinedAt: "11 Apr 2023",
    location: "Jakarta Timur",
    bio: "Tim support yang menangani pertanyaan pengguna dan penyelesaian keluhan.",
    twoFactor: true,
    permissions: [
      { module: "User Management", level: "View Only" },
      { module: "Booking Management", level: "View Only" },
      { module: "Payment & Finance", level: "No Access" },
      { module: "Reports & Analytics", level: "No Access" },
      { module: "System Settings", level: "No Access" },
    ],
    activity: [
      { id: "a1", action: "Menanggapi tiket support", target: "TICKET-8842", time: "Jul 22, 2026 14:35" },
      { id: "a2", action: "Login ke dashboard", target: "-", time: "Jul 22, 2026 14:20" },
    ],
  },
  {
    id: 5,
    name: "Hendra Gunawan",
    email: "hendra.g@fisiobook.com",
    phone: "+62 811-0000-0005",
    role: "Branch Admin",
    branch: "Bandung",
    lastLogin: "Jul 15, 2026 10:00",
    status: "suspended",
    joinedAt: "19 Jul 2022",
    location: "Bandung",
    bio: "Administrator cabang Bandung. Akses saat ini ditangguhkan sementara.",
    twoFactor: false,
    permissions: [
      { module: "User Management", level: "No Access" },
      { module: "Booking Management", level: "No Access" },
      { module: "Payment & Finance", level: "No Access" },
      { module: "Reports & Analytics", level: "No Access" },
      { module: "System Settings", level: "No Access" },
    ],
    activity: [
      { id: "a1", action: "Akses ditangguhkan oleh Super Admin", target: "-", time: "Jul 16, 2026 09:00" },
      { id: "a2", action: "Login ke dashboard", target: "-", time: "Jul 15, 2026 10:00" },
    ],
  },
]

export const roleBadge = {
  "Super Admin": "default",
  "Branch Admin": "info",
  "Support Admin": "secondary",
}

export function getAdminById(id) {
  return admins.find((a) => String(a.id) === String(id))
}

const DEFAULT_PERMISSIONS_BY_ROLE = {
  "Super Admin": [
    { module: "User Management", level: "Full Access" },
    { module: "Booking Management", level: "Full Access" },
    { module: "Payment & Finance", level: "Full Access" },
    { module: "Reports & Analytics", level: "Full Access" },
    { module: "System Settings", level: "Full Access" },
  ],
  "Branch Admin": [
    { module: "User Management", level: "Branch Only" },
    { module: "Booking Management", level: "Full Access" },
    { module: "Payment & Finance", level: "View Only" },
    { module: "Reports & Analytics", level: "Branch Only" },
    { module: "System Settings", level: "No Access" },
  ],
  "Support Admin": [
    { module: "User Management", level: "View Only" },
    { module: "Booking Management", level: "View Only" },
    { module: "Payment & Finance", level: "No Access" },
    { module: "Reports & Analytics", level: "No Access" },
    { module: "System Settings", level: "No Access" },
  ],
}

export function createAdmin(form) {
  const nextId = admins.reduce((max, a) => Math.max(max, a.id), 0) + 1
  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  const joinedAt = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const newAdmin = {
    id: nextId,
    name: form.name,
    email: form.email,
    phone: form.phone,
    role: form.role,
    branch: form.branch,
    lastLogin: "-",
    status: form.status,
    joinedAt,
    location: form.location,
    bio: form.bio,
    twoFactor: form.twoFactor,
    permissions:
      DEFAULT_PERMISSIONS_BY_ROLE[form.role] ||
      DEFAULT_PERMISSIONS_BY_ROLE["Support Admin"],
    activity: [{ id: "a1", action: "Akun admin dibuat", target: "-", time: now }],
  }

  admins.push(newAdmin)
  return newAdmin
}

export function updateAdmin(id, form) {
  const admin = getAdminById(id)
  if (!admin) return null
  admin.name = form.name
  admin.email = form.email
  admin.phone = form.phone
  admin.role = form.role
  admin.branch = form.branch
  admin.location = form.location
  admin.bio = form.bio
  admin.status = form.status
  admin.twoFactor = form.twoFactor
  return admin
}
