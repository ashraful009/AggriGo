import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { FaCloudUploadAlt, FaTrash, FaImage, FaBoxOpen, FaIndustry, FaVideo, FaPlus, FaCheckCircle, FaArrowRight, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const MAX_IMAGE_MB = 2, MAX_VIDEO_MB = 10;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024, MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;
const validateFileSize = (file, type) => {
  if (!file) return null;
  const limit = type === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  const limitMB = type === 'video' ? MAX_VIDEO_MB : MAX_IMAGE_MB;
  return file.size > limit ? `"${file.name}" is too large. Max ${limitMB}MB allowed for ${type}s.` : null;
};

const Step5MediaUpload = ({ onNext, onBack }) => {
  const { formData, updateFormData, isSaving, isUpdating } = useForm();
  const { t } = useLanguage();

  const [stepData, setStepData] = useState({
    productImages: formData.productImages || [],
    packagingImage: formData.packagingImage || '',
    productionProcessImage: formData.productionProcessImage || '',
    video: formData.video || ''
  });

  const [uploading, setUploading] = useState({});
  const [uploadError, setUploadError] = useState('');

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    for (const file of files) { const err = validateFileSize(file, 'image'); if (err) { setUploadError(err); e.target.value = ''; return; } }
    setUploadError('');
    setUploading(prev => ({ ...prev, productImages: true }));
    try {
      const formDataObj = new FormData();
      files.forEach(file => formDataObj.append('files', file));
      formDataObj.append('folder', 'aggrigo/products');
      const response = await api.post('/upload/multiple', formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data.success) { const urls = response.data.files.map(f => f.url); setStepData(prev => ({ ...prev, productImages: [...prev.productImages, ...urls] })); }
    } catch (error) { console.error('Upload error:', error); alert('Failed to upload images'); }
    finally { setUploading(prev => ({ ...prev, productImages: false })); }
  };

  const handleSingleFileUpload = async (field, file) => {
    if (!file) return;
    const fileType = field === 'video' ? 'video' : 'image';
    const err = validateFileSize(file, fileType);
    if (err) { setUploadError(err); return; }
    setUploadError('');
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file); formDataObj.append('folder', `aggrigo/${field}`);
      const response = await api.post('/upload/single', formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data.success) setStepData(prev => ({ ...prev, [field]: response.data.url }));
    } catch (error) { console.error('Upload error:', error); alert('Failed to upload file'); }
    finally { setUploading(prev => ({ ...prev, [field]: false })); }
  };

  const removeProductImage = (index) => setStepData(prev => ({ ...prev, productImages: prev.productImages.filter((_, i) => i !== index) }));
  const handleSubmit = (e) => { e.preventDefault(); updateFormData(stepData); onNext(stepData); };
  const handleSkip = () => { const empty = { productImages: [], packagingImage: '', productionProcessImage: '', video: '' }; updateFormData(empty); onNext(empty); };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto font-sans text-slate-800">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900">{t('form.step5.title') || "Media & Visuals"}</h3>
        <p className="text-slate-500 mt-2">{t('form.step5.subtitle') || "Showcase your products with high-quality images and video."}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100">
          <span>✨ {t('form.step5.optional')}</span>
          <span className="text-blue-300">|</span>
          <span className="text-xs">{t('form.step5.optionalText')}</span>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
          <div><p className="font-bold text-sm">{t('form.step5.uploadBlocked')}</p><p className="text-xs mt-0.5">{uploadError}</p></div>
          <button type="button" onClick={() => setUploadError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Product Gallery */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm shadow-blue-100/60 border border-blue-100">
        <div className="flex justify-between items-center mb-6 border-b border-blue-50 pb-4">
          <h4 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
            <FaImage className="text-blue-400" />{t('form.step5.productImagesTitle') || "Product Gallery"}
          </h4>
          <span className="text-xs bg-blue-50 text-blue-500 px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-blue-100">
            {stepData.productImages.length} {t('form.step5.uploaded')}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <label className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group relative overflow-hidden">
            {uploading.productImages ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-blue-500 font-bold uppercase tracking-wide">{t('form.step5.uploading')}</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-blue-100 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300"><FaPlus /></div>
                <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{t('form.step5.addImage')}</span>
                <span className="text-[10px] text-blue-300 mt-1 uppercase font-medium">{t('form.step5.jpgPng')}</span>
              </>
            )}
            <input type="file" multiple accept="image/*" onChange={handleMultipleImageUpload} className="hidden" />
          </label>
          {stepData.productImages.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-blue-100 shadow-sm bg-blue-50/20">
              <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button type="button" onClick={() => removeProductImage(index)} className="bg-white text-red-500 p-2.5 rounded-full hover:bg-red-50 transition-colors shadow-lg transform hover:scale-110"><FaTrash size={14} /></button>
              </div>
              <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">#{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Packaging & Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SingleUploadCard title={t('form.step5.packagingImage') || "Packaging"} subtitle={t('form.step5.packagingImageSubtitle') || "Upload an image of your product packaging."} icon={<FaBoxOpen />} image={stepData.packagingImage} loading={uploading.packagingImage} onUpload={(e) => handleSingleFileUpload('packagingImage', e.target.files[0])} t={t} color="amber" />
        <SingleUploadCard title={t('form.step5.productionImage') || "Production Process"} subtitle={t('form.step5.productionImageSubtitle') || "Show how your product is made."} icon={<FaIndustry />} image={stepData.productionProcessImage} loading={uploading.productionProcessImage} onUpload={(e) => handleSingleFileUpload('productionProcessImage', e.target.files[0])} t={t} color="indigo" />
      </div>

      {/* Video */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm shadow-blue-100/60 border border-blue-100">
        <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-6 text-lg">
          <FaVideo className="text-rose-400" />{t('form.step5.videoTitle') || "Promotional Video"}
          <span className="text-xs font-normal text-blue-300 ml-auto hidden sm:inline-block">{t('form.step5.videoNote') || "MP4, WebM (Max 50MB)"}</span>
        </h4>
        {!stepData.video ? (
          <label className="border-2 border-dashed border-blue-200 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
            {uploading.video ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <p className="text-blue-500 font-bold uppercase text-xs tracking-wide">{t('form.step5.uploadingVideo') || "Uploading Video..."}</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaCloudUploadAlt className="text-3xl text-blue-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{t('form.step5.uploadVideo') || "Click to upload video"}</p>
                <p className="text-xs text-blue-300 mt-2">{t('form.step5.dragAndDrop') || "Drag and drop or browse files"}</p>
              </>
            )}
            <input type="file" accept="video/*" onChange={(e) => handleSingleFileUpload('video', e.target.files[0])} className="hidden" />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group shadow-md">
            <video src={stepData.video} controls className="w-full h-full max-h-[400px]" />
            <button type="button" onClick={() => setStepData(prev => ({ ...prev, video: '' }))} className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-105">{t('form.step5.removeVideo') || "Remove Video"}</button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-blue-50">
        <button type="button" onClick={onBack} className="w-full sm:w-auto px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border border-blue-100 hover:bg-blue-50/30 hover:text-slate-800 transition-colors flex items-center justify-center gap-2">
          <FaArrowLeft className="text-sm" /> {t('form.buttons.back') || "Back"}
        </button>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button type="button" onClick={handleSkip} disabled={isSaving} className="px-6 py-3 bg-blue-50 text-blue-500 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
            {t('form.buttons.skipStep') || "Skip Step"}
          </button>
          <button type="submit" disabled={isSaving}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {isSaving ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isUpdating ? t('form.step5.updating') || 'Updating...' : t('form.step5.saving') || 'Saving...'}</>) : (<>{t('form.step5.saveAndReview') || "Save & Review"} <FaArrowRight className="text-sm" /></>)}
          </button>
        </div>
      </div>
    </form>
  );
};

