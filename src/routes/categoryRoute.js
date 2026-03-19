import { Router } from "express";
import { createCategory, deleteCategory ,updateCategory} from "../controllers/categoryController.js";
import { authorizeRoles } from "../middleware/roleValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/create",authMiddleware, authorizeRoles("admin"), createCategory);
router.delete("/delete/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);
router.put("/update/:id",authMiddleware, authorizeRoles("admin"), updateCategory);



export default router;