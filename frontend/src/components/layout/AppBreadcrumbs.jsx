import { Link, useLocation } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function formatSegment(segment) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function AppBreadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split("/").filter(Boolean)
  const items = [{ label: "Home", href: "/dashboard" }]

  let currentPath = ""
  segments.forEach((segment) => {
    currentPath += `/${segment}`
    items.push({ label: formatSegment(segment), href: currentPath })
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return [
            <BreadcrumbItem key={item.href}>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>,
            !isLast ? (
              <BreadcrumbSeparator key={`${item.href}-separator`} />
            ) : null,
          ]
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
