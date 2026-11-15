import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
}

export function AdminFormSheet({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Buat Admin",
  onSubmit,
  isSubmitting = false,
  error = "",
}) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) setForm(emptyForm)
  }, [open])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave =
    form.fullName.trim() && form.email.trim().includes("@") && form.password.trim()

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canSave || isSubmitting) return
    try {
      await onSubmit(form)
      onOpenChange(false)
    } catch {
      // The caller stores the message shown in the footer.
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>

          <SheetBody className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-full-name">Nama Lengkap</Label>
              <Input
                id="admin-full-name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="Nama admin"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="admin@yopmail.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="Masukkan password"
                required
                disabled={isSubmitting}
              />
            </div>
          </SheetBody>

          {error ? <p className="px-6 text-sm text-destructive">{error}</p> : null}
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={!canSave || isSubmitting}>
              {isSubmitting ? "Menyimpan..." : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
