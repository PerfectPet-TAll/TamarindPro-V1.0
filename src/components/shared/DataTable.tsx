import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { Pagination } from './Pagination';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  className?: string;
  hasPagination?: boolean;
  isLoading?: boolean;
}

export function DataTable({ columns, data, onRowClick, className, hasPagination = true, isLoading = false }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [dateFilter, setDateFilter] = useState({ month: '', year: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return data.filter(row => {
      // General Column Filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const rowValue = row[key];
        return String(rowValue ?? '').toLowerCase().includes(String(value).toLowerCase());
      });

      // Date Filters (Month/Year)
      const matchesDate = () => {
        if (!dateFilter.month && !dateFilter.year) return true;
        const date = new Date(row.date || row.timestamp || row.createdAt);
        if (isNaN(date.getTime())) return true; // Skip if no valid date field

        const matchesMonth = dateFilter.month ? (date.getMonth() + 1) === parseInt(dateFilter.month) : true;
        const matchesYear = dateFilter.year ? date.getFullYear() === parseInt(dateFilter.year) : true;
        return matchesMonth && matchesYear;
      };

      return matchesFilters && matchesDate();
    }).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, filters, dateFilter, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!hasPagination) return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize, hasPagination]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, dateFilter, sortConfig]);

  return (
    <div className={clsx("sys-table-card w-full flex flex-col", className)}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sys-table-header">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-4 border-b-2 border-primary">
                  <div className="flex flex-col gap-2">
                    <div 
                      className={clsx(
                        "flex items-center gap-2 sys-table-th",
                        col.sortable && "cursor-pointer hover:text-white/70 transition-colors"
                      )}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      {col.label}
                      {col.sortable && (
                        <span className="text-white/50">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-white" /> : <ChevronDown size={14} className="text-white" />
                          ) : <ArrowUpDown size={14} />}
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-2.5">
                      <div className="h-4 bg-slate-200 rounded w-full max-w-[80%] mx-auto"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    "hover:bg-slate-50/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 sys-table-td">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Filter size={24} className="opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No matching data found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {hasPagination && filteredData.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalCount={filteredData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          className="rounded-b-none border-x-0 border-b-0"
        />
      )}
    </div>
  );
}
