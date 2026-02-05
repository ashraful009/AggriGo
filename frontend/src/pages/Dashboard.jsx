import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  FaImages,
  FaFileContract,
  FaExternalLinkAlt,
  FaUserTie,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessData();
    const handleDataUpdate = (event) => {
      if (event.detail) {
        setBusinessData(event.detail);
        setLoading(false);
      }
    };
    window.addEventListener('business-data-updated', handleDataUpdate);
    return () => window.removeEventListener('business-data-updated', handleDataUpdate);
  }, []);

  const fetchBusinessData = async () => {
    try {
      const response = await api.get('/business');
      if (response.data.success) {
        setBusinessData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => navigate('/wizard');

  const downloadPDF = async () => {
    try {
      const response = await api.get('/business/download-pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AggriGo_Profile_${user?.name.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-emerald-800 font-medium">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaDraftingCompass size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to AggriGo!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              You haven't submitted your business registration yet. Let's build your profile together.
            </p>
            <button onClick={() => navigate('/wizard')} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1">
              Start Registration Wizard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      {/* --- DASHBOARD HEADER --- */}
      <div className="bg-emerald-900 pb-32 pt-12 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -ml-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
                {businessData.submissionStatus === 'submitted' ? (
                  <span className="bg-lime-500/20 text-lime-400 border border-lime-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center">
                    <FaCheckCircle className="mr-1.5" /> Live
                  </span>
                ) : (
                  <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center">
                    <FaDraftingCompass className="mr-1.5" /> Draft
                  </span>
                )}
              </div>
              <p className="text-emerald-100/80">Welcome back, {user?.name}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={downloadPDF} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-lg transition-all text-sm font-semibold backdrop-blur-sm">
                <FaFilePdf /> Download PDF
              </button>
              <button onClick={handleEdit} className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-emerald-950 px-5 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-lime-500/20 text-sm font-bold">
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 -mt-24 pb-12 relative z-20">

        {/* 1. KEY METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Business Age"
            value={businessData.businessAge ? `${businessData.businessAge} Years` : 'N/A'}
            icon={<FaIndustry />}
            color="blue"
          />
          <StatCard
            label="Monthly Sales"
            value={businessData.monthlySales ? `৳${businessData.monthlySales}` : 'N/A'}
            icon={<FaChartLine />}
            color="emerald"
          />
          <StatCard
            label="Total Customers"
            value={businessData.totalCustomers || 'N/A'}
            icon={<FaUserTie />}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 2. LEFT COLUMN (Info) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Product Info Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaBoxOpen className="text-emerald-600" /> Product & Production
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <InfoItem label="Product Name" value={businessData.productName} />
                <InfoItem label="Brand Name" value={businessData.brandName} />
                <InfoItem label="Category" value={businessData.category} />
                <InfoItem label="Product Type" value={businessData.productType} />
                <InfoItem label="Retail Price" value={businessData.retailPrice ? `৳${businessData.retailPrice}` : null} />
                <InfoItem label="Production Type" value={businessData.productionType} />
                <InfoItem label="Capacity" value={businessData.productionCapacity} />
                <InfoItem label="Place" value={businessData.productionPlace} />
                <div className="md:col-span-2 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Workforce</span>
                  <div className="flex gap-4 text-sm font-bold text-gray-700">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Male: {businessData.maleWorkers || 0}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Female: {businessData.femaleWorkers || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUAL GALLERY (Designed to not cut images) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaImages className="text-emerald-600" /> Visual Gallery
                </h3>
              </div>
              <div className="p-6">
                {/* Product Images */}
                {businessData.productImages?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Product Showcase</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {businessData.productImages.map((img, idx) => (
                        <ImageCard key={idx} src={img} label={`Product ${idx + 1}`} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Images */}
                {(businessData.packagingImage || businessData.productionProcessImage) && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Process & Packaging</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {businessData.packagingImage && (
                        <ImageCard src={businessData.packagingImage} label="Packaging" />
                      )}
                      {businessData.productionProcessImage && (
                        <ImageCard src={businessData.productionProcessImage} label="Production Process" />
                      )}
                    </div>
                  </div>
                )}

                {(!businessData.productImages?.length && !businessData.packagingImage && !businessData.productionProcessImage) && (
                  <p className="text-center text-gray-400 italic py-4">No images uploaded yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* 3. RIGHT COLUMN (Identity & Docs) */}
          <div className="space-y-8">

            {/* Identity Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 text-center border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 shadow-md flex items-center justify-center text-3xl font-bold text-emerald-600 border border-emerald-100">
                  {businessData.brandName ? businessData.brandName.charAt(0).toUpperCase() : 'B'}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{businessData.brandName || "My Brand"}</h3>
                <p className="text-sm text-gray-500">{businessData.ownerName}</p>
              </div>
              <div className="p-6 space-y-3">
                <ContactRow icon={<FaMapMarkerAlt />} text={`${businessData.thana}, ${businessData.district}`} />
                <ContactRow icon="@" text={businessData.email} />
                <ContactRow icon="📞" text={`+880${businessData.mobileNumber}`} />
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaFileContract className="text-emerald-600" /> Documents
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <DocLink title="Trade License" file={businessData.registrationDocuments?.tradeLicenseFile} />
                <DocLink title="TIN Certificate" file={businessData.registrationDocuments?.tinFile} />
                <DocLink title="BSTI Certificate" file={businessData.registrationDocuments?.bstiFile} />
                <DocLink title="Export License" file={businessData.registrationDocuments?.exportLicenseFile} />
              </div>
            </div>

            {/* Future Goals */}
            <div className="bg-lime-50 rounded-2xl p-6 border border-lime-100">
              <h4 className="font-bold text-lime-800 mb-2">Future Goals</h4>
              <p className="text-sm text-lime-900/80 mb-3">{businessData.futureGoals || "No specific goals set yet."}</p>
              <div className="flex flex-wrap gap-2">
                {businessData.interestInOnlineExport && <Badge text="Interest in Export" />}
                {businessData.needFunding && <Badge text="Needs Funding" />}
                {businessData.needTraining && <Badge text="Needs Training" />}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// --- SUB COMPONENTS ---

// 1. Stat Card: Simple, colorful top metrics
const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color] || colors.emerald}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

// 2. Info Item: Standard label-value pair
const InfoItem = ({ label, value }) => (
  <div className="mb-2">
    <p className="text-xs text-gray-400 font-medium uppercase">{label}</p>
    <p className="text-sm font-semibold text-gray-700">{value || 'N/A'}</p>
  </div>
);

// 3. Image Card: The crucial fix for "Image jeno kete na jai"
// Uses object-contain inside a fixed aspect ratio container
const ImageCard = ({ src, label }) => (
  <div className="group relative">
    <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] flex items-center justify-center relative">
      <img
        src={src}
        alt={label}
        className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
      />
      {/* Overlay for zoom effect indication */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
    </div>
    <p className="text-xs text-center mt-2 text-gray-500 font-medium group-hover:text-emerald-600 transition-colors">
      {label}
    </p>
  </div>
);

// 4. Document Link
const DocLink = ({ title, file }) => {
  if (!file) return null;
  const isImage = file.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm text-xs">
          {isImage ? <FaImages /> : <FaFilePdf />}
        </div>
        <span className="text-sm font-semibold text-gray-700">{title}</span>
      </div>
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 group-hover:text-emerald-600 transition-colors"
      >
        <FaExternalLinkAlt size={12} />
      </a>
    </div>
  );
};

// 5. Contact Row
const ContactRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-gray-600">
    <span className="w-6 flex justify-center text-emerald-500">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

// 6. Badge
const Badge = ({ text }) => (
  <span className="bg-white/60 text-lime-800 text-xs px-2 py-1 rounded-md border border-lime-200 font-semibold">
    {text}
  </span>
);

export default Dashboard;