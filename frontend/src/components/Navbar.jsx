import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaSeedling, FaUserCircle, FaBars, FaTimes, FaRocket, FaChartPie, FaGlobe, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'en' ? 'bn' : 'en');
  };

  const navLinkClasses = (path) => `
    relative font-medium text-sm tracking-wide transition-all duration-300 group py-2 px-1
    ${isActive(path) ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'}
  `;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 border-b
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2 border-slate-200/50'
            : 'bg-white py-3 md:py-4 shadow-sm border-slate-100'
          }
        `}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* ================= LEFT: LOGO ================= */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-blue-500/30 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaSeedling className="text-white text-sm md:text-lg relative z-10" />
                <div className="absolute inset-0 bg-white opacity-20 rounded-lg animate-pulse"></div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-lg md:text-2xl font-extrabold tracking-tight text-slate-800 leading-none">
                  Aggri<span className="text-blue-600">Go</span>
                </span>
                <span className="hidden md:block text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                  Growth Platform
                </span>
              </div>
            </Link>

            {/* ================= CENTER: DESKTOP NAV ================= */}
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" className={navLinkClasses('/')}>
                {t('nav.home')}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link to="/about" className={navLinkClasses('/about')}>
                {t('nav.about')}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-amber-500 transition-all duration-300 ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            </div>

            {/* ================= RIGHT: ACTIONS ================= */}
            <div className="flex items-center gap-2 md:gap-4">

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors text-xs md:text-sm font-bold text-slate-600 uppercase border border-slate-200"
              >
                <FaGlobe className="text-slate-400" />
                {currentLanguage === 'en' ? 'BN' : 'EN'}
              </button>

              {isAuthenticated ? (
                // --- LOGGED IN STATE ---
                <>
                  <Link
                    to="/dashboard"
                    className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors font-bold text-sm"
                  >
                    <FaChartPie /> {t('nav.dashboard')}
                  </Link>

                  {/* Mobile Dashboard Icon Only */}
                  <Link to="/dashboard" className="md:hidden p-2 text-blue-600 bg-blue-50 rounded-lg">
                    <FaChartPie />
                  </Link>

                  {/* Profile Chip (Desktop) */}
                  <div className="hidden md:flex items-center gap-2 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-200">
                    <FaUserCircle className="text-blue-500 text-lg" />
                    <span className="text-xs font-bold text-slate-700 uppercase max-w-[80px] truncate">{user?.name}</span>
                  </div>

                  {/* LOGOUT BUTTON (DESKTOP) - Added Back */}
                  <button
                    onClick={logout}
                    className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title={t('nav.logout')}
                  >
                    <FaSignOutAlt className="text-sm" />
                  </button>
                </>
              ) : (
                // --- LOGGED OUT STATE ---
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs md:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors px-1 md:px-2"
                  >
                    {t('nav.login')}
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-3 py-1.5 md:px-5 md:py-2 rounded-lg shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-xs md:text-sm whitespace-nowrap"
                  >
                    <span>{t('nav.register')}</span>
                    <FaRocket className="text-amber-300 text-[10px] md:text-xs" />
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-slate-600 hover:text-blue-600 p-2 focus:outline-none transition-colors rounded-lg hover:bg-slate-50 ml-1"
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU DRAWER ================= */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl transition-all duration-300 ease-in-out overflow-hidden origin-top ${isMobileMenuOpen ? 'max-h-[300px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'
            }`}
        >
          <div className="flex flex-col p-4 space-y-3">
            <MobileLink to="/" onClick={() => setIsMobileMenuOpen(false)} active={isActive('/')}>
              {t('nav.home')}
            </MobileLink>
            <MobileLink to="/about" onClick={() => setIsMobileMenuOpen(false)} active={isActive('/about')}>
              {t('nav.about')}
            </MobileLink>

            {isAuthenticated && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FaUserCircle className="text-blue-500 text-2xl flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-bold uppercase">Welcome</span>
                      <span className="text-sm font-bold text-slate-700 truncate">{user?.name}</span>
                    </div>
                  </div>
                  {/* LOGOUT BUTTON (MOBILE) */}
                  <button onClick={logout} className="text-xs font-bold text-red-500 bg-white border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 whitespace-nowrap shadow-sm flex items-center gap-1">
                    <FaSignOutAlt /> {t('nav.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`${isScrolled ? 'h-14' : 'h-16'} md:h-20 transition-all duration-300`}></div>
    </>
  );
};

// Helper for Mobile Links
const MobileLink = ({ to, children, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all ${active
        ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
  >
    {children}
  </Link>
);

export default Navbar;