import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticate = (req, res, next) => {
 try {
  console.log("Auth Headers:", req.headers.authorization);
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
   token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
   return res.status(401).json({ message: "No token found. Please log in!" });
  }

  // Verify the token
  const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

  // Attach user to request object
  req.user = decodedPayload;
  next();
 } catch (err) {
  if (err.name === "TokenExpiredError") {
   return res
    .status(401)
    .json({ message: "Expired Token. Please log in again!" });
  } else if (err.name === "JsonWebTokenError") {
   return res.status(401).json({ message: "Invalid token" });
  }
  console.error("Authentication error:", err);
  res.status(500).json({ message: "Internal server error" });
 }
};

export default authenticate;
