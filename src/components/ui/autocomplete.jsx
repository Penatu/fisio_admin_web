import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { DismissableLayerBranch } from "@radix-ui/react-dismissable-layer"
import { Check, ChevronDown, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Autocomplete({
  id,
  inputValue,
  onInputChange,
  options = [],
  value = null,
  onValueChange,
  getOptionValue = (option) => option.value,
  getOptionLabel = (option) => option.label,
  placeholder = "Cari...",
  emptyText = "Tidak ada hasil.",
  loadingText = "Memuat...",
  loading = false,
  disabled = false,
  error = "",
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuStyle, setMenuStyle] = useState(null)

  const selectedValue = value ? getOptionValue(value) : ""
  const showMenu = open && !disabled

  useEffect(() => {
    setActiveIndex(options.length > 0 ? 0 : -1)
  }, [options, showMenu])

  useEffect(() => {
    if (!showMenu) return

    function place() {
      const anchor = rootRef.current
      if (!anchor) return
      const rect = anchor.getBoundingClientRect()
      const gap = 4
      const maxHeight = 240
      const spaceBelow = window.innerHeight - rect.bottom - gap
      const spaceAbove = rect.top - gap
      const openUp = spaceBelow < 160 && spaceAbove > spaceBelow
      setMenuStyle({
        position: "fixed",
        left: rect.left,
        width: rect.width,
        maxHeight,
        zIndex: 60,
        top: openUp ? "auto" : rect.bottom + gap,
        bottom: openUp ? window.innerHeight - rect.top + gap : "auto",
      })
    }

    place()
    window.addEventListener("resize", place)
    window.addEventListener("scroll", place, true)
    return () => {
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", place, true)
    }
  }, [showMenu])

  useEffect(() => {
    if (!showMenu) return
    function onPointerDown(event) {
      if (rootRef.current?.contains(event.target)) return
      if (listRef.current?.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [showMenu])

  useEffect(() => {
    if (!showMenu || activeIndex < 0) return
    const option = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    option?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, showMenu])

  function selectOption(option) {
    onValueChange?.(option)
    onInputChange?.(getOptionLabel(option))
    setOpen(false)
    inputRef.current?.focus()
  }

  function clearValue() {
    onInputChange?.("")
    onValueChange?.(null)
    setOpen(true)
    inputRef.current?.focus()
  }

  function handleInputChange(event) {
    const next = event.target.value
    onInputChange?.(next)
    if (value && getOptionLabel(value) !== next) onValueChange?.(null)
    setOpen(true)
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!showMenu) {
        setOpen(true)
        return
      }
      setActiveIndex((index) => {
        if (options.length === 0) return -1
        return index >= options.length - 1 ? 0 : index + 1
      })
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!showMenu) {
        setOpen(true)
        return
      }
      setActiveIndex((index) => {
        if (options.length === 0) return -1
        return index <= 0 ? options.length - 1 : index - 1
      })
      return
    }

    if (event.key === "Enter" && showMenu) {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) selectOption(option)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  }

  const activeOption = options[activeIndex]
  const activeId = activeOption ? `${listId}-option-${activeIndex}` : undefined

  return (
    <div ref={rootRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={showMenu}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showMenu ? activeId : undefined}
        aria-invalid={error ? true : undefined}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onChange={handleInputChange}
        onMouseDown={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-16 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="absolute inset-y-0 right-2 flex items-center gap-1">
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
        {inputValue && !disabled ? (
          <button
            type="button"
            className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearValue}
            aria-label="Hapus pilihan"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="button"
          className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setOpen((current) => !current)}
          disabled={disabled}
          aria-label={showMenu ? "Tutup daftar" : "Buka daftar"}
          tabIndex={-1}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", showMenu && "rotate-180")} />
        </button>
      </div>

      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}

      {showMenu
        ? createPortal(
            <DismissableLayerBranch
              ref={listRef}
              id={listId}
              role="listbox"
              style={{ ...menuStyle, pointerEvents: "auto" }}
              className="pointer-events-auto overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {loading && options.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">{loadingText}</p>
              ) : options.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
              ) : (
                options.map((option, index) => {
                  const optionValue = getOptionValue(option)
                  const selected = optionValue === selectedValue
                  const active = index === activeIndex
                  return (
                    <button
                      key={optionValue}
                      id={`${listId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-index={index}
                      onPointerDown={(event) => {
                        event.preventDefault()
                        selectOption(option)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none",
                        active && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Check className={cn("h-4 w-4 shrink-0", selected ? "opacity-100" : "opacity-0")} />
                      <span className="truncate">{getOptionLabel(option)}</span>
                    </button>
                  )
                })
              )}
            </DismissableLayerBranch>,
            document.body
          )
        : null}
    </div>
  )
}
