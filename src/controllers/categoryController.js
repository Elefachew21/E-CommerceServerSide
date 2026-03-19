import Category from "../models/categories.js";
import { createAuditLog } from "../utils/auditHelper.js";
import { logError, logInfo, logWarn } from "../utils/loggerHelper.js";

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
}
const deleteCategory = async (req, res) => {
    try {
        const deleteCat = await Category.findById(req.params.id);
        if (!deleteCat) {
            logWarn("Category Not Found")
            return res.status(400).json({
                success: false,
                message:"CAtegory not Found With This ID"
            })
        }
        const category=await Category.findByIdAndDelete(req.params.id);
        logInfo(`Category Deleted Successfully by approprate  `);
     
       await createAuditLog({
      userId: req.user._id,
      action: "DELETE_CATEGORY",
      target: "CATEGORY",
      targetId: category._id,
      metadata: {
        createdAt: category.createdAt,
        role: req.user.role
      }
    });
    

        res.status(200).json({
            success: true,
            message:"Category Deleted Successfully"
        })
    } catch (error) {
        logError(`Internal Server Error ${error.message}`);
        res.status(500).json({success:false,message:"Internal Server Error",Error:error.message})
    }
}
const updateCategory = async (req, res) => {
    try {
 if (Object.keys(req.body).length === 0) { 
      return res.status(400).json({ message: "Please provide data to update" });
        }   
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateCategory) {
            res.status(400).json({ success: false, message: "Category with the provided id is not found" });
        };
        res.status(200).json({ success: true, message: "Category Updated successfully", Category: updatedCategory });
    } catch (error) {
        
    }
}
export { createCategory,deleteCategory ,updateCategory};