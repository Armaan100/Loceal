const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Chat Reference
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    // Sender Info
    senderType: {
      type: String,
      required: true,
      enum: ["customer", "seller", "system"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Message Content
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "location", "image", "system"],
      default: "text",
    },

    // Optional: Location Message
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
      address: { type: String },
    },

    // Optional: Image Message
    imageUrl: { type: String },

    // Read Status
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },

    // Soft Delete
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// GeoJSON Index (for location-based queries, if needed)
messageSchema.index({ location: "2dsphere" });

// Compound & other Indexes
messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

module.exports = mongoose.model("Message", messageSchema);
