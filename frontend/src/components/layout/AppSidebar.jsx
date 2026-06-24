import { useEffect, useMemo, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import {
  ChevronUp,
  CircleHelp,
  Store,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquareText,
  Minus,
  ShieldCheck,
  Plus,
  Sparkles,
  UserCircle2,
  Users,
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
import { hasAnyPermission, hasPermission } from "@/utils/permissions"

const sidebarSections = [
  {
    key: "main",
    label: "Main",
    items: [
      {
        key: "dashboard",
        type: "link",
        label: "Dashboard",
        icon: LayoutDashboard,
        to: "/dashboard",
      },
    ],
  },
  {
    key: "management",
    label: "Management",
    items: [
      {
        key: "users",
        type: "group",
        label: "Users",
        icon: Users,
        basePath: "/users",
        permissions: ["Users-view", "Users-manage"],
        children: [
          {
            key: "users-list",
            label: "List",
            to: "/users",
            permission: "Users-view",
            exact: true,
          },
          {
            key: "users-create",
            label: "Add User",
            to: "/users/create",
            permission: "Users-manage",
            exact: true,
          },
        ],
      },
      {
        key: "roles",
        type: "group",
        label: "Roles",
        icon: ShieldCheck,
        basePath: "/roles",
        permissions: ["Role-view", "Role-manage"],
        children: [
          {
            key: "roles-list",
            label: "List",
            to: "/roles",
            permission: "Role-view",
            exact: true,
          },
          {
            key: "roles-create",
            label: "Add Role",
            to: "/roles/create",
            permission: "Role-manage",
            exact: true,
          },
        ],
      },
      {
        key: "cities",
        type: "group",
        label: "Cities",
        icon: MapPin,
        basePath: "/cities",
        permissions: ["Cities-view", "Cities-manage"],
        children: [
          {
            key: "cities-list",
            label: "List",
            to: "/cities",
            permission: "Cities-view",
            exact: true,
          },
          {
            key: "cities-create",
            label: "Add City",
            to: "/cities/create",
            permission: "Cities-manage",
            exact: true,
          },
        ],
      },
      {
        key: "customers",
        type: "group",
        label: "Customers",
        icon: UserCircle2,
        basePath: "/customers",
        permissions: ["Customers-view", "Customers-manage"],
        children: [
          {
            key: "customers-list",
            label: "List",
            to: "/customers",
            permission: "Customers-view",
            exact: true,
          },
          {
            key: "customers-create",
            label: "Add Customer",
            to: "/customers/create",
            permission: "Customers-manage",
            exact: true,
          },
        ],
      },
      {
        key: "salon-owners",
        type: "group",
        label: "Salon Owners",
        icon: Store,
        basePath: "/salon-owners",
        permissions: ["SalonOwners-view", "SalonOwners-manage"],
        children: [
          {
            key: "salon-owners-list",
            label: "List",
            to: "/salon-owners",
            permission: "SalonOwners-view",
            exact: true,
          },
          {
            key: "salon-owners-create",
            label: "Add Salon Owner",
            to: "/salon-owners/create",
            permission: "SalonOwners-manage",
            exact: true,
          },
        ],
      },
      {
        key: "faqs",
        type: "group",
        label: "FAQ",
        icon: CircleHelp,
        basePath: "/faqs",
        permissions: ["FAQ-view", "FAQ-manage"],
        children: [
          {
            key: "faqs-list",
            label: "List",
            to: "/faqs",
            permission: "FAQ-view",
            exact: true,
          },
          {
            key: "faqs-create",
            label: "Add FAQ",
            to: "/faqs/create",
            permission: "FAQ-manage",
            exact: true,
          },
        ],
      },
      {
        key: "contact-us",
        type: "group",
        label: "Contact Us",
        icon: MessageSquareText,
        basePath: "/contact-us",
        permissions: ["ContactUs-view", "ContactUs-manage"],
        children: [
          {
            key: "contact-us-list",
            label: "List",
            to: "/contact-us",
            permission: "ContactUs-view",
            exact: true,
          },
        ],
      },
    ],
  },
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
  const { user } = useAuth()
  const [expandedGroups, setExpandedGroups] = useState({})

  const isActiveRoute = (to) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`)
  const isChildActive = (child) =>
    child.exact
      ? location.pathname === child.to
      : location.pathname === child.to ||
        location.pathname.startsWith(`${child.to}/`)

  const visibleSections = useMemo(
    () =>
      sidebarSections
        .map((section) => ({
          ...section,
          items: section.items
            .map((item) => {
              if (item.type === "link") {
                return item
              }

              const visibleChildren = item.children.filter(
                (child) => !child.permission || hasPermission(user, child.permission)
              )

              if (
                visibleChildren.length === 0 ||
                (item.permissions?.length > 0 &&
                  !hasAnyPermission(user, item.permissions))
              ) {
                return null
              }

              return {
                ...item,
                children: visibleChildren,
              }
            })
            .filter(Boolean),
        }))
        .filter((section) => section.items.length > 0),
    [user]
  )

  useEffect(() => {
    const groupsToOpen = visibleSections.flatMap((section) =>
      section.items
        .filter(
          (item) =>
            item.type === "group" &&
            (location.pathname === item.basePath ||
              location.pathname.startsWith(`${item.basePath}/`))
        )
        .map((item) => item.key)
    )

    if (groupsToOpen.length === 0) {
      return
    }

    setExpandedGroups((current) => {
      const nextState = { ...current }
      let changed = false

      groupsToOpen.forEach((groupKey) => {
        if (!nextState[groupKey]) {
          nextState[groupKey] = true
          changed = true
        }
      })

      return changed ? nextState : current
    })
  }, [location.pathname, visibleSections])

  const toggleGroup = (groupKey) => {
    setExpandedGroups((current) => ({
      ...current,
      [groupKey]: !current[groupKey],
    }))
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>

      <SidebarContent>
        {visibleSections.map((section) => (
          <SidebarGroup key={section.key}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  if (item.type === "link") {
                    const Icon = item.icon

                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActiveRoute(item.to)}
                          tooltip={item.label}
                        >
                          <NavLink to={item.to}>
                            <Icon className="h-4 w-4" />
                            {(open || isMobile) && <span>{item.label}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  const Icon = item.icon
                  const isExpanded = Boolean(expandedGroups[item.key])
                  const isParentActive =
                    location.pathname === item.basePath ||
                    location.pathname.startsWith(`${item.basePath}/`)

                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        type="button"
                        isActive={isParentActive}
                        tooltip={item.label}
                        onClick={() => toggleGroup(item.key)}
                      >
                        <Icon className="h-4 w-4" />
                        {(open || isMobile) && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {isExpanded ? (
                              <Minus className="h-4 w-4 opacity-70" />
                            ) : (
                              <Plus className="h-4 w-4 opacity-70" />
                            )}
                          </>
                        )}
                      </SidebarMenuButton>

                      {(open || isMobile) && isExpanded && (
                        <div className="ml-5 mt-1 border-l border-sidebar-border/80 pl-4">
                          <ul className="space-y-1">
                            {item.children.map((child) => (
                              <li key={child.key}>
                                <NavLink
                                  to={child.to}
                                  className={() =>
                                    [
                                      "block rounded-md px-3 py-2 text-sm transition-colors",
                                      isChildActive(child)
                                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    ].join(" ")
                                  }
                                >
                                  {child.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
