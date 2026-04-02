import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import bangladeshLocations from '../../data/bangladesh-locations.json';

const PRODUCT_CATEGORIES = [
  { id: 'handicrafts', en: 'Handicrafts & Heritage', bn: 'হস্তশিল্প ও ঐতিহ্যবাহী পণ্য', subcategories: [ { id: 'nakshi-kantha', en: 'Nakshi Kantha', bn: 'নকশিকাঁথা' }, { id: 'bamboo-cane-jute', en: 'Bamboo, Cane & Jute Products', bn: 'বাঁশ, বেত ও পাটজাত পণ্য' }, { id: 'pottery', en: 'Pottery', bn: 'মৃৎশিল্প' }, { id: 'folk-art', en: 'Folk Art & Decor', bn: 'লোকজ শিল্প ও ডেকোর আইটেম' } ] },
  { id: 'fashion', en: 'Fashion & Lifestyle', bn: 'ফ্যাশন ও লাইফস্টাইল', subcategories: [ { id: 'ethnic-clothing', en: 'Clothing Ethnic & Fusion', bn: 'পোশাক দেশি ও ফিউশন' }, { id: 'boutique-designer', en: 'Boutique & Designer Wear', bn: 'বুটিক ও ডিজাইনার ওয়্যার' }, { id: 'jewelry', en: 'Jewelry', bn: 'গহনা ও জুয়েলারি' }, { id: 'bags-shoes-accessories', en: 'Bags, Shoes & Accessories', bn: 'ব্যাগ, জুতা ও এক্সেসরিজ' } ] },
  { id: 'home-decor', en: 'Home Decor & Household', bn: 'হোম ডেকোর ও হাউসহোল্ড পণ্য', subcategories: [ { id: 'home-decor-items', en: 'Home Decor Items', bn: 'হোম ডেকোর আইটেম' }, { id: 'kitchenware', en: 'Kitchenware', bn: 'কিচেনওয়্যার' }, { id: 'home-textile', en: 'Home Textile', bn: 'হোম টেক্সটাইল' }, { id: 'gift-utility', en: 'Gift & Utility Products', bn: 'গিফট ও ইউটিলিটি পণ্য' } ] },
  { id: 'organic-agro', en: 'Organic & Agro', bn: 'অরগানিক ও অ্যাগ্রো', subcategories: [ { id: 'deshiyo-organic-food', en: 'Local Organic Food', bn: 'দেশীয় অর্গানিক খাদ্য' }, { id: 'natural-products', en: 'Natural Products', bn: 'প্রাকৃতিক পণ্য' } ] }
];

// Units removed as requested. We'll use simple stock counts.

/* ── shared input style ── */
const inputBase = (hasError) =>
  `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 placeholder-slate-400 ${
    hasError
      ? 'border-red-300 bg-red-50/60 focus:ring-red-400'
      : 'border-blue-100 hover:border-blue-300'
  }`;

