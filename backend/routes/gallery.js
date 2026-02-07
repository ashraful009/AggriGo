import express from 'express';
import {
  uploadGalleryImages,
  getGalleryImages,
  deleteGalleryImage
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Gallery image routes
router.route('/images')
  .get(getGalleryImages)
  .post(upload.array('images', 10), uploadGalleryImages)  // Max 10 images at once
  .delete(deleteGalleryImage);

export default router;
