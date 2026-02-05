import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Assuming you have this
import { FaRocket, FaChartLine, FaHandshake, FaGlobe, FaArrowRight, FaLeaf } from 'react-icons/fa';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      {/* Uses a dark gradient with a pattern overlay to look like a modern dashboard or night field */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden pb-32 pt-20">

        {/* Background Pattern (Abstract Data Fields) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>

        {/* Decorative Circle (Sun/Moon) */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-lime-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1 mb-8">
              <span className="w-2 h-2 bg-lime-400 rounded-full animate-ping"></span>
              <span className="text-emerald-100 text-sm font-medium tracking-wider uppercase">The Future of Farming</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              {t('home.hero.title')}
              <span className="text-lime-400">.</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-emerald-100 font-light max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group relative bg-lime-500 hover:bg-lime-400 text-emerald-950 px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(132,204,22,0.5)] flex items-center justify-center"
                >
                  {t('home.hero.cta')}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 rounded-xl text-lg font-bold text-white border border-white/30 hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SVG Wave Divider: Creates an organic transition to the next section */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-24 md:h-48" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* --- FEATURES / INFOGRAPHIC SECTION --- */}
      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('home.features.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 mx-auto rounded-full"></div>
          </div>

          {/* Connected Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Dashed Connector Line (Visible on Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 border-t-2 border-dashed border-emerald-200 -z-10 transform translate-y-4"></div>

            {/* Feature 1 */}
            <FeatureCard
              icon={<FaRocket />}
              title={t('home.features.easy.title')}
              desc={t('home.features.easy.desc')}
              color="text-blue-500"
              bg="bg-blue-50"
              step="01"
            />

            {/* Feature 2 */}
            <FeatureCard
              icon={<FaChartLine />}
              title={t('home.features.growth.title')}
              desc={t('home.features.growth.desc')}
              color="text-emerald-500"
              bg="bg-emerald-50"
              step="02"
            />

            {/* Feature 3 */}
            <FeatureCard
              icon={<FaHandshake />}
              title={t('home.features.support.title')}
              desc={t('home.features.support.desc')}
              color="text-orange-500"
              bg="bg-orange-50"
              step="03"
            />

            {/* Feature 4 */}
            <FeatureCard
              icon={<FaGlobe />}
              title={t('home.features.market.title')}
              desc={t('home.features.market.desc')}
              color="text-purple-500"
              bg="bg-purple-50"
              step="04"
            />
          </div>
        </div>
      </section>

      {/* --- BIG CTA SECTION --- */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-emerald-900 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl text-center">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-lime-500 opacity-20 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl"></div>

            <div className="relative z-10">
              <FaLeaf className="text-lime-400 text-5xl mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                {t('home.cta.title')}
              </h2>
              <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
                {t('home.cta.subtitle')}
              </p>

              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-block bg-white text-emerald-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-lime-400 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
                >
                  {t('home.cta.button')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Sub-Component for Clean Code ---
// Renders the individual feature cards with the "Infographic" step number
const FeatureCard = ({ icon, title, desc, color, bg, step }) => (
  <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">

    {/* Step Number Background */}
    <span className="absolute -right-4 -top-4 text-9xl font-bold text-gray-50 opacity-50 select-none group-hover:text-emerald-50 transition-colors">
      {step}
    </span>

    <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mb-6 transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
      <span className={`text-3xl ${color}`}>
        {icon}
      </span>
    </div>

    <h3 className="text-xl font-bold text-gray-800 mb-3 relative z-10">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed relative z-10">
      {desc}
    </p>
  </div>
);

export default HomePage;