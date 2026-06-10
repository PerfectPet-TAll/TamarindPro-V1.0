export interface PriceBook {
  id: string;
  name: string;
  type: string;
  currency: string;
  items: number;
  lastUpdate: string;
  status: string;
}

export interface SKUProduct {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  bookPrice: number;
  margin: string;
}

export const THEME = {
    primary: '#f47729', 
    primaryDark: '#ad7332',
    accent: '#af7a2b', 
    textMain: '#2e3118', 
    success: '#606934', 
    blueNavy: '#091d38',
    blueDeep: '#214573',
};

export const MOCK_PRICE_BOOKS: PriceBook[] = [
  { id: 'PB-001', name: 'Standard Retail (RRP)', type: 'Base', currency: 'THB', items: 120, lastUpdate: '2025-06-05', status: 'Active' },
  { id: 'PB-002', name: 'Wholesale Tier 1 (MOQ 100)', type: 'Volume', currency: 'THB', items: 85, lastUpdate: '2025-06-03', status: 'Active' },
  { id: 'PB-003', name: 'International Distributor', type: 'Export', currency: 'USD', items: 45, lastUpdate: '2025-05-15', status: 'Draft' },
  { id: 'PB-004', name: 'Summer Promotion 2026', type: 'Promo', currency: 'THB', items: 30, lastUpdate: '2025-06-01', status: 'Active' },
];

export const MOCK_ITEMS: SKUProduct[] = [
  { id: 'SKU-001', name: 'Sweet Tamarind Premium Box', category: 'FT', basePrice: 250, bookPrice: 200, margin: '20%' },
  { id: 'SKU-002', name: 'Pickled Tamarind Jar (500g)', category: 'PT', basePrice: 85, bookPrice: 70, margin: '18%' },
  { id: 'SKU-003', name: 'Tamarind Balls Spicy', category: 'TB', basePrice: 120, bookPrice: 95, margin: '21%' },
  { id: 'SKU-004', name: 'Tamarind Paste Original', category: 'TP', basePrice: 180, bookPrice: 150, margin: '17%' },
];

export const MOCK_MULTI_BOOK_PRICES: Record<string, Record<string, number>> = {
  'SKU-001': { 'PB-001': 200, 'PB-002': 180, 'PB-003': 150, 'PB-004': 210 },
  'SKU-002': { 'PB-001': 70,  'PB-002': 60,  'PB-003': 50,  'PB-004': 75 },
  'SKU-003': { 'PB-001': 95,  'PB-002': 85,  'PB-003': 70,  'PB-004': 100 },
  'SKU-004': { 'PB-001': 150, 'PB-002': 130, 'PB-003': 120, 'PB-004': 160 },
};

export const MOCK_PRODUCT_HISTORY = [
  { month: 'Jan', 'SKU-001': 190, 'SKU-002': 65, 'SKU-003': 90, 'SKU-004': 140 },
  { month: 'Feb', 'SKU-001': 195, 'SKU-002': 65, 'SKU-003': 90, 'SKU-004': 145 },
  { month: 'Mar', 'SKU-001': 200, 'SKU-002': 68, 'SKU-003': 95, 'SKU-004': 150 },
  { month: 'Apr', 'SKU-001': 200, 'SKU-002': 70, 'SKU-003': 95, 'SKU-004': 150 },
  { month: 'May', 'SKU-001': 200, 'SKU-002': 70, 'SKU-003': 95, 'SKU-004': 150 },
];

export const COLORS = ['#f47729', '#214573', '#606934', '#af7a2b'];
