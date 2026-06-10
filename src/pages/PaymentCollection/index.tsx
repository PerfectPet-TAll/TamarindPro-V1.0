import React, { useState } from 'react';
import { 
    DollarSign, AlertCircle, CheckCircle2, Clock, CalendarDays,
    FileText, ArrowUpRight, ArrowDownRight, Send, Download, Plus, BarChart2
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    Legend, LineChart, Line
} from 'recharts';
import KpiCard from '../../components/shared/KpiCard';
import { DataTable } from '../../components/shared/DataTable';
import { DataExport } from '../../components/shared/DataExport';
import { DraggableModal } from '../../components/shared/DraggableModal';

import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

const THEME = {
  primary: '#f47729',
  secondary: '#af7a2b',
  navy: '#214573',
  darkNavy: '#091d38',
  olive: '#606934',
  danger: '#e3624a',
  success: '#5da7b3',
  gray: '#adb2b0',
};

// Mock Data
const MOCK_COLLECTION_DATA = [
  { id: 'INV-2026-081', customer: 'Siam Paragon Group', amount: 1250000, status: 'Collected', dueDate: '2026-06-05', date: '2026-06-03' },
  { id: 'INV-2026-082', customer: 'Central Retail', amount: 850000, status: 'Pending', dueDate: '2026-06-15', date: '2026-05-15' },
  { id: 'INV-2026-083', customer: 'Tamarind Exporters Inc', amount: 150000, status: 'Overdue', dueDate: '2026-05-30', date: '2026-05-01' },
  { id: 'INV-2026-084', customer: 'Local Supermarket Co.', amount: 45000, status: 'Partial', dueDate: '2026-06-10', date: '2026-05-10' },
  { id: 'INV-2026-085', customer: 'Global Foods Corp', amount: 3000000, status: 'Collected', dueDate: '2026-05-25', date: '2026-05-20' },
  { id: 'INV-2026-086', customer: 'Thai Distributors Ltd', amount: 200000, status: 'Pending', dueDate: '2026-06-20', date: '2026-05-20' },
  { id: 'INV-2026-087', customer: 'BKK Restaurants', amount: 12000, status: 'Overdue', dueDate: '2026-06-01', date: '2026-05-01' },
];

const MOCK_CASH_FLOW = [
  { month: 'Jan', collected: 4500000, projected: 4000000 },
  { month: 'Feb', collected: 4200000, projected: 4300000 },
  { month: 'Mar', collected: 5100000, projected: 4800000 },
  { month: 'Apr', collected: 4800000, projected: 5000000 },
  { month: 'May', collected: 5500000, projected: 5200000 },
  { month: 'Jun', collected: 1250000, projected: 5800000 }, // Current month
];

