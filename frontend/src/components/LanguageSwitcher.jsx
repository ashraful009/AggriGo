import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'en' ? 'bn' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors font-medium"
      aria-label="Switch Language"
    >
      {currentLanguage === 'en' ? 'বাংলা' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
