import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';

const STATUS_COLORS = {
  pending:  { bg: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-400',  label: 'Pending' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400',label: 'Approved' },
  rejected: { bg: 'bg-red-50',     text: 'text-red-500',     dot: 'bg-red-400',    label: 'Rejected' },
};

const StatCard = ({ icon, label, value, sub, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}>
    {/* decorative circle */}
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
    <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/10" />
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-xl">
        {icon}
      </div>
      <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold leading-none">{value ?? '—'}</p>
      {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
    </div>
  </div>
);

export default function SellerDashboard() {
  const { user, refreshUser } = useAuth();

  const [stats, setStats]           = useState(null);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      if (user?.sellerStatus === 'approved') {
        await fetchDashboard();
        await fetchProducts();
      }
    };
    init();

    let interval;
    if (user && user.sellerStatus !== 'approved') {
      interval = setInterval(() => refreshUser(), 10000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [user?.sellerStatus]);

  useEffect(() => {
    if (user?.sellerStatus === 'approved') fetchProducts();
  }, [filter, page, user?.sellerStatus]);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/seller/dashboard');
      setStats(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (filter !== 'all') params.append('status', filter);
      const { data } = await api.get(`/products/my-products?${params}`);
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      fetchDashboard();
    } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  /* ── Pending state ── */
  if (!user || user.sellerStatus !== 'approved') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4"
             style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)' }}>
          <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-blue-100">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl"
                 style={{ background: 'linear-gradient(135deg, #bfdbfe, #93c5fd)' }}>⏳</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Pending Approval</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your seller account is currently under review by an administrator. We'll notify you once approved!
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── Main Dashboard ── */
  return (
    <>
    <Navbar />
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f0f7ff 0%, #e8f3ff 40%, #f0f9ff 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Welcome Section ── */}
        <div className="rounded-3xl p-8 relative overflow-hidden shadow-xl"
             style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #0ea5e9 100%)' }}>
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full opacity-5"
               style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translate(-50%, 40%)' }} />

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1 uppercase tracking-widest">Welcome back</p>
              <h1 className="text-3xl font-bold text-white">{user?.name} 👋</h1>
              <p className="text-blue-200 text-sm mt-1">Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 text-white text-sm">
                <span className="text-blue-200 text-xs uppercase tracking-wider block mb-0.5">Account Status</span>
                <span className="font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Seller · Verified
                </span>
              </div>
              <Link to="/seller/products/add"
                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <span className="text-lg">🌱</span>
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="📦"
            label="Total Products"
            value={stats?.totalProducts}
            sub="In your inventory"
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <StatCard
            icon="🛒"
            label="Total Orders"
            value={stats?.totalOrders}
            sub="Lifetime orders"
            gradient="bg-gradient-to-br from-sky-500 to-cyan-600"
          />
          <StatCard
            icon="💰"
            label="Revenue"
            value={stats?.revenue ? `৳${stats.revenue.toLocaleString()}` : '৳0'}
            sub="Total earnings"
            gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
          />
          <StatCard
            icon="⭐"
            label="Avg. Rating"
            value={stats?.avgRating ? stats.avgRating.toFixed(1) : 'N/A'}
            sub="Customer reviews"
            gradient="bg-gradient-to-br from-blue-400 to-indigo-600"
          />
        </div>

        {/* ── Products Table ── */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-blue-100 overflow-hidden">

          {/* Table Header */}
          <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">My Products</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {pagination?.total ?? 0} products total
              </p>
            </div>

            {/* Filter Pills & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex gap-2 flex-wrap">
                {['all', 'approved', 'pending', 'rejected'].map(f => (
                  <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${
                      filter === f
                        ? 'text-white shadow-md'
                        : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                    }`}
                    style={filter === f ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : {}}>
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <Link to="/seller/products/add"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                </svg>
                Add Product
              </Link>
            </div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Loading products…</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mx-auto mb-4">🌱</div>
              <p className="text-slate-700 font-semibold">No products yet</p>
              <p className="text-slate-400 text-sm mt-1">Add your first product to get started</p>
              <Link to="/seller/products/add"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                + Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50/60">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {products.map(p => {
                    const sc = STATUS_COLORS[p.status] || STATUS_COLORS.pending;
                    return (
                      <tr key={p._id} className="hover:bg-blue-50/40 transition-colors group">
                        {/* Product Name + Image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.images?.[0] ? (
                              <img src={p.images[0].url} alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover border border-blue-100 flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-400 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                              </div>
                            )}
                            <span className="font-semibold text-slate-800 leading-tight line-clamp-2 max-w-[180px]">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-slate-500 capitalize">{p.category ?? '—'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-blue-700">৳{p.price?.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                            {p.stock ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/seller/products/edit/${p._id}`}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                              Edit
                            </Link>
                            <button onClick={() => handleDelete(p._id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-blue-50 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Page {page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  ← Prev
                </button>
                <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-colors"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}