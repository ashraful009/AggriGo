// Step6Review.jsx — blue gradient theme (logic unchanged)
import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { FaCheckCircle, FaUser, FaBoxOpen, FaImages, FaFileContract, FaPenNib, FaCloudUploadAlt, FaArrowLeft, FaPaperPlane, FaFilePdf, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheck } from 'react-icons/fa';

const Step6Review = ({ onSubmit, onBack }) => {
  const { formData } = useForm();
  const { t } = useLanguage();
  const [consents, setConsents] = useState({ accuracy: formData.consentAccuracy || false, marketing: formData.consentMarketing || false });
  const [signature, setSignature] = useState(formData.digitalSignature || '');
  const [uploading, setUploading] = useState(false);
  const [signMethod, setSignMethod] = useState('type');

  const handleSignatureUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file); formDataObj.append('folder', 'aggrigo/signatures');
      const response = await api.post('/upload/single', formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data.success) setSignature(response.data.url);
    } catch (error) { console.error('Upload error:', error); alert('Failed to upload signature'); }
    finally { setUploading(false); }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!consents.accuracy) { alert(t('form.step6.accuracyRequired') || "Please confirm that the information is accurate."); return; }
    onSubmit({ consentAccuracy: consents.accuracy, consentMarketing: consents.marketing, digitalSignature: signature, submissionStatus: 'submitted' });
  };

  return (
    <form onSubmit={handleSubmitForm} className="w-full max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-500 mb-5 shadow-sm border border-blue-100">
          <FaCheckCircle className="text-3xl" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{t('form.step6.title') || "Review Application"}</h2>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-lg">{t('form.step6.subtitle') || "Please review all the information below carefully before submitting."}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <ReviewSection title={t('form.step6.basicInfo') || "Basic Information"} icon={<FaUser />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label={t('form.step6.ownerName') || "Owner Name"} value={formData.ownerName} />
              <ReadOnlyField label={t('form.step6.brandName') || "Brand Name"} value={formData.brandName} />
              <ReadOnlyField label={t('form.step6.gender') || "Gender"} value={formData.gender} />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-blue-50 mt-2">
                <ContactField icon={<FaPhone />} label={t('form.step6.mobileNumber') || "Mobile Number"} value={formData.mobileNumber} />
                <ContactField icon={<FaEnvelope />} label={t('form.step6.email') || "Email"} value={formData.email} />
                <ContactField icon={<FaMapMarkerAlt />} label={t('form.step6.location') || "Location"} value={`${formData.thana}, ${formData.district}`} fullWidth />
                <ReadOnlyField label={t('form.step6.detailedAddress') || "Detailed Address"} value={formData.detailedAddress} fullWidth />
              </div>
            </div>
          </ReviewSection>

          <ReviewSection title={t('form.step6.productDetails') || "Product Details"} icon={<FaBoxOpen />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label={t('form.step6.productName') || "Product Name"} value={formData.productName} />
              <ReadOnlyField label={t('form.step6.category') || "Category"} value={formData.productType} />
              <ReadOnlyField label={t('form.step6.productionType') || "Production Type"} value={formData.productionType} />
              <ReadOnlyField label={t('form.step6.productionPlace') || "Production Place"} value={formData.productionPlace} />
              <ReadOnlyField label={t('form.step6.productionCapacity') || "Production Capacity"} value={formData.productionCapacity} />
              <ReadOnlyField label={t('form.step6.wholesalePrice') || "Wholesale Price"} value={formData.wholesalePrice ? `৳${formData.wholesalePrice}` : 'N/A'} />
            </div>
          </ReviewSection>

          <ReviewSection title={t('form.step6.visualAssets') || "Visual Assets"} icon={<FaImages />}>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-blue-50 pb-2">{t('form.step6.productShowcase') || "Product Showcase"}</p>
                {formData.productImages?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {formData.productImages.slice(0, 3).map((img, idx) => <ImagePreview key={idx} src={img} label={`Product ${idx + 1}`} />)}
                    {formData.productImages.length > 3 && (
                      <div className="flex items-center justify-center bg-blue-50/40 rounded-lg p-4 text-blue-400 text-sm font-medium border border-blue-100">+{formData.productImages.length - 3} {t('form.step6.more') || "more"}</div>
                    )}
                  </div>
                ) : <MissingLabel text={t('form.step6.noProductImages') || "No product images uploaded"} />}
              </div>
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-blue-50 pb-2">{t('form.step6.processAndPackaging') || "Process & Packaging"}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {formData.packagingImage ? <ImagePreview src={formData.packagingImage} label={t('form.step6.packaging') || "Packaging"} /> : <MissingLabel text={t('form.step6.noPackagingImage') || "No packaging image"} />}
                  {formData.productionProcessImage ? <ImagePreview src={formData.productionProcessImage} label={t('form.step6.productionProcess') || "Production Process"} /> : <MissingLabel text={t('form.step6.noProductionImage') || "No production image"} />}
                </div>
              </div>
            </div>
          </ReviewSection>

          <ReviewSection title={t('form.step6.attachedDocuments') || "Documents"} icon={<FaFileContract />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocItem label={t('dashboard.docs.tradeLicense') || "Trade License"} file={formData.registrationDocuments?.tradeLicenseFile} checked={formData.registrationDocuments?.tradeLicense} />
              <DocItem label={t('dashboard.docs.tin') || "TIN Certificate"} file={formData.registrationDocuments?.tinFile} checked={formData.registrationDocuments?.tin} />
              <DocItem label={t('dashboard.docs.bsti') || "BSTI Approval"} file={formData.registrationDocuments?.bstiFile} checked={formData.registrationDocuments?.bsti} />
              <DocItem label={t('dashboard.docs.exportLicense') || "Export License"} file={formData.registrationDocuments?.exportLicenseFile} checked={formData.registrationDocuments?.exportLicense} />
            </div>
          </ReviewSection>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 overflow-hidden lg:sticky lg:top-28">
            <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 border-b border-blue-100">
              <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                <FaCheckCircle className="text-blue-400" /> {t('form.step6.termsTitle') || "Terms & Confirmation"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${consents.accuracy ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-blue-50/20 border-blue-100 hover:border-blue-200'}`}>
                <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${consents.accuracy ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-blue-200'}`}>
                  {consents.accuracy && <FaCheck size={12} />}
                </div>
                <input type="checkbox" className="hidden" checked={consents.accuracy} onChange={(e) => setConsents(prev => ({ ...prev, accuracy: e.target.checked }))} />
                <span className="text-sm text-slate-700 leading-relaxed select-none font-medium">
                  {t('form.step6.accuracyConsent') || "I hereby declare that the information provided is true and accurate."} <span className="text-red-500">*</span>
                </span>
              </label>

              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${consents.marketing ? 'bg-amber-50/50 border-amber-200 shadow-sm' : 'bg-blue-50/20 border-blue-100 hover:border-amber-200'}`}>
                <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${consents.marketing ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-blue-200'}`}>
                  {consents.marketing && <FaCheck size={12} />}
                </div>
                <input type="checkbox" className="hidden" checked={consents.marketing} onChange={(e) => setConsents(prev => ({ ...prev, marketing: e.target.checked }))} />
                <span className="text-sm text-slate-700 leading-relaxed select-none font-medium">{t('form.step6.marketingConsent') || "I agree to receive marketing updates and offers from SRIJON."}</span>
              </label>
            </div>

            {/* Signature */}
            <div className="border-t border-blue-50 p-6 bg-blue-50/20">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide mb-4">
                <FaPenNib className="text-blue-300" /> {t('form.step6.digitalSignature') || "Digital Signature"}
              </h3>
              <div className="flex bg-blue-50/50 p-1 rounded-xl mb-5 border border-blue-100">
                {['type', 'upload'].map((method, idx) => (
                  <button key={method} type="button" onClick={() => setSignMethod(method)}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${signMethod === method ? 'bg-white shadow-sm text-blue-600 border border-blue-100' : 'text-slate-500 hover:text-slate-700'}`}>
                    {idx === 0 ? t('form.step6.typeName') || "Type Name" : t('form.step6.uploadImage') || "Upload Image"}
                  </button>
                ))}
              </div>
              <div className="min-h-[120px] flex flex-col justify-center bg-white border-2 border-dashed border-blue-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                {signMethod === 'type' ? (
                  <input type="text" value={signature.startsWith('http') ? '' : signature} onChange={(e) => setSignature(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-blue-100 focus:border-blue-400 outline-none py-2 text-3xl font-serif italic text-slate-800 placeholder-blue-200 text-center transition-colors"
                    placeholder={t('form.step6.enterFullName') || "Type name..."} />
                ) : (
                  <div className="text-center w-full">
                    <label className="cursor-pointer flex flex-col items-center justify-center h-full py-4 w-full">
                      <FaCloudUploadAlt className="text-4xl text-blue-300 mb-2" />
                      <span className="text-xs text-blue-400 font-bold uppercase tracking-wide">{uploading ? "Uploading..." : t('form.step6.clickToUploadSignature') || "Click to upload"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSignatureUpload(e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
              {signature && (
                <div className="mt-5 text-center bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-[10px] text-blue-300 uppercase tracking-wider mb-2 font-bold">{t('form.step6.signaturePreview') || "Signature Preview"}</p>
                  {signature.startsWith('http') ? <img src={signature} alt="Sign" className="h-16 object-contain mx-auto" /> : <p className="font-serif italic text-2xl text-slate-800">{signature}</p>}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-white border-t border-blue-50 space-y-4">
              <button type="submit" disabled={!consents.accuracy || !signature}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg">
                <FaPaperPlane /> {t('common.submit') || "Submit Application"}
              </button>
              <button type="button" onClick={onBack}
                className="w-full bg-white text-slate-500 font-bold py-3.5 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50/30 hover:text-slate-700 transition-colors flex items-center justify-center gap-2">
                <FaArrowLeft className="text-sm" /> {t('common.backToEdit') || "Back to Edit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const ReviewSection = ({ title, icon, children }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-blue-100/50 border border-blue-100 overflow-hidden">
    <div className="px-6 py-5 border-b border-blue-50 bg-blue-50/30 flex items-center gap-3">
      <div className="text-blue-500 bg-blue-100/60 p-2 rounded-lg">{icon}</div>
      <h3 className="font-bold text-slate-700 text-lg">{title}</h3>
    </div>
    <div className="p-6 md:p-8">{children}</div>
  </div>
);

const ReadOnlyField = ({ label, value, fullWidth }) => {
  if (!value) return null;
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">{label}</label>
      <div className="w-full px-4 py-3.5 bg-blue-50/30 border border-blue-100 rounded-xl text-slate-700 font-medium text-sm min-h-[48px] flex items-center select-text hover:border-blue-200 transition-colors">{value}</div>
    </div>
  );
};

const ContactField = ({ icon, label, value, fullWidth }) => {
  if (!value) return null;
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3.5 bg-white border border-blue-100 rounded-xl text-slate-700 text-sm hover:border-blue-300 transition-colors shadow-sm overflow-hidden">
        <span className="text-blue-400 bg-blue-50 p-1.5 rounded-md flex-shrink-0">{icon}</span>
        <span className="font-medium truncate min-w-0">{value}</span>
      </div>
    </div>
  );
};

const ImagePreview = ({ src, label }) => (
  <div className="group relative">
    <div className="aspect-video bg-white rounded-xl overflow-hidden border border-blue-100 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
      <img src={src} alt={label} className="w-full h-full object-contain p-2" />
    </div>
    <p className="text-xs text-center mt-3 text-blue-400 font-bold uppercase tracking-wide">{label}</p>
  </div>
);

const MissingLabel = ({ text, caption = "Can be uploaded later from Dashboard" }) => (
  <div className="aspect-video bg-blue-50/30 rounded-xl border-2 border-dashed border-blue-100 flex items-center justify-center">
    <div className="text-center">
      <p className="text-blue-300 text-sm font-medium">{text}</p>
      <p className="text-blue-200 text-xs mt-1">{caption}</p>
    </div>
  </div>
);

const DocItem = ({ label, file, checked }) => {
  if (file) return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-400 flex-shrink-0 border border-red-100"><FaFilePdf className="text-lg" /></div>
        <span className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">{label}</span>
      </div>
      <a href={file} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex-shrink-0 border border-blue-100">View</a>
    </div>
  );
  if (checked) return (
    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
      <span className="text-sm font-medium text-amber-800">{label}</span>
      <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1.5 rounded-lg">Missing</span>
    </div>
  );
  return null;
};

export default Step6Review;
