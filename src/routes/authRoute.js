import { Router } from "express";
import { registerUser, loginUser,logoutUser } from "../controllers/authController.js";
import { validateRequest ,loginSchema,registerSChema} from "../middleware/inputValidationMiddleware.js";

const router = Router();
router.post("/register", validateRequest(registerSChema),  registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/logout", logoutUser);


export default router;
