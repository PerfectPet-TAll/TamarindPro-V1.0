import React, { useState } from 'react';
import { 
  Banknote, CalendarDays, Wallet, CreditCard, 
  ArrowUpRight, ArrowDownRight, FileText, Search, Plus, Filter,
  CheckCircle2, Clock, AlertCircle, MoreHorizontal, History, Printer, HelpCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { PdfPrint } from '../../components/shared/PdfPrint';
import { DataExport } from '../../components/shared/DataExport';
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
  textMain: '#2e3118',
  textMuted: '#8c7361'
};

const MOCK_DEPOSITS = [
  { id: 'DP-2026-001', customer: 'Global Foods Corp', amount: 450000, totalOrderValue: 1500000, status: 'Received', date: '2026-05-20', paymentMethod: 'Bank Transfer' },
  { id: 'DP-2026-002', customer: 'Thai Retail Group', amount: 120000, totalOrderValue: 400000, status: 'Pending', date: '2026-06-02', paymentMethod: 'PromptPay' },
  { id: 'DP-2026-003', customer: 'SME Market Asia', amount: 50000, totalOrderValue: 100000, status: 'Verified', date: '2026-06-03', paymentMethod: 'Credit Card' },
  { id: 'DP-2026-004', customer: 'Premium Export Co.', amount: 250000, totalOrderValue: 800000, status: 'Overdue', date: '2026-05-15', paymentMethod: 'Bank Transfer' },
  { id: 'DP-2026-005', customer: 'Local Distributors', amount: 30000, totalOrderValue: 100000, status: 'Refunded', date: '2026-06-01', paymentMethod: 'Cash' },
];

