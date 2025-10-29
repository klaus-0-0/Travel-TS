"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
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
        const secret = process.env.TOKEN;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        console.log("deco", decoded);
        next();
    }
    catch (err) {
        console.error("Token verification error:", err);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=verifyuser.js.map