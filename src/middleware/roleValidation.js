import User from "../models/users.js";
     const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Forbidden:${req.user.role} Insufficient permissions` });
        }
        next();
    };
};


export { authorizeRoles };