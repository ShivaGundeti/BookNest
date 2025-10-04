import jwt from "jsonwebtoken";
import {User} from "../model/model.js";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && 
      req.headers.authorization.startsWith("Bearer") ? req.headers.authorization.split(" ")[1]: null;
    if (!token)
      return res.status(401).json({ message: "Unauthorized, no token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.Userid);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user; 
    next(); 
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
