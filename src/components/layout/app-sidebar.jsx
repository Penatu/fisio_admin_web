import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileBarChart,
  HeartPulse,
  LayoutDashboard,
  PanelLeft,
  Settings,
  Stethoscope,
  UserCog,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "User Management",
    icon: Users,
    children: [
      { title: "Therapist", href: "/users/therapists", icon: Stethoscope },
      { title: "Patient", href: "/users/patients", icon: HeartPulse },
      { title: "Admin", href: "/users/admins", icon: UserCog },
    ],
  },
  {
    title: "Services",
    icon: Activity,
    href: "/services",
  },
  {
    title: "Bookings",
    icon: CalendarDays,
    href: "/bookings",
  },
  {
    title: "Payments",
    icon: CreditCard,
    href: "/payments",
  },
  {
    title: "Report",
    icon: FileBarChart,
    href: "/reports",
  },
]

function NavItem({ item, collapsed }) {
  const location = useLocation()
  const hasChildren = item.children?.length > 0
  const isChildActive = item.children?.some((child) => location.pathname === child.href)
  const isActive = item.href ? location.pathname === item.href : isChildActive
  const [open, setOpen] = useState(isChildActive)

  if (hasChildren) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
              isChildActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                {open ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </>
            )}
          </button>
        </CollapsibleTrigger>
        {!collapsed && (
          <CollapsibleContent className="mt-1 space-y-1 pl-4">
            {item.children.map((child) => {
              const isChildItemActive = location.pathname === child.href
              return (
                <Link
                  key={child.href}
                  to={child.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                    isChildItemActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <child.icon className="h-4 w-4 shrink-0" />
                  {child.title}
                </Link>
              )
            })}
          </CollapsibleContent>
        )}
      </Collapsible>
    )
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  )
}

export function AppSidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartPulse className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">FisioBook</span>
            <span className="text-xs text-muted-foreground">Super Admin</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">Menu</p>
        )}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.title} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {!collapsed && (
          <>
            <p className="mb-2 mt-6 px-3 text-xs font-medium text-muted-foreground">
              Settings
            </p>
            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </>
        )}
      </div>

      <div className="border-t p-3">
        <div className={cn("flex items-center gap-3 rounded-lg p-2", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
              AD
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">Admin</span>
              <span className="truncate text-xs text-muted-foreground">admin@fisiobook.com</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export function SidebarToggle({ collapsed, onToggle }) {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}
