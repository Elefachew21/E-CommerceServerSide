import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleValidation.js";
import { ROLES } from "../config/constants.js";
import { assignRoleForUser, deleteUser } from "../controllers/userMgmtController.js";
import { publicLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.patch("/users/:id/role", authMiddleware, authorizeRoles(ROLES.ADMIN),publicLimiter, assignRoleForUser);
router.delete("/users/:id", authMiddleware, authorizeRoles(ROLES.ADMIN),publicLimiter, deleteUser);


export default router;