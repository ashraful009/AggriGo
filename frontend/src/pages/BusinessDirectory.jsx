import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  FaSearch,
  FaChevronRight,
  FaCheckCircle,
  FaClock,
  FaFileSignature,
  FaBuilding,
  FaFilter,
  FaTimes,
} from 'react-icons/fa';

// ─── Constants ────────────────────────────────────────────────────────────────
const DIVISIONS = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna',
  'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
];

const PRODUCT_TYPES = [
  'Agriculture', 'Cottage Industry', 'Handicraft', 'Food Processing',
  'Textile', 'Fishery', 'Livestock', 'IT/Technology', 'Services', 'Other'
];

// ─── Utility ──────────────────────────────────────────────────────────────────
const useDebounce = (value, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Inline mini progress bar for the Completion % column
const CompletionBar = ({ pct }) => {
  const color =
    pct >= 80 ? 'bg-emerald-500' :
    pct >= 50 ? 'bg-amber-400'  :
                'bg-red-400';
  const textColor =
    pct >= 80 ? 'text-emerald-700' :
    pct >= 50 ? 'text-amber-600'   :
                'text-red-600';
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${textColor}`}>{pct}%</span>
    </div>
  );
};

// Agreement sent/pending badge
const AgreementBadge = ({ sent }) =>
  sent ? (
    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200
                     text-xs font-bold px-2.5 py-1 rounded-full">
      <FaCheckCircle className="text-emerald-500" /> Sent
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200
                     text-xs font-bold px-2.5 py-1 rounded-full">
      <FaClock className="text-gray-400" /> Pending
    </span>
  );

// Skeleton row for loading state
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-gray-100 rounded-lg w-full" />
      </td>
    ))}
  </tr>
);

// Select dropdown with consistent styling
const FilterSelect = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    className="text-sm border border-gray-200 bg-white text-gray-700 rounded-lg px-3 py-2
               focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400
               transition-all cursor-pointer"
  >
    {children}
  </select>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const BusinessDirectory = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Filter state
  const [searchInput, setSearchInput]   = useState('');
  const [division, setDivision]         = useState('all');
  const [productType, setProductType]   = useState('all');
  const [status, setStatus]             = useState('all');

  const debouncedSearch = useDebounce(searchInput, 350);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (debouncedSearch) params.search   = debouncedSearch;
      if (division !== 'all')   params.division = division;
      if (productType !== 'all') params.type    = productType;
      if (status !== 'all')     params.status   = status;

      const res = await api.get('/business/all', { params });
      if (res.data.success) {
        setRows(res.data.data);
      } else {
        setError('Failed to load directory data.');
      }
    } catch (err) {
      console.error('Directory fetch error:', err);
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, division, productType, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const hasFilters = debouncedSearch || division !== 'all' || productType !== 'all' || status !== 'all';

  const clearFilters = () => {
    setSearchInput('');
    setDivision('all');
    setProductType('all');
    setStatus('all');
  };

  // ---------------------------------------------------------------------------
  return (
    <div className="bg-gray-50 min-h-full font-sans">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-emerald-900 pb-32 pt-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -ml-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <FaBuilding className="text-lime-400 text-xl" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Business Directory</h1>
                <span className="bg-lime-500/20 text-lime-300 border border-lime-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Manager View
                </span>
              </div>
              <p className="text-emerald-100/60 text-sm">Browse, search, and filter all registered entrepreneur profiles</p>
            </div>
            <div className="flex items-baseline gap-2 text-white">
              <span className="text-4xl font-extrabold tabular-nums">{loading ? '—' : rows.length}</span>
              <span className="text-emerald-200/70 text-sm">profiles shown</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 -mt-24 pb-12 relative z-20 space-y-6">

        {/* ── CONTROLS CARD ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, brand, email or mobile..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400
                           placeholder:text-gray-400 transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-3">
              <FaFilter className="text-gray-400 text-sm flex-shrink-0" />

              <FilterSelect value={division} onChange={e => setDivision(e.target.value)}>
                <option value="all">All Divisions</option>
                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </FilterSelect>

              <FilterSelect value={productType} onChange={e => setProductType(e.target.value)}>
                <option value="all">All Sectors</option>
                {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </FilterSelect>

              <FilterSelect value={status} onChange={e => setStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="completed">Completed (≥80%)</option>
                <option value="incomplete">Incomplete (&lt;80%)</option>
              </FilterSelect>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600
                             bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition-all"
                >
                  <FaTimes /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── ERROR STATE ───────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* ── DATA TABLE CARD ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Scrollable table wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-8">
                    #
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Entrepreneur
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Brand / Product
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Completion
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Agreement
                  </th>
                  <th className="w-10 px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Loading rows */}
                {loading && [...Array(6)].map((_, i) => <SkeletonRow key={i} />)}

                {/* Empty state */}
                {!loading && !error && rows.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                        <FaBuilding size={40} />
                        <p className="mt-4 text-base font-semibold text-gray-400">
                          {hasFilters ? 'No profiles match your filters.' : 'No business profiles yet.'}
                        </p>
                        {hasFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-2"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!loading && rows.map((row, idx) => (
                  <tr
                    key={row._id}
                    onClick={() => navigate(`/manager/directory/${row._id}`)}
                    className="group cursor-pointer hover:bg-emerald-50/60 transition-colors duration-150"
                  >
                    {/* Row number */}
                    <td className="px-5 py-4 text-xs text-gray-300 font-bold tabular-nums">
                      {idx + 1}
                    </td>

                    {/* Entrepreneur */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800 leading-tight">
                        {row.ownerName || row.userId?.name || '—'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
                        {row.email || row.userId?.email || ''}
                      </p>
                      {row.division && (
                        <span className="text-[10px] text-gray-400">{row.division}</span>
                      )}
                    </td>

                    {/* Brand / Product */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800 leading-tight">
                        {row.brandName || '—'}
                      </p>
                      {row.productType && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700
                                         bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          {row.productType}
                        </span>
                      )}
                    </td>

                    {/* Mobile */}
                    <td className="px-4 py-4 text-gray-700 tabular-nums font-medium">
                      {row.mobileNumber ? `+880 ${row.mobileNumber}` : '—'}
                    </td>

                    {/* Completion % */}
                    <td className="px-4 py-4">
                      <CompletionBar pct={row.completionPercentage ?? 0} />
                    </td>

                    {/* Agreement Status */}
                    <td className="px-4 py-4">
                      <AgreementBadge sent={row.isAgreementSent} />
                    </td>

                    {/* Chevron */}
                    <td className="px-4 py-4">
                      <FaChevronRight className="text-gray-200 group-hover:text-emerald-400 transition-colors text-sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {!loading && rows.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50 text-xs text-gray-400">
              Showing <span className="font-bold text-gray-600">{rows.length}</span> profile{rows.length !== 1 ? 's' : ''}
              {hasFilters && ' (filtered)'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDirectory;
