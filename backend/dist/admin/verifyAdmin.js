"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    let token = authHeader.split(" ")[1];
    // Remove quotes if they exist
    if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }
    try {
        if (!process.env.TOKEN) {
            res.status(500).json({ message: "Server configuration error" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN);
        if (decoded.role !== "ADMIN") {
            res.status(403).json({ message: "Access denied: Admins only" });
            return;
        }
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=VerifyAdmin.js.map