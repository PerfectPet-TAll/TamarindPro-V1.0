import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Briefcase, CheckCircle2, Target, AlertTriangle, UserPlus, HelpCircle, ChevronLeft, ChevronRight, ChevronDownCircle, ListFilter, Zap
} from 'lucide-react';
import Swal from 'sweetalert2';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import KpiCard from '../../components/shared/KpiCard';
import { DataExport } from '../../components/shared/DataExport';

import { 
  THEME, 
  TEAMS, 
  STATUSES, 
  SalesRep,
  getTeamStyle,
  getStatusStyle 
} from './types';

import SaleRepRow from './components/SaleRepRow';
import CreateRepModal from './components/CreateRepModal';
import EditRepModal from './components/EditRepModal';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;800;900&display=swap');
  
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  span, input, td, th, div, p, select, textarea, button, h1, h2, h3, h4, h5, h6, label, modal, pdf { 
    font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; 
  }

  .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #adb2b0; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8c7361; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

const generateSaleReps = (): SalesRep[] => {
    return [
        { id: 'REP-101', name: 'Somchai Jaidee', nickname: 'Chai', mobile: '081-234-5678', email: 'somchai.j@tamarind.co.th', region: 'Bangkok & Metropolitan', team: 'Modern Trade', status: 'Active', target: 5000000, joinDate: '2020-05-10', avatar: 'https://i.pravatar.cc/150?img=11', lineId: '@chai_sales', notes: 'Top performer 2024' },
        { id: 'REP-102', name: 'Suda Meesuk', nickname: 'Da', mobile: '089-876-5432', email: 'suda.m@tamarind.co.th', region: 'Central', team: 'Traditional Trade', status: 'Active', target: 3500000, joinDate: '2021-02-15', avatar: 'https://i.pravatar.cc/150?img=5', lineId: '@da_sales', notes: '' },
        { id: 'REP-103', name: 'Wichai Rungroj', nickname: 'Win', mobile: '085-555-1234', email: 'wichai.r@tamarind.co.th', region: 'North', team: 'Traditional Trade', status: 'Active', target: 3000000, joinDate: '2019-11-20', avatar: 'https://i.pravatar.cc/150?img=8', lineId: '@win_cm', notes: 'Expert in Chiang Mai area' },
        { id: 'REP-104', name: 'Nadech K.', nickname: 'Nadech', mobile: '082-333-4444', email: 'nadech.k@tamarind.co.th', region: 'East', team: 'HORECA', status: 'On Leave', target: 4000000, joinDate: '2022-07-01', avatar: 'https://i.pravatar.cc/150?img=15', lineId: '@nadech', notes: 'On maternity leave until August' },
        { id: 'REP-105', name: 'Manee Rakthai', nickname: 'Nee', mobile: '086-777-8899', email: 'manee.r@tamarind.co.th', region: 'South', team: 'Modern Trade', status: 'Active', target: 4500000, joinDate: '2023-01-10', avatar: 'https://i.pravatar.cc/150?img=9', lineId: '@nee_south', notes: '' },
        { id: 'REP-106', name: 'Pongsakorn W.', nickname: 'Pong', mobile: '081-111-2222', email: 'pongsakorn.w@tamarind.co.th', region: 'Northeast', team: 'Corporate B2B', status: 'Active', target: 6000000, joinDate: '2018-09-05', avatar: 'https://i.pravatar.cc/150?img=12', lineId: '@pong_b2b', notes: 'Handles major factory clients' },
        { id: 'REP-107', name: 'Amornrat T.', nickname: 'Aum', mobile: '083-444-5555', email: 'amornrat.t@tamarind.co.th', region: 'West', team: 'Traditional Trade', status: 'Inactive', target: 2500000, joinDate: '2021-04-18', avatar: 'https://i.pravatar.cc/150?img=20', lineId: '', notes: 'Resigned on Mar 2026' },
        { id: 'REP-108', name: 'John Doe', nickname: 'John', mobile: '099-999-8888', email: 'john.d@tamarind.co.th', region: 'Bangkok & Metropolitan', team: 'Export', status: 'Active', target: 10000000, joinDate: '2024-03-01', avatar: 'https://i.pravatar.cc/150?img=33', lineId: '@john_export', notes: 'Overseas key accounts' }
    ];
};

