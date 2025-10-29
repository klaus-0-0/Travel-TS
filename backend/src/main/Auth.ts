import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Import middleware
import tokenverify from "./verifyuser";

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}

interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface BookingRequest {
  locationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

router.get("/check", tokenverify, (req: AuthRequest, res: Response) => {
  res.status(200).json({ user: req.user });
});

router.post("/signup", async (req: Request<{}, any, SignupRequest>, res: Response) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role === "ADMIN" ? "ADMIN" : "USER"
      }
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role }, 
      process.env.TOKEN || "", 
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Signup successful",
      user: { username, email, role: newUser.role },
      token,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
});

router.post("/login", async (req: Request<{}, any, LoginRequest>, res: Response) => {
  const { email, password } = req.body;

  try {
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: userData.id, role: userData.role }, 
      process.env.TOKEN || "", 
      { expiresIn: "1h" }
    );

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

  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Server issue", error: errorMessage });
  }
});

router.get("/FetchTravelLocation", tokenverify, async (req: AuthRequest, res: Response) => {
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
  } catch (error: unknown) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/bookings", tokenverify, async (req: AuthRequest, res: Response) => {
  try {
    const { locationId, checkIn, checkOut, guests, totalPrice }: BookingRequest = req.body;
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

  } catch (error: unknown) {
    console.error("Create booking error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
});

router.get("/bookings", tokenverify, async (req: AuthRequest, res: Response) => {
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

  } catch (error: unknown) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/bookings/:id/cancel", tokenverify, async (req: AuthRequest, res: Response) => {
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

  } catch (error: unknown) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;