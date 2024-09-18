import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { I18n } from 'i18n-js';

const i18n = new I18n();

i18n.translations = {
  en: require('../translation/en.json'),
  kn: require('../translation/kn.json'),
};

i18n.enableFallback = true;

type AppContextState = {
  language: string | null;
  setLanguage: (language: string | null) => void;
  t: (key: string) => string;
};

const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('lang');
      if (storedLang) {
        setLanguage(storedLang);
      }
    };
    fetchLanguage();
  }, []);

  useEffect(() => {
    if (language) {
      i18n.locale = language;
    }
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: (lang: string | null) => {
          if (lang) {
            AsyncStorage.setItem('lang', lang);
          }
          setLanguage(lang);
        },
        t: (key: string) => i18n.t(key),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
