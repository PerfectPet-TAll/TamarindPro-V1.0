export const THEME = {
  bgMain: 'transparent', 
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1f2a44 0%, #202024 100%)', 

  primary: '#f47729', 
  primaryDark: '#ad7332',
  accent: '#af7a2b', 
  textMain: '#2e3118', 
  textMuted: '#53483e', 
  textSubtle: '#8c7361', 
  cardBg: '#FFFFFF',
  success: '#606934', 
  palette: {
    gold: '#af7a2b',
    navyDeep: '#091d38',
    navy: '#214573',
    orangeBright: '#f47729',
    olive: '#606934',
    blueMuted: '#5167a2',
    darkOlive: '#2e3118',
    warmGray: '#53483e',
    warmBrown: '#93644b',
    sageTeal: '#7c9d9c',
    deepTeal: '#426a77',
    earthyBrown: '#836350',
    lightAqua: '#5da7b3',
    slateBlue: '#627680',
    dustyRose: '#bf8f7e',
    darkKhaki: '#5e4b2b',
    bronze: '#ad7332',
    silver: '#adb2b0',
    taupe: '#8c7361',
    lightTan: '#d2af94',
    wipPurple: '#735f82'
  }
};

export const CATEGORIES = ['All', 'Modern Trade', 'Traditional Trade', 'Food Service', 'Corporate', 'Agent'];

export const SUB_CATEGORIES: Record<string, string[]> = {
    'Modern Trade': ['Supermarket', 'Convenience Store', 'Hypermarket'],
    'Traditional Trade': ['Wholesale', 'Retail', 'Local Market'],
    'Food Service': ['Restaurant', 'Hotel', 'Catering', 'Cafe'],
    'Corporate': ['B2B Company', 'Factory', 'Office'],
    'Agent': ['Distributor', 'Broker']
};

export const CREDIT_TERMS = ['Cash', '7 Days', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days'];

export const INITIAL_REGIONS = [
    { id: 'Domestic', label: 'Domestic' },
    { id: 'Southeast Asia', label: 'Southeast Asia' },
    { id: 'East Asia', label: 'East Asia' },
    { id: 'South Asia', label: 'South Asia' },
    { id: 'Middle East', label: 'Middle East' },
    { id: 'Europe', label: 'Europe' },
    { id: 'North America', label: 'North America' },
    { id: 'Oceania', label: 'Oceania' },
    { id: 'Africa', label: 'Africa' }
];

export const INITIAL_COUNTRIES = [
    { id: 'C1', region: 'Domestic', label: 'Thailand' },
    { id: 'C2', region: 'South Asia', label: 'Bangladesh' },
    { id: 'C3', region: 'Europe', label: 'Netherlands' },
    { id: 'C4', region: 'Oceania', label: 'New Zealand' },
    { id: 'C5', region: 'South Asia', label: 'Pakistan' }
];

export interface Customer {
  id: string;
  name: string;
  cat: string;
  subCat: string;
  taxId: string;
  billingAddress: string;
  shippingAddresses: { id: number; address: string }[];
  credit: string;
  vatType: string;
  estRev: number;
  status: string;
  contact: string;
  phone: string;
  email: string;
  pp20: string;
  comReg: string;
  updated: string;
  region: string;
  country: string;
  salesAccount: string;
  registDate: string;
  note: string;
  contactDetail: string;
}

export const getCategoryStyle = (category: string) => {
    switch (category?.toUpperCase()) {
        case 'MODERN TRADE': return `bg-[#f47729]/10 text-[#f47729] border-[#f47729]/30`;
        case 'FOOD SERVICE': return `bg-[#5da7b3]/10 text-[#5da7b3] border-[#5da7b3]/30`;
        case 'TRADITIONAL TRADE': return `bg-[#af7a2b]/10 text-[#af7a2b] border-[#af7a2b]/30`;
        case 'CORPORATE': return `bg-[#606934]/10 text-[#606934] border-[#606934]/30`;
        case 'AGENT': return `bg-[#5167a2]/10 text-[#5167a2] border-[#5167a2]/30`;
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};

export const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return `bg-green-50 text-[#606934] border-[#606934]/30`;
        case 'INACTIVE': return 'bg-slate-100 text-slate-500 border-slate-200';
        case 'HOLD': return `bg-red-50 text-red-500 border-red-200`;
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};
