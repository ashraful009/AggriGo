import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  FaBullseye,
  FaChartLine,
  FaLightbulb,
  FaGlobeAmericas,
  FaBullhorn,
  FaBoxOpen,
  FaCheckDouble,
  FaHandHoldingUsd,
  FaShip,
  FaChalkboardTeacher,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa';

const Step4FuturePlans = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useForm();
  const { t } = useLanguage();

  const [stepData, setStepData] = useState({
    futureGoals: formData.futureGoals || '',
    productionIncreasePlan: formData.productionIncreasePlan || '',
    newProductsPlan: formData.newProductsPlan || '',
    interestInOnlineExport: formData.interestInOnlineExport || 'No',
    supportNeeds: formData.supportNeeds || {
      marketing: false,
      packaging: false,
      quality: false,
      financing: false,
      exportSupport: false,
      training: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStepData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSupportToggle = (key) => {
    setStepData(prev => ({
      ...prev,
      supportNeeds: {
        ...prev.supportNeeds,
        [key]: !prev.supportNeeds[key]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(stepData);
    onNext(stepData);
  };

  // Configuration for Support Cards
  const supportOptions = [
    { key: 'marketing', label: t('form.step4.marketing') || "Marketing", icon: <FaBullhorn />, desc: t('form.step4.marketingDesc') || "Promotion & Ads" },
    { key: 'packaging', label: t('form.step4.packaging') || "Packaging", icon: <FaBoxOpen />, desc: t('form.step4.packagingDesc') || "Design & Materials" },
    { key: 'quality', label: t('form.step4.quality') || "Quality Control", icon: <FaCheckDouble />, desc: t('form.step4.qualityDesc') || "Standards & Testing" },
    { key: 'financing', label: t('form.step4.financing') || "Financing", icon: <FaHandHoldingUsd />, desc: t('form.step4.financingDesc') || "Loans & Grants" },
    { key: 'exportSupport', label: t('form.step4.exportSupport') || "Export Help", icon: <FaShip />, desc: t('form.step4.exportSupportDesc') || "Logistics & Customs" },
    { key: 'training', label: t('form.step4.training') || "Training", icon: <FaChalkboardTeacher />, desc: t('form.step4.trainingDesc') || "Skill Development" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto font-sans text-slate-800">

      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900">{t('form.step4.title') || "Future Plans & Support"}</h3>
        <p className="text-slate-500 mt-2">{t('form.step4.subtitle') || "Share your vision and tell us how we can help you grow."}</p>
      </div>

      {/* --- SECTION 1: VISION (Text Inputs) --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">

        {/* Goals */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
            <span className="p-1.5 rounded-md bg-rose-50 text-rose-500"><FaBullseye /></span>
            {t('form.step4.futureGoals') || "Business Goals"}
          </label>
          <textarea
            name="futureGoals"
            value={stepData.futureGoals}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-slate-50 focus:bg-white text-slate-700 placeholder-slate-400"
            rows="3"
            placeholder={t('form.step4.placeholders.goals') || "Describe your long-term vision..."}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Plan */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
              <span className="p-1.5 rounded-md bg-blue-50 text-blue-500"><FaChartLine /></span>
              {t('form.step4.productionIncrease') || "Expansion Plans"}
            </label>
            <textarea
              name="productionIncreasePlan"
              value={stepData.productionIncreasePlan}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-slate-50 focus:bg-white text-slate-700 placeholder-slate-400"
              rows="3"
              placeholder={t('form.step4.placeholders.production') || "How do you plan to increase capacity?"}
            />
          </div>

          {/* New Products */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
              <span className="p-1.5 rounded-md bg-amber-50 text-amber-500"><FaLightbulb /></span>
              {t('form.step4.newProducts') || "Innovation Ideas"}
            </label>
            <textarea
              name="newProductsPlan"
              value={stepData.newProductsPlan}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-slate-50 focus:bg-white text-slate-700 placeholder-slate-400"
              rows="3"
              placeholder={t('form.step4.placeholders.newProducts') || "Any new product lines in mind?"}
            />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: EXPORT INTEREST (Big Toggle) --- */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
          <FaGlobeAmericas className="text-indigo-600" />
          {t('form.step4.interestOnlineExport') || "Are you interested in Exporting Online?"}
        </h4>

        <div className="flex flex-wrap gap-4">
          {[t('form.step3.yes') || "Yes", t('form.step3.no') || "No"].map((option, index) => {
            const val = index === 0 ? 'Yes' : 'No';
            const isSelected = stepData.interestInOnlineExport === val;

            return (
              <label key={option} className={`
                  relative flex-1 min-w-[140px] flex items-center justify-center py-4 px-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                  ${isSelected
                  ? 'border-indigo-500 bg-white shadow-md text-indigo-700 transform scale-[1.02]'
                  : 'border-white bg-white/60 text-slate-500 hover:bg-white hover:border-indigo-200'}
                `}>
                <input
                  type="radio"
                  name="interestInOnlineExport"
                  value={val}
                  checked={isSelected}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="font-bold text-lg">{option}</span>
                {isSelected && (
                  <div className="absolute top-3 right-3 text-indigo-500">
                    <FaCheckCircle />
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 3: SUPPORT NEEDS (Grid Selection) --- */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <h4 className="font-bold text-slate-800 text-lg">{t('form.step4.supportTitle') || "Support Required"}</h4>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">{t('form.step4.supportNote') || "Select all that apply"}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {supportOptions.map((item) => {
            const isSelected = stepData.supportNeeds[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleSupportToggle(item.key)}
                className={`
                  relative cursor-pointer p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 select-none group
                  ${isSelected
                    ? 'border-amber-400 bg-amber-50 shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}
                `}
              >
                <div className={`
                   w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors
                   ${isSelected ? 'bg-amber-400 text-amber-900' : 'bg-slate-50 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50'}
                `}>
                  {item.icon}
                </div>
                <div>
                  <h5 className={`font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</h5>
                  <p className={`text-xs mt-1 leading-snug ${isSelected ? 'text-amber-800/70' : 'text-slate-400'}`}>{item.desc}</p>
                </div>

                {/* Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 text-amber-600 animate-in fade-in zoom-in duration-300">
                    <FaCheckCircle />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <FaArrowLeft className="text-sm" /> {t('form.buttons.back') || "Back"}
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {t('form.buttons.next') || "Next Step"} <FaArrowRight className="text-sm" />
        </button>
      </div>
    </form>
  );
};

export default Step4FuturePlans;