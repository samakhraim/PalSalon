import { useEffect, useState } from "react"
import { Pencil, RefreshCcw, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { cityColumns } from "@/features/cities/config/cityColumns"
import {
  deleteCity,
  getCities,
  toggleCityStatus,
} from "@/features/cities/cityService"

export default function CitiesPage() {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadCities = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const nextCities = await getCities()
      setCities(nextCities)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load cities")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCities()
  }, [])

  const handleDeleteCity = async (cityId) => {
    try {
      await deleteCity(cityId)
      await loadCities()
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to delete city")
    }
  }

  const handleToggleStatus = async (cityId) => {
    try {
      await toggleCityStatus(cityId)
      await loadCities()
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Unable to update city status"
      )
    }
  }

  return (
    <IndexPage
      title="Cities"
      description="Manage active and inactive cities for future app visibility rules."
      createLabel="Create City"
      createPath="/cities/create"
      createPermission="Cities-manage"
      data={cities}
      columns={cityColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No cities found."
      actions={(city) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/cities/${city.id}/edit`,
          permission: "Cities-manage",
        },
        {
          label: "Toggle Status",
          icon: RefreshCcw,
          onClick: () => handleToggleStatus(city.id),
          permission: "Cities-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete city",
          confirmDescription: `This action will permanently remove ${city.name?.en || "this city"}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteCity(city.id),
          permission: "Cities-manage",
        },
      ]}
    />
  )
}
