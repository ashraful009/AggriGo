import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import {
  FaCheckCircle,
  FaUser,
  FaBoxOpen,
  FaImages,
  FaFileContract,
  FaPenNib,
  FaCloudUploadAlt,
  FaArrowLeft,
  FaPaperPlane,
  FaFilePdf,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheck
} from 'react-icons/fa';

const Step6Review = ({ onSubmit, onBack }) => {
  const { formData } = useForm();
  const { t } = useLanguage();
  const [consents, setConsents] = useState({
    accuracy: formData.consentAccuracy || false,
    marketing: formData.consentMarketing || false
  });
  const [signature, setSignature] = useState(formData.digitalSignature || '');
  const [uploading, setUploading] = useState(false);
  const [signMethod, setSignMethod] = useState('type'); // 'type' or 'upload'

  const handleSignatureUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('folder', 'aggrigo/signatures');

      // Simulating API call structure
      const response = await api.post('/upload/single', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSignature(response.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload signature');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!consents.accuracy) {
      alert(t('form.step6.accuracyRequired') || "Please confirm that the information is accurate.");
      return;
    }
    onSubmit({
      consentAccuracy: consents.accuracy,
      consentMarketing: consents.marketing,
      digitalSignature: signature,
      submissionStatus: 'submitted'
    });
  };

  return (
    // Change 1: Max width increased to 7xl and added responsive horizontal padding
    <form onSubmit={handleSubmitForm} className="w-full max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 font-sans text-slate-800">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-5 shadow-sm">
          <FaCheckCircle className="text-3xl" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{t('form.step6.title') || "Review Application"}</h2>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-lg">
          {t('form.step6.subtitle') || "Please review all the information below carefully before submitting your application."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* LEFT COLUMN: Data Review (Span 8 on Large Screens) */}
        <div className="lg:col-span-8 space-y-8">

          {/* 1. Identity & Contact */}
          <ReviewSection title={t('form.step6.basicInfo') || "Basic Information"} icon={<FaUser />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label="Owner Name" value={formData.ownerName} />
              <ReadOnlyField label="Brand Name" value={formData.brandName} />
              <ReadOnlyField label="Gender" value={formData.gender} />

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 mt-2">
                <ContactField icon={<FaPhone />} label="Mobile" value={formData.mobileNumber} />
                <ContactField icon={<FaEnvelope />} label="Email" value={formData.email} />
                <ContactField icon={<FaMapMarkerAlt />} label="Location" value={`${formData.thana}, ${formData.district}`} fullWidth />
                <ReadOnlyField label="Detailed Address" value={formData.detailedAddress} fullWidth />
              </div>
            </div>
          </ReviewSection>

          {/* 2. Product Info */}
          <ReviewSection title={t('form.step6.productDetails') || "Product Details"} icon={<FaBoxOpen />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label="Product Name" value={formData.productName} />
              <ReadOnlyField label="Category" value={formData.productType} />
              <ReadOnlyField label="Production Type" value={formData.productionType} />
              <ReadOnlyField label="Production Place" value={formData.productionPlace} />
              <ReadOnlyField label="Capacity" value={formData.productionCapacity} />
              <ReadOnlyField label="Retail Price" value={formData.retailPrice ? `৳${formData.retailPrice}` : 'N/A'} />
            </div>
          </ReviewSection>

          {/* 3. Visual Gallery */}
          <ReviewSection title={t('form.step6.visualAssets') || "Visual Assets"} icon={<FaImages />}>
            <div className="space-y-6">
              {/* Product Images */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Product Showcase</p>
                {formData.productImages?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {formData.productImages.slice(0, 3).map((img, idx) => (
                      <ImagePreview key={idx} src={img} label={`Product ${idx + 1}`} />
                    ))}
                    {formData.productImages.length > 3 && (
                      <div className="flex items-center justify-center bg-slate-50 rounded-lg p-4 text-slate-500 text-sm font-medium">
                        +{formData.productImages.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <MissingLabel text="No product images uploaded" />
                )}
              </div>

              {/* Process Images */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Process & Packaging</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {formData.packagingImage ? (
                    <ImagePreview src={formData.packagingImage} label="Packaging" />
                  ) : (
                    <MissingLabel text="No packaging image" />
                  )}
                  {formData.productionProcessImage ? (
                    <ImagePreview src={formData.productionProcessImage} label="Production Process" />
                  ) : (
                    <MissingLabel text="No production image" />
                  )}
                </div>
              </div>
            </div>
          </ReviewSection>

          {/* 4. Documents */}
          <ReviewSection title={t('form.step6.attachedDocuments') || "Documents"} icon={<FaFileContract />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocItem label={t('dashboard.docs.tradeLicense') || "Trade License"} file={formData.registrationDocuments?.tradeLicenseFile} checked={formData.registrationDocuments?.tradeLicense} />
              <DocItem label={t('dashboard.docs.tin') || "TIN Certificate"} file={formData.registrationDocuments?.tinFile} checked={formData.registrationDocuments?.tin} />
              <DocItem label={t('dashboard.docs.bsti') || "BSTI Approval"} file={formData.registrationDocuments?.bstiFile} checked={formData.registrationDocuments?.bsti} />
              <DocItem label={t('dashboard.docs.exportLicense') || "Export License"} file={formData.registrationDocuments?.exportLicenseFile} checked={formData.registrationDocuments?.exportLicense} />
            </div>
          </ReviewSection>
        </div>

        {/* RIGHT COLUMN: Consent & Sign (Span 4 on Large Screens) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Consent Box - Sticky for better UX on large screens */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden lg:sticky lg:top-28">
            <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 border-b border-blue-100">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                <FaCheckCircle /> Terms & Confirmation
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${consents.accuracy ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}>
                <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${consents.accuracy ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
                  {consents.accuracy && <FaCheck size={12} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={consents.accuracy}
                  onChange={(e) => setConsents(prev => ({ ...prev, accuracy: e.target.checked }))}
                />
                <span className="text-sm text-slate-700 leading-relaxed select-none font-medium">
                  I hereby declare that the information provided is true and accurate. <span className="text-red-500">*</span>
                </span>
              </label>

              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${consents.marketing ? 'bg-amber-50/50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-amber-200'}`}>
                <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${consents.marketing ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-300'}`}>
                  {consents.marketing && <FaCheck size={12} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={consents.marketing}
                  onChange={(e) => setConsents(prev => ({ ...prev, marketing: e.target.checked }))}
                />
                <span className="text-sm text-slate-700 leading-relaxed select-none font-medium">
                  I agree to receive marketing updates and offers from AggriGo.
                </span>
              </label>
            </div>

            {/* Signature Box */}
            <div className="border-t border-slate-100 p-6 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide mb-4">
                <FaPenNib className="text-slate-400" /> Digital Signature
              </h3>

              {/* Tabs */}
              <div className="flex bg-slate-200/60 p-1 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => setSignMethod('type')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${signMethod === 'type' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Type Name
                </button>
                <button
                  type="button"
                  onClick={() => setSignMethod('upload')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${signMethod === 'upload' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Upload Image
                </button>
              </div>

              <div className="min-h-[120px] flex flex-col justify-center bg-white border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-300 transition-colors">
                {signMethod === 'type' ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={signature.startsWith('http') ? '' : signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none py-2 text-3xl font-serif italic text-slate-800 placeholder-slate-300 text-center transition-colors"
                      placeholder="Type name..."
                    />
                  </div>
                ) : (
                    <div className="text-center w-full">
                      <label className="cursor-pointer flex flex-col items-center justify-center h-full py-4 w-full">
                        <FaCloudUploadAlt className="text-4xl text-slate-400 mb-2" />
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">{uploading ? "Uploading..." : "Click to upload"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSignatureUpload(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>

              {/* Preview */}
              {signature && (
                <div className="mt-5 text-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-bold">Signature Preview</p>
                  {signature.startsWith('http') ? (
                    <img src={signature} alt="Sign" className="h-16 object-contain mx-auto" />
                  ) : (
                    <p className="font-serif italic text-2xl text-slate-800">{signature}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
              <button
                type="submit"
                disabled={!consents.accuracy || !signature}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg"
              >
                <FaPaperPlane /> {t('common.submitApplication') || "Submit Application"}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full bg-white text-slate-500 font-bold py-3.5 rounded-xl border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="text-sm" /> Back to Edit
              </button>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
};

// --- Sub-Components (Styled for Form Look) ---

const ReviewSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
      <div className="text-blue-600 bg-blue-100/50 p-2 rounded-lg">{icon}</div>
      <h3 className="font-bold text-slate-700 text-lg">{title}</h3>
    </div>
    <div className="p-6 md:p-8">
      {children}
    </div>
  </div>
);

// Form-like Read Only Input
const ReadOnlyField = ({ label, value, fullWidth }) => {
  if (!value) return null;
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm min-h-[48px] flex items-center select-text hover:border-slate-300 transition-colors">
        {value}
      </div>
    </div>
  );
};

const ContactField = ({ icon, label, value, fullWidth }) => {
  if (!value) return null;
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm hover:border-blue-300 transition-colors shadow-sm">
        <span className="text-blue-500 bg-blue-50 p-1.5 rounded-md">{icon}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
};

const ImagePreview = ({ src, label }) => (
  <div className="group relative">
    <div className="aspect-video bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
      <img src={src} alt={label} className="w-full h-full object-contain p-2" />
    </div>
    <p className="text-xs text-center mt-3 text-slate-500 font-bold uppercase tracking-wide">{label}</p>
  </div>
);

const MissingLabel = ({ text }) => (
  <div className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
    <div className="text-center">
      <p className="text-slate-400 text-sm font-medium">{text}</p>
      <p className="text-slate-300 text-xs mt-1">Can be uploaded later from Dashboard</p>
    </div>
  </div>
);

const DocItem = ({ label, file, checked }) => {
  if (file) {
    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 border border-red-100">
            <FaFilePdf className="text-lg" />
          </div>
          <span className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-700 transition-colors">{label}</span>
        </div>
        <a href={file} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg flex-shrink-0">
          View
        </a>
      </div>
    );
  }

  // If no file but was checked in Step 3, show as missing
  if (checked) {
    return (
      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
        <span className="text-sm font-medium text-amber-800">{label}</span>
        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1.5 rounded-lg">Missing</span>
      </div>
    );
  }

  // If not checked, show as not required
  return null;
};

export default Step6Review;