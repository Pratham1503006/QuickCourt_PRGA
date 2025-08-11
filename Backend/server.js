import express from "express";
import cors from "cors";
import client from "./database.js";
import authRoutes from "./Authentication/auth.js";
import facilitiesRoutes from "./routes/facilities.js";
import courtsRoutes from "./routes/courts.js";
import bookingsRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import sportsRoutes from "./routes/sports.js";
import usersRoutes from "./routes/users.js";
import seedRoutes from "./routes/seed-simple.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilitiesRoutes);
app.use("/api/courts", courtsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/seed", seedRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "QuickCourt API is running",
        timestamp: new Date().toISOString()
    });
});

// Database status endpoint
app.get("/api/db-status", async (req, res) => {
    try {
        const result = await client.query("SELECT COUNT(*) as user_count FROM users");
        res.json({
            success: true,
            connected: true,
            user_count: result.rows[0].user_count
        });
    } catch (err) {
        console.error("Database connection error:", err);
        res.status(500).json({
            success: false,
            connected: false,
            error: err.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 QuickCourt API server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.PGDATABASE || 'Odoo'}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
