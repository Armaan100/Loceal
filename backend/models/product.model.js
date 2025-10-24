const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    // enum: ['kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'bundle', 'packet']
  },
  minimumOrder: {
    type: Number,
    default: 1
  },
  images: [{
    url: {
      type: String,
      required: true
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalSales: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

//productSchema.index({ location: '2dsphere' });
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isAvailable: 1, isApproved: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);