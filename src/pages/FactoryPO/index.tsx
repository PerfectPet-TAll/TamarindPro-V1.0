import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Factory, CheckCircle2, AlertTriangle, Plus, Pencil, HelpCircle, Save, ChevronLeft, ChevronRight, ListFilter, Trash2, FileText,
  LayoutGrid, List, ChevronDownCircle, Zap, Printer, Download
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { FactoryPOPrintTemplate } from './components/FactoryPOPrintTemplate';
import { FactoryPOChart } from './components/FactoryPOChart';
import { FactoryPOStatusTracker } from './components/FactoryPOStatusTracker';
import { FactoryPOCopilot } from './components/FactoryPOCopilot';
import { DataExport } from '../../components/shared/DataExport';
import { CreateFactoryPOModal } from './components/CreateFactoryPOModal';

const StyleInject = () => (
  <style>{`
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #adb2b0; border-radius: 10px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @media print {
    body * {
      visibility: hidden;
    }
    .print-template, .print-template * {
      visibility: visible;
    }
    .print-template {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    html, body {
      height: auto;
      overflow: visible !important;
      background: white !important;
    }
  }
`}</style>
);

const THEME = {
  bgMain: 'transparent',
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1f2a44 0%, #202024 100%)',
  palette: {
      navy: '#214573',
      blueMuted: '#5167a2',
      tealBlue: '#5da7b3',
      olive: '#606934',
      armyGreen: '#2e3118',
      gold: '#af7a2b',
      orangeBright: '#f47729',
      taupe: '#8c7361',
      lightTan: '#d2af94',
      dustyRose: '#a27175'
  }
};

const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'DRAFT': return `bg-slate-100 text-slate-500 border-slate-200`;
        case 'PENDING': return `bg-amber-50 text-amber-600 border-amber-200`;
        case 'APPROVED': return `bg-blue-50 text-blue-600 border-blue-200`;
        case 'COMPLETED': return `bg-emerald-50 text-emerald-600 border-emerald-200`;
        case 'CANCELLED': return `bg-red-50 text-red-500 border-red-200`;
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};

const mockPIData = [
    { itemId: 'PI2024-001-A', refPI: 'PI-2024-001', product: 'มะขามหวานคลุกน้ำตาล', containWeight: '500g', packedWeight: '500g', brand: 'TAMARIND PLUS', barcode: '8851234567890', quantity: 1000, expiryDate: '12 Months', expFormatOnLabel: 'APR 2027', packingCarton: '24 Pcs / Carton', note: 'ส่งมอบเดือนหน้า', totalValue: 45000 },
    { itemId: 'PI2024-001-B', refPI: 'PI-2024-001', product: 'มะขามจี๊ดจ๊าด', containWeight: '100g', packedWeight: '100g', brand: 'OEM-BRAND A', barcode: '8852233445566', quantity: 5000, expiryDate: '6 Months', expFormatOnLabel: 'OCT 2026', packingCarton: '50 Pcs / Carton', note: 'เร่งด่วน', totalValue: 75000 },
    { itemId: 'PI2024-003-A', refPI: 'PI-2024-003', product: 'มะขามแช่อิ่ม', containWeight: '200g', packedWeight: '200g', brand: 'OEM-BRAND B', barcode: '8853344556677', quantity: 2000, expiryDate: '6 Months', expFormatOnLabel: 'OCT 2026', packingCarton: '40 Pcs / Carton', note: '', totalValue: 30000 },
    { itemId: 'PI2024-004-A', refPI: 'PI-2024-004', product: 'มะขามป้อม', containWeight: '150g', packedWeight: '150g', brand: 'HEALTHY PLUS', barcode: '8854455667788', quantity: 1500, expiryDate: '12 Months', expFormatOnLabel: 'MAY 2027', packingCarton: '30 Pcs / Carton', note: 'ส่งมอบปลายเดือน', totalValue: 25000 },
];

