"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type SidebarContextValue = {
  isMobile: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  openMobile: boolean
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  children,
}: React.PropsWithChildren<{ defaultOpen?: boolean }>) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(defaultOpen)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current)
      return
    }

    setOpen((current) => !current)
  }, [isMobile])

  const value = React.useMemo(
    () => ({
      isMobile,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [isMobile, open, openMobile]
  )

  return (
    <SidebarContext.Provider value={value}>
      <div className="flex min-h-screen w-full bg-muted/30">{children}</div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 border-r bg-sidebar p-0 text-sidebar-foreground">
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        "hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 md:flex md:flex-col",
        open ? "md:w-72" : "md:w-20",
        className
      )}
    >
      {children}
    </aside>
  )
}

function SidebarInset({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"main">) {
  return <main className={cn("flex min-h-screen flex-1 flex-col", className)} {...props} />
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

function SidebarHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("border-b border-sidebar-border p-4", className)} {...props} />
}

function SidebarContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-1 flex-col gap-4 overflow-y-auto p-4", className)} {...props} />
}

function SidebarFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("border-t border-sidebar-border p-4", className)} {...props} />
}

function SidebarGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return <section className={cn("space-y-2", className)} {...props} />
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { open, isMobile } = useSidebar()

  return (
    <div
      className={cn("px-2 text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/60", !open && !isMobile && "sr-only", className)}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />
}

function SidebarMenu({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ul">) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

function SidebarMenuItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li">) {
  return <li className={cn(className)} {...props} />
}

function SidebarMenuButton({
  asChild = false,
  className,
  isActive = false,
  tooltip,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string
}) {
  const Comp = asChild ? Slot : "button"
  const { open, isMobile } = useSidebar()

  const button = (
    <Comp
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        !open && !isMobile && "justify-center px-0",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )

  if (!tooltip || open || isMobile) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function SidebarRail() {
  return null
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
}
