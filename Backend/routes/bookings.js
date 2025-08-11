import express from "express";
import client from "../database.js";
import { authenticateToken, authorizeRole } from "../Authentication/auth.js";

const router = express.Router();

// Create new booking (user only)
router.post("/", authenticateToken, authorizeRole(['user']), async (req, res) => {
    try {
        const { court_id, start_time, end_time, payment_method = 'cash' } = req.body;
        const user_id = req.user.id;

        if (!court_id || !start_time || !end_time) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Start transaction
        await client.query('BEGIN');

        // Check if court exists and get pricing
        const courtResult = await client.query(
            `SELECT c.*, cp.price_per_hour, f.name as facility_name, s.name as sport_name
             FROM courts c
             JOIN court_pricing cp ON c.id = cp.court_id
             JOIN facilities f ON c.facility_id = f.id
             JOIN sports s ON c.sport_id = s.id
             WHERE c.id = $1`,
            [court_id]
        );

        if (courtResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: "Court not found" });
        }

        const court = courtResult.rows[0];

        // Check if time slot is available
        const conflictCheck = await client.query(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE court_id = $1 AND status = 'confirmed' 
             AND (($2 < end_time AND $3 > start_time))`,
            [court_id, start_time, end_time]
        );

        if (parseInt(conflictCheck.rows[0].count) > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ success: false, message: "Time slot is already booked" });
        }

        // Check for blocked slots
        const blockedCheck = await client.query(
            `SELECT COUNT(*) as count FROM blocked_slots 
             WHERE court_id = $1 AND (($2 < end_time AND $3 > start_time))`,
            [court_id, start_time, end_time]
        );

        if (parseInt(blockedCheck.rows[0].count) > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ success: false, message: "Time slot is blocked for maintenance" });
        }

        // Calculate total price
        const startDate = new Date(start_time);
        const endDate = new Date(end_time);
        const durationHours = (endDate - startDate) / (1000 * 60 * 60);
        const total_price = durationHours * court.price_per_hour;

        // Create booking
        const bookingResult = await client.query(
            `INSERT INTO bookings (user_id, court_id, start_time, end_time, total_price, status, payment_status, payment_method, payment_reference)
             VALUES ($1, $2, $3, $4, $5, 'confirmed', 'pending', $6, $7) RETURNING *`,
            [user_id, court_id, start_time, end_time, total_price, payment_method, `REF-${Date.now()}`]
        );

        await client.query('COMMIT');

        const booking = bookingResult.rows[0];

        res.json({
            success: true,
            message: "Booking created successfully",
            booking: {
                ...booking,
                court_name: court.name,
                facility_name: court.facility_name,
                sport_name: court.sport_name,
                price_per_hour: court.price_per_hour
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Create booking error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get user's bookings
router.get("/my-bookings", authenticateToken, authorizeRole(['user']), async (req, res) => {
    try {
        const user_id = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT b.*, c.name as court_name, f.name as facility_name, f.address as facility_address,
                   s.name as sport_name, cp.price_per_hour
            FROM bookings b
            JOIN courts c ON b.court_id = c.id
            JOIN facilities f ON c.facility_id = f.id
            JOIN sports s ON c.sport_id = s.id
            JOIN court_pricing cp ON c.id = cp.court_id
            WHERE b.user_id = $1
        `;

        const params = [user_id];
        let paramCount = 1;

        if (status) {
            paramCount++;
            query += ` AND b.status = $${paramCount}`;
            params.push(status);
        }

        query += ` ORDER BY b.start_time DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);

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

// Cancel booking
router.put("/:id/cancel", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { cancellation_reason } = req.body;
        const user_id = req.user.id;

        // Check if booking exists and belongs to user (or if user is facility owner/admin)
        let checkQuery = `
            SELECT b.*, c.name as court_name, f.name as facility_name, f.owner_id
            FROM bookings b
            JOIN courts c ON b.court_id = c.id
            JOIN facilities f ON c.facility_id = f.id
            WHERE b.id = $1
        `;

        const bookingResult = await client.query(checkQuery, [id]);

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const booking = bookingResult.rows[0];

        // Check permissions
        const canCancel = booking.user_id === user_id || 
                         booking.owner_id === user_id || 
                         req.user.role === 'admin';

        if (!canCancel) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // Check if booking can be cancelled (not in the past and not already cancelled)
        if (new Date(booking.start_time) <= new Date()) {
            return res.status(400).json({ success: false, message: "Cannot cancel past bookings" });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Booking is already cancelled" });
        }

        // Update booking status
        const updateResult = await client.query(
            `UPDATE bookings 
             SET status = 'cancelled', cancellation_reason = $1, cancelled_by = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [cancellation_reason, user_id, id]
        );

        res.json({
            success: true,
            message: "Booking cancelled successfully",
            booking: updateResult.rows[0]
        });
    } catch (err) {
        console.error("Cancel booking error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get facility owner's bookings
router.get("/facility-bookings", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const owner_id = req.user.id;
        const { facility_id, status, date, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT b.*, c.name as court_name, f.name as facility_name,
                   u.full_name as user_name, u.phone_number as user_phone,
                   s.name as sport_name
            FROM bookings b
            JOIN courts c ON b.court_id = c.id
            JOIN facilities f ON c.facility_id = f.id
            JOIN users u ON b.user_id = u.id
            JOIN sports s ON c.sport_id = s.id
            WHERE f.owner_id = $1
        `;

        const params = [owner_id];
        let paramCount = 1;

        if (facility_id) {
            paramCount++;
            query += ` AND f.id = $${paramCount}`;
            params.push(facility_id);
        }

        if (status) {
            paramCount++;
            query += ` AND b.status = $${paramCount}`;
            params.push(status);
        }

        if (date) {
            paramCount++;
            query += ` AND DATE(b.start_time) = $${paramCount}`;
            params.push(date);
        }

        query += ` ORDER BY b.start_time DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);

        res.json({
            success: true,
            bookings: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error("Get facility bookings error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get booking statistics for facility owner
router.get("/stats", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const owner_id = req.user.id;
        const { period = 'month' } = req.query;

        let dateFilter = '';
        switch (period) {
            case 'week':
                dateFilter = "AND b.start_time >= CURRENT_DATE - INTERVAL '7 days'";
                break;
            case 'month':
                dateFilter = "AND b.start_time >= CURRENT_DATE - INTERVAL '30 days'";
                break;
            case 'year':
                dateFilter = "AND b.start_time >= CURRENT_DATE - INTERVAL '365 days'";
                break;
        }

        // Total bookings and earnings
        const statsResult = await client.query(`
            SELECT 
                COUNT(*) as total_bookings,
                COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_bookings,
                COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_bookings,
                COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price ELSE 0 END), 0) as total_earnings
            FROM bookings b
            JOIN courts c ON b.court_id = c.id
            JOIN facilities f ON c.facility_id = f.id
            WHERE f.owner_id = $1 ${dateFilter}
        `, [owner_id]);

        // Active courts count
        const courtsResult = await client.query(`
            SELECT COUNT(DISTINCT c.id) as active_courts
            FROM courts c
            JOIN facilities f ON c.facility_id = f.id
            WHERE f.owner_id = $1
        `, [owner_id]);

        // Daily booking trends
        const trendsResult = await client.query(`
            SELECT 
                DATE(b.start_time) as booking_date,
                COUNT(*) as bookings_count,
                SUM(b.total_price) as daily_earnings
            FROM bookings b
            JOIN courts c ON b.court_id = c.id
            JOIN facilities f ON c.facility_id = f.id
            WHERE f.owner_id = $1 AND b.status = 'confirmed' ${dateFilter}
            GROUP BY DATE(b.start_time)
            ORDER BY booking_date DESC
            LIMIT 30
        `, [owner_id]);

        res.json({
            success: true,
            stats: {
                ...statsResult.rows[0],
                active_courts: parseInt(courtsResult.rows[0].active_courts),
                daily_trends: trendsResult.rows
            }
        });
    } catch (err) {
        console.error("Get booking stats error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
