import express from "express"

import authRoutes from "../modules/auth/auth.routes.js"
import categoryRoutes from "../modules/categories/category.routes.js"
import cityRoutes from "../modules/cities/city.routes.js"
import contactUsRoutes from "../modules/contactUs/contactUs.routes.js"
import customerRoutes from "../modules/customers/customer.routes.js"
import faqRoutes from "../modules/faqs/faq.routes.js"
import mediaRoutes from "../modules/media/media.routes.js"
import introRoutes from "./intro.routes.js"
import pageRoutes from "./page.routes.js"
import permissionRoutes from "../modules/permissions/permission.routes.js"
import roleRoutes from "../modules/roles/role.routes.js"
import salonRoutes from "../modules/salons/salon.routes.js"
import salonOwnerRoutes from "../modules/salonOwners/salonOwner.routes.js"
import serviceRoutes from "../modules/services/service.routes.js"
import userRoutes from "../modules/users/user.routes.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/categories", categoryRoutes)
router.use("/cities", cityRoutes)
router.use("/contact-us", contactUsRoutes)
router.use("/customers", customerRoutes)
router.use("/faqs", faqRoutes)
router.use("/intros", introRoutes)
router.use("/pages", pageRoutes)
router.use("/users", userRoutes)
router.use("/roles", roleRoutes)
router.use("/permissions", permissionRoutes)
router.use("/media", mediaRoutes)
router.use("/salon-owners", salonOwnerRoutes)
router.use("/salons", salonRoutes)
router.use("/services", serviceRoutes)

export default router
