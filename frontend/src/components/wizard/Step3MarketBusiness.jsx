import { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import { FaStore, FaBuilding, FaPlaneDeparture, FaGlobe, FaFacebook, FaLink, FaMoneyBillWave, FaUsers, FaClock, FaUniversity, FaMobileAlt, FaFileUpload, FaCheckCircle, FaTimes, FaSearch, FaArrowRight, FaArrowLeft, FaUpload, FaRedoAlt } from 'react-icons/fa';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Saudi Arabia', 'United Arab Emirates', 'Malaysia', 'Singapore', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'South Korea', 'Qatar', 'Kuwait'];

const FieldError = ({ msg }) => msg ? <p className="mt-1 text-xs text-red-500 font-medium">{msg}</p> : null;

const cardCls = "bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm shadow-blue-100/60 border border-blue-100";

const Step3MarketBusiness = ({ onNext, onBack }) => {
  const { formData, updateFormData, validateStep, isSaving, isUpdating } = useForm();
  const { t } = useLanguage();

  const [stepData, setStepData] = useState({
    buyerType: formData.buyerType || { retailShop: false, corporate: false, exportBuyer: false, online: false },
    exportMarkets: formData.exportMarkets || [],
    onlineBuyer: formData.onlineBuyer || { facebookLink: '', websiteLink: '' },
    totalCustomers: formData.totalCustomers || '',
    regularCustomers: formData.regularCustomers || '',
    monthlySales: formData.monthlySales || '',
    businessAge: formData.businessAge || '',
    registrationDocuments: formData.registrationDocuments || { tradeLicense: false, tradeLicenseFile: '', tin: false, tinFile: '', bsti: false, bstiFile: '', exportLicense: false, exportLicenseFile: '', other: false, certificateName: '', otherFile: '' },
    hasBankAccount: formData.hasBankAccount || 'No',
    bankName: formData.bankName || '', bankBranch: formData.bankBranch || '', accountHolder: formData.accountHolder || '',
    accountNumber: formData.accountNumber || '', routingNumber: formData.routingNumber || '',
    mobileBanking: formData.mobileBanking || { bkash: false, bkashNumber: '', nagad: false, nagadNumber: '', rocket: false, rocketNumber: '' }
  });

  const [uploading, setUploading] = useState({});
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCheckboxChange = (section, field) => setStepData(prev => ({ ...prev, [section]: { ...prev[section], [field]: !prev[section][field] } }));
  const handleChange = (e) => { const { name, value } = e.target; setStepData(prev => ({ ...prev, [name]: value })); };
  const handleNestedChange = (section, field, value) => setStepData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const handleCountrySelect = (country) => {
    if (stepData.exportMarkets.some(m => m.country === country)) return;
    setStepData(prev => ({ ...prev, exportMarkets: [...prev.exportMarkets, { country, buyers: '' }] }));
    setCountrySearch(''); setShowCountryDropdown(false);
  };
  const handleBuyerCountChange = (country, value) => setStepData(prev => ({ ...prev, exportMarkets: prev.exportMarkets.map(m => m.country === country ? { ...m, buyers: value } : m) }));
  const handleCountryRemove = (country) => setStepData(prev => ({ ...prev, exportMarkets: prev.exportMarkets.filter(m => m.country !== country) }));

  const handleFileUpload = async (docType, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [docType]: true }));
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file); formDataObj.append('folder', 'aggrigo/documents');
      const response = await api.post('/upload/single', formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data.success) setStepData(prev => ({ ...prev, registrationDocuments: { ...prev.registrationDocuments, [`${docType}File`]: response.data.url } }));
    } catch (error) { console.error(error); alert('Upload failed'); }
    finally { setUploading(prev => ({ ...prev, [docType]: false })); }
  };

  const handleClearFile = (docType) => setStepData(prev => ({ ...prev, registrationDocuments: { ...prev.registrationDocuments, [`${docType}File`]: '' } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { success, errors: validationErrors } = validateStep(3, stepData);
    if (!success) { setErrors(validationErrors); return; }
    setErrors({});
    updateFormData(stepData);
    onNext(stepData);
  };

  const BuyerTypeCard = ({ label, icon, active, onClick }) => (
    <div onClick={onClick}
      className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 h-32
        ${active ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100/50 transform scale-105' : 'border-blue-100 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50/20'}`}>
      <div className={`text-3xl mb-1 ${active ? 'text-emerald-600' : 'text-blue-300'}`}>{icon}</div>
      <span className="font-bold text-sm text-center">{label}</span>
      {active && <div className="absolute top-2 right-2 text-emerald-500"><FaCheckCircle /></div>}
    </div>
  );

  const DocRow = ({ docKey, label }) => {
    const isSelected = stepData.registrationDocuments[docKey];
    const fileUrl = stepData.registrationDocuments[`${docKey}File`];
    const isUploading = uploading[docKey];
    return (
      <div className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${isSelected ? 'border-emerald-300 bg-emerald-50' : 'border-blue-100 bg-blue-50/20 hover:border-blue-200'}`}>
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={() => handleCheckboxChange('registrationDocuments', docKey)}>
          <span className={`text-sm font-bold tracking-wide ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>{label}</span>
          {isSelected && !fileUrl && <span className="text-xs text-emerald-500 font-medium">Selected</span>}
          {fileUrl && <FaCheckCircle className="text-emerald-500" />}
        </div>
        {isSelected && (
          <div className="px-4 pb-3 flex items-center gap-2 border-t border-emerald-100">
            <label className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold cursor-pointer transition-all ${fileUrl ? 'bg-white border-blue-200 text-slate-500 hover:border-blue-300 hover:text-blue-600' : 'bg-white border-emerald-300 text-emerald-600 hover:bg-emerald-50'}`}>
              {isUploading ? (<><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" /><span>{t('form.step3.uploading')}</span></>) : fileUrl ? (<><FaRedoAlt className="text-xs" /><span>Resubmit</span></>) : (<><FaUpload className="text-xs" /><span>{t('form.step3.uploadFile')}</span></>)}
              <input type="file" className="hidden" onChange={(e) => handleFileUpload(docKey, e.target.files[0])} accept="image/*,.pdf" />
            </label>
            {fileUrl && !isUploading && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-emerald-600 font-medium">{t('form.step3.uploaded')}</span>
                <button type="button" onClick={() => handleClearFile(docKey)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTimes className="text-xs" /></button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800">{t('form.step3.title')}</h3>
        <p className="text-slate-500">{t('form.step3.subtitle')}</p>
      </div>

      {/* Buyer Types */}
      <div className={cardCls}>
        <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">{t('form.step3.buyerType')}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BuyerTypeCard label={t('form.step3.retailShop')} icon={<FaStore />} active={stepData.buyerType.retailShop} onClick={() => handleCheckboxChange('buyerType', 'retailShop')} />
          <BuyerTypeCard label={t('form.step3.corporate')} icon={<FaBuilding />} active={stepData.buyerType.corporate} onClick={() => handleCheckboxChange('buyerType', 'corporate')} />
          <BuyerTypeCard label={t('form.step3.exportBuyer')} icon={<FaPlaneDeparture />} active={stepData.buyerType.exportBuyer} onClick={() => handleCheckboxChange('buyerType', 'exportBuyer')} />
          <BuyerTypeCard label={t('form.step3.online')} icon={<FaGlobe />} active={stepData.buyerType.online} onClick={() => handleCheckboxChange('buyerType', 'online')} />
        </div>

        {stepData.buyerType.exportBuyer && (
          <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2"><FaPlaneDeparture /> {t('form.step3.exportMarketsTitle')}</h4>
            <div className="relative mb-4">
              <div className="flex items-center border border-blue-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-300">
                <div className="pl-3 text-blue-400"><FaSearch /></div>
                <input type="text" value={countrySearch} onChange={(e) => { setCountrySearch(e.target.value); setShowCountryDropdown(true); }} onFocus={() => setShowCountryDropdown(true)} className="w-full p-3 outline-none text-sm" placeholder={t('form.step3.searchPlaceholder')} />
              </div>
              {showCountryDropdown && countrySearch && (
                <div className="absolute z-20 w-full bg-white border border-blue-100 rounded-b-lg shadow-xl shadow-blue-100/30 max-h-48 overflow-y-auto">
                  {COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase())).map(country => (
                    <div key={country} onClick={() => handleCountrySelect(country)} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-slate-700">{country}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stepData.exportMarkets.map((market, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
                  <span className="font-semibold text-blue-800 px-2">{market.country}</span>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder={t('form.step3.placeholders.buyers')} className="w-20 p-1 text-sm border border-blue-100 rounded text-center outline-none focus:border-blue-400" value={market.buyers} onChange={(e) => handleBuyerCountChange(market.country, e.target.value)} />
                    <button type="button" onClick={() => handleCountryRemove(market.country)} className="text-red-400 hover:text-red-600 p-1"><FaTimes /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stepData.buyerType.online && (
          <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-indigo-700 mb-3 flex items-center gap-2"><FaGlobe /> {t('form.step3.onlinePresenceTitle')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center bg-white border border-blue-100 rounded-lg px-3">
                <FaFacebook className="text-blue-500 text-xl" />
                <input type="text" placeholder={t('form.step3.placeholders.facebook')} className="w-full p-3 outline-none text-sm" value={stepData.onlineBuyer.facebookLink} onChange={(e) => handleNestedChange('onlineBuyer', 'facebookLink', e.target.value)} />
              </div>
              <div className="flex items-center bg-white border border-blue-100 rounded-lg px-3">
                <FaLink className="text-blue-400 text-xl" />
                <input type="text" placeholder={t('form.step3.placeholders.website')} className="w-full p-3 outline-none text-sm" value={stepData.onlineBuyer.websiteLink} onChange={(e) => handleNestedChange('onlineBuyer', 'websiteLink', e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('form.step3.businessAge'), icon: <FaClock className="text-orange-400" />, name: 'businessAge', placeholder: t('form.step3.placeholders.businessAge'), type: 'number' },
          { label: t('form.step3.totalCustomers'), icon: <FaUsers className="text-blue-400" />, name: 'totalCustomers', placeholder: t('form.step3.placeholders.totalCustomers'), type: 'number' },
          { label: t('form.step3.regularCustomers'), icon: <FaUsers className="text-teal-400" />, name: 'regularCustomers', placeholder: t('form.step3.placeholders.regularCustomers'), type: 'number' },
          { label: t('form.step3.monthlySales'), icon: <FaMoneyBillWave className="text-emerald-400" />, name: 'monthlySales', placeholder: t('form.step3.placeholders.monthlySales'), type: 'number' }
        ].map((field, idx) => (
          <div key={idx} className="bg-white/80 p-4 rounded-xl shadow-sm shadow-blue-100/40 border border-blue-100 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-600">{field.icon} {field.label}</div>
            <input type={field.type} name={field.name} value={stepData[field.name]} onChange={handleChange} placeholder={field.placeholder}
              className={`w-full font-bold text-lg text-slate-800 border-b-2 focus:border-blue-400 outline-none bg-transparent py-1 transition-colors ${errors[field.name] ? 'border-red-400' : 'border-blue-100'}`} />
            <FieldError msg={errors[field.name]} />
          </div>
        ))}
      </div>

      {/* Documents & Finance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cardCls}>
          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-1">
            <FaFileUpload className="text-emerald-400" /> {t('form.step3.documentsTitle')}
            <span className="text-slate-400 font-normal text-sm">(Upload PDF or Image files)</span>
          </h4>
          <div className="space-y-2">
            <DocRow docKey="tradeLicense" label={t('form.step3.tradeLicense')} />
            <DocRow docKey="tin" label={t('form.step3.tin')} />
            <DocRow docKey="bsti" label={t('form.step3.bsti')} />
            <DocRow docKey="exportLicense" label={t('form.step3.exportLicense')} />
          </div>
        </div>

        <div className={cardCls}>
          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><FaUniversity className="text-blue-400" /> {t('form.step3.bankTitle')}</h4>
          <div className="mb-5">
            <label className="text-sm text-slate-500 mb-2 block">{t('form.step3.hasBankAccount')}</label>
            <div className="flex bg-blue-50/30 p-1 rounded-lg w-full border border-blue-100">
              {[t('form.step3.yes'), t('form.step3.no')].map((opt, index) => (
                <button type="button" key={opt} onClick={() => handleChange({ target: { name: 'hasBankAccount', value: index === 0 ? 'Yes' : 'No' } })}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${(index === 0 && stepData.hasBankAccount === 'Yes') || (index === 1 && stepData.hasBankAccount === 'No') ? 'bg-white shadow text-blue-600 border border-blue-100' : 'text-slate-400'}`}>
                  {opt}
                </button>
              ))}
            </div>
            {stepData.hasBankAccount === 'Yes' && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[{ name: 'bankName', placeholder: t('form.step3.placeholders.bankName') }, { name: 'bankBranch', placeholder: t('form.step3.placeholders.branch') }].map(f => (
                  <input key={f.name} type="text" name={f.name} placeholder={f.placeholder} value={stepData[f.name]} onChange={handleChange} className="px-3 py-2 border border-blue-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
                ))}
                <input type="text" name="accountHolder" placeholder="Account Holder Name" value={stepData.accountHolder} onChange={handleChange} className="px-3 py-2 border border-blue-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white col-span-2" />
                <input type="text" name="accountNumber" placeholder={t('form.step3.placeholders.accountNumber')} value={stepData.accountNumber} onChange={handleChange} className="px-3 py-2 border border-blue-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
                <input type="text" name="routingNumber" placeholder="Routing Number" value={stepData.routingNumber} onChange={handleChange} className="px-3 py-2 border border-blue-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
              </div>
            )}
          </div>
          <h5 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><FaMobileAlt className="text-blue-400" /> {t('form.step3.mobileBankingTitle')}</h5>
          <div className="space-y-3">
            {[{ key: 'bkash', label: 'bKash', color: 'bg-pink-500' }, { key: 'nagad', label: 'Nagad', color: 'bg-orange-500' }, { key: 'rocket', label: 'Rocket', color: 'bg-purple-500' }].map(wallet => (
              <div key={wallet.key} className="flex items-center h-10 w-full border border-blue-100 rounded-lg overflow-hidden bg-blue-50/20 focus-within:ring-1 focus-within:ring-blue-300">
                <div className="h-full px-3 flex items-center justify-center border-r border-blue-100 bg-white">
                  <input type="checkbox" checked={stepData.mobileBanking[wallet.key]} onChange={() => handleCheckboxChange('mobileBanking', wallet.key)} className="accent-blue-500 w-4 h-4" />
                </div>
                <div className={`px-3 py-1 text-white text-xs font-bold ${wallet.color} h-full flex items-center min-w-[60px] justify-center`}>{wallet.label}</div>
                <input type="tel" placeholder="017..." disabled={!stepData.mobileBanking[wallet.key]} value={stepData.mobileBanking[`${wallet.key}Number`]} onChange={(e) => handleNestedChange('mobileBanking', `${wallet.key}Number`, e.target.value)} className="flex-1 bg-transparent px-3 outline-none text-sm disabled:bg-blue-50/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} disabled={isSaving} className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-blue-100 hover:bg-blue-50/30 transition shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <FaArrowLeft /> {t('form.buttons.back')}
        </button>
        <button type="submit" disabled={isSaving}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-400/30 transition transform hover:-translate-y-1 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          {isSaving ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isUpdating ? 'Updating...' : 'Saving...'}</>) : (<>{t('form.buttons.next')} <FaArrowRight /></>)}
        </button>
      </div>
    </form>
  );
};

export default Step3MarketBusiness;
