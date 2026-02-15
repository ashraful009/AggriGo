import BusinessData from '../models/BusinessData.js';

// Helper function to sanitize enum fields (convert empty strings to undefined)
const sanitizeEnumFields = (data) => {
  const enumFields = [
    'gender', 'ownershipType', 'rawMaterialSource', 'productionType',
    'productionPlace', 'bulkDiscount', 'hasBankAccount', 'interestInOnlineExport'
  ];
  
  const sanitized = { ...data };
  enumFields.forEach(field => {
    if (sanitized[field] === '') {
      delete sanitized[field];
    }
  });
  
  return sanitized;
};

// @desc    Get user's business data
// @route   GET /api/business
// @access  Private
export const getBusinessData = async (req, res) => {
  try {
    const businessData = await BusinessData.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('Get business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching business data'
    });
  }
};

// @desc    Create or update business data
// @route   POST /api/business
// @access  Private
export const createBusinessData = async (req, res) => {
  try {
    // Sanitize enum fields (convert empty strings to undefined)
    const sanitizedData = sanitizeEnumFields(req.body);
    
    // Check if user already has business data
    let businessData = await BusinessData.findOne({ userId: req.user.id });

    if (businessData) {
      // Update existing data
      businessData = await BusinessData.findOneAndUpdate(
        { userId: req.user.id },
        { ...sanitizedData, userId: req.user.id },
        { new: true, runValidators: true }
      );
    } else {
      // Create new business data
      businessData = await BusinessData.create({
        ...sanitizedData,
        userId: req.user.id
      });
    }

    // Generate and send Agreement PDF (non-blocking - don't fail if PDF fails)
    try {
      // Import Agreement PDF and email utilities
      const { generateAgreementPDF } = await import('../utils/agreementPdfGenerator.js');
      const { sendAgreementPDF } = await import('../utils/emailService.js');
      const User = await import('../models/User.js');
      
      // Fetch user data
      const user = await User.default.findById(req.user.id);
      
      if (user) {
        // Detect language (default to English)
        const language = user.preferredLanguage || 'en';

        // Generate Agreement PDF
        const pdfBuffer = await generateAgreementPDF(req.user.id, businessData, language);

        // Send Agreement PDF via email
        await sendAgreementPDF(user.email, user.name, pdfBuffer, language);
        console.log('Agreement PDF sent to:', user.email);
      }
    } catch (pdfError) {
      console.error('Failed to generate/send Agreement PDF:', pdfError);
      // Don't fail the request if PDF generation fails
    }

    res.status(201).json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('Create business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating business data'
    });
  }
};

// @desc    Update business data
// @route   PUT /api/business/:id
// @access  Private
export const updateBusinessData = async (req, res) => {
  try {
    let businessData = await BusinessData.findById(req.params.id);

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Make sure user owns the business data
    if (businessData.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this business data'
      });
    }

    // Sanitize enum fields (convert empty strings to undefined)
    const sanitizedData = sanitizeEnumFields(req.body);
    
    // Track if this was previously submitted (for email notification logic)
    const wasSubmitted = businessData.submissionStatus === 'submitted';
    const isNowSubmitted = sanitizedData.submissionStatus === 'submitted';

    businessData = await BusinessData.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      { new: true, runValidators: true }
    );

    // Send email notification if form is being submitted (either first time or update)
    if (isNowSubmitted) {
      try {
        const { generateAgreementPDF } = await import('../utils/agreementPdfGenerator.js');
        const { sendAgreementPDF, sendProfileUpdateEmail } = await import('../utils/emailService.js');
        const User = await import('../models/User.js');
        
        const user = await User.default.findById(req.user.id);
        
        if (user) {
          // Detect language
          const language = user.preferredLanguage || 'en';

          const pdfBuffer = await generateAgreementPDF(req.user.id, businessData, language);
          
          // Send appropriate email based on whether this is first submission or update
          if (wasSubmitted) {
            // This is an update to already submitted data
            await sendProfileUpdateEmail(user.email, user.name, pdfBuffer, language);
            console.log('Profile update email sent to:', user.email);
          } else {
            // This is the first submission
            await sendAgreementPDF(user.email, user.name, pdfBuffer, language);
            console.log('Agreement PDF sent to:', user.email);
          }
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the update if email fails - it's non-blocking
      }
    }

    res.status(200).json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('Update business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating business data'
    });
  }
};

// @desc    Delete business data
// @route   DELETE /api/business/:id
// @access  Private
export const deleteBusinessData = async (req, res) => {
  try {
    const businessData = await BusinessData.findById(req.params.id);

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'Business data not found'
      });
    }

    // Make sure user owns the business data
    if (businessData.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this business data'
      });
    }

    await businessData.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Business data deleted successfully'
    });
  } catch (error) {
    console.error('Delete business data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting business data'
    });
  }
};

export const downloadBusinessDataPDF = async (req, res) => {
  try {
    // Get user's business data
    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete the registration form first.'
      });
    }

    // Import Agreement PDF generator
    const { generateAgreementPDF } = await import('../utils/agreementPdfGenerator.js');
    const User = await import('../models/User.js');
    
    // Fetch user data
    const user = await User.default.findById(req.user.id);
    
    // Get language from query parameter or user preference
    const language = req.query.lang || user.preferredLanguage || 'en';

    // Generate Agreement PDF
    const pdfBuffer = await generateAgreementPDF(req.user.id, businessData, language);

    // Format date for filename
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',
      `attachment; filename=Agreement_${user.name.replace(/\s+/g, '_')}_${dateStr}.pdf`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download Agreement PDF error:', error);
    console.error('Error stack:', error.stack);
    console.error('User ID:', req.user?.id);
    
    res.status(500).json({
      success: false,
      message: `Agreement PDF generation failed: ${error.message}`,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
