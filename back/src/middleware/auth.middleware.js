import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header ? header.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    console.error("JWT verify error:", err?.message || err);
    res.status(401).json({ message: "Invalid token" });
  }
}

export { authMiddleware };
export const auth = authMiddleware;
export default authMiddleware;