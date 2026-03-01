import { Link, useLocation } from 'react-router-dom';
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
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const toggleLanguage = () => setLanguage(currentLanguage === 'en' ? 'bn' : 'en');

  const navLinkClasses = (path) => `
    relative font-medium text-sm tracking-wide transition-all duration-300 group py-2 px-1
    ${isActive(path) ? 'text-[#F6C35E] font-bold' : 'text-[#4A4A4A] hover:text-[#F6C35E]'}
  `;

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

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#F6C35E] to-[#E2DED6] rounded-lg shadow-[#F6C35E]/30 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaSeedling className="text-[#4A4A4A] text-sm md:text-lg relative z-10" />
                <div className="absolute inset-0 bg-[#4A4A4A] opacity-10 rounded-lg animate-pulse"></div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-lg md:text-2xl font-extrabold tracking-tight text-[#4A4A4A] leading-none">
                  SRI<span className="text-[#F6C35E]">JON</span>
                </span>
                <span className="hidden md:block text-[9px] font-bold text-[#E2DED6] tracking-[0.2em] uppercase">
                  Growth Platform
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
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

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 md:gap-4">

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-[#F0EAD6] transition-colors text-xs md:text-sm font-bold text-[#4A4A4A] uppercase border border-[#E2DED6]"
              >
                <FaGlobe className="text-[#F6C35E]" />
                {currentLanguage === 'en' ? 'BN' : 'EN'}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Dashboard Link */}
                  <Link
                    to="/dashboard"
                    className="hidden md:flex items-center gap-2 bg-[#F6C35E]/20 text-[#4A4A4A] px-4 py-2 rounded-lg border border-[#F6C35E] hover:bg-[#F6C35E]/30 transition-colors font-bold text-sm"
                  >
                    <FaChartPie /> {t('nav.dashboard')}
                  </Link>
                  <Link to="/dashboard" className="md:hidden p-2 text-[#4A4A4A] bg-[#F6C35E]/20 rounded-lg">
                    <FaChartPie />
                  </Link>

                 {/* User Info */}
<div className="hidden md:flex items-center gap-2 bg-[#FFF3E0] py-1.5 px-3 rounded-full border border-[#F6C35E]">
  <FaUserCircle className="text-[#F57C00] text-lg" />
  <span className="text-xs font-bold text-[#F57C00] uppercase max-w-[80px] truncate">
    {user?.name}
  </span>
</div>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title={t('nav.logout')}
                  >
                    <FaSignOutAlt className="text-sm" />
                  </button>
                </>
              ) : (
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

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-[#4A4A4A] hover:text-[#F6C35E] p-2 focus:outline-none transition-colors rounded-lg hover:bg-[#F0EAD6] ml-1"
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#FAF7F0] border-t border-[#E2DED6] shadow-xl transition-all duration-300 ease-in-out overflow-hidden origin-top ${isMobileMenuOpen ? 'max-h-[300px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'}`}
        >
          <div className="flex flex-col p-4 space-y-3">
            <MobileLink to="/" onClick={() => setIsMobileMenuOpen(false)} active={isActive('/')}>
              {t('nav.home')}
            </MobileLink>
            <MobileLink to="/about" onClick={() => setIsMobileMenuOpen(false)} active={isActive('/about')}>
              {t('nav.about')}
            </MobileLink>

            {isAuthenticated && (
              <div className="pt-2 border-t border-[#E2DED6]">
                <div className="flex items-center justify-between px-4 py-3 bg-[#4A4A4A]/10 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FaUserCircle className="text-[#F6C35E] text-2xl flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs text-[#E2DED6] font-bold uppercase">Welcome</span>
                      <span className="text-sm font-bold text-[#4A4A4A] truncate">{user?.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-xs font-bold text-red-500 bg-[#4A4A4A]/10 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-[#4A4A4A]/20 whitespace-nowrap shadow-sm flex items-center gap-1"
                  >
                    <FaSignOutAlt /> {t('nav.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className={`${isScrolled ? 'h-14' : 'h-16'} md:h-20 transition-all duration-300`}></div>
    </>
  );
};

// Helper for Mobile Links
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