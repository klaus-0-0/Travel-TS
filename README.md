🌍 Travel Booking Application
A full-stack travel booking platform where users can explore destinations, book trips, and manage their travel plans with secure authentication.

🚀 Features
👤 User Features
🌍 Explore Destinations - Browse travel locations with details
📅 Book Trips - Reserve travel packages
👀 View Bookings - Manage personal travel reservations
🎨 Theme Support - Dark/Light mode toggle
🔐 Secure Authentication - JWT-based login/signup

👑 Admin Features
🏝️ Manage Locations - Add/edit/delete travel destinations
📊 View All Bookings - Monitor all user reservations
✅ Manage Booking Status - Confirm/cancel bookings
🖼️ Image Upload - Cloudinary integration for location images

🛡️ Security Features
JWT Authentication - Secure token-based authentication
Password Hashing - bcrypt with salt rounds
Protected Routes - Middleware for route protection
Admin Authorization - Role-based access control
CORS Protection - Configured for specific origins

🛠️ Tech Stack
Frontend
React - UI framework
TypeScript - Type safety
Tailwind CSS - Styling and theming
Axios - HTTP client
React Router - Navigation
Context API - State management
Backend
Node.js - Runtime environment
Express.js - Web framework
PostgreSQL - Database
Prisma - ORM
JWT - Authentication
bcrypt - Password hashing
Cloudinary - Image storage

🔧 API Endpoints
Authentication
POST /api/signup - User registration
POST /api/login - User login
Travel Locations
GET /api/locations - Get all travel destinations
POST /api/admin/upload-item - Admin: Add new location (protected)
DELETE /api/admin/items/:id - Admin: Delete location (protected)

Bookings
POST /api/bookings - Create new booking
GET /api/user/bookings - Get user's bookings
GET /api/admin/bookings - Admin: Get all bookings (protected)
PUT /api/admin/bookings/:id/status - Admin: Update booking status (protected)
Images
POST /api/upload-image - Upload location images (protected)

Middleware
authMiddleware - JWT authentication
verifyAdmin - Admin authorization

🚀 Installation
Prerequisites
Node.js 16+
PostgreSQL
Cloudinary account
npm

🔐 Authentication Flow
User signs up/login
Server validates credentials
JWT token generated with user role
Token stored in localStorage
Token verified for protected routes
Admin routes check for ADMIN role

📱 UI/UX Features
Responsive Design - Works on all devices
Dark/Light Theme - Toggle between themes
Image Galleries - Beautiful destination displays
Booking Management - Easy reservation system
Admin Dashboard - Comprehensive management interface
Loading States - Better user feedback
Confirmation Dialogs - Safe delete operations

🎯 Future Updates
Planned Features
✈️ Flight Integration - Connect with flight APIs
🏨 Hotel Bookings - Accommodation reservations
💰 Payment Gateway - Stripe/PayPal integration

