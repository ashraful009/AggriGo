import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaUserPlus, FaEnvelope, FaPhoneAlt, FaBuilding, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function AdminSellers() {
  const [sellers, setSellers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // { id, name }
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/seller/admin/pending');
      setSellers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/seller/${id}/approve`);
      setSellers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setActionId(rejectModal.id);
    try {
      await api.patch(`/seller/${rejectModal.id}/reject`, { reason: rejectReason });
      setSellers((prev) => prev.filter((s) => s._id !== rejectModal.id));
      setRejectModal(null);
      setRejectReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50/50 min-h-full font-sans">
      {/* Header Area */}
      <div className="relative mb-10 group">
        <div className="absolute -top-6 -left-6 text-5xl opacity-10 group-hover:opacity-20 transition-all rotate-12">🏢</div>
        <div className="absolute top-0 right-10 text-4xl animate-bounce hidden md:block">✨</div>
        
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-sm">
                <FaUserPlus className="text-blue-600 text-xl" />
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B4B] tracking-tight">Pending Applications 📋</h1>
                <p className="text-slate-500 text-sm font-medium">Verify and onboard new entrepreneurs to the platform</p>
            </div>
        </div>
      </div>

      {/* Stats Notification */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 mb-8 flex items-center gap-5 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner transform group-hover:rotate-12 transition-transform">
            ⏳
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-[#1B2B4B]">{sellers.length} Application{sellers.length !== 1 ? 's' : ''} waiting</p>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Awaiting your approval to start selling</p>
        </div>
        <div className="text-4xl hidden sm:block opacity-20 group-hover:opacity-50 transition-opacity">🚀</div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-900/5 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
             <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
             <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="p-20 text-center">
            <div className="text-6xl mb-6 transform hover:scale-125 transition-transform duration-500 cursor-default">🎉</div>
            <p className="font-extrabold text-[#1B2B4B] text-xl">All caught up!</p>
            <p className="text-slate-400 font-medium text-sm mt-2">There are no pending applications at the moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-blue-50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entrepreneur Info</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Details</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submission Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/50">
                {sellers.map((seller) => (
                  <tr key={seller._id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                          {seller.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link to={`/manager/directory/${seller._id}`} className="font-bold text-[#1B2B4B] hover:text-blue-600 text-sm flex items-center gap-1.5 transition-colors group/link">
                            {seller.name}
                            <FaBuilding className="text-slate-200 group-hover/link:text-blue-400 text-xs" />
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                             <FaEnvelope className="text-[10px]" />
                             <span className="text-xs font-semibold">{seller.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs tabular-nums">
                                <FaPhoneAlt className="text-blue-400 text-[10px]" />
                                {seller.phone || 'N/A'}
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-500 bg-slate-100 inline-block px-3 py-1 rounded-full uppercase tracking-tight">
                        {seller.sellerAppliedAt
                          ? new Date(seller.sellerAppliedAt).toLocaleDateString('en-BD', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })
                          : '—'}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform opacity-0 group-hover:opacity-100 duration-300">
                        <button
                          onClick={() => handleApprove(seller._id)}
                          disabled={actionId === seller._id}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50 shadow-sm"
                        >
                          <FaCheckCircle className="text-[10px]" />
                          {actionId === seller._id ? 'Working...' : 'Verify'}
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: seller._id, name: seller.name })}
                          disabled={actionId === seller._id}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                        >
                          <FaTimesCircle className="text-[10px]" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center z-[110] px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md border border-blue-100 transform animate-in zoom-in-95 ease-out duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-inner">
                🚫
            </div>
            <h3 className="font-black text-center text-xl text-[#1B2B4B] mb-2">Reject Application</h3>
            <p className="text-center text-sm text-slate-500 mb-6 font-medium">
              You are about to decline <span className="text-red-500 font-bold">{rejectModal.name}</span>'s request.
            </p>
            <div className="mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a specific reason for the applicant..."
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all resize-none shadow-inner"
                />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-4 bg-slate-100 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all transform active:scale-95"
              >
                Go Back
              </button>
              <button
                onClick={handleReject}
                disabled={actionId === rejectModal.id}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-red-500/25 transform active:scale-95 disabled:opacity-50"
              >
                {actionId === rejectModal.id ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
