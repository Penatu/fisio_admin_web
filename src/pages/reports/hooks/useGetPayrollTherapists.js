import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ENDPOINTS } from "@/lib/endpoints"

function formatBankAccount(item) {
  if (item?.bankAccountFormatted) return item.bankAccountFormatted
  const account = [item?.bankName, item?.accountNumber].filter(Boolean).join(" - ")
  if (item?.accountName && account) return `${account} a.n. ${item.accountName}`
  return account || item?.accountName || ""
}

function mapTherapist(item) {
  return {
    code: item?.therapistCode || "",
    name: item?.therapistName || "-",
    bankAccount: formatBankAccount(item),
    paymentMethod: item?.paymentMethod || "",
  }
}

export function useGetPayrollTherapists(enabled = true, search = "") {
  const { token } = useAuth()
  const [therapists, setTherapists] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!enabled || !token) return

    const controller = new AbortController()
    let active = true
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    const query = params.toString()

    async function loadTherapists() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch(
          query
            ? `${ENDPOINTS.PAYROLL_GET_THERAPIST_LIST}?${query}`
            : ENDPOINTS.PAYROLL_GET_THERAPIST_LIST,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        )

        let body = null
        try {
          body = await response.json()
        } catch {
          body = null
        }

        if (!response.ok || !body?.success) {
          throw new Error(body?.message || body?.messageTitle || "Gagal memuat daftar terapis.")
        }

        if (!active) return
        const list = Array.isArray(body.data) ? body.data : body.data?.data || []
        setTherapists(list.map(mapTherapist).filter((item) => item.code))
      } catch (err) {
        if (!active || err.name === "AbortError") return
        setTherapists([])
        setError(err.message || "Gagal memuat daftar terapis.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadTherapists()

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, token, debouncedSearch])

  return { therapists, isLoading, error }
}
