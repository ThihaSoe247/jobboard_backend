const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  let token = req.cookies.jwt;

  // ✅ Check for Bearer token in header if cookie isn't found
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedValue) => {
      if (err) {
        return res.status(401).json({ message: "Unauthenticated" });
      } else {
        req.userId = decodedValue._id;
        next();
      }
    });
  } else {
    return res.status(400).json({ message: "Token needs to be provided" });
  }
};

module.exports = AuthMiddleware;
