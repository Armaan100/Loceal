const dotenv = require("dotenv")
dotenv.config();

const express = require("express");
const app = express();

const connectDB = require("./db/db");
connectDB();

const logger = require("morgan");
const cookieParser = require("cookie-parser");

const cors = require("cors");


const customerRoutes = require("./routes/customer.routes");
const sellerRoutes = require("./routes/seller.routes");
const adminRoutes = require("./routes/admin.routes");
const debugRoutes = require('./routes/debug.routes');

// middlewares
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || 3000}`;
app.use(cors({
    origin: [
        FRONTEND_URL,
        "https://loceal.netlify.app"
    ],
    credentials: true
}));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

// Simple request logger to help debug route handling
app.use((req, res, next) => {
    try {
        console.log(`[REQ] ${req.method} ${req.path} cookies:${!!req.cookies} authHeader:${!!(req.headers && req.headers.authorization)}`);
    } catch (e) {
        console.log('[REQ] logger error', e && e.message);
    }
    next();
});


// routes
app.use("/customer", customerRoutes);
app.use("/seller", sellerRoutes);
app.use("/admin", adminRoutes);
app.use("/api/chat", require("./routes/chat.routes"));
// Add review routes to app.js
app.use('/api/reviews', require('./routes/review.routes'));
// Debug routes (development only)
app.use('/debug', debugRoutes);

// Centralized error handler to capture unexpected errors
app.use((err, req, res, next) => {
    console.error('[ERROR HANDLER] Uncaught error:', err && err.stack ? err.stack : err);
    if (res.headersSent) return next(err);
    res.status(500).json({ success: false, error: err?.message || 'Internal Server Error' });
});

module.exports = app;