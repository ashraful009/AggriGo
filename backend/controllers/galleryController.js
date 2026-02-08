import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import BusinessData from '../models/BusinessData.js';

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
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

// @desc    Get all media (product images, packaging, production, certificates)
// @route   GET /api/gallery/all-media
// @access  Private
export const getAllMedia = async (req, res) => {
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
      mediaGallery: {
        productImages: businessData.productImages || [],
        packagingImage: businessData.packagingImage || null,
        productionProcessImage: businessData.productionProcessImage || null,
        certificates: {
          tradeLicenseFile: businessData.registrationDocuments?.tradeLicenseFile || null,
          tinFile: businessData.registrationDocuments?.tinFile || null,
          bstiFile: businessData.registrationDocuments?.bstiFile || null,
          exportLicenseFile: businessData.registrationDocuments?.exportLicenseFile || null
        }
      }
    });
  } catch (error) {
    console.error('Get all media error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching media gallery'
    });
  }
};

// @desc    Upload product images (multiple)
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
      images: businessData.productImages
    });
  } catch (error) {
    console.error('Upload gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading gallery images'
    });
  }
};

// @desc    Delete product image
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

    if (!businessData.productImages || !businessData.productImages.includes(imageUrl)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in gallery'
      });
    }

    // Remove image URL from array
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

// @desc    Upload packaging image
// @route   POST /api/gallery/packaging
// @access  Private
export const uploadPackagingImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, `aggrigo/packaging/${req.user.id}`);

    businessData.packagingImage = result.secure_url;
    await businessData.save();

    res.status(200).json({
      success: true,
      message: 'Packaging image uploaded successfully',
      url: result.secure_url
    });
  } catch (error) {
    console.error('Upload packaging error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading packaging image'
    });
  }
};

// @desc    Delete packaging image
// @route   DELETE /api/gallery/packaging
// @access  Private
export const deletePackagingImage = async (req, res) => {
  try {
    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    businessData.packagingImage = '';
    await businessData.save();

    res.status(200).json({
      success: true,
      message: 'Packaging image removed successfully'
    });
  } catch (error) {
    console.error('Delete packaging error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting packaging image'
    });
  }
};

// @desc    Upload production process image
// @route   POST /api/gallery/production
// @access  Private
export const uploadProductionImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, `aggrigo/production/${req.user.id}`);

    businessData.productionProcessImage = result.secure_url;
    await businessData.save();

    res.status(200).json({
      success: true,
      message: 'Production process image uploaded successfully',
      url: result.secure_url
    });
  } catch (error) {
    console.error('Upload production error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading production image'
    });
  }
};

// @desc    Delete production process image
// @route   DELETE /api/gallery/production
// @access  Private
export const deleteProductionImage = async (req, res) => {
  try {
    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    businessData.productionProcessImage = '';
    await businessData.save();

    res.status(200).json({
      success: true,
      message: 'Production process image removed successfully'
    });
  } catch (error) {
    console.error('Delete production error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting production image'
    });
  }
};

// @desc    Upload certificate/document
// @route   POST /api/gallery/certificate
// @access  Private
export const uploadCertificate = async (req, res) => {
  try {
    const { certificateType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a document'
      });
    }

    if (!certificateType) {
      return res.status(400).json({
        success: false,
        message: 'Certificate type is required'
      });
    }

    const validTypes = ['tradeLicense', 'tin', 'bsti', 'exportLicense'];
    if (!validTypes.includes(certificateType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid certificate type'
      });
    }

    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, `aggrigo/certificates/${req.user.id}`);

    // Initialize registrationDocuments if it doesn't exist
    if (!businessData.registrationDocuments) {
      businessData.registrationDocuments = {};
    }

    // Update the specific certificate field
    businessData.registrationDocuments[`${certificateType}File`] = result.secure_url;
    businessData.registrationDocuments[certificateType] = true; // Mark as checked

    await businessData.save();

    res.status(200).json({
      success: true,
      message: 'Certificate uploaded successfully',
      url: result.secure_url
    });
  } catch (error) {
    console.error('Upload certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading certificate'
    });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/gallery/certificate
// @access  Private
export const deleteCertificate = async (req, res) => {
  try {
    const { certificateType } = req.body;

    if (!certificateType) {
      return res.status(400).json({
        success: false,
        message: 'Certificate type is required'
      });
    }

    const validTypes = ['tradeLicense', 'tin', 'bsti', 'exportLicense'];
    if (!validTypes.includes(certificateType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid certificate type'
      });
    }

    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    if (businessData.registrationDocuments) {
      businessData.registrationDocuments[`${certificateType}File`] = '';
    }

    await businessData.save();

    res.status(200).json({
      success: true,
      message: 'Certificate removed successfully'
    });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting certificate'
    });
  }
};
