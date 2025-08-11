import express from "express";
import client from "../database.js";
import { authenticateToken, authorizeRole } from "../Authentication/auth.js";

const router = express.Router();

// Get admin dashboard stats
router.get("/dashboard", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        // Total users by role
        const usersResult = await client.query(`
            SELECT 
                role,
                COUNT(*) as count
            FROM users 
            GROUP BY role
        `);

        // Total facilities by status
        const facilitiesResult = await client.query(`
            SELECT 
                approval_status,
                COUNT(*) as count
            FROM facilities 
            GROUP BY approval_status
        `);

        // Total bookings and earnings
        const bookingsResult = await client.query(`
            SELECT 
                COUNT(*) as total_bookings,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
                COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as total_earnings
            FROM bookings
        `);

        // Active courts count
        const courtsResult = await client.query(`
            SELECT COUNT(*) as total_courts FROM courts
        `);

        // Recent activity (last 30 days)
        const activityResult = await client.query(`
            SELECT 
                DATE(created_at) as activity_date,
                'user_registration' as activity_type,
                COUNT(*) as count
            FROM users 
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            
            UNION ALL
            
            SELECT 
                DATE(created_at) as activity_date,
                'facility_registration' as activity_type,
                COUNT(*) as count
            FROM facilities 
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            
            UNION ALL
            
            SELECT 
                DATE(created_at) as activity_date,
                'booking' as activity_type,
                COUNT(*) as count
            FROM bookings 
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            
            ORDER BY activity_date DESC
        `);

        // Most popular sports
        const sportsResult = await client.query(`
            SELECT 
                s.name as sport_name,
                COUNT(b.id) as booking_count
            FROM sports s
            LEFT JOIN courts c ON s.id = c.sport_id
            LEFT JOIN bookings b ON c.id = b.court_id AND b.status = 'confirmed'
            GROUP BY s.id, s.name
            ORDER BY booking_count DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            dashboard: {
                users: usersResult.rows,
                facilities: facilitiesResult.rows,
                bookings: bookingsResult.rows[0],
                courts: courtsResult.rows[0],
                recent_activity: activityResult.rows,
                popular_sports: sportsResult.rows
            }
        });
    } catch (err) {
        console.error("Get admin dashboard error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get pending facility approvals
router.get("/facilities/pending", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const result = await client.query(`
            SELECT f.*, u.full_name as owner_name, u.email as owner_email, u.phone_number as owner_phone,
                   array_agg(DISTINCT s.name) as sports,
                   array_agg(DISTINCT fa.amenity_name) as amenities
            FROM facilities f
            JOIN users u ON f.owner_id = u.id
            LEFT JOIN facility_sports fs ON f.id = fs.facility_id
            LEFT JOIN sports s ON fs.sport_id = s.id
            LEFT JOIN facility_amenities fa ON f.id = fa.facility_id
            WHERE f.approval_status = 'pending'
            GROUP BY f.id, u.full_name, u.email, u.phone_number
            ORDER BY f.created_at ASC
        `);

        // Get photos for each facility
        for (let facility of result.rows) {
            const photosResult = await client.query(
                `SELECT photo_url, caption FROM facility_photos WHERE facility_id = $1`,
                [facility.id]
            );
            facility.photos = photosResult.rows;
        }

        res.json({
            success: true,
            pending_facilities: result.rows
        });
    } catch (err) {
        console.error("Get pending facilities error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Approve or reject facility
router.put("/facilities/:id/approval", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { action, rejection_reason } = req.body; // action: 'approve' or 'reject'

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

        const approval_status = action === 'approve' ? 'approved' : 'rejected';
        
        const result = await client.query(
            `UPDATE facilities 
             SET approval_status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [approval_status, rejection_reason, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Facility not found" });
        }

        res.json({
            success: true,
            message: `Facility ${action}d successfully`,
            facility: result.rows[0]
        });
    } catch (err) {
        console.error("Facility approval error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all users with filtering
router.get("/users", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT u.id, u.email, u.full_name, u.role, u.phone_number, u.is_verified, u.created_at,
                   COUNT(CASE WHEN u.role = 'user' THEN b.id END) as booking_count,
                   COUNT(CASE WHEN u.role = 'facility_owner' THEN f.id END) as facility_count
            FROM users u
            LEFT JOIN bookings b ON u.id = b.user_id AND u.role = 'user'
            LEFT JOIN facilities f ON u.id = f.owner_id AND u.role = 'facility_owner'
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 0;

        if (role) {
            paramCount++;
            query += ` AND u.role = $${paramCount}`;
            params.push(role);
        }

        if (search) {
            paramCount++;
            query += ` AND (u.full_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);

        res.json({
            success: true,
            users: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Get users error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Ban/unban user
router.put("/users/:id/ban", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { action, reason } = req.body; // action: 'ban' or 'unban'

        if (!['ban', 'unban'].includes(action)) {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

        // For now, we'll use is_verified field to simulate ban/unban
        // In a real app, you'd have a separate 'is_banned' field
        const is_verified = action === 'unban';

        const result = await client.query(
            `UPDATE users 
             SET is_verified = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND role != 'admin' RETURNING *`,
            [is_verified, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found or cannot ban admin" });
        }

        res.json({
            success: true,
            message: `User ${action}ned successfully`,
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Ban user error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get user booking history
router.get("/users/:id/bookings", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await client.query(`
            SELECT b.*, c.name as court_name, f.name as facility_name, s.name as sport_name
            FROM bookings b
            JOIN courts c ON b.court_id = c.id
            JOIN facilities f ON c.facility_id = f.id
            JOIN sports s ON c.sport_id = s.id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC
            LIMIT $2 OFFSET $3
        `, [id, limit, offset]);

        res.json({
            success: true,
            bookings: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Get user bookings error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all facilities for admin
router.get("/facilities", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT f.*, u.full_name as owner_name, u.email as owner_email,
                   COUNT(DISTINCT c.id) as court_count,
                   COUNT(DISTINCT b.id) as booking_count
            FROM facilities f
            JOIN users u ON f.owner_id = u.id
            LEFT JOIN courts c ON f.id = c.facility_id
            LEFT JOIN bookings b ON c.id = b.court_id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 0;

        if (status) {
            paramCount++;
            query += ` AND f.approval_status = $${paramCount}`;
            params.push(status);
        }

        if (search) {
            paramCount++;
            query += ` AND (f.name ILIKE $${paramCount} OR f.description ILIKE $${paramCount} OR u.full_name ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ` GROUP BY f.id, u.full_name, u.email ORDER BY f.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);

        res.json({
            success: true,
            facilities: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Get admin facilities error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get system reports
router.get("/reports", authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        let dateFilter = '';
        switch (period) {
            case 'week':
                dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'";
                break;
            case 'month':
                dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'";
                break;
            case 'year':
                dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '365 days'";
                break;
        }

        // User registration trends
        const userTrendsResult = await client.query(`
            SELECT 
                DATE(created_at) as date,
                role,
                COUNT(*) as count
            FROM users 
            ${dateFilter}
            GROUP BY DATE(created_at), role
            ORDER BY date DESC
        `);

        // Booking trends
        const bookingTrendsResult = await client.query(`
            SELECT 
                DATE(created_at) as date,
                status,
                COUNT(*) as count,
                SUM(total_price) as revenue
            FROM bookings 
            ${dateFilter}
            GROUP BY DATE(created_at), status
            ORDER BY date DESC
        `);

        // Facility approval trends
        const facilityTrendsResult = await client.query(`
            SELECT 
                DATE(created_at) as date,
                approval_status,
                COUNT(*) as count
            FROM facilities 
            ${dateFilter}
            GROUP BY DATE(created_at), approval_status
            ORDER BY date DESC
        `);

        res.json({
            success: true,
            reports: {
                user_trends: userTrendsResult.rows,
                booking_trends: bookingTrendsResult.rows,
                facility_trends: facilityTrendsResult.rows
            }
        });
    } catch (err) {
        console.error("Get reports error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
