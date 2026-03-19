import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import { logInfo, logWarn, logError } from '../utils/loggerHelper.js';
import {createAuditLog} from "../utils/auditHelper.js"
// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      logWarn("Register failed: Missing fields");
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      logWarn(`Register failed: User already exists (${email})`);
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    logInfo(`User registered successfully: ${email}`);
 // ✅ FIXED audit log (no req.user here!)
    await createAuditLog({
      userId: user._id,
      action: "REGISTER",
      target: "USER",
      targetId: user._id,
      metadata: {
        email: user.email,
        role: user.role,
      },
    });
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    logError(`Register error: ${error.message}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logWarn("Login failed: Missing email or password");
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      logWarn(`Login failed: User not found (${email})`);
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      logWarn(`Login failed: Wrong password (${email})`);
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    logInfo(`Login success: ${email}`);
 // ✅ FIXED audit log (no req.user here!)
    await createAuditLog({
      userId: user._id,
      action: "LOGIN",
      target: "USER",
      targetId: user._id,
      metadata: {
        email: user.email,
        ip: req.ip,
      },
    });
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    logError(`Login error: ${error.message}`);

    return res.status(500).json({
      message: "Internal server error",error:error.message
    });
  }
};

// ================= LOGOUT =================
const logoutUser = async (req, res) => {
  try {
    logInfo("User logged out");

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    logError(`Logout error: ${error.message}`);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { registerUser, loginUser, logoutUser };