const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    // Order Reference
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    // Participants
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    // Last Message Info
    lastMessage: {
      content: { type: String },
      senderType: { type: String, enum: ["customer", "seller"] },
      senderId: { type: mongoose.Schema.Types.ObjectId },
      timestamp: { type: Date },
    },

    // Unread Counts
    unreadCount: {
      customer: { type: Number, default: 0 },
      seller: { type: Number, default: 0 },
    },

    // Status
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes
chatRoomSchema.index({ order: 1 });
chatRoomSchema.index({ customer: 1 });
chatRoomSchema.index({ seller: 1 });
chatRoomSchema.index({ "lastMessage.timestamp": -1 });

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
