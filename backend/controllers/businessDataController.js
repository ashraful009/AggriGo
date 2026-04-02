import BusinessData from '../models/BusinessData.js';
import Product from '../models/Product.js';

// ─────────────────────────────────────────────────────────────────────────────
// Bengali → English enum value map
// ─────────────────────────────────────────────────────────────────────────────
const ENUM_VALUE_MAP = {
  // gender
  'পুরুষ': 'Male', 'মহিলা': 'Female', 'অন্যান্য': 'Other',
  // ownershipType
  'একক': 'Single', 'অংশীদারিত্ব': 'Partnership', 'লিমিটেড কোম্পানি': 'Ltd. Company',
  // rawMaterialSource
  'স্থানীয়': 'Local', 'আমদানিকৃত': 'Imported',
  // productionType
  'হস্তনির্মিত': 'Handmade', 'আধা-স্বয়ংক্রিয়': 'Semi-automatic', 'স্বয়ংক্রিয়': 'Automatic',
  // productionPlace
  'গৃহ-ভিত্তিক': 'Home-based', 'কারখানা-ভিত্তিক': 'Factory-based',
  // Yes/No fields
  'হ্যাঁ': 'Yes', 'না': 'No'
};

const ENUM_FIELDS = [
  'gender', 'ownershipType', 'rawMaterialSource', 'productionType',
  'productionPlace', 'bulkDiscount', 'hasBankAccount', 'interestInOnlineExport'
];

const normalizeEnumFields = (data) => {
  const out = { ...data };
  ENUM_FIELDS.forEach(field => {
    if (out[field] === '' || out[field] === null) {
      delete out[field];
    } else if (out[field] && ENUM_VALUE_MAP[out[field]]) {
      out[field] = ENUM_VALUE_MAP[out[field]];
    }
  });
  return out;
};


// ─────────────────────────────────────────────────────────────────────────────
// calculateCompletion
//
// Points breakdown (total = 100):
//   Step 1 Core (24pts)    : ownerName, brandName, mobileNumber, email,
//                            productType, ownerAge, gender, ownershipType  (3 pts each)
//   Step 1 Address (15pts) : division, district, thana, postCode,
//                            detailedAddress  (3 pts each)
//   Step 2 Product (20pts) : products array ≥ 1 entry (5), shortDescription (5),
//                            wholesalePrice (10)
//   Step 3 Market (10pts)  : businessAge (5), totalCustomers (5)
//   Step 4 Future (10pts)  : futureGoals (10)
//   Step 5 Media (15pts)   : productImages≥1 (10), packagingImage OR
//                            productionProcessImage (5)
//   Step 6 Consent (6pts)  : consentAccuracy (3), digitalSignature (3)
// ─────────────────────────────────────────────────────────────────────────────
const calculateCompletion = (data) => {
  if (!data) return { completionPercentage: 0, isProductShowcaseComplete: false, missingItems: [] };

  let points = 0;
  const missingItems = [];

  // Step 1 — Core (3 pts each × 8 = 24)
  const step1CoreFields = [
    'ownerName', 'brandName', 'mobileNumber', 'email',
    'productType', 'ownerAge', 'gender', 'ownershipType'
  ];
  step1CoreFields.forEach(f => { if (data[f]) points += 3; });

  // Step 1 — Address (3 pts each × 5 = 15)
  const step1AddressFields = ['division', 'district', 'thana', 'postCode', 'detailedAddress'];
  step1AddressFields.forEach(f => { if (data[f]) points += 3; });

  // Step 2 — Product (20)
  // FIX: use products array (matches the model) instead of a single productName field
  const hasProductName = Boolean(data.products && data.products.length > 0);
  const hasDescription = Boolean(data.shortDescription && data.shortDescription.length >= 10);
  const hasPrice = Boolean(data.wholesalePrice && Number(data.wholesalePrice) > 0);
  if (hasProductName) points += 5;
  if (hasDescription) points += 5;
  if (hasPrice) points += 10;

  // Step 3 — Market (10)
  if (data.businessAge !== undefined && data.businessAge !== null && data.businessAge !== '') points += 5;
  if (data.totalCustomers) points += 5;

  // Step 4 — Future (10)
  if (data.futureGoals && data.futureGoals.length >= 10) points += 10;

  // Step 5 — Media (15)
  const hasProductImages = Boolean(data.productImages && data.productImages.length >= 1);
  const hasOtherMedia = Boolean(data.packagingImage || data.productionProcessImage);
  if (hasProductImages) points += 10;
  if (hasOtherMedia) points += 5;

  // Step 6 — Consent (6)
  if (data.consentAccuracy === true) points += 3;
  if (data.digitalSignature) points += 3;

  const completionPercentage = Math.min(100, Math.round(points));

  const isProductShowcaseComplete =
    hasProductName &&
    hasDescription &&
    hasPrice &&
    hasProductImages;

  if (completionPercentage < 80) missingItems.push('Less than 80% Complete');
  if (!hasProductImages) missingItems.push('Gallery Images Missing');
  if (!hasProductName || !hasDescription || !hasPrice) missingItems.push('Product Showcase Incomplete');

  return { completionPercentage, isProductShowcaseComplete, missingItems };
};

