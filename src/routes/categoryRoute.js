import { Router } from "express";
import { createCategory } from "../controllers/categoryController.js";
import { authorizeRoles } from "../middleware/roleValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/create",authMiddleware, authorizeRoles("admin"), createCategory);

export default router;