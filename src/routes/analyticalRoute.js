import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleValidation.js";
import { ROLES } from "../config/constants.js";
import { totalOrders, totalProducts, totalUser } from "../AdminDashboard/analyticsDashboard.js";
const router = Router();
router.get("/totalUsers", authMiddleware, authorizeRoles(ROLES.ADMIN), totalUser);
router.get("/totalProducts", authMiddleware, authorizeRoles(ROLES.ADMIN), totalProducts);
router.get("/totalOrders", authMiddleware, authorizeRoles(ROLES.ADMIN), totalOrders);

export default router