// ─────────────────────────────────────────────────────────────────────────────
// triggerAgreementEmailIfReady
// ─────────────────────────────────────────────────────────────────────────────
export const triggerAgreementEmailIfReady = async (businessData, userId) => {
  try {
    if (businessData.isAgreementSent) return;

    const { completionPercentage, isProductShowcaseComplete } = calculateCompletion(businessData);

    if (completionPercentage < 80 || !isProductShowcaseComplete) {
      console.log(
        `[Agreement] Email NOT triggered for user ${userId}: ` +
        `${completionPercentage}% complete, showcase=${isProductShowcaseComplete}`
      );
      return;
    }

    const { generateAgreementPDF } = await import('../utils/agreementPdfGenerator.js');
    const { sendAgreementPDF } = await import('../utils/emailService.js');
    const UserModule = await import('../models/User.js');
    const user = await UserModule.default.findById(userId);

    if (!user) {
      console.warn(`[Agreement] User ${userId} not found — skipping email.`);
      return;
    }

    const language = user.preferredLanguage || 'en';
    const pdfBuffer = await generateAgreementPDF(userId, businessData, language);
    await sendAgreementPDF(user.email, user.name, pdfBuffer, language);

    businessData.isAgreementSent = true;
    await businessData.save();

    console.log(`[Agreement] PDF email sent to ${user.email} (user: ${userId})`);
  } catch (err) {
    console.error(`[Agreement] Failed to trigger email for user ${userId}:`, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/business
// ─────────────────────────────────────────────────────────────────────────────
export const getBusinessData = async (req, res) => {
  try {
    const businessData = await BusinessData.findOne({ userId: req.user.id });
    const { completionPercentage, isProductShowcaseComplete, missingItems } = calculateCompletion(businessData);

    res.status(200).json({
      success: true,
      data: businessData,
      completionPercentage,
      isProductShowcaseComplete,
      missingItems
    });
  } catch (error) {
    console.error('Get business data error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching business data' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/business
// ─────────────────────────────────────────────────────────────────────────────
export const createBusinessData = async (req, res) => {
  try {
    const sanitizedData = normalizeEnumFields(req.body);
    let businessData = await BusinessData.findOne({ userId: req.user.id });

    if (businessData) {
      businessData = await BusinessData.findOneAndUpdate(
        { userId: req.user.id },
        { ...sanitizedData, userId: req.user.id },
        { new: true, runValidators: true }
      );
    } else {
      businessData = await BusinessData.create({ ...sanitizedData, userId: req.user.id });
    }

    triggerAgreementEmailIfReady(businessData, req.user.id);

    res.status(201).json({ success: true, data: businessData });
  } catch (error) {
    console.error('Create business data error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating business data' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/business/:id
// ─────────────────────────────────────────────────────────────────────────────
export const updateBusinessData = async (req, res) => {
  try {
    let businessData = await BusinessData.findById(req.params.id);

    if (!businessData) {
      return res.status(404).json({ success: false, message: 'Business data not found' });
    }
    if (businessData.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this business data' });
    }

    const sanitizedData = normalizeEnumFields(req.body);
    businessData = await BusinessData.findByIdAndUpdate(req.params.id, sanitizedData, { new: true, runValidators: true });

    triggerAgreementEmailIfReady(businessData, req.user.id);

    res.status(200).json({ success: true, data: businessData });
  } catch (error) {
    console.error('Update business data error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating business data' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/business/:id
// ─────────────────────────────────────────────────────────────────────────────
export const deleteBusinessData = async (req, res) => {
  try {
    const businessData = await BusinessData.findById(req.params.id);

    if (!businessData) {
      return res.status(404).json({ success: false, message: 'Business data not found' });
    }
    if (businessData.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this business data' });
    }

    await businessData.deleteOne();
    res.status(200).json({ success: true, message: 'Business data deleted successfully' });
  } catch (error) {
    console.error('Delete business data error:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting business data' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/business/download-pdf
// ─────────────────────────────────────────────────────────────────────────────
export const downloadBusinessDataPDF = async (req, res) => {
  try {
    const businessData = await BusinessData.findOne({ userId: req.user.id });

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: 'No business data found. Please complete the registration form first.'
      });
    }

    const { completionPercentage, isProductShowcaseComplete } = calculateCompletion(businessData);
    if (completionPercentage < 80 || !isProductShowcaseComplete) {
      return res.status(403).json({
        success: false,
        message: 'Agreement PDF requires at least 80% profile completion and a complete product showcase.',
        completionPercentage,
        isProductShowcaseComplete
      });
    }

    const { generateAgreementPDF } = await import('../utils/agreementPdfGenerator.js');
    const User = await import('../models/User.js');
    const user = await User.default.findById(req.user.id);
    const language = req.query.lang || user.preferredLanguage || 'en';
    const pdfBuffer = await generateAgreementPDF(req.user.id, businessData, language);

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',
      `attachment; filename=Agreement_${user.name.replace(/\s+/g, '_')}_${dateStr}.pdf`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download Agreement PDF error:', error);
    res.status(500).json({
      success: false,
      message: `Agreement PDF generation failed: ${error.message}`,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/business/stats   (Admin)
//
// FIX: Step 2 Product score now checks `products` array size (≥1) instead of
//      the non-existent `productName` string field, matching calculateCompletion().
//
// Point breakdown (mirrors calculateCompletion):
//   Step 1 Core  (24): ownerName, brandName, mobileNumber, email,
//                       productType, ownerAge, gender, ownershipType  (3 each)
//   Step 1 Addr  (15): division, district, thana, postCode,
//                       detailedAddress  (3 each)
//   Step 2 Prod  (20): products.length≥1(5), shortDescription≥10chars(5),
//                       wholesalePrice>0(10)
//   Step 3 Mkt   (10): businessAge(5), totalCustomers(5)
//   Step 4 Fut   (10): futureGoals≥10chars(10)
//   Step 5 Media (15): productImages≥1(10), packagingImage||productionProcessImage(5)
//   Step 6 Cons  ( 6): consentAccuracy(3), digitalSignature(3)
// ─────────────────────────────────────────────────────────────────────────────
export const getBusinessStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $addFields: {
          _score: {
            $add: [
              // Step 1 Core — 3 pts each
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$ownerName', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$brandName', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$mobileNumber', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$email', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$productType', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $ifNull: ['$ownerAge', 0] }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$gender', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$ownershipType', ''] } }, 0] }, 3, 0] },
              // Step 1 Address — 3 pts each
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$division', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$district', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$thana', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$postCode', ''] } }, 0] }, 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$detailedAddress', ''] } }, 0] }, 3, 0] },
              // Step 2 Product — FIX: check products array length, not productName string
              { $cond: [{ $gte: [{ $size: { $ifNull: ['$products', []] } }, 1] }, 5, 0] },
              { $cond: [{ $gte: [{ $strLenCP: { $ifNull: ['$shortDescription', ''] } }, 10] }, 5, 0] },
              { $cond: [{ $gt: [{ $ifNull: ['$wholesalePrice', 0] }, 0] }, 10, 0] },
              // Step 3 Market
              { $cond: [{ $gt: ['$businessAge', null] }, 5, 0] },
              { $cond: [{ $gt: [{ $ifNull: ['$totalCustomers', 0] }, 0] }, 5, 0] },
              // Step 4 Future
              { $cond: [{ $gte: [{ $strLenCP: { $ifNull: ['$futureGoals', ''] } }, 10] }, 10, 0] },
              // Step 5 Media
              { $cond: [{ $gte: [{ $size: { $ifNull: ['$productImages', []] } }, 1] }, 10, 0] },
              {
                $cond: [
                  {
                    $or: [
                      { $gt: [{ $strLenCP: { $ifNull: ['$packagingImage', ''] } }, 0] },
                      { $gt: [{ $strLenCP: { $ifNull: ['$productionProcessImage', ''] } }, 0] }
                    ]
                  },
                  5,
                  0
                ]
              },
              // Step 6 Consent
              { $cond: ['$consentAccuracy', 3, 0] },
              { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$digitalSignature', ''] } }, 0] }, 3, 0] }
            ]
          }
        }
      },

      {
        $facet: {
          totalRegistrations: [
            { $count: 'count' }
          ],

          completionStats: [
            {
              $group: {
                _id: { $cond: [{ $gte: ['$_score', 80] }, 'Completed', 'Incomplete'] },
                count: { $sum: 1 }
              }
            }
          ],

          agreementTracking: [
            { $match: { isAgreementSent: true } },
            { $count: 'count' }
          ],

          // FIX: unwind products array and group by category to get accurate sector overview
          sectorOverview: [
            { $unwind: { path: '$products', preserveNullAndEmptyArrays: false } },
            {
              $match: {
                'products.category': { $exists: true, $nin: [null, ''] }
              }
            },
            {
              $group: {
                _id: '$products.category',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } }
          ]
        }
      }
    ];

    const [result] = await BusinessData.aggregate(pipeline);

    const totalRegistrations = result.totalRegistrations?.[0]?.count ?? 0;

    const completionMap = Object.fromEntries(
      (result.completionStats ?? []).map(({ _id, count }) => [_id, count])
    );
    const completionStats = {
      completed: completionMap['Completed'] ?? 0,
      incomplete: completionMap['Incomplete'] ?? 0
    };

    const agreementTracking = { sent: result.agreementTracking?.[0]?.count ?? 0 };

    const sectorOverview = (result.sectorOverview ?? []).map(({ _id, count }) => ({
      name: _id,
      count
    }));

    const pendingProductCount = await Product.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: { 
        totalRegistrations, 
        completionStats, 
        agreementTracking, 
        sectorOverview,
        pendingProductCount 
      }
    });
  } catch (error) {
    console.error('Get business stats error:', error);
    res.status(500).json({ success: false, message: 'Server error while computing business stats' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/business/all   (Admin)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllBusinessData = async (req, res) => {
  try {
    const { search, division, type, status, isAgreementSent } = req.query;
    const filter = {};

    if (division && division !== 'all') filter.division = division;
    if (type && type !== 'all') filter.productType = type;
    if (isAgreementSent === 'true') filter.isAgreementSent = true;

    if (search && search.trim() !== '') {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(escaped, 'i');
      filter.$or = [
        { mobileNumber: rx },
        { email: rx },
        { brandName: rx },
        { ownerName: rx }
      ];
    }

    const docs = await BusinessData
      .find(filter)
      .populate('userId', 'name email profilePictures')
      .sort({ createdAt: -1 })
      .lean();

    let enriched = docs.map((doc) => {
      const { completionPercentage, isProductShowcaseComplete, missingItems } = calculateCompletion(doc);
      return { ...doc, completionPercentage, isProductShowcaseComplete, missingItems };
    });

    if (status === 'completed') {
      enriched = enriched.filter(d => d.completionPercentage >= 80);
    } else if (status === 'incomplete') {
      enriched = enriched.filter(d => d.completionPercentage < 80);
    }

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    console.error('Get all business data error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching all business data' });
  }
};
