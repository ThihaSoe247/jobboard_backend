const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AuthMiddleware = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(400).json({ message: "Token needs to be provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id); // ✅ fetch full user

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = user._id;
    req.userRole = user.role; // ✅ attach user role

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
};

module.exports = AuthMiddleware;
