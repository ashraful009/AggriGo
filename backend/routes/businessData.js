import express from 'express';
import {
  getBusinessData,
  createBusinessData,
  updateBusinessData,
  deleteBusinessData,
  downloadBusinessDataPDF,
  getBusinessStats,
  getAllBusinessData
} from '../controllers/businessDataController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getBusinessData)
  .post(createBusinessData);

router.get('/download-pdf', downloadBusinessDataPDF);

// ── Admin-only routes (protect already applied via router.use) ───────────────
router.get('/stats', isAdmin, getBusinessStats);
router.get('/all', isAdmin, getAllBusinessData);

router.route('/:id')
  .put(updateBusinessData)
  .delete(deleteBusinessData);

export default router;
