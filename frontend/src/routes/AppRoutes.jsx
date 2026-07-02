import { Navigate, Route, Routes } from "react-router-dom"

import PermissionRoute from "@/components/common/PermissionRoute"
import ProtectedRoute from "@/components/common/ProtectedRoute"
import MainLayout from "@/components/layout/MainLayout"
import { useAuth } from "@/hooks/useAuth"
import LoginPage from "@/features/auth/pages/LoginPage"
import CategoriesPage from "@/features/categories/pages/CategoriesPage"
import CreateCategoryPage from "@/features/categories/pages/CreateCategoryPage"
import CitiesPage from "@/features/cities/pages/CitiesPage"
import CreateCityPage from "@/features/cities/pages/CreateCityPage"
import EditCategoryPage from "@/features/categories/pages/EditCategoryPage"
import EditCityPage from "@/features/cities/pages/EditCityPage"
import ContactUsPage from "@/features/contactUs/pages/ContactUsPage"
import CreateCustomerPage from "@/features/customers/pages/CreateCustomerPage"
import CustomersPage from "@/features/customers/pages/CustomersPage"
import EditCustomerPage from "@/features/customers/pages/EditCustomerPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import CreateFaqPage from "@/features/faqs/pages/CreateFaqPage"
import EditFaqPage from "@/features/faqs/pages/EditFaqPage"
import FaqsPage from "@/features/faqs/pages/FaqsPage"
import CreateRolePage from "@/features/roles/pages/CreateRolePage"
import EditRolePage from "@/features/roles/pages/EditRolePage"
import RolesPage from "@/features/roles/pages/RolesPage"
import CreateSalonPage from "@/features/salons/pages/CreateSalonPage"
import EditSalonPage from "@/features/salons/pages/EditSalonPage"
import SalonsPage from "@/features/salons/pages/SalonsPage"
import CreateServicePage from "@/features/services/pages/CreateServicePage"
import EditServicePage from "@/features/services/pages/EditServicePage"
import ServicesPage from "@/features/services/pages/ServicesPage"
import CreateSalonOwnerPage from "@/features/salonOwners/pages/CreateSalonOwnerPage"
import EditSalonOwnerPage from "@/features/salonOwners/pages/EditSalonOwnerPage"
import SalonOwnersPage from "@/features/salonOwners/pages/SalonOwnersPage"
import CreateUserPage from "@/features/users/pages/CreateUserPage"
import EditUserPage from "@/features/users/pages/EditUserPage"
import UsersPage from "@/features/users/pages/UsersPage"
import NotFoundPage from "@/pages/NotFoundPage"

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
}

function LoginRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <LoginPage />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route element={<PermissionRoute permission="Categories-view" />}>
            <Route path="/categories" element={<CategoriesPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Categories-manage" />}>
            <Route path="/categories/create" element={<CreateCategoryPage />} />
            <Route path="/categories/:id/edit" element={<EditCategoryPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Cities-view" />}>
            <Route path="/cities" element={<CitiesPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Cities-manage" />}>
            <Route path="/cities/create" element={<CreateCityPage />} />
            <Route path="/cities/:id/edit" element={<EditCityPage />} />
          </Route>
          <Route element={<PermissionRoute permission="ContactUs-view" />}>
            <Route path="/contact-us" element={<ContactUsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Customers-view" />}>
            <Route path="/customers" element={<CustomersPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Customers-manage" />}>
            <Route path="/customers/create" element={<CreateCustomerPage />} />
            <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
          </Route>
          <Route element={<PermissionRoute permission="SalonOwners-view" />}>
            <Route path="/salon-owners" element={<SalonOwnersPage />} />
          </Route>
          <Route element={<PermissionRoute permission="SalonOwners-manage" />}>
            <Route
              path="/salon-owners/create"
              element={<CreateSalonOwnerPage />}
            />
            <Route
              path="/salon-owners/:id/edit"
              element={<EditSalonOwnerPage />}
            />
          </Route>
          <Route element={<PermissionRoute permission="Salons-view" />}>
            <Route path="/salons" element={<SalonsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Salons-manage" />}>
            <Route path="/salons/create" element={<CreateSalonPage />} />
            <Route path="/salons/:id/edit" element={<EditSalonPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Services-view" />}>
            <Route path="/services" element={<ServicesPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Services-manage" />}>
            <Route path="/services/create" element={<CreateServicePage />} />
            <Route path="/services/:id/edit" element={<EditServicePage />} />
          </Route>
          <Route element={<PermissionRoute permission="FAQ-view" />}>
            <Route path="/faqs" element={<FaqsPage />} />
          </Route>
          <Route element={<PermissionRoute permission="FAQ-manage" />}>
            <Route path="/faqs/create" element={<CreateFaqPage />} />
            <Route path="/faqs/:id/edit" element={<EditFaqPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Users-view" />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Users-manage" />}>
            <Route path="/users/create" element={<CreateUserPage />} />
            <Route path="/users/:id/edit" element={<EditUserPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Role-view" />}>
            <Route path="/roles" element={<RolesPage />} />
          </Route>
          <Route element={<PermissionRoute permission="Role-manage" />}>
            <Route path="/roles/create" element={<CreateRolePage />} />
            <Route path="/roles/:id/edit" element={<EditRolePage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
