import express from "express";
import client from "../database.js";
import { authenticateToken, authorizeRole } from "../Authentication/auth.js";

const router = express.Router();

// Get all approved facilities (public)
router.get("/", async (req, res) => {
    try {
        const { sport, search, min_price, max_price, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT DISTINCT f.*, 
                   array_agg(DISTINCT s.name) as sports,
                   MIN(cp.price_per_hour) as starting_price,
                   COUNT(*) OVER() as total_count
            FROM facilities f
            LEFT JOIN facility_sports fs ON f.id = fs.facility_id
            LEFT JOIN sports s ON fs.sport_id = s.id
            LEFT JOIN courts c ON f.id = c.facility_id
            LEFT JOIN court_pricing cp ON c.id = cp.court_id
            WHERE f.approval_status = 'approved'
        `;
        
        const params = [];
        let paramCount = 0;

        if (sport) {
            paramCount++;
            query += ` AND s.name ILIKE $${paramCount}`;
            params.push(`%${sport}%`);
        }

        if (search) {
            paramCount++;
            query += ` AND (f.name ILIKE $${paramCount} OR f.description ILIKE $${paramCount} OR f.address ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        if (min_price) {
            paramCount++;
            query += ` AND cp.price_per_hour >= $${paramCount}`;
            params.push(min_price);
        }

        if (max_price) {
            paramCount++;
            query += ` AND cp.price_per_hour <= $${paramCount}`;
            params.push(max_price);
        }

        query += ` GROUP BY f.id ORDER BY f.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await client.query(query, params);
        
        res.json({
            success: true,
            facilities: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: result.rows.length > 0 ? result.rows[0].total_count : 0
            }
        });
    } catch (err) {
        console.error("Get facilities error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get single facility details (public)
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Get facility details
        const facilityResult = await client.query(
            `SELECT f.*, u.full_name as owner_name, u.phone_number as owner_phone
             FROM facilities f
             JOIN users u ON f.owner_id = u.id
             WHERE f.id = $1 AND f.approval_status = 'approved'`,
            [id]
        );

        if (facilityResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Facility not found" });
        }

        const facility = facilityResult.rows[0];

        // Get sports
        const sportsResult = await client.query(
            `SELECT s.* FROM sports s
             JOIN facility_sports fs ON s.id = fs.sport_id
             WHERE fs.facility_id = $1`,
            [id]
        );

        // Get amenities
        const amenitiesResult = await client.query(
            `SELECT fa.amenity_name FROM facility_amenities fa
             WHERE fa.facility_id = $1`,
            [id]
        );

        // Get photos
        const photosResult = await client.query(
            `SELECT fp.photo_url, fp.caption FROM facility_photos fp
             WHERE fp.facility_id = $1 ORDER BY fp.id`,
            [id]
        );

        // Get courts with pricing
        const courtsResult = await client.query(
            `SELECT c.*, cp.price_per_hour, s.name as sport_name
             FROM courts c
             LEFT JOIN court_pricing cp ON c.id = cp.court_id
             LEFT JOIN sports s ON c.sport_id = s.id
             WHERE c.facility_id = $1`,
            [id]
        );

        // Get reviews
        const reviewsResult = await client.query(
            `SELECT r.*, u.full_name as user_name, u.avatar_url
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.facility_id = $1
             ORDER BY r.created_at DESC`,
            [id]
        );

        res.json({
            success: true,
            facility: {
                ...facility,
                sports: sportsResult.rows,
                amenities: amenitiesResult.rows.map(a => a.amenity_name),
                photos: photosResult.rows,
                courts: courtsResult.rows,
                reviews: reviewsResult.rows
            }
        });
    } catch (err) {
        console.error("Get facility details error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new facility (facility owner only)
router.post("/", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const { name, description, address, latitude, longitude, sports, amenities, photos } = req.body;
        const owner_id = req.user.id;

        if (!name || !description || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Start transaction
        await client.query('BEGIN');

        // Insert facility
        const facilityResult = await client.query(
            `INSERT INTO facilities (owner_id, name, description, address, latitude, longitude, approval_status)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
            [owner_id, name, description, address, latitude, longitude]
        );

        const facility = facilityResult.rows[0];

        // Insert sports
        if (sports && sports.length > 0) {
            for (const sportId of sports) {
                await client.query(
                    `INSERT INTO facility_sports (facility_id, sport_id) VALUES ($1, $2)`,
                    [facility.id, sportId]
                );
            }
        }

        // Insert amenities
        if (amenities && amenities.length > 0) {
            for (const amenity of amenities) {
                await client.query(
                    `INSERT INTO facility_amenities (facility_id, amenity_name) VALUES ($1, $2)`,
                    [facility.id, amenity]
                );
            }
        }

        // Insert photos
        if (photos && photos.length > 0) {
            for (const photo of photos) {
                await client.query(
                    `INSERT INTO facility_photos (facility_id, photo_url, caption) VALUES ($1, $2, $3)`,
                    [facility.id, photo.url, photo.caption]
                );
            }
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            message: "Facility created successfully and submitted for approval",
            facility
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Create facility error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get facilities by owner (facility owner only)
router.get("/owner/my-facilities", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const owner_id = req.user.id;

        const result = await client.query(
            `SELECT f.*, 
                    COUNT(DISTINCT c.id) as court_count,
                    COUNT(DISTINCT b.id) as booking_count
             FROM facilities f
             LEFT JOIN courts c ON f.id = c.facility_id
             LEFT JOIN bookings b ON c.id = b.court_id
             WHERE f.owner_id = $1
             GROUP BY f.id
             ORDER BY f.created_at DESC`,
            [owner_id]
        );

        res.json({
            success: true,
            facilities: result.rows
        });
    } catch (err) {
        console.error("Get owner facilities error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update facility (facility owner only)
router.put("/:id", authenticateToken, authorizeRole(['facility_owner']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, address, latitude, longitude } = req.body;
        const owner_id = req.user.id;

        // Check if facility belongs to the owner
        const checkResult = await client.query(
            "SELECT * FROM facilities WHERE id = $1 AND owner_id = $2",
            [id, owner_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Facility not found or access denied" });
        }

        const result = await client.query(
            `UPDATE facilities 
             SET name = $1, description = $2, address = $3, latitude = $4, longitude = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6 AND owner_id = $7 RETURNING *`,
            [name, description, address, latitude, longitude, id, owner_id]
        );

        res.json({
            success: true,
            message: "Facility updated successfully",
            facility: result.rows[0]
        });
    } catch (err) {
        console.error("Update facility error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