const generatePOs = () => {
    return [
        { id: 'FPO-24001', refPI: 'PI-2024-001', product: 'มะขามหวานคลุกน้ำตาล', containWeight: '500g', brand: 'TAMARIND PLUS', packedWeight: '500g', barcode: '8851234567890', quantity: 1000, expiryDate: '12 Months', expFormatOnLabel: 'APR 2027', packingCarton: '24 Pcs / Carton', note: 'ส่งมอบเดือนหน้า', status: 'Completed', issueDate: '2026-04-01', approver: 'Wichian M.', totalValue: 45000 },
        { id: 'FPO-24002', refPI: 'PI-2024-002', product: 'มะขามจี๊ดจ๊าด', containWeight: '100g', brand: 'OEM-BRAND A', packedWeight: '100g', barcode: '8852233445566', quantity: 5000, expiryDate: '6 Months', expFormatOnLabel: 'OCT 2026', packingCarton: '50 Pcs / Carton', note: 'เร่งด่วน', status: 'Approved', issueDate: '2026-05-02', approver: 'Suda L.', totalValue: 75000 },
        { id: 'FPO-24003', refPI: 'PI-2024-001', product: 'มะขามจี๊ดจ๊าด (จาก PI เดียวกับ 001)', containWeight: '100g', brand: 'TAMARIND PLUS', packedWeight: '100g', barcode: '8851234567891', quantity: 2000, expiryDate: '6 Months', expFormatOnLabel: 'NOV 2026', packingCarton: '50 Pcs / Carton', note: 'ส่งพร้อม Lot แรก', status: 'Approved', issueDate: '2026-05-03', approver: 'Suda L.', totalValue: 30000 },
        { id: 'FPO-24004', refPI: 'PI-2024-003', product: 'มะขามแช่อิ่ม', containWeight: '200g', brand: 'OEM-BRAND B', packedWeight: '200g', barcode: '8853344556677', quantity: 1500, expiryDate: '6 Months', expFormatOnLabel: 'OCT 2026', packingCarton: '40 Pcs / Carton', note: '', status: 'Pending', issueDate: '2026-05-04', approver: 'Wichian M.', totalValue: 22500 },
        { id: 'FPO-24005', refPI: 'PI-2024-004', product: 'มะขามป้อม', containWeight: '150g', brand: 'HEALTHY PLUS', packedWeight: '150g', barcode: '8854455667788', quantity: 3000, expiryDate: '12 Months', expFormatOnLabel: 'MAY 2027', packingCarton: '30 Pcs / Carton', note: 'รอ Review', status: 'Draft', issueDate: '2026-06-05', approver: '-', totalValue: 45000 },
        { id: 'FPO-24006', refPI: 'PI-2024-005', product: 'มะขามคลุกเผ็ด', containWeight: '100g', brand: 'SPICY PLUS', packedWeight: '100g', barcode: '8855566778899', quantity: 500, expiryDate: '6 Months', expFormatOnLabel: 'NOV 2026', packingCarton: '50 Pcs / Carton', note: 'ลูกค้ายกเลิก', status: 'Cancelled', issueDate: '2026-06-01', approver: 'Suda L.', totalValue: 7500 },
        { 
            id: 'FPO-24007', refPI: 'PI-2024-006', product: 'Multiple Items (3 Categories)', containWeight: 'Various', brand: 'MIXED BRANDS', packedWeight: 'Various', barcode: 'MULTIPLE', quantity: 8500, expiryDate: 'Various', expFormatOnLabel: 'Various', packingCarton: 'Mixed Cartons', note: 'ส่งมอบรวมกัน', status: 'Approved', issueDate: '2026-06-08', approver: 'Wichian M.', totalValue: 120000,
            items: [
                { product: 'มะขามหวานคลุกน้ำตาล', containWeight: '500g', brand: 'TAMARIND PLUS', packedWeight: '500g', barcode: '8851234567890', quantity: 2000, expiryDate: '12 Months', expFormatOnLabel: 'APR 2027', packingCarton: '24 Pcs / Carton' },
                { product: 'มะขามจี๊ดจ๊าด', containWeight: '100g', brand: 'OEM-BRAND A', packedWeight: '100g', barcode: '8852233445566', quantity: 5000, expiryDate: '6 Months', expFormatOnLabel: 'OCT 2026', packingCarton: '50 Pcs / Carton' },
                { product: 'มะขามแช่อิ่ม', containWeight: '200g', brand: 'OEM-BRAND B', packedWeight: '200g', barcode: '8853344556677', quantity: 1500, expiryDate: '6 Months', expFormatOnLabel: 'OCT 2026', packingCarton: '40 Pcs / Carton' }
            ]
        }
    ];
};

