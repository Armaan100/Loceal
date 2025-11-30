const CustomerModel = require("../models/customer.model");
const SellerModel = require("../models/seller.model");
const AdminModel = require("../models/admin.model")

const jwt = require("jsonwebtoken");

module.exports.authCustomer = async (req, res, next) => {
    try{
        const authHeader = req.headers && req.headers.authorization;
        const tokenFromHeader = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
        const token = req.cookies?.token || tokenFromHeader;

        console.log('[authCustomer] authHeader present:', !!authHeader, 'cookie token present:', !!req.cookies?.token, 'tokenFromHeader present:', !!tokenFromHeader);

        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded || !decoded._id){
            return res.status(401).json({
                message: "Unauthorized. Invalid token."
            });
        }

        const customer = await CustomerModel.findById(decoded._id);

        if(!customer){
            return res.status(404).json({
                message: "Customer not found."
            });
        }

        if(customer.isBlocked){
            return res.status(403).json({
                message: "Your account has been blocked. Please contact support."
            });
        }

        req.customer = customer;
        next();
    }catch(err){
        return res.status(401).json({
            message: err.message
        })
    }
}



module.exports.authSeller = async (req, res, next) => {
    try{
        const authHeader = req.headers && req.headers.authorization;
        const tokenFromHeader = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
        const token = req.cookies?.token || tokenFromHeader;

        console.log('[authSeller] authHeader present:', !!authHeader, 'cookie token present:', !!req.cookies?.token, 'tokenFromHeader present:', !!tokenFromHeader);

        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded || !decoded._id){
            return res.status(401).json({
                message: "Unauthorized. Invalid token."
            });
        }

        const seller = await SellerModel.findById(decoded._id);

        if(!seller){
            return res.status(404).json({
                message: "Seller not found."
            });
        }

        if(seller.isBlocked){
            return res.status(403).json({
                message: "Your account has been blocked. Please contact support."
            });
        }

        req.seller = seller;
        next();
    }catch(err){
        return res.status(401).json({
            message: err.message
        })
    }
}



module.exports.authAdmin = async (req, res, next) => {
    try{
        const authHeader = req.headers && req.headers.authorization;
        const tokenFromHeader = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
        const token = req.cookies?.token || tokenFromHeader;

        console.log('[authAdmin] authHeader present:', !!authHeader, 'cookie token present:', !!req.cookies?.token, 'tokenFromHeader present:', !!tokenFromHeader);

        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded || !decoded._id){
            return res.status(401).json({
                message: "Unauthorized. Invalid token."
            });
        }

        const admin = await AdminModel.findById(decoded._id);

        if(!admin){
            return res.status(404).json({
                message: "Admin not found."
            });
        }

        req.admin = admin;
        next();
    }catch(err){
        return res.status(401).json({
                message: err.message
        })
    }
}
