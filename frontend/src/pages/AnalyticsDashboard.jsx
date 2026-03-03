import { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  FaUsers,
  FaFileSignature,
  FaCheckDouble,
  FaChartBar,
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
const PIE_COLORS = ['#10b981', '#f59e0b'];   // emerald-500, amber-400
const BAR_COLOR  = '#34d399';                // emerald-400

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
const SummaryCard = ({ label, value, icon, gradient, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
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

// ─── Main Component ───────────────────────────────────────────────────────────
const AnalyticsDashboard = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/business/stats');
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          setError('Failed to load analytics data.');
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError('Could not connect to the server. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
      <div className="bg-emerald-900 pb-32 pt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -ml-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <FaChartBar className="text-lime-400 text-xl" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics Overview</h1>
            <span className="bg-lime-500/20 text-lime-300 border border-lime-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Live
            </span>
          </div>
          <p className="text-emerald-100/60 text-sm">Real-time overview of all registered business profiles</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            loading={loading}
            label="Total Registrations"
            value={stats?.totalRegistrations}
            icon={<FaUsers />}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <SummaryCard
            loading={loading}
            label="Agreements Sent"
            value={stats?.agreementTracking.sent}
            icon={<FaFileSignature />}
            gradient="bg-gradient-to-br from-violet-500 to-purple-700"
          />
          <SummaryCard
            loading={loading}
            label="Fully Completed (≥80%)"
            value={stats?.completionStats.completed}
            icon={<FaCheckDouble />}
            gradient="bg-gradient-to-br from-lime-500 to-green-600"
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
                    <p className="text-2xl font-extrabold text-emerald-600">
                      {stats?.completionStats?.completed}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">Completed</p>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div>
                    <p className="text-2xl font-extrabold text-amber-500">
                      {stats?.completionStats?.incomplete}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">Incomplete</p>
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
                        className="h-full bg-emerald-400 rounded-full transition-all duration-700"
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

export default AnalyticsDashboard;
