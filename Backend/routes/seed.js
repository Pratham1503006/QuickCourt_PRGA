import express from "express";
import bcrypt from "bcryptjs";
import client from "../database.js";

const router = express.Router();

// Seed database with sample data
router.post("/", async (req, res) => {
    try {
        console.log("Starting database seeding...");

        // Insert sample sports
        const sports = [
            ['Badminton', 'Indoor racquet sport played with shuttlecocks'],
            ['Tennis', 'Racquet sport played on a rectangular court'],
            ['Football', 'Team sport played with a spherical ball'],
            ['Basketball', 'Team sport played on a rectangular court with hoops'],
            ['Cricket', 'Bat-and-ball game played between two teams'],
            ['Table Tennis', 'Indoor sport played on a table with paddles'],
            ['Volleyball', 'Team sport played with a net'],
            ['Squash', 'Racquet sport played in a four-walled court']
        ];

        for (const [name, description] of sports) {
            try {
                await client.query(
                    `INSERT INTO sports (name, description) VALUES ($1, $2)`,
                    [name, description]
                );
            } catch (error) {
                // Ignore duplicate key errors
                if (!error.message.includes('duplicate key')) {
                    throw error;
                }
            }
        }

        // Hash password for sample users
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Insert sample users
        const users = [
            ['admin@quickcourt.com', hashedPassword, 'Admin User', 'admin', null, true],
            ['owner@quickcourt.com', hashedPassword, 'Facility Owner', 'facility_owner', '+1234567890', true],
            ['user@quickcourt.com', hashedPassword, 'Test User', 'user', '+1234567891', true]
        ];

        for (const [email, password_hash, full_name, role, phone_number, is_verified] of users) {
            try {
                await client.query(
                    `INSERT INTO users (email, password_hash, full_name, role, phone_number, is_verified)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [email, password_hash, full_name, role, phone_number, is_verified]
                );
            } catch (error) {
                // Ignore duplicate key errors
                if (!error.message.includes('duplicate key')) {
                    throw error;
                }
            }
        }

        // Get the facility owner ID
        const ownerResult = await client.query(
            "SELECT id FROM users WHERE email = 'owner@quickcourt.com'"
        );
        const ownerId = ownerResult.rows[0]?.id;

        if (ownerId) {
            // Insert sample facilities
            const facilities = [
                [ownerId, 'Sports Complex Central', 'Modern sports facility with multiple courts and amenities', '123 Sports Avenue, Downtown', 40.7128, -74.0060, 'approved'],
                [ownerId, 'Elite Badminton Club', 'Premium badminton facility with professional courts', '456 Racquet Street, Midtown', 40.7589, -73.9851, 'approved'],
                [ownerId, 'Community Sports Center', 'Affordable sports facility for all ages', '789 Community Drive, Uptown', 40.7831, -73.9712, 'approved']
            ];

            for (const [owner_id, name, description, address, latitude, longitude, approval_status] of facilities) {
                try {
                    await client.query(
                        `INSERT INTO facilities (owner_id, name, description, address, latitude, longitude, approval_status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [owner_id, name, description, address, latitude, longitude, approval_status]
                    );
                } catch (error) {
                    // Ignore duplicate key errors
                    if (!error.message.includes('duplicate key')) {
                        throw error;
                    }
                }
            }

            // Get facility and sport IDs
            const facilitiesResult = await client.query("SELECT id, name FROM facilities ORDER BY id");
            const sportsResult = await client.query("SELECT id, name FROM sports ORDER BY id");

            if (facilitiesResult.rows.length > 0 && sportsResult.rows.length > 0) {
                const facilityIds = facilitiesResult.rows.map(f => f.id);
                const sportIds = sportsResult.rows.map(s => s.id);

                // Insert sample courts
                const courts = [
                    [facilityIds[0], 'Court A1', sportIds[0]], // Badminton
                    [facilityIds[0], 'Court A2', sportIds[0]], // Badminton  
                    [facilityIds[0], 'Court B1', sportIds[1]], // Tennis
                    [facilityIds[0], 'Field C1', sportIds[2]], // Football
                    [facilityIds[1], 'Premium Court 1', sportIds[0]], // Badminton
                    [facilityIds[1], 'Premium Court 2', sportIds[0]], // Badminton
                    [facilityIds[2], 'Community Court 1', sportIds[0]], // Badminton
                    [facilityIds[2], 'Community Court 2', sportIds[3]], // Basketball
                    [facilityIds[2], 'Community Field', sportIds[2]] // Football
                ];

                for (const [facility_id, name, sport_id] of courts) {
                    try {
                        await client.query(
                            `INSERT INTO courts (facility_id, name, sport_id) VALUES ($1, $2, $3)`,
                            [facility_id, name, sport_id]
                        );
                    } catch (error) {
                        // Ignore duplicate key errors
                        if (!error.message.includes('duplicate key')) {
                            throw error;
                        }
                    }
                }

                // Get court IDs and insert pricing
                const courtsResult = await client.query("SELECT id FROM courts ORDER BY id");
                const courtIds = courtsResult.rows.map(c => c.id);

                const prices = [25.00, 25.00, 40.00, 60.00, 50.00, 50.00, 20.00, 30.00, 45.00];
                
                for (let i = 0; i < courtIds.length && i < prices.length; i++) {
                    await client.query(
                        `INSERT INTO court_pricing (court_id, price_per_hour) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                        [courtIds[i], prices[i]]
                    );
                }

                // Insert operating hours for first few courts
                const operatingHours = [
                    [1, '06:00:00', '23:00:00'], // Monday
                    [2, '06:00:00', '23:00:00'], // Tuesday
                    [3, '06:00:00', '23:00:00'], // Wednesday
                    [4, '06:00:00', '23:00:00'], // Thursday
                    [5, '06:00:00', '23:00:00'], // Friday
                    [6, '07:00:00', '22:00:00'], // Saturday
                    [0, '07:00:00', '22:00:00']  // Sunday
                ];

                for (let courtId of courtIds.slice(0, 3)) {
                    for (const [day_of_week, opening_time, closing_time] of operatingHours) {
                        await client.query(
                            `INSERT INTO operating_hours (court_id, day_of_week, opening_time, closing_time) 
                             VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
                            [courtId, day_of_week, opening_time, closing_time]
                        );
                    }
                }

                // Insert facility-sports relationships
                const facilitySpots = [
                    [facilityIds[0], sportIds[0]], // Sports Complex - Badminton
                    [facilityIds[0], sportIds[1]], // Sports Complex - Tennis
                    [facilityIds[0], sportIds[2]], // Sports Complex - Football
                    [facilityIds[0], sportIds[3]], // Sports Complex - Basketball
                    [facilityIds[1], sportIds[0]], // Elite Badminton - Badminton
                    [facilityIds[2], sportIds[0]], // Community Center - Badminton
                    [facilityIds[2], sportIds[2]], // Community Center - Football
                    [facilityIds[2], sportIds[3]]  // Community Center - Basketball
                ];

                for (const [facility_id, sport_id] of facilitySpots) {
                    await client.query(
                        `INSERT INTO facility_sports (facility_id, sport_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                        [facility_id, sport_id]
                    );
                }

                // Insert sample amenities
                const amenities = [
                    [facilityIds[0], 'Parking'],
                    [facilityIds[0], 'Changing Rooms'],
                    [facilityIds[0], 'Cafeteria'],
                    [facilityIds[0], 'Equipment Rental'],
                    [facilityIds[0], 'Air Conditioning'],
                    [facilityIds[1], 'Parking'],
                    [facilityIds[1], 'Changing Rooms'],
                    [facilityIds[1], 'Professional Coaching'],
                    [facilityIds[1], 'Equipment Rental'],
                    [facilityIds[1], 'Air Conditioning'],
                    [facilityIds[2], 'Parking'],
                    [facilityIds[2], 'Changing Rooms'],
                    [facilityIds[2], 'Water Fountain']
                ];

                for (const [facility_id, amenity_name] of amenities) {
                    await client.query(
                        `INSERT INTO facility_amenities (facility_id, amenity_name) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                        [facility_id, amenity_name]
                    );
                }
            }
        }

        console.log("Database seeding completed successfully!");

        res.json({
            success: true,
            message: "Database seeded successfully with sample data",
            data: {
                sports: sports.length,
                users: users.length,
                facilities: 3,
                courts: 9
            }
        });

    } catch (error) {
        console.error("Database seeding error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to seed database",
            error: error.message
        });
    }
});

export default router;
