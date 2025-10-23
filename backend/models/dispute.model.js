const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    // Order Reference
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Raised By
    raisedBy: {
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

    // Dispute Details
    disputeType: {
      type: String,
      required: true,
      enum: [
        "product_quality",
        "wrong_product",
        "payment_issue",
        "no_show",
        "behavior",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
    },

    // Evidence
    evidence: [
      {
        type: { type: String }, // URL or file type (optional clarification)
        description: { type: String },
      },
    ],

    // Status & Assignment
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "closed"],
      default: "open",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    // Resolution
    resolution: {
      decision: { type: String },
      refundAmount: { type: Number },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      resolvedAt: { type: Date },
      notes: { type: String },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes
disputeSchema.index({ order: 1 });
disputeSchema.index({ "raisedBy.userId": 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ assignedTo: 1 });

module.exports = mongoose.model("Dispute", disputeSchema);
