import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaEnvelope, FaLock, FaArrowRight, FaChartLine, FaUserShield, FaLightbulb } from 'react-icons/fa';

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
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        {/* Background Decoration (Subtle) */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

        {/* Main Card Container */}
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-slate-100">

          {/* --- LEFT SIDE: Visual/Infographic Area (Corporate Blue Theme) --- */}
          <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between overflow-hidden text-white">

            {/* Background Patterns */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-amber-500 mb-8">
                <FaUserShield className="text-2xl" />
                <span className="font-bold tracking-wider uppercase text-xs md:text-sm">Secure Portal Access</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Welcome back to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  AggriGo.
                </span>
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed">
                Log in to access your business analytics, manage orders, and connect with your network.
              </p>
            </div>

            {/* Decorative "Dashboard Preview" Element */}
            <div className="relative z-10 mt-12 hidden md:block">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                      <FaChartLine />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">Monthly Growth</p>
                      <p className="text-lg font-bold text-white">+28.4%</p>
                    </div>
                  </div>
                  <FaLightbulb className="text-slate-500" />
                </div>
                {/* Dummy Graph Lines */}
                <div className="flex items-end space-x-2 h-16 opacity-80">
                  <div className="w-1/5 bg-blue-500/30 h-1/3 rounded-t"></div>
                  <div className="w-1/5 bg-blue-500/50 h-2/3 rounded-t"></div>
                  <div className="w-1/5 bg-blue-500/40 h-1/2 rounded-t"></div>
                  <div className="w-1/5 bg-amber-500 h-full rounded-t shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-1/5 bg-blue-500/30 h-3/4 rounded-t"></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: Login Form (Clean White) --- */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">

            <div className="relative z-10 max-w-md mx-auto w-full">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                {t('auth.login.title') || "Sign In"}
              </h3>
              <p className="text-slate-500 mb-8">
                Enter your credentials to continue.
              </p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm flex items-center shadow-sm">
                  <span className="font-bold mr-2">Error:</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    {t('auth.login.email')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                      {t('auth.login.password')}
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      {t('auth.login.forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  // Using Amber color for the primary action button to match Home Page CTA
                  className="w-full py-4 rounded-xl bg-amber-500 text-slate-900 font-bold text-lg hover:bg-amber-400 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>{loading ? t('common.loading') : t('auth.login.button')}</span>
                  {!loading && <FaArrowRight />}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-slate-500 text-sm">
                  {t('auth.login.noAccount')}{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
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