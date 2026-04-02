import { useState, useEffect, useRef } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import bangladeshLocations from '../../data/bangladesh-locations.json';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaBoxOpen, FaUserTie, FaPhoneAlt, FaMapMarkerAlt, FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';

// Fix Leaflet default marker icon issue with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to fly map to new position when coordinates change
const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { animate: true, duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

// Nominatim geocode: thana + district + Bangladesh
const geocodeThana = async (thana, district) => {
  try {
    const query = `${thana}, ${district}, Bangladesh`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=bd`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (e) {
    console.error('Nominatim error:', e);
  }
  return null;
};

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-500 font-medium">{msg}</p> : null;

const PRODUCT_CATEGORIES = [
  { id: 'handicrafts', en: 'Handicrafts & Heritage', bn: 'হস্তশিল্প ও ঐতিহ্যবাহী পণ্য', subcategories: [{ id: 'nakshi-kantha', en: 'Nakshi Kantha', bn: 'নকশিকাঁথা' }, { id: 'bamboo-cane-jute', en: 'Bamboo, Cane & Jute Products', bn: 'বাঁশ, বেত ও পাটজাত পণ্য' }, { id: 'pottery', en: 'Pottery', bn: 'মৃৎশিল্প' }, { id: 'folk-art', en: 'Folk Art & Decor', bn: 'লোকজ শিল্প ও ডেকোর আইটেম' }] },
  { id: 'fashion', en: 'Fashion & Lifestyle', bn: 'ফ্যাশন ও লাইফস্টাইল', subcategories: [{ id: 'ethnic-clothing', en: 'Clothing Ethnic & Fusion', bn: 'পোশাক দেশি ও ফিউশন' }, { id: 'boutique-designer', en: 'Boutique & Designer Wear', bn: 'বুটিক ও ডিজাইনার ওয়্যার' }, { id: 'jewelry', en: 'Jewelry', bn: 'গহনা ও জুয়েলারি' }, { id: 'bags-shoes-accessories', en: 'Bags, Shoes & Accessories', bn: 'ব্যাগ, জুতা ও এক্সেসরিজ' }] },
  { id: 'home-decor', en: 'Home Decor & Household', bn: 'হোম ডেকোর ও হাউসহোল্ড পণ্য', subcategories: [{ id: 'home-decor-items', en: 'Home Decor Items', bn: 'হোম ডেকোর আইটেম' }, { id: 'kitchenware', en: 'Kitchenware', bn: 'কিচেনওয়্যার' }, { id: 'home-textile', en: 'Home Textile', bn: 'হোম টেক্সটাইল' }, { id: 'gift-utility', en: 'Gift & Utility Products', bn: 'গিফট ও ইউটিলিটি পণ্য' }] },
  { id: 'organic-agro', en: 'Organic & Agro', bn: 'অরগানিক ও অ্যাগ্রো', subcategories: [{ id: 'deshiyo-organic-food', en: 'Local Organic Food', bn: 'দেশীয় অর্গানিক খাদ্য' }, { id: 'natural-products', en: 'Natural Products', bn: 'প্রাকৃতিক পণ্য' }] }
];

const SubCategoryDropdown = ({ productTypeId, selectedSubcategories, onChange, currentLanguage, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const categoryDef = PRODUCT_CATEGORIES.find(cat => cat.id === productTypeId);

  useEffect(() => {
    const handleClickOutside = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (val) => onChange(selectedSubcategories.includes(val) ? selectedSubcategories.filter(s => s !== val) : [...selectedSubcategories, val]);
  const handleRemove = (val) => onChange(selectedSubcategories.filter(s => s !== val));

  if (!productTypeId || !categoryDef) return (
    <div className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/20 text-slate-400 text-sm opacity-60 cursor-not-allowed min-h-[48px] flex items-center">
      {t('form.step1.noSubCategoriesAvailable') || 'Please select a product type first'}
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => setIsOpen(p => !p)} className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/20 hover:bg-white hover:border-blue-300 cursor-pointer min-h-[48px] transition-all">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-wrap gap-2">
            {selectedSubcategories.length > 0 ? selectedSubcategories.map((enVal) => {
              const d = categoryDef.subcategories.find(sc => sc.en === enVal);
              return (
                <span key={enVal} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium" onClick={e => e.stopPropagation()}>
                  {d ? (currentLanguage === 'bn' ? d.bn : d.en) : enVal}
                  <button type="button" onClick={e => { e.stopPropagation(); handleRemove(enVal); }} className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </span>
              );
            }) : <span className="text-slate-400 text-sm">{t('form.step1.selectSubCategories') || 'Select Sub-Categories'}</span>}
          </div>
          <div className={`text-blue-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/40 max-h-52 overflow-y-auto">
          <div className="p-1">
            {categoryDef.subcategories.map(s => (
              <div key={s.id} onClick={() => handleToggle(s.en)} className={`w-full px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium ${selectedSubcategories.includes(s.en) ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-blue-50/40'}`}>
                {currentLanguage === 'bn' ? s.bn : s.en}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedSubcategories.length > 0 && <div className="mt-2 text-xs text-blue-400">{selectedSubcategories.length} {t('form.step1.subcategoriesSelected') || 'selected'}</div>}
    </div>
  );
};

const ProductEntry = ({ entry, index, onUpdate, onRemove, canRemove, currentLanguage, t }) => (
  <div className="relative bg-gradient-to-br from-blue-50/50 to-white border border-blue-100 rounded-xl p-4">
    {canRemove && (
      <button type="button" onClick={() => onRemove(index)} className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
        <FaTrash className="w-3.5 h-3.5" />
      </button>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
      <div>
        <label className="block text-xs font-bold text-blue-500 mb-2 uppercase tracking-wide">{t('form.step1.productType') || 'Product Type'} <span className="text-red-500">*</span></label>
        <div className="relative">
          <select value={entry.category} onChange={e => onUpdate(index, 'category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white appearance-none cursor-pointer text-sm" required>
            <option value="">{t('form.step1.selectProductType') || 'Select Product Type'}</option>
            {PRODUCT_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{currentLanguage === 'bn' ? cat.bn : cat.en}</option>)}
          </select>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-blue-400 text-xs">▼</div>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-blue-500 mb-2 uppercase tracking-wide">{t('form.step1.category') || 'Sub-Category'} <span className="text-red-500">*</span></label>
        <SubCategoryDropdown productTypeId={entry.category} selectedSubcategories={entry.subCategories} onChange={val => onUpdate(index, 'subCategories', val)} currentLanguage={currentLanguage} t={t} />
      </div>
    </div>
  </div>
);

const parseExistingProducts = (products) => {
  if (!products || products.length === 0) return [{ category: '', subCategories: [] }];
  const map = {};
  products.forEach(p => { if (!p.category) return; if (!map[p.category]) map[p.category] = []; if (p.subCategory) map[p.category].push(p.subCategory); });
  const entries = Object.entries(map).map(([category, subCategories]) => ({ category, subCategories }));
  return entries.length > 0 ? entries : [{ category: '', subCategories: [] }];
};

const flattenProductEntries = (entries) => {
  const result = [];
  entries.forEach(entry => {
    if (!entry.category) return;
    if (entry.subCategories.length === 0) { result.push({ category: entry.category, subCategory: '', productName: '' }); }
    else { entry.subCategories.forEach(sub => result.push({ category: entry.category, subCategory: sub, productName: '' })); }
  });
  return result;
};

const cardCls = "bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm shadow-blue-100/60 border border-blue-100";
const inputCls = (err) => `w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white placeholder-slate-400 ${err ? 'border-red-400' : 'border-blue-100'}`;
const selectCls = "w-full px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white appearance-none cursor-pointer disabled:bg-blue-50/30 disabled:text-slate-400";

const Step1BasicInfo = ({ onNext }) => {
  const { formData, updateFormData, validateStep, isSaving, isUpdating } = useForm();
  const { t, currentLanguage } = useLanguage();
  const [errors, setErrors] = useState({});
  const [productEntries, setProductEntries] = useState(() => parseExistingProducts(formData.products));

  const [stepData, setStepData] = useState({
    brandName: formData.brandName || '', registeredName: formData.registeredName || '',
    ownerName: formData.ownerName || '', gender: formData.gender || '',
    ownerAge: formData.ownerAge || '', ownershipType: formData.ownershipType || '',
    partnerName: formData.partnerName || '', mobileNumber: formData.mobileNumber || '',
    whatsappSameAsMobile: formData.whatsappSameAsMobile || false, whatsappNumber: formData.whatsappNumber || '',
    email: formData.email || '', division: formData.division || '', district: formData.district || '',
    thana: formData.thana || '', postOffice: formData.postOffice || '',
    postCode: formData.postCode || '', detailedAddress: formData.detailedAddress || ''
  });

  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  // Map state — center on Bangladesh by default
  const [mapCenter, setMapCenter] = useState([23.6850, 90.3563]);
  const [mapZoom, setMapZoom] = useState(7);
  const [markerPos, setMarkerPos] = useState(null);
  const [markerLabel, setMarkerLabel] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Division selected → load districts, fly map to division
  useEffect(() => {
    if (stepData.division) {
      const divData = bangladeshLocations.find(d => d.division === stepData.division);
      setDistricts(divData?.districts || []);
      setThanas([]);
      if (divData?.lat && divData?.lng) {
        setMapCenter([divData.lat, divData.lng]);
        setMapZoom(9);
        setMarkerPos([divData.lat, divData.lng]);
        setMarkerLabel(stepData.division + ' Division');
      }
    } else {
      setDistricts([]);
      setThanas([]);
      setMapCenter([23.6850, 90.3563]);
      setMapZoom(7);
      setMarkerPos(null);
      setMarkerLabel('');
    }
  }, [stepData.division]);

  // District selected → load thanas, fly map to district
  useEffect(() => {
    if (stepData.district && districts.length > 0) {
      const distData = districts.find(d => d.name === stepData.district);
      setThanas(distData?.thanas || []);
      if (distData?.lat && distData?.lng) {
        setMapCenter([distData.lat, distData.lng]);
        setMapZoom(11);
        setMarkerPos([distData.lat, distData.lng]);
        setMarkerLabel(stepData.district + ' District');
      }
    } else {
      setThanas([]);
    }
  }, [stepData.district, districts]);

  // Thana selected → geocode via Nominatim for exact location
  useEffect(() => {
    if (stepData.thana && stepData.district) {
      setIsGeocoding(true);
      geocodeThana(stepData.thana, stepData.district).then(coords => {
        if (coords) {
          setMapCenter([coords.lat, coords.lng]);
          setMapZoom(14);
          setMarkerPos([coords.lat, coords.lng]);
          setMarkerLabel(`${stepData.thana}, ${stepData.district}`);
        } else {
          // Fallback to district coords if geocoding fails
          const distData = districts.find(d => d.name === stepData.district);
          if (distData?.lat && distData?.lng) {
            setMapCenter([distData.lat, distData.lng]);
            setMapZoom(12);
            setMarkerPos([distData.lat, distData.lng]);
            setMarkerLabel(`${stepData.thana}, ${stepData.district}`);
          }
        }
        setIsGeocoding(false);
      });
    }
  }, [stepData.thana]);

  useEffect(() => {
    if (stepData.whatsappSameAsMobile) setStepData(prev => ({ ...prev, whatsappNumber: prev.mobileNumber }));
  }, [stepData.whatsappSameAsMobile, stepData.mobileNumber]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Reset dependent fields on division/district change
    if (name === 'division') {
      setStepData(prev => ({ ...prev, division: value, district: '', thana: '' }));
      return;
    }
    if (name === 'district') {
      setStepData(prev => ({ ...prev, district: value, thana: '' }));
      return;
    }
    setStepData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddProductEntry = () => setProductEntries(prev => [...prev, { category: '', subCategories: [] }]);
  const handleRemoveProductEntry = (index) => setProductEntries(prev => prev.filter((_, i) => i !== index));
  const handleUpdateProductEntry = (index, field, value) => {
    setProductEntries(prev => { const u = [...prev]; u[index] = field === 'category' ? { category: value, subCategories: [] } : { ...u[index], [field]: value }; return u; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const products = flattenProductEntries(productEntries);
    const firstEntry = productEntries[0];
    const productType = firstEntry?.category || '';
    const category = firstEntry?.subCategories?.join(', ') || '';
    const dataToSubmit = { ...stepData, productType, category, products };
    const { success, errors: validationErrors } = validateStep(1, dataToSubmit);
    if (!success) {
      setErrors(validationErrors);
      document.querySelector(`[name="${Object.keys(validationErrors)[0]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    updateFormData(dataToSubmit);
    onNext(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl mx-auto font-sans text-slate-800">

      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('form.step1.title') || 'Basic Information'}</h3>
        <p className="text-slate-500 max-w-xl mx-auto">{t('form.step1.subtitle') || "Let's start with the basics of your business and personal details."}</p>
      </div>

      {/* Product Info */}
      <div className={cardCls}>
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-blue-50 pb-3">
          <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FaBoxOpen /></span>
          {t('form.step1.productInfo') || 'Product Information'}
        </h4>
        <div className="space-y-4 mb-4">
          {productEntries.map((entry, index) => (
            <ProductEntry key={index} entry={entry} index={index} onUpdate={handleUpdateProductEntry} onRemove={handleRemoveProductEntry} canRemove={productEntries.length > 1} currentLanguage={currentLanguage} t={t} />
          ))}
        </div>
        <button type="button" onClick={handleAddProductEntry} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-semibold w-full justify-center">
          <FaPlus className="w-3.5 h-3.5" />
          {t('form.step1.addMoreProduct') || 'Add More Product'}
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.brandName') || 'Brand Name'} <span className="text-red-500">*</span></label>
            <input name="brandName" value={stepData.brandName} onChange={handleChange} className={inputCls(errors.brandName)} placeholder={t('form.step1.brandNamePlaceholder') || 'e.g. Green Harvest'} />
            <FieldError msg={errors.brandName} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.registeredName') || 'Registered Name'} <span className="text-xs font-normal text-slate-400">{t('form.step1.optional') || '(Optional)'}</span></label>
            <input name="registeredName" value={stepData.registeredName} onChange={handleChange} className={inputCls(false)} placeholder={t('form.step1.registeredNamePlaceholder') || 'Official Business Name'} />
          </div>
        </div>
      </div>

      {/* Owner Info */}
      <div className={cardCls}>
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-blue-50 pb-3">
          <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FaUserTie /></span>
          {t('form.step1.ownerInfo') || 'Owner Details'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.ownerName') || 'Owner Name'} <span className="text-red-500">*</span></label>
            <input name="ownerName" value={stepData.ownerName} onChange={handleChange} className={inputCls(errors.ownerName)} />
            <FieldError msg={errors.ownerName} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.ownerAge') || 'Age'} <span className="text-red-500">*</span></label>
            <input type="number" name="ownerAge" value={stepData.ownerAge} onChange={handleChange} className={inputCls(errors.ownerAge)} />
            <FieldError msg={errors.ownerAge} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-3">{t('form.step1.gender') || 'Gender'} <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {[{ value: 'Male', label: (t('form.step1.genderOptions') || [])[0] || 'Male' }, { value: 'Female', label: (t('form.step1.genderOptions') || [])[1] || 'Female' }, { value: 'Other', label: (t('form.step1.genderOptions') || [])[2] || 'Other' }].map(g => (
                <label key={g.value} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${stepData.gender === g.value ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold' : 'bg-white border-blue-100 text-slate-600 hover:bg-blue-50/30'}`}>
                  <input type="radio" name="gender" value={g.value} checked={stepData.gender === g.value} onChange={handleChange} className="hidden" />
                  {g.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-3">{t('form.step1.ownershipType') || 'Ownership'} <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {[{ value: 'Single', label: (t('form.step1.ownershipTypeOptions') || [])[0] || 'Single' }, { value: 'Partnership', label: (t('form.step1.ownershipTypeOptions') || [])[1] || 'Partnership' }, { value: 'Ltd. Company', label: (t('form.step1.ownershipTypeOptions') || [])[2] || 'Ltd. Company' }].map(type => (
                <label key={type.value} className={`flex-1 flex items-center justify-center gap-2 px-1 py-1 rounded-xl border cursor-pointer transition-all ${stepData.ownershipType === type.value ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold' : 'bg-white border-blue-100 text-slate-600 hover:bg-blue-50/30'}`}>
                  <input type="radio" name="ownershipType" value={type.value} checked={stepData.ownershipType === type.value} onChange={handleChange} className="hidden" />
                  {type.label}
                </label>
              ))}
            </div>
          </div>
          {stepData.ownershipType === 'Partnership' && (
            <div className="md:col-span-2 animate-fade-in">
              <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.partnerName') || 'Partner Name'} <span className="text-red-500">*</span></label>
              <input name="partnerName" value={stepData.partnerName} onChange={handleChange} className={inputCls(false)} required />
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className={cardCls}>
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-blue-50 pb-3">
          <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><FaPhoneAlt /></span>
          {t('form.step1.contactInfo') || 'Contact Information'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.mobileNumber') || 'Mobile Number'} <span className="text-red-500">*</span></label>
            <div className="flex">
              <span className="px-4 flex items-center bg-blue-50 border border-blue-100 border-r-0 rounded-l-xl text-blue-500 font-bold">+880</span>
              <input name="mobileNumber" value={stepData.mobileNumber} onChange={handleChange} className={`w-full px-4 py-3 rounded-r-xl border focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white placeholder-slate-400 font-mono ${errors.mobileNumber ? 'border-red-400' : 'border-blue-100'}`} />
            </div>
            <FieldError msg={errors.mobileNumber} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.email') || 'Email Address'} <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={stepData.email} onChange={handleChange} className={inputCls(errors.email)} />
            <FieldError msg={errors.email} />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 p-3 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50/30 transition-colors w-full md:w-auto inline-flex">
              <input type="checkbox" name="whatsappSameAsMobile" checked={stepData.whatsappSameAsMobile} onChange={handleChange} className="w-5 h-5 accent-emerald-500 rounded" />
              <span className="text-sm font-bold text-slate-700">{t('form.step1.whatsappSame') || 'WhatsApp number is same as Mobile'}</span>
            </label>
          </div>
          {!stepData.whatsappSameAsMobile && (
            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.whatsappNumber') || 'WhatsApp Number'}</label>
              <div className="flex">
                <span className="px-4 flex items-center bg-blue-50 border border-blue-100 border-r-0 rounded-l-xl text-blue-500 font-bold">+880</span>
                <input name="whatsappNumber" value={stepData.whatsappNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-r-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white placeholder-slate-400 font-mono" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address + Map */}
      <div className={cardCls}>
        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg border-b border-blue-50 pb-3">
          <span className="p-2 bg-orange-100 text-orange-500 rounded-lg"><FaMapMarkerAlt /></span>
          {t('form.step1.address') || 'Address Details'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Division */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.division') || 'Division'}</label>
            <div className="relative">
              <select name="division" value={stepData.division} onChange={handleChange} className={selectCls} required>
                <option value="">{t('form.step1.divisionPlaceholder') || 'Select Division'}</option>
                {bangladeshLocations.map(d => <option key={d.division}>{d.division}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-blue-400">▼</div>
            </div>
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.district') || 'District'}</label>
            <div className="relative">
              <select name="district" value={stepData.district} onChange={handleChange} className={selectCls} required disabled={!stepData.division}>
                <option value="">{t('form.step1.districtPlaceholder') || 'Select District'}</option>
                {districts.map(d => <option key={d.name}>{d.name}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-blue-400">▼</div>
            </div>
          </div>

          {/* Thana */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.thana') || 'Thana'}</label>
            <div className="relative">
              <select name="thana" value={stepData.thana} onChange={handleChange} className={selectCls} required disabled={!stepData.district}>
                <option value="">{t('form.step1.thanaPlaceholder') || 'Select Thana'}</option>
                {thanas.map(th => <option key={th}>{th}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-blue-400">▼</div>
            </div>
          </div>

          {/* Post Office */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.postOffice') || 'Post Office'}</label>
            <input name="postOffice" placeholder={t('form.step1.postOfficePlaceholder') || 'e.g. Sadar'} value={stepData.postOffice} onChange={handleChange} className={inputCls(false)} required />
          </div>

          {/* Post Code */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.postCode') || 'Post Code'}</label>
            <input name="postCode" placeholder={t('form.step1.postCodePlaceholder') || 'e.g. 1200'} value={stepData.postCode} onChange={handleChange} className={`${inputCls(false)} font-mono`} required />
          </div>

          {/* Detailed Address */}
          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-slate-600 mb-2">{t('form.step1.detailedAddress') || 'Detailed Address'}</label>
            <textarea name="detailedAddress" value={stepData.detailedAddress} onChange={handleChange} rows="3"
              placeholder={t('form.step1.detailedAddressPlaceholder') || 'House No, Road No, Village, etc.'}
              className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white resize-none" required />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <FaMapMarkerAlt className="text-orange-400" />
            <span className="text-sm font-bold text-slate-600">
              {isGeocoding
                ? '🔍 Locating thana...'
                : markerLabel
                  ? `📍 ${markerLabel}`
                  : t('form.step1.mapPlaceholder') || 'Select Division → District → Thana to see location on map'}
            </span>
            {isGeocoding && (
              <span className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin ml-1" />
            )}
          </div>

          <div className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm" style={{ height: '320px', zIndex: 0 }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapFlyTo center={mapCenter} zoom={mapZoom} />
              {markerPos && (
                <Marker position={markerPos}>
                  <Popup>
                    <div className="text-sm font-semibold text-slate-700">{markerLabel}</div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {!stepData.division && (
            <p className="mt-2 text-xs text-slate-400 text-center">
              ডিভিশন সিলেক্ট করলে এখানে map এ location দেখাবে
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end pt-8">
        <button type="submit" disabled={isSaving}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-400/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
          {isSaving ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{isUpdating ? 'Updating...' : 'Saving...'}</>) : (<>{t('form.buttons.next') || 'Next'} <FaArrowRight /></>)}
        </button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
