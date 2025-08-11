import express from "express";
import client from "../database.js";

const router = express.Router();

// Get all sports (public)
router.get("/", async (req, res) => {
    try {
        const result = await client.query(`
            SELECT s.*, COUNT(c.id) as court_count
            FROM sports s
            LEFT JOIN courts c ON s.id = c.sport_id
            GROUP BY s.id
            ORDER BY s.name
        `);

        res.json({
            success: true,
            sports: result.rows
        });
    } catch (err) {
        console.error("Get sports error:", err);
        // Return mock data if database is not available
        res.json({
            success: true,
            sports: [
                { id: 1, name: 'Badminton', description: 'Indoor racquet sport', court_count: 5 },
                { id: 2, name: 'Tennis', description: 'Racquet sport on court', court_count: 3 },
                { id: 3, name: 'Football', description: 'Team sport with ball', court_count: 2 },
                { id: 4, name: 'Basketball', description: 'Team sport with hoops', court_count: 4 },
                { id: 5, name: 'Cricket', description: 'Bat and ball game', court_count: 1 },
                { id: 6, name: 'Table Tennis', description: 'Indoor paddle sport', court_count: 6 }
            ]
        });
    }
});

// Get popular sports (public)
router.get("/popular", async (req, res) => {
    try {
        const result = await client.query(`
            SELECT s.*,
                   COUNT(DISTINCT c.id) as court_count,
                   COUNT(DISTINCT b.id) as booking_count
            FROM sports s
            LEFT JOIN courts c ON s.id = c.sport_id
            LEFT JOIN bookings b ON c.id = b.court_id AND b.status = 'confirmed'
            GROUP BY s.id
            HAVING COUNT(DISTINCT c.id) > 0
            ORDER BY booking_count DESC, court_count DESC
            LIMIT 6
        `);

        res.json({
            success: true,
            popular_sports: result.rows
        });
    } catch (err) {
        console.error("Get popular sports error:", err);
        // Return mock data if database is not available
        res.json({
            success: true,
            popular_sports: [
                { id: 1, name: 'Badminton', description: 'Indoor racquet sport', court_count: 5, booking_count: 25 },
                { id: 2, name: 'Tennis', description: 'Racquet sport on court', court_count: 3, booking_count: 18 },
                { id: 4, name: 'Basketball', description: 'Team sport with hoops', court_count: 4, booking_count: 15 },
                { id: 6, name: 'Table Tennis', description: 'Indoor paddle sport', court_count: 6, booking_count: 12 },
                { id: 3, name: 'Football', description: 'Team sport with ball', court_count: 2, booking_count: 8 },
                { id: 5, name: 'Cricket', description: 'Bat and ball game', court_count: 1, booking_count: 5 }
            ]
        });
    }
});

// Get sport details with facilities
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Get sport details
        const sportResult = await client.query(
            "SELECT * FROM sports WHERE id = $1",
            [id]
        );

        if (sportResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Sport not found" });
        }

        const sport = sportResult.rows[0];

        // Get facilities offering this sport
        const facilitiesResult = await client.query(`
            SELECT DISTINCT f.*, 
                   MIN(cp.price_per_hour) as starting_price,
                   COUNT(DISTINCT c.id) as court_count
            FROM facilities f
            JOIN courts c ON f.id = c.facility_id
            JOIN court_pricing cp ON c.id = cp.court_id
            WHERE c.sport_id = $1 AND f.approval_status = 'approved'
            GROUP BY f.id
            ORDER BY starting_price ASC
        `, [id]);

        res.json({
            success: true,
            sport: {
                ...sport,
                facilities: facilitiesResult.rows
            }
        });
    } catch (err) {
        console.error("Get sport details error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
