import React from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Calendar, 
  ArrowUpRight, 
  Database, 
  ShoppingCart, 
  Factory, 
  Ship, 
  Settings, 
  Flame, 
  AlertTriangle, 
  Info, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { motion } from 'motion/react';
import { Notification } from '../../../types';

interface ListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}

export default function NotificationList({ notifications, onMarkRead }: ListProps) {
  
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'sheets':
        return { 
          icon: Database, 
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          label: 'Google Sheets Sync'
        };
      case 'sales':
        return { 
          icon: ShoppingCart, 
          bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          label: 'Sales'
        };
      case 'oem':
        return { 
          icon: Factory, 
          bgColor: 'bg-[#ad7332]/10 text-[#ad7332] border-[#ad7332]/20',
          label: 'OEM Contract'
        };
      case 'logistics':
        return { 
          icon: Ship, 
          bgColor: 'bg-sky-50 text-sky-700 border-sky-100',
          label: 'Export Logistics'
        };
      case 'calendar':
        return { 
          icon: Calendar, 
          bgColor: 'bg-purple-50 text-purple-700 border-purple-100',
          label: 'Calendar'
        };
      default:
        return { 
          icon: Settings, 
          bgColor: 'bg-slate-50 text-slate-700 border-slate-100',
          label: 'System Admin'
        };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: Flame,
          styles: 'bg-red-50 text-red-700 border-red-100'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          styles: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'success':
        return {
          icon: Sparkles,
          styles: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        };
      default:
        return {
          icon: Info,
          styles: 'bg-blue-50 text-blue-700 border-blue-105'
        };
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-slate-100 rounded-[24px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm border border-slate-100">
          <Inbox size={26} />
        </div>
        <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">No Alerts Filtered</h4>
        <p className="text-[11px] text-slate-405 text-center mt-1 max-w-sm">
          All notifications cleared or no records fit the active search parameters. Try adjusting filters or select another category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((item, index) => {
        const cat = getCategoryTheme(item.category);
        const CatIcon = cat.icon;
        const sev = getSeverityBadge(item.severity);
        const SevIcon = sev.icon;
        const formattedDate = new Date(item.createdAt).toLocaleString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
            className={`p-4 md:p-5 rounded-[20px] transition-all border flex gap-4 items-start ${
              item.isRead 
                ? 'bg-slate-50/50 border-slate-100 opacity-70' 
                : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-soft'
            }`}
          >
            {/* Category Left Column Indicator */}
            <div className={`p-3 rounded-xl shrink-0 ${cat.bgColor} border shadow-inner`}>
              <CatIcon size={20} />
            </div>

            {/* Notification Body */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* Severity Badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${sev.styles}`}>
                  <SevIcon size={10} />
                  {item.severity}
                </span>

                {/* Node Source Label */}
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-[0.1em]">
                  {cat.label}
                </span>

                {/* Status indicator */}
                {!item.isRead && (
                  <span className="w-1.5 h-1.5 bg-[#f47729] rounded-full animate-pulse shrink-0"></span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className={`text-xs md:text-[13px] font-black uppercase tracking-tight ${item.isRead ? 'text-slate-500 line-through' : 'text-[#2e3118]'}`}>
                {item.title}
              </h3>
              
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line">
                {item.description}
              </p>

              {/* Timestamp column */}
              <div className="text-[9.5px] font-extrabold text-[#8c7361] uppercase tracking-wider font-mono flex items-center gap-1.5 pt-1">
                <span className="inline-block bg-slate-100 rounded px-1.5 py-0.5">Time Log</span> {formattedDate}
              </div>
            </div>

            {/* Mark as read / action box */}
            {!item.isRead && (
              <button
                onClick={() => onMarkRead(item.id)}
                className="p-2 bg-slate-50 hover:bg-[#f47729]/10 text-slate-400 hover:text-[#f47729] border border-slate-150 rounded-xl transition-all cursor-pointer shrink-0"
                title="Mark as standard read"
              >
                <Check size={16} strokeWidth={2.5} />
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