const PaymentStatusBadge = ({ status }: { status: string }) => {
  let statusClasses = '';
  let StatusIcon = null;

  switch (status.toLowerCase()) {
    case 'received':
    case 'completed':
      statusClasses = 'bg-[#5da7b3]/10 text-[#5da7b3] border border-[#5da7b3]/20';
      StatusIcon = CheckCircle2;
      break;
    case 'verified':
      statusClasses = 'bg-[#214573]/10 text-[#214573] border border-[#214573]/20';
      StatusIcon = CheckCircle2;
      break;
    case 'pending':
      statusClasses = 'bg-[#af7a2b]/10 text-[#af7a2b] border border-[#af7a2b]/20';
      StatusIcon = Clock;
      break;
    case 'overdue':
    case 'refunded':
      statusClasses = 'bg-[#e3624a]/10 text-[#e3624a] border border-[#e3624a]/20';
      StatusIcon = AlertCircle;
      break;
    default:
      statusClasses = 'bg-[#adb2b0]/10 text-[#8c7361] border border-[#adb2b0]/20';
      StatusIcon = FileText;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-black ${statusClasses}`}>
      {StatusIcon && <StatusIcon size={12} />}
      {status}
    </span>
  );
};


const MOCK_MONTHLY_DEPOSITS = [
  { month: 'Jan', completed: 1500000, pending: 300000 },
  { month: 'Feb', completed: 1800000, pending: 250000 },
  { month: 'Mar', completed: 2100000, pending: 400000 },
  { month: 'Apr', completed: 1900000, pending: 350000 },
  { month: 'May', completed: 2500000, pending: 500000 },
  { month: 'Jun', completed: 800000, pending: 1200000 }, // Current month
];

const MOCK_STATUS_DISTRIBUTION = [
  { name: 'Verified/Received', value: 8100000, fill: THEME.navy },
  { name: 'Pending', value: 3000000, fill: THEME.primary },
  { name: 'Overdue', value: 850000, fill: THEME.danger },
];

const MOCK_PAYMENT_HISTORY: Record<string, any[]> = {
  'DP-2026-001': [
    { timestamp: '2026-05-18 10:30', amount: 150000, type: 'Initial Deposit', status: 'Received' },
    { timestamp: '2026-05-20 14:15', amount: 300000, type: 'Second Installment', status: 'Received' }
  ],
  'DP-2026-002': [
    { timestamp: '2026-06-02 09:00', amount: 120000, type: 'Initial Deposit', status: 'Pending' }
  ],
  'DP-2026-003': [
    { timestamp: '2026-06-01 11:45', amount: 50000, type: 'Initial Deposit', status: 'Received' },
    { timestamp: '2026-06-03 16:20', amount: 0, type: 'Document Verification', status: 'Verified' }
  ],
  'DP-2026-004': [
    { timestamp: '2026-05-01 10:00', amount: 100000, type: 'Initial Deposit', status: 'Received' },
    { timestamp: '2026-05-15 12:00', amount: 150000, type: 'Second Installment', status: 'Overdue' }
  ],
  'DP-2026-005': [
    { timestamp: '2026-05-25 15:30', amount: 30000, type: 'Initial Deposit', status: 'Received' },
    { timestamp: '2026-06-01 09:15', amount: -30000, type: 'Cancellation Refund', status: 'Refunded' }
  ]
};

const MetricCard = ({ title, value, subtext, trend, isPositive, icon: Icon, color }: any) => (
  <div className="bg-white rounded-[20px] p-5 border border-[#adb2b0]/30 shadow-sm relative overflow-hidden group">
    <div className={`absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={100} style={{ color }} />
    </div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-2.5 rounded-xl`} style={{ backgroundColor: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isPositive ? 'bg-[#5da7b3]/10 text-[#5da7b3]' : 'bg-[#e3624a]/10 text-[#e3624a]'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-[#2e3118] tracking-tight mb-2.5 font-mono">{value}</h3>
      <p className="text-[11px] font-bold text-[#8c7361]">{subtext}</p>
    </div>
  </div>
);

export default function DepositsDownPayment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const filteredDeposits = MOCK_DEPOSITS.filter(dep => 
    dep.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dep.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent relative animate-fadeIn">
        {/* USER GUIDE FLOATING TAB */}
        <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
            <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
            <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
        </button>

        {/* HEADER SECTION */}
        <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
            <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center group cursor-default shrink-0">
                    <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                    <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                        <Banknote size={28} strokeWidth={2.5} className="text-[#f47729]" />
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                        DEPOSITS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">DOWN PAYMENT</span>
                    </h3>
                    <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                        MANAGE PRE-PAYMENTS, RESERVES, AND INSTALLMENTS
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-2">
                    <button className="px-5 py-2.5 bg-white border border-[#adb2b0]/50 text-[#214573] rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#f8f9fa] transition-all shadow-sm flex items-center gap-2">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="px-5 py-2.5 bg-[#091d38] text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#214573] transition-all shadow-md flex items-center gap-2">
                        <Plus size={16} className="text-[#f47729]" />
                        Record Deposit
                    </button>
                </div>
            </div>
        </div>

        <main className="w-full px-4 sm:px-8 mb-8 mt-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
            <div className="w-full mt-4 flex-1 flex flex-col min-h-0">
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
          <MetricCard 
            title="Total Deposits (YTD)" 
            value="฿10.6M" 
            subtext="Collected this year"
            trend="+15%" 
            isPositive={true}
            icon={Wallet}
            color={THEME.navy}
          />
          <MetricCard 
            title="Pending Deposits" 
            value="฿1.2M" 
            subtext="Awaiting payment confirmation"
            trend="-5%" 
            isPositive={true}
            icon={Clock}
            color={THEME.primary}
          />
          <MetricCard 
            title="Avg. Deposit Size" 
            value="฿185K" 
            subtext="Across B2B and Retail"
            trend="+8%" 
            isPositive={true}
            icon={CreditCard}
            color={THEME.success}
          />
          <MetricCard 
            title="Overdue Deposits" 
            value="3" 
            subtext="Requiring follow-up"
            trend="+2" 
            isPositive={false}
            icon={AlertCircle}
            color={THEME.danger}
          />
        </div>

        {/* Charts & Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[350px]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-[#214573] uppercase tracking-widest flex items-center gap-2">
                  <Wallet className="text-[#f47729]" size={18} /> Monthly Deposit Cash Flow
                </h3>
             </div>
             <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={MOCK_MONTHLY_DEPOSITS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#adb2b0" opacity={0.3} vertical={false} />
                      <XAxis dataKey="month" stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `฿${(val/1000000).toFixed(1)}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: THEME.darkNavy, borderColor: THEME.navy, borderRadius: '12px' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                        labelStyle={{ color: THEME.gray, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Bar dataKey="completed" name="Completed Deposits" fill={THEME.navy} radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="pending" name="Pending Deposits" fill={THEME.primary} radius={[4, 4, 0, 0]} stackId="a" />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[350px] relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#EAF2EA] to-transparent w-32 h-32 opacity-50 rounded-bl-full pointer-events-none" />
             <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                <Wallet className="text-[#af7a2b]" size={18} /> Status Distribution
             </h3>
             <p className="text-[10px] font-bold text-[#8c7361] uppercase tracking-widest relative z-10 border-b border-[#adb2b0]/30 pb-4">
                Verified vs Pending Values (YTD)
             </p>
             <div className="flex-1 w-full relative -mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={MOCK_STATUS_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                         {MOCK_STATUS_DISTRIBUTION.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`฿${(value/1000000).toFixed(1)}M`, 'Amount']}
                        contentStyle={{ backgroundColor: THEME.darkNavy, borderColor: THEME.navy, borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} 
                      />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[#adb2b0]/30 overflow-hidden mb-8">
           <div className="px-6 py-5 border-b border-[#adb2b0]/30 bg-[#f8f9fa] flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2">
                 <FileText size={18} className="text-[#091d38]" /> Recent Deposit Transactions
              </h3>
              <div className="flex items-center gap-3">
                  <DataExport
                      data={filteredDeposits}
                      columns={[
                          { key: 'id', label: 'Reference ID' },
                          { key: 'customer', label: 'Customer' },
                          { key: 'amount', label: 'Deposit Amount' },
                          { key: 'totalOrderValue', label: 'Total Order Value' },
                          { key: 'status', label: 'Status' }
                      ]}
                      filename="Deposits_Down_Payment"
                  />
                  <div className="relative w-full max-w-xs">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7361]" size={16} />
                     <input 
                        type="text" 
                        placeholder="Search ID or Customer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#adb2b0]/40 rounded-xl text-[12px] font-bold text-[#2e3118] bg-white outline-none focus:border-[#f47729] focus:ring-1 focus:ring-[#f47729] transition-all"
                     />
                  </div>
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left font-sans border-collapse min-w-[800px]">
                <thead className="bg-white text-[#53483e] font-mono border-b border-[#adb2b0]/20">
                   <tr>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px]">Reference ID</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px]">Customer</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right">Deposit Amount</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right">Total Order Value</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center">% of Value</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center">Status</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center">Date</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] w-12"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#adb2b0]/10 font-mono">
                   {filteredDeposits.map((dep, idx) => {
                      const depositPct = Math.round((dep.amount / dep.totalOrderValue) * 100);

                      return (
                      <tr key={dep.id} className="hover:bg-[#EAF2EA]/20 transition-colors">
                         <td className="py-4 px-6 font-black text-[#214573] text-[12px]">
                            {dep.id}
                         </td>
                         <td className="py-4 px-6 font-black text-[#2e3118] text-[13px] uppercase tracking-tight font-sans">
                            {dep.customer}
                            <span className="block text-[10px] font-bold text-[#8c7361] uppercase tracking-widest mt-0.5 font-mono">{dep.paymentMethod}</span>
                         </td>
                         <td className="py-4 px-6 text-right font-black text-[13px] text-[#214573]">
                            ฿{dep.amount.toLocaleString()}
                         </td>
                         <td className="py-4 px-6 text-right font-black text-[12px] text-[#8c7361]">
                            ฿{dep.totalOrderValue.toLocaleString()}
                         </td>
                         <td className="py-4 px-6 text-center">
                           <div className="inline-flex items-center justify-center p-1.5 bg-[#f8f9fa] rounded text-[11px] font-black text-[#2e3118]">
                              {depositPct}%
                           </div>
                         </td>
                         <td className="py-4 px-6 text-center">
                            <PaymentStatusBadge status={dep.status} />
                         </td>
                         <td className="py-4 px-6 text-center font-bold text-[#8c7361] text-[12px]">
                            {dep.date}
                         </td>
                         <td className="py-4 px-6 text-center flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedHistoryId(dep.id)}
                              className="p-2 hover:bg-[#adb2b0]/20 rounded-lg transition-colors text-[#214573]"
                              title="View Payment History"
                            >
                               <History size={18} />
                            </button>
                            {dep.status.toLowerCase() === 'verified' && (
                               <button 
                                 onClick={() => setSelectedReceiptId(dep.id)}
                                 className="p-2 hover:bg-[#5da7b3]/20 rounded-lg transition-colors text-[#5da7b3]"
                                 title="Generate Receipt"
                               >
                                  <Printer size={18} />
                               </button>
                            )}
                         </td>
                      </tr>
                   )})}
                </tbody>
             </table>
           </div>
        </div>
        </div>
      </main>

      <UserGuidePanel 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        title="Deposits & Down Payment Guide"
        desc="คู่มือการจัดการเงินมัดจำและการชำระเงินล่วงหน้า"
        sections={[
            {
                id: "1",
                title: "ตัวชี้วัด (KPIs)",
                icon: "Banknote",
                description: "ข้อมูลเงินมัดจำ",
                bullets: [
                    { icon: "Wallet", iconColor: "#f47729", title: "Total Deposits (YTD)", text: "ยอดเงินมัดจำรวมทั้งหมดในปีนี้" },
                    { icon: "Clock", iconColor: "#091d38", title: "Pending Deposits", text: "ยอดเงินมัดจำที่รอการยืนยันการชำระเงิน" }
                ]
            }
        ]}
      />

      <DraggableModal
        isOpen={!!selectedHistoryId}
        onClose={() => setSelectedHistoryId(null)}
        title={
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#f47729]" />
            <span className="text-sm font-black text-[#091d38] uppercase tracking-widest">
              Payment History: {selectedHistoryId}
            </span>
          </div>
        }
        width="max-w-xl"
      >
        <div className="p-6 bg-white shrink-0 scroll-auto">
          {selectedHistoryId && MOCK_PAYMENT_HISTORY[selectedHistoryId] ? (
            <div className="relative pl-6 border-l border-[#adb2b0]/40 space-y-6">
              {MOCK_PAYMENT_HISTORY[selectedHistoryId].map((historyItem, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[29px] top-2 w-2.5 h-2.5 rounded-full bg-[#f47729] ring-4 ring-white" />
                  <div className="bg-white border border-[#adb2b0]/30 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[13px] font-black text-[#2e3118] font-sans">{historyItem.type}</span>
                      <PaymentStatusBadge status={historyItem.status} />
                    </div>
                    <div className="flex justify-between items-end mt-3 border-t border-[#adb2b0]/20 pt-3">
                      <span className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} /> {historyItem.timestamp}
                      </span>
                      {historyItem.amount !== 0 && (
                        <span className={`font-black text-[14px] font-mono ${historyItem.amount > 0 ? 'text-[#5da7b3]' : 'text-[#e3624a]'}`}>
                          {historyItem.amount > 0 ? '+' : '-'}฿{Math.abs(historyItem.amount).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#8c7361] text-[12px] font-bold uppercase tracking-widest flex flex-col items-center gap-3">
              <FileText size={24} className="opacity-50" />
              <span>No history available for this record.</span>
            </div>
          )}
        </div>
      </DraggableModal>

      {selectedReceiptId && (
        <DraggableModal
          isOpen={true}
          onClose={() => setSelectedReceiptId(null)}
          title={
            <div className="flex items-center gap-2">
              <Printer size={18} className="text-[#5da7b3]" />
              <span className="text-sm font-black text-[#091d38] uppercase tracking-widest">
                Receipt Template: {selectedReceiptId}
              </span>
            </div>
          }
          width="max-w-2xl"
        >
          <div className="p-6 bg-[#f8f9fa] shrink-0 scroll-auto">
            <div className="flex justify-end mb-4">
              <PdfPrint contentId={`receipt-${selectedReceiptId}`} title={`Receipt_${selectedReceiptId}`} />
            </div>

            {(() => {
              const dep = MOCK_DEPOSITS.find(d => d.id === selectedReceiptId);
              if (!dep) return null;

              return (
                <div id={`receipt-${selectedReceiptId}`} className="bg-white p-8 border border-[#adb2b0]/30 shadow-sm mx-auto max-w-lg">
                  <div className="text-center border-b border-[#111f42] pb-6 mb-6">
                    <h1 className="text-2xl font-black text-[#f47729] mb-2 uppercase">TAMARIND PRO</h1>
                    <h2 className="text-lg font-black text-[#091d38] uppercase tracking-widest">Official Receipt</h2>
                    <p className="text-[12px] text-[#8c7361] mt-2">Ref: {selectedReceiptId}</p>
                  </div>
                  
                  <div className="flex justify-between mb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#8c7361] mb-1">Customer</p>
                      <p className="text-[14px] font-bold text-[#2e3118]">{dep.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-[#8c7361] mb-1">Date</p>
                      <p className="text-[14px] font-bold text-[#2e3118]">{dep.date}</p>
                    </div>
                  </div>

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b border-[#adb2b0]/30">
                        <th className="py-2 text-left text-[10px] uppercase font-black text-[#8c7361]">Description</th>
                        <th className="py-2 text-right text-[10px] uppercase font-black text-[#8c7361]">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#f1f5f9]">
                        <td className="py-4 text-[12px] font-bold text-[#2e3118]">Payment for Order/Deposit</td>
                        <td className="py-4 text-right text-[14px] font-mono font-black text-[#214573]">฿{dep.amount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-[10px] uppercase font-bold text-[#8c7361]">Payment Method</td>
                        <td className="py-4 text-right text-[12px] font-black text-[#2e3118]">{dep.paymentMethod}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t border-[#111f42] pt-4 flex justify-between items-center">
                    <span className="text-[12px] font-black uppercase text-[#091d38]">Total Received</span>
                    <span className="text-xl font-mono font-black text-[#5da7b3]">฿{dep.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </DraggableModal>
      )}

    </div>
  );
}
