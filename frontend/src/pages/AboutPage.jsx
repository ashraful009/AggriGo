import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaLeaf, FaStore, FaChalkboardTeacher, FaHandshake, FaGlobeAmericas, FaChartLine, FaSeedling } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();
  // Data for the "What We Offer" section to make mapping cleaner
  const offerings = [
    {
      icon: <FaStore />,
      title: t('about.offerings.registration.title'),
      desc: t('about.offerings.registration.desc')
    },
    {
      icon: <FaLeaf />,
      title: t('about.offerings.showcase.title'),
      desc: t('about.offerings.showcase.desc')
    },
    {
      icon: <FaChalkboardTeacher />,
      title: t('about.offerings.training.title'),
      desc: t('about.offerings.training.desc')
    },
    {
      icon: <FaHandshake />,
      title: t('about.offerings.networking.title'),
      desc: t('about.offerings.networking.desc')
    },
    {
      icon: <FaGlobeAmericas />,
      title: t('about.offerings.globalReach.title'),
      desc: t('about.offerings.globalReach.desc')
    },
    {
      icon: <FaChartLine />,
      title: t('about.offerings.marketing.title'),
      desc: t('about.offerings.marketing.desc')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      {/* --- HERO HEADER --- */}
      <div className="relative bg-emerald-900 py-24 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm mb-4 border border-white/20">
            <FaSeedling className="text-lime-400 text-2xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {t('about.hero.cultivating')} <span className="text-lime-400">{t('about.hero.growth')}</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            {t('about.hero.subtitle')}
          </p>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-12 -mt-10 relative z-20">
        <div className="max-w-6xl mx-auto">

          {/* --- INTRO CARD --- */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border-l-8 border-lime-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              {t('about.title')}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('about.intro.part1')} <span className="font-semibold text-emerald-700">{t('about.intro.highlight')}</span> {t('about.intro.part2')}
            </p>
          </div>

          {/* --- MISSION SECTION (Split Layout) --- */}
          <div className="grid md:grid-cols-2 gap-0 mb-20 rounded-3xl overflow-hidden shadow-lg">
            <div className="bg-emerald-800 p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
              <FaGlobeAmericas className="absolute -right-10 -bottom-10 text-9xl text-white opacity-10" />
              <h2 className="text-3xl font-bold mb-4">{t('about.mission.title')}</h2>
              <div className="w-20 h-1 bg-lime-400 mb-6"></div>
              <p className="text-emerald-100 text-lg leading-relaxed relative z-10">
                {t('about.mission.statement')}
              </p>
            </div>
            <div className="bg-white p-10 md:p-14 flex items-center">
              <p className="text-gray-600 text-lg">
                {t('about.mission.details')}
              </p>
            </div>
          </div>

          {/* --- WHAT WE OFFER (Grid Infographic) --- */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">{t('about.offerings.title')}</h2>
              <p className="text-gray-500 mt-2">{t('about.offerings.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerings.map((item, index) => (
                <div key={index} className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-lime-500 transition-colors duration-300">
                      <div className="text-emerald-600 group-hover:text-white text-xl transition-colors">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- CTA SECTION --- */}
          <div className="bg-gray-900 rounded-3xl p-10 text-center relative overflow-hidden">
            {/* Decorative lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-500"></div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('about.cta.title')}
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
            <Link
              to="/register"
              className="inline-flex items-center bg-lime-500 text-emerald-900 px-8 py-3 rounded-lg font-bold hover:bg-lime-400 transition-colors shadow-lg hover:shadow-lime-500/20"
            >
              <FaSeedling className="mr-2" />
              {t('about.cta.button')}
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;