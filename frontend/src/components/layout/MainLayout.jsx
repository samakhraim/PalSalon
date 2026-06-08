import { Outlet } from "react-router-dom"

import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs"
import AppSidebar from "@/components/layout/AppSidebar"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function MainLayout() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="border-b bg-background px-4 py-3 md:px-6">
            <AppBreadcrumbs />
          </div>
          <div className="flex-1 px-4 py-6 md:px-6">
            <Outlet />
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
