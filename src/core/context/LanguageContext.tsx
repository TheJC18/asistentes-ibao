import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { es } from "@/i18n/locales/es";
import { en } from "@/i18n/locales/en";
import type { TranslationKeys } from "@/i18n/locales/es";

type Language = "es" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: TranslationKeys;
};

const translations: Record<Language, TranslationKeys> = {
  es,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("es");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Cargar idioma guardado del localStorage
    const savedLanguage = localStorage.getItem("language") as Language | null;
    const initialLanguage = savedLanguage || "es"; // Default español

    setLanguageState(initialLanguage);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("language", language);
      // Actualizar el atributo lang del HTML
      document.documentElement.lang = language;
    }
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Obtener las traducciones actuales
  const translate = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
};

// Hook personalizado para obtener solo las traducciones
export const useTranslation = () => {
  const { translate } = useLanguage();
  return translate;
};
