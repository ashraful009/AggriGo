import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import BusinessData from '../models/BusinessData.js';

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

// @desc    Upload gallery images
// @route   POST /api/gallery/images
// @access  Private
export const uploadGalleryImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Get user's business data
    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found. Please complete registration first.'
      });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, `aggrigo/gallery/${req.user.id}`)
    );

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map(result => result.secure_url);

    // Add new image URLs to productImages array
    businessData.productImages = [...(businessData.productImages || []), ...imageUrls];
    await businessData.save();

    res.status(200).json({
      success: true,
      message: `${imageUrls.length} image(s) uploaded successfully`,
      images: imageUrls,
      totalImages: businessData.productImages.length
    });
  } catch (error) {
    console.error('Upload gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading gallery images'
    });
  }
};

// @desc    Get user's gallery images
// @route   GET /api/gallery/images
// @access  Private
export const getGalleryImages = async (req, res) => {
  try {
    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    res.status(200).json({
      success: true,
      images: businessData.productImages || []
    });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery images'
    });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/images
// @access  Private
export const deleteGalleryImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide image URL to delete'
      });
    }

    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Check if image exists in gallery
    if (!businessData.productImages || !businessData.productImages.includes(imageUrl)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in gallery'
      });
    }

    // Remove image URL from array (but keep in Cloudinary for history)
    businessData.productImages = businessData.productImages.filter(url => url !== imageUrl);
    await businessData.save();

    res.status(200).json({
      success: true,
      message: 'Image removed from gallery successfully',
      images: businessData.productImages
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery image'
    });
  }
};
