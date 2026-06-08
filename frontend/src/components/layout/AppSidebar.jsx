import { Link, NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  Sparkles,
  ChevronUp,
  UserCircle2,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

const navigationItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/login", label: "Login", icon: LogIn },
]

function SidebarBrand() {
  const { open, isMobile } = useSidebar()

  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="h-5 w-5" />
      </div>
      {(open || isMobile) && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">PalSalon</p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            Dashboard Workspace
          </p>
        </div>
      )}
    </Link>
  )
}

function SidebarUserMenu() {
  const { open, isMobile } = useSidebar()
  const { user, logout } = useAuth()
  const userLabel = user?.name || "PalSalon Admin"
  const userSubLabel = user?.email || "owner@palsalon.local"
  const avatarFallback = userLabel
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-3 rounded-xl px-2 py-2 hover:bg-sidebar-accent"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>{avatarFallback || "PS"}</AvatarFallback>
          </Avatar>
          {(open || isMobile) && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">{userLabel}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">{userSubLabel}</p>
              </div>
              <ChevronUp className="h-4 w-4 opacity-70" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserCircle2 className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AppSidebar() {
  const location = useLocation()
  const { open, isMobile } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === to}
                    tooltip={label}
                  >
                    <NavLink to={to}>
                      <Icon className="h-4 w-4" />
                      {(open || isMobile) && <span>{label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" disabled>
                  <Settings className="h-4 w-4" />
                  {(open || isMobile) && <span>Settings</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
