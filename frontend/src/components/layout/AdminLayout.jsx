import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import {
  FaChartBar,
  FaBuilding,
  FaShieldAlt,
  FaChevronRight,
} from 'react-icons/fa';

// ─── Sidebar nav item definition ─────────────────────────────────────────────
const NAV_ITEMS = [
  {
    to: '/manager/analytics',
    icon: <FaChartBar />,
    label: 'Analytics Overview',
    description: 'Stats & charts',
  },
  {
    to: '/manager/directory',
    icon: <FaBuilding />,
    label: 'Business Directory',
    description: 'All registrations',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AdminLayout
//
// Structure:
//   <Navbar />              ← full-width top bar (shared with public site)
//   <div flex>
//     <aside>               ← sticky left sidebar, 64px wide on md+
//       brand pill
//       nav items (NavLink with active highlighting)
//     </aside>
//     <main>               ← scrollable content area
//       <Outlet />         ← child route renders here
//     </main>
//   </div>
// ─────────────────────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-emerald-950 min-h-full sticky top-0 self-start overflow-y-auto"
               style={{ height: 'calc(100vh - 64px)', top: 64 }}>

          {/* Sidebar brand badge */}
          <div className="px-5 pt-6 pb-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-emerald-900 text-sm" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Admin Panel</p>
                <p className="text-emerald-400/70 text-[10px] uppercase tracking-widest">Manager View</p>
              </div>
            </div>

            {/* Signed-in user */}
            <div className="mt-4 bg-white/5 rounded-xl px-3 py-2.5">
              <p className="text-xs text-emerald-300/60">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map(({ to, icon, label, description }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-150 ${
                    isActive
                      ? 'bg-lime-400/15 text-lime-300 border border-lime-400/20'
                      : 'text-emerald-300/70 hover:bg-white/5 hover:text-white border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`text-base flex-shrink-0 ${isActive ? 'text-lime-400' : 'text-emerald-500/70 group-hover:text-emerald-300'}`}>
                      {icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-tight ${isActive ? 'text-lime-300' : ''}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-emerald-500/50 mt-0.5">{description}</p>
                    </div>
                    {isActive && (
                      <FaChevronRight className="text-lime-400/60 text-xs flex-shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-5 py-4 border-t border-white/10">
            <p className="text-[10px] text-emerald-600/50 uppercase tracking-widest">AggriGo</p>
          </div>
        </aside>

        {/* ── MOBILE SIDEBAR (horizontal strip) ───────────────────────────── */}
        <div className="md:hidden w-full flex items-center gap-1 px-3 py-2 bg-emerald-950 border-b border-white/10">
          <FaShieldAlt className="text-lime-400 mr-2 flex-shrink-0" />
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30'
                    : 'text-emerald-400/60 hover:text-white'
                }`
              }
            >
              <span>{icon}</span>
              {label.split(' ')[0]}
            </NavLink>
          ))}
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
