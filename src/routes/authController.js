const { Users } = require('./path-to-your-user-model');
const { comparePasswords } = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');

// In-memory brute-force tracker: { [ip]: { attempts, lastAttempt } }
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/*
curl -k -X POST https://localhost/login \
-H "Content-Type: application/json" \
-d '{
    "email": "user@example.com",
    "password": "UserStrongP@ss123"
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
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        // TODO verify if is a mistake, becase it will find user first and u will know what is wrong
        if (!user) return res.status(401).json({ message: "Invalid email or password" });
        const match = await comparePasswords(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid email or password" });
        // Reset attempts on success
        loginAttempts[ip] = { attempts: 0, lastAttempt: now };
        const payload = {
            userId: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
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
};