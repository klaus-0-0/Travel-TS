"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Import middleware
const VerifyUser_1 = __importDefault(require("./VerifyUser"));
router.get("/check", VerifyUser_1.default, (req, res) => {
    res.status(200).json({ user: req.user });
});
router.post("/signup", async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role === "ADMIN" ? "ADMIN" : "USER"
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: newUser.role }, process.env.TOKEN || "", { expiresIn: "1h" });
        return res.status(200).json({
            message: "Signup successful",
            user: { username, email, role: newUser.role },
            token,
        });
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Server error", error: errorMessage });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userData = await prisma.user.findUnique({ where: { email } });
        if (!userData)
            return res.status(404).json({ message: "User not found" });
        const isValid = await bcrypt_1.default.compare(password, userData.password);
        if (!isValid)
            return res.status(401).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: userData.id, role: userData.role }, process.env.TOKEN || "", { expiresIn: "1h" });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: userData.id,
                name: userData.username,
                email: userData.email,
                role: userData.role
            },
            token
        });
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Server issue", error: errorMessage });
    }
});
router.get("/FetchTravelLocation", VerifyUser_1.default, async (req, res) => {
    try {
        console.log("Fetching items...");
        const destinations = await prisma.travelLocation.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                country: true,
                description: true,
                price: true,
                imageUrl: true,
                createdAt: true
            }
        });
        console.log(`Found ${destinations.length} items`);
        res.status(200).json({
            message: "Items fetched successfully",
            destinations: destinations
        });
    }
    catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/bookings", VerifyUser_1.default, async (req, res) => {
    try {
        const { locationId, checkIn, checkOut, guests, totalPrice } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        console.log("Booking request:", { userId, locationId, checkIn, checkOut, guests, totalPrice });
        // Validation
        if (!locationId || !checkIn || !checkOut || !guests || !totalPrice) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if location exists
        const location = await prisma.travelLocation.findUnique({
            where: { id: locationId }
        });
        if (!location) {
            return res.status(404).json({ message: "Travel location not found" });
        }
        // Create booking
        const booking = await prisma.booking.create({
            data: {
                userId,
                locationId,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                guests: parseInt(guests.toString()),
                totalPrice: parseFloat(totalPrice.toString()),
                status: "PENDING"
            },
            include: {
                location: {
                    select: {
                        name: true,
                        country: true,
                        imageUrl: true
                    }
                },
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });
        console.log("Booking created:", booking);
        res.status(201).json({
            message: "Booking created successfully",
            booking: booking
        });
    }
    catch (error) {
        console.error("Create booking error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Server error", error: errorMessage });
    }
});
router.get("/bookings", VerifyUser_1.default, async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                location: {
                    select: {
                        name: true,
                        country: true,
                        imageUrl: true,
                        price: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings: bookings
        });
    }
    catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.put("/bookings/:id/cancel", VerifyUser_1.default, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const booking = await prisma.booking.findFirst({
            where: {
                id: id,
                userId: userId
            }
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.status === "CANCELLED") {
            return res.status(400).json({ message: "Booking already cancelled" });
        }
        const updatedBooking = await prisma.booking.update({
            where: { id: id },
            data: { status: "CANCELLED" },
            include: {
                location: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.status(200).json({
            message: "Booking cancelled successfully",
            booking: updatedBooking
        });
    }
    catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=Auth.js.map