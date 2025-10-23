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
    paymentMethod: { // Added this field for clarity, defaulting to 'cod'
        type: String,
        enum: ["online", "cod"],
        default: "cod"
    },
    paymentStatus: {
        type: String,
        default: "pending", // Changed to lowercase
        enum: ["pending", "completed", "failed", "refunded", "cod"] // Added 'cod' for COD payments
    },
    paymentId: {
        type: String,
        default: null
    },
    orderStatus: {
        type: String,
        default: "pending", // Changed to lowercase
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