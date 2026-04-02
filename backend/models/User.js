import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },

    // একজন user একসাথে buyer ও seller হতে পারবে
    roles: {
      type: [String],
      enum: ['buyer', 'seller', 'admin'],
      default: ['buyer'],
    },
    
    role: {
      type: String,
      enum: ['admin', 'seller', 'customer'],
      default: 'customer'
    },
    
    // Seller status
    sellerStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
    sellerAppliedAt: { type: Date },
    sellerApprovedAt: { type: Date },
    sellerRejectedReason: { type: String },

    // Profile
    profilePicture: { type: String, default: '' },
    address: {
      division: String,
      district: String,
      upazila: String,
      details: String,
    },

    // ─── Auth helpers ───────────────────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    otpHash: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },   // singular — matches controller
  },
  { timestamps: true }
);

// ── Password hashing ─────────────────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance methods ──────────────────────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.isSeller = function () {
  return this.roles.includes('seller') && this.sellerStatus === 'approved';
};

UserSchema.methods.isAdmin = function () {
  return this.roles.includes('admin');
};

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // 1. Generate a cryptographically random 32-byte plain token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2. Hash it and store in the schema field (never store plain token in DB)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Token valid for 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // 4. Return the PLAIN token — this goes into the reset URL email link
  return resetToken;
};

export default mongoose.model('User', UserSchema);
