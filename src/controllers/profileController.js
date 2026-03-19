import User from "../models/users.js";
const updateProfile = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data provide for update" })
            
        }
            const user  = await User .findByIdAndUpdate(req.user._id, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ message: "user  Not Found" });
        }

            res.status(200).json({ message: "user profile updated Successfully !!!" });


    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        
    }
}
export {updateProfile}