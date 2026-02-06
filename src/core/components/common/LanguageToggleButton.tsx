import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/core/context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const LanguageToggleButton: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'es', name: 'Español', flagUrl: 'https://flagsapi.com/ES/flat/64.png' },
    { code: 'en', name: 'English', flagUrl: 'https://flagsapi.com/US/flat/64.png' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'es' | 'en');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center gap-2 text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-900 px-4 h-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        title="Cambiar idioma"
      >
        <img src={currentLanguage.flagUrl} alt={currentLanguage.name} className="w-6 h-6 rounded" />
        <span className="hidden sm:inline text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
        <FontAwesomeIcon 
          icon={["fas", isOpen ? "chevron-up" : "chevron-down"]} 
          className="text-xs"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                lang.code === language
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <img src={lang.flagUrl} alt={lang.name} className="w-8 h-8 rounded" />
              <div className="flex-1">
                <div className="font-medium">{lang.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{lang.code.toUpperCase()}</div>
              </div>
              {lang.code === language && (
                <FontAwesomeIcon 
                  icon={["fas", "check"]} 
                  className="text-blue-600 dark:text-blue-400"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
