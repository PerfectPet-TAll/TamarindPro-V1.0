export interface Promotion {
  id: string;
  name: string;
  budget: number;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
}

export const MOCK_PROMOTIONS: Promotion[] = [
  { id: 'PRM-001', name: 'Summer Carnival Sale', budget: 500000, type: 'Trade Promo', status: 'Active', startDate: '2026-06-01', endDate: '2026-07-31', targetAudience: 'Modern Trade' },
  { id: 'PRM-002', name: 'New Year Early Bird', budget: 1200000, type: 'Consumer Promo', status: 'Draft', startDate: '2026-11-01', endDate: '2026-12-31', targetAudience: 'All Channels' },
  { id: 'PRM-003', name: 'Q3 Regional Push', budget: 250000, type: 'Trade Promo', status: 'Active', startDate: '2026-08-01', endDate: '2026-09-30', targetAudience: 'Traditional Trade' },
  { id: 'PRM-004', name: 'Premium Segment Launch', budget: 850000, type: 'Product Launch', status: 'Completed', startDate: '2026-01-01', endDate: '2026-03-31', targetAudience: 'Premium Retail' },
  { id: 'PRM-005', name: 'Mid-Year Flash Sale', budget: 150000, type: 'Consumer Promo', status: 'Active', startDate: '2026-06-15', endDate: '2026-06-30', targetAudience: 'E-Commerce' },
];
