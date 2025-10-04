const dotenv = require("dotenv")
dotenv.config();

const express = require("express");
const app = express();

const logger = require("morgan");
const cookieParser = require("cookie-parser");

const cors = require("cors");

// middlewares
app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());


module.exports = app;