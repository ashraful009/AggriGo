import User from '../models/User.js';
import Product from '../models/Product.js';

// Seller হওয়ার জন্য apply
// POST /api/seller/apply
export const applyAsSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.sellerStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Your seller application is already under review',
      });
    }
    if (user.sellerStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'You are already an approved seller',
      });
    }

    user.sellerStatus = 'pending';
    user.sellerAppliedAt = new Date();
    user.sellerStatus = 'pending';
user.sellerAppliedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Seller application submitted. Admin will review shortly.',
      sellerStatus: user.sellerStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seller এর নিজের status দেখা
// GET /api/seller/status
export const getSellerStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'sellerStatus sellerAppliedAt sellerApprovedAt sellerRejectedReason roles'
    );

    res.status(200).json({
      success: true,
      data: {
        sellerStatus: user.sellerStatus,
        roles: user.roles,
        appliedAt: user.sellerAppliedAt,
        approvedAt: user.sellerApprovedAt,
        rejectedReason: user.sellerRejectedReason,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seller dashboard summary
// GET /api/seller/dashboard
export const getSellerDashboard = async (req, res) => {
  try {
    const [totalProducts, pendingProducts, approvedProducts, rejectedProducts] =
      await Promise.all([
        Product.countDocuments({ seller: req.user._id }),
        Product.countDocuments({ seller: req.user._id, status: 'pending' }),
        Product.countDocuments({ seller: req.user._id, status: 'approved' }),
        Product.countDocuments({ seller: req.user._id, status: 'rejected' }),
      ]);

    res.status(200).json({
      success: true,
      data: { totalProducts, pendingProducts, approvedProducts, rejectedProducts },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin — seller approve
// PATCH /api/seller/:id/approve
export const approveSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        sellerStatus: 'approved',
        sellerApprovedAt: new Date(),
        sellerRejectedReason: '',
        $addToSet: { roles: 'seller' }  // roles array তে 'seller' add করবে
      },
      { new: true }
    ).select('name email isVerified sellerStatus');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `${user.name} approved as seller`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin — seller reject
// PATCH /api/seller/:id/reject
export const rejectSeller = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        sellerStatus: 'rejected',
        sellerRejectedReason: reason || 'Application does not meet requirements',
      },
      { new: true }
    ).select('name email sellerStatus');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `${user.name}'s seller application rejected`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin — Get all pending seller requests
// GET /api/seller/pending
export const getPendingRequests = async (req, res) => {
  try {
    const pendingSellers = await User.find({ sellerStatus: 'pending' })
      .select('name email phone sellerAppliedAt profilePicture')
      .sort({ sellerAppliedAt: -1 });

    res.status(200).json({ success: true, count: pendingSellers.length, data: pendingSellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
