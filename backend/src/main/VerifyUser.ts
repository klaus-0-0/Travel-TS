import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include userId and userRole
interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  console.log("okok = ", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  let token = authHeader.split(" ")[1];
  
  // Remove quotes if they exist
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  
  console.log("token = ", token);

  try {
    if (!process.env.TOKEN) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const secret = process.env.TOKEN as string;
    const decoded = jwt.verify(token, secret) as unknown as { id: string; role: string };
    req.userId = decoded.id;
    req.userRole = decoded.role;
    console.log("deco", decoded);
    
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;