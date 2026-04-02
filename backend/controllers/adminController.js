import User from '../models/User.js';
import Order from '../models/Order.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = true;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ success: true, message: 'User successfully verified', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status or handle dispute
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus, disputeResolved } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (disputeResolved !== undefined) {
      order.paymentStatus = disputeResolved ? 'refunded' : order.paymentStatus;
    }

    await order.save();
    res.status(200).json({ success: true, message: 'Order updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend or unsuspend a user/seller
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin)
export const toggleUserSuspension = async (req, res) => {
  try {
    const { isSuspended } = req.body; // true to suspend, false to activate
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isSuspended) {
       user.sellerStatus = 'rejected'; // Prevent seller login
       user.roles = user.roles.filter(role => role !== 'seller'); // Remove seller role completely
    } else {
       // if we activate, we might need to reset seller tracking
       user.sellerStatus = 'pending';
    }

    await user.save({ validateModifiedOnly: true });
    
    res.status(200).json({ success: true, message: `User ${isSuspended ? 'suspended' : 'unsuspended'} successfully`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
