import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../database.js";
import { Auth } from "two-step-auth";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper to send OTP
async function sendOTP(email) {
    try {
        const res = await Auth(email, "QuickCourt");
        return res.OTP;
    } catch (error) {
        // Fallback to generated OTP if email service fails
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Middleware to check user role
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Insufficient permissions' });
        }
        next();
    };
};

// Signup route
router.post("/signup", async (req, res) => {
    const { full_name, email, password, role = 'user', phone_number, avatar_url } = req.body;

    // Validate required fields
    if (!full_name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate role
    const validRoles = ['user', 'facility_owner', 'admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
    }

    try {
        const exists = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (exists.rows.length > 0) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 min expiry

        const result = await client.query(
            `INSERT INTO users (email, password_hash, full_name, role, phone_number, avatar_url, otp_code, otp_expiry)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, full_name, role, phone_number, avatar_url, is_verified`,
            [email, hashedPassword, full_name, role, phone_number, avatar_url, otp, otpExpiry]
        );

        // Try to send OTP via email
        try {
            await sendOTP(email);
        } catch (error) {
            console.log("Email service unavailable, using generated OTP");
        }

        res.json({
            success: true,
            message: "User registered successfully. Please verify your email with OTP.",
            user: result.rows[0],
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only send OTP in development
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// OTP Verification route
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const result = await client.query(
            "SELECT * FROM users WHERE email = $1 AND otp_code = $2 AND otp_expiry > NOW()",
            [email, otp]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Update user as verified and clear OTP
        await client.query(
            "UPDATE users SET is_verified = true, otp_code = NULL, otp_expiry = NULL WHERE email = $1",
            [email]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: "Email verified successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                phone_number: user.phone_number,
                avatar_url: user.avatar_url,
                is_verified: true
            }
        });
    } catch (err) {
        console.error("OTP verification error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.is_verified) {
            return res.status(401).json({ success: false, message: "Please verify your email first" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                phone_number: user.phone_number,
                avatar_url: user.avatar_url,
                is_verified: user.is_verified
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;