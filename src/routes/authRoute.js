import { Router } from "express";
import { registerUser, loginUser,logoutUser } from "../controllers/authController.js";
import { validateRequest ,loginSchema,registerSChema} from "../middleware/inputValidationMiddleware.js";
import { loginLimiter, loginLimiterNormal, registerLimiter } from "../middleware/rateLimiter.js";

const router = Router();
router.post("/register", validateRequest(registerSChema), registerLimiter, registerUser);
router.post("/login", validateRequest(loginSchema),loginLimiterNormal,loginLimiter, loginUser);
router.get("/logout", logoutUser);


export default router;
