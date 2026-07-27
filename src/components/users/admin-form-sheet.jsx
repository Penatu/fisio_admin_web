import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export const ROLE_OPTIONS = ["Super Admin", "Branch Admin", "Support Admin"]

export const ADMIN_STATUS_OPTIONS = [
  { value: "active", label: "Active", dot: "bg-emerald-500" },
  { value: "suspended", label: "Suspended", dot: "bg-red-500" },
]

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "Branch Admin",
  branch: "",
  location: "",
  bio: "",
  status: "active",
  twoFactor: false,
}

export function AdminFormSheet({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Simpan",
  initialValues,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialValues })
    }
  }, [open, initialValues])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name.trim() && form.email.trim() && form.branch.trim()

  function handleSubmit() {
    if (!canSave) return
    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>

        <SheetBody className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Nama</Label>
            <Input
              id="admin-name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-phone">Telepon</Label>
            <Input
              id="admin-phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Peran</Label>
            <div className="grid grid-cols-1 gap-2">
              {ROLE_OPTIONS.map((role) => {
                const selected = form.role === role
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => updateField("role", role)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                        : "border-input text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {role}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="admin-branch">Cabang</Label>
              <Input
                id="admin-branch"
                value={form.branch}
                onChange={(e) => updateField("branch", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-location">Lokasi</Label>
              <Input
                id="admin-location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-bio">Bio</Label>
            <Textarea
              id="admin-bio"
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {ADMIN_STATUS_OPTIONS.map((option) => {
                const selected = form.status === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("status", option.value)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                        : "border-input text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", option.dot)} />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Autentikasi 2 Faktor</p>
              <p className="text-xs text-muted-foreground">
                Tingkatkan keamanan akun admin
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.twoFactor}
              onClick={() => updateField("twoFactor", !form.twoFactor)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                form.twoFactor ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                  form.twoFactor ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={!canSave}>
            {submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
