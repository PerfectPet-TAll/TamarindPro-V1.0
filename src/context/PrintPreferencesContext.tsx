import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PrintPreferences {
  showWatermark: boolean;
  includeSignature: boolean;
  paperOrientation: 'portrait' | 'landscape';
}

interface PrintPreferencesContextType {
  preferences: PrintPreferences;
  toggleWatermark: () => void;
  toggleSignature: () => void;
  setPaperOrientation: (orientation: 'portrait' | 'landscape') => void;
}

const PrintPreferencesContext = createContext<PrintPreferencesContextType | undefined>(undefined);

export function PrintPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<PrintPreferences>(() => {
    const cached = localStorage.getItem('print-preferences');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // use default
      }
    }
    return {
      showWatermark: true,
      includeSignature: true,
      paperOrientation: 'portrait'
    };
  });

  useEffect(() => {
    localStorage.setItem('print-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const toggleWatermark = () => {
    setPreferences(prev => ({ ...prev, showWatermark: !prev.showWatermark }));
  };

  const toggleSignature = () => {
    setPreferences(prev => ({ ...prev, includeSignature: !prev.includeSignature }));
  };

  const setPaperOrientation = (paperOrientation: 'portrait' | 'landscape') => {
    setPreferences(prev => ({ ...prev, paperOrientation }));
  };

  return (
    <PrintPreferencesContext.Provider value={{ preferences, toggleWatermark, toggleSignature, setPaperOrientation }}>
      {children}
    </PrintPreferencesContext.Provider>
  );
}

export function usePrintPreferences() {
  const context = useContext(PrintPreferencesContext);
  if (!context) {
    throw new Error('usePrintPreferences must be used within a PrintPreferencesProvider');
  }
  return context;
}
