const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Reporter
    reportedBy: {
      userType: {
        type: String,
        required: true,
        enum: ["customer", "seller"],
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },

    // Reported User
    reportedUser: {
      userType: {
        type: String,
        required: true,
        enum: ["customer", "seller"],
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },

    // Report Details
    reportType: {
      type: String,
      required: true,
      enum: [
        "inappropriate_behavior",
        "fraud",
        "fake_products",
        "harassment",
        "spam",
        "other",
      ],
    },

    // Related Items (optional)
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Description
    description: {
      type: String,
      required: true,
    },

    // Evidence
    evidence: [
      {
        type: { type: String, enum: ["image", "screenshot", "document"] },
        url: { type: String },
        description: { type: String },
      },
    ],

    // Status & Priority
    status: {
      type: String,
      enum: ["pending", "under_review", "resolved", "dismissed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Admin Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    adminNotes: { type: String },

    // Action Taken
    action: {
      actionTaken: {
        type: String,
        enum: [
          "warning_issued",
          "user_suspended",
          "user_banned",
          "no_action",
          "other",
        ],
      },
      actionDetails: { type: String },
      actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      actionAt: { type: Date },
    },

    resolvedAt: { type: Date },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes
reportSchema.index({ "reportedUser.userId": 1 });
reportSchema.index({ "reportedBy.userId": 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ priority: 1 });
reportSchema.index({ assignedTo: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
