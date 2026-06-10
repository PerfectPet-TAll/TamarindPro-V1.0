import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckSquare, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  Terminal, 
  Info,
  Loader2
} from 'lucide-react';
import { NotificationService } from '../../services/NotificationService';
import { Notification } from '../../types';
import NotificationStats from './components/NotificationStats';
import NotificationFilters from './components/NotificationFilters';
import NotificationList from './components/NotificationList';
import SimulatorModal from './components/SimulatorModal';
import UserGuideButton from '../../components/shared/UserGuideButton';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import Swal from 'sweetalert2';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Modal State
  const [isSimOpen, setIsSimOpen] = useState(false);

  // Subscribe to real-time events on mount
  useEffect(() => {
    setLoading(true);
    const unsubscribe = NotificationService.subscribeToNotifications(
      (items) => {
        setNotifications(items);
        setLoading(false);
        setErrorMsg(null);
      },
      (err) => {
        console.error('Real-time synchronization failed:', err);
        setErrorMsg('การเชื่อมต่อ Firestore ถูกปฏิเสธเนื่องจากความปลอดภัย กรุณาตรวจสอบกฎ security rules หรือล็อกอินเพื่อรับสิทธิ์');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
    } catch (err) {
      console.error(err);
      Swal.fire('Failed', 'Action denied by Firestore Security Rules.', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'All notifications are already read!',
        showConfirmButton: false,
        timer: 1800
      });
      return;
    }

    try {
      await NotificationService.markAllAsRead(notifications);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Marked all as read successfully!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Action Denied', 'Authentication failed or unauthorized operation detected.', 'error');
    }
  };

  const handleClearLogs = () => {
    if (notifications.length === 0) return;

    Swal.fire({
      title: 'Clear Historic Logs?',
      text: 'Do you want to permanently empty the notifications archive from Firestore? This will impact all operators.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111f42',
      cancelButtonColor: '#adb2b0',
      confirmButtonText: 'Yes, clear all records'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await NotificationService.clearAllNotifications(notifications);
          Swal.fire('Cleared!', 'All traces erased successfully.', 'success');
        } catch (err) {
          console.error(err);
          Swal.fire('Permission Denied', 'Rules restrict destructive delete operations for unauthorized clients.', 'error');
        }
      }
    });
  };

  // Perform client-side filtering on live data
  const filteredNotifications = notifications.filter((item) => {
    // 1. Text Search query
    const matchQuery =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category selection
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // 3. Severity selection
    const matchSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity;

    return matchQuery && matchCategory && matchSeverity;
  });

  return (
    <div className="flex-1 flex flex-col w-full font-mono animate-fadeIn bg-transparent pb-8 z-10 relative">
      
      {/* Header section with specialized system headers */}
      <div className="px-4 pr-12 sm:px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 bg-transparent">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <Bell size={28} strokeWidth={2.5} className="text-[#f47729]" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
              NOTIFICATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">CENTER</span>
            </h3>
            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
              REAL-TIME BUSINESS & OPERATION LOGS
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSimOpen(true)}
            className="px-5 py-2.5 bg-[#ad7332] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#8e5e29] shadow-md flex items-center gap-2 transition-all"
          >
            <Sparkles size={14} className="animate-pulse" /> Inject Mock Alert
          </button>
          
          <button
            onClick={handleMarkAllRead}
            className="px-5 py-2.5 bg-[#091d38] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#214573] shadow-md flex items-center gap-2 transition-all border border-[#091d38]"
          >
            <CheckSquare size={14} /> Mark All Read
          </button>

          <button
            onClick={handleClearLogs}
            className="px-5 py-2.5 bg-white text-slate-500 border border-[#cdd0db]/60 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm flex items-center gap-2"
            disabled={notifications.length === 0}
          >
            <Trash2 size={14} /> Clear Archive
          </button>
        </div>
      </div>

      {/* Main layout contents */}
      <div className="px-4 sm:px-8 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        
        {/* Real-time KPI Widgets */}
        <div className="shrink-0">
          <NotificationStats notifications={notifications} />
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <Info size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ALL CONTENT IN A SINGLE MAIN CARD */}
        <div className="bg-white rounded-[24px] border border-[#adb2b0]/30 shadow-sm overflow-hidden flex flex-col mb-8">
            <div className="p-5 border-b border-[#adb2b0]/30 bg-gradient-to-r from-white to-[#f8f9fa] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 filter-container">
              
              <div className="w-full xl:w-auto">
                <NotificationFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedSeverity={selectedSeverity}
                  setSelectedSeverity={setSelectedSeverity}
                />
              </div>

              {/* Status Header */}
              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-3 w-full xl:w-auto mt-4 xl:mt-0 justify-between xl:justify-end shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {filteredNotifications.length} Records Trace
                </span>
                {loading && (
                  <div className="flex items-center gap-2 text-slate-405 text-[10px] font-bold uppercase tracking-widest">
                    <Loader2 size={12} className="animate-spin text-[#f47729]" />
                    Syncing...
                  </div>
                )}
                {!loading && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] font-mono font-black text-emerald-700 tracking-wider">LIVE</span>
                    </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                {loading && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-[#f8f9fa]/50">
                    <Loader2 size={36} className="text-[#f47729] animate-spin mb-4" />
                    <p className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest">
                      Establishing real-time snapshot listener...
                    </p>
                </div>
                ) : (
                <NotificationList 
                    notifications={filteredNotifications} 
                    onMarkRead={handleMarkAsRead}
                />
                )}
            </div>
        </div>

      </div>

      {/* User Guide */}
      <UserGuideButton 
        onClick={() => setIsGuideOpen(true)} 
        className="bg-[#f8f9fa] border border-[#adb2b0]/50 border-r-0 text-[#2e3118] hover:bg-[#091d38] hover:text-[#f47729] hover:border-[#091d38]"
      />
      <UserGuidePanel
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="NOTIFICATION CENTER"
        desc="คู่มือและศูนย์กลางการแจ้งเตือนจากทุกโหนด (Command & Control)"
        sections={[
            {
                id: "concept",
                title: "แนวคิดการออกแบบ (Concept)",
                description: "หน้าจอถูกออกแบบมาในสไตล์ Dashboard Command Center เพื่อรวบรวมเหตุการณ์, การอนุมัติ, และการอัปเดตสถานะของทุก Module ในระบบไว้ในจุดเดียวแบบเรียลไทม์ (Real-time Firebase Snapshot)",
                icon: "Lightbulb",
                iconColor: "#f47729",
                bullets: [
                    {
                        text: "ลดการเปิดหลายหน้าต่างโดยสามารถตรวจสอบเหตุการณ์ทั้งหมดได้ทันที",
                        icon: "CheckCircle2",
                        iconColor: "#10b981",
                        bgColor: "bg-emerald-50",
                        borderColor: "border-emerald-100"
                    },
                    {
                        text: "แยกความสำคัญของแจ้งเตือนผ่านระดับ Severity (Info, Warning, Critical)",
                        icon: "ShieldAlert",
                        iconColor: "#f43f5e",
                        bgColor: "bg-rose-50",
                        borderColor: "border-rose-100"
                    }
                ]
            },
            {
                id: "components",
                title: "ส่วนประกอบหลัก (Key Components)",
                icon: "LayoutDashboard",
                bullets: [
                    {
                        title: "1. Global Action Toolbar",
                        text: "แถบควบคุมด้านบนขวา ใช้สำหรับคำสั่งรวมเช่น 'Inject Mock Alert' (จำลองแจ้งเตือน), 'Mark All Read' และ 'Clear Archive' (ลบประวัติแจ้งเตือนที่อ่านแล้ว)",
                    },
                    {
                        title: "2. Real-time KPI Widgets",
                        text: "การ์ดสรุปข้อมูลด้านบน (Unread Alerts, Critical Alerts, Active Warnings, Archived Logs) จะอัปเดตแบบเรียลไทม์",
                    },
                    {
                        title: "3. Live Trace & Filters",
                        text: "เครื่องมือค้นหาข้อความ, กรองตามระดับความรุนแรง (Severity), และกรองตามหมวดหมู่โหนดงาน (Nodes Dropdown)",
                    }
                ]
            },
            {
                id: "automation",
                title: "ระบบการแจ้งเตือนอัตโนมัติ (Automation Rules)",
                icon: "Bot",
                iconColor: "#8b5cf6",
                bullets: [
                    {
                        text: "หากมีการอนุมัติ Factory PO ระบบจะเพิ่มแจ้งเตือนใหม่ในโหมด Factory PO โดยอัตโนมัติ",
                    },
                    {
                        text: "การ Sync ข้อมูลบน Google Sheets หากสำเร็จหรือขัดข้องจะถูกส่งเข้า Notification Center ทันที (Sheets Sync Node)",
                    }
                ]
            }
        ]}
      />

      {/* Alert Simulation Dialog Modals */}
      <SimulatorModal 
        isOpen={isSimOpen} 
        onClose={() => setIsSimOpen(false)} 
      />

    </div>
  );
}