/* ── section card ── */
const Card = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl p-6 space-y-5 border border-blue-100/60 shadow-sm ${className}`}
    style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}
  >
    {children}
  </div>
);

/* ── section header ── */
const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 pb-1 border-b border-blue-50">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}
    >
      {icon}
    </div>
    <div>
      <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', description: '', category: '', subCategory: '', price: '',
    discountPercentage: '', unit: '', stock: '',
    weightPerUnit: '', weightUnit: 'kg',
    division: '', district: '', upazila: '',
  });
  const [images, setImages]         = useState([]);
  const [newFiles, setNewFiles]     = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [uploading, setUploading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]         = useState({});
  const [districts, setDistricts]   = useState([]);
  const [thanas,    setThanas]      = useState([]);

  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (form.division) {
      const div = bangladeshLocations.find(d => d.division === form.division);
      setDistricts(div?.districts || []);
    } else { setDistricts([]); }
  }, [form.division]);

  useEffect(() => {
    if (form.district && districts.length > 0) {
      const dist = districts.find(d => d.name === form.district);
      setThanas(dist?.thanas || []);
    } else { setThanas([]); }
  }, [form.district, districts]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/my-products`);
      const product = data.data.find((p) => p._id === id);
      if (product) {
        setForm({
          name: product.name, description: product.description,
          category: product.category, subCategory: product.subCategory || '', price: product.price,
          discountPercentage: product.discountPercentage || '', unit: product.unit || '',
          stock: product.stock,
          weightPerUnit: product.weightPerUnit || '',
          weightUnit: product.weightUnit || 'kg',
          division: product.location?.division || '',
          district: product.location?.district || '',
          upazila: product.location?.upazila || '',
        });
        setImages(product.images || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'division') {
      setForm(prev => ({ ...prev, division: value, district: '', upazila: '' }));
    } else if (name === 'district') {
      setForm(prev => ({ ...prev, district: value, upazila: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + newFiles.length > 5) {
      alert('Maximum 5 images allowed'); return;
    }
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  const removeNewFile = (i) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const uploadImages = async () => {
    if (newFiles.length === 0) return [];
    const uploaded = [];
    for (const file of newFiles) {
      const fd = new FormData(); fd.append('file', file);
      const { data } = await api.post('/upload/single', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      uploaded.push({ url: data.url, publicId: data.publicId });
    }
    return uploaded;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Product name is required';
    const isDescriptionEmpty = !form.description || form.description.replace(/<(.|\n)*?>/g, '').trim().length === 0;
    if (isDescriptionEmpty) e.description = 'Description is required';
    if (!form.category)           e.category    = 'Please select a category';
    if (!form.price || form.price <= 0) e.price = 'Valid price is required';
    if (form.discountPercentage && (Number(form.discountPercentage) >= 100 || Number(form.discountPercentage) < 0))
      e.discountPercentage = 'Percentage must be between 1 and 99';
    if (!form.stock && form.stock !== 0) e.stock = 'Stock quantity is required';
    if (images.length + newFiles.length === 0) e.images = 'At least one image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true); setUploading(true);
    try {
      const uploadedImages = await uploadImages();
      setUploading(false);
      const payload = {
        name: form.name, description: form.description,
        category: form.category, subCategory: form.subCategory, price: Number(form.price),
        discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : 0,
        unit: form.unit, stock: Number(form.stock),
        weightPerUnit: form.weightPerUnit ? Number(form.weightPerUnit) : 0,
        weightUnit: form.weightUnit,
        images: [...images, ...uploadedImages],
        location: { division: form.division, district: form.district, upazila: form.upazila },
      };
      isEdit ? await api.put(`/products/${id}`, payload) : await api.post('/products', payload);
      navigate('/seller/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally { setSubmitting(false); setUploading(false); }
  };

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen pb-16"
        style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #e8f3ff 40%, #f0f9ff 100%)' }}
      >
        {/* ── Hero header ── */}
        <div
          className="relative overflow-hidden mb-8"
          style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #0ea5e9 100%)' }}
        >
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
               style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-5 pointer-events-none"
               style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translateY(50%)' }} />
          
          {/* Floating stickers for sellers */}
          <div className="absolute top-4 right-20 text-4xl animate-bounce hidden sm:block opacity-40 hover:opacity-100 hover:scale-125 transition-all cursor-default">🥕</div>
          <div className="absolute bottom-4 left-10 text-4xl rotate-12 hidden md:block opacity-30 hover:opacity-100 hover:rotate-0 transition-all cursor-default">🎨</div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm font-medium mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                {isEdit ? '✏️' : '🌱'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isEdit ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-blue-200 text-sm mt-0.5">
                  {isEdit
                    ? 'Update your product details below'
                    : 'Fill in the details — your product will be reviewed before going live'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Basic Info */}
            <Card>
              <SectionTitle icon="📋" title="Basic Information" subtitle="Name, description and category" />

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Fresh Tomato"
                  className={inputBase(errors.name)}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="quill-container">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Description <span className="text-red-400">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(val) => {
                    setForm(prev => ({ ...prev, description: val }));
                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                  }}
                  className="bg-white/80 rounded-xl overflow-hidden"
                  placeholder="Describe your product — quality, origin, how it's grown..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                
                <style>{`
                  .quill-container .ql-toolbar {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    border-color: #dbeafe;
                    background: #f8fbff;
                  }
                  .quill-container .ql-container {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    border-color: #dbeafe;
                    min-height: 160px;
                    font-family: inherit;
                  }
                  .quill-container .ql-editor { font-size: 14px; min-height: 160px; }
                  .quill-container .ql-editor.ql-blank::before { color: #94a3b8; font-style: normal; }
                `}</style>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category" value={form.category} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm(prev => ({ ...prev, category: val, subCategory: '' }));
                      if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                    }}
                    className={inputBase(errors.category)}
                  >
                    <option value="">Select a category</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.en}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>

                {/* Subcategory — only if a main category is selected */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Sub-Category
                  </label>
                  {(() => {
                    const catDef = PRODUCT_CATEGORIES.find(c => c.id === form.category);
                    const subs = catDef?.subcategories || [];
                    return (
                      <select
                        name="subCategory" value={form.subCategory} onChange={handleChange}
                        className={inputBase(false)}
                        disabled={!subs.length}
                      >
                        <option value="">{subs.length ? "Select sub-category" : "N/A"}</option>
                        {subs.map(s => (
                          <option key={s.id} value={s.en}>{s.en}</option>
                        ))}
                      </select>
                    );
                  })()}
                </div>
              </div>
            </Card>

            {/* Pricing & Stock */}
            <Card>
              <SectionTitle icon="💰" title="Pricing & Stock" subtitle="Set price, discount and quantity" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Original Price (৳) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-sm">৳</span>
                    <input
                      type="number" name="price" value={form.price} onChange={handleChange}
                      placeholder="0.00"
                      className={`${inputBase(errors.price)} pl-8`}
                    />
                  </div>
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Discount Percentage (%)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 font-bold text-sm">%</span>
                    <input
                      type="number" name="discountPercentage" value={form.discountPercentage} onChange={handleChange}
                      placeholder="e.g. 10"
                      className={`${inputBase(false)} pl-8`}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Enter a number from 1 to 99</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" name="stock" value={form.stock} onChange={handleChange}
                    placeholder="0"
                    className={inputBase(errors.stock)}
                  />
                  {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Unit Weight (Optional)
                  </label>
                  <input
                    type="number" name="weightPerUnit" value={form.weightPerUnit} onChange={handleChange}
                    placeholder="e.g. 500"
                    className={inputBase(false)}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Weight Unit (kg/gm)
                  </label>
                  <select
                    name="weightUnit" value={form.weightUnit} onChange={handleChange}
                    className={inputBase(false)}
                  >
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                    <option value="liter">liter</option>
                    <option value="ton">ton</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Images */}
            <Card>
              <SectionTitle icon="🖼️" title="Product Images" subtitle="Upload up to 5 images. First image = main image." />

              {/* existing images */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.url} alt="" className="w-20 h-20 object-cover rounded-xl border-2 border-blue-100" />
                      <button type="button" onClick={() => removeExistingImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* new previews */}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {previews.map((p, i) => (
                    <div key={i} className="relative group">
                      <img src={p} alt="" className="w-20 h-20 object-cover rounded-xl border-2 border-blue-300" />
                      <div className="absolute inset-0 rounded-xl bg-blue-500/10" />
                      <button type="button" onClick={() => removeNewFile(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* upload zone */}
              {images.length + newFiles.length < 5 && (
                <label
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 group"
                  style={{ borderColor: '#93c5fd' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#93c5fd'}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3 transition-colors group-hover:bg-blue-100">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">Click to upload images</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG · up to 5MB each · max {5 - images.length - newFiles.length} more</p>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
              {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
            </Card>

            {/* Location */}
            <Card>
              <SectionTitle icon="📍" title="Location" subtitle="Where is this product from?" />
              <div className="grid grid-cols-3 gap-4">
                {/* Division */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Division
                  </label>
                  <select
                    name="division" value={form.division} onChange={handleChange}
                    className={inputBase(false)}
                  >
                    <option value="">Select Division</option>
                    {bangladeshLocations.map(d => <option key={d.division} value={d.division}>{d.division}</option>)}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    District
                  </label>
                  <select
                    name="district" value={form.district} onChange={handleChange}
                    disabled={!form.division}
                    className={inputBase(false)}
                  >
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Upazila / Thana
                  </label>
                  <select
                    name="upazila" value={form.upazila} onChange={handleChange}
                    disabled={!form.district}
                    className={inputBase(false)}
                  >
                    <option value="">Select Upazila</option>
                    {thanas.map(th => <option key={th} value={th}>{th}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* Submit row */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/seller/dashboard')}
                className="flex-1 py-3.5 border border-blue-200 text-slate-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 text-white font-bold rounded-xl transition-all text-sm shadow-lg disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: submitting ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >
                {uploading
                  ? '⬆️ Uploading images…'
                  : submitting
                  ? '💾 Saving…'
                  : isEdit
                  ? '✓ Save Changes'
                  : '🚀 Submit for Approval'}
              </button>
            </div>

            {!isEdit && (
              <p className="text-center text-xs text-slate-400 pb-4">
                ✓ Your product will be reviewed by an admin before going live
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}