import React, { useState } from 'react';
import { 
  FileText, Plus, AlertCircle, RefreshCw, CheckCircle2, Download
} from 'lucide-react';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { DataTable } from '../../components/shared/DataTable';
import { DataExport } from '../../components/shared/DataExport';
import { EditQuotationModal } from './components/EditQuotationModal';

const MOCK_QUOTATIONS = [
  { id: 'QT-2026-001', date: '2026-06-05', customer: 'Global Foods Ltd', bookId: 'PB-003', status: 'Sent', total: 4200 },
  { id: 'QT-2026-002', date: '2026-06-08', customer: 'Local Mart TH', bookId: 'PB-002', status: 'Draft', total: 11500 },
  { id: 'QT-2026-003', date: '2026-06-09', customer: 'Asian Super Market', bookId: 'PB-001', status: 'Approved', total: 24500 },
  { id: 'QT-2026-004', date: '2026-06-10', customer: 'Euro Foods', bookId: 'PB-003', status: 'Draft', total: 8800 },
  { id: 'QT-2026-005', date: '2026-06-11', customer: 'Thai Grocery', bookId: 'PB-001', status: 'Sent', total: 1530 },
  { id: 'QT-2026-006', date: '2026-06-12', customer: 'Malaysian Mart', bookId: 'PB-002', status: 'Approved', total: 32000 },
];

export default function Quotations() {
  const [quotations, setQuotations] = useState(MOCK_QUOTATIONS);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateNew = () => {
      setSelectedQuotation(null);
      setIsModalOpen(true);
  };

  const handleEdit = (qt: any) => {
      setSelectedQuotation(qt);
      setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
      if (selectedQuotation) {
          setQuotations(quotations.map(q => q.id === data.id ? { ...q, ...data } : q));
      } else {
          setQuotations([...quotations, { ...data, status: 'Draft' }]);
      }
      setIsModalOpen(false);
  };

  const columns = [
    { key: 'id', label: 'QT NO', sortable: true, filterable: true, render: (val: any) => <span className="font-mono font-bold text-[#214573]">{val}</span> },
    { key: 'date', label: 'DATE', sortable: true, filterable: true, render: (val: any) => <span className="text-slate-500">{val}</span> },
    { key: 'customer', label: 'CUSTOMER', sortable: true, filterable: true, render: (val: any) => <span className="font-bold text-[#2e3118]">{val}</span> },
    { key: 'bookId', label: 'PRICE BOOK', sortable: true, filterable: true, render: (val: any) => <span className="text-[#8c7361]">{val}</span> },
    { 
        key: 'status', 
        label: 'STATUS', 
        sortable: true, 
        filterable: true, 
        render: (val: any) => (
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                val === 'Approved' ? 'bg-[#EAF2EA] text-[#606934]' :
                val === 'Sent' ? 'bg-blue-50 text-[#214573]' :
                'bg-slate-100 text-slate-500'
            }`}>
                {val}
            </span>
        ) 
    },
    { key: 'total', label: 'TOTAL AMOUNT', sortable: true, filterable: false, render: (val: any) => <span className="font-mono font-black text-[#f47729]">{val.toLocaleString()}</span> },
    {
        key: 'actions',
        label: '',
        sortable: false,
        filterable: false,
        render: (_: any, row: any) => (
            <div className="sys-action-gap justify-end" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleEdit(row)} className="sys-btn-action"><FileText size={14} /></button>
            </div>
        )
    }
  ];

  return (
    <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent">
        <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[150px] bg-white border border-[#d2af94]/50 border-r-0 text-[#214573] py-8 px-1.5 rounded-l-xl shadow-[0_8px_30px_rgba(46,49,24,0.12)] hover:bg-[#214573] hover:text-[#f47729] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
            <FileText size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#af7a2b] group-hover:text-[#f47729]" />
            <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
        </button>

        <UserGuidePanel 
            isOpen={isGuideOpen} 
            onClose={() => setIsGuideOpen(false)}
            title="QUOTATIONS & PROPOSALS"
            desc="ระบบออกใบเสนอราคาและซิงค์กับ Price Books อัตโนมัติ"
            sections={[
                {
                    id: "1",
                    title: "Sync กับ Price Books",
                    icon: "RefreshCw",
                    description: "เมื่อคุณเลือก Price Book ระบบจะอัปเดตราคาของ SKU ใหม่ทั้งหมดในรายการโดยอัตโนมัติตามนโยบายราคาที่กำหนดไว้",
                    bullets: [
                        { icon: "CheckCircle2", iconColor: "#606934", text: "ลดข้อผิดพลาดในการตั้งราคาผิด" },
                        { icon: "AlertCircle", iconColor: "#f47729", text: "หากมีการแก้ราคาแบบ Manual สามารถทำได้ในหน้าสร้าง Quotation ทันที" }
                    ]
                }
            ]} 
        />

        {/* HEADER SECTION */}
        <div className="px-4 sm:px-8 pt-3 pb-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 z-20 shrink-0 bg-transparent">
            <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center group cursor-default shrink-0">
                    <div className="absolute inset-0 bg-[#214573] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                    <div className="relative z-10 p-1.5 border border-[#214573]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                        <FileText size={28} strokeWidth={2.5} className="text-[#214573]" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="font-sans font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                        QUOTATIONS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214573] to-[#f47729]">& PROPOSALS</span>
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
                        <div className="w-8 h-[2px] bg-[#af7a2b]"></div>
                        <p className="text-[11px] font-medium text-[#53483e] uppercase tracking-[0.2em] leading-none">Automated Pricing integration</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <DataExport 
                    data={quotations} 
                    columns={[
                        { key: 'id', label: 'QT NO' },
                        { key: 'date', label: 'DATE' },
                        { key: 'customer', label: 'CUSTOMER' },
                        { key: 'bookId', label: 'PRICE BOOK' },
                        { key: 'status', label: 'STATUS' },
                        { key: 'total', label: 'TOTAL AMOUNT' }
                    ]} 
                    filename="Quotations_Export" 
                />
                <button onClick={handleCreateNew} className="h-[44px] px-6 bg-[#214573] border border-[#214573] text-[#f47729] font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-[#091d38] transition-all shadow-[0_4px_15px_rgba(33,69,115,0.2)] flex items-center gap-2">
                    <Plus size={16} /> New Proposal
                </button>
            </div>
        </div>

        <main className="flex-1 px-4 sm:px-8 pb-12 overflow-y-auto custom-scrollbar animate-fadeIn flex flex-col">
            <div className="bg-white rounded-[24px] shadow-sm border border-[#d2af94]/30 overflow-hidden flex-1 flex flex-col">
                 <DataTable 
                     columns={columns}
                     data={quotations}
                     onRowClick={handleEdit}
                 />
            </div>
        </main>

        <EditQuotationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={selectedQuotation}
        />
    </div>
  );
}
