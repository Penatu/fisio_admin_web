export const STATIC_USERS = [
  {
    id: 1,
    email: "admin@fisiobook.com",
    password: "admin123",
    name: "Admin Utama",
    role: "Super Admin",
    initials: "AU",
  },
  {
    id: 2,
    email: "branch@fisiobook.com",
    password: "branch123",
    name: "Rina Wijaya",
    role: "Branch Admin",
    initials: "RW",
  },
]

export const AUTH_STORAGE_KEY = "fisiobook_auth_user"

export function validateCredentials(email, password) {
  const user = STATIC_USERS.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase().trim() &&
      item.password === password
  )

  if (!user) return null

  const { password: _, ...safeUser } = user
  return safeUser
}
