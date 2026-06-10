import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, Box, Bell, AlertTriangle, FileText, CheckCircle2, RefreshCw, Printer, ChevronDown, Check } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'alert', title: 'System Maintenance', time: '10 mins ago', message: 'Scheduled DB maintenance at 00:00 UTC.', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 2, type: 'approval', title: 'Pending Approval', time: '1 hour ago', message: 'Factory PO (OEM-2605-012) requires your signature.', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, type: 'success', title: 'Container Dispatched', time: '3 hours ago', message: 'PI-2024-001 has been loaded and dispatched successfully.', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(new Date());
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulate periodic sync
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setLastSynced(new Date());
      }, 1500);
    }, 60000); // sync every minute
    return () => clearInterval(syncInterval);
  }, []);

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <header className="bg-transparent border-b border-slate-200/50 px-6 flex justify-between items-center z-10 h-24 shrink-0">
      {/* Left side: Workspace Title */}
      <div className="flex items-center gap-3">
        <div className="text-[#ab8a3b] p-1 border border-[#ab8a3b]/20 rounded-md">
          <Box size={22} strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-base font-black tracking-widest uppercase mb-0.5">
            <span className="text-[#f47729]">Tamarind</span>
            <span className="text-[#091d38]">Pro</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            AUTENTIC & VARIETIES MEAT PRODUCT
          </p>
        </div>
      </div>

      {/* Right side: Date and Time / Notifications */}
      <div className="flex items-center gap-4">
        {/* Sync Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
          isSyncing 
            ? 'bg-blue-50 border-blue-200 text-blue-600' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
        }`}>
          <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
          <span className="text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
            {isSyncing ? 'Syncing...' : `Synced ${formatTimeAgo(lastSynced)}`}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-[#111f42] hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center border border-transparent hover:border-slate-200"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F9F7F6]"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transform origin-top-right z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="text-xs font-black text-[#111f42] uppercase tracking-widest">Notifications</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{mockNotifications.length} New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                {mockNotifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                         <div className={`mt-0.5 p-2 rounded-full ${notif.bg} ${notif.color} shrink-0 h-fit`}>
                           <Icon size={14} />
                         </div>
                         <div>
                            <div className="flex justify-between items-start mb-1">
                               <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-[#ab8a3b] transition-colors">{notif.title}</p>
                               <span className="text-[10px] font-black text-slate-400 shrink-0 mt-0.5">{notif.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{notif.message}</p>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-center">
                 <span className="text-[10px] font-black tracking-widest text-[#ab8a3b] uppercase">View All Activity Log</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 px-4 py-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentTime)}
            </span>
            <span className="text-xs font-black text-[#111f42] uppercase tracking-wider">
              {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(currentTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#111f42] text-white px-4 py-1.5 rounded-full">
            <Clock size={14} className="text-[#ab8a3b]" />
            <span className="text-xs font-black font-mono tracking-wider">
              {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
