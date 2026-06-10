import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Activity, ShieldAlert, Clock, UserCheck, Search, Filter, Download, 
  Eye, X, FileText, AlertTriangle, CheckCircle, Server, Database, 
  ChevronLeft, ChevronRight, HelpCircle, ChevronDown, MapPin
} from 'lucide-react';
import { DataExport } from '../../components/shared/DataExport';

const THEME = {
  bgGradient: 'transparent',
  primary: '#2e3118',
  primaryLight: '#5da7b3',
  accent: '#ffa64a',
  gold: '#c3924c',
  brightGold: '#af7a2b',
  success: '#606934',
  danger: '#e3624a',
  skyBlue: '#5f7ab7',
  dustyBlue: '#8c7361',
  indigo: '#5f7ab7',
  softPurple: '#9293c3',
  deepPurple: '#9293c3',
  pinkAccent: '#ca649f',
  mutedSlate: '#8c7361',
  darkSlate: '#091d38',
  silver: '#8c7361',
  deepNavy: '#091d38',
  brownGold: '#af7a2b',
  vibrantPurple: '#091d38',
  burntOrange: '#a74353',
  slateBlue: '#606934',
  coolGray: '#8c7361'
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  span, input, td, th, div, p, select, textarea, button, h1, h2, h3, h4, h5, h6, label { 
    font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; 
  }
`;

const generateMockLogs = () => {
    const logs = [];
    const modules = ['Authentication', 'User Permission', 'Item Master', 'Sales Order', 'Inventory', 'System Config'];
    const actions = ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'DATA_EXPORT', 'RECORD_CREATED', 'RECORD_DELETED', 'PERMISSION_CHANGED', 'UNAUTHORIZED_ACCESS'];
    const users = ['SOMCHAI SALES', 'SUDA MARKETING', 'T-DCC Developer', 'SARAH SUPPORT', 'UNKNOWN_USER'];
    
    for (let i = 1; i <= 45; i++) {
        const statusType = Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Failed' : 'Warning') : 'Success';
        const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
        logs.push({
            id: `LOG-${String(i).padStart(5, '0')}`,
            timestamp: date.toISOString().replace('T', ' ').substring(0, 19),
            user: statusType === 'Failed' && Math.random() > 0.5 ? 'UNKNOWN_USER' : users[Math.floor(Math.random() * users.length)],
            role: statusType === 'Failed' ? '-' : (Math.random() > 0.5 ? 'ADMIN' : 'USER'),
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            module: modules[Math.floor(Math.random() * modules.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            status: statusType,
            details: statusType === 'Failed' ? 'Invalid credentials or expired token.' : 'Operation completed successfully.',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });
    }
    return logs.sort((a, b: any) => (new Date(b.timestamp) as any) - (new Date(a.timestamp) as any));
};

const INITIAL_LOGS = generateMockLogs();

const KpiCard = ({ icon: IconComp, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white px-6 py-6 rounded-3xl border border-[#e2d1c3]/60 shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#af7a2b] hover:shadow-md transition-all duration-300 min-h-[120px] flex flex-col justify-between animate-fadeIn cursor-pointer">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 pointer-events-none z-0">
            <IconComp size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest">{label}</p>
            <div className={`w-10 h-10 rounded-[14px] border flex items-center justify-center shrink-0 shadow-sm transition-all`} style={{backgroundColor: `${colorAccent}10`, borderColor: `${colorAccent}20`, color: colorAccent}}>
                <IconComp size={20} />
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between">
            <div className="text-[28px] font-black leading-none text-[#2e3118] font-mono" style={{color: colorValue}}>
                {value}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c7361] flex items-center gap-1">
                {desc}
            </span>
        </div>
    </div>
);

import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

function LogDetailsModal({ isOpen, onClose, log }: any) {
    if (!isOpen || !log) return null;

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Success': return 'text-[#606934] bg-[#606934]/10 border-[#606934]/20';
            case 'Failed': return 'text-[#e3624a] bg-[#e3624a]/10 border-[#e3624a]/20';
            case 'Warning': return 'text-[#ffa64a] bg-[#ffa64a]/10 border-[#ffa64a]/20';
            default: return 'text-[#8c7361] bg-[#f8f9fa] border-[#e2d1c3]';
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#2e3118]/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-[28px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-[#e2d1c3]/50">
                <div className="bg-[#2e3118] px-8 py-4 flex justify-between items-center text-[#af7a2b] shrink-0 border-b border-[#091d38]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shadow-inner border border-white/20"><FileText size={24} strokeWidth={2.5} /></div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm text-white">LOG DETAILS</h3>
                            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-2 drop-shadow-sm"><Activity size={12} className="text-[#af7a2b]" /> System Event Inspector</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-[#e3624a]"><X size={24} /></button>
                </div>

                <div className="p-8 flex flex-col gap-6 bg-[#f8f9fa] overflow-y-auto custom-scrollbar"> 
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-[#2e3118] font-mono tracking-tighter">{log.id}</h2>
                            <p className="text-[11px] font-bold text-[#8c7361] mt-1 uppercase tracking-widest">{log.timestamp}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full border-2 font-black text-[12px] uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                            {log.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-2xl border border-[#e2d1c3] shadow-sm space-y-4">
                            <h4 className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest border-b border-[#e7dedd] pb-2 flex items-center gap-2"><UserCheck size={14} className="text-[#5da7b3]"/> User Identity</h4>
                            <div className="space-y-3">
                                <div><p className="text-[9px] font-black text-[#8c7361] uppercase tracking-widest">Username / ID</p><p className="text-[13px] font-black text-[#2e3118] font-mono">{log.user}</p></div>
                                <div><p className="text-[9px] font-black text-[#8c7361] uppercase tracking-widest">Access Role</p><p className="text-[12px] font-bold text-[#af7a2b]">{log.role}</p></div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-[#e2d1c3] shadow-sm space-y-4">
                            <h4 className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest border-b border-[#e7dedd] pb-2 flex items-center gap-2"><Server size={14} className="text-[#5da7b3]"/> Network & Device</h4>
                            <div className="space-y-3">
                                <div><p className="text-[9px] font-black text-[#8c7361] uppercase tracking-widest">IP Address</p><p className="text-[13px] font-black text-[#5f7ab7] font-mono">{log.ip}</p></div>
                                <div><p className="text-[9px] font-black text-[#8c7361] uppercase tracking-widest">User Agent</p><p className="text-[11px] font-medium text-[#091d38] truncate" title={log.userAgent}>{log.userAgent}</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#e2d1c3] shadow-sm space-y-4">
                        <h4 className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest border-b border-[#e7dedd] pb-2 flex items-center gap-2"><Database size={14} className="text-[#5da7b3]"/> Action Payload</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><p className="text-[9px] font-black text-[#8c7361] uppercase tracking-widest">Target Module</p><p className="text-[12px] font-bold text-[#2e3118]">{log.module}</p></div>
                            <div><p className="text-[9px] font-black text-[#8c7361] uppercase tracking-widest">Action Performed</p><p className="text-[12px] font-black text-[#5da7b3] uppercase font-mono">{log.action}</p></div>
                        </div>
                        <div className="bg-[#e7dedd] p-4 rounded-xl border border-[#e2d1c3] font-mono text-[11px] text-[#091d38]">
                            <span className="text-[#e3624a] font-bold">"Message"</span>: "{log.details}"
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 bg-white border-t border-[#e2d1c3] flex justify-end items-center shrink-0">
                    <button onClick={onClose} className="px-10 py-3 bg-[#2e3118] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#091d38] hover:text-white transition-all border border-[#2e3118]">
                        Close Details
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function AccessLogs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [logs, setLogs] = useState(INITIAL_LOGS);

    const totalLogs = logs.length;
    const failedLogs = logs.filter(l => l.status === 'Failed').length;
    const successLogs = logs.filter(l => l.status === 'Success').length;
    const uniqueUsers = new Set(logs.map(l => l.user)).size;

    const filteredLogs = useMemo(() => {
        let res = logs;
        if (statusFilter !== 'All') {
            res = res.filter(l => l.status === statusFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(l => 
                l.user.toLowerCase().includes(q) || 
                l.module.toLowerCase().includes(q) || 
                l.action.toLowerCase().includes(q) ||
                l.ip.includes(q)
            );
        }
        return res;
    }, [logs, statusFilter, searchQuery]);

    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredLogs.slice(start, start + itemsPerPage);
    }, [filteredLogs, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, itemsPerPage]);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Success': return 'text-[#606934] bg-[#606934]/10 border-[#606934]/20';
            case 'Failed': return 'text-[#e3624a] bg-[#e3624a]/10 border-[#e3624a]/20';
            case 'Warning': return 'text-[#ffa64a] bg-[#ffa64a]/10 border-[#ffa64a]/20';
            default: return 'text-[#8c7361] bg-[#f8f9fa] border-[#e2d1c3]';
        }
    };

    return (
        <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
            <style dangerouslySetInnerHTML={{__html: globalStyles}} />
            
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[150px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

            <UserGuidePanel 
                isOpen={isGuideOpen} 
                onClose={() => setIsGuideOpen(false)}
                title="AUDIT GUIDE"
                desc="คู่มือการตรวจสอบบันทึกการใช้งาน (Security Audit)"
                sections={[
                    {
                        id: "1",
                        title: "Purpose of Access Logs",
                        icon: "Activity",
                        description: "หน้าต่าง Access Logs ใช้สำหรับการตรวจสอบความเคลื่อนไหวและประวัติการเข้าถึงระบบทั้งหมด เพื่อให้สอดคล้องกับมาตรฐานความปลอดภัย",
                        bullets: [
                            { icon: "CheckCircle2", iconColor: "#606934", text: "เก็บบันทึกการเข้าสู่ระบบ (Login) ทั้งสำเร็จและล้มเหลว" },
                            { icon: "CheckCircle2", iconColor: "#606934", text: "ติดตามการแก้ไขข้อมูลสำคัญ (Create, Update, Delete)" }
                        ]
                    },
                    {
                        id: "2",
                        title: "Status Indicators",
                        icon: "Filter",
                        description: "ตัวชี้วัดและแยกแยะประเภทความสำเร็จของคำสั่ง",
                        bullets: [
                            { icon: "CheckCircle2", iconColor: "#606934", bgColor: "bg-[#606934]/10", borderColor: "border-[#606934]/20", title: "SUCCESS", text: "การทำงานเสร็จสมบูรณ์ ไม่มีข้อผิดพลาด" },
                            { icon: "AlertTriangle", iconColor: "#ffa64a", bgColor: "bg-[#ffa64a]/10", borderColor: "border-[#ffa64a]/20", title: "WARNING", text: "การเข้าถึงที่ควรจับตามอง เช่น สิทธิ์ไม่เพียงพอ" },
                            { icon: "XCircle", iconColor: "#e3624a", bgColor: "bg-[#e3624a]/10", borderColor: "border-[#e3624a]/20", title: "FAILED", text: "การทำงานล้มเหลว หรือการพยายามเจาะระบบ" }
                        ]
                    },
                    {
                        id: "3",
                        title: "Data Export",
                        icon: "Download",
                        bullets: [
                            { icon: "Download", iconColor: "#5f7ab7", text: "ผู้ดูแลระบบสามารถกดปุ่ม EXPORT LOGS เพื่อดาวน์โหลดข้อมูลเป็นไฟล์ CSV สำหรับนำไปวิเคราะห์ต่อในระบบภายนอก หรือเก็บเป็นหลักฐานรายงาน (Audit Report)" }
                        ]
                    }
                ]}
            />
            <LogDetailsModal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} log={selectedLog} />

            <div className="px-4 sm:px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <ShieldAlert size={28} strokeWidth={2.5} className="text-[#f47729]" />
                  </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h3 className="font-black text-[#2e3118] uppercase tracking-widest text-[24px] flex items-center gap-2 leading-none">
                                SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729] drop-shadow-sm">ACCESS LOGS</span>
                            </h3>
                        </div>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            SECURITY AUDIT & ACTIVITY TRACKING
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 mt-2 pb-6">
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
                        <KpiCard label="Total Requests" value={totalLogs.toLocaleString()} icon={Activity} colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="All Logged Events" />
                        <KpiCard label="Successful Actions" value={successLogs.toLocaleString()} icon={CheckCircle} colorAccent={THEME.success} colorValue={THEME.success} desc="Authorized Operations" />
                        <KpiCard label="Failed Attempts" value={failedLogs.toLocaleString()} icon={AlertTriangle} colorAccent={THEME.danger} colorValue={THEME.danger} desc="Requires Attention" />
                        <KpiCard label="Unique Users" value={uniqueUsers} icon={UserCheck} colorAccent={THEME.accent} colorValue={THEME.primary} desc="Active Identities" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-[#e2d1c3]/60 overflow-hidden flex flex-col animate-fadeIn">
                        
                        <div className="px-8 py-4 border-b border-[#e2d1c3] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative">
                                    <button onClick={() => setFilterDropdownOpen(!filterDropdownOpen)} className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-2.5 rounded-xl border border-[#e2d1c3] shadow-sm hover:border-[#af7a2b] hover:bg-white transition-all min-w-[180px]">
                                        <Filter size={16} className="text-[#af7a2b]" />
                                        <span className="text-[11px] font-black uppercase text-[#2e3118]">{statusFilter === 'All' ? 'All Statuses' : statusFilter}</span>
                                        <ChevronDown size={14} className={`text-[#8c7361] ml-auto transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {filterDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setFilterDropdownOpen(false)}></div>
                                            <div className="absolute top-[110%] left-0 w-full bg-white border border-[#e2d1c3] shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                                {['All', 'Success', 'Failed', 'Warning'].map(status => (
                                                    <button key={status} onClick={() => { setStatusFilter(status); setFilterDropdownOpen(false); }} className={`w-full flex items-center p-3 rounded-xl transition-all ${statusFilter === status ? 'bg-[#f8f9fa] text-[#2e3118]' : 'hover:bg-[#f8f9fa] text-[#8c7361]'}`}>
                                                        <span className="text-[11px] font-black uppercase tracking-wider">{status === 'All' ? 'All Statuses' : status}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="relative flex-1 md:w-80">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                                    <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search user, IP, or module..." className="w-full pl-12 pr-4 py-2.5 text-[12px] font-bold rounded-2xl border border-[#e2d1c3] focus:outline-none focus:border-[#af7a2b] bg-[#f8f9fa] focus:bg-white shadow-sm text-[#2e3118] transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-3 shrink-0 w-full md:w-auto">
                                <DataExport 
                                    data={filteredLogs} 
                                    columns={[
                                        {key: 'timestamp', label: 'Date / Time'},
                                        {key: 'user', label: 'User'},
                                        {key: 'ip', label: 'IP Address'},
                                        {key: 'module', label: 'Module'},
                                        {key: 'action', label: 'Action'},
                                        {key: 'status', label: 'Status'}
                                    ]} 
                                    filename="System_Logs" 
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar bg-[#f8f9fa]">
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#2e3118] text-white sticky top-0 z-10 border-b-2 border-[#af7a2b]">
                                    <tr>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Date / Time</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">User Identity</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">IP Address</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Module & Action</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">Status</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e2d1c3] bg-white">
                                    {paginatedLogs.length > 0 ? paginatedLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                            <td className="py-3 px-6 text-[12px]">
                                                <div className="flex items-center gap-2 font-mono text-[#8c7361]">
                                                    <Clock size={14}/> <span>{log.timestamp}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex flex-col">
                                                    <span className={`font-black text-[12px] font-mono tracking-tight ${log.user === 'UNKNOWN_USER' ? 'text-[#e3624a]' : 'text-[#2e3118]'}`}>{log.user}</span>
                                                    <span className="text-[10px] font-bold text-[#8c7361] mt-0.5 uppercase tracking-wider">{log.role}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 font-mono text-[12px] font-bold text-[#5da7b3]">
                                                <div className="flex items-center gap-1.5"><MapPin size={12} className="text-[#8c7361]"/> {log.ip}</div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[12px] text-[#2e3118]">{log.module}</span>
                                                    <span className="font-mono text-[10px] font-black text-[#af7a2b] mt-0.5 tracking-tight">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className={`px-3 py-1 rounded-full border font-black text-[11px] uppercase tracking-widest whitespace-nowrap ${getStatusStyle(log.status)}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex justify-center items-center gap-[1px]">
                                                    <button onClick={() => setSelectedLog(log)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#e2d1c3] text-[#5da7b3] hover:bg-[#e7dedd] hover:border-[#5da7b3] transition-all active:scale-90" title="View Details">
                                                        <Eye size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-[#8c7361] font-bold text-[12px]">
                                                No logs found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-3 bg-[#f8f9fa] border-t-[1.5px] border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-6 text-[11px] font-black text-[#8c7361] uppercase tracking-widest">
                                <div className="flex items-center gap-3">
                                    <span>Display Rows:</span>
                                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#e2d1c3] rounded-lg px-3 py-1.5 outline-none font-black text-[#2e3118] cursor-pointer shadow-sm focus:border-[#af7a2b]">
                                        {[15, 30, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <p className="bg-white px-4 py-1.5 rounded-lg border border-[#e2d1c3] shadow-sm text-[#2e3118]">Total Records: {filteredLogs.length}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-9 h-9 border border-[#e2d1c3] bg-white rounded-lg flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#e7dedd] text-[#5da7b3] shadow-sm active:scale-90'}`}>
                                    <ChevronLeft size={16}/>
                                </button>
                                <div className="bg-white text-[#2e3118] px-6 py-2 rounded-lg font-black text-[11px] min-w-[120px] text-center uppercase tracking-widest border border-[#e2d1c3] shadow-sm">
                                    Page {currentPage} / {totalPages || 1}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-9 h-9 border border-[#e2d1c3] bg-white rounded-lg flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#e7dedd] text-[#5da7b3] shadow-sm active:scale-90'}`}>
                                    <ChevronRight size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
