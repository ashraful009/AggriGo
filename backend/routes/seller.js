import express from 'express';
import { protect, requireAdmin } from '../middleware/auth.js';
import {
  applyAsSeller,
  getSellerStatus,
  getSellerDashboard,
  approveSeller,
  rejectSeller,
  getPendingRequests,
} from '../controllers/sellerController.js';
import { requireSeller } from '../middleware/auth.js';

const router = express.Router();

// Seller routes (login থাকলেই access)
router.post('/apply', protect, applyAsSeller);
router.get('/status', protect, getSellerStatus);
router.get('/dashboard', protect, requireSeller, getSellerDashboard);

// Admin — pending sellers দেখা
router.get('/admin/pending', protect, requireAdmin, getPendingRequests);

// Get all pending seller requests (new standard path)
router.get('/pending', protect, requireAdmin, getPendingRequests);

// Admin — approve/reject seller
router.patch('/:id/approve', protect, requireAdmin, approveSeller);
router.patch('/:id/reject', protect, requireAdmin, rejectSeller);

export default router;
