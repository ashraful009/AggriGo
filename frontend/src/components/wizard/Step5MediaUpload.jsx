import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { FaCloudUploadAlt, FaTrash, FaImage, FaBoxOpen, FaIndustry, FaVideo, FaPlus, FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const Step5MediaUpload = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useForm();
  const { t } = useLanguage();

  const [stepData, setStepData] = useState({
    productImages: formData.productImages || [],
    packagingImage: formData.packagingImage || '',
    productionProcessImage: formData.productionProcessImage || '',
    video: formData.video || ''
  });

  const [uploading, setUploading] = useState({});

  // --- Handlers ---

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(prev => ({ ...prev, productImages: true }));
    try {
      const formDataObj = new FormData();
      files.forEach(file => formDataObj.append('files', file));
      formDataObj.append('folder', 'aggrigo/products');

      const response = await api.post('/upload/multiple', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        const urls = response.data.files.map(f => f.url);
        setStepData(prev => ({
          ...prev,
          productImages: [...prev.productImages, ...urls]
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(prev => ({ ...prev, productImages: false }));
    }
  };

  const handleSingleFileUpload = async (field, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('folder', `aggrigo/${field}`);

      const response = await api.post('/upload/single', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setStepData(prev => ({ ...prev, [field]: response.data.url }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const removeProductImage = (index) => {
    setStepData(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(stepData);
    onNext(stepData);
  };

  const handleSkip = () => {
    const emptyMediaData = {
      productImages: [],
      packagingImage: '',
      productionProcessImage: '',
      video: ''
    };
    updateFormData(emptyMediaData);
    onNext(emptyMediaData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto font-sans text-slate-800">

      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900">{t('form.step5.title') || "Media & Visuals"}</h3>
        <p className="text-slate-500 mt-2">{t('form.step5.subtitle') || "Showcase your products with high-quality images and video."}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
          <span>✨ Optional Step</span>
          <span className="text-amber-500">|</span>
          <span className="text-xs">You can add these later from dashboard</span>
        </div>
      </div>

      {/* --- SECTION 1: PRODUCT GALLERY --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h4 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
            <FaImage className="text-blue-500" />
            {t('form.step5.productImagesTitle') || "Product Gallery"}
          </h4>
          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
            {stepData.productImages.length} Uploaded
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Upload Button Card */}
          <label className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all group relative overflow-hidden">
            {uploading.productImages ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wide">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-blue-100 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <FaPlus />
                </div>
                <span className="text-sm font-bold text-blue-700 group-hover:text-blue-800 transition-colors">Add Image</span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-medium">JPG, PNG</span>
              </>
            )}
            <input type="file" multiple accept="image/*" onChange={handleMultipleImageUpload} className="hidden" />
          </label>

          {/* Image Cards */}
          {stepData.productImages.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm bg-slate-50">
              <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={() => removeProductImage(index)}
                  className="bg-white text-red-500 p-2.5 rounded-full hover:bg-red-50 transition-colors shadow-lg transform hover:scale-110"
                  title="Remove Image"
                >
                  <FaTrash size={14} />
                </button>
              </div>

              {/* Badge */}
              <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 2: DETAILS (Split View) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Packaging Upload */}
        <SingleUploadCard
          title={t('form.step5.packagingImage') || "Packaging"}
          subtitle="Upload an image of your product packaging."
          icon={<FaBoxOpen />}
          image={stepData.packagingImage}
          loading={uploading.packagingImage}
          onUpload={(e) => handleSingleFileUpload('packagingImage', e.target.files[0])}
          t={t}
          color="amber"
        />

        {/* Process Upload */}
        <SingleUploadCard
          title={t('form.step5.productionImage') || "Production Process"}
          subtitle="Show how your product is made."
          icon={<FaIndustry />}
          image={stepData.productionProcessImage}
          loading={uploading.productionProcessImage}
          onUpload={(e) => handleSingleFileUpload('productionProcessImage', e.target.files[0])}
          t={t}
          color="indigo"
        />
      </div>

      {/* --- SECTION 3: VIDEO --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-6 text-lg">
          <FaVideo className="text-rose-500" />
          {t('form.step5.videoTitle') || "Promotional Video"}
          <span className="text-xs font-normal text-slate-400 ml-auto hidden sm:inline-block">MP4, WebM (Max 50MB)</span>
        </h4>

        {!stepData.video ? (
          <label className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all group">
            {uploading.video ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-3"></div>
                <p className="text-rose-600 font-bold uppercase text-xs tracking-wide">Uploading Video...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaCloudUploadAlt className="text-3xl text-slate-400 group-hover:text-rose-500 transition-colors" />
                </div>
                <p className="font-bold text-slate-600 group-hover:text-rose-600 transition-colors">{t('form.step5.uploadVideo') || "Click to upload video"}</p>
                <p className="text-xs text-slate-400 mt-2">Drag and drop or browse files</p>
              </>
            )}
            <input type="file" accept="video/*" onChange={(e) => handleSingleFileUpload('video', e.target.files[0])} className="hidden" />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group shadow-md">
            <video src={stepData.video} controls className="w-full h-full max-h-[400px]" />
            <button
              type="button"
              onClick={() => setStepData(prev => ({ ...prev, video: '' }))}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-105"
            >
              Remove Video
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <FaArrowLeft className="text-sm" /> {t('form.buttons.back') || "Back"}
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSkip}
            className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Skip Step
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {t('form.step5.saveAndReview') || "Save & Review"} <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    </form>
  );
};

// --- Helper Component for Single Uploads ---
const SingleUploadCard = ({ title, subtitle, icon, image, loading, onUpload, t, color }) => {
  const colors = {
    amber: "text-amber-500 bg-amber-50 border-amber-100 hover:border-amber-300 hover:bg-amber-50",
    indigo: "text-indigo-500 bg-indigo-50 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50",
  };
  const themeClass = colors[color] || colors.amber;
  const iconClass = color === 'amber' ? 'text-amber-500' : 'text-indigo-500';
  const borderClass = color === 'amber' ? 'border-amber-200' : 'border-indigo-200';
  const spinClass = color === 'amber' ? 'border-t-amber-500 border-amber-200' : 'border-t-indigo-500 border-indigo-200';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h4 className="font-bold text-slate-700 flex items-center gap-2 text-base">
            <span className={`p-1.5 rounded-lg bg-slate-50 ${iconClass}`}>{icon}</span> {title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        </div>
        {image && <FaCheckCircle className="text-emerald-500 text-lg" />}
      </div>

      <div className="flex-1">
        {image ? (
          <div className="relative rounded-xl overflow-hidden h-48 w-full group border border-slate-200 shadow-inner bg-slate-50">
            <img src={image} alt={title} className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition shadow-lg transform hover:scale-105">
                Change Image
                <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className={`h-48 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${themeClass} ${borderClass}`}>
            {loading ? (
              <div className={`w-8 h-8 border-4 rounded-full animate-spin ${spinClass}`}></div>
            ) : (
              <>
                <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  <FaCloudUploadAlt className={`text-3xl opacity-50 ${iconClass}`} />
                </div>
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Upload Image</span>
                <span className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">Click to browse</span>
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