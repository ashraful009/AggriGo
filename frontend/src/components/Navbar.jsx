import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FaSeedling,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaRocket,
  FaChartPie,
  FaGlobe,
  FaSignOutAlt,
  FaChevronDown,
  FaTachometerAlt,
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu & dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const toggleLanguage = () => setLanguage(currentLanguage === 'en' ? 'bn' : 'en');

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'admin' ? '/manager' : '/dashboard';
  const dashboardLabel = user?.role === 'admin' ? 'Admin Dashboard' : t('nav.dashboard');

  const navLinkClasses = (path) => `
    relative font-medium text-sm tracking-wide transition-all duration-300 group py-2 px-1
    ${isActive(path) ? 'text-[#F6C35E] font-bold' : 'text-[#4A4A4A] hover:text-[#F6C35E]'}
  `;

  // Profile picture: use last uploaded or fallback icon
  const profilePicUrl =
    user?.profilePictures?.length > 0
      ? user.profilePictures[user.profilePictures.length - 1].url
      : null;

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 border-b
          ${isScrolled
            ? 'bg-[#FAF7F0]/95 backdrop-blur-md shadow-lg py-2 border-[#E2DED6]/50'
            : 'bg-[#FAF7F0] py-3 md:py-4 shadow-sm border-[#E2DED6]'
          }
        `}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* ── LOGO ─────────────────────────────────────────── */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#F6C35E] to-[#E2DED6] rounded-lg shadow-[#F6C35E]/30 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaSeedling className="text-[#4A4A4A] text-sm md:text-lg relative z-10" />
                <div className="absolute inset-0 bg-[#4A4A4A] opacity-10 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-lg md:text-2xl font-extrabold tracking-tight text-[#4A4A4A] leading-none">
                  SRI<span className="text-[#F6C35E]">JON</span>
                </span>
                <span className="hidden md:block text-[9px] font-bold text-[#B5AFA6] tracking-[0.2em] uppercase">
                  Growth Platform
                </span>
              </div>
            </Link>

            {/* ── DESKTOP CENTER LINKS ──────────────────────────── */}
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" className={navLinkClasses('/')}>
                {t('nav.home')}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#F6C35E] transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link to="/about" className={navLinkClasses('/about')}>
                {t('nav.about')}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#F6C35E] transition-all duration-300 ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            </div>

            {/* ── RIGHT ACTIONS ─────────────────────────────────── */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-[#F0EAD6] transition-colors text-xs md:text-sm font-bold text-[#4A4A4A] uppercase border border-[#E2DED6]"
              >
                <FaGlobe className="text-[#F6C35E]" />
                {currentLanguage === 'en' ? 'BN' : 'EN'}
              </button>

              {isAuthenticated ? (
                /* ── PROFILE DROPDOWN TRIGGER ───────────────── */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-[#FFF8EC] hover:bg-[#FFF3DC] border border-[#F6C35E]/60 rounded-full pl-1 pr-3 py-1 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#F6C35E] bg-[#F0EAD6] flex items-center justify-center">
                      {profilePicUrl ? (
                        <img
                          src={profilePicUrl}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-[#F6C35E] text-2xl" />
                      )}
                    </div>

                    {/* Name */}
                    <span className="text-xs sm:text-sm font-bold text-[#4A4A4A] truncate max-w-[80px] sm:max-w-[120px] hidden sm:block">
                      {user?.name}
                    </span>

                    {/* Arrow */}
                    <FaChevronDown
                      className={`text-[#4A4A4A] text-[10px] flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* ── DROPDOWN MENU ─────────────────────── */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-[#FFF8EC] to-[#FFF3DC] border-b border-[#F6C35E]/20">
                        <p className="text-sm font-bold text-[#4A4A4A]">Welcome {user?.name}</p>
                      </div>

                      {/* Dashboard */}
                      <Link
                        to={dashboardPath}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#4A4A4A] hover:bg-[#FFF8EC] hover:text-[#b8860b] transition-colors font-medium"
                      >
                        <FaTachometerAlt className="text-[#F6C35E] flex-shrink-0" />
                        {dashboardLabel}
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-gray-100" />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                      >
                        <FaSignOutAlt className="flex-shrink-0" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                  /* ── NOT LOGGED IN ───────────────────────────── */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs md:text-sm font-bold text-[#4A4A4A] hover:text-[#F6C35E] transition-colors px-1 md:px-2"
                  >
                    {t('nav.login')}
                    </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-[#F6C35E] to-[#E2DED6] hover:from-[#F6C35E]/90 hover:to-[#E2DED6]/90 text-[#4A4A4A] font-bold px-3 py-1.5 md:px-5 md:py-2 rounded-lg shadow-md shadow-[#F6C35E]/20 hover:-translate-y-0.5 transition-all text-xs md:text-sm whitespace-nowrap"
                  >
                    <span>{t('nav.register')}</span>
                    <FaRocket className="text-[#F6C35E] text-[10px] md:text-xs" />
                  </Link>
                </div>
              )}

              {/* ── MOBILE HAMBURGER (not logged in only needs nav links) ── */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-[#4A4A4A] hover:text-[#F6C35E] p-2 focus:outline-none transition-colors rounded-lg hover:bg-[#F0EAD6] ml-1"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE SLIDE-DOWN MENU ────────────────────────────── */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#FAF7F0] border-t border-[#E2DED6] shadow-xl transition-all duration-300 ease-in-out overflow-hidden origin-top ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="flex flex-col p-4 space-y-1">
            <MobileLink to="/" onClick={() => setIsMobileMenuOpen(false)} active={isActive('/')}>
              {t('nav.home')}
            </MobileLink>
            <MobileLink to="/about" onClick={() => setIsMobileMenuOpen(false)} active={isActive('/about')}>
              {t('nav.about')}
            </MobileLink>

            {isAuthenticated && (
              <>
                <div className="border-t border-[#E2DED6] mt-2 pt-2">
                  <MobileLink to={dashboardPath} onClick={() => setIsMobileMenuOpen(false)} active={isActive(dashboardPath)}>
                    <FaChartPie className="inline mr-2 text-[#F6C35E]" />
                    {dashboardLabel}
                  </MobileLink>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt />
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className={`${isScrolled ? 'h-14' : 'h-16'} md:h-20 transition-all duration-300`}></div>
    </>
  );
};

// ── Mobile Link helper ────────────────────────────────────────────
const MobileLink = ({ to, children, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all ${
      active
        ? 'bg-[#F6C35E]/20 text-[#4A4A4A] border border-[#F6C35E] shadow-sm'
        : 'text-[#4A4A4A] hover:bg-[#F0EAD6] hover:text-[#F6C35E]'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;