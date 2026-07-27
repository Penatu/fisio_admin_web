import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

function SheetOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn("sheet-overlay fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}
      {...props}
    />
  )
}

const sideClasses = {
  right: "sheet-content-right inset-y-0 right-0 h-full w-full border-l sm:max-w-md",
  left: "sheet-content-left inset-y-0 left-0 h-full w-full border-r sm:max-w-md",
}

function SheetContent({ side = "right", className, children, ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5 border-b p-6", className)} {...props} />
  )
}

function SheetBody({ className, ...props }) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-2", className)} {...props} />
  )
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 border-t p-6 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