const SingleUploadCard = ({ title, subtitle, icon, image, loading, onUpload, t, color }) => {
  const colors = {
    amber: "text-amber-500 bg-amber-50/50 border-amber-100 hover:border-amber-300 hover:bg-amber-50",
    indigo: "text-indigo-500 bg-indigo-50/50 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50",
  };
  const themeClass = colors[color] || colors.amber;
  const iconClass = color === 'amber' ? 'text-amber-500' : 'text-indigo-500';
  const borderClass = color === 'amber' ? 'border-amber-200' : 'border-indigo-200';
  const spinClass = color === 'amber' ? 'border-t-amber-500 border-amber-200' : 'border-t-indigo-500 border-indigo-200';
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm shadow-blue-100/60 border border-blue-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h4 className="font-bold text-slate-700 flex items-center gap-2 text-base"><span className={`p-1.5 rounded-lg bg-blue-50 ${iconClass}`}>{icon}</span> {title}</h4>
          <p className="text-xs text-blue-300 mt-1 font-medium">{subtitle}</p>
        </div>
        {image && <FaCheckCircle className="text-emerald-400 text-lg" />}
      </div>
      <div className="flex-1">
        {image ? (
          <div className="relative rounded-xl overflow-hidden h-48 w-full group border border-blue-100 shadow-inner bg-blue-50/20">
            <img src={image} alt={title} className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition shadow-lg transform hover:scale-105">
                {t('form.step5.changeImage') || "Change Image"}
                <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className={`h-48 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${themeClass} ${borderClass}`}>
            {loading ? <div className={`w-8 h-8 border-4 rounded-full animate-spin ${spinClass}`}></div> : (
              <>
                <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300"><FaCloudUploadAlt className={`text-3xl opacity-50 ${iconClass}`} /></div>
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">{t('form.step5.uploadImage') || "Upload Image"}</span>
                <span className="text-[10px] text-blue-300 mt-1 font-medium uppercase tracking-wide">{t('form.step5.clickToBrowse') || "Click to browse"}</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};

export default Step5MediaUpload;
