import { useState } from 'react';
import { useForm } from '../../context/FormContext';
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
  FaArrowLeft
} from 'react-icons/fa';

const Step4FuturePlans = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useForm();

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
    { key: 'marketing', label: 'Marketing & Branding', icon: <FaBullhorn />, desc: 'Help reaching new customers' },
    { key: 'packaging', label: 'Better Packaging', icon: <FaBoxOpen />, desc: 'Materials & design support' },
    { key: 'quality', label: 'Quality Control', icon: <FaCheckDouble />, desc: 'Standards certification' },
    { key: 'financing', label: 'Financial Aid', icon: <FaHandHoldingUsd />, desc: 'Loans or grants' },
    { key: 'exportSupport', label: 'Export Logistics', icon: <FaShip />, desc: 'Shipping & customs help' },
    { key: 'training', label: 'Skill Training', icon: <FaChalkboardTeacher />, desc: 'Workshops for staff' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Future Growth</h3>
        <p className="text-gray-500">Tell us where you want to take your business next.</p>
      </div>

      {/* --- SECTION 1: VISION (Text Inputs) --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">

        {/* Goals */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <FaBullseye className="text-emerald-500" /> Goal for Next 1-3 Years
          </label>
          <textarea
            name="futureGoals"
            value={stepData.futureGoals}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
            rows="3"
            placeholder="e.g., Expand to 3 new districts and increase production by 50%..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Plan */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <FaChartLine className="text-blue-500" /> Scaling Plan
            </label>
            <textarea
              name="productionIncreasePlan"
              value={stepData.productionIncreasePlan}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
              rows="3"
              placeholder="How will you increase capacity?"
            />
          </div>

          {/* New Products */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <FaLightbulb className="text-yellow-500" /> New Product Ideas
            </label>
            <textarea
              name="newProductsPlan"
              value={stepData.newProductsPlan}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
              rows="3"
              placeholder="Any new items you want to launch?"
            />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: EXPORT INTEREST (Big Toggle) --- */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaGlobeAmericas className="text-emerald-600" /> Are you interested in Online Export?
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {['Yes', 'No'].map(option => (
            <label key={option} className={`
                  relative flex items-center justify-center py-4 px-6 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${stepData.interestInOnlineExport === option
                ? 'border-emerald-500 bg-white shadow-md text-emerald-700'
                : 'border-transparent bg-white/50 text-gray-500 hover:bg-white'}
               `}>
              <input
                type="radio"
                name="interestInOnlineExport"
                value={option}
                checked={stepData.interestInOnlineExport === option}
                onChange={handleChange}
                className="hidden"
              />
              <span className="font-bold text-lg">{option}</span>
              {stepData.interestInOnlineExport === option && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: SUPPORT NEEDS (Grid Selection) --- */}
      <div>
        <h4 className="font-bold text-gray-800 mb-4 px-1">How can AggriGo support you? <span className="text-gray-400 font-normal text-sm">(Select all that apply)</span></h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportOptions.map((item) => {
            const isSelected = stepData.supportNeeds[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleSupportToggle(item.key)}
                className={`
                  relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 select-none
                  ${isSelected
                    ? 'border-lime-400 bg-lime-50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'}
                `}
              >
                <div className={`
                   w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-colors
                   ${isSelected ? 'bg-lime-400 text-emerald-900' : 'bg-gray-100 text-gray-400'}
                `}>
                  {item.icon}
                </div>
                <div>
                  <h5 className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{item.label}</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>

                {/* Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 text-lime-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button type="button" onClick={onBack} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
          <FaArrowLeft /> Back
        </button>
        <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition transform hover:-translate-y-1 flex items-center gap-2">
          Next Step <FaArrowRight />
        </button>
      </div>
    </form>
  );
};

export default Step4FuturePlans;