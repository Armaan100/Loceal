const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // References
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
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
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Review Content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String },
    images: [
      {
        url: { type: String },
        alt: { type: String },
      },
    ],

    // Status
    isVerified: { type: Boolean, default: true },
    isReported: { type: Boolean, default: false },

    // Seller Response
    sellerResponse: {
      comment: { type: String },
      respondedAt: { type: Date },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes
reviewSchema.index({ order: 1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ seller: 1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
