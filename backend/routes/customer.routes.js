const express = require("express");
const router = express.Router();

const body = require("express-validator");

const customerController = require("../controllers/customer.controllers");
const {authCustomer} = require("../middlewares/auth.middleware");


router.post("/register", customerController.Register);
router.get("/verifyCustomer/:token", customerController.VerifyCustomer);   
router.post("/login", customerController.Login);
router.get("/logout", customerController.Logout);

// browse all products
router.get("/products", customerController.GetProducts)

module.exports = router;