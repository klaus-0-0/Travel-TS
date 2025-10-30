"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const VerifyAdmin_1 = require("./VerifyAdmin");
const cloudinary_1 = __importDefault(require("cloudinary"));
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddiiq8le7',
    api_key: process.env.CLOUDINARY_API_KEY || '233538955748459',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'XwYfwFVuLY0kP62RwzlN0W6Mr6Y'
});
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
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
router.post("/upload-image", VerifyAdmin_1.isAdmin, async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }
        const uploadResult = await cloudinary_1.default.v2.uploader.upload(image, {
            folder: "travel-uploads"
        });
        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        });
    }
    catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({ message: "Image upload failed", error: error.message });
    }
});
// Get all bookings (Admin only)
router.get("/admin/bookings", VerifyAdmin_1.isAdmin, async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                location: {
                    select: {
                        name: true,
                        country: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        res.status(200).json({
            message: "All bookings fetched successfully",
            bookings: bookings
        });
    }
    catch (error) {
        console.error("Get all bookings error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// Update booking status (Admin only)
router.put("/admin/bookings/:id/status", VerifyAdmin_1.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const booking = await prisma.booking.findUnique({
            where: { id }
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                location: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.status(200).json({
            message: "Booking status updated successfully",
            booking: updatedBooking
        });
    }
    catch (error) {
        console.error("Update booking status error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// Force delete travel location and its bookings
router.delete("/admin/items/:id", VerifyAdmin_1.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Delete all bookings for this location first
        await prisma.booking.deleteMany({
            where: { locationId: id }
        });
        // Then delete the location
        await prisma.travelLocation.delete({
            where: { id }
        });
        res.status(200).json({
            message: "Location and all associated bookings deleted successfully"
        });
    }
    catch (error) {
        console.error("Force delete error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=AdminData.js.map