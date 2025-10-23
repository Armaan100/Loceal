const CustomerModel = require("../models/customer.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../libs/nodemailer");
const fs = require("fs");
const path = require("path"); 
const crypto = require("crypto");

module.exports.Register = async (req, res) => {
    try{
        console.log(req.body);
        
        const customerExists = await CustomerModel.findOne({email: req.body.email});

        // customer exits
        if(customerExists){
            return res.status(400).json({
                message: "Sign In Error Occurred"
            })
        }

        // customer does not exists
        const hashPassword = await CustomerModel.hashPassword(req.body.password);

        
    }catch(err){
    
    }
}

module.exports.Login = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}

module.exports.Logout = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}