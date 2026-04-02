import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaTag, FaAlignLeft, FaIndustry, FaHome, FaGlobe, FaHandRock, FaCogs, FaRobot, FaMoneyBillWave, FaBox, FaUsers, FaMale, FaFemale, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';

const FieldError = ({ msg }) => msg ? <p className="mt-1 text-xs text-red-500 font-medium">{msg}</p> : null;

const cardCls = "bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm shadow-blue-100/60 border border-blue-100";

const Step2ProductDetails = ({ onNext, onBack }) => {
  const { formData, updateFormData, validateStep, isSaving, isUpdating } = useForm();
  const { t } = useLanguage();

  const [stepData, setStepData] = useState({
    productName: formData.productName || '',
    shortDescription: formData.shortDescription || '',
    rawMaterialSource: formData.rawMaterialSource || 'Local',
    productionType: formData.productionType || 'Handmade',
    productionPlace: formData.productionPlace || 'Home-based',
    wholesalePrice: formData.wholesalePrice || '',
    moq: formData.moq || '',
    bulkDiscount: formData.bulkDiscount || 'No',
    productionCapacity: formData.productionCapacity || '',
    maleWorkers: formData.maleWorkers || '',
    femaleWorkers: formData.femaleWorkers || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => { const { name, value } = e.target; setStepData(prev => ({ ...prev, [name]: value })); };
  const handleSelection = (name, value) => setStepData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { success, errors: validationErrors } = validateStep(2, stepData);
    if (!success) { setErrors(validationErrors); return; }
    setErrors({});
    updateFormData(stepData);
    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto font-sans text-slate-800">

      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900">{t('form.step2.title') || "Product Details"}</h3>
        <p className="text-slate-500 mt-2">{t('form.step2.subtitle') || "Describe your product, production process, and pricing."}</p>
      </div>

      {/* Basic Identity */}
      <div className={cardCls}>
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-blue-50 pb-3">
          <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FaTag /></span>
          {t('form.step2.basicInfo') || "Basic Identity"}
        </h4>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
              {t('form.step2.productName') || "Product Name"} <span className="text-red-500">*</span>
            </label>
            <input type="text" name="productName" value={stepData.productName} onChange={handleChange}
              placeholder={t('form.step2.productNamePlaceholder') || "e.g. Organic Honey"}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white placeholder-slate-400 ${errors.productName ? 'border-red-400' : 'border-blue-100'}`} />
            <FieldError msg={errors.productName} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
              <FaAlignLeft className="text-blue-300" /> {t('form.step2.shortDescription') || "Short Description"} <span className="text-red-500">*</span>
            </label>
            <textarea name="shortDescription" value={stepData.shortDescription} onChange={handleChange}
              placeholder={t('form.step2.descriptionPlaceholder') || "Briefly describe your product features..."}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none bg-white placeholder-slate-400 ${errors.shortDescription ? 'border-red-400' : 'border-blue-100'}`}
              rows="3" />
            <FieldError msg={errors.shortDescription} />
          </div>
        </div>
      </div>

      {/* Production Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Type */}
        <div className={cardCls + " flex flex-col h-full"}>
          <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
            <FaCogs className="text-amber-500" /> {t('form.step2.productionType') || "Production Type"}
          </h4>
          <div className="grid grid-cols-3 gap-3 flex-1">
            {[
              { label: t('form.step2.productionTypeOptions.handmade') || "Handmade", value: 'Handmade', icon: <FaHandRock /> },
              { label: t('form.step2.productionTypeOptions.semiAutomatic') || "Semi-Auto", value: 'Semi-automatic', icon: <FaCogs /> },
              { label: t('form.step2.productionTypeOptions.automatic') || "Automatic", value: 'Automatic', icon: <FaRobot /> }
            ].map((item) => (
              <div key={item.value} onClick={() => handleSelection('productionType', item.value)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-3 relative
                  ${stepData.productionType === item.value ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-md shadow-amber-100/60 transform scale-105' : 'bg-white border-blue-100 text-slate-400 hover:border-blue-200 hover:bg-blue-50/20'}`}>
                <div className="text-2xl">{item.icon}</div>
                <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                {stepData.productionType === item.value && <div className="absolute top-2 right-2 text-amber-500 text-xs"><FaCheck /></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Source & Place */}
        <div className="flex flex-col gap-6">
          <div className={cardCls + " flex-1"}>
            <label className="text-sm font-bold text-slate-600 mb-4 block">{t('form.step2.rawMaterialSource') || "Raw Material Source"}</label>
            <div className="flex bg-blue-50/30 p-1.5 rounded-xl border border-blue-100">
              {[{ label: t('form.step2.rawMaterialSourceOptions.local') || "Local", value: 'Local', icon: <FaHome /> }, { label: t('form.step2.rawMaterialSourceOptions.imported') || "Imported", value: 'Imported', icon: <FaGlobe /> }].map(opt => (
                <button type="button" key={opt.value} onClick={() => handleSelection('rawMaterialSource', opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${stepData.rawMaterialSource === opt.value ? 'bg-white shadow text-blue-600 border border-blue-100' : 'text-slate-500 hover:text-slate-700'}`}>
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className={cardCls + " flex-1"}>
            <label className="text-sm font-bold text-slate-600 mb-4 block">{t('form.step2.productionPlace') || "Production Place"}</label>
            <div className="flex bg-blue-50/30 p-1.5 rounded-xl border border-blue-100">
              {[{ label: t('form.step2.productionPlaceOptions.home') || "Home", value: 'Home-based', icon: <FaHome /> }, { label: t('form.step2.productionPlaceOptions.factory') || "Factory", value: 'Factory-based', icon: <FaIndustry /> }].map(opt => (
                <button type="button" key={opt.value} onClick={() => handleSelection('productionPlace', opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${stepData.productionPlace === opt.value ? 'bg-white shadow text-indigo-600 border border-blue-100' : 'text-slate-500 hover:text-slate-700'}`}>
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className={cardCls}>
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
          <FaMoneyBillWave className="text-emerald-500" /> {t('form.step2.pricingTitle') || "Pricing Strategy"}
        </h4>
        <div className="grid grid-cols-1 gap-6">
          <PricingInput label={t('form.step2.wholesalePrice') || "Wholesale Price"} name="wholesalePrice" value={stepData.wholesalePrice} onChange={handleChange} error={errors.wholesalePrice} color="blue" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-blue-50">
          <div>
            <label className="text-sm font-bold text-slate-600 mb-2 block">{t('form.step2.moq') || "Minimum Order Quantity (MOQ)"}</label>
            <input type="number" name="moq" value={stepData.moq} onChange={handleChange}
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white placeholder-slate-400"
              placeholder="e.g. 50 Units" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 mb-3 block">{t('form.step2.bulkDiscount') || "Do you offer Bulk Discount?"}</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(val => (
                <label key={val} className={`flex items-center cursor-pointer px-4 py-3 rounded-xl border transition-all flex-1 justify-center ${stepData.bulkDiscount === val ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold' : 'bg-white border-blue-100 text-slate-500 hover:bg-blue-50/30'}`}>
                  <input type="radio" name="bulkDiscount" value={val} checked={stepData.bulkDiscount === val} onChange={handleChange} className="hidden" />
                  {val === 'Yes' ? t('form.step3.yes') || 'Yes' : t('form.step3.no') || 'No'}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Capacity & Workforce */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardCls + " flex flex-col h-full"}>
          <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
            <FaIndustry className="text-indigo-500" /> {t('form.step2.productionCapacity') || "Production Capacity"}
          </h4>
          <div className="space-y-5 flex-1">
            <div>
              <label className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1 block">{t('form.step2.productionCapacity') || "Monthly Capacity"}</label>
              <input type="text" name="productionCapacity" value={stepData.productionCapacity} onChange={handleChange}
                placeholder={t('form.step2.capacityPlaceholder') || "e.g. 5000 Units"}
                className="w-full px-4 py-3 border border-blue-100 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-colors font-semibold text-slate-700" />
            </div>
          </div>
        </div>

        <div className={cardCls + " h-full"}>
          <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
            <FaUsers className="text-teal-500" /> {t('form.step2.workforce') || "Workforce"}
          </h4>
          <div className="grid grid-cols-2 gap-5 h-full items-start">
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-center flex flex-col justify-center h-40 group hover:border-blue-300 transition-colors">
              <FaMale className="text-4xl text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <label className="text-xs font-bold text-blue-600 uppercase block mb-2">{t('form.step2.maleWorkers') || "Male"}</label>
              <input type="number" name="maleWorkers" value={stepData.maleWorkers} onChange={handleChange}
                className="w-24 mx-auto text-center font-bold text-2xl bg-white rounded-lg py-1 border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm" placeholder="0" />
            </div>
            <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 text-center flex flex-col justify-center h-40 group hover:border-rose-300 transition-colors">
              <FaFemale className="text-4xl text-rose-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <label className="text-xs font-bold text-rose-600 uppercase block mb-2">{t('form.step2.femaleWorkers') || "Female"}</label>
              <input type="number" name="femaleWorkers" value={stepData.femaleWorkers} onChange={handleChange}
                className="w-24 mx-auto text-center font-bold text-2xl bg-white rounded-lg py-1 border border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none shadow-sm" placeholder="0" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-blue-50">
        <button type="button" onClick={onBack} disabled={isSaving}
          className="w-full sm:w-auto px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border border-blue-100 hover:bg-blue-50/30 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <FaArrowLeft className="text-sm" /> {t('form.buttons.back') || "Back"}
        </button>
        <button type="submit" disabled={isSaving}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          {isSaving ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isUpdating ? 'Updating...' : 'Saving...'}</>) : (<>{t('form.buttons.next') || "Next Step"} <FaArrowRight className="text-sm" /></>)}
        </button>
      </div>
    </form>
  );
};

const PricingInput = ({ label, name, value, onChange, color }) => {
  const styles = {
    slate: { border: 'border-slate-200', ring: 'focus:ring-slate-400', bg: 'bg-slate-50' },
    blue: { border: 'border-blue-200', ring: 'focus:ring-blue-400', bg: 'bg-blue-50/30' },
    amber: { border: 'border-amber-200', ring: 'focus:ring-amber-400', bg: 'bg-amber-50' }
  };
  const theme = styles[color] || styles.slate;
  return (
    <div className="flex flex-col group">
      <label className="text-xs font-bold text-blue-400 uppercase mb-2 tracking-wide">{label}</label>
      <div className="relative">
        <input type="number" name={name} value={value} onChange={onChange}
          className={`w-full pl-4 pr-4 py-3 rounded-xl border-2 outline-none font-bold text-xl transition-all ${theme.border} ${theme.ring} focus:bg-white ${theme.bg} text-slate-700 placeholder-slate-300`}
          placeholder="0.00" />
      </div>
    </div>
  );
};

export default Step2ProductDetails;
