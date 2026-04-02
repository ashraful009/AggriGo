import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import ImageCard from '../components/ImageCard';
import Footer from '../components/Footer';
import {
  FaRocket, FaChartLine, FaHandshake, FaGlobe,
  FaArrowRight, FaLightbulb, FaUsers, FaCheckCircle
} from 'react-icons/fa';

import bannerImage from '../assets/banner/banner.png';
import img1 from '../assets/productImage/img1.jpg';
import img2 from '../assets/productImage/img2.jpg';
import img3 from '../assets/productImage/img3.jpg';
import img4 from '../assets/productImage/img4.jpg';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [latestProducts, setLatestProducts] = useState([]);
  const [cartLoading, setCartLoading] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    api.get('/products/public?limit=8')
      .then(res => {
        if (res.data.success) setLatestProducts(res.data.data);
      })
      .catch(err => console.error('Failed to load products for homepage:', err));
  }, []);

  const handleAddToCart = async (product, silent = false) => {
    const p = latestProducts.find(i => i._id === (product._id || product)) || product;
    const productId = p._id;
    
    if (!silent) setCartLoading(productId);
    try {
      if (!isAuthenticated) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items":[], "totalAmount":0}');
        const existingItem = guestCart.items.find(item => item.product === productId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else (guestCart.items.push({
            product: productId,
            name: p.name,
            price: p.discountPrice || p.price,
            originalPrice: p.price,
            discountPercentage: p.discountPercentage || 0,
            image: p.images?.[0]?.url || '',
            quantity: 1,
            unit: p.unit,
            seller: p.seller
          }));
        
        guestCart.totalAmount = guestCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        setAddedToCart(prev => ({ ...prev, [productId]: true }));
        window.dispatchEvent(new Event('cart-updated'));
        return;
      }

      await api.post('/cart/add', { productId, quantity: 1 });
      setAddedToCart(prev => ({ ...prev, [productId]: true }));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) { 
      if (!silent) alert(err.response?.data?.message || 'Failed to add to cart'); 
    }
    finally { if (!silent) setCartLoading(null); }
  };

  const handleBuyNow = async (product) => {
    const productId = product._id || product;
    setCartLoading(`buynow-${productId}`);
    try {
      await handleAddToCart(product, true);
      navigate('/checkout');
    } catch (err) {
      console.error('Buy Now failed:', err);
    } finally {
      setCartLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-900"
      style={{ background: 'linear-gradient(160deg, #eef4ff 0%, #f5f9ff 40%, #dbeafe 100%)' }}
    >
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full overflow-hidden">
        <img src={bannerImage} alt="Banner" className="w-full h-auto object-cover block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2B4B]/10 to-[#2563eb]/10"></div>
      </section>

      {/* --- STATS / TRUST BAR --- */}
      <section className="relative mt-4 md:-mt-16 z-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div
            className="rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e8f0fe 100%)',
              border: '1.5px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
              borderTop: '2px solid #bfdbfe',
            }}
          >
            <StatItem
              icon={<FaUsers className="text-[#2563eb]" />}
              number={<span style={{ background: 'linear-gradient(to right, #1B2B4B, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', fontSize: '24px' }}>{t('home.stats.entrepreneursValue')}</span>}
              label={t('home.stats.entrepreneurs')}
            />
            <StatItem
              icon={<FaChartLine className="text-[#2563eb]" />}
              number={<span style={{ background: 'linear-gradient(to right, #1B2B4B, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', fontSize: '24px' }}>{t('home.stats.revenueValue')}</span>}
              label={t('home.stats.revenue')}
            />
            <StatItem
              icon={<FaCheckCircle className="text-[#2563eb]" />}
              number={<span style={{ background: 'linear-gradient(to right, #1B2B4B, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', fontSize: '24px' }}>{t('home.stats.successRateValue')}</span>}
              label={t('home.stats.successRate')}
            />
          </div>
        </div>
      </section>

      {/* --- REGISTER + LEARN MORE BUTTONS --- */}
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center my-12 px-4">
          <Link
            to="/register"
            className="px-8 py-4 text-white font-bold rounded-lg text-lg transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #1B2B4B 0%, #2563eb 55%, #5BA4CF 100%)',
              boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
            }}
          >
            {t('home.hero.cta')}
            <FaArrowRight />
          </Link>

          <Link
            to="/about"
            className="px-8 py-4 rounded-lg text-lg font-medium text-[#1B2B4B] transition-all text-center hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #2563eb, #5BA4CF) border-box',
              border: '1.5px solid transparent',
            }}
          >
            {t('home.hero.learnMore')}
          </Link>
        </div>
      )}

      {/* --- FEATURES SECTION --- */}
      <section
        className="py-24"
        style={{ background: 'linear-gradient(180deg, #f0f7ff 0%, #e8f0fe 100%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B2B4B] mb-4">
              {t('home.features.apart.title')}
            </h2>
            <div
              className="w-16 h-1 mx-auto rounded-full"
              style={{ background: 'linear-gradient(to right, #2563eb, #5BA4CF)' }}
            ></div>
            <p className="mt-4 text-[#3b5a8a] max-w-xl mx-auto">
              {t('home.features.apart.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={<FaRocket />}
              title={t('home.features.craftsmen.title')}
              desc={t('home.features.craftsmen.desc')}
            />
            <FeatureCard
              icon={<FaLightbulb />}
              title={t('home.features.quality.title')}
              desc={t('home.features.quality.desc')}
            />
            <FeatureCard
              icon={<FaHandshake />}
              title={t('home.features.collection.title')}
              desc={t('home.features.collection.desc')}
            />
            <FeatureCard
              icon={<FaGlobe />}
              title={t('home.features.experience.title')}
              desc={t('home.features.experience.desc')}
            />
          </div>

          <div className="container mx-auto px-4 mt-12">
            <div
              className="rounded-xl shadow-xl p-8"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 60%, #dbeafe 100%)',
                borderTop: '2px solid #bfdbfe',
                boxShadow: '0 8px 32px rgba(37,99,235,0.08)',
              }}
            >
              <h2
                className="text-2xl font-bold text-center mb-8"
                style={{ background: 'linear-gradient(to right, #1B2B4B, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {t('home.ourProducts.title')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {latestProducts.map(product => {
                  const isAdded = addedToCart[product._id];
                  const savings = product.price - (product.discountPrice || product.price);
                  const discountPct = product.discountPercent || (product.discountPrice ? Math.round((savings / product.price) * 100) : 0);
                  
                  return (
                    <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col group h-full">
                      <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-50">
                        {product.images?.[0] ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
                        )}
                        {product.discountPrice && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg shadow-rose-500/20 flex items-center gap-1 uppercase tracking-tighter">
                              {discountPct}% OFF
                            </span>
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                            <span className="bg-slate-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{t('home.ourProducts.stockOut')}</span>
                          </div>
                        )}
                      </Link>

                      <div className="p-3 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <Link to={`/product/${product._id}`} className="flex-1">
                            <h3 className="font-bold text-slate-800 text-[11px] sm:text-[13px] line-clamp-2 leading-tight hover:text-blue-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                          </Link>
                            <div className="flex flex-col items-end">
                              <p className="font-extrabold text-blue-600 text-sm sm:text-base leading-none">৳{product.discountPrice || product.price}</p>
                              {product.discountPrice && (
                                <div className="flex flex-col items-end mt-0.5">
                                  <p className="text-[10px] text-slate-400 line-through leading-none">৳{product.price}</p>
                                  <span className="text-[9px] font-black text-rose-500 mt-0.5">SAVE ৳{savings}</span>
                                </div>
                              )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-0.5 mb-3">
                           <p className="text-[10px] text-slate-400 font-medium line-clamp-1">Seller: {product.seller?.name}</p>
                           <p className="text-[10px] text-emerald-600 font-bold">
                             {product.stock > 9 ? 'Available' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                             {product.weightPerUnit > 0 && (
                               <span className="text-slate-400 font-medium ml-1">
                                 ({product.weightPerUnit}{product.weightUnit})
                               </span>
                             )}
                           </p>
                        </div>

                        <div className="mt-auto flex gap-2">
                           {isAdded ? (
                             <Link to="/cart" className="flex-1 py-1.5 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 text-[9px] sm:text-[10px] font-bold text-center">{t('home.ourProducts.addedToCart')} ✓</Link>
                           ) : (
                             <button 
                               onClick={() => handleAddToCart(product)}
                               disabled={cartLoading === product._id || product.stock === 0}
                               className="flex-[1.2] py-1.5 rounded-lg border border-blue-600 text-blue-600 text-[9px] sm:text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                             >
                               {cartLoading === product._id ? '...' : t('home.ourProducts.addToCart')}
                             </button>
                           )}
                           <button 
                             onClick={() => handleBuyNow(product)}
                             disabled={cartLoading === `buynow-${product._id}` || product.stock === 0}
                             className="flex-[1.5] py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] font-extrabold shadow-sm hover:shadow-blue-200 transition-all disabled:opacity-50"
                           >
                             {cartLoading === `buynow-${product._id}` ? '...' : t('home.ourProducts.buyNow')}
                           </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Fallbacks if there are no live products yet */}
                {latestProducts.length === 0 && (
                  <>
                    <ImageCard src={img1} alt="Product 1" />
                    <ImageCard src={img2} alt="Product 2" />
                    <ImageCard src={img3} alt="Product 3" />
                    <ImageCard src={img4} alt="Product 4" />
                  </>
                )}
              </div>
              
              {latestProducts.length > 0 && (
                <div className="text-center mt-8">
                  <Link to="/shop" className="inline-block px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors">
                    {t('home.ourProducts.viewAll')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
            <MiniFeature icon={<FaGlobe />} title={t('home.features.productShowcase.title')} desc={t('home.features.productShowcase.desc')} />
            <MiniFeature icon={<FaLightbulb />} title={t('home.features.trainingSupport.title')} desc={t('home.features.trainingSupport.desc')} />
            <MiniFeature icon={<FaHandshake />} title={t('home.features.businessNetworking.title')} desc={t('home.features.businessNetworking.desc')} />
            <MiniFeature icon={<FaChartLine />} title={t('home.features.globalReach.title')} desc={t('home.features.globalReach.desc')} />
            <MiniFeature icon={<FaCheckCircle />} title={t('home.features.marketingExport.title')} desc={t('home.features.marketingExport.desc')} />
          </div>
        </div>
      </section>

      {/* --- BIG CTA SECTION --- */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div
            className="rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #1B2B4B 0%, #2563eb 50%, #5BA4CF 100%)' }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: '#5BA4CF' }}
            ></div>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl opacity-20"
              style={{ background: '#1B2B4B' }}
            ></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('home.cta.title')}</h2>
              <p className="text-blue-100 text-lg mb-8">{t('home.cta.subtitle')}</p>

              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-block px-10 py-4 rounded-lg text-lg font-bold transition-colors shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(to right, #dbeafe, #eff6ff)',
                    color: '#1B2B4B',
                  }}
                >
                  {t('home.cta.button')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Helper Components ---
const MiniFeature = ({ icon, title, desc }) => (
  <div
    className="p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center hover:-translate-y-1"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
      border: '1.5px solid transparent',
      backgroundClip: 'padding-box',
      borderTop: '1.5px solid #bfdbfe',
    }}
  >
    <div className="text-xl mb-3 flex justify-center" style={{ color: '#2563eb' }}>{icon}</div>
    <h4 className="text-sm font-semibold text-[#1B2B4B] mb-1">{title}</h4>
    <p className="text-xs text-[#3b5a8a] leading-snug">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div
    className="p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 60%, #dbeafe 100%)',
      borderTop: '2px solid #bfdbfe',
      boxShadow: '0 2px 12px rgba(37,99,235,0.07)',
    }}
  >
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"
      style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#2563eb' }}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#1B2B4B] mb-3">{title}</h3>
    <p className="text-[#3b5a8a] leading-relaxed text-sm">{desc}</p>
  </div>
);

const StatItem = ({ icon, number, label }) => (
  <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
    <div
      className="text-4xl p-3 rounded-full"
      style={{ background: 'linear-gradient(135deg, #dbeafe, #eff6ff)' }}
    >
      {icon}
    </div>
    <div className="text-center md:text-left">
      <h4 className="text-3xl font-bold text-zinc-900">{number}</h4>
      <p className="text-sm text-[#3b5a8a] font-medium uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

export default HomePage;
