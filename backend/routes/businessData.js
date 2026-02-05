import express from 'express';
import {
  getBusinessData,
  createBusinessData,
  updateBusinessData,
  deleteBusinessData,
  downloadBusinessDataPDF
} from '../controllers/businessDataController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getBusinessData)
  .post(createBusinessData);

router.get('/download-pdf', downloadBusinessDataPDF);

router.route('/:id')
  .put(updateBusinessData)
  .delete(deleteBusinessData);

export default router;
