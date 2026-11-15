import { useEffect, useRef, useState } from "react"
import { Plus } from "lucide-react"
import { useGetCategoryList } from "@/pages/services/hooks/useGetCategoryList"
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

const emptyForm = {
  name: "",
  categoryId: "",
  duration: "",
  price: "",
  description: "",
  status: "active",
  therapistSharePct: "",
  operationalCost: "",
}

const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

export function ServiceFormSheet({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  submitIcon = true,
  initialValues,
  onSubmit,
  isSubmitting = false,
  error = "",
}) {
  const [form, setForm] = useState(emptyForm)
  const initialRef = useRef(initialValues)
  const { categories, isLoading: isCategoriesLoading, error: categoryError } = useGetCategoryList(open)
  initialRef.current = initialValues

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialRef.current })
    }
  }, [open])

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const selected = categories.find((item) => String(item.id) === String(form.categoryId))
    try {
      await onSubmit({
        ...form,
        category: selected?.name || "",
      })
      onOpenChange(false)
    } catch {
      // The caller stores and displays the error.
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>

          <SheetBody className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Layanan</Label>
              <Input
                id="name"
                placeholder="cth. Home Visit Physiotherapy"
                value={form.name}
                onChange={setField("name")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                className={fieldClass}
                value={form.categoryId}
                onChange={setField("categoryId")}
                required
                disabled={isCategoriesLoading || isSubmitting}
              >
                <option value="" disabled>
                  {isCategoriesLoading ? "Memuat kategori..." : "Pilih kategori"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoryError ? <p className="text-xs text-destructive">{categoryError}</p> : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (menit)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="60"
                  value={form.duration}
                  onChange={setField("duration")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  placeholder="350000"
                  value={form.price}
                  onChange={setField("price")}
                  required
                />
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <p className="mb-3 text-sm font-medium">Informasi Bagi Untung</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="therapistSharePct">Bagi Hasil Terapis (%)</Label>
                  <Input
                    id="therapistSharePct"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="65"
                    value={form.therapistSharePct}
                    onChange={setField("therapistSharePct")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operationalCost">Biaya Operasional (Rp)</Label>
                  <Input
                    id="operationalCost"
                    type="number"
                    min="0"
                    placeholder="30000"
                    value={form.operationalCost}
                    onChange={setField("operationalCost")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className={fieldClass}
                value={form.status}
                onChange={setField("status")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi singkat mengenai layanan ini..."
                value={form.description}
                onChange={setField("description")}
                rows={4}
              />
            </div>
          </SheetBody>

          <SheetFooter>
            {error ? <p className="text-sm text-destructive sm:mr-auto">{error}</p> : null}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" className="gap-2" disabled={isSubmitting || isCategoriesLoading}>
              {submitIcon ? <Plus className="h-4 w-4" /> : null}
              {isSubmitting ? "Menyimpan..." : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
