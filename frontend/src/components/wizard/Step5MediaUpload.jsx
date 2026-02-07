import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { FaCloudUploadAlt, FaTrash, FaImage, FaBoxOpen, FaIndustry, FaVideo, FaPlus, FaCheckCircle } from 'react-icons/fa';

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

  // --- Handlers (Same Logic, new UI triggers) ---

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">{t('form.step5.title')}</h3>
        <p className="text-gray-500">{t('form.step5.subtitle')}</p>
      </div>

      {/* --- SECTION 1: PRODUCT GALLERY --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-700 flex items-center gap-2">
            <FaImage className="text-emerald-500" /> {t('form.step5.productImagesTitle')} <span className="text-xs font-normal text-gray-400">{t('form.step5.productImagesNote')}</span>
          </h4>
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-medium">
            {stepData.productImages.length} {t('form.step5.imagesAdded')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Upload Button Card */}
          <label className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-emerald-50 transition-colors group relative overflow-hidden">
            {uploading.productImages ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-emerald-600 font-medium">{t('form.step5.uploading')}</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-500 mb-2 group-hover:scale-110 transition-transform">
                  <FaPlus />
                </div>
                  <span className="text-sm font-bold text-emerald-700">{t('form.step5.addImages')}</span>
                <span className="text-xs text-emerald-600/70">JPG, PNG</span>
              </>
            )}
            <input type="file" multiple accept="image/*" onChange={handleMultipleImageUpload} className="hidden" />
          </label>

          {/* Image Cards */}
          {stepData.productImages.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 shadow-sm bg-gray-100">
              <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeProductImage(index)}
                  className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg transform hover:scale-110"
                >
                  <FaTrash size={14} />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                {t('common.image')} {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 2: DETAILS (Split View) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Packaging Upload */}
        <SingleUploadCard
          title={t('form.step5.packagingImage')}
          subtitle={t('form.step5.packagingSubtitle')}
          icon={<FaBoxOpen />}
          image={stepData.packagingImage}
          loading={uploading.packagingImage}
          onUpload={(e) => handleSingleFileUpload('packagingImage', e.target.files[0])}
          t={t}
        />

        {/* Process Upload */}
        <SingleUploadCard
          title={t('form.step5.productionImage')}
          subtitle={t('form.step5.productionSubtitle')}
          icon={<FaIndustry />}
          image={stepData.productionProcessImage}
          loading={uploading.productionProcessImage}
          onUpload={(e) => handleSingleFileUpload('productionProcessImage', e.target.files[0])}
          t={t}
        />
      </div>

      {/* --- SECTION 3: VIDEO --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
          <FaVideo className="text-emerald-500" /> {t('form.step5.videoTitle')} <span className="text-xs font-normal text-gray-400">{t('form.step5.videoNote')}</span>
        </h4>

        {!stepData.video ? (
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-gray-50 transition-all">
            {uploading.video ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
                <p className="text-emerald-600 font-medium">{t('form.step5.uploadingVideo')}</p>
              </div>
            ) : (
              <>
                <FaCloudUploadAlt className="text-4xl text-gray-300 mb-3" />
                  <p className="font-medium text-gray-600">{t('form.step5.uploadVideo')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('form.step5.videoFormats')}</p>
              </>
            )}
            <input type="file" accept="video/*" onChange={(e) => handleSingleFileUpload('video', e.target.files[0])} className="hidden" />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center group">
            <video src={stepData.video} controls className="w-full h-full max-h-[400px]" />
            <button
              type="button"
              onClick={() => setStepData(prev => ({ ...prev, video: '' }))}
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {t('form.step5.removeVideo')}
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition shadow-sm">
          {t('form.buttons.back')}
        </button>
        <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition transform hover:-translate-y-1">
          {t('form.step5.saveAndReview')}
        </button>
      </div>
    </form>
  );
};

// --- Helper Component for Single Uploads ---
const SingleUploadCard = ({ title, subtitle, icon, image, loading, onUpload, t }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-gray-700 flex items-center gap-2">
            <span className="text-emerald-500">{icon}</span> {title}
          </h4>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        {image && <FaCheckCircle className="text-lime-500 text-xl" />}
      </div>

      <div className="flex-1">
        {image ? (
          <div className="relative rounded-lg overflow-hidden h-40 w-full group border border-gray-200">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition">
                {t('common.change')}
                <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className="h-40 w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-gray-50 transition-all">
            {loading ? (
              <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            ) : (
              <>
                <FaCloudUploadAlt className="text-2xl text-gray-300 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">{t('form.step5.uploadImage')}</span>
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