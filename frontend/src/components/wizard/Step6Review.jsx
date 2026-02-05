import { useState } from 'react';
import { useForm } from '../../context/FormContext';
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
  FaFilePdf
} from 'react-icons/fa';

const Step6Review = ({ onSubmit, onBack }) => {
  const { formData } = useForm();
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
      alert('You must certify that all information is correct to proceed.');
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
    <form onSubmit={handleSubmitForm} className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Final Review</h2>
        <p className="text-gray-500 mt-2">Please verify your information before official submission.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Data Review */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Identity & Contact */}
          <ReviewCard title="Basic Information" icon={<FaUser />}>
            <DataGrid>
              <DataItem label="Owner Name" value={formData.ownerName} />
              <DataItem label="Brand Name" value={formData.brandName} />
              <DataItem label="Gender" value={formData.gender} />
              <DataItem label="Mobile" value={formData.mobileNumber} />
              <DataItem label="Email" value={formData.email} />
              <DataItem label="Location" value={`${formData.thana}, ${formData.district}`} />
              <DataItem label="Full Address" value={formData.detailedAddress} fullWidth />
            </DataGrid>
          </ReviewCard>

          {/* 2. Product Info */}
          <ReviewCard title="Product Details" icon={<FaBoxOpen />}>
            <DataGrid>
              <DataItem label="Product Name" value={formData.productName} />
              <DataItem label="Category" value={formData.productType} />
              <DataItem label="Production Type" value={formData.productionType} />
              <DataItem label="Place" value={formData.productionPlace} />
              <DataItem label="Capacity" value={formData.productionCapacity} />
              <DataItem label="Retail Price" value={formData.retailPrice ? `৳${formData.retailPrice}` : 'N/A'} />
            </DataGrid>
          </ReviewCard>

          {/* 3. Visual Gallery (No Crop) */}
          <ReviewCard title="Visual Assets" icon={<FaImages />}>
            <div className="space-y-4">
              {/* Product Images */}
              {formData.productImages?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product Images</p>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.productImages.slice(0, 3).map((img, idx) => (
                      <ImagePreview key={idx} src={img} alt={`Product ${idx + 1}`} />
                    ))}
                  </div>
                </div>
              )}

              {/* Process Images */}
              {(formData.packagingImage || formData.productionProcessImage) && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Process</p>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.packagingImage && <ImagePreview src={formData.packagingImage} alt="Packaging" />}
                    {formData.productionProcessImage && <ImagePreview src={formData.productionProcessImage} alt="Production" />}
                  </div>
                </div>
              )}
            </div>
          </ReviewCard>

          {/* 4. Documents */}
          <ReviewCard title="Attached Documents" icon={<FaFileContract />}>
            <div className="space-y-2">
              <DocItem label="Trade License" file={formData.registrationDocuments?.tradeLicenseFile} />
              <DocItem label="TIN Certificate" file={formData.registrationDocuments?.tinFile} />
              <DocItem label="BSTI Certificate" file={formData.registrationDocuments?.bstiFile} />
              <DocItem label="Export License" file={formData.registrationDocuments?.exportLicenseFile} />
            </div>
          </ReviewCard>
        </div>

        {/* RIGHT COLUMN: Consent & Sign */}
        <div className="space-y-6">

          {/* Consent Box */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
              <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                <FaCheckCircle /> Terms & Conditions
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${consents.accuracy ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:border-emerald-200'}`}>
                <input
                  type="checkbox"
                  className="mt-1 accent-emerald-600 w-4 h-4"
                  checked={consents.accuracy}
                  onChange={(e) => setConsents(prev => ({ ...prev, accuracy: e.target.checked }))}
                />
                <span className="text-sm text-gray-700 leading-snug">
                  I hereby certify that the information provided is true, accurate, and complete. I understand that false information may lead to rejection. <span className="text-red-500">*</span>
                </span>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${consents.marketing ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100 hover:border-blue-200'}`}>
                <input
                  type="checkbox"
                  className="mt-1 accent-blue-600 w-4 h-4"
                  checked={consents.marketing}
                  onChange={(e) => setConsents(prev => ({ ...prev, marketing: e.target.checked }))}
                />
                <span className="text-sm text-gray-700 leading-snug">
                  (Optional) I consent to AggriGo using my business data for marketing and export opportunities.
                </span>
              </label>
            </div>
          </div>

          {/* Signature Box */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FaPenNib className="text-gray-500" /> Digital Signature
              </h3>
            </div>

            <div className="p-6">
              {/* Sign Method Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setSignMethod('type')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${signMethod === 'type' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Type Name
                </button>
                <button
                  type="button"
                  onClick={() => setSignMethod('upload')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${signMethod === 'upload' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Upload Image
                </button>
              </div>

              <div className="min-h-[120px] flex flex-col justify-center">
                {signMethod === 'type' ? (
                  <div className="relative">
                    <label className="text-xs text-gray-400 mb-1 block">Type your full name</label>
                    <input
                      type="text"
                      value={signature.startsWith('http') ? '' : signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="w-full border-b-2 border-gray-300 focus:border-emerald-500 outline-none py-2 text-3xl font-serif italic text-gray-800 placeholder-gray-300 text-center bg-transparent"
                      placeholder="Your Signature"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                      <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to Upload Signature'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSignatureUpload(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>

              {/* Signature Preview */}
              {signature && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-400 mb-2">Preview</p>
                  <div className="bg-gray-50 p-4 rounded-lg flex justify-center items-center h-20">
                    {signature.startsWith('http') ? (
                      <img src={signature} alt="Sign" className="h-full object-contain" />
                    ) : (
                      <span className="font-serif italic text-2xl text-gray-800">{signature}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={!consents.accuracy || !signature}
              className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaPaperPlane /> Submit Application
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full bg-white text-gray-600 font-semibold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FaArrowLeft /> Back to Step 5
            </button>
          </div>

        </div>
      </div>
    </form>
  );
};

// --- Helper Components ---

const ReviewCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 text-gray-700 font-semibold">
      <span className="text-emerald-600">{icon}</span> {title}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const DataGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
    {children}
  </div>
);

const DataItem = ({ label, value, fullWidth }) => {
  if (!value) return null;
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="block text-gray-700 font-medium mt-0.5">{value}</span>
    </div>
  );
};

// Ensures images are not cropped
const ImagePreview = ({ src, alt }) => (
  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
    <img src={src} alt={alt} className="w-full h-full object-contain p-1" />
    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const DocItem = ({ label, file }) => {
  if (!file) return null;
  return (
    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center gap-2">
        <FaFilePdf className="text-red-400" />
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      </div>
      <a href={file} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
        View
      </a>
    </div>
  );
};

export default Step6Review;