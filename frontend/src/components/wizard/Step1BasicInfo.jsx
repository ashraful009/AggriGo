import { useState, useEffect } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import bangladeshLocations from '../../data/bangladesh-locations.json';
import { FaBoxOpen, FaUserTie, FaPhoneAlt, FaMapMarkerAlt, FaArrowRight, FaBuilding } from 'react-icons/fa';

const Step1BasicInfo = ({ onNext }) => {
  const { formData, updateFormData } = useForm();
  const { t } = useLanguage();

  const [stepData, setStepData] = useState({
    productType: formData.productType || '',
    category: formData.category || '',
    brandName: formData.brandName || '',
    registeredName: formData.registeredName || '',
    ownerName: formData.ownerName || '',
    gender: formData.gender || '',
    ownerAge: formData.ownerAge || '',
    ownershipType: formData.ownershipType || '',
    partnerName: formData.partnerName || '',
    mobileNumber: formData.mobileNumber || '',
    whatsappSameAsMobile: formData.whatsappSameAsMobile || false,
    whatsappNumber: formData.whatsappNumber || '',
    email: formData.email || '',
    division: formData.division || '',
    district: formData.district || '',
    thana: formData.thana || '',
    postOffice: formData.postOffice || '',
    postCode: formData.postCode || '',
    detailedAddress: formData.detailedAddress || ''
  });

  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  useEffect(() => {
    if (stepData.division) {
      const selectedDivision = bangladeshLocations.find(d => d.division === stepData.division);
      setDistricts(selectedDivision?.districts || []);
    } else {
      setDistricts([]);
      setThanas([]);
    }
  }, [stepData.division]);

  useEffect(() => {
    if (stepData.district && districts.length > 0) {
      const selectedDistrict = districts.find(d => d.name === stepData.district);
      setThanas(selectedDistrict?.thanas || []);
    } else {
      setThanas([]);
    }
  }, [stepData.district, districts]);

  useEffect(() => {
    if (stepData.whatsappSameAsMobile) {
      setStepData(prev => ({
        ...prev,
        whatsappNumber: prev.mobileNumber
      }));
    }
  }, [stepData.whatsappSameAsMobile, stepData.mobileNumber]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStepData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(stepData);
    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto font-sans text-slate-800">

      {/* Header */}
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {t('form.step1.title') || "Basic Information"}
        </h3>
        <p className="text-slate-500 max-w-xl mx-auto">
          {t('form.step1.subtitle') || "Let's start with the basics of your business and personal details."}
        </p>
      </div>

      {/* Product Info Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-slate-100 pb-3">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaBoxOpen /></span>
          {t('form.step1.productInfo') || "Product Information"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.productType') || "Product Type"}</label>
            <input
              name="productType"
              value={stepData.productType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
              placeholder="e.g. Agricultural"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.category') || "Category"}</label>
            <input
              name="category"
              value={stepData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
              placeholder="e.g. Organic"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.brandName') || "Brand Name"} <span className="text-red-500">*</span></label>
            <input
              name="brandName"
              value={stepData.brandName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
              placeholder="e.g. Green Harvest"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.registeredName') || "Registered Name"} <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
            <input
              name="registeredName"
              value={stepData.registeredName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
              placeholder="Official Business Name"
            />
          </div>
        </div>
      </div>

      {/* Owner Info Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-slate-100 pb-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FaUserTie /></span>
          {t('form.step1.ownerInfo') || "Owner Details"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.ownerName') || "Owner Name"} <span className="text-red-500">*</span></label>
            <input
              name="ownerName"
              value={stepData.ownerName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.ownerAge') || "Age"} <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="ownerAge"
              value={stepData.ownerAge}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-3">{t('form.step1.gender') || "Gender"} <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {['Male', 'Female', 'Other'].map(g => (
                <label key={g} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${stepData.gender === g ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <input type="radio" name="gender" value={g} checked={stepData.gender === g} onChange={handleChange} className="hidden" />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-3">{t('form.step1.ownershipType') || "Ownership"} <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-3">
              {['Single', 'Partnership', 'Ltd. Company'].map(type => (
                <label key={type} className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition-all text-sm ${stepData.ownershipType === type ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <input type="radio" name="ownershipType" value={type} checked={stepData.ownershipType === type} onChange={handleChange} className="hidden" />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {stepData.ownershipType === 'Partnership' && (
            <div className="md:col-span-2 animate-fade-in">
              <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.partnerName') || "Partner Name"} <span className="text-red-500">*</span></label>
              <input
                name="partnerName"
                value={stepData.partnerName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
                required
              />
            </div>
          )}
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-slate-100 pb-3">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FaPhoneAlt /></span>
          {t('form.step1.contactInfo') || "Contact Information"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.mobileNumber') || "Mobile Number"} <span className="text-red-500">*</span></label>
            <div className="flex">
              <span className="px-4 flex items-center bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl text-slate-500 font-bold">+880</span>
              <input
                name="mobileNumber"
                value={stepData.mobileNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.email') || "Email Address"} <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={stepData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors w-full md:w-auto inline-flex">
              <input
                type="checkbox"
                name="whatsappSameAsMobile"
                checked={stepData.whatsappSameAsMobile}
                onChange={handleChange}
                className="w-5 h-5 accent-emerald-500 rounded"
              />
              <span className="text-sm font-bold text-slate-700">{t('form.step1.whatsappSame') || "WhatsApp number is same as Mobile"}</span>
            </label>
          </div>

          {!stepData.whatsappSameAsMobile && (
            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.whatsappNumber') || "WhatsApp Number"}</label>
              <div className="flex">
                <span className="px-4 flex items-center bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl text-slate-500 font-bold">+880</span>
                <input
                  name="whatsappNumber"
                  value={stepData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white placeholder-slate-400 font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-slate-100 pb-3">
          <span className="p-2 bg-orange-50 text-orange-600 rounded-lg"><FaMapMarkerAlt /></span>
          {t('form.step1.address') || "Address Details"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.division') || "Division"}</label>
            <div className="relative">
              <select
                name="division"
                value={stepData.division}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                required
              >
                <option value="">Select Division</option>
                {bangladeshLocations.map(d => <option key={d.division}>{d.division}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.district') || "District"}</label>
            <div className="relative">
              <select
                name="district"
                value={stepData.district}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white appearance-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                required
                disabled={!stepData.division}
              >
                <option value="">Select District</option>
                {districts.map(d => <option key={d.name}>{d.name}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.thana') || "Thana"}</label>
            <div className="relative">
              <select
                name="thana"
                value={stepData.thana}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white appearance-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                required
                disabled={!stepData.district}
              >
                <option value="">Select Thana</option>
                {thanas.map(t => <option key={t}>{t}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div className="md:col-span-1.5">
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.postOffice') || "Post Office"}</label>
            <input
              name="postOffice"
              placeholder="e.g. Sadar"
              value={stepData.postOffice}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div className="md:col-span-1.5">
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.postCode') || "Post Code"}</label>
            <input
              name="postCode"
              placeholder="e.g. 1200"
              value={stepData.postCode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white font-mono"
              required
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.detailedAddress') || "Detailed Address"}</label>
            <textarea
              name="detailedAddress"
              value={stepData.detailedAddress}
              onChange={handleChange}
              rows="3"
              placeholder="House No, Road No, Village, etc."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white resize-none"
              required
            />
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-end pt-8">
        <button
          type="submit"
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 text-lg"
        >
          {t('form.buttons.saveNext') || "Save & Next"} <FaArrowRight />
        </button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;