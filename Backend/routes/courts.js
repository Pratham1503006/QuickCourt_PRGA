import express from "express";
import client from "../database.js";
import { authenticateToken, authorizeRole } from "../Authentication/auth.js";

const router = express.Router();

// Get courts for a facility (public)
router.get("/facility/:facilityId", async (req, res) => {
    try {
        const { facilityId } = req.params;

        const result = await client.query(
            `SELECT c.*, cp.price_per_hour, s.name as sport_name,
                    oh.day_of_week, oh.opening_time, oh.closing_time
             FROM courts c
             LEFT JOIN court_pricing cp ON c.id = cp.court_id
             LEFT JOIN sports s ON c.sport_id = s.id
             LEFT JOIN operating_hours oh ON c.id = oh.court_id
             WHERE c.facility_id = $1
             ORDER BY c.name`,
            [facilityId]
        );

        // Group operating hours by court
        const courtsMap = new Map();
        result.rows.forEach(row => {
            if (!courtsMap.has(row.id)) {
                courtsMap.set(row.id, {
                    id: row.id,
                    facility_id: row.facility_id,
                    name: row.name,
                    sport_id: row.sport_id,
                    sport_name: row.sport_name,
                    price_per_hour: row.price_per_hour,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    operating_hours: []
                });
            }
            
            if (row.day_of_week) {
                courtsMap.get(row.id).operating_hours.push({
                    day_of_week: row.day_of_week,
                    opening_time: row.opening_time,
                    closing_time: row.closing_time
                });
            }
        });

        const courts = Array.from(courtsMap.values());

        res.json({
            success: true,
            courts
        });
    } catch (err) {
        console.error("Get courts error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get available time slots for a court
router.get("/:courtId/availability", async (req, res) => {
    try {
        const { courtId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, message: "Date is required" });
        }

        // Get court operating hours for the day
        const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, etc.
        const operatingHoursResult = await client.query(
            `SELECT opening_time, closing_time FROM operating_hours 
             WHERE court_id = $1 AND day_of_week = $2`,
            [courtId, dayOfWeek]
        );

        if (operatingHoursResult.rows.length === 0) {
            return res.json({
                success: true,
                available_slots: [],
                message: "Court is closed on this day"
            });
        }

        const { opening_time, closing_time } = operatingHoursResult.rows[0];

        // Get existing bookings for the date
        const bookingsResult = await client.query(
            `SELECT start_time, end_time FROM bookings 
             WHERE court_id = $1 AND DATE(start_time) = $2 AND status = 'confirmed'`,
            [courtId, date]
        );

        // Get blocked slots for the date
        const blockedSlotsResult = await client.query(
            `SELECT start_time, end_time FROM blocked_slots 
             WHERE court_id = $1 AND DATE(start_time) = $2`,
            [courtId, date]
        );

        // Generate available time slots (1-hour slots)
        const availableSlots = [];
        const startTime = new Date(`${date}T${opening_time}`);
        const endTime = new Date(`${date}T${closing_time}`);
        
        for (let time = new Date(startTime); time < endTime; time.setHours(time.getHours() + 1)) {
            const slotStart = new Date(time);
            const slotEnd = new Date(time.getTime() + 60 * 60 * 1000); // Add 1 hour

            // Check if slot conflicts with bookings or blocked slots
            const isBooked = bookingsResult.rows.some(booking => {
                const bookingStart = new Date(booking.start_time);
                const bookingEnd = new Date(booking.end_time);
                return (slotStart < bookingEnd && slotEnd > bookingStart);
            });

            const isBlocked = blockedSlotsResult.rows.some(blocked => {
                const blockedStart = new Date(blocked.start_time);
                const blockedEnd = new Date(blocked.end_time);
                return (slotStart < blockedEnd && slotEnd > blockedStart);
            });

            if (!isBooked && !isBlocked) {
                availableSlots.push({
                    start_time: slotStart.toISOString(),
                    end_time: slotEnd.toISOString(),
                    formatted_time: `${slotStart.getHours().toString().padStart(2, '0')}:${slotStart.getMinutes().toString().padStart(2, '0')} - ${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`
                });
            }
        }

        res.json({
            success: true,
            available_slots: availableSlots,
            operating_hours: {
                opening_time,
                closing_time
            }
        });
    } catch (err) {
        console.error("Get availability error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new court (facility owner only)
router.post("/", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const { facility_id, name, sport_id, price_per_hour, operating_hours } = req.body;
        const owner_id = req.user.id;

        if (!facility_id || !name || !sport_id || !price_per_hour) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if facility belongs to the owner
        const facilityCheck = await client.query(
            "SELECT * FROM facilities WHERE id = $1 AND owner_id = $2",
            [facility_id, owner_id]
        );

        if (facilityCheck.rows.length === 0) {
            return res.status(403).json({ success: false, message: "Access denied to this facility" });
        }

        // Start transaction
        await client.query('BEGIN');

        // Insert court
        const courtResult = await client.query(
            `INSERT INTO courts (facility_id, name, sport_id) VALUES ($1, $2, $3) RETURNING *`,
            [facility_id, name, sport_id]
        );

        const court = courtResult.rows[0];

        // Insert pricing
        await client.query(
            `INSERT INTO court_pricing (court_id, price_per_hour) VALUES ($1, $2)`,
            [court.id, price_per_hour]
        );

        // Insert operating hours
        if (operating_hours && operating_hours.length > 0) {
            for (const hours of operating_hours) {
                await client.query(
                    `INSERT INTO operating_hours (court_id, day_of_week, opening_time, closing_time) 
                     VALUES ($1, $2, $3, $4)`,
                    [court.id, hours.day_of_week, hours.opening_time, hours.closing_time]
                );
            }
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            message: "Court created successfully",
            court: {
                ...court,
                price_per_hour
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Create court error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update court (facility owner only)
router.put("/:id", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sport_id, price_per_hour } = req.body;
        const owner_id = req.user.id;

        // Check if court belongs to owner's facility
        const checkResult = await client.query(
            `SELECT c.*, f.owner_id FROM courts c
             JOIN facilities f ON c.facility_id = f.id
             WHERE c.id = $1 AND f.owner_id = $2`,
            [id, owner_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Court not found or access denied" });
        }

        // Start transaction
        await client.query('BEGIN');

        // Update court
        const courtResult = await client.query(
            `UPDATE courts SET name = $1, sport_id = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [name, sport_id, id]
        );

        // Update pricing
        if (price_per_hour) {
            await client.query(
                `UPDATE court_pricing SET price_per_hour = $1 WHERE court_id = $2`,
                [price_per_hour, id]
            );
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            message: "Court updated successfully",
            court: courtResult.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Update court error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete court (facility owner only)
router.delete("/:id", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const { id } = req.params;
        const owner_id = req.user.id;

        // Check if court belongs to owner's facility
        const checkResult = await client.query(
            `SELECT c.*, f.owner_id FROM courts c
             JOIN facilities f ON c.facility_id = f.id
             WHERE c.id = $1 AND f.owner_id = $2`,
            [id, owner_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Court not found or access denied" });
        }

        // Check for future bookings
        const futureBookings = await client.query(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE court_id = $1 AND start_time > NOW() AND status = 'confirmed'`,
            [id]
        );

        if (parseInt(futureBookings.rows[0].count) > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete court with future bookings" 
            });
        }

        await client.query("DELETE FROM courts WHERE id = $1", [id]);

        res.json({
            success: true,
            message: "Court deleted successfully"
        });
    } catch (err) {
        console.error("Delete court error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Block time slots (facility owner only)
router.post("/:courtId/block-slots", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const { courtId } = req.params;
        const { start_time, end_time, reason } = req.body;
        const owner_id = req.user.id;

        // Check if court belongs to owner's facility
        const checkResult = await client.query(
            `SELECT c.*, f.owner_id FROM courts c
             JOIN facilities f ON c.facility_id = f.id
             WHERE c.id = $1 AND f.owner_id = $2`,
            [courtId, owner_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Court not found or access denied" });
        }

        const result = await client.query(
            `INSERT INTO blocked_slots (court_id, start_time, end_time, reason, blocked_by)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [courtId, start_time, end_time, reason, owner_id]
        );

        res.json({
            success: true,
            message: "Time slot blocked successfully",
            blocked_slot: result.rows[0]
        });
    } catch (err) {
        console.error("Block slot error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
