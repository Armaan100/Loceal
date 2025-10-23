const CustomerModel = require('../models/customer.model');
const jwt = require('jsonwebtoken');

module.exports.Register = async (req, res) => {
    
    res.status(200).json({ message: "Customer registered successfully" });
}

module.exports.Login = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}

module.exports.Logout = async (req, res) => {
    res.status(200).json({ message: "Customer registered successfully" });
}