export default function FactoryPO() {
    const [items, setItems] = useState(generatePOs());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPOs, setSelectedPOs] = useState<string[]>([]);
    const [viewDetailsPO, setViewDetailsPO] = useState<any>(null);
    const [activeStatus, setActiveStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [modalActiveTab, setModalActiveTab] = useState('PI DATA & ITEMS');
    const [showGuide, setShowGuide] = useState(false);
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'kanban'
    const [printPOs, setPrintPOs] = useState<any[]>([]);
    const [showPreviewPrint, setShowPreviewPrint] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showAICopilot, setShowAICopilot] = useState(false);
    const [currency, setCurrency] = useState('THB');

    const handleSavePO = (formData: any, targetMatrixItems: any[]) => {
        const newItems = targetMatrixItems.map((mat, i) => ({
            id: `FPO-${Date.now()}-${i}`,
            refPI: formData.piNo,
            product: mat.product,
            containWeight: mat.containWeight,
            brand: mat.brand,
            packedWeight: mat.packedWeight,
            barcode: mat.barcode,
            quantity: Number(mat.quantity) || 0,
            expiryDate: mat.expiryDate,
            expFormatOnLabel: mat.expiryDate,
            packingCarton: mat.packingCarton,
            note: mat.note,
            totalValue: mat.totalValue || 0,
            status: formData.status === 'DRAFT' ? 'Draft' : 'Issued',
            issueDate: formData.date,
            approver: formData.approvedBy || '-'
        }));
        
        setItems([...newItems, ...items]);
        setShowCreateModal(false);
    };

    const EXCHANGE_RATES: Record<string, number> = {
        THB: 1,
        USD: 0.029,
        EUR: 0.027,
        JPY: 4.3
    };

    const formatCurrency = (amount: number, curr: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr, minimumFractionDigits: curr === 'JPY' ? 0 : 2 }).format(amount * (EXCHANGE_RATES[curr] || 1));
    };

    // Form logic for new PO
    const [newPoForm, setNewPoForm] = useState({
        orderNo: `OEM-2605-0${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        piNo: '',
        customerName: '',
        status: 'DRAFT',
        verifiedBy: '',
        approvedBy: ''
    });

    const [matrixItems, setMatrixItems] = useState<any[]>([]);

    const handleDownloadSelected = () => {
        const selectedList = items.filter(i => selectedPOs.includes(i.id));
        if (selectedList.length > 0) {
            setPrintPOs(selectedList);
            setShowPreviewPrint(true);
        }
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            
            for (let i = 0; i < printPOs.length; i++) {
                const po = printPOs[i];
                const input = document.getElementById(`factory-po-print-preview-${po.id}`);
                if (!input) continue;

                const canvas = await html2canvas(input, {
                    scale: 2, 
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }
            
            pdf.save(`FACTORY_POS_BATCH_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsDownloading(false);
            setShowPreviewPrint(false);
            setSelectedPOs([]);
        }
    };

    const uniquePIs = useMemo(() => Array.from(new Set(mockPIData.map(p => p.refPI))), []);

    const filteredData = useMemo(() => {
        return items.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            const matchSearch = item.id.toLowerCase().includes(searchLower) || 
                                item.product.toLowerCase().includes(searchLower) ||
                                item.refPI.toLowerCase().includes(searchLower) ||
                                item.brand.toLowerCase().includes(searchLower);
            const matchStatus = activeStatus === 'All' || item.status === activeStatus;
            return matchSearch && matchStatus;
        });
    }, [items, searchTerm, activeStatus]);

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    // Kanban columns
    const kanbanColumns = ['Draft', 'Pending', 'Approved', 'Completed', 'Cancelled'];

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleNextStep = (id: string, currentStatus: string) => {
        const idx = kanbanColumns.indexOf(currentStatus);
        if (idx !== -1 && idx < 4) { // Up to Completed
            setItems(prev => prev.map(item => item.id === id ? { ...item, status: kanbanColumns[idx + 1] } : item));
        }
    };

    return (
        <>
            <StyleInject />
            <div className={`w-full flex-1 flex flex-col font-sans relative`}>
                <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[150px] bg-white border border-[#d2af94]/50 border-r-0 text-[#214573] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#214573] hover:text-[#f47729] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group no-print font-mono">
                    <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#af7a2b] group-hover:text-[#f47729]" />
                    <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
                </button>

                <UserGuidePanel 
                    isOpen={showGuide} 
                    onClose={() => setShowGuide(false)} 
                    title="FACTORY PO (OEM)" 
                    desc="ระบบออกใบสั่งผลิตสินค้า OEM อ้างอิงจาก Proforma Invoice (PI)"
                    sections={[
                        {
                            id: "1",
                            title: "การเชื่อมโยงข้อมูล (PI to PO)",
                            icon: "FileCheck",
                            description: "โรงงานหรือแผนกผลิตจะได้รับรายการสั่งผลิต (PO) โดยอ้างอิงจากแบบร่าง PI ที่ผ่านการจ่ายมัดจำแล้ว",
                            bullets: [
                                { icon: "ArrowRight", iconColor: "#1d6c8b", title: "Reference PI", text: "ลดการคีย์ซ้ำซ้อนโดยดึงรหัสสินค้า, จำนวนสั่ง, และเวลาที่ต้องการจาก PI โดยตรง" }
                            ]
                        },
                        {
                            id: "2",
                            title: "ตรวจสอบสถานะวัตถุดิบ (Material Status)",
                            icon: "Package",
                            description: "แสดงผลวัตถุดิบที่ต้องใช้ผลิต เพื่อให้รู้ว่าควรเริ่มกระบวนการจัดหาหรือไม่",
                            bullets: [
                                { icon: "AlertCircle", iconColor: "#d9534f", title: "Out of Stock", text: "ไฮไลท์สีแดง หากสินค้าคงคลังมีไม่เพียงพอต่อยอดที่ต้องผลิต" }
                            ]
                        },
                        {
                            id: "3",
                            title: "กระบวนการอนุมัติ (Approval Chain)",
                            icon: "CheckCircle2",
                            bullets: [
                                { icon: "Clock", iconColor: "#f0ad4e", title: "Pending", text: "รอแผนก Production ตรวจสอบ Resource ว่าพร้อมผลิตหรือไม่" },
                                { icon: "CheckCircle2", iconColor: "#5cb85c", title: "Approved", text: "เริ่มเปิดไลน์ผลิตได้ทันที" }
                            ]
                        }
                    ]} 
                />

                {/* HEADER SECTION */}
                <div className="px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
                    <div className="flex items-center gap-5">
                        <div className="relative flex items-center justify-center group cursor-default shrink-0">
                            <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                            <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                                <Factory size={28} strokeWidth={2.5} className="text-[#f47729]" />
                            </div>
                        </div>
                        <div>
                            <h1 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                                FACTORY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">PO</span>
                            </h1>
                            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                                ORIGINAL EQUIPMENT MANUFACTURER ORDERS
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)} 
                            className="px-4 py-2 font-mono rounded-lg border border-[#adb2b0]/40 text-[12px] font-bold text-[#2e3118] bg-white/50 backdrop-blur-md outline-none focus:border-[#af7a2b] shadow-sm uppercase tracking-widest h-[42px]"
                        >
                            {Object.keys(EXCHANGE_RATES).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <input type="month" className="px-4 py-2 font-mono rounded-lg border border-[#adb2b0]/40 text-[12px] font-bold text-[#2e3118] bg-white/50 backdrop-blur-md outline-none focus:border-[#af7a2b] shadow-sm uppercase tracking-widest h-[42px]" />
                        <div className="bg-white/50 backdrop-blur-md p-1 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                            <button onClick={() => { setActiveTab('list'); setCurrentPage(1); }} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-[#2e3118] text-[#f47729] shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                                <List size={16} /> LIST VIEW
                            </button>
                            <button onClick={() => { setActiveTab('kanban'); setCurrentPage(1); }} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'kanban' ? 'bg-[#2e3118] text-[#f47729] shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                                <LayoutGrid size={16} /> KANBAN BOARD
                            </button>
                            <button onClick={() => setShowAICopilot(true)} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${showAICopilot ? 'bg-[#111f42] text-white shadow-md' : 'text-[#8c7361] hover:text-[#111f42]'}`}>
                                <Zap size={16} className={showAICopilot ? 'text-amber-400' : 'text-[#f47729]'} /> AI ANALYSIS
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-8 mt-2">
                    <FactoryPOChart items={items} currency={currency} rate={EXCHANGE_RATES[currency]} />
                </div>

                <div className="px-8 pb-6">
                    <div className="bg-white rounded-[24px] border border-[#d2af94]/30 shadow-xl overflow-hidden relative flex flex-col min-h-[700px]">
                        
                        {/* TOOLBAR */}
                        <div className="px-8 py-4 border-b border-[#adb2b0]/30 bg-[#F0EAE1]/30 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            {/* Controls */}
                            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                                <div className="relative group min-w-[200px]">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ListFilter size={14} className="text-[#8c7361] group-hover:text-[#f47729] transition-colors" />
                                    </div>
                                    <select 
                                        className="w-full pl-9 pr-8 py-2 border border-[#adb2b0]/40 rounded-xl text-[11px] font-black focus:outline-none focus:border-[#af7a2b] bg-white shadow-sm text-[#2e3118] h-[40px] transition-all appearance-none cursor-pointer uppercase tracking-widest"
                                        value={activeStatus}
                                        onChange={(e) => setActiveStatus(e.target.value)}
                                    >
                                        <option value="All">STS: ALL ({items.length})</option>
                                        {kanbanColumns.map(s => <option key={s} value={s}>STS: {s.toUpperCase()} ({items.filter(i => i.status === s).length})</option>)}
                                    </select>
                                    <ChevronDownCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7361] pointer-events-none" />
                                </div>

                                <div className="relative flex-1 md:min-w-[400px]">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                                    <input 
                                        type="text" 
                                        placeholder="Search PO, PI, Product, Brand..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2 border border-[#adb2b0]/40 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#af7a2b] bg-white shadow-sm text-[#2e3118] h-[40px] transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 ml-auto xl:ml-0">
                                {selectedPOs.length > 0 && (
                                    <button 
                                        onClick={handleDownloadSelected}
                                        className="bg-[#214573] hover:bg-[#091d38] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#214573] h-[40px]"
                                    >
                                        <Download size={18} /> BATCH DOWNLOAD ({selectedPOs.length})
                                    </button>
                                )}
                                <DataExport
                                    data={filteredData}
                                    columns={[
                                        { key: 'poNo', label: 'Factory PO No' },
                                        { key: 'piNo', label: 'Linked PI' },
                                        { key: 'poDate', label: 'PO Date' },
                                        { key: 'factory', label: 'Factory' },
                                        { key: 'status', label: 'Status' }
                                    ]}
                                    filename="Factory_POs"
                                />
                                <button 
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-[#f47729] hover:bg-[#ad7332] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#f47729] h-[40px]"
                                >
                                    <Plus size={18} /> NEW FACTORY PO
                                </button>
                            </div>
                        </div>

                        {activeTab === 'list' ? (
                            <>
                                {/* Table View */}
                                <div className="custom-scrollbar overflow-x-auto flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#091d38] text-white text-[10px] uppercase tracking-widest font-black">
                                <th className="px-6 py-4 w-12">
                                                    <input 
                                                        type="checkbox" 
                                                        className="w-4 h-4 accent-[#af7a2b] rounded-sm cursor-pointer"
                                                        checked={selectedPOs.length === paginatedData.length && paginatedData.length > 0}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedPOs(paginatedData.map(i => i.id));
                                                            else setSelectedPOs([]);
                                                        }}
                                                    />
                                                </th>
                                                <th className="px-6 py-4">PO / PI REF</th>
                                                <th className="px-6 py-4">PRODUCT DETAILS</th>
                                                <th className="px-6 py-4 text-center">QUANTITY</th>
                                                <th className="px-6 py-4">PACKING</th>
                                                <th className="px-6 py-4 text-center">APPROVER</th>
                                                <th className="px-6 py-4 text-center">TOTAL VALUE</th>
                                                <th className="px-6 py-4 text-center">STATUS</th>
                                                <th className="px-6 py-4 text-right">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[12px] text-[#53483e] font-medium divide-y divide-[#adb2b0]/20">
                                            {paginatedData.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-[#F0EAE1]/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <input 
                                                            type="checkbox" 
                                                            className="w-4 h-4 accent-[#af7a2b] rounded-sm cursor-pointer"
                                                            checked={selectedPOs.includes(item.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) setSelectedPOs([...selectedPOs, item.id]);
                                                                else setSelectedPOs(selectedPOs.filter(v => v !== item.id));
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="font-mono font-bold text-[#af7a2b] bg-[#af7a2b]/10 px-2 py-1 rounded inline-block mb-1">{item.id}</div>
                                                        <div className="text-[11px] text-[#a27175] flex items-center gap-1"><FileText size={12}/> {item.refPI}</div>
                                                        <div className="text-[10px] text-[#adb2b0] mt-1">{item.issueDate}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-[#2e3118] text-[13px]">{item.product}</div>
                                                        {item.items && item.items.length > 0 ? (
                                                            <div className="text-[11px] text-[#214573] mt-1 p-1 bg-blue-50 border border-blue-200 rounded font-bold inline-block">
                                                                Contains {item.items.length} inner items
                                                            </div>
                                                        ) : (
                                                            <div className="text-[11px] text-[#8c7361] mt-1 space-y-0.5">
                                                                <div><span className="font-bold">Brand:</span> {item.brand}</div>
                                                                <div><span className="font-bold">Contain/Packed:</span> {item.containWeight} / {item.packedWeight}</div>
                                                                <div><span className="font-bold">Barcode:</span> <span className="font-mono">{item.barcode}</span></div>
                                                            </div>
                                                        )}
                                                        {item.note && <div className="text-[#af7a2b] italic mt-1 text-[10px]">Note: {item.note}</div>}
                                                    </td>
                                                    <td className="px-6 py-4 text-center align-top">
                                                        <span className="font-mono font-bold text-[#214573] text-[14px]">
                                                            {item.quantity.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-[12px]"><span className="font-bold">Packing:</span> {item.packingCarton}</div>
                                                        <div className="text-[12px]"><span className="font-bold">EXP:</span> {item.expiryDate}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center align-top">
                                                        <div className="text-[11px] font-bold text-[#2e3118]">{item.approver}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center align-top whitespace-nowrap">
                                                        <div className="font-mono font-bold text-[#ad7332] text-[12px]">{formatCurrency(item.totalValue || 0, currency)}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center align-top">
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right align-top">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={(e) => { e.stopPropagation(); setPrintPOs([item]); setShowPreviewPrint(true); }} className="w-8 h-8 rounded-lg border border-[#d2af94] flex items-center justify-center text-[#8c7361] hover:text-[#214573] hover:bg-[#214573]/10 transition-colors bg-white shadow-sm"><Printer size={14} /></button>
                                                            <button onClick={(e) => { e.stopPropagation(); setViewDetailsPO(item); }} className="w-8 h-8 rounded-lg border border-[#214573] flex items-center justify-center text-[#214573] hover:text-white hover:bg-[#214573] transition-colors bg-white shadow-sm"><List size={14} /></button>
                                                            <button className="w-8 h-8 rounded-lg border border-[#d2af94] flex items-center justify-center text-[#8c7361] hover:text-[#af7a2b] hover:bg-[#af7a2b]/10 transition-colors bg-white shadow-sm"><Pencil size={14} /></button>
                                                            <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors bg-white shadow-sm"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {paginatedData.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-20 text-center font-mono text-[#8c7361] bg-[#F0EAE1]/20">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <AlertTriangle size={32} className="mb-2 text-[#d2af94]" />
                                                            <p>NO FACTORY PO FOUND</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 0 && (
                                  <div className="px-8 py-3 bg-[#F0EAE1]/80 border-t-[1.5px] border-[#adb2b0]/50 flex flex-col md:flex-row justify-between items-center font-bold text-[#53483e] uppercase tracking-widest shrink-0 font-mono text-[11px] z-20">
                                      <div className="flex items-center gap-6">
                                          <div className="flex items-center gap-3">
                                              <span>SHOW:</span>
                                              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#d2af94] rounded-xl px-3 py-1.5 outline-none focus:border-[#af7a2b] text-[#2e3118] cursor-pointer shadow-sm">
                                                  {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                              </select>
                                          </div>
                                          <div className="bg-white px-4 py-1.5 rounded-xl border border-[#d2af94] shadow-sm text-[#2e3118]">TOTAL {filteredData.length} ORDERS</div>
                                      </div>
                                      <div className="flex items-center gap-3 mt-4 md:mt-0">
                                          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] shadow-sm active:scale-90'}`}><ChevronLeft size={16}/></button>
                                          <div className="bg-white border border-[#d2af94] px-6 h-9 flex items-center justify-center rounded-xl shadow-sm text-[#2e3118] font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} / {totalPages}</div>
                                          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] shadow-sm active:scale-90'}`}><ChevronRight size={16}/></button>
                                      </div>
                                  </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 p-6 overflow-x-auto bg-[#F0EAE1]/10 custom-scrollbar">
                                <div className="flex gap-6 min-w-max h-full pb-4">
                                    {kanbanColumns.map(col => {
                                        const colItems = filteredData.filter(i => i.status.toUpperCase() === col.toUpperCase());
                                        return (
                                            <div key={col} className="w-[320px] bg-[#F0EAE1]/50 border border-[#d2af94]/30 rounded-2xl flex flex-col shrink-0 overflow-hidden shadow-inner">
                                                <div className="px-4 py-3 bg-[#e2d1c3]/50 border-b border-[#d2af94]/30 flex justify-between items-center shrink-0">
                                                    <h3 className="text-[12px] font-black text-[#091d38] uppercase tracking-widest">{col}</h3>
                                                    <span className="bg-white/60 text-[#8c7361] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#d2af94]/50">{colItems.length}</span>
                                                </div>
                                                <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-3">
                                                    {colItems.map(item => (
                                                        <div key={item.id} onClick={() => handleNextStep(item.id, item.status)} className="bg-white border border-[#d2af94]/50 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-[#af7a2b]/50 transition-all cursor-pointer relative group">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className="font-mono font-bold text-[#af7a2b] bg-[#af7a2b]/10 px-1.5 py-0.5 rounded text-[10px]">{item.id}</span>
                                                                <span className="text-[10px] text-[#a27175] flex items-center gap-1"><FileText size={10}/> {item.refPI}</span>
                                                            </div>
                                                            <h4 className="font-bold text-[#2e3118] text-[12px] mb-1 line-clamp-1 pr-12">{item.product}</h4>
                                                            <div className="text-[10px] text-[#8c7361] mb-2 font-black tracking-wider uppercase">{item.brand}</div>
                                                            <div className="font-mono text-[#ad7332] font-bold text-[11px] mb-2">{formatCurrency(item.totalValue || 0, currency)}</div>
                                                            
                                                            <div className="flex justify-between items-end border-t border-slate-100 pt-2 mt-2">
                                                                <div className="text-[10px]">
                                                                    <div className="text-[#adb2b0]">QTY</div>
                                                                    <div className="font-mono font-bold text-[#214573]">{item.quantity.toLocaleString()}</div>
                                                                </div>
                                                                <div className="text-[10px] text-right">
                                                                    <div className="text-[#adb2b0]">APPROVER</div>
                                                                    <div className="font-bold text-[#606934]">{item.approver}</div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={(e) => { e.stopPropagation(); setPrintPOs([item]); setShowPreviewPrint(true); }} className="w-7 h-7 bg-white shadow-sm border border-[#d2af94]/50 rounded flex items-center justify-center text-[#8c7361] hover:text-[#f47729] hover:border-[#f47729]/50 transition-colors"><Printer size={12} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); setViewDetailsPO(item); }} className="w-7 h-7 bg-white shadow-sm border border-[#d2af94]/50 rounded flex items-center justify-center text-[#8c7361] hover:text-[#f47729] hover:border-[#f47729]/50 transition-colors"><List size={12} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); }} className="w-7 h-7 bg-white shadow-sm border border-[#d2af94]/50 rounded flex items-center justify-center text-[#8c7361] hover:text-[#f47729] hover:border-[#f47729]/50 transition-colors"><Pencil size={12} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="w-7 h-7 bg-white shadow-sm border border-red-200 rounded flex items-center justify-center text-red-400 hover:text-red-500 hover:border-red-400 transition-colors"><Trash2 size={12} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FactoryPOCopilot 
                isOpen={showAICopilot} 
                onClose={() => setShowAICopilot(false)} 
                items={items} 
            />

            {/* Extracted Create Factory PO Modal */}
            <CreateFactoryPOModal 
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleSavePO}
                uniquePIs={uniquePIs}
            />

            {/* View Details Tracker Modal */}
            {viewDetailsPO && (
                <DraggableModal isOpen={!!viewDetailsPO} onClose={() => setViewDetailsPO(null)} title={`FACTORY PO STATUS: ${viewDetailsPO.id}`} width="max-w-[800px]">
                    <div className="p-8 bg-slate-50/50 flex flex-col gap-8 custom-scrollbar max-h-[80vh] overflow-y-auto">
                        <div className="bg-white border-2 border-[#e2d1c3] rounded-2xl shadow-sm p-8">
                            <h3 className="text-[12px] font-black text-[#091d38] uppercase tracking-widest mb-6 pb-2 border-b-2 border-slate-100 flex items-center gap-2">
                                <Zap size={15} className="text-[#f47729]" />
                                ORDER LIFECYCLE PROGRESS
                            </h3>
                            <FactoryPOStatusTracker status={viewDetailsPO.status} />
                        </div>

                        <div className="bg-white border-2 border-[#e2d1c3] rounded-2xl shadow-sm overflow-hidden flex">
                            <div className="p-6 bg-[#091d38] text-white flex flex-col justify-center items-center gap-3 w-[200px] shrink-0 border-r border-[#e2d1c3]">
                                <Factory size={40} className="text-[#f47729] opacity-80" />
                                <div className="text-center">
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">REFERENCE</p>
                                    <p className="text-[#f47729] font-mono font-black text-[18px]">{viewDetailsPO.id}</p>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">PI REF</p>
                                    <p className="text-white font-mono font-bold text-[14px]">{viewDetailsPO.refPI}</p>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 grid grid-cols-2 gap-6 bg-slate-50/20">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-1">PRODUCT TARGET</p>
                                    <p className="font-bold text-[#2e3118] text-[15px]">{viewDetailsPO.product}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-1">BRAND</p>
                                    <p className="font-bold text-[#091d38] uppercase text-[15px]">{viewDetailsPO.brand}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-1">TOTAL QUANTITY</p>
                                    <p className="font-black text-[#f47729] font-mono text-[20px]">{viewDetailsPO.quantity?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-1">PI VALUE</p>
                                    <p className="font-black text-[#ad7332] font-mono text-[20px]">{formatCurrency(viewDetailsPO.totalValue || 0, currency)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-1">REMARKS</p>
                                    <p className="font-bold text-[#4d5a44] italic p-3 bg-orange-50/50 border border-orange-100 rounded-lg">{viewDetailsPO.note || 'No specific remarks.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 py-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                        <button onClick={() => setViewDetailsPO(null)} className="px-6 py-2.5 bg-[#F0EAE1]/50 border border-[#adb2b0]/30 text-[#53483e] rounded-xl font-black text-[10.5px] uppercase tracking-widest hover:bg-[#F0EAE1] transition-all">Close</button>
                        <button onClick={() => { setPrintPOs([viewDetailsPO]); setShowPreviewPrint(true); }} className="px-6 py-2.5 bg-[#214573] hover:bg-[#091d38] text-white border border-[#214573] rounded-xl font-black text-[10.5px] uppercase tracking-widest transition-all flex items-center gap-2">
                            <Printer size={15}/> Print Document
                        </button>
                    </div>
                </DraggableModal>
            )}

            {/* Print Template Container for jsPDF creation (always hidden, only used for capture) */}
            <div className="absolute left-[-9999px] top-[-9999px]">
                {printPOs.map(po => (
                    <div key={po.id} id={`factory-po-print-preview-${po.id}`} className="min-w-[210mm] min-h-[297mm] bg-white relative">
                        <FactoryPOPrintTemplate po={po} isPreview={true} />
                    </div>
                ))}
            </div>

            {/* PDF Preview Modal */}
            {showPreviewPrint && printPOs.length > 0 && (
                <DraggableModal isOpen={showPreviewPrint} onClose={() => setShowPreviewPrint(false)} title={`FACTORY PO - PREVIEW (${printPOs.length} ${printPOs.length > 1 ? 'DOCS' : 'DOC'})`} width="max-w-[75vw]">
                    <div className="bg-slate-300/50 p-6 sm:p-10 h-[70vh] overflow-y-auto flex flex-col items-center gap-10 custom-scrollbar">
                        {printPOs.map((po, idx) => (
                           <div key={po.id} className="bg-white shadow-xl min-w-[210mm] min-h-[297mm] shrink-0 relative flex flex-col justify-center border border-slate-200">
                               <div className="absolute -top-6 text-slate-500 font-mono text-[10px] font-bold">Document {idx + 1} of {printPOs.length} : {po.id}</div>
                               <FactoryPOPrintTemplate po={po} isPreview={true} />
                           </div>
                        ))}
                    </div>
                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 font-mono w-full print:hidden">
                        <button onClick={() => setShowPreviewPrint(false)} className="px-6 py-2.5 bg-[#F0EAE1]/50 border border-[#adb2b0]/30 text-[#53483e] rounded-xl font-bold text-[10.5px] uppercase tracking-widest hover:bg-[#F0EAE1] transition-all">Close Preview</button>
                        <button 
                            onClick={handleDownloadPDF} 
                            disabled={isDownloading}
                            className={`px-6 py-2.5 rounded-xl font-bold text-[10.5px] uppercase tracking-widest transition-all flex items-center gap-2 ${isDownloading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-800 border border-slate-900 text-white hover:bg-slate-700'}`}
                        >
                            <Download size={15}/> {isDownloading ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}
                        </button>
                        <button onClick={() => { setTimeout(() => window.print(), 100); }} className="px-6 py-2.5 bg-emerald-600 border border-emerald-700 text-white rounded-xl font-bold text-[10.5px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"><Printer size={15}/> Print Document</button>
                    </div>
                </DraggableModal>
            )}
        </>
    );
}

