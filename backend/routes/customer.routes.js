const express = require("express");
const router = express.Router();

const body = require("express-validator");

const customerController = require("../controllers/customer.controllers");

router.post("/register", customerController.Register);
router.post("/verifyCustomer/:token", customerController.VerifyCustomer);   
router.post("/login", customerController.Login);
router.get("/logout", customerController.Logout);

module.exports = router;