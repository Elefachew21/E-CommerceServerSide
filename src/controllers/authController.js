import User from '../models/users.js';
import jwt from 'jsonwebtoken';

 const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error","error":error.message})
    }
}
 const loginUser = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user._id , role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                password:user.password
            },
            token
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error","error":error.message})
    }
}
const logoutUser = async (req, res) => { 

    try {
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({message:"Internal server error","error":error.message})
    }

}
export { registerUser, loginUser, logoutUser };
