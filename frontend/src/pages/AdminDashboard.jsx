import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  FaUsers,
  FaFileSignature,
  FaCheckDouble,
  FaChartBar,
  FaBoxOpen,
} from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// ─── Color palettes ───────────────────────────────────────────────────────────
const PIE_COLORS = ['#3b82f6', '#6366f1'];   // blue-500, indigo-500
const BAR_COLOR  = '#2563eb';                // blue-600

// ─── Custom Tooltip for Pie ───────────────────────────────────────────────────
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
      <p className="font-bold">{name}</p>
      <p>{value} profile{value !== 1 ? 's' : ''}</p>
    </div>
  );
};

// ─── Custom Tooltip for Bar ───────────────────────────────────────────────────
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
      <p className="font-bold mb-1">{label}</p>
      <p>{payload[0].value} registration{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, icon, gradient, loading, to }) => {
  const content = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 h-full transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white flex-shrink-0 ${gradient}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        {loading
          ? <Skeleton className="h-7 w-16" />
          : <p className="text-3xl font-extrabold text-gray-800">{value ?? 0}</p>
        }
      </div>
    </div>
  );
  return to ? <Link to={to} className="block">{content}</Link> : content;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          setError('Failed to load analytics data.');
        }

        api.get('/admin/users')
          .then(res => setUsers(res.data))
          .catch(err => console.error(err));
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError('Could not connect to the server. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleApproveUser = async (id) => {
    try {
      const res = await api.patch(`/seller/${id}/approve`);
      if (res.data.success) {
        setUsers((prev) => prev.map(u => u._id === id ? { ...u, sellerStatus: 'approved' } : u));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve seller');
    }
  };

  const handleRejectUser = async (id) => {
    try {
      const res = await api.patch(`/seller/${id}/reject`, { reason: 'Application does not meet requirements' });
      if (res.data.success) {
        setUsers((prev) => prev.map(u => u._id === id ? { ...u, sellerStatus: 'rejected' } : u));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to reject seller');
    }
  };

  // ── Derived chart data ─────────────────────────────────────────────────────
  const pieData = stats ? [
    { name: 'Completed (≥80%)', value: stats.completionStats.completed  },
    { name: 'Incomplete (<80%)',  value: stats.completionStats.incomplete },
  ] : [];

  const barData = stats?.sectorOverview ?? [];

  // ---------------------------------------------------------------------------
  return (
    <div className="bg-gray-50 min-h-full font-sans">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-[#0f172a] pb-32 pt-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-10" />
        
        {/* Floating Stickers */}
        <div className="absolute top-10 right-20 text-4xl transform hover:scale-150 hover:rotate-12 transition-all cursor-default select-none hidden md:block">📊</div>
        <div className="absolute bottom-10 right-40 text-4xl transform hover:scale-150 hover:-rotate-12 transition-all cursor-default select-none hidden md:block opacity-40">📈</div>
        <div className="absolute top-20 left-10 text-3xl transform hover:scale-150 rotate-12 transition-all cursor-default select-none hidden md:block opacity-30">⚙️</div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-400/20">
              <FaChartBar className="text-blue-400 text-xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">System Analytics 🛡️</h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Live Feed ⚡
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Real-time overview of your marketplace ecosystem</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 -mt-24 pb-12 relative z-20 space-y-8">

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl
                          shadow-lg text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* ── TOP ROW: 3 Summary Cards ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SummaryCard
            loading={loading}
            label="Total Registrations 👤"
            value={stats?.totalRegistrations}
            icon={<FaUsers />}
            gradient="bg-gradient-to-br from-blue-600 to-indigo-700"
            to="/manager/directory"
          />
          <SummaryCard
            loading={loading}
            label="Agreements Sent ✍️"
            value={stats?.agreementTracking.sent}
            icon={<FaFileSignature />}
            gradient="bg-gradient-to-br from-[#1B2B4B] to-[#2563eb]"
            to="/manager/directory?filter=agreements"
          />
          <SummaryCard
            loading={loading}
            label="Fully Completed ✅"
            value={stats?.completionStats.completed}
            icon={<FaCheckDouble />}
            gradient="bg-gradient-to-br from-sky-500 to-blue-600"
            to="/manager/directory?filter=completed"
          />
          <SummaryCard
            loading={loading}
            label="Pending Products 📦"
            value={stats?.pendingProductCount}
            icon={<FaBoxOpen />}
            gradient="bg-gradient-to-br from-slate-700 to-slate-900"
            to="/manager/products"
          />
        </div>

        {/* ── CHARTS ROW ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Donut / Pie Chart — Completion Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-700 mb-1">Profile Completion</h2>
            <p className="text-xs text-gray-400 mb-6">
              Profiles scored ≥80 pts vs under threshold
            </p>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600
                                rounded-full animate-spin" />
              </div>
            ) : stats?.totalRegistrations === 0 ? (
              <EmptyState label="No profiles registered yet." />
            ) : (
              <>
                {/* Donut totals */}
                <div className="flex justify-around mb-4 text-center">
                  <div>
                    <p className="text-2xl font-extrabold text-blue-600">
                      {stats?.completionStats?.completed}
                    </p>
                    <p className="text-xs text-slate-400 font-bold">Completed ✨</p>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div>
                    <p className="text-2xl font-extrabold text-slate-400">
                      {stats?.completionStats?.incomplete}
                    </p>
                    <p className="text-xs text-slate-400 font-bold">Pending ⏳</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => (
                        <span className="text-xs text-gray-500 font-medium">{v}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </>
            )}
          </div>

          {/* Bar Chart — Sector Overview */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-700 mb-1">Sector Overview</h2>
            <p className="text-xs text-gray-400 mb-6">
              Registration count grouped by product type / industry sector
            </p>

            {loading ? (
              <div className="space-y-3 pt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" style={{ width: `${80 - i * 12}%` }} />
                ))}
              </div>
            ) : barData.length === 0 ? (
              <EmptyState label="No sector data available yet." />
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <BarChart
                  data={barData}
                  margin={{ top: 0, right: 10, left: -20, bottom: 60 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: '#f0fdf4' }} />
                  <Bar dataKey="count" fill={BAR_COLOR} radius={[6, 6, 0, 0]} maxBarSize={52} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── SECTOR TABLE (bonus — readable fallback when chart is dense) ── */}
        {!loading && barData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                Sector Breakdown — Detail
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {barData.map((sector, idx) => {
                const pct = stats.totalRegistrations
                  ? Math.round((sector.count / stats.totalRegistrations) * 100)
                  : 0;
                return (
                  <div key={idx} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
                    <span className="w-6 text-center text-xs font-bold text-gray-300">{idx + 1}</span>
                    <span className="flex-1 text-sm font-semibold text-gray-700">{sector.name}</span>
                    {/* Progress bar */}
                    <div className="hidden md:block w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-medium w-10 text-right">{pct}%</span>
                    <span className="text-sm font-bold text-emerald-700 w-16 text-right">
                      {sector.count} <span className="text-gray-400 font-normal">reg.</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── REGISTERED USERS LIST ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Registered Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/manager/directory/${user._id}`} className="font-semibold text-[#2563eb] hover:text-blue-800 flex items-center gap-1.5 transition-colors group">
                        {user.name}
                        <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      </Link>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 text-center">
                      {user.sellerStatus === 'approved' ? (
                        <span className="bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase">
                          Verified
                        </span>
                      ) : user.sellerStatus === 'pending' ? (
                        <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase">
                          Pending Seller
                        </span>
                      ) : user.sellerStatus === 'rejected' ? (
                        <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase">
                          Rejected
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase">
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.sellerStatus === 'approved' ? (
                        <span className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full text-[10px] tracking-wide uppercase shadow-sm">
                          Verified 🏅
                        </span>
                      ) : user.sellerStatus === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApproveUser(user._id)}
                            className="bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectUser(user._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs font-bold uppercase">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-300">
    <FaChartBar size={36} />
    <p className="mt-3 text-sm font-medium text-gray-400">{label}</p>
  </div>
);

export default AdminDashboard;
