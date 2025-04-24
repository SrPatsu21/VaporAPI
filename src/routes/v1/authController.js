const { Users } = require('../../models/User');
const { comparePasswords } = require('../../utils/passwordUtils');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// In-memory brute-force tracker: { [ip]: { attempts, lastAttempt } }
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

//! LOGOUT only on client side
/*
curl -k -X POST https://localhost/api/v1/login \
    -H "Content-Type: application/json" \
    -d '{
        "username": "johndoe",
        "password": "Secure_password1"
    }'
*/
const login = async (req, res) => {
    // Get real client IP behind NGINX
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    const now = Date.now();
    // Initialize or reset after time window
    if (!loginAttempts[ip] || now - loginAttempts[ip].lastAttempt > WINDOW_MS) {
        loginAttempts[ip] = { attempts: 0, lastAttempt: now };
    }
    // Increment attempt counter
    loginAttempts[ip].attempts += 1;
    loginAttempts[ip].lastAttempt = now;
    if (loginAttempts[ip].attempts > MAX_ATTEMPTS) {
        return res.status(429).json({
            message: "Too many login attempts. Please try again after 5 minutes."
        });
    }
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ username });

        // TODO verify if is a mistake, becase it will find user first and u will know what is wrong
        if (!user) return res.status(401).json({ message: "Invalid user name or password" });
        const match = await comparePasswords(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid user name or password" });

        // Reset attempts on success
        loginAttempts[ip] = { attempts: 0, lastAttempt: now };
        const payload = {
            userId: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        });

        res.status(200).json([{"token": token }, {"refreshToken": refreshToken}]);
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};


//!Without cookies, your frontend app must store and handle the refresh token securely, ideally:
    //!Store it in sessionStorage instead of localStorage (less persistent),
    //!Never expose it to XSS (Cross-site scripting) — sanitize inputs, CSP headers, etc.
/*
curl -k -X POST https://localhost/api/v1/refreshToken \
    -H "Content-Type: application/json" \
    -d '{
        "refreshToken": "REFRESH_TOKEN_HERE"
    }'
*/
const refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Missing refresh token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign({
            userId: decoded.userId,
            username: decoded.username,
            isAdmin: decoded.isAdmin
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
        });

        res.status(200).json({ token: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};

module.exports = {
    login,
    authenticate,
    isAdmin,
    refreshToken,
};