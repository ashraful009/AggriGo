import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaEdit,
  FaCheckCircle,
  FaDraftingCompass,
  FaFilePdf,
  FaIndustry,
  FaBoxOpen,
  FaChartLine,
  FaUserTie,
  FaLock,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import ProfilePicture from '../components/ProfilePicture';

// ✅ Lazy-load VisualGallery — defers this heavy component until after the
// critical dashboard content is already painted.
const VisualGallery = lazy(() => import('../components/VisualGallery'));

// Suspense fallback shown while VisualGallery chunk is loading
const GalleryFallback = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex justify-center">
    <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isProductShowcaseComplete, setIsProductShowcaseComplete] = useState(false);
  const [missingItems, setMissingItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    fetchBusinessData();
    const handleDataUpdate = (event) => {
      if (event.detail) {
        setBusinessData(event.detail);
        setLoading(false);
      }
    };
    window.addEventListener('business-data-updated', handleDataUpdate);
    return () => {
      window.removeEventListener('business-data-updated', handleDataUpdate);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const fetchBusinessData = async () => {
    try {
      const response = await api.get('/business');
      if (response.data.success) {
        setBusinessData(response.data.data);
        const pct = response.data.completionPercentage ?? 0;
        const showcase = response.data.isProductShowcaseComplete ?? false;
        const missing = response.data.missingItems ?? [];
        setCompletionPercentage(pct);
        setIsProductShowcaseComplete(showcase);
        setMissingItems(missing);

        // Show toast when agreement conditions are NOT yet met
        if (pct < 80 || !showcase) {
          setShowToast(true);
          toastTimerRef.current = setTimeout(() => setShowToast(false), 8000);
        }
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Returns true if the given keyword appears in any missingItems entry
  const isSectionMissing = (keyword) =>
    missingItems.some(item => item.toLowerCase().includes(keyword.toLowerCase()));

  const canDownload = completionPercentage >= 80 && isProductShowcaseComplete;

  const getTooltipText = () => {
    if (completionPercentage < 80 && !isProductShowcaseComplete)
      return 'Complete ≥80% of your profile and add product images to unlock.';
    if (completionPercentage < 80)
      return `Complete at least 80% of your profile (currently ${completionPercentage}%).`;
    return 'Add product images, name, description and wholesale price to unlock.';
  };

  const downloadPDF = async () => {
    if (!canDownload) return;
    try {
      const response = await api.get('/business/download-pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SRIJON_Profile_${user?.name.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF.');
    }
  };

  // ─── Local wrapper: InfoItem pre-filled with translated 'Not Provided' ───
  const DashInfoItem = ({ label, value }) => (
    <InfoItem label={label} value={value} notProvided={t('dashboard.notProvided')} />
  );

  // ─── LOADING STATE ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-emerald-800 font-medium">{t('dashboard.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── NO DATA YET ───────────────────────────────────────────────────
  if (!businessData) {
    // Admin bypass
    if (user?.role === 'admin') {
      return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
            <div className="max-w-lg w-full text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChartLine size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome, Admin</h2>
              <p className="text-gray-500 mb-8">
                You have full access to the manager panel. Use the links below to view analytics and browse all business registrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/analytics')}
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg"
                >
                  <FaChartLine /> Analytics Dashboard
                </button>
                <button
                  onClick={() => navigate('/manager/business')}
                  className="flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-violet-700 transition shadow-lg"
                >
                  Business Directory
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    // Regular user — prompt to fill wizard
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaDraftingCompass size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('dashboard.welcome')}</h2>
            <p className="text-gray-600 mb-8 text-lg">{t('dashboard.noDataMessage')}</p>
            <button
              onClick={() => navigate('/agreement')}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1"
            >
              {t('dashboard.startWizard')}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── MAIN DASHBOARD ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 md:px-6 py-6 space-y-5">

        {/* ─── TOAST NOTIFICATION ─────────────────────────────────── */}
        {showToast && (
          <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-2xl shadow animate-fade-in">
            <FaExclamationTriangle className="mt-0.5 flex-shrink-0 text-red-500 text-xl" />
            <div className="flex-1">
              <p className="font-bold text-sm">{t('dashboard.toast.title')}</p>
              <p className="text-xs mt-1 leading-relaxed">
                {t('dashboard.toast.message')} <strong>80%</strong>{' '}
                ({t('dashboard.profileCompletion')}{' '}
                <strong className={completionPercentage >= 80 ? 'text-green-700' : 'text-red-700'}>
                  {completionPercentage}%
                </strong>){' '}
                {t('dashboard.toast.and')} <strong>{t('dashboard.toast.uploadPhotos')}</strong>.{' '}
                <span className="underline font-semibold">{t('dashboard.toast.checkRedSections')}</span>
              </p>
            </div>
            <button
              onClick={() => { setShowToast(false); clearTimeout(toastTimerRef.current); }}
              className="text-red-400 hover:text-red-600 ml-auto flex-shrink-0"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — TOP ACTION BAR
        ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
          {/* Left: title + status */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
            {businessData.submissionStatus === 'submitted' ? (
              <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                <FaCheckCircle /> {t('dashboard.status.active')}
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                <FaDraftingCompass /> {t('dashboard.status.draft')}
              </span>
            )}
          </div>

          {/* Right: PDF icon button + Edit button */}
          <div className="flex items-center gap-3">
            {/* PDF Download */}
            <div className="relative group">
              <button
                onClick={downloadPDF}
                disabled={!canDownload}
                className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl border transition-all text-xs font-semibold min-w-[80px]
                  ${canDownload
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 cursor-pointer'
                    : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
              >
                {canDownload
                  ? <FaFilePdf className="text-2xl text-emerald-600" />
                  : <FaLock className="text-2xl text-gray-400" />
                }
                <span className="leading-tight text-center">{t('dashboard.buttons.downloadPDF')}</span>
              </button>
              {/* Tooltip */}
              {!canDownload && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-center">
                  {getTooltipText()}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                </div>
              )}
            </div>

            {/* Edit Profile */}
            <button
              onClick={() => navigate('/wizard', { state: { editMode: true } })}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all shadow text-sm font-bold whitespace-nowrap"
            >
              <FaEdit /> {t('dashboard.buttons.editProfile')}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2 — FULL-WIDTH PROGRESS BAR
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-600">{t('dashboard.profileCompletion')}</span>
            <span className={`text-sm font-bold ${completionPercentage >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${completionPercentage >= 80 ? 'bg-emerald-500' : 'bg-amber-400'}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          {completionPercentage < 80 && (
            <p className="text-xs text-gray-400 mt-1.5">
              {t('dashboard.progressHint')}
            </p>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — PROFILE PICTURE (1/3) + OWNER INFORMATION (2/3)
        ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile picture card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-3">
            <ProfilePicture user={user} onUpdate={fetchBusinessData} />
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">{businessData.brandName || t('dashboard.myBrand')}</h3>
              <p className="text-sm text-gray-500">{businessData.ownerName || '—'}</p>
              <p className="text-xs text-gray-400 mt-1">{t('dashboard.welcomeUser')}{user?.name}</p>
            </div>
          </div>

          {/* Owner information card */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <SectionHeader icon={<FaUserTie />} title={t('dashboard.sections.ownerInformation')} />
            <div className="p-6 grid grid-cols-2 gap-x-10 gap-y-4">
              <DashInfoItem label={t('dashboard.labels.ownerName')} value={businessData.ownerName} />
              <DashInfoItem label={t('dashboard.labels.gender')} value={businessData.gender} />
              <DashInfoItem label={t('dashboard.labels.age')} value={businessData.ownerAge} />
              <DashInfoItem label={t('dashboard.labels.ownershipType')} value={businessData.ownershipType} />
              <DashInfoItem label={t('dashboard.labels.partnerName')} value={businessData.partnerName} />
              <DashInfoItem label={t('dashboard.labels.mobile')} value={businessData.mobileNumber ? `+880 ${businessData.mobileNumber}` : null} />
              <DashInfoItem label={t('dashboard.labels.email')} value={businessData.email} />
              <DashInfoItem label={t('dashboard.labels.whatsApp')} value={businessData.whatsappNumber} />
              <DashInfoItem label={t('dashboard.labels.division')} value={businessData.division} />
              <DashInfoItem label={t('dashboard.labels.district')} value={businessData.district} />
              <DashInfoItem label={t('dashboard.labels.thana')} value={businessData.thana} />
              <DashInfoItem label={t('dashboard.labels.postCode')} value={businessData.postCode} />
              <div className="col-span-2">
                <DashInfoItem label={t('dashboard.labels.detailedAddress')} value={businessData.detailedAddress} />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4 — PRODUCT DETAILS (full-width)
        ═══════════════════════════════════════════════════════════ */}
        <div className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${isSectionMissing('product showcase')
          ? 'border-2 border-red-400 ring-2 ring-red-100'
          : 'border border-gray-100'
          }`}>
          <SectionHeader
            icon={<FaBoxOpen />}
            title={t('dashboard.sections.productProduction')}
            warning={isSectionMissing('product showcase')}
            incompleteLabel={t('dashboard.incomplete')}
          />
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5">
              <DashInfoItem label={t('dashboard.labels.productName')} value={businessData.productName} />
              <DashInfoItem label={t('dashboard.labels.brandName')} value={businessData.brandName} />
              <DashInfoItem label={t('dashboard.labels.category')} value={businessData.category} />
              <DashInfoItem label={t('dashboard.labels.productType')} value={businessData.productType} />
              <DashInfoItem label={t('dashboard.labels.wholesalePrice')} value={businessData.wholesalePrice ? `৳${businessData.wholesalePrice}` : null} />
              <DashInfoItem label={t('dashboard.labels.retailPrice')} value={businessData.retailPrice ? `৳${businessData.retailPrice}` : null} />
              <DashInfoItem label={t('dashboard.labels.moq')} value={businessData.moq} />
              <DashInfoItem label={t('dashboard.labels.bulkDiscount')} value={businessData.bulkDiscount} />
              <DashInfoItem label={t('dashboard.labels.productionType')} value={businessData.productionType} />
              <DashInfoItem label={t('dashboard.labels.rawMaterial')} value={businessData.rawMaterialSource} />
              <DashInfoItem label={t('dashboard.labels.place')} value={businessData.productionPlace} />
              <DashInfoItem label={t('dashboard.labels.capacity')} value={businessData.productionCapacity} />
              <DashInfoItem label={`${t('dashboard.labels.male')} ${t('dashboard.labels.workforce')}`} value={businessData.maleWorkers} />
              <DashInfoItem label={`${t('dashboard.labels.female')} ${t('dashboard.labels.workforce')}`} value={businessData.femaleWorkers} />

            </div>
            {businessData.shortDescription && (
              <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('dashboard.labels.productDescription')}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{businessData.shortDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5 — MARKET & BUSINESS STATUS (full-width)
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <SectionHeader icon={<FaChartLine />} title={t('dashboard.sections.marketStatus')} />
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5">
              <DashInfoItem label={t('dashboard.metrics.businessAge')} value={businessData.businessAge ? `${businessData.businessAge} ${t('dashboard.years')}` : null} />
              <DashInfoItem label={t('dashboard.metrics.monthlySales')} value={businessData.monthlySales ? `৳${businessData.monthlySales}` : null} />
              <DashInfoItem label={t('dashboard.metrics.totalCustomers')} value={businessData.totalCustomers} />
              <DashInfoItem label={t('dashboard.labels.regularCustomers')} value={businessData.regularCustomers} />
              <DashInfoItem label={t('dashboard.labels.exportInterest')} value={businessData.interestInOnlineExport} />
              <DashInfoItem label={t('dashboard.labels.bankAccount')} value={businessData.hasBankAccount} />
              <DashInfoItem label={t('dashboard.labels.bankName')} value={businessData.bankName} />
              <DashInfoItem label={t('dashboard.labels.accountNumber')} value={businessData.accountNumber} />
            </div>

            {/* Future Goals & Badges */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-lime-50 rounded-xl p-4 border border-lime-100">
                <p className="text-xs font-bold text-lime-700 uppercase mb-2">{t('dashboard.futureGoals.title')}</p>
                <p className="text-sm text-lime-900/80 leading-relaxed">
                  {businessData.futureGoals || t('dashboard.futureGoals.noGoals')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 content-start pt-1">
                {businessData.interestInOnlineExport && <Badge text={t('dashboard.badges.exportInterest')} />}
                {businessData.needFunding && <Badge text={t('dashboard.badges.needFunding')} />}
                {businessData.needTraining && <Badge text={t('dashboard.badges.needTraining')} />}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 6 — MEDIA & DOCUMENTS (Visual Gallery)
        ═══════════════════════════════════════════════════════════ */}
        <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${isSectionMissing('gallery') ? 'ring-2 ring-red-400 ring-offset-2' : ''
          }`}>
          {isSectionMissing('gallery') && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-xs font-bold px-4 py-2 rounded-t-2xl">
              <FaExclamationTriangle />
              {t('dashboard.toast.galleryImagesMissing')}
            </div>
          )}
          <Suspense fallback={<GalleryFallback />}>
            <VisualGallery onUpdate={fetchBusinessData} />
          </Suspense>
        </div>

      </div>{/* end flex-1 container */}

      <Footer />
    </div>
  );
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

// Section header with icon, title, and optional warning indicator
const SectionHeader = ({ icon, title, warning, incompleteLabel }) => (
  <div className={`px-6 py-4 border-b flex items-center gap-2.5 ${warning ? 'bg-red-50 border-red-200' : 'bg-gray-50/60 border-gray-100'
    }`}>
    <span className={`text-lg ${warning ? 'text-red-500' : 'text-emerald-500'}`}>{icon}</span>
    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
    {warning && (
      <span className="ml-auto inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
        <FaExclamationTriangle className="text-xs" /> {incompleteLabel}
      </span>
    )}
  </div>
);

// Standard label-value pair — shows translated 'Not Provided' if value is empty
const InfoItem = ({ label, value, notProvided }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-gray-700">
      {value || <span className="text-gray-300 font-normal italic">{notProvided}</span>}
    </p>
  </div>
);

// Badge chip used for business attributes
const Badge = ({ text }) => (
  <span className="bg-lime-100 text-lime-800 text-xs px-3 py-1.5 rounded-full border border-lime-200 font-semibold">
    {text}
  </span>
);

export default Dashboard;