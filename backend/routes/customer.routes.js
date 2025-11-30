const express = require("express");
const router = express.Router();

const body = require("express-validator");

const customerController = require("../controllers/customer.controllers");
const {authCustomer} = require("../middlewares/auth.middleware");

// Log requests that reach the customer router
router.use((req, res, next) => {
	try {
		console.log('[customer.routes] incoming', req.method, req.path);
	} catch (e) {
		console.log('[customer.routes] logger error', e && e.message);
	}
	next();
});

// Log controller exports types for debugging
try {
	console.log('[customer.routes] controller types:', 'GetActiveOrders=', typeof customerController.GetActiveOrders, 'GetCompletedOrders=', typeof customerController.GetCompletedOrders);
} catch (e) {
	console.log('[customer.routes] controller type check error', e && e.message);
}


router.post("/register", customerController.Register);
router.get("/verifyCustomer/:token", customerController.VerifyCustomer);   
router.post("/login", customerController.Login);
router.get("/logout", customerController.Logout);

router.get("/profile", authCustomer, customerController.GetProfile);


// browse all products
router.get("/products", authCustomer, customerController.GetProducts)
// get single product details
router.get("/products/:productId", authCustomer, customerController.GetProductDetails)


// get cart details
router.get("/cart", authCustomer, customerController.GetCart);
// add to cart
router.post("/cart/add", authCustomer, customerController.AddToCart);
// remove from cart
router.delete("/cart/remove/:productId", authCustomer, customerController.RemoveFromCart);
// update cart item quantity
router.put("/cart/update/:productId", authCustomer, customerController.UpdateCartItem);
// clear cart
router.delete("/cart/clear", authCustomer, customerController.ClearCart);


// create order from specific cart item
router.post("/orders", authCustomer, customerController.CreateOrder); 
// Pending/active orders
router.get("/orders/active", authCustomer, customerController.GetActiveOrders); 

// Have to implement this
router.get("/orders/completed", authCustomer, customerController.GetCompletedOrders);

// Get Single Order Details with Chat
router.get("/orders/:orderId", authCustomer, customerController.GetOrderWithChat); 

// Cancel order
router.put("/orders/:orderId/cancel", authCustomer, customerController.CancelOrder);



// Verify OTP to complete order  
router.post("/orders/:orderId/verify-otp", authCustomer, customerController.GetTransactionOTP);


module.exports = router;