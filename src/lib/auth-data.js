export const AUTH_USER_KEY = "fisiobook_auth_user"
export const AUTH_TOKEN_KEY = "fisiobook_auth_token"

export function decodeTokenPayload(token) {
  if (!token || typeof token !== "string") return null

  const [, payload] = token.split(".")
  if (!payload) return null

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const payload = decodeTokenPayload(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 <= Date.now()
}

export function isSuperAdminRole(role) {
  return String(role ?? "").toLowerCase().replace(/[_\s-]+/g, "") === "superadmin"
}

export function buildSessionUser(data) {
  const claims = decodeTokenPayload(data?.token) || {}

  return {
    email: data?.email || claims.email || "",
    code: data?.code || "",
    isVerified: Boolean(data?.isVerified),
    role: claims.roleName || "",
    userId: claims.userId || "",
  }
}
