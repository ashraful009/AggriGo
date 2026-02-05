import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUser, FaEnvelope, FaLock, FaSeedling, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

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
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

          {/* --- LEFT SIDE: Value Prop / Infographic --- */}
          <div className="md:w-1/2 bg-gradient-to-br from-emerald-800 to-teal-900 relative p-12 flex flex-col justify-between overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-lime-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-lime-400 mb-8">
                <FaSeedling className="text-2xl animate-pulse" />
                <span className="font-bold tracking-wider uppercase text-sm">Join the Network</span>
              </div>

              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Plant the seeds for your <br />
                <span className="text-lime-400">Business Growth</span>.
              </h2>

              {/* Feature List / Roadmap */}
              <div className="space-y-6 mt-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-lime-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Global Market Access</h4>
                    <p className="text-emerald-200/80 text-sm">Connect directly with buyers worldwide.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-lime-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Smart Analytics</h4>
                    <p className="text-emerald-200/80 text-sm">Data-driven insights for better yields.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-lime-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Secure Transactions</h4>
                    <p className="text-emerald-200/80 text-sm">Guaranteed payments and logistics support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="relative z-10 mt-12">
              <p className="text-emerald-300 text-xs italic">"Empowering 10,000+ farmers since 2024"</p>
            </div>
          </div>

          {/* --- RIGHT SIDE: Registration Form --- */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="max-w-md mx-auto w-full">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {t('auth.register.title')}
              </h3>
              <p className="text-gray-500 mb-8">
                Create your free account to get started.
              </p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    {t('auth.register.name')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    {t('auth.register.email')}
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
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    {t('auth.register.password')}
                  </label>
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
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    {t('auth.reset.confirmPassword')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 text-white font-bold text-lg hover:from-lime-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{loading ? t('common.loading') : t('auth.register.button')}</span>
                  {!loading && <FaArrowRight className="text-sm" />}
                </button>
              </form>

              <div className="mt-8 text-center text-sm">
                <p className="text-gray-500">
                  {t('auth.register.hasAccount')}{' '}
                  <Link
                    to="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
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