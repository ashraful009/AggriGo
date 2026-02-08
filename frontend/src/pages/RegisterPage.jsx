import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUser, FaEnvelope, FaLock, FaRocket, FaCheckCircle, FaArrowRight, FaGlobeAmericas, FaShieldAlt } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      // Navigate to OTP verification page with email
      navigate('/verify-otp', { state: { email: formData.email } });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 -z-10"></div>
        
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-slate-100">

          {/* --- LEFT SIDE: Value Prop / Infographic (Dark Corporate Theme) --- */}
          <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between overflow-hidden text-white">

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-30"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-amber-400 mb-8">
                <FaRocket className="text-xl" />
                <span className="font-bold tracking-wider uppercase text-xs md:text-sm">Join the Network</span>
              </div>

              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Accelerate your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Agri-Business Growth.
                </span>
              </h2>

              {/* Feature List */}
              <div className="space-y-6 mt-10">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1 p-1 bg-blue-500/20 rounded-full">
                    <FaGlobeAmericas className="text-blue-400 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors">Global Market Access</h4>
                    <p className="text-slate-400 text-sm mt-1">Connect directly with buyers worldwide without intermediaries.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1 p-1 bg-amber-500/20 rounded-full">
                    <FaShieldAlt className="text-amber-400 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg group-hover:text-amber-300 transition-colors">Secure & Verified</h4>
                    <p className="text-slate-400 text-sm mt-1">Your data and transactions are protected by industry standards.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1 p-1 bg-emerald-500/20 rounded-full">
                    <FaCheckCircle className="text-emerald-400 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg group-hover:text-emerald-300 transition-colors">Smart Analytics</h4>
                    <p className="text-slate-400 text-sm mt-1">Get data-driven insights to maximize your yield and profits.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="relative z-10 mt-12 border-t border-slate-800 pt-6">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Trusted by 10,000+ Innovators</p>
            </div>
          </div>

          {/* --- RIGHT SIDE: Registration Form --- */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="max-w-md mx-auto w-full relative z-10">
              
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                {t('auth.register.title') || "Create Account"}
              </h3>
              <p className="text-slate-500 mb-8">
                Join AggriGo today. It's free and takes less than a minute.
              </p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm flex items-center shadow-sm">
                  <span className="font-bold mr-2">Error:</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    {t('auth.register.name')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    {t('auth.register.email')}
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
                      placeholder="you@company.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    {t('auth.register.password')}
                  </label>
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
                      placeholder="Min. 6 characters"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    {t('auth.reset.confirmPassword') || "Confirm Password"}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  // Using Blue Gradient for Registration to imply Trust/Security
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{loading ? t('common.loading') : t('auth.register.button')}</span>
                  {!loading && <FaArrowRight className="text-sm" />}
                </button>
              </form>

              <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
                <p className="text-slate-500">
                  {t('auth.register.hasAccount')}{' '}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                  >
                    {t('auth.register.loginLink')}
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

export default RegisterPage;