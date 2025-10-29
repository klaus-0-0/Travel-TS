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

  // Ensure token is defined after processing
  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  try {
    if (!process.env.TOKEN) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const secret = process.env.TOKEN;
    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    
    // Ensure the decoded object has the required properties
    if (!decoded.id || !decoded.role) {
      res.status(403).json({ message: "Invalid token payload" });
      return;
    }
    
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