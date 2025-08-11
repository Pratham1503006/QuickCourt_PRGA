import express from "express";
import bcrypt from "bcryptjs";
import client from "../database.js";
import { authenticateToken } from "../Authentication/auth.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await client.query(
            `SELECT id, email, full_name, role, phone_number, avatar_url, is_verified, created_at
             FROM users WHERE id = $1`,
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { full_name, phone_number, avatar_url } = req.body;

        if (!full_name) {
            return res.status(400).json({ success: false, message: "Full name is required" });
        }

        const result = await client.query(
            `UPDATE users 
             SET full_name = $1, phone_number = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 RETURNING id, email, full_name, role, phone_number, avatar_url, is_verified`,
            [full_name, phone_number, avatar_url, user_id]
        );

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Change password
router.put("/change-password", authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({ success: false, message: "Current and new passwords are required" });
        }

        if (new_password.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        // Get current password hash
        const userResult = await client.query(
            "SELECT password_hash FROM users WHERE id = $1",
            [user_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        // Update password
        await client.query(
            "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [hashedNewPassword, user_id]
        );

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get user dashboard stats (for users)
router.get("/dashboard", authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_role = req.user.role;

        if (user_role === 'user') {
            // User dashboard stats
            const bookingStats = await client.query(`
                SELECT 
                    COUNT(*) as total_bookings,
                    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
                    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
                    COUNT(CASE WHEN start_time > NOW() THEN 1 END) as upcoming_bookings,
                    COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as total_spent
                FROM bookings 
                WHERE user_id = $1
            `, [user_id]);

            // Recent bookings
            const recentBookings = await client.query(`
                SELECT b.*, c.name as court_name, f.name as facility_name, s.name as sport_name
                FROM bookings b
                JOIN courts c ON b.court_id = c.id
                JOIN facilities f ON c.facility_id = f.id
                JOIN sports s ON c.sport_id = s.id
                WHERE b.user_id = $1
                ORDER BY b.created_at DESC
                LIMIT 5
            `, [user_id]);

            // Favorite sports (most booked)
            const favoriteSports = await client.query(`
                SELECT s.name as sport_name, COUNT(*) as booking_count
                FROM bookings b
                JOIN courts c ON b.court_id = c.id
                JOIN sports s ON c.sport_id = s.id
                WHERE b.user_id = $1 AND b.status = 'confirmed'
                GROUP BY s.id, s.name
                ORDER BY booking_count DESC
                LIMIT 3
            `, [user_id]);

            res.json({
                success: true,
                dashboard: {
                    stats: bookingStats.rows[0],
                    recent_bookings: recentBookings.rows,
                    favorite_sports: favoriteSports.rows
                }
            });

        } else if (user_role === 'facility_owner') {
            // Facility owner dashboard stats
            const facilityStats = await client.query(`
                SELECT 
                    COUNT(DISTINCT f.id) as total_facilities,
                    COUNT(DISTINCT CASE WHEN f.approval_status = 'approved' THEN f.id END) as approved_facilities,
                    COUNT(DISTINCT CASE WHEN f.approval_status = 'pending' THEN f.id END) as pending_facilities,
                    COUNT(DISTINCT c.id) as total_courts
                FROM facilities f
                LEFT JOIN courts c ON f.id = c.facility_id
                WHERE f.owner_id = $1
            `, [user_id]);

            const bookingStats = await client.query(`
                SELECT 
                    COUNT(*) as total_bookings,
                    COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_bookings,
                    COUNT(CASE WHEN b.start_time > NOW() AND b.status = 'confirmed' THEN 1 END) as upcoming_bookings,
                    COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price ELSE 0 END), 0) as total_earnings
                FROM bookings b
                JOIN courts c ON b.court_id = c.id
                JOIN facilities f ON c.facility_id = f.id
                WHERE f.owner_id = $1
            `, [user_id]);

            // Recent bookings
            const recentBookings = await client.query(`
                SELECT b.*, c.name as court_name, f.name as facility_name, u.full_name as user_name
                FROM bookings b
                JOIN courts c ON b.court_id = c.id
                JOIN facilities f ON c.facility_id = f.id
                JOIN users u ON b.user_id = u.id
                WHERE f.owner_id = $1
                ORDER BY b.created_at DESC
                LIMIT 5
            `, [user_id]);

            res.json({
                success: true,
                dashboard: {
                    facility_stats: facilityStats.rows[0],
                    booking_stats: bookingStats.rows[0],
                    recent_bookings: recentBookings.rows
                }
            });
        } else {
            res.status(403).json({ success: false, message: "Access denied" });
        }
    } catch (err) {
        console.error("Get dashboard error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
