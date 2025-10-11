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

// middlewares
app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());


// routes
app.use("/customer", customerRoutes);
app.use("/seller", sellerRoutes);
app.use("/admin", adminRoutes);


module.exports = app;