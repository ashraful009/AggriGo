import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaIndustry,
  FaChartLine,
  FaFileSignature,
  FaFilePdf,
  FaExternalLinkAlt,
  FaImage,
  FaShieldAlt,
  FaBan,
} from 'react-icons/fa';

// ─── Utility sub-components ───────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider sm:w-40 flex-shrink-0">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-700">{value || '—'}</span>
  </div>
);

const SectionCard = ({ icon, title, children, highlight }) => (
  <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${highlight ? 'border-emerald-200' : 'border-gray-100'}`}>
    <div className={`px-6 py-4 border-b flex items-center gap-2.5 ${highlight ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50/60 border-gray-100'}`}>
      <span className={`text-lg ${highlight ? 'text-emerald-600' : 'text-gray-400'}`}>{icon}</span>
      <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CompletionRing = ({ pct }) => {
  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f87171';
  const textColor = pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-500' : 'text-red-400';
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-extrabold ${textColor}`}>{pct}%</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Completion</p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sellerStatus, setSellerStatus] = useState(null); // 'pending' | 'approved' | 'rejected' | null
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null); // { type: 'success'|'error', text }
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch business profile
        const res = await api.get('/business/all');
        if (res.data.success) {
          const found = res.data.data.find(d => d._id === id || d.userId?._id === id || d.userId === id);
          if (found) {
            setData(found);
            // Fetch user seller status
            try {
              const usersRes = await api.get('/admin/users');
              const userId = found.userId?._id || found.userId;
              const userRecord = usersRes.data.find(u => u._id === userId || u._id === id);
              if (userRecord) setSellerStatus(userRecord.sellerStatus);
            } catch (_) {
              // silently ignore — status just won't show action panel
            }
          } else {
            setError('Profile not found.');
          }
        } else {
          setError('Failed to load profile data.');
        }
      } catch (err) {
        console.error('Detail fetch error:', err);
        setError('Could not connect to the server. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getUserId = () => data?.userId?._id || data?.userId || id;

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to APPROVE this seller?')) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const res = await api.patch(`/seller/${getUserId()}/approve`);
      if (res.data.success) {
        setSellerStatus('approved');
        setActionMsg({ type: 'success', text: '✅ Seller has been approved successfully!' });
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to approve seller.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setActionMsg({ type: 'error', text: 'Please provide a reason for rejection.' });
      return;
    }
    if (!window.confirm('Are you sure you want to REJECT this seller?')) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      const res = await api.patch(`/seller/${getUserId()}/reject`, { reason: rejectReason });
      if (res.data.success) {
        setSellerStatus('rejected');
        setShowRejectBox(false);
        setRejectReason('');
        setActionMsg({ type: 'success', text: '❌ Seller application has been rejected.' });
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reject seller.' });
    } finally {
      setActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  return (
    <div className="bg-gray-50 min-h-full font-sans">

      {/* Header */}
      <div className="bg-emerald-900 pb-36 pt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -ml-10" />
        <div className="container mx-auto px-6 relative z-10">
          <button
            onClick={() => navigate('/manager/directory')}
            className="flex items-center gap-2 text-emerald-200/80 hover:text-white transition-colors text-sm font-semibold mb-5"
          >
            <FaArrowLeft /> Back to Directory
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            {loading ? '…' : (data?.brandName || data?.ownerName || 'Business Profile')}
          </h1>
          {data && (
            <p className="text-emerald-100/70 text-sm">
              {data.productType} · {data.division || 'Unknown Division'}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 -mt-28 pb-12 relative z-20">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Data */}
        {!loading && data && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left col: identity + completion */}
            <div className="space-y-6">

              {/* Identity card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                {/* Profile Picture */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-emerald-100 shadow-sm bg-emerald-50 flex items-center justify-center">
                  {data.userId?.profilePictures?.length > 0 ? (
                    <img
                      src={data.userId.profilePictures[data.userId.profilePictures.length - 1].url}
                      alt={data.ownerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-emerald-400 text-3xl" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{data.brandName || '—'}</h2>
                <p className="text-sm text-gray-500">{data.ownerName}</p>
                <div className="mt-3 flex justify-center">
                  {data.isAgreementSent ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200
                                     text-xs font-bold px-3 py-1.5 rounded-full">
                      <FaCheckCircle /> Agreement Sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200
                                     text-xs font-bold px-3 py-1.5 rounded-full">
                      <FaClock /> Agreement Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Completion ring */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-center">
                <CompletionRing pct={data.completionPercentage ?? 0} />
              </div>

              {/* Contact info */}
              <SectionCard icon={<FaPhone />} title="Contact">
                <div className="space-y-1">
                  <InfoRow label="Mobile" value={data.mobileNumber ? `+880 ${data.mobileNumber}` : null} />
                  <InfoRow label="Email" value={data.email || data.userId?.email} />
                  <InfoRow label="WhatsApp" value={data.whatsappNumber} />
                  <InfoRow label="User Account" value={data.userId?.name} />
                </div>
              </SectionCard>

              {/* Location */}
              <SectionCard icon={<FaMapMarkerAlt />} title="Location">
                <div className="space-y-1">
                  <InfoRow label="Division" value={data.division} />
                  <InfoRow label="District" value={data.district} />
                  <InfoRow label="Thana" value={data.thana} />
                  <InfoRow label="Post Code" value={data.postCode} />
                  <InfoRow label="Address" value={data.detailedAddress} />
                </div>
              </SectionCard>
            </div>

            {/* Right cols: product + market + docs */}
            <div className="lg:col-span-2 space-y-6">

              {/* Owner info */}
              <SectionCard icon={<FaUser />} title="Owner Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <InfoRow label="Owner Name" value={data.ownerName} />
                  <InfoRow label="Gender" value={data.gender} />
                  <InfoRow label="Age" value={data.ownerAge} />
                  <InfoRow label="Ownership Type" value={data.ownershipType} />
                  <InfoRow label="Partner Name" value={data.partnerName} />
                </div>
              </SectionCard>

              {/* Product details */}
              <SectionCard icon={<FaBoxOpen />} title="Product Details" highlight>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <InfoRow label="Product Name" value={data.productName} />
                  <InfoRow label="Brand Name" value={data.brandName} />
                  <InfoRow label="Category" value={data.category} />
                  <InfoRow label="Product Type" value={data.productType} />
                  <InfoRow label="Wholesale Price" value={data.wholesalePrice ? `৳${data.wholesalePrice}` : null} />
                  <InfoRow label="MOQ" value={data.moq} />
                  <InfoRow label="Raw Material" value={data.rawMaterialSource} />
                  <InfoRow label="Production" value={data.productionType} />
                  <InfoRow label="Place" value={data.productionPlace} />
                  <InfoRow label="Capacity" value={data.productionCapacity} />
                  <InfoRow label="Male Workers" value={data.maleWorkers} />
                  <InfoRow label="Female Workers" value={data.femaleWorkers} />
                </div>
                {data.shortDescription && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                    {data.shortDescription}
                  </div>
                )}
              </SectionCard>

              {/* Market & Business */}
              <SectionCard icon={<FaChartLine />} title="Market & Business Status">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <InfoRow label="Business Age" value={data.businessAge ? `${data.businessAge} yrs` : null} />
                  <InfoRow label="Monthly Sales" value={data.monthlySales ? `৳${data.monthlySales}` : null} />
                  <InfoRow label="Total Customers" value={data.totalCustomers} />
                  <InfoRow label="Regular Customers" value={data.regularCustomers} />
                  <InfoRow label="Online Export Interest" value={data.interestInOnlineExport} />
                </div>
              </SectionCard>

              {/* ── Registration Documents (smart viewer: image vs PDF) ─── */}
              <SectionCard icon={<FaFileSignature />} title="Registration Documents">
                {(() => {
                  const docs = [
                    { key: 'tradeLicense', label: 'Trade License',    url: data.registrationDocuments?.tradeLicenseFile,  color: 'blue' },
                    { key: 'tin',          label: 'TIN / BIN Cert.',  url: data.registrationDocuments?.tinFile,           color: 'purple' },
                    { key: 'bsti',         label: 'BSTI Approval',    url: data.registrationDocuments?.bstiFile,          color: 'green' },
                    { key: 'exportLicense',label: 'Export License',   url: data.registrationDocuments?.exportLicenseFile, color: 'amber' },
                  ].filter(d => d.url);

                  if (docs.length === 0) {
                    return <p className="text-sm text-gray-400 italic">No documents submitted yet.</p>;
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {docs.map(({ key, label, url, color }) => {
                        const isPdf = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/raw/');
                        return (
                          <div
                            key={key}
                            className={`rounded-xl border overflow-hidden shadow-sm flex flex-col ${
                              color === 'blue'   ? 'border-blue-100'   :
                              color === 'purple' ? 'border-purple-100' :
                              color === 'green'  ? 'border-green-100'  :
                                                   'border-amber-100'
                            }`}
                          >
                            {isPdf ? (
                              /* PDF Card */
                              <div className={`flex-1 flex flex-col items-center justify-center gap-2 p-5 ${
                                color === 'blue'   ? 'bg-blue-50'   :
                                color === 'purple' ? 'bg-purple-50' :
                                color === 'green'  ? 'bg-green-50'  :
                                                     'bg-amber-50'
                              }`}>
                                <FaFilePdf className={`text-4xl ${
                                  color === 'blue'   ? 'text-blue-500'   :
                                  color === 'purple' ? 'text-purple-500' :
                                  color === 'green'  ? 'text-green-600'  :
                                                       'text-amber-500'
                                }`} />
                                <p className={`text-xs font-bold uppercase tracking-wide text-center ${
                                  color === 'blue'   ? 'text-blue-700'   :
                                  color === 'purple' ? 'text-purple-700' :
                                  color === 'green'  ? 'text-green-700'  :
                                                       'text-amber-700'
                                }`}>{label}</p>
                              </div>
                            ) : (
                              /* Image Card */
                              <div className="h-36 bg-gray-100 overflow-hidden">
                                <img
                                  src={url}
                                  alt={label}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {/* View / Download button */}
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold transition-colors ${
                                color === 'blue'   ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'     :
                                color === 'purple' ? 'bg-purple-100 hover:bg-purple-200 text-purple-700':
                                color === 'green'  ? 'bg-green-100 hover:bg-green-200 text-green-700'  :
                                                     'bg-amber-100 hover:bg-amber-200 text-amber-700'
                              }`}
                            >
                              <FaExternalLinkAlt className="text-[10px]" />
                              {isPdf ? 'View / Download PDF' : 'View Full Image'}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </SectionCard>

              {/* ── Product Images Gallery (full grid) ─────────────────── */}
              {data.productImages?.length > 0 && (
                <SectionCard icon={<FaBoxOpen />} title={`Product Gallery (${data.productImages.length} images)`}>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {data.productImages.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group">
                        <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                          <img
                            src={url}
                            alt={`Product ${i + 1}`}
                            className="w-full h-36 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* ── Packaging Image ────────────────────────────────────── */}
              {data.packagingImage && (
                <SectionCard icon={<FaImage />} title="Packaging Image">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href={data.packagingImage} target="_blank" rel="noopener noreferrer" className="group">
                      <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <img
                          src={data.packagingImage}
                          alt="Packaging"
                          className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-xs text-center text-gray-400 mt-1.5 group-hover:text-emerald-600 transition-colors">Click to view full size</p>
                    </a>
                  </div>
                </SectionCard>
              )}

              {/* ── Production Process Image / Video ───────────────────── */}
              {data.productionProcessImage && (
                <SectionCard icon={<FaIndustry />} title="Production Process">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      const url = data.productionProcessImage;
                      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
                      return isVideo ? (
                        <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                          <video
                            controls
                            className="w-full h-48 object-cover rounded-md bg-black"
                            src={url}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="group">
                          <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <img
                              src={url}
                              alt="Production Process"
                              className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-xs text-center text-gray-400 mt-1.5 group-hover:text-emerald-600 transition-colors">Click to view full size</p>
                        </a>
                      );
                    })()}
                  </div>
                </SectionCard>
              )}

            </div>

          </div>  {/* end grid */}

            {/* ── ADMIN APPROVAL PANEL ─────────────────────────────── */}
            {sellerStatus && (
              <div className={`mt-6 rounded-2xl border-2 overflow-hidden shadow-lg ${
                sellerStatus === 'pending'  ? 'border-amber-300  bg-amber-50'   :
                sellerStatus === 'approved' ? 'border-emerald-300 bg-emerald-50' :
                                              'border-red-300    bg-red-50'
              }`}>
                {/* Panel Header */}
                <div className={`px-6 py-4 flex items-center gap-3 border-b ${
                  sellerStatus === 'pending'  ? 'border-amber-200  bg-amber-100/60'   :
                  sellerStatus === 'approved' ? 'border-emerald-200 bg-emerald-100/60' :
                                                'border-red-200    bg-red-100/60'
                }`}>
                  {sellerStatus === 'approved' ? (
                    <FaShieldAlt className="text-xl text-emerald-600" />
                  ) : sellerStatus === 'rejected' ? (
                    <FaBan className="text-xl text-red-500" />
                  ) : (
                    <FaClock className="text-xl text-amber-500" />
                  )}
                  <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                    Admin Action — Seller Application
                  </h3>
                  <span className={`ml-auto text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                    sellerStatus === 'pending'  ? 'bg-amber-200  text-amber-800'   :
                    sellerStatus === 'approved' ? 'bg-emerald-200 text-emerald-800' :
                                                  'bg-red-200    text-red-800'
                  }`}>
                    {sellerStatus}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  {/* Action feedback message */}
                  {actionMsg && (
                    <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl ${
                      actionMsg.type === 'success'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {actionMsg.text}
                    </div>
                  )}

                  {sellerStatus === 'pending' && (
                    <>
                      <p className="text-sm text-gray-600">
                        Review the seller's business profile above, then take an action.
                      </p>

                      {/* Approve / Open Reject Box */}
                      {!showRejectBox && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            id="btn-approve-seller"
                            onClick={handleApprove}
                            disabled={actionLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {actionLoading ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FaCheckCircle />
                            )}
                            Approve Seller
                          </button>
                          <button
                            id="btn-open-reject"
                            onClick={() => { setShowRejectBox(true); setActionMsg(null); }}
                            disabled={actionLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-300 font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <FaTimesCircle />
                            Reject Application
                          </button>
                        </div>
                      )}

                      {/* Reject Reason Box */}
                      {showRejectBox && (
                        <div className="space-y-3 animate-fade-in">
                          <label className="block text-sm font-bold text-gray-700">
                            Rejection Reason <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="reject-reason-input"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Please provide a clear reason for rejection…"
                            rows={3}
                            className="w-full border-2 border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-all resize-none"
                          />
                          <div className="flex gap-3">
                            <button
                              id="btn-confirm-reject"
                              onClick={handleReject}
                              disabled={actionLoading}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {actionLoading ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FaBan />
                              )}
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => { setShowRejectBox(false); setRejectReason(''); setActionMsg(null); }}
                              className="text-gray-500 hover:text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {sellerStatus === 'approved' && (
                    <div className="flex items-center gap-3 text-emerald-700">
                      <FaCheckCircle className="text-2xl text-emerald-500" />
                      <div>
                        <p className="font-bold text-sm">This seller is already approved.</p>
                        <p className="text-xs text-emerald-600/80 mt-0.5">They can now upload and sell products on AggriGo.</p>
                      </div>
                    </div>
                  )}

                  {sellerStatus === 'rejected' && (
                    <div className="flex items-center gap-3 text-red-700">
                      <FaBan className="text-2xl text-red-400" />
                      <div>
                        <p className="font-bold text-sm">This seller application was rejected.</p>
                        <p className="text-xs text-red-600/80 mt-0.5">The seller cannot upload products unless re-approved.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default BusinessDetail;
