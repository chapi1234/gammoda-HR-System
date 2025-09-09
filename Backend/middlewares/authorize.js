import jwt from "jsonwebtoken";

export default function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "failed",
          message: "Not authorized, token missing",
        });
      }

      // Extract the token
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded Token:", decoded);
      console.log("Required Roles:", roles);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          status: "failed",
          message: "Access denied: insufficient permissions",
        });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "failed",
        message: "Internal server error: " + err.message,
      });
    }
  };
}
