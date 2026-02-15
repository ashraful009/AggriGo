import { useState, useEffect } from 'react';
import { useForm } from '../../context/FormContext';
import { useLanguage } from '../../context/LanguageContext';
import bangladeshLocations from '../../data/bangladesh-locations.json';
import { FaBoxOpen, FaUserTie, FaPhoneAlt, FaMapMarkerAlt, FaArrowRight, FaBuilding } from 'react-icons/fa';

// Product Categories with bilingual labels
const PRODUCT_CATEGORIES = [
  {
    id: 'handicrafts',
    en: 'Handicrafts & Heritage',
    bn: 'হস্তশিল্প ও ঐতিহ্যবাহী পণ্য',
    subcategories: [
      { id: 'nakshi-kantha', en: 'Nakshi Kantha', bn: 'নকশিকাঁথা' },
      { id: 'bamboo-cane-jute', en: 'Bamboo, Cane & Jute Products', bn: 'বাঁশ, বেত ও পাটজাত পণ্য' },
      { id: 'pottery', en: 'Pottery', bn: 'মৃৎশিল্প' },
      { id: 'folk-art', en: 'Folk Art & Decor', bn: 'লোকজ শিল্প ও ডেকোর আইটেম' }
    ]
  },
  {
    id: 'fashion',
    en: 'Fashion & Lifestyle',
    bn: 'ফ্যাশন ও লাইফস্টাইল',
    subcategories: [
      { id: 'ethnic-clothing', en: 'Clothing – Ethnic & Fusion', bn: 'পোশাক – দেশি ও ফিউশন' },
      { id: 'boutique-designer', en: 'Boutique & Designer Wear', bn: 'বুটিক ও ডিজাইনার ওয়্যার' },
      { id: 'jewelry', en: 'Jewelry', bn: 'গহনা ও জুয়েলারি' },
      { id: 'bags-shoes-accessories', en: 'Bags, Shoes & Accessories', bn: 'ব্যাগ, জুতা ও এক্সেসরিজ' }
    ]
  },
  {
    id: 'home-decor',
    en: 'Home Decor & Household',
    bn: 'হোম ডেকোর ও হাউসহোল্ড পণ্য',
    subcategories: [
      { id: 'home-decor-items', en: 'Home Decor Items', bn: 'হোম ডেকোর আইটেম' },
      { id: 'kitchenware', en: 'Kitchenware', bn: 'কিচেনওয়্যার' },
      { id: 'home-textile', en: 'Home Textile', bn: 'হোম টেক্সটাইল' },
      { id: 'gift-utility', en: 'Gift & Utility Products', bn: 'গিফট ও ইউটিলিটি পণ্য' }
    ]
  }
];

