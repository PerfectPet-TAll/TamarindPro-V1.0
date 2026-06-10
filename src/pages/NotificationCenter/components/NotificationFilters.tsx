import React from 'react';
import { Search, SlidersHorizontal, Tag, RefreshCw } from 'lucide-react';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (s: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'sheets', label: 'Sheets Sync' },
  { id: 'sales', label: 'Sales & Invoices' },
  { id: 'oem', label: 'Factory PO' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'system', label: 'System Guard' }
];

const SEVERITIES = [
  { id: 'all', label: 'All Severities' },
  { id: 'critical', label: 'Critical Only' },
  { id: 'warning', label: 'Warning Only' },
  { id: 'success', label: 'Success Entries' },
  { id: 'info', label: 'Info' }
];

export default function NotificationFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSeverity,
  setSelectedSeverity
}: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto flex-1">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7361]" />
          <input
            id="notif-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, details or dates..."
            className="w-full pl-10 pr-4 h-[42px] text-[12px] border border-[#adb2b0] rounded-xl font-bold outline-none focus:border-[#af7a2b] bg-white shadow-sm text-[#2e3118]"
          />
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2">
          <select
            id="notif-severity-select"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-[42px] pl-4 pr-10 bg-white border border-[#adb2b0] rounded-xl font-bold text-[11px] text-[#2e3118] cursor-pointer outline-none focus:border-[#af7a2b] shadow-sm uppercase tracking-wider"
          >
            {SEVERITIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="flex items-center gap-2 w-full xl:w-auto">
        <select
          id="notif-category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-[42px] pl-4 pr-10 w-full bg-white border border-[#adb2b0] rounded-xl font-bold text-[11px] text-[#2e3118] cursor-pointer outline-none focus:border-[#af7a2b] shadow-sm uppercase tracking-wider"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.id === 'all' ? 'ALL NODES' : cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
