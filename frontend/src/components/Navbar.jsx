import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { FaSeedling, FaUserCircle, FaBars } from 'react-icons/fa';
import { MdOutlineAgriculture } from "react-icons/md";
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Helper to check active link for styling
  const isActive = (path) => location.pathname === path;

  const navLinkClasses = (path) => `
    relative font-medium transition-all duration-300 group py-2
    ${isActive(path) ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-600'}
  `;

  // The little "sprout" underline effect for active links
  const ActiveIndicator = () => (
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-lime-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500 h-0.5"></span>
  );

  return (
    // Added a subtle top border gradient for an "energy flow" feel
    // Added backdrop-blur for a modern, tech feel
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-t-4 border-emerald-600 relative z-50">

      {/* Optional: Subtle background pattern suggesting rolling fields or data points */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-20"> {/* Increased height slightly for presence */}

          {/* --- LOGO REDESIGN --- */}
          <Link to="/" className="flex items-center group">
            {/* Logo Icon Container: Layered for depth */}
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-emerald-700 to-emerald-500 rounded-xl shadow-lg shadow-emerald-200/50 transform transition-transform group-hover:scale-105 duration-300">
              {/* A subtle abstract tractor/field icon representing tech */}
              <MdOutlineAgriculture className="text-emerald-200 text-3xl opacity-50 absolute" />
              {/* The main sprout icon representing growth */}
              <FaSeedling className="text-lime-300 text-2xl relative z-10" />
            </div>

            {/* Logo Text: Strong typography with color accents */}
            <div className="ml-3 flex flex-col justify-center">
              <span className="text-2xl font-extrabold tracking-tight text-gray-800 leading-none">
                Aggri<span className="text-emerald-600">Go</span>
              </span>
              <span className="text-xs font-medium text-emerald-600 tracking-wider uppercase">
                Smart Farming Solutions
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          {/* Hidden on small screens, flex on medium+ */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClasses('/')}>
              {t('nav.home')} <ActiveIndicator />
            </Link>
            <Link to="/about" className={navLinkClasses('/about')}>
              {t('nav.about')} <ActiveIndicator />
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClasses('/dashboard')}>
                  {t('nav.dashboard')} <ActiveIndicator />
                </Link>

                {/* User Profile Section stylized as a data capsule */}
                <div className="pl-4 flex items-center space-x-4 border-l-2 border-gray-100 ml-4">
                  <div className="flex items-center space-x-2 bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-100">
                    <FaUserCircle className="text-emerald-600 text-lg" />
                    <span className="text-sm font-semibold text-emerald-800">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l-2 border-gray-100 ml-4">
                <Link
                  to="/login"
                  className="font-medium text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2"
                >
                  {t('nav.login')}
                </Link>
                {/* Register button stylized as a Call to Action (CTA) leaf */}
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-bold px-6 py-2.5 rounded-r-xl rounded-l-md shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-lime-600 transition-all duration-300 flex items-center"
                >
                  <FaSeedling className="mr-2 animate-pulse text-lime-200" size={14} />
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <div className="pl-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button (Visible on small screens) */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-emerald-600 p-2">
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Simplified for brevity, add your mobile styles here) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 shadow-lg absolute w-full z-50">
          {/* Add mobile Links here similar to desktop structure */}
          <p className="text-xs text-gray-400 italic">Mobile menu content goes here...</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;