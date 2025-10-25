const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true  
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    //product details
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productSnapshot: {
        title: String,
        description: String,
        images: [String],
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "cod_pending", "cod_completed"],
        default: "cod_pending"
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "electronic", "upi", "card"],
        default: "cash"
    },
    paymentConfirmedBy: {
        userType: {
            type: String,
            enum: ["customer", "seller", "admin", null],
            default: null
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'paymentConfirmedBy.userType'
        },
        confirmedAt: Date
    }, // ← THIS COMMA WAS MISSING
    orderStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "confirmed", "meeting_scheduled", "completed", "cancelled", "disputed"]
    },
    statusHistory: [{
        status: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: {
            type: String
        }
    }],
    meetingDetails: {
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            }, 
            address: String,
        },
        scheduledTime: {
            type: Date
        }, 
        confirmedByCustomer: {
            type: Boolean,
            default: false
        },
        confirmedBySeller: {
            type: Boolean,
            default: false
        }
    },
    chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        default: null
    },
    cancellationReason: {
        type: String,
        default: null
    },
    cancelledBy: {
        userType: {
            type: String,
            enum: ['Customer', 'Seller', null],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        cancelledAt: {
            type: Date,
            default: null
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

orderSchema.index({ customer: 1 });

module.exports = mongoose.model('Order', orderSchema);