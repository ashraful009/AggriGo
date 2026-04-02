import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'handicrafts',
        'fashion',
        'home-decor',
        'organic-agro'
      ],
    },
    subCategory: {
      type: String,
      default: '',
    },


    // Pricing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    discountPercentage: {
       type: Number,
       default: 0,
       min: 0,
       max: 100
    },
    unit: {
      type: String,
      default: '',
    },
    weightPerUnit: {
      type: Number,
      default: 0,
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'gram', 'liter', 'ton'],
      default: 'kg',
    },

    // Stock
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    // Images (Cloudinary URLs)
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],

    // Seller reference
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },

    // Location
    location: {
      division: String,
      district: String,
      upazila: String,
    },

    // Admin approval — pending যতক্ষণ admin approve না করে
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectedReason: { type: String, default: '' },
    approvedAt: { type: Date },

    // Stats
    totalSold: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    // Featured toggle (admin করবে)
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Middleware to calculate discountPrice from discountPercentage
ProductSchema.pre('save', function (next) {
  // Ensure we have numbers to work with
  const price = Number(this.price);
  const percentage = Number(this.discountPercentage);

  if (percentage > 0 && percentage < 100) {
    this.discountPrice = Math.round(price * (1 - percentage / 100));
  } else if (this.discountPrice && !percentage) {
    // If discountPrice was set manually but no percentage exists,
    // we keep it (backward compatibility) OR just let it be.
    // However, since we now use percentage as master, 
    // we should ideally keep them in sync.
  } else {
    this.discountPrice = null;
  }
  next();
});

// Search & filter indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ 'location.district': 1 });

// Virtual — effective price
ProductSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice !== null ? this.discountPrice : this.price;
});

// Virtual — discount percentage (uses the field or calculates from price if needed)
ProductSchema.virtual('discountPercent').get(function () {
  if (this.discountPercentage > 0) return this.discountPercentage;
  if (!this.discountPrice || !this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// Ensure virtuals are sent in JSON
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', ProductSchema);
