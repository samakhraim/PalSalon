import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { categoryColumns } from "@/features/categories/config/categoryColumns"
import {
  deleteCategory,
  getCategories,
} from "@/features/categories/categoryService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function CategoriesPage() {
  const { showError, showSuccess } = useToastMessage()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadCategories = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setCategories(await getCategories())
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Unable to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId)
      showSuccess("Category deleted successfully.")
      await loadCategories()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete category"))
    }
  }

  return (
    <IndexPage
      title="Categories"
      description="Manage the bilingual service categories available across salons."
      createLabel="Add Category"
      createPath="/categories/create"
      createPermission="Categories-manage"
      data={categories}
      columns={categoryColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No categories found."
      actions={(category) => [
        {
          label: "Edit",
          icon: Pencil,
          to: `/categories/${category.id}/edit`,
          permission: "Categories-manage",
        },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete category",
          confirmDescription: `This action will permanently remove ${category.name?.en || "this category"}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteCategory(category.id),
          permission: "Categories-manage",
        },
      ]}
    />
  )
}
