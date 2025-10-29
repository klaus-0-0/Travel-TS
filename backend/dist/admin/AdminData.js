"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const VerifyAdmin_1 = require("./VerifyAdmin");
const cloudinary_1 = __importDefault(require("cloudinary"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddiiq8le7',
    api_key: process.env.CLOUDINARY_API_KEY || '233538955748459',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'XwYfwFVuLY0kP62RwzlN0W6Mr6Y'
});
// ✅ FIXED - This route now has a proper function handler
router.post("/AdminDashboard", VerifyAdmin_1.isAdmin, async (req, res) => {
    try {
        const itemdata = await prisma.travelLocation.findMany({
            orderBy: { createdAt: "desc" }
        });
        if (itemdata.length === 0) {
            return res.status(404).json({ message: "No items found" });
        }
        res.status(200).json({
            message: "Here is all user data",
            items: itemdata,
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// ✅ Add more routes with proper function handlers
router.post("/AdminUploadItem", VerifyAdmin_1.isAdmin, async (req, res) => {
    try {
        const { name, country, description, price, imgUrl } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }
        const createItem = await prisma.travelLocation.create({
            data: {
                name,
                country,
                description: description || "",
                price,
                imageUrl: imgUrl || "",
                adminId: req.userId
            }
        });
        return res.status(201).json({
            message: "Item created successfully",
            item: createItem
        });
    }
    catch (error) {
        console.error("Create item error:", error);
        res.status(500).json({ message: "Server issue", error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=AdminData.js.map