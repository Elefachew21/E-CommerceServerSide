import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/profileController.js";
const router = Router();
router.patch("/update/:id", authMiddleware, updateProfile);

export default router;
