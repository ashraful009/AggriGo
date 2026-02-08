import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaLeaf, FaStore, FaChalkboardTeacher, FaHandshake, FaGlobeAmericas, FaChartLine, FaSeedling, FaUsers, FaArrowRight, FaLightbulb } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  // Updated icons to match the new blue/amber theme
  const offerings = [
    {
      icon: <FaStore />,
      title: t('about.offerings.registration.title'),
      desc: t('about.offerings.registration.desc'),
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: <FaLeaf />, // Changed context: Growth/Sustainability
      title: t('about.offerings.showcase.title'),
      desc: t('about.offerings.showcase.desc'),
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: <FaChalkboardTeacher />,
      title: t('about.offerings.training.title'),
      desc: t('about.offerings.training.desc'),
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: <FaHandshake />,
      title: t('about.offerings.networking.title'),
      desc: t('about.offerings.networking.desc'),
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: <FaGlobeAmericas />,
      title: t('about.offerings.globalReach.title'),
      desc: t('about.offerings.globalReach.desc'),
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    },
    {
      icon: <FaChartLine />,
      title: t('about.offerings.marketing.title'),
      desc: t('about.offerings.marketing.desc'),
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* --- HERO HEADER --- */}
      {/* Matches Home Page Deep Slate/Blue Theme */}
      <div className="relative bg-slate-900 py-24 overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md mb-6">
            <FaUsers className="text-amber-500" />
            <span className="text-slate-300 text-sm font-semibold tracking-wider uppercase">Who We Are</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('about.hero.cultivating') || "Building the Future of"} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {t('about.hero.growth') || "Entrepreneurship"}
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="max-w-6xl mx-auto">

          {/* --- INTRO CARD --- */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 mb-20 relative overflow-hidden">
            {/* Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-500"></div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {t('about.title')}
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              {t('about.intro.part1')} <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{t('about.intro.highlight')}</span> {t('about.intro.part2')}
            </p>
          </div>

          {/* --- MISSION & VISION (Side-by-Side Cards) --- */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">

            {/* Mission Card (Dark Blue) */}
            <div className="bg-blue-900 text-white p-10 rounded-2xl relative overflow-hidden shadow-lg flex flex-col justify-center min-h-[300px]">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <FaGlobeAmericas className="text-9xl" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center mb-6 text-2xl">
                  <FaSeedling className="text-blue-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('about.mission.title') || "Our Mission"}</h3>
                <p className="text-blue-100 leading-relaxed text-lg opacity-90">
                  {t('about.mission.statement')}
                </p>
              </div>
            </div>

            {/* Vision/Details Card (White/Light) */}
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center min-h-[300px]">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-6 text-2xl">
                <FaLightbulb className="text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Why We Do It</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {t('about.mission.details')}
              </p>
            </div>

          </div>

          {/* --- WHAT WE OFFER (Grid) --- */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {t('about.offerings.title')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
              <p className="text-slate-500 max-w-2xl mx-auto">
                {t('about.offerings.subtitle') || "Comprehensive tools tailored for modern businesses."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offerings.map((item, index) => (
                <div key={index} className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 ${item.bg} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`text-2xl ${item.color}`}>
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* --- CTA SECTION --- */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('about.cta.title')}
              </h2>
              <p className="text-slate-300 mb-10 text-lg leading-relaxed">
                {t('about.cta.description')}
              </p>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-all transform hover:-translate-y-1 shadow-lg shadow-amber-500/20"
              >
                {t('about.cta.button')}
                <FaArrowRight />
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;