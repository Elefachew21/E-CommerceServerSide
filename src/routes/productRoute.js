import { Router } from "express";
import { createProduct, getAllProduct, updateProduct,deleteProduct } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ROLES } from "../config/constants.js";
import { authorizeRoles } from "../middleware/roleValidation.js";
import {
    createProductSchema
    , validateRequest
} from "../middleware/inputValidationMiddleware.js";
import upload from "../middleware/upload.js";

const router = Router();
router.post("/create", authMiddleware, authorizeRoles(ROLES.SELLER, ROLES.ADMIN),validateRequest(createProductSchema),upload.array("images",5), createProduct);
router.get("/getAllProduct", getAllProduct);
router.put("/update/:id", authMiddleware, authorizeRoles(ROLES.SELLER, ROLES.ADMIN), updateProduct);
router.delete("/delete/:id", authMiddleware, authorizeRoles(ROLES.ADMIN), deleteProduct);
export default router;
