const CustomerModel = require("../models/customer.model");
const ProductModel = require("../models/product.model");
const SellerModel = require("../models/seller.model");
const CartModel = require("../models/cart.model");

const jwt = require("jsonwebtoken");
const sendEmail = require("../libs/nodemailer");
const fs = require("fs");
const path = require("path"); 
const crypto = require("crypto");
const { getCoordinatesFromAddress } = require("../libs/geocoding");
const { default: mongoose } = require("mongoose");
const { createTransport } = require("nodemailer");

module.exports.Register = async (req, res) => {
    try{
        console.log(req.body);
        
        const {name, email, password, phone, defaultAddress} = req.body;

        const customerExists = await CustomerModel.findOne({email: req.body.email});

        // customer exits
        if(customerExists){
            return res.status(400).json({
                message: "Sign In Error Occurred"
            })
        }

        // customer does not exists
        const hashPassword = await CustomerModel.hashPassword(req.body.password);
        
        const {coordinates, address} = await getCoordinatesFromAddress(defaultAddress);

        const customer = new CustomerModel({
            name,
            email,
            password: hashPassword,
            phone,
            defaultAddress: {
                type: "Point",
                coordinates: coordinates,
                address: address
            },
            isVerified: false, // eitu MVP r krne
        });

        await customer.save();

        const token = customer.generateAuthToken();
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
                <a href="http://localhost:${process.env.PORT}/customer/verifyCustomer/${token}" class="button">Verify Email</a>
            </div>

            <p class="footer">If you did not sign up for this, you can ignore this email.</p>
        </div>
    </div>
</body>
</html>
            `
        );

        res.status(201).json({
            message: "Customer registered successfully",
            customer,
            token
        })
    }catch(err){
        res.status(500).json({
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

        const customer = await CustomerModel.findById(decoded._id);

        if(!customer){
            return res.status(404).json({
                message: "Customer not found."
            })
        }

        customer.isVerified = true;
        await customer.save();

        res.status(200).json({
            message: "Customer verified successfully."
        })
    }catch(err){
        return res.status(500).json({
            error: err.message
        })
    }
}

module.exports.Login = async (req, res) => {
    const {email, password} = req.body;

    const customer = await CustomerModel.findOne({email: email}).select("+password");

    if(!customer){
        return res.status(400).json({
            message: "Customer not found"
        })
    }

    const validPassword = await customer.comparePassword(password);

    if(!validPassword){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const token = customer.generateAuthToken();
    res.cookie("token", token);

    res.status(200).json({
        message: "Customer logged in successfully",
        customer,
        token
    });
}

module.exports.Logout = async (req, res) => {
    res.clearCookie("token");
    
    res.status(200).json({
        message: "Customer logged out successfully"
    })
}

module.exports.GetProducts = async (req, res) => {
    try{
        const {lat, lng, maxDistance=50} = req.query;

        // validating coordinates
        if(!lat || !lng){
            return res.status(400).json({
                success: false,
                message: "Latitude and Longitude are required"
            });
        }

        const customerCoordinates = [parseFloat(lng), parseFloat(lat)];

        // find seller within the radis
        const nearbySellers = await SellerModel.find({
            "location.coordinates": {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: customerCoordinates
                    },
                    $maxDistance: maxDistance*1000 // km 2 m bonalu
                }
            },
            isVerified: true
        }).select("_id businessName rating location");

        if(nearbySellers.length === 0){
            return res.status(200).json({
                success: true,
                products: [],
                total: 0,
                location: {
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                    maxDistance: parseInt(maxDistance)
                },
                message: "No Sellers found in your area"
            });
        }

        const sellerIds = nearbySellers.map(seller => seller._id);

        // find the available products from these sellers
        const products = await ProductModel.find({
            seller: {
                $in: sellerIds
            },
            isAvailable: true,
            stock: { $gt: 0 }
        })
        .sort({ createdAt: -1 });

        //calculate approximate distance for each product
        const productsWithLocation = products.map(product => {
            const seller = nearbySellers.find(s => s._id.toString() === product.seller._id.toString());
            
            if(!seller)
                return null;

            // Simple distance calculation (approximate)
            const calculateDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371; // Earth's radius in km
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = 
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                return R * c; // Distance in km
            };

            const sellerCoords = seller.location.coordinates;
            const distance = calculateDistance(
                parseFloat(lat), 
                parseFloat(lng), 
                sellerCoords[1], // latitude
                sellerCoords[0]  // longitude
            );

            return {
                ...product.toObject(),
                distance: Math.round(distance * 10) / 10, // Round to 1 decimal
                sellerLocation: seller.location.address
            };
        }).filter(product => product !== null);

        // Sort by distance (nearest first)
        productsWithLocation.sort((a, b) => a.distance - b.distance);

        res.status(200).json({
            success: true,
            products: productsWithLocation,
            total: productsWithLocation.length,
            location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                maxDistance: parseInt(maxDistance)
            },
            message: `Found ${productsWithLocation.length} products from ${nearbySellers.length} nearby sellers within ${maxDistance}km`
        });
    }catch(err){
        return res.status(500).json({
            success: false,  
            error: err.message
        })
    }
}

module.exports.GetProductDetails = async (req, res) => {
    try{
        const {productId} = req.params;

        // validating product Id
        if(!mongoose.Types.ObjecId.isValid(productId)){
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const product = await ProductModel.findById(productId)
        .populate("seller", "businessName rating totalSale location phone");

        // such product not found
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // check if product is available
        if (!product.isAvailable || product.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: "Product is currently unavailable"
            });
        }

        // Increment view count 
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            product,
            message: "Product details fetched successfully"
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.AddToCart = async (req, res) => {
    try{
        const {productId, quantity = 1} = req.body;
        const customerId = req.customer._id;

        // validating input
        if(!productId){
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // checking if product tu ase ne nai aru available oo ase ne nai
        const product = await ProductModel.findById(productId);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if(!product.isAvailable || product.stock <= 0){
            return res.status(400).json({
                success: false,
                message: "Product is currently unavailable"
            });
        }

        // check id product tu verified seller r hoi ne naa
        if(!product.seller.isVerified){
            return res.status(400).json({
                success: false,
                message: "Cannot add products from unverified sellers to cart"
            });
        }
        
        // checking ki requested quanity available ase ne nai
        if(quantity > product.stock){
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items are available in stock`
            });
        }

        // find or create -> customer krne
        let cart = await CartModel.findOne({customer: customerId});

        // cart nai iyar
        if(!cart){
            cart = new CartModel({
                customer: customerId,
                items: []
            });
        }

        // check ki product already exists cart t
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if(existingItemIndex > -1){
            // new quantity loi update mar
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;

            if(newQuantity > product.stock){
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} items are available in stock`
                });
            }

            // update price in case it changed
            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].priceAtAdd = product.price;
        }else{
            // new item cart t
            cart.items.push({
                product: productId,
                seller: product.seller,
                quantity: quantity,
                priceAtAdd: product.price
            });
        }

        await cart.save();

        // cart tu -> populate with product details before sending response

        await cart.populate("items.product", "title price images unit");
        await cart.populate("items.seller", "businessName");

        res.status(200).json({
            success: true,
            cart,
            message: "Product added to cart successfully"
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.GetCart = async (req, res) => {
    try{
        const customerId = req.customer._id;

        const cart = await CartModel.findOne({
            customer: customerId
        })
        .populate("items.product", "title price images unit stock isAvailable")
        .populate("items.seller", "businessName rating");

        
        if(!cart){
            return res.status(200).json({
                success: true,
                cart: {
                    items: [],
                    total: 0
                },
                message: "Cart is empty"
            });
        }

        
        // total price calc kor
        let total = 0;
        cart.items.forEach(item => {
            total += items.priceAtAdd*item.quantity;
        });

        res.status(200).json({
            success: true,
            cart: {
                ...cart.toObject(),
                total: total
            },
            message: "Cart fetched successfully"
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports.RemoveFromCart = async (req, res) => {
    try{
        const customerId = req.customer._id;
        const {productId} = req.params;

        const cart = await CartModel.findOne({
            customer: customerId
        });

        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        // Cart r pra otora
        cart.items = cart.items.filter(item =>
            item.product.toString() !== productId
        )
        

        await cart.save();

        // populate and calculate total
        await cart.populate("items.product", "title price images unit stock isAvailable");

        await cart.populate("items.seller", "businessName rating");

        let total = 0;
        for(const item of cart.items){
            total += item.priceAtAdd * item.quantity;
        }

        res.status(200).json({
            success: true,
            cart: {
                ...cart.toObject(),
                total
            },
            message: "Product removed from cart successfully"
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}