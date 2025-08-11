import express from "express";
import cors from "cors";
import client from "./database.js";
import { loginUser, signupUser } from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json()); // Add middleware to parse JSON bodies
const PORT = 3001;

// Login route
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        
        const user = await loginUser(email, password);
        res.json({ success: true, user });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(401).json({ error: error.message });
    }
});

// Signup route
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { email, password, full_name, phone_number } = req.body;
        
        if (!email || !password || !full_name) {
            return res.status(400).json({ error: "Email, password, and full name are required" });
        }
        
        const newUser = await signupUser({ email, password, full_name, phone_number });
        res.status(201).json({ success: true, user: newUser });
        
    } catch (error) {
        console.error("Signup error:", error);
        if (error.message === "User already exists") {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to create user" });
        }
    }
});

// Test database connection
app.get("/api/db-status", async (req, res) => {
    try {
        // Test connection with version info
        const versionResult = await client.query('SELECT version()');
        const tableResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        // Test users table
        const usersResult = await client.query("SELECT * FROM users");
        
        res.json({
            connected: true,
            version: versionResult.rows[0].version,
            tables: tableResult.rows.map(row => row.table_name),
            users: usersResult.rows
        });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ 
            error: "Database error", 
            message: err.message,
            code: err.code
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
