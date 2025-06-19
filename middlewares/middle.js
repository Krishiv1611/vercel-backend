require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function middleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided, please sign in" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token provided, please sign in" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userid = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { middleware };

