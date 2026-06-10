import React, { createContext, useContext, useState } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionary: Record<string, Record<Language, string>> = {
    // Basic navigation labels
    'label_home': { en: 'HOME', th: 'หน้าหลัก' },
    'label_calendar': { en: 'CALENDAR', th: 'ปฏิทิน' },
    'label_notification': { en: 'NOTIFICATION CENTER', th: 'แจ้งเตือน' },
    'label_ai_copilot': { en: 'AI COPILOT', th: 'ผู้ช่วย AI' },
    'label_finance': { en: 'FINANCE', th: 'การเงิน' },
    'label_master': { en: 'MASTER DATA', th: 'ข้อมูลหลัก' },
    'label_settings': { en: 'SETTINGS', th: 'ตั้งค่า' },
    'label_sales_operations': { en: 'SALES OPERATIONS', th: 'ปฏิบัติการฝ่ายขาย' },
    'label_oem_procurement': { en: 'OEM PROCUREMENT', th: 'จัดซื้อ OEM' },
    'label_export_logistics': { en: 'EXPORT LOGISTICS', th: 'การส่งออกและโลจิสติกส์' },
    'label_analytics': { en: 'PERFORMANCE ANALYTICS', th: 'วิเคราะห์ผลประกอบการ' },
    'label_sale_dept': { en: 'SALES DEPT', th: 'ฝ่ายขาย' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    // A simple translation function:
    // If the key exists in our dictionary, return the specified language string.
    // Otherwise, fallback to a default text.
    const t = (key: string, defaultText: string) => {
        if (dictionary[key] && dictionary[key][language]) {
            return dictionary[key][language];
        }
        return defaultText;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
