const express = require("express");
const router = express.Router();

const body = require("express-validator");

const customerController = require("../controllers/customer.controllers");

router.post("/register", customerController.Register);

module.exports = router;