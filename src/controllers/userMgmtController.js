import User from "../models/users.js";
import { createAuditLog } from "../utils/auditHelper.js";
const assignRoleForUser = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "The USer With this id is not found "
            });

        }
        const assignRole=["admin","seller","buyer"]
        if (!assignRole.includes(role)) {
            res.status(404).json({
                success: false,
                message:"Invalide role"
            })
        }
        const oldRole = user.role;
        if (oldRole === "admin") {
            return res.status(404).json({
                success: false,
                message: "invalide Instruction, or can not update Admin role"
            });
        }
        user.role = role;
        await user.save();

        // AUDIT LOG HERE
        await createAuditLog({
            
            userId: req.user._id,
            action: "ASSIGN_ROLE",
            target: "USER",
            targetId: user._id,
            metadata: {
                oldRole,
                newRole:role
            }
           
       })
        
      res.status(200).json({ success: true, message: "User role updated successfully", user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
           error:error.message
       }) 
    }
}
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).json({
                success: false,
                message:"User Not Found"
            })
        }
        if (user.role === "admin") {
            return res.status(404).json({
                success: false,
                message:"can  not Delete Admin "
            })
        }
       const deleted= await User.findByIdAndDelete(req.params.id);
        await createAuditLog({
            
            userId: req.user._id,
            action: "DELETE_USER",
            target: "USER",
            targetId: user._id,
            metadata: {
                deletedUSer: deleted.email
            }
        });
           
        res.status(200).json({
            success: true,
            message: "User Deleted Successfully "
        })
    } catch (error) {
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
           error:error.message
       }) 
    }
}

export {assignRoleForUser,deleteUser}