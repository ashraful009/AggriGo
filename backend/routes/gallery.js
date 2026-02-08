import express from 'express';
import {
  getAllMedia,
  uploadGalleryImages,
  deleteGalleryImage,
  uploadPackagingImage,
  deletePackagingImage,
  uploadProductionImage,
  deleteProductionImage,
  uploadCertificate,
  deleteCertificate
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all media
router.get('/all-media', getAllMedia);

// Product images routes
router.route('/images')
  .post(upload.array('images', 10), uploadGalleryImages)
  .delete(deleteGalleryImage);

// Packaging image routes
router.route('/packaging')
  .post(upload.single('image'), uploadPackagingImage)
  .delete(deletePackagingImage);

// Production process image routes
router.route('/production')
  .post(upload.single('image'), uploadProductionImage)
  .delete(deleteProductionImage);

// Certificate/document routes
router.route('/certificate')
  .post(upload.single('document'), uploadCertificate)
  .delete(deleteCertificate);

export default router;
