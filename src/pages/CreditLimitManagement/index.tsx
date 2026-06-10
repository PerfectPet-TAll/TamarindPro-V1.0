import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, AlertTriangle, CheckCircle2, Pencil, Save, ListFilter, Zap, HelpCircle,
  DollarSign, TrendingUp, ShieldAlert, CreditCard, Activity, ArrowUpRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import KpiCard from '../../components/shared/KpiCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const THEME = {
  bgMain: 'transparent',
  primary: '#f47729',
  primaryDark: '#ad7332',
  textMain: '#2e3118',
  textSubtle: '#8c7361',
  success: '#606934',
  danger: '#d32f2f',
  warning: '#f57c00',
  palette: {
    navyDeep: '#091d38', navy: '#214573', orangeBright: '#f47729', olive: '#606934', 
    blueMuted: '#5167a2', taupe: '#8c7361', lightTan: '#d2af94', bronze: '#ad7332', slateBlue: '#627680'
  }
};

const CHART_COLORS = [THEME.palette.navy, THEME.palette.orangeBright, THEME.palette.olive, THEME.palette.bronze];

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;800;900&display=swap');
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #adb2b0; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8c7361; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

const generateCreditData = () => {
    return [
        { id: 'CUST-001', name: 'บริษัท ซีพี ออลล์ จำกัด (มหาชน)', creditLimit: 20000000, usedLimit: 15400000, term: '30 Days', status: 'Healthy', overdue: 0, lastReview: '2025-12-01' },
        { id: 'CUST-002', name: 'บริษัท สยามแม็คโคร จำกัด (มหาชน)', creditLimit: 30000000, usedLimit: 28500000, term: '45 Days', status: 'Warning', overdue: 1200000, lastReview: '2025-11-15' },
        { id: 'CUST-003', name: 'Lotus\'s Thailand', creditLimit: 15000000, usedLimit: 5000000, term: '60 Days', status: 'Healthy', overdue: 0, lastReview: '2026-01-20' },
        { id: 'CUST-004', name: 'ร้านเจ๊หมวย ขายส่ง', creditLimit: 500000, usedLimit: 480000, term: 'Cash', status: 'Critical', overdue: 150000, lastReview: '2026-03-01' },
        { id: 'CUST-005', name: 'บริษัท ไมเนอร์ ฟู้ด กรุ๊ป', creditLimit: 5000000, usedLimit: 2100000, term: '30 Days', status: 'Healthy', overdue: 0, lastReview: '2026-02-10' },
        { id: 'CUST-006', name: 'CJ Express Group', creditLimit: 8000000, usedLimit: 6500000, term: '30 Days', status: 'Warning', overdue: 0, lastReview: '2025-10-05' },
        { id: 'CUST-007', name: 'โรงแรมดุสิตธานี', creditLimit: 2000000, usedLimit: 300000, term: '60 Days', status: 'Healthy', overdue: 0, lastReview: '2026-04-12' },
        { id: 'CUST-009', name: 'Thai Foods Distributor Ltd.', creditLimit: 10000000, usedLimit: 10000000, term: '30 Days', status: 'Critical', overdue: 4500000, lastReview: '2026-01-05' },
    ];
};

const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'HEALTHY': return `bg-green-50 text-[#606934] border-[#606934]/30`;
        case 'WARNING': return `bg-[#f47729]/10 text-[#f47729] border-[#f47729]/30`;
        case 'CRITICAL': return `bg-red-50 text-red-600 border-red-200`;
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};

const formatCurrency = (val: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(val);

export default function CreditLimitManagement() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showGuide, setShowGuide] = useState(false);
    const [editMode, setEditMode] = useState<any | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setItems(generateCreditData());
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleUpdateCredit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editMode) return;

        setItems(prev => prev.map(item => item.id === editMode.id ? { ...editMode, creditLimit: Number(editMode.creditLimit) } : item));
        
        Swal.fire({
            icon: 'success',
            title: 'อัปเดต Credit Limit สำเร็จ',
            text: `ปรับปรุงวงเงินของ ${editMode.name} เรียบร้อยแล้ว`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#091d38',
            customClass: { popup: 'font-mono' }
        });
        setEditMode(null);
    };

    const filteredData = useMemo(() => {
        return items.filter(item => 
            (item.name + item.id).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    const stats = useMemo(() => {
        const totalLimit = items.reduce((acc, curr) => acc + curr.creditLimit, 0);
        const totalUsed = items.reduce((acc, curr) => acc + curr.usedLimit, 0);
        const totalOverdue = items.reduce((acc, curr) => acc + curr.overdue, 0);
        const utilization = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
        
        return { totalLimit, totalUsed, totalOverdue, utilization };
    }, [items]);

    const chartData = useMemo(() => {
        const healthy = items.filter(i => i.status === 'Healthy').length;
        const warning = items.filter(i => i.status === 'Warning').length;
        const critical = items.filter(i => i.status === 'Critical').length;
        return [
            { name: 'Healthy', value: healthy, color: THEME.success },
            { name: 'Warning', value: warning, color: THEME.warning },
            { name: 'Critical', value: critical, color: THEME.danger }
        ];
    }, [items]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
            
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
                
                {/* HEADER SECTION */}
                <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
                    <div className="flex items-center gap-5">
                        <div className="relative flex items-center justify-center group cursor-default shrink-0">
                            <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                            <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                                <ShieldAlert size={28} strokeWidth={2.5} className="text-[#f47729]" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                                CREDIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">LIMIT</span> MANAGEMENT
                            </h3>
                            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                                LIVE EXPOSURE & RISK TRACKING
                            </p>
                        </div>
                    </div>
                </div>

                <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                    <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
                    <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
                </button>

                <main className="w-full px-4 sm:px-8 mb-8 mt-4 flex-1 flex flex-col min-h-0">
                    <div className="w-full mt-4 flex-1 flex flex-col min-h-0">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
                            <KpiCard 
                                title="Total Credit Limit" 
                                value={formatCurrency(stats.totalLimit)} 
                                icon={DollarSign} 
                                colorAccent="#091d38" 
                            />
                            <KpiCard 
                                title="Total Outstanding" 
                                value={formatCurrency(stats.totalUsed)} 
                                icon={CreditCard} 
                                desc={`${stats.utilization.toFixed(1)}% Used (Trend Up)`}
                                colorAccent="#5167a2" 
                            />
                        <KpiCard 
                            title="Total Overdue" 
                            value={formatCurrency(stats.totalOverdue)} 
                            icon={AlertTriangle} 
                            colorAccent={stats.totalOverdue > 0 ? "#d32f2f" : "#606934"} 
                        />
                        <div className="bg-white rounded-2xl p-5 border border-[#cdd0db]/50 flex items-center shadow-sm">
                            <div className="w-24 h-24 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData} innerRadius={25} outerRadius={40} dataKey="value" stroke="none">
                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 ml-2">
                                <p className="text-[10px] font-black text-[#5167a2] uppercase tracking-widest mb-1">Portfolio Health</p>
                                <div className="space-y-1">
                                    {chartData.map((data) => (
                                        <div key={data.name} className="flex justify-between text-[10px]">
                                            <span style={{ color: data.color }} className="font-bold">{data.name}</span>
                                            <span className="font-black text-[#091d38]">{data.value} Accs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table Area */}
                    <div className="bg-white rounded-[24px] border border-[#adb2b0]/30 shadow-sm overflow-hidden flex flex-col mb-8">
                        <div className="p-5 border-b border-[#adb2b0]/30 bg-gradient-to-r from-white to-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="w-8 h-8 rounded-lg bg-[#5167a2]/10 flex items-center justify-center text-[#5167a2]">
                                    <ListFilter size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest">Credit Accounts</h3>
                                    <p className="text-[10px] font-bold text-[#8c7361] uppercase tracking-wider">{filteredData.length} records found</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adb2b0]" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Search accounts..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 bg-white border border-[#cdd0db] rounded-xl text-[12px] font-bold text-[#2e3118] placeholder:text-[#adb2b0] focus:outline-none focus:border-[#f47729] focus:ring-1 focus:ring-[#f47729] transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full min-w-[900px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8f9fa] border-b border-[#adb2b0]/30">
                                        <th className="py-4 px-6 text-[10px] font-black text-[#5167a2] uppercase tracking-widest">Customer</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-[#5167a2] uppercase tracking-widest text-right">Credit Limit</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-[#5167a2] uppercase tracking-widest text-right">Utilised</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-[#5167a2] uppercase tracking-widest text-center">Status</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-[#5167a2] uppercase tracking-widest text-right">Overdue</th>
                                        <th className="py-4 px-6 text-[10px] font-black text-[#5167a2] uppercase tracking-widest text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="py-12 text-center text-[#8c7361] text-[11px] font-bold uppercase tracking-widest animate-pulse">Loading Data...</td></tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr><td colSpan={6} className="py-12 text-center text-[#8c7361] text-[11px] font-bold uppercase tracking-widest">No matching records found.</td></tr>
                                    ) : (
                                        filteredData.map((item, index) => {
                                            const utilPerc = (item.usedLimit / item.creditLimit) * 100;
                                            return (
                                                <tr key={index} className="border-b border-[#adb2b0]/20 hover:bg-[#f8f9fa] transition-colors group">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <p className="text-[12px] font-black text-[#091d38] uppercase tracking-tight">{item.name}</p>
                                                                <p className="text-[10px] font-bold text-[#8c7361] mt-0.5 uppercase tracking-wide">ID: {item.id} • {item.term}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-right font-black text-[12px] text-[#2e3118]">{formatCurrency(item.creditLimit)}</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <p className="font-black text-[12px] text-[#2e3118]">{formatCurrency(item.usedLimit)}</p>
                                                        <div className="w-full bg-[#adb2b0]/20 h-1.5 rounded-full mt-2 flex overflow-hidden">
                                                            <div className={`h-full rounded-full ${utilPerc > 90 ? 'bg-red-500' : utilPerc > 75 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(utilPerc, 100)}%` }}></div>
                                                        </div>
                                                        <p className="text-[9px] font-bold text-[#8c7361] mt-1 text-right">{utilPerc.toFixed(1)}%</p>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <p className={`font-black text-[12px] ${item.overdue > 0 ? 'text-red-600' : 'text-[#8c7361]'}`}>
                                                            {item.overdue > 0 ? formatCurrency(item.overdue) : '-'}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-6 text-center align-middle">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button onClick={() => setEditMode({...item})} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#5167a2]/20 text-[#5167a2] hover:border-[#1f2a44] hover:bg-[#5167a2]/10 transition-colors shadow-sm bg-white active:scale-90" title="Edit limit">
                                                                <Pencil size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                </main>
            </div>

            <UserGuidePanel 
                isOpen={showGuide} 
                onClose={() => setShowGuide(false)} 
                title="Credit Limit Guide"
                desc="คู่มือการจัดการวงเงินเครดิตลูกค้า"
                sections={[
                    {
                        id: "1",
                        title: "วงเงินเครดิต (Credit Limit) คืออะไร?",
                        icon: "ShieldAlert",
                        description: "ใช้ตรวจสอบและบริหารวงเงินลูกหนี้ให้สอดคล้องกับนโยบาย",
                        bullets: [
                            { icon: "AlertTriangle", iconColor: "#f47729", title: "Status Logic", text: "Healthy (<75%), Warning (>75%), Critical (Overdue/Limited)" }
                        ]
                    }
                ]}
            />

            {editMode && (
                <DraggableModal isOpen={true} onClose={() => setEditMode(null)} title={<span className="text-sm font-black uppercase text-[#091d38] tracking-widest flex items-center gap-2"><Pencil size={16} className="text-[#f47729]"/> EDIT CREDIT LIMIT: {editMode.id}</span>} width="500px">
                    <form onSubmit={handleUpdateCredit} className="flex flex-col">
                        <div className="p-6 bg-white font-mono">
                            <div className="flex items-center justify-between mb-6 p-4 bg-[#f8f9fa] border border-[#adb2b0]/30 rounded-xl">
                                <div>
                                    <p className="text-[10px] font-bold text-[#8c7361] uppercase tracking-widest">Customer</p>
                                    <p className="text-[12px] font-black text-[#091d38] uppercase tracking-tight">{editMode.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-[#8c7361] uppercase tracking-widest">Terms</p>
                                    <p className="text-[12px] font-black text-[#091d38]">{editMode.term}</p>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">New Credit Limit (THB) *</label>
                                <input 
                                    type="number" 
                                    value={editMode.creditLimit}
                                    onChange={(e) => setEditMode({...editMode, creditLimit: e.target.value})}
                                    className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm font-mono"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6 p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex gap-3">
                                <AlertTriangle size={16} className="text-[#f47729] mt-0.5 shrink-0" />
                                <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
                                    Changing the credit limit requires management approval if the new limit exceeds the maximum tier for the customer's category.
                                </p>
                            </div>
                        </div>
                        <div className="p-5 border-t border-[#d2af94]/50 bg-[#F0EAE1]/30 flex justify-end gap-4 shrink-0 font-mono">
                            <button type="button" onClick={() => setEditMode(null)} className="px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-[#8c7361] bg-white border border-[#adb2b0]/50 hover:bg-[#adb2b0]/10 transition-all shadow-sm">CANCEL</button>
                            <button type="submit" className="px-8 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-white bg-[#091d38] hover:bg-[#214573] shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#091d38]">
                                <Save size={16} className="text-[#f47729]"/> SAVE NEW LIMIT
                            </button>
                        </div>
                    </form>
                </DraggableModal>
            )}
        </>
    );
}