export default function SaleRepDirectory() {
    const [items, setItems] = useState<SalesRep[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setItems(generateSaleReps());
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTeam, setActiveTeam] = useState('All');
    const [activeStatus, setActiveStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showGuide, setShowGuide] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [newRep, setNewRep] = useState({
        name: '',
        nickname: '',
        mobile: '',
        email: '',
        region: 'Bangkok & Metropolitan',
        team: 'Modern Trade',
        status: 'Active',
        target: 4000000,
        lineId: '',
        notes: ''
    });
    const [editRep, setEditRep] = useState<any | null>(null);

    const handleRegisterRep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRep.name.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกชื่อตัวแทนขาย / พนักงาน',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#f47729',
                customClass: { popup: 'font-mono' }
            });
            return;
        }

        const formattedId = `REP-${101 + items.length}`;
        const rep: SalesRep = {
            ...newRep,
            id: formattedId,
            joinDate: new Date().toISOString().split('T')[0],
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
            target: Number(newRep.target) || 0
        } as any;

        setItems(prev => [rep, ...prev]);
        setShowCreateModal(false);
        setNewRep({
            name: '',
            nickname: '',
            mobile: '',
            email: '',
            region: 'Bangkok & Metropolitan',
            team: 'Modern Trade',
            status: 'Active',
            target: 4000000,
            lineId: '',
            notes: ''
        });

        Swal.fire({
            icon: 'success',
            title: 'ลงทะเบียนพนักงานขายสำเร็จ',
            text: `ลงทะเบียน ${rep.name} เข้าสู่ระบบเรียบร้อยแล้ว`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#091d38',
            customClass: { popup: 'font-mono' }
        });
    };

    const handleUpdateRep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editRep || !editRep.name.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกชื่อพนักงานขาย / ตัวแทน',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#f47729',
                customClass: { popup: 'font-mono' }
            });
            return;
        }

        setItems(prev => prev.map(item => item.id === editRep.id ? { ...editRep, target: Number(editRep.target) || 0 } : item));
        setEditRep(null);

        Swal.fire({
            icon: 'success',
            title: 'อัปเดตข้อมูลสำเร็จ',
            text: `ปรับปรุงข้อมูลของ ${editRep.name} เรียบร้อยแล้ว`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#091d38',
            customClass: { popup: 'font-mono' }
        });
    };

    const filteredData = useMemo(() => {
        return items.filter(item => {
            const matchSearch = (item.id + item.name + item.nickname + item.mobile).toLowerCase().includes(searchTerm.toLowerCase());
            const matchTeam = activeTeam === 'All' || item.team === activeTeam;
            const matchStatus = activeStatus === 'All' || item.status === activeStatus;
            return matchSearch && matchTeam && matchStatus;
        });
    }, [items, searchTerm, activeTeam, activeStatus]);

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    const kpiData = useMemo(() => {
        const count = items.length;
        const activeCount = items.filter(o => o.status === 'Active').length;
        const totalTarget = items.reduce((sum, o) => sum + o.target, 0);

        return [
            { icon: Briefcase, value: count, label: "Total Sale Reps", colorAccent: THEME.palette.blueMuted, colorValue: THEME.textMain, desc: `Registered Staff` },
            { icon: CheckCircle2, value: activeCount, label: "Active Field Force", colorAccent: THEME.success, colorValue: THEME.success, desc: "Currently Working" },
            { icon: Target, value: `฿${(totalTarget/1000000).toFixed(1)}M`, label: "Combined Target", colorAccent: THEME.accent, colorValue: THEME.accent, desc: "Annual KPI" },
            { icon: AlertTriangle, value: items.filter(o => o.status === 'On Leave').length, label: "On Leave", colorAccent: THEME.palette.orangeBright, colorValue: THEME.palette.orangeBright, desc: "Action Required" }
        ];
    }, [items]);

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: globalStyles}} />
            <div className="flex flex-col min-h-screen w-full text-slate-800 overflow-x-hidden relative font-sans" style={{ background: THEME.bgMain }}>
                
                <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[150px] bg-white border border-[#d2af94]/50 border-r-0 text-[#214573] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#214573] hover:text-[#f47729] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group no-print font-mono cursor-pointer">
                    <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#af7a2b] group-hover:text-[#f47729]" />
                    <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
                </button>

                <UserGuidePanel 
                    isOpen={showGuide} 
                    onClose={() => setShowGuide(false)} 
                    title="SALES REP. DIRECTORY"
                    desc="ระบบบริหารจัดการรายชื่อตัวแทนจำหน่าย พนักงานขาย และลูกค้าประจำ"
                    sections={[
                        {
                            id: "1",
                            title: "การจัดการข้อมูลหลัก (Directory System)",
                            icon: "Users",
                            description: "แหล่งรวมข้อมูลเครือข่ายฝ่ายขาย (Sales Rep) และช่องทางการจัดจำหน่าย (Channels) ทั่วโลก",
                            bullets: [
                                { icon: "Plus", iconColor: "#606934", title: "Add Rep", text: "ปุ่มสร้างข้อมูลตัวแทนขายใหม่ สามารถกำหนด Region (โซน) หรือทวีปที่ได้รับมอบหมายได้" },
                            ]
                        }
                    ]}
                />
                
                <header className="h-28 px-8 flex items-center justify-between z-20 shrink-0 bg-transparent no-print">
                    <div className="flex items-center gap-5">
                        <div className="relative flex items-center justify-center group cursor-default shrink-0">
                            <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                            <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                                <Briefcase size={28} strokeWidth={2.5} className="text-[#f47729]" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-inter font-black text-[#2e3118] uppercase tracking-widest text-[24px] flex items-center gap-2 leading-none">
                                SALE REP. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">DIRECTORY</span>
                            </h3>
                            <div className="flex items-center gap-1.5 mt-[6px]">
                                <div className="w-8 h-[2px] bg-[#af7a2b]"></div>
                                <p className="text-[11px] font-medium text-[#53483e] uppercase tracking-[0.2em] leading-none font-mono">SALES FORCE MANAGEMENT HUB</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full px-8 pb-10 flex flex-col relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {kpiData.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(46,49,24,0.03)] border border-[#d2af94]/30 flex flex-col flex-1 min-h-[600px] overflow-hidden animate-fadeIn">
                        <div className="px-8 py-4 border-b border-[#adb2b0]/30 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 font-mono">
                            <div className="flex flex-wrap items-center gap-3 shrink-0 flex-1 w-full md:w-auto">
                                <div className="relative group min-w-[200px]">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ListFilter size={14} className="text-[#8c7361] group-hover:text-[#f47729] transition-colors" />
                                    </div>
                                    <select 
                                        className="w-full pl-9 pr-8 py-2 border border-[#adb2b0]/40 rounded-xl text-[11px] font-black focus:outline-none focus:border-[#af7a2b] bg-[#F0EAE1]/30 focus:bg-white shadow-inner text-[#2e3118] h-[42px] transition-all appearance-none cursor-pointer uppercase tracking-widest"
                                        value={activeTeam}
                                        onChange={(e) => { setActiveTeam(e.target.value); setCurrentPage(1); }}
                                    >
                                        <option value="All">TEAM: ALL ({items.length})</option>
                                        {TEAMS.map(t => (
                                            <option key={t} value={t}>TEAM: {t.toUpperCase()} ({items.filter(i => i.team === t).length})</option>
                                        ))}
                                    </select>
                                    <ChevronDownCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7361] pointer-events-none" />
                                </div>
                                
                                <div className="relative group min-w-[160px]">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Zap size={14} className="text-[#8c7361] group-hover:text-[#f47729] transition-colors" />
                                    </div>
                                    <select 
                                        className="w-full pl-9 pr-8 py-2 border border-[#adb2b0]/40 rounded-xl text-[11px] font-black focus:outline-none focus:border-[#af7a2b] bg-[#F0EAE1]/30 focus:bg-white shadow-inner text-[#2e3118] h-[42px] transition-all appearance-none cursor-pointer uppercase tracking-widest"
                                        value={activeStatus}
                                        onChange={(e) => { setActiveStatus(e.target.value); setCurrentPage(1); }}
                                    >
                                        <option value="All">STS: ALL ({items.length})</option>
                                        {STATUSES.map(s => (
                                            <option key={s} value={s}>STS: {s.toUpperCase()} ({items.filter(i => i.status === s).length})</option>
                                        ))}
                                    </select>
                                    <ChevronDownCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7361] pointer-events-none" />
                                </div>

                                <div className="relative flex-1 max-w-sm">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                                    <input type="text" placeholder="Search ID, Name, Contact..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-11 pr-4 py-2 border border-[#adb2b0]/40 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#af7a2b] bg-[#F0EAE1]/30 focus:bg-white shadow-inner text-[#2e3118] h-[42px] transition-all" />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0 ml-auto">
                                <DataExport
                                    data={filteredData}
                                    columns={[
                                        { key: 'id', label: 'Rep ID' },
                                        { key: 'name', label: 'Name' },
                                        { key: 'mobile', label: 'Mobile' },
                                        { key: 'email', label: 'Email' },
                                        { key: 'team', label: 'Team' },
                                        { key: 'region', label: 'Region' },
                                        { key: 'status', label: 'Status' }
                                    ]}
                                    filename="Sale_Representatives"
                                />
                                <button onClick={() => setShowCreateModal(true)} className="shrink-0 bg-[#f47729] hover:bg-[#ad7332] text-white px-6 py-2.5 rounded-[16px] font-black text-[11px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#f47729] h-[42px] cursor-pointer">
                                    <UserPlus size={16} /> NEW REPRESENTATIVE
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto custom-scrollbar bg-[#F0EAE1]/10">
                            <table className="w-full text-left font-sans border-collapse min-w-[1050px]">
                                <thead className="bg-[#091d38] border-b-2 border-[#f47729] sticky top-0 z-10 text-white font-mono uppercase tracking-widest text-[12px] font-black">
                                    <tr>
                                        <th className="py-4 px-6 pl-8 w-[12%] whitespace-nowrap">Rep ID</th>
                                        <th className="py-4 px-6 w-[25%] whitespace-nowrap">Profile</th>
                                        <th className="py-4 px-6 w-[15%] whitespace-nowrap text-center">Contact</th>
                                        <th className="py-4 px-6 w-[15%] text-center whitespace-nowrap">Assignment</th>
                                        <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Status</th>
                                        <th className="py-4 px-6 pr-8 text-center w-[10%] whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#adb2b0]/20">
                                    {isLoading ? (
                                        Array.from({ length: itemsPerPage }).map((_, i) => (
                                            <tr key={`skel-${i}`} className="h-[68px] animate-pulse group">
                                                <td className="py-2.5 px-6 pl-8">
                                                    <div className="h-6 bg-slate-200 rounded-[6px] w-[80px]"></div>
                                                </td>
                                                <td className="py-2.5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-200 rounded-[10px] shrink-0"></div>
                                                        <div className="flex flex-col w-full">
                                                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                                                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-6">
                                                    <div className="h-4 bg-slate-200 rounded w-full mb-1"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-[60%]"></div>
                                                </td>
                                                <td className="py-2.5 px-6 text-center">
                                                    <div className="h-6 bg-slate-200 rounded-full w-20 mx-auto"></div>
                                                </td>
                                                <td className="py-2.5 px-6 text-center">
                                                    <div className="h-6 bg-slate-200 rounded-full w-20 mx-auto"></div>
                                                </td>
                                                <td className="py-2.5 px-6 pr-8">
                                                    <div className="flex justify-center gap-[1px]">
                                                        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : paginatedData.map(item => (
                                        <SaleRepRow 
                                            key={item.id} 
                                            item={item} 
                                            onEdit={() => setEditRep({ ...item })} 
                                        />
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-20 text-center text-[#8c7361] font-black uppercase tracking-widest text-[12px] opacity-50 font-mono">
                                                No Records Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 0 && (
                          <div className="px-8 py-3 bg-[#F0EAE1]/80 border-t-[1.5px] border-[#adb2b0]/50 flex flex-col md:flex-row justify-between items-center font-bold text-[#53483e] uppercase tracking-widest shrink-0 font-mono text-[11px] z-20 font-mono">
                              <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-3">
                                      <span>SHOW:</span>
                                      <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#d2af94] rounded-xl px-3 py-1.5 outline-none focus:border-[#af7a2b] text-[#2e3118] cursor-pointer shadow-sm">
                                          {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                      </select>
                                  </div>
                                  <div className="bg-white px-4 py-1.5 rounded-xl border border-[#d2af94] shadow-sm text-[#2e3118]">TOTAL {filteredData.length} PERSONNEL</div>
                              </div>
                              <div className="flex items-center gap-3 mt-4 md:mt-0">
                                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all cursor-pointer ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] shadow-sm active:scale-90'}`}><ChevronLeft size={16}/></button>
                                  <div className="bg-white border border-[#d2af94] px-6 h-9 flex items-center justify-center rounded-xl shadow-sm text-[#2e3118] font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} / {totalPages}</div>
                                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all cursor-pointer ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] shadow-sm active:scale-90'}`}><ChevronRight size={16}/></button>
                              </div>
                          </div>
                        )}
                    </div>
                </main>
            </div>

            <CreateRepModal 
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              newRep={newRep}
              setNewRep={setNewRep}
              onSubmit={handleRegisterRep}
            />

            {editRep && (
              <EditRepModal 
                editRep={editRep}
                setEditRep={setEditRep}
                onSubmit={handleUpdateRep}
              />
            )}
        </>
    );
}
