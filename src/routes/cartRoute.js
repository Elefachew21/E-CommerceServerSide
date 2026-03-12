import { Router } from "express";
import { addToCart, checkout, removeCart, updateCart, viewAllCart, viewCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleValidation.js";
import { ROLES } from "../config/constants.js";

const router = Router();

router.post("/addtocart", addToCart);
router.post("/check", authMiddleware, authorizeRoles(ROLES.BUYER), checkout);
router.patch("/update/:id", updateCart);
router.get("/view/", viewCart);
router.get("/viewAll",authMiddleware,authorizeRoles(ROLES.ADMIN,ROLES.SELLER),viewAllCart)
router.delete("/remove/:id", removeCart);

export default router;