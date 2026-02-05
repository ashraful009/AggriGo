import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaLeaf, FaEnvelope, FaLock, FaArrowRight, FaChartLine } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {/* Main Card Container */}
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

          {/* --- LEFT SIDE: Visual/Infographic Area --- */}
          <div className="md:w-1/2 bg-emerald-900 relative p-12 flex flex-col justify-between overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-lime-400 mb-6">
                <FaLeaf className="text-2xl" />
                <span className="font-bold tracking-wider uppercase text-sm">AggriGo Ecosystem</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Welcome back to your <span className="text-lime-400">Growth Engine</span>.
              </h2>
              <p className="text-emerald-100/80 text-lg">
                Track your harvest, connect with buyers, and analyze market trends in real-time.
              </p>
            </div>

            {/* Decorative "Dashboard Preview" Element */}
            <div className="relative z-10 mt-8 hidden md:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-3/4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-emerald-100 uppercase">Weekly Yield</span>
                  <FaChartLine className="text-lime-400" />
                </div>
                <div className="text-2xl font-bold text-white">+24.5%</div>
                <div className="w-full bg-emerald-900/50 h-1.5 rounded-full mt-2">
                  <div className="w-2/3 bg-lime-400 h-1.5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: Login Form --- */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
            {/* Subtle top right decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {t('auth.login.title')}
              </h3>
              <p className="text-gray-500 mb-8">
                Enter your details to access your account.
              </p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm flex items-center">
                  <span className="font-bold mr-2">Error:</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('auth.login.email')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="farmer@aggrigo.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      {t('auth.login.password')}
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                    >
                      {t('auth.login.forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-lg hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{loading ? t('common.loading') : t('auth.login.button')}</span>
                  {!loading && <FaArrowRight className="text-sm" />}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  {t('auth.login.noAccount')}{' '}
                  <Link
                    to="/register"
                    className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                  >
                    {t('auth.login.registerLink')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;