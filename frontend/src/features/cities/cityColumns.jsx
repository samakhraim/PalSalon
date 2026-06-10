import { Badge } from "@/components/ui/badge"
import CityActionsDropdown from "@/features/cities/components/CityActionsDropdown"
import CityImagePreview from "@/features/cities/components/CityImagePreview"

const formatDate = (value) => {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-CA").format(new Date(value))
}

export function getCityColumns({ canManage, onDelete, onToggleStatus }) {
  const columns = [
    {
      key: "id",
      header: "ID",
      render: (city) => city.id,
    },
    {
      key: "image",
      header: "Image",
      render: (city) => (
        <CityImagePreview image={city.image} alt={city.name?.en || "City image"} />
      ),
    },
    {
      key: "nameEn",
      header: "English Name",
      render: (city) => city.name?.en || "-",
    },
    {
      key: "nameAr",
      header: "Arabic Name",
      render: (city) => (
        <span dir="rtl" className="inline-block">
          {city.name?.ar || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (city) => (
        <Badge variant={city.status ? "default" : "secondary"}>
          {city.status ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (city) => formatDate(city.createdAt),
    },
  ]

  if (canManage) {
    columns.push({
      key: "actions",
      header: "Actions",
      render: (city) => (
        <CityActionsDropdown
          city={city}
          canManage={canManage}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ),
    })
  }

  return columns
}