const StatusBadge = ({ status }: { status: string }) => {
  let styles = '';
  let Icon = null;
  switch (status.toLowerCase()) {
    case 'collected':
      styles = 'bg-[#5da7b3]/10 text-[#5da7b3] border-[#5da7b3]/20';
      Icon = CheckCircle2;
      break;
    case 'pending':
      styles = 'bg-[#f47729]/10 text-[#f47729] border-[#f47729]/20';
      Icon = Clock;
      break;
    case 'partial':
      styles = 'bg-[#af7a2b]/10 text-[#af7a2b] border-[#af7a2b]/20';
      Icon = DollarSign;
      break;
    case 'overdue':
      styles = 'bg-[#e3624a]/10 text-[#e3624a] border-[#e3624a]/20';
      Icon = AlertCircle;
      break;
    default:
      styles = 'bg-[#adb2b0]/10 text-[#adb2b0] border-[#adb2b0]/20';
      Icon = FileText;
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-black border ${styles}`}>
      <Icon size={12} /> {status}
    </span>
  );
};

const PriorityWarning = ({ status, dueDate }: { status: string, dueDate: string }) => {
  // If status is pending, show High Priority warning
  if (status.toLowerCase() !== 'pending') return null;

  return (
    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3624a] text-white text-[9px] font-black uppercase tracking-widest shadow-sm animate-pulse">
      <AlertCircle size={10} /> High Priority
    </div>
  );
};

export default function PaymentCollection() {
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [showGuide, setShowGuide] = useState(false);

    const columns = [
        { 
            key: 'id', 
            label: 'Invoice ID', 
            filterable: true, 
            sortable: true,
            render: (val: string) => <span className="font-black text-[#214573] text-[12px]">{val}</span>
        },
        { 
            key: 'customer', 
            label: 'Customer', 
            filterable: true, 
            sortable: true,
            render: (val: string) => <span className="font-bold text-[#2e3118] text-[13px]">{val}</span>
        },
        { 
            key: 'status', 
            label: 'Status', 
            filterable: true, 
            sortable: true,
            render: (val: string, row: any) => (
                <div className="flex flex-col items-start">
                    <StatusBadge status={val} />
                    <PriorityWarning status={val} dueDate={row.dueDate} />
                </div>
            )
        },
        { 
            key: 'amount', 
            label: 'Amount', 
            sortable: true,
            render: (val: number) => <span className="font-mono font-black text-[13px]">฿{val.toLocaleString()}</span>
        },
        { 
            key: 'dueDate', 
            label: 'Due Date', 
            sortable: true,
            render: (val: string) => <span className="font-mono text-[12px] text-[#8c7361]">{val}</span>
        },
    ];

    return (
        <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent relative animate-fadeIn">
            {/* HEADER SECTION */}
            <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <DollarSign size={28} strokeWidth={2.5} className="text-[#f47729]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            PAYMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">COLLECTION</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            MONITOR OUTSTANDING INVOICES AND COLLECTED REVENUE
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-2">
                        <DataExport data={MOCK_COLLECTION_DATA} columns={columns} filename="Payment_Collection" />
                        <button className="px-5 py-2.5 bg-[#091d38] text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#214573] shadow-md flex items-center gap-2">
                            <Plus size={16} className="text-[#f47729]" /> Record Payment
                        </button>
                    </div>
                </div>
            </div>

            <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <AlertCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>
            
            <main className="w-full px-4 sm:px-8 mb-8 mt-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                <div className="w-full mt-4 flex-1 flex flex-col min-h-0">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
                    <KpiCard
                        title="Collected (This Month)"
                        value="฿1.25M"
                        description="45% of expected"
                        color={THEME.navy}
                        icon={CheckCircle2}
                    />
                    <KpiCard
                        title="Total Outstanding"
                        value="฿1.09M"
                        description="Unpaid pending invoices"
                        color={THEME.primary}
                        icon={Clock}
                    />
                    <KpiCard
                        title="Overdue Amount"
                        value="฿162K"
                        description="Requires immediate action"
                        color={THEME.danger}
                        icon={AlertCircle}
                    />
                    <KpiCard
                        title="Avg Collection Days"
                        value="14 Days"
                        description="Down from 18 days"
                        color={THEME.success}
                        icon={CalendarDays}
                    />
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    
                    {/* Data Table */}
                    <div className="xl:col-span-2 bg-white border border-[#adb2b0]/30 rounded-[24px] shadow-sm flex flex-col flex-1 overflow-hidden min-h-[450px]">
                        <div className="px-6 py-5 border-b border-[#adb2b0]/30 bg-[#f8f9fa] flex justify-between items-center bg-opacity-50">
                            <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2">
                                <FileText size={18} className="text-[#091d38]" /> Invoice Aging list
                            </h3>
                        </div>
                        <div className="p-4 flex-1">
                            <DataTable 
                                columns={columns} 
                                data={MOCK_COLLECTION_DATA} 
                                onRowClick={(row) => setSelectedInvoice(row)}
                            />
                        </div>
                    </div>

                    {/* Cash Flow Chart */}
                    <div className="bg-white border border-[#adb2b0]/30 rounded-[24px] shadow-sm flex flex-col p-6 min-h-[450px]">
                        <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2 mb-6">
                            <BarChart2 className="text-[#f47729]" size={18} /> Cash Flow Predictor
                        </h3>
                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_CASH_FLOW} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.gray} opacity={0.3} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: THEME.gray }} tickMargin={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: THEME.gray }} tickFormatter={(val) => `฿${(val/1000000).toFixed(1)}M`} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ color: THEME.gray, fontWeight: 700, fontSize: '12px' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                                    <Bar dataKey="projected" name="Projected" fill={THEME.primary} opacity={0.4} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="collected" name="Collected" fill={THEME.navy} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                </div>
            </main>

            {/* Modal Detail */}
            <DraggableModal
                isOpen={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                title={
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-[#f47729]" />
                        <span className="text-sm font-black text-[#091d38] uppercase tracking-widest">
                            Invoice Detail: {selectedInvoice?.id}
                        </span>
                    </div>
                }
                width="max-w-xl"
            >
                {selectedInvoice && (
                    <div className="p-6 bg-white shrink-0 scroll-auto">
                        <div className="flex justify-between items-start mb-6 border-b border-[#adb2b0]/20 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-[#2e3118] mb-1">{selectedInvoice.customer}</h2>
                                <p className="text-[12px] font-bold text-[#8c7361] uppercase tracking-widest">Term: Net 30</p>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={selectedInvoice.status} />
                                <p className="text-[14px] font-black font-mono mt-3 text-[#214573]">฿{selectedInvoice.amount.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#adb2b0]/30">
                                <p className="text-[10px] font-black text-[#8c7361] uppercase tracking-widest mb-1">Issue Date</p>
                                <p className="text-[13px] font-bold text-[#2e3118] font-mono">{selectedInvoice.date}</p>
                            </div>
                            <div className="bg-[#EAF2EA]/50 p-4 rounded-xl border border-[#adb2b0]/30">
                                <p className="text-[10px] font-black text-[#8c7361] uppercase tracking-widest mb-1">Due Date</p>
                                <p className="text-[13px] font-bold text-[#2e3118] font-mono">{selectedInvoice.dueDate}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-[#adb2b0]/20 justify-end">
                            <button className="px-4 py-2 border border-[#adb2b0] text-[#2e3118] rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors flex items-center gap-2">
                                <Send size={14} /> Send Reminder
                            </button>
                            <button className="px-4 py-2 bg-[#5da7b3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#4a8a94] transition-colors shadow-sm flex items-center gap-2">
                                <CheckCircle2 size={14} /> Mark as Paid
                            </button>
                        </div>
                    </div>
                )}
            </DraggableModal>

            <UserGuidePanel 
                isOpen={showGuide} 
                onClose={() => setShowGuide(false)} 
                title="Payment Collection Guide"
                desc="คู่มือการติดตามหนี้สิน"
                sections={[
                    {
                        id: "1",
                        title: "สถานะการชำระเงิน",
                        icon: "DollarSign",
                        description: "ติดตามสถานะเอกสารวางบิล",
                        bullets: [
                            { icon: "CheckCircle2", iconColor: "#5da7b3", title: "Collected", text: "ชำระเงินเรียบร้อยแล้ว" },
                            { icon: "Clock", iconColor: "#f47729", title: "Pending", text: "รอชำระเงิน/กำลังดำเนินการ" },
                            { icon: "AlertCircle", iconColor: "#e3624a", title: "Overdue", text: "เกินกำหนด ยอดหนี้ค้างชำระ" }
                        ]
                    }
                ]}
            />
        </div>
    );
}
