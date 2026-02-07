import { useState, useEffect } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import bangladeshLocations from '../../data/bangladesh-locations.json';

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
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Header */}
      <div>
        <h3 className="text-2xl font-extrabold text-green-700 mb-1">
          {t('form.step1.title')}
        </h3>
        <p className="text-sm text-gray-500">
          {t('form.step1.subtitle')}
        </p>
      </div>

      {/* Product Info */}
      <section className="bg-green-50/40 rounded-2xl p-6 border border-green-100">
        <h4 className="font-bold text-green-700 mb-5">📦 {t('form.step1.productInfo')}</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-text">{t('form.step1.productType')}</label>
            <input name="productType" value={stepData.productType} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="label-text">{t('form.step1.category')}</label>
            <input name="category" value={stepData.category} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="label-text">{t('form.step1.brandName')} *</label>
            <input name="brandName" value={stepData.brandName} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="label-text">{t('form.step1.registeredName')} (Optional)</label>
            <input name="registeredName" value={stepData.registeredName} onChange={handleChange} className="input-field" />
          </div>
        </div>
      </section>

      {/* Owner Info */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-700 mb-5">👤 {t('form.step1.ownerInfo')}</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-text">{t('form.step1.ownerName')} *</label>
            <input name="ownerName" value={stepData.ownerName} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="label-text">{t('form.step1.ownerAge')} *</label>
            <input type="number" name="ownerAge" value={stepData.ownerAge} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="label-text">{t('form.step1.gender')} *</label>
            <div className="flex gap-6 mt-2">
              {['Male', 'Female', 'Other'].map(g => (
                <label key={g} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="gender" value={g} checked={stepData.gender === g} onChange={handleChange} />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">{t('form.step1.ownershipType')} *</label>
            <div className="flex gap-6 mt-2">
              {['Single', 'Partnership', 'Ltd. Company'].map(type => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="ownershipType" value={type} checked={stepData.ownershipType === type} onChange={handleChange} />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {stepData.ownershipType === 'Partnership' && (
            <div className="md:col-span-2">
              <label className="label-text">{t('form.step1.partnerName')} *</label>
              <input name="partnerName" value={stepData.partnerName} onChange={handleChange} className="input-field" required />
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-green-50/40 rounded-2xl p-6 border border-green-100">
        <h4 className="font-bold text-green-700 mb-5">📞 {t('form.step1.contactInfo')}</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-text">{t('form.step1.mobileNumber')} *</label>
            <div className="flex">
              <span className="px-3 flex items-center bg-gray-100 border border-r-0 rounded-l-lg">+880</span>
              <input name="mobileNumber" value={stepData.mobileNumber} onChange={handleChange} className="input-field rounded-l-none" required />
            </div>
          </div>

          <div>
            <label className="label-text">{t('form.step1.email')} *</label>
            <input type="email" name="email" value={stepData.email} onChange={handleChange} className="input-field" required />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="whatsappSameAsMobile" checked={stepData.whatsappSameAsMobile} onChange={handleChange} />
              {t('form.step1.whatsappSame')}
            </label>
          </div>

          {!stepData.whatsappSameAsMobile && (
            <div>
              <label className="label-text">{t('form.step1.whatsappNumber')}</label>
              <div className="flex">
                <span className="px-3 flex items-center bg-gray-100 border border-r-0 rounded-l-lg">+880</span>
                <input name="whatsappNumber" value={stepData.whatsappNumber} onChange={handleChange} className="input-field rounded-l-none" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Address */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-700 mb-5">📍 {t('form.step1.address')}</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <select name="division" value={stepData.division} onChange={handleChange} className="input-field" required>
            <option value="">{t('form.step1.division')}</option>
            {bangladeshLocations.map(d => <option key={d.division}>{d.division}</option>)}
          </select>

          <select name="district" value={stepData.district} onChange={handleChange} className="input-field" required disabled={!stepData.division}>
            <option value="">{t('form.step1.district')}</option>
            {districts.map(d => <option key={d.name}>{d.name}</option>)}
          </select>

          <select name="thana" value={stepData.thana} onChange={handleChange} className="input-field" required disabled={!stepData.district}>
            <option value="">{t('form.step1.thana')}</option>
            {thanas.map(t => <option key={t}>{t}</option>)}
          </select>

          <input name="postOffice" placeholder={t('form.step1.postOffice')} value={stepData.postOffice} onChange={handleChange} className="input-field" required />
          <input name="postCode" placeholder={t('form.step1.postCode')} value={stepData.postCode} onChange={handleChange} className="input-field" required />

          <textarea
            name="detailedAddress"
            value={stepData.detailedAddress}
            onChange={handleChange}
            rows="3"
            placeholder={t('form.step1.detailedAddress')}
            className="input-field md:col-span-3"
            required
          />
        </div>
      </section>

      {/* CTA */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-md"
        >
          {t('form.buttons.saveNext')} →
        </button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