const Step1BasicInfo = ({ onNext }) => {
  const { formData, updateFormData } = useForm();
  const { t, currentLanguage } = useLanguage();

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

  const [selectedSubcategories, setSelectedSubcategories] = useState(() => {
    // Parse existing category string into array for multi-select
    return formData.category ? formData.category.split(',').map(s => s.trim()).filter(Boolean) : [];
  });

  const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] = useState(false);

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

  const handleProductTypeChange = (e) => {
    const newProductType = e.target.value;
    setStepData(prev => ({
      ...prev,
      productType: newProductType
    }));
    // Clear subcategories when product type changes
    setSelectedSubcategories([]);
    // Close dropdown when product type changes
    setIsSubcategoryDropdownOpen(false);
  };

  const handleSubcategoryToggle = (subcategoryLabel) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryLabel)) {
        return prev.filter(s => s !== subcategoryLabel);
      } else {
        return [...prev, subcategoryLabel];
      }
    });
  };

  const toggleSubcategoryDropdown = () => {
    if (stepData.productType) {
      setIsSubcategoryDropdownOpen(prev => !prev);
    }
  };

  const removeSubcategory = (subcatToRemove) => {
    setSelectedSubcategories(prev => prev.filter(s => s !== subcatToRemove));
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSubcategoryDropdownOpen && !event.target.closest('.subcategory-dropdown-container')) {
        setIsSubcategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSubcategoryDropdownOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Join selected subcategories as comma-separated string for backend compatibility
    const dataToSubmit = {
      ...stepData,
      category: selectedSubcategories.join(', ')
    };
    updateFormData(dataToSubmit);
    onNext(dataToSubmit);
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
          {/* Product Type Dropdown */}
          <div className="group">
            <label className="block text-sm font-bold text-slate-600 mb-2">
              {t('form.step1.productType') || "Product Type"} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="productType"
                value={stepData.productType}
                onChange={handleProductTypeChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                required
              >
                <option value="">{t('form.step1.selectProductType') || "Select Product Type"}</option>
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {currentLanguage === 'bn' ? category.bn : category.en}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          {/* Sub-Categories Collapsible Multi-Select Dropdown */}
          <div className="subcategory-dropdown-container relative">
            <label className="block text-sm font-bold text-slate-600 mb-2">
              {t('form.step1.category') || "Category"} <span className="text-red-500">*</span>
            </label>

            {/* Main Dropdown Box */}
            <div
              onClick={toggleSubcategoryDropdown}
              className={`relative w-full px-4 py-3 rounded-xl border border-slate-200 min-h-[48px] transition-all ${!stepData.productType
                ? 'opacity-50 cursor-not-allowed bg-slate-100'
                : 'bg-slate-50 hover:bg-white hover:border-blue-300 cursor-pointer'
                }`}
            >
              {/* Content: Placeholder or Selected Tags */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 flex flex-wrap gap-2">
                  {!stepData.productType ? (
                    <span className="text-slate-400 text-sm">
                      {t('form.step1.noSubCategoriesAvailable') || "Please select a product type first"}
                    </span>
                  ) : selectedSubcategories.length > 0 ? (
                    selectedSubcategories.map((subcat, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium"
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle
                      >
                        {subcat}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSubcategory(subcat);
                          }}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove ${subcat}`}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">
                      {t('form.step1.selectSubCategories') || "Select Sub-Categories"}
                    </span>
                  )}
                </div>

                {/* Dropdown Icon */}
                {stepData.productType && (
                  <div className={`text-slate-400 transition-transform duration-200 ${isSubcategoryDropdownOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Dropdown Menu */}
            {/* Expandable Dropdown Menu */}
            {/* Expandable Dropdown Menu */}
            {isSubcategoryDropdownOpen && stepData.productType && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                <div className="p-1">
                  {PRODUCT_CATEGORIES.find(cat => cat.id === stepData.productType)?.subcategories.map(subcat => {
                    const label = currentLanguage === 'bn' ? subcat.bn : subcat.en;
                    return (
                      <label
                        key={subcat.id}
                        // flex-row: পাশাপাশি রাখবে
                        // items-center: লম্বালম্বিভাবে মাঝখানে রাখবে
                        // justify-between: লেখা এবং চেকবক্স দুই প্রান্তে রাখবে
                        // w-full: পুরো জায়গা নিবে
                        className="flex flex-row items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
                      >
                        {/* Text Side */}
                        <span className="text-sm text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          {label}
                        </span>

                        {/* Checkbox Side */}
                        {/* shrink-0: যাতে চেকবক্স চ্যাপ্টা না হয়ে যায় */}
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(label)}
                          onChange={() => handleSubcategoryToggle(label)}
                          className="w-4 h-4 accent-blue-500 rounded cursor-pointer border-slate-300 ml-3 shrink-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Selection Count */}
            {selectedSubcategories.length > 0 && (
              <div className="mt-2 text-xs text-slate-500">
                {selectedSubcategories.length} {t('form.step1.subcategoriesSelected') || "selected"}
              </div>
            )}
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
          {t('form.buttons.next') || "Next"} <FaArrowRight />
        </button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;