import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaRocket, FaChartLine, FaHandshake, FaGlobe, FaArrowRight, FaLightbulb, FaUsers, FaCheckCircle } from 'react-icons/fa';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* --- HERO SECTION --- */}
      {/* Changed to Deep Slate Blue for a Tech/Business look */}
      <section className="relative pt-24 pb-32 bg-slate-900 overflow-hidden">

        {/* Background Abstract Shapes (Blue & Indigo) */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-slate-300 text-xs font-semibold tracking-wider uppercase">
                SRIJON Platform v1.0
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              {t('home.hero.title') || "Empowering Your"} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {t('home.hero.highlight') || "Business Journey"}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            {/* Buttons - Using Amber/Orange for Action (Not Green) */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {t('home.hero.cta')}
                  <FaArrowRight />
                </Link>

                <Link
                  to="/about"
                  className="px-8 py-4 rounded-lg text-lg font-medium text-white border border-slate-700 hover:bg-slate-800 transition-all text-center"
                >
                  Learn More
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- STATS / TRUST BAR --- */}
      {/* Floating white card over dark background */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-xl shadow-xl border-t border-slate-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

            <StatItem
              icon={<FaUsers className="text-blue-600" />}
              number="10k+"
              label="Entrepreneurs"
            />
            <StatItem
              icon={<FaChartLine className="text-indigo-600" />}
              number="$2M+"
              label="Revenue Generated"
            />
            <StatItem
              icon={<FaCheckCircle className="text-amber-500" />}
              number="98%"
              label="Success Rate"
            />

          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('home.features.title')}
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              Everything you need to launch and scale your business in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<FaRocket />}
              title={t('home.features.easy.title')}
              desc="Launch your idea quickly with our streamlined tools."
              iconColor="text-blue-600"
              bgClass="bg-blue-50"
            />
            <FeatureCard
              icon={<FaLightbulb />}
              title={t('home.features.growth.title')}
              desc="Get smart insights to make better business decisions."
              iconColor="text-amber-600"
              bgClass="bg-amber-50"
            />
            <FeatureCard
              icon={<FaHandshake />}
              title={t('home.features.support.title')}
              desc="Connect with mentors and investors easily."
              iconColor="text-indigo-600"
              bgClass="bg-indigo-50"
            />
            <FeatureCard
              icon={<FaGlobe />}
              title={t('home.features.market.title')}
              desc="Access global markets and expand your reach."
              iconColor="text-cyan-600"
              bgClass="bg-cyan-50"
            />
          </div>
        </div>
      </section>

      {/* --- BIG CTA SECTION --- */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {/* Changed gradient to Blue/Indigo instead of Green */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">

            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {t('home.cta.title')}
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                {t('home.cta.subtitle')}
              </p>

              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-block bg-white text-blue-900 px-10 py-4 rounded-lg text-lg font-bold hover:bg-slate-100 transition-colors shadow-lg"
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

// --- Helper Components ---

const StatItem = ({ icon, number, label }) => (
  <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
    <div className="text-4xl p-3 bg-slate-50 rounded-full">{icon}</div>
    <div className="text-center md:text-left">
      <h4 className="text-3xl font-bold text-slate-800">{number}</h4>
      <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc, iconColor, bgClass }) => (
  <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
    <div className={`w-12 h-12 ${bgClass} ${iconColor} rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default HomePage;