const express = require("express");
const router = express.Router();

const body = require("express-validator");

const sellerController = require("../controllers/seller.controllers");

router.post("/register", sellerController.Register);

module.exports = router;