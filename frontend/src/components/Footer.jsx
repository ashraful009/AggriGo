import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaSeedling, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-24 relative overflow-hidden font-sans border-t border-slate-800">

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600"></div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* 1. Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                <FaSeedling className="text-white text-sm" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                SRI<span className="text-blue-500">JON</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t('footer.description') || "Empowering agricultural entrepreneurs with digital tools for growth, connection, and success."}
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{t('footer.quickLinks') || "Platform"}</h3>
            <ul className="space-y-3">
              <li>
                <FooterLink to="/">{t('nav.home')}</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">{t('nav.about')}</FooterLink>
              </li>
              <li>
                <FooterLink to="/register">{t('nav.register')}</FooterLink>
              </li>
              <li>
                <FooterLink to="/login">{t('nav.login')}</FooterLink>
              </li>
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 mt-1" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-500" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <span>support@aggrigo.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Socials */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{t('footer.connectWithUs') || "Follow Us"}</h3>
            <div className="flex gap-3">
              <SocialButton href="#" icon={<FaFacebook />} />
              <SocialButton href="#" icon={<FaTwitter />} />
              <SocialButton href="#" icon={<FaLinkedin />} />
              <SocialButton href="#" icon={<FaEnvelope />} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} SRIJON. {t('footer.allRightsReserved') || "All Rights Reserved."}</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components ---

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-slate-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 inline-block text-sm"
  >
    {children}
  </Link>
);

const SocialButton = ({ href, icon }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-blue-500/30 transform hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;