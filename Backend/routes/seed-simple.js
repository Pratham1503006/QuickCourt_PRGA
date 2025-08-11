import express from "express";
import bcrypt from "bcryptjs";
import client from "../database.js";

const router = express.Router();

// Simple seed endpoint that just inserts basic data
router.post("/", async (req, res) => {
    try {
        console.log("Starting simple database seeding...");

        // Insert sports if they don't exist
        const sportsCheck = await client.query("SELECT COUNT(*) as count FROM sports");
        if (parseInt(sportsCheck.rows[0].count) === 0) {
            const sports = [
                ['Badminton', 'Indoor racquet sport played with shuttlecocks'],
                ['Tennis', 'Racquet sport played on a rectangular court'],
                ['Football', 'Team sport played with a spherical ball'],
                ['Basketball', 'Team sport played on a rectangular court with hoops'],
                ['Cricket', 'Bat-and-ball game played between two teams'],
                ['Table Tennis', 'Indoor sport played on a table with paddles']
            ];

            for (const [name, description] of sports) {
                await client.query(
                    `INSERT INTO sports (name, description) VALUES ($1, $2)`,
                    [name, description]
                );
            }
            console.log("Sports inserted");
        }

        // Insert sample users if they don't exist
        const usersCheck = await client.query("SELECT COUNT(*) as count FROM users WHERE role != 'user' OR email LIKE '%quickcourt.com'");
        if (parseInt(usersCheck.rows[0].count) === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);

            // Insert admin
            await client.query(
                `INSERT INTO users (email, password_hash, full_name, role, is_verified) 
                 VALUES ($1, $2, $3, $4, $5)`,
                ['admin@quickcourt.com', hashedPassword, 'Admin User', 'admin', true]
            );

            // Insert facility owner
            await client.query(
                `INSERT INTO users (email, password_hash, full_name, role, phone_number, is_verified) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                ['owner@quickcourt.com', hashedPassword, 'Facility Owner', 'facility_owner', '+1234567890', true]
            );

            // Insert test user
            await client.query(
                `INSERT INTO users (email, password_hash, full_name, role, phone_number, is_verified) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                ['user@quickcourt.com', hashedPassword, 'Test User', 'user', '+1234567891', true]
            );

            console.log("Sample users inserted");
        }

        // Get owner ID
        const ownerResult = await client.query("SELECT id FROM users WHERE email = 'owner@quickcourt.com'");
        const ownerId = ownerResult.rows[0]?.id;

        // Insert sample facilities if they don't exist
        const facilitiesCheck = await client.query("SELECT COUNT(*) as count FROM facilities");
        if (parseInt(facilitiesCheck.rows[0].count) === 0 && ownerId) {
            await client.query(
                `INSERT INTO facilities (owner_id, name, description, address, latitude, longitude, approval_status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [ownerId, 'Sports Complex Central', 'Modern sports facility with multiple courts and amenities', '123 Sports Avenue, Downtown', 40.7128, -74.0060, 'approved']
            );

            await client.query(
                `INSERT INTO facilities (owner_id, name, description, address, latitude, longitude, approval_status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [ownerId, 'Elite Badminton Club', 'Premium badminton facility with professional courts', '456 Racquet Street, Midtown', 40.7589, -73.9851, 'approved']
            );

            console.log("Sample facilities inserted");
        }

        // Get facility and sport IDs
        const facilitiesResult = await client.query("SELECT id FROM facilities LIMIT 2");
        const sportsResult = await client.query("SELECT id FROM sports LIMIT 4");

        // Insert sample courts if they don't exist
        const courtsCheck = await client.query("SELECT COUNT(*) as count FROM courts");
        if (parseInt(courtsCheck.rows[0].count) === 0 && facilitiesResult.rows.length > 0 && sportsResult.rows.length > 0) {
            const facilityId1 = facilitiesResult.rows[0].id;
            const facilityId2 = facilitiesResult.rows[1]?.id || facilityId1;
            const badmintonId = sportsResult.rows[0].id;
            const tennisId = sportsResult.rows[1]?.id || badmintonId;

            // Insert courts
            await client.query(
                `INSERT INTO courts (facility_id, name, sport_id) VALUES ($1, $2, $3)`,
                [facilityId1, 'Court A1', badmintonId]
            );

            await client.query(
                `INSERT INTO courts (facility_id, name, sport_id) VALUES ($1, $2, $3)`,
                [facilityId1, 'Court A2', badmintonId]
            );

            await client.query(
                `INSERT INTO courts (facility_id, name, sport_id) VALUES ($1, $2, $3)`,
                [facilityId2, 'Premium Court 1', badmintonId]
            );

            // Get court IDs and insert pricing
            const courtsResult = await client.query("SELECT id FROM courts");
            for (const court of courtsResult.rows) {
                await client.query(
                    `INSERT INTO court_pricing (court_id, price_per_hour) VALUES ($1, $2)`,
                    [court.id, 25.00]
                );
            }

            console.log("Sample courts and pricing inserted");
        }

        // Insert facility-sports relationships
        const facilitySporsCheck = await client.query("SELECT COUNT(*) as count FROM facility_sports");
        if (parseInt(facilitySporsCheck.rows[0].count) === 0 && facilitiesResult.rows.length > 0 && sportsResult.rows.length > 0) {
            for (const facility of facilitiesResult.rows) {
                for (const sport of sportsResult.rows.slice(0, 2)) {
                    await client.query(
                        `INSERT INTO facility_sports (facility_id, sport_id) VALUES ($1, $2)`,
                        [facility.id, sport.id]
                    );
                }
            }
            console.log("Facility-sports relationships inserted");
        }

        console.log("Database seeding completed successfully!");

        res.json({
            success: true,
            message: "Database seeded successfully with sample data",
            credentials: {
                admin: { email: 'admin@quickcourt.com', password: 'password123' },
                owner: { email: 'owner@quickcourt.com', password: 'password123' },
                user: { email: 'user@quickcourt.com', password: 'password123' }
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
