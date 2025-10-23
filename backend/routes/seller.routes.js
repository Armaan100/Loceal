const express = require("express");
const router = express.Router();

const body = require("express-validator");

const sellerController = require("../controllers/seller.controllers");

router.post("/register", sellerController.Register);
router.get("/verifySeller/:token", sellerController.VerifySeller); 
router.post("/login", sellerController.Login);
router.get("/logout", sellerController.Logout);

module.exports = router;