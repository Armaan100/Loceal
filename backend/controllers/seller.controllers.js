const SellerModel = require("../models/seller.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../libs/nodemailer");
const fs = require("fs");
const path = require("path"); 
const crypto = require("crypto");
const { getCoordinatesFromAddress } = require("../libs/geocoding");

module.exports.Register = async (req, res) => {
    try{
        const {name, email, password, phone, location, businessName} = req.body;

        const sellerExists = await SellerModel.findOne({email: email});
        
        if(sellerExists){
            return res.status(400).json({
                message: "Seller with this email already exists"
            })
        }

        const hashPassword = await SellerModel.hashPassword(password);

        const {coordinates, address} = await getCoordinatesFromAddress(location);

        const seller = new SellerModel({
            name,
            email,
            password: hashPassword,
            phone,
            businessName,
            location: {
                type: "Point",
                coordinates: coordinates,
                address: address
            },
            isVerified: false
        });

        await seller.save();

        const token = seller.generateAuthToken();
        res.cookie("token", token);

        await sendEmail(email, "Welcome To Loceal, Verify Yourself",
            `  
            <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0F0E47; /* deep midnight blue background */
        }
        .container {
            width: 100%;
            text-align: center;
            padding: 20px;
        }
        .content {
            background-color: #272757; /* dark navy card */
            padding: 40px;
            margin: 20px auto;
            max-width: 600px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
            text-align: left;
            color: #E8E8F0;
        }
        .title {
            font-size: 22px;
            font-weight: bold;
            color: #8686AC; /* accent title */
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #C9C9D8;
            margin-top: 10px;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 28px;
            background-color: #505081; /* indigo button */
            color: #FFFFFF;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            transition: background 0.3s ease;
        }
        .button:hover {
            background-color: #8686AC; /* lighter hover effect */
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #A8A8C2;
            text-align: center;
        }
        /* Header Section */
        .header-table {
            background-color: #505081; /* muted indigo header */
            color: white;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <table width="100%" cellpadding="0" cellspacing="0" class="header-table">
            <tr>
                <td style="padding: 20px; font-size: 24px; font-weight: bold;">IAP CELL</td>
            </tr>
            <tr>
                <td style="font-size: 16px;">LOCEAL </td>
            </tr>
            <tr>
                <td style="font-size: 16px;">Local Deal</td>
            </tr>
        </table>

        <div class="content">
            <div class="title">VERIFICATION</div>
            <p class="message">Dear <b>${name}</b>,</p>
            <p class="message">Welcome to loceal.</p>

            <p class="message">Please verify your email address to activate your account.</p>

            <div style="text-align: center;">
                <a href="http://localhost:${process.env.PORT}/seller/verifySeller/${token}" class="button">Verify Email</a>
            </div>

            <p class="footer">If you did not sign up for this, you can ignore this email.</p>
        </div>
    </div>
</body>
</html>
            `
        );

        res.status(201).json({
            message: "Seller registered successfully",
            seller,
            token
        })
    }catch(err){
        return res.status(500).json({
            error: err.message
        })
    }
}

module.exports.VerifyCustomer = async (req, res) => {
    try{
            const token = req.params.token.trim();
            
            if(!token){
                return res.status(401).json({
                    message: "Unauthorized. No token provided."
                })
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
            if(!decoded || !decoded._id){
                return res.status(401).json({
                    message: "Unauthorized. Invalid token."
                })
            }
    
            const seller = await SellerModel.findById(decoded._id);
    
            if(!seller){
                return res.status(404).json({
                    message: "Seller not found."
                })
            }
    
            seller.isVerified = true;
            await seller.save();
    
            res.status(200).json({
                message: "Seller verified successfully."
            })
        }catch(err){
            return res.status(500).json({
                error: err.message
            })
        }
}

module.exports.Login = async (req, res) => {

}

module.exports.Logout = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}