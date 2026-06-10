import { Leaf, Package, Database, Factory, Layers } from 'lucide-react';

export const THEME = {
  bgMain: '#EAF2EA', 
  bgGradient: 'radial-gradient(130% 100% at 50% 0%, #EAF2EA 0%, #F0EAE1 40%, #E2D1C3 75%, #C2A895 100%)',
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

export interface Category {
  id: string;
  label: string;
  icon: any;
}

export interface SubCategory {
  id: string;
  catId: string;
  label: string;
}

export interface Variety {
  id: string;
  label: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'FT', label: 'FRESH TAMARIND', icon: Leaf },
  { id: 'TB', label: 'Tamarind Balls', icon: Package },
  { id: 'PT', label: 'Pickle Tamarind', icon: Database },
  { id: 'TS', label: 'Tamarind Sauce', icon: Factory },
  { id: 'TP', label: 'TAMARIND PASTE', icon: Layers }
];

export const DEFAULT_SUB_CATEGORIES: SubCategory[] = [
  { id: 'S1', catId: 'FT', label: 'SWEET TAMARIND SITHONG' },
  { id: 'S2', catId: 'FT', label: 'SWEET TAMARIND KUNTI' },
  { id: 'S3', catId: 'FT', label: 'SWEET TAMARIND MIX' },
  { id: 'S4', catId: 'FT', label: 'SOUR TAMARIND JUMBO' },
  { id: 'S5', catId: 'FT', label: 'SOUR TAMARIND STANDARD' },
  { id: 'S6', catId: 'FT', label: 'SOUR TAMARIND MEDIUM' },
  { id: 'S7', catId: 'TB', label: 'ORIGINAL' },
  { id: 'S8', catId: 'TB', label: 'FLAVORING' },
  { id: 'S9', catId: 'TB', label: 'COATING' },
  { id: 'S10', catId: 'PT', label: 'SYRUP' },
  { id: 'S11', catId: 'PT', label: 'DRIED' },
  { id: 'S12', catId: 'TS', label: 'ORIGINAL' },
  { id: 'S13', catId: 'TS', label: 'FLAVORING' },
  { id: 'S14', catId: 'TP', label: 'ORIGINAL' },
  { id: 'S15', catId: 'TP', label: 'FLAVORING' }
];

export const DEFAULT_VARIETIES: Variety[] = [
  { id: 'V1', label: 'สีทอง' },
  { id: 'V2', label: 'ศรีชมภู' },
  { id: 'V3', label: 'ประกายทอง' },
  { id: 'V4', label: 'คละสายพันธุ์' }
];

export interface ProductForm {
  rowId: any;
  skuCode: string;
  productName: string;
  category: string;
  subCategory: string;
  variety: string;
  flavor: string;
  packaging: string;
  packingSize: string;
  grossWeight: number;
  netWeightGram: number;
  netWeightLabel: string;
  qtyPerCarton: number;
  stdPrice: number;
  images: any[];
  desc: string;
}
