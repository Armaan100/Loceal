const express = require("express");
const router = express.Router();

const body = require("express-validator");

const adminController = require("../controllers/admin.controllers");

router.post("/register", adminController.Register);

module.exports = router;



