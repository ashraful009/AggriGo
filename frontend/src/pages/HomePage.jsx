import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import bannerImage from '../assets/banner/banner.png';
import Footer from '../components/Footer';
import {
  FaRocket, FaChartLine, FaHandshake, FaGlobe,
  FaArrowRight, FaLightbulb, FaUsers, FaCheckCircle
} from 'react-icons/fa';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const offerings = [
    { icon: <FaRocket />, title: "Easy Registration", desc: "Seamless onboarding process." },
    { icon: <FaGlobe />, title: "Product Showcase", desc: "Display your harvest easily." },
    { icon: <FaLightbulb />, title: "Training & Support", desc: "Access expert guidance." },
    { icon: <FaHandshake />, title: "Business Networking", desc: "Connect with buyers." },
    { icon: <FaChartLine />, title: "Global Reach", desc: "Expand internationally." },
    { icon: <FaCheckCircle />, title: "Marketing & Export", desc: "Grow your brand." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 font-sans text-zinc-900">
      <Navbar />

      {/* --- HERO SECTION --- */}
    {/* --- HERO SECTION --- */}
<section className="relative w-full overflow-hidden">
  {/* Full-size image using img tag for proper scaling */}
  <img
    src={bannerImage}
    alt="Banner"
    className="w-full h-auto object-contain block"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/20"></div>

  {/* Content container */}
  <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-6">
    <div className="flex flex-col items-center text-center">
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {/* CTA Button */}
          <Link
            to="/register"
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-100 font-bold rounded-lg text-lg transition-all transform hover:-translate-y-1 shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2"
          >
            {t('home.hero.cta')}
            <FaArrowRight />
          </Link>

          {/* Learn More Button */}
          <Link
            to="/about"
            className="px-8 py-4 rounded-lg text-lg font-medium text-stone-200 border border-stone-300/30 hover:bg-stone-200/10 transition-all text-center"
          >
            Learn More
          </Link>
        </div>
      )}
    </div>
  </div>
</section>

     {/* --- STATS / TRUST BAR --- */}
<section className="relative mt-4 md:-mt-16 z-20 px-4">
  <div className="container mx-auto max-w-5xl">
    <div className="bg-neutral-50 rounded-xl shadow-xl border-t border-stone-300 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      
      <StatItem
        icon={<FaUsers className="text-amber-500" />}
        number={<span style={{ color: "#8e4c09", fontWeight: "bold", fontSize: "24px" }}>1k+</span>}
        label="Entrepreneurs"
      />

      <StatItem
        icon={<FaChartLine className="text-amber-500" />}
        number={<span style={{ color: "#8e4c09", fontWeight: "bold", fontSize: "24px" }}>0.5M</span>}
        label="Revenue Generated"
      />

      <StatItem
        icon={<FaCheckCircle className="text-amber-400" />}
        number={<span style={{ color: "#8e4c09", fontWeight: "bold", fontSize: "24px" }}>93%</span>}
        label="Success Rate"
      />

    </div>
  </div>
</section>
      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">

          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Why SRIJON Stands Apart
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-stone-600 max-w-xl mx-auto">
              Everything you need to launch, grow, and scale your business — all in one ecosystem.
            </p>
          </div>

          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={<FaRocket />}
              title={t('home.features.craftsmen.title')}
              desc="Launch your idea quickly with our streamlined tools."
              iconColor="text-amber-500"
              bgClass="bg-amber-50/20"
            />
            <FeatureCard
              icon={<FaLightbulb />}
              title={t('home.features.quality.title')}
              desc="Get smart insights to make better business decisions."
              iconColor="text-amber-500"
              bgClass="bg-zinc-100/20"
            />
            <FeatureCard
              icon={<FaHandshake />}
              title={t('home.features.collection.title')}
              desc="Connect with mentors and investors easily."
              iconColor="text-amber-500"
              bgClass="bg-stone-100/20"
            />
            <FeatureCard
              icon={<FaGlobe />}
              title={t('home.features.experience.title')}
              desc="Access global markets and expand your reach."
              iconColor="text-amber-500"
              bgClass="bg-amber-50/20"
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <MiniFeature
              icon={<FaGlobe />}
              title="Product Showcase"
              desc="Present your products professionally."
            />
            <MiniFeature
              icon={<FaLightbulb />}
              title="Training & Support"
              desc="Expert guidance and learning resources."
            />
            <MiniFeature
              icon={<FaHandshake />}
              title="Business Networking"
              desc="Build strong industry connections."
            />
            <MiniFeature
              icon={<FaChartLine />}
              title="Global Reach"
              desc="Expand beyond local markets."
            />
            <MiniFeature
              icon={<FaCheckCircle />}
              title="Marketing & Export"
              desc="Strategic growth and export support."
            />
          </div>

        </div>
      </section>

      {/* --- BIG CTA SECTION --- */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-amber-500 via-stone-400 to-zinc-600 rounded-2xl p-10 md:p-16 text-center text-stone-50 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {t('home.cta.title')}
              </h2>
              <p className="text-stone-200 text-lg mb-8">
                {t('home.cta.subtitle')}
              </p>

              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-block bg-amber-100 text-stone-900 px-10 py-4 rounded-lg text-lg font-bold hover:bg-amber-200 transition-colors shadow-lg"
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
const MiniFeature = ({ icon, title, desc }) => (
  <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 text-center hover:-translate-y-1">
    <div className="text-amber-500 text-xl mb-3 flex justify-center">{icon}</div>
    <h4 className="text-sm font-semibold text-zinc-900 mb-1">{title}</h4>
    <p className="text-xs text-stone-600 leading-snug">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc, iconColor, bgClass }) => (
  <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
    <div className={`w-12 h-12 ${bgClass} ${iconColor} rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-900 mb-3">{title}</h3>
    <p className="text-stone-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

const StatItem = ({ icon, number, label }) => (
  <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
    <div className="text-4xl p-3 bg-stone-50 rounded-full">{icon}</div>
    <div className="text-center md:text-left">
      <h4 className="text-3xl font-bold text-zinc-900">{number}</h4>
      <p className="text-sm text-stone-500 font-medium uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

export default HomePage;