import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  FaTag,
  FaAlignLeft,
  FaIndustry,
  FaHome,
  FaGlobe,
  FaHandRock,
  FaCogs,
  FaRobot,
  FaMoneyBillWave,
  FaBox,
  FaUsers,
  FaMale,
  FaFemale,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

const Step2ProductDetails = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useForm();
  const { t } = useLanguage();

  const [stepData, setStepData] = useState({
    productName: formData.productName || '',
    shortDescription: formData.shortDescription || '',
    rawMaterialSource: formData.rawMaterialSource || 'Local',
    productionType: formData.productionType || 'Handmade',
    productionPlace: formData.productionPlace || 'Home-based',
    costPerUnit: formData.costPerUnit || '',
    wholesalePrice: formData.wholesalePrice || '',
    retailPrice: formData.retailPrice || '',
    moq: formData.moq || '',
    bulkDiscount: formData.bulkDiscount || 'No',
    productionCapacity: formData.productionCapacity || '',
    machineryUsed: formData.machineryUsed || '',
    maleWorkers: formData.maleWorkers || '',
    femaleWorkers: formData.femaleWorkers || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStepData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelection = (name, value) => {
    setStepData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(stepData);
    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">{t('form.step2.title')}</h3>
        <p className="text-gray-500">{t('form.step2.subtitle')}</p>
      </div>

      {/* --- SECTION 1: BASIC IDENTITY --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 gap-6">

        {/* Product Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <FaTag className="text-emerald-500" /> {t('form.step2.productName')} *
          </label>
          <input
            type="text"
            name="productName"
            value={stepData.productName}
            onChange={handleChange}
            placeholder={t('form.step2.productNamePlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <FaAlignLeft className="text-blue-500" /> {t('form.step2.shortDescription')} *
          </label>
          <textarea
            name="shortDescription"
            value={stepData.shortDescription}
            onChange={handleChange}
            placeholder={t('form.step2.descriptionPlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
            rows="3"
            required
          />
        </div>
      </div>

      {/* --- SECTION 2: PRODUCTION CONFIG (Visual Cards) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Production Type */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaCogs className="text-orange-500" /> {t('form.step2.productionType')}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'হস্তশিল্প', value: 'Handmade', icon: <FaHandRock /> },
              { label: 'আধা-অটো', value: 'Semi-automatic', icon: <FaCogs /> },
              { label: 'অটোমেটিক', value: 'Automatic', icon: <FaRobot /> }
            ].map((item) => (
              <div
                key={item.value}
                onClick={() => handleSelection('productionType', item.value)}
                className={`cursor-pointer p-3 rounded-xl border transition-all flex flex-col items-center justify-center text-center gap-2
                    ${stepData.productionType === item.value
                    ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm'
                    : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white'}
                  `}
              >
                <div className="text-xl">{item.icon}</div>
                <span className="text-xs font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Source & Place (Split) */}
        <div className="flex flex-col gap-6">

          {/* Raw Material Source */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <label className="text-sm font-bold text-gray-700 mb-3 block">{t('form.step2.rawMaterialSource')}</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {[
                { label: 'স্থানীয় (Local)', value: 'Local', icon: <FaHome /> },
                { label: 'আমদানিকৃত (Imported)', value: 'Imported', icon: <FaGlobe /> }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleSelection('rawMaterialSource', opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all
                       ${stepData.rawMaterialSource === opt.value ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}
                     `}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Production Place */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <label className="text-sm font-bold text-gray-700 mb-3 block">{t('form.step2.productionPlace')}</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {[
                { label: 'বাড়ি (Home)', value: 'Home-based', icon: <FaHome /> },
                { label: 'কারখানা (Factory)', value: 'Factory-based', icon: <FaIndustry /> }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleSelection('productionPlace', opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all
                       ${stepData.productionPlace === opt.value ? 'bg-white shadow text-blue-600' : 'text-gray-500'}
                     `}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: PRICING TABLE --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
          <FaMoneyBillWave className="text-emerald-500" /> {t('form.step2.pricingTitle')}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingInput
            label="প্রতি ইউনিট খরচ"
            name="costPerUnit"
            value={stepData.costPerUnit}
            onChange={handleChange}
            color="gray"
          />
          <PricingInput
            label="পাইকারি মূল্য"
            name="wholesalePrice"
            value={stepData.wholesalePrice}
            onChange={handleChange}
            color="blue"
          />
          <PricingInput
            label="খুচরা মূল্য"
            name="retailPrice"
            value={stepData.retailPrice}
            onChange={handleChange}
            color="emerald"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">{t('form.step2.moq')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaBox />
              </div>
              <input
                type="number"
                name="moq"
                value={stepData.moq}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                placeholder="Example: 50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">{t('form.step2.bulkDiscount')}</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(val => (
                <label key={val} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="bulkDiscount"
                    value={val}
                    checked={stepData.bulkDiscount === val}
                    onChange={handleChange}
                    className="mr-2 accent-emerald-600 w-5 h-5"
                  />
                  <span className="font-medium text-gray-600">{val === 'Yes' ? 'হ্যাঁ' : 'না'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: CAPACITY & WORKFORCE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Capacity & Machinery */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaIndustry className="text-purple-500" /> {t('form.step2.capacityMachinery')}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">{t('form.step2.productionCapacity')}</label>
              <input
                type="text"
                name="productionCapacity"
                value={stepData.productionCapacity}
                onChange={handleChange}
                placeholder={t('form.step2.capacityPlaceholder')}
                className="w-full mt-1 px-3 py-2 border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent transition-colors font-semibold text-gray-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">{t('form.step2.machineryUsed')}</label>
              <textarea
                name="machineryUsed"
                value={stepData.machineryUsed}
                onChange={handleChange}
                placeholder={t('form.step2.machineryPlaceholder')}
                rows="2"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:border-purple-500 outline-none bg-gray-50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Workforce */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaUsers className="text-teal-500" /> {t('form.step2.workforce')}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
              <FaMale className="text-3xl text-blue-500 mx-auto mb-2" />
              <label className="text-xs font-bold text-blue-700 uppercase block mb-1">{t('form.step2.maleWorkers')}</label>
              <input
                type="number"
                name="maleWorkers"
                value={stepData.maleWorkers}
                onChange={handleChange}
                className="w-20 mx-auto text-center font-bold text-xl bg-white rounded-lg py-1 border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 text-center">
              <FaFemale className="text-3xl text-pink-500 mx-auto mb-2" />
              <label className="text-xs font-bold text-pink-700 uppercase block mb-1">{t('form.step2.femaleWorkers')}</label>
              <input
                type="number"
                name="femaleWorkers"
                value={stepData.femaleWorkers}
                onChange={handleChange}
                className="w-20 mx-auto text-center font-bold text-xl bg-white rounded-lg py-1 border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button type="button" onClick={onBack} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
          <FaArrowLeft /> {t('form.buttons.back')}
        </button>
        <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition transform hover:-translate-y-1 flex items-center gap-2">
          {t('form.buttons.next')} <FaArrowRight />
        </button>
      </div>
    </form>
  );
};

// Helper for Pricing Inputs
const PricingInput = ({ label, name, value, onChange, color }) => {
  const colors = {
    gray: 'border-gray-200 focus:ring-gray-400 text-gray-600',
    blue: 'border-blue-200 focus:ring-blue-400 text-blue-600',
    emerald: 'border-emerald-200 focus:ring-emerald-400 text-emerald-600'
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-8 pr-4 py-3 rounded-lg border-2 outline-none font-bold text-lg transition-all ${colors[color]}`}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

export default Step2ProductDetails;