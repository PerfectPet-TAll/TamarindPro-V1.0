import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, FileText, Database, CheckCircle2, Package, Coins, Clock, RefreshCw, 
  Plus, X, ChevronLeft, ChevronRight, Pencil, Trash2, HelpCircle, Save, 
  BookOpen, Layers, Factory, ShieldCheck, FileCheck, DollarSign, Truck, 
  Anchor, MapPin, Globe, CreditCard, UserCheck, AlertCircle, Barcode,
  Hash, Calendar, Filter, ListFilter, LayoutGrid, List, Zap, Info, MoreHorizontal,
  Tag, Beaker, Weight, Ship, Target, MessageSquare, History, ShoppingCart, Container, PlusCircle
} from 'lucide-react';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { SaleOrderPIModal } from './components/SaleOrderPIModal';

// --- Theme Configuration (Premium Vivid Palette) ---
const THEME = {
    bgMain: '#EAF2EA', 
    bgGradient: 'radial-gradient(130% 100% at 50% 0%, #EAF2EA 0%, #F0EAE1 40%, #E2D1C3 75%, #C2A895 100%)',
    sidebarBg: 'linear-gradient(180deg, #1f2a44 0%, #202024 100%)', 
    primary: '#f47729', 
    primaryDark: '#ad7332',
    accent: '#af7a2b', 
    textMain: '#2e3118', 
    textMuted: '#53483e', 
    textSubtle: '#8c7361', 
    cardBg: '#FFFFFF',
    success: '#606934',
    palette: {
      gold: '#af7a2b', navyDeep: '#091d38', navy: '#214573', orangeBright: '#f47729', 
      olive: '#606934', blueMuted: '#5167a2', darkOlive: '#2e3118', warmGray: '#53483e', 
      warmBrown: '#93644b', sageTeal: '#7c9d9c', deepTeal: '#426a77', earthyBrown: '#836350', 
      lightAqua: '#5da7b3', slateBlue: '#627680', dustyRose: '#bf8f7e', darkKhaki: '#5e4b2b', 
      bronze: '#ad7332', silver: '#adb2b0', taupe: '#8c7361', lightTan: '#d2af94'
    }
};

// --- Synced Constants ---
const SYNC_CUSTOMERS = ['Global Foods Trading', 'Pacific Mart', 'CP All Public Co.', 'Makro Thailand', 'Siam Export Co.'];
const SYNC_CONSIGNEES = [
  { name: 'SERVENDI LDA', address: 'SAME AS ABOVE', notify: 'SAME AS ABOVE' },
  { name: 'TARIQ TRADERS', address: 'GOOD LUCK TRADING\nOFFICE NO.1, VENUS PLAZA, LAHORE', notify: 'AL MOIZ FOODSTUFF TRADING FZCO, DUBAI SILICON OASIS' }
];
const SYNC_INCOTERMS = ['FOB', 'CIF', 'CFR', 'EX-WORK'];
const SYNC_DOWN_PAYMENTS = ['100%', '70%', '50%', '30%', '20%', '0%'];
const SYNC_PORTS = ['Bangkok, Thailand', 'Chittagong, Bangladesh', 'Rotterdam, Netherlands', 'Los Angeles, U.S.A.'];
const SYNC_CONTAINER_SIZES = ["20' DRY", "20' Refrigerated", "40'HC DRY", "40'HQ Refrigerated"];
const SYNC_BRANDS = ['NATCHA', 'KING', 'ตราม้า', 'วังเดิม', 'NO BRAND'];

const MASTER_PRODUCTS = [
    { id: 'TM-001', name: 'มะขามหวานสีทอง (Sweet Tamarind)', pack: '1kg x 12 Boxes', code: 'ST-001' },
    { id: 'TM-002', name: 'มะขามแปรรูปไร้เมล็ด (Seedless Paste)', pack: '500g x 24 Bags', code: 'SP-002' }
];

const INITIAL_PI_LIST = [
  { id: 1, piId: 'PI2026-0001', date: '2026-05-04', buyer: 'Global Foods Trading', amount: 12500, status: 'Active' }
];

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;800;900&display=swap');
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  span, input, td, th, div, p, select, textarea, button, h1, h2, h3, h4, h5, h6, label, modal, pdf { 
    font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; 
  }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #adb2b0; border-radius: 10px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

// --- Components ---

const KpiCard = ({ icon: IconComp, value, label, colorAccent, colorValue, desc, isCurrency = false }: any) => (
    <div className="bg-white px-6 py-6 rounded-[24px] border border-[#d2af94]/30 shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#af7a2b]/50 hover:shadow-md transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn cursor-default">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 duration-700 pointer-events-none">
            {IconComp && <IconComp size={110} color={colorAccent} />}
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest font-mono">{label}</p>
            <div className={`w-10 h-10 rounded-[14px] border flex items-center justify-center shrink-0 shadow-sm transition-all`} style={{backgroundColor: `${colorAccent}10`, borderColor: `${colorAccent}20`, color: colorAccent}}>
                {IconComp && <IconComp size={20} />}
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between font-mono">
            <p className="text-[28px] font-black leading-none" style={{color: colorValue}}>
                {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
            </p>
            <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: colorAccent}}></span> {desc}
            </span>
        </div>
    </div>
);

// Inline UserGuidePanel removed to use shared module

// --- PI Modal has been extracted to components/SaleOrderPIModal.tsx ---

// --- Main Page ---
export default function SaleOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [items, setItems] = useState<any[]>(INITIAL_PI_LIST);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return items.filter(i => i.piId.toLowerCase().includes(searchTerm.toLowerCase()) || i.buyer.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, searchTerm]);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handleSave = (newItem: any) => {
    const exists = items.find(i => i.id === newItem.id);
    if (exists) setItems(items.map(i => i.id === newItem.id ? newItem : i));
    else setItems([newItem, ...items]);
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditItem(null);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[150px] bg-white border border-[#d2af94]/50 border-r-0 text-[#214573] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#214573] hover:text-[#f47729] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group no-print font-mono">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#af7a2b] group-hover:text-[#f47729]" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px] font-mono">USER GUIDE</span>
      </button>
      <UserGuidePanel 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)}
          title="SALES ORDER (SO)"
          desc="ระบบนำเข้าใบสั่งซื้อและการอนุมัติเข้าสู่กระบวนการผลิต"
          sections={[
              {
                  id: "1",
                  title: "การแปลง PI ให้เป็น SO (SO Conversion)",
                  icon: "FileCheck",
                  description: "เอกสารจะอ้างอิงจากแบบร่าง Proforma Invoice (PI) ที่ได้รับการคอนเฟิร์มและรับชำระเงินมัดจำล่วงหน้าแล้ว",
                  bullets: [
                      { icon: "ArrowRight", iconColor: "#606934", title: "สร้าง SO ใหม่", text: "กรอกข้อมูลลูกค้า วันกำหนดส่งสินค้า หรือเชื่อมข้อมูลจาก PI ที่มีอยู่" }
                  ]
              },
              {
                  id: "2",
                  title: "โครงสร้างและข้อมูลทางการขาย (Sales Data)",
                  icon: "ListDetails",
                  description: "ตรวจสอบช่องทางการจำหน่าย พนักงานที่รับผิดชอบ และนโยบายทางการเงิน",
                  bullets: [
                      { icon: "Truck", title: "Delivery & Notes", text: "ลงข้อกำหนดการจัดส่งและหมายเหตุที่สำคัญต่อการผลิต และวันที่คาดหวังให้เสร็จ (Delivery Date)" }
                  ]
              },
              {
                  id: "3",
                  title: "ระบบการอนุมัติใบสั่งซื้อ (Approval Process)",
                  icon: "Activity",
                  description: "เมื่อกรอกข้อมูลเสร็จ พนักงานสามารถกดบันทึกเพื่อเข้าสู่ Flow อนุมัติ",
                  bullets: [
                      { icon: "Clock", iconColor: "#af7a2b", title: "Pending", text: "กำลังรอผู้อนุมัติทำการตรวจสอบความถูกต้อง ก่อนคอนเฟิร์มออร์เดอร์เข้าระบบ ERP หลัก" },
                      { icon: "CheckCircle2", iconColor: "#606934", title: "Approved", text: "อนุมัติเรียบร้อย และสั่งให้ฝ่ายผลิตเตรียมวัตถุดิบและโหลดบรรจุได้ทันที" }
                  ]
              }
          ]} 
      />

      <header className="px-4 sm:px-8 flex pt-3 pb-5 items-center justify-between z-20 shrink-0 bg-transparent">
          <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-[#f47729] border border-[#d2af94] shadow-sm relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f47729]/10 to-transparent"></div>
                  <FileText size={24} className="relative z-10" />
              </div>
              <div className="flex flex-col">
                  <h3 className="font-inter font-black text-[#2e3118] uppercase tracking-widest text-[24px] flex items-center gap-2 leading-none">
                      PROFORMA <span className="text-[#f47729]">INVOICE</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-8 h-[2px] bg-[#af7a2b]"></div>
                      <p className="text-[11px] font-medium text-[#53483e] uppercase tracking-[0.3em] leading-none font-mono">GLOBAL EXPORT REPOSITORY NODE</p>
                  </div>
              </div>
          </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 mt-2 pb-6 overflow-y-auto custom-scrollbar animate-fadeIn font-mono">
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                <KpiCard label="Registry Documents" value={items.length} icon={Database} colorAccent={THEME.palette.blueMuted} colorValue={THEME.textMain} desc="Active Registry" />
                <KpiCard label="Portfolio Value" value={items.reduce((s,i)=>s+i.amount,0)} icon={Coins} colorAccent={THEME.palette.gold} colorValue={THEME.textMain} desc="USD Portfolio" isCurrency />
                <KpiCard label="Pending Approval" value={1} icon={Clock} colorAccent={THEME.palette.orangeBright} colorValue={THEME.textMain} desc="Awaiting Node" />
                <KpiCard label="System Status" value="SYNC" icon={RefreshCw} colorAccent={THEME.palette.gold} colorValue={THEME.palette.gold} desc="Live Data" />
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-[#d2af94]/30 overflow-hidden flex flex-col min-h-[650px]">
                <div className="px-8 py-4 border-b border-[#adb2b0]/30 bg-[#F0EAE1]/20 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                    <div className="flex items-center gap-4 flex-1 w-full md:w-auto font-mono">
                        <div className="relative w-full md:w-96 border border-[#adb2b0]/40 rounded-xl bg-white focus-within:border-[#af7a2b] transition-all shadow-inner overflow-hidden">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                            <input type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search Proforma Invoice ID..." className="w-full pl-11 pr-4 h-[44px] text-[12px] font-black outline-none bg-transparent uppercase" />
                        </div>
                    </div>
                    <button onClick={handleAddNew} className="px-8 h-[44px] bg-[#f47729] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-[0_4px_15px_rgba(244,119,41,0.2)] hover:bg-[#ad7332] active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#f47729] shrink-0 font-mono">
                        <Plus size={18} /> NEW PI DOCUMENT
                    </button>
                </div>

                <div className="flex-1 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left font-sans border-collapse min-w-[900px]">
                        <thead className="bg-[#091d38] text-white sticky top-0 z-10 font-mono text-[11px] tracking-widest uppercase font-black">
                            <tr>
                                <th className="py-4 px-8 border-b-2 border-[#f47729]">PROFORMA INVOICE ID</th>
                                <th className="py-4 px-6 border-b-2 border-[#f47729]">BUYER IDENTITY</th>
                                <th className="py-4 px-6 text-center border-b-2 border-[#f47729]">DATE</th>
                                <th className="py-4 px-6 text-center border-b-2 border-[#f47729]">VALUE</th>
                                <th className="py-4 px-6 text-center border-b-2 border-[#f47729]">STATUS</th>
                                <th className="py-4 px-6 pr-8 text-center border-b-2 border-[#f47729]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 divide-y divide-[#d2af94]/30 font-mono text-[12px] h-[60px]">
                            {paginatedData.map(pi => (
                                <tr key={pi.id} className="hover:bg-[#EAF2EA]/50 transition-colors group">
                                    <td className="py-2.5 px-8 font-black text-[#2e3118] uppercase align-middle">{pi.piId}</td>
                                    <td className="py-2.5 px-6 font-black text-[#606934] uppercase align-middle">{pi.buyer}</td>
                                    <td className="py-2.5 px-6 text-center font-bold text-[#53483e] uppercase align-middle">{pi.date}</td>
                                    <td className="py-2.5 px-6 text-center font-black text-[#f47729] font-mono align-middle">\${pi.amount.toLocaleString()}</td>
                                    <td className="py-2.5 px-6 text-center align-middle">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${pi.status==='Approved' ? 'bg-[#EAF2EA] text-[#606934] border-[#606934]/30' : 'bg-[#af7a2b]/10 text-[#af7a2b] border-[#af7a2b]/30'}`}>{pi.status}</span>
                                    </td>
                                    <td className="py-2.5 px-6 pr-8 text-center align-middle">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => handleEdit(pi)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#5167a2]/20 text-[#5167a2] bg-white hover:bg-[#5167a2]/10 transition-colors shadow-sm"><Pencil size={14} /></button>
                                            <button onClick={() => setItems(items.filter(i=>i.id !== pi.id))} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ad7332]/20 text-[#ad7332] bg-[#F0EAE1]/50 hover:bg-[#ad7332]/10 transition-colors shadow-sm"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
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

                <div className="px-8 py-3 bg-[#F0EAE1]/80 border-t-[1.5px] border-[#adb2b0]/50 flex justify-between items-center font-mono shrink-0">
                    <div className="flex items-center gap-6 text-[11px] font-black text-[#53483e] uppercase tracking-widest">
                        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border border-[#d2af94] rounded-xl px-2 py-1 outline-none font-black text-[#2e3118] cursor-pointer shadow-sm">
                            {[10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <span className="bg-white px-3 py-1 rounded-lg border border-[#d2af94] shadow-sm">Total Records: {filteredData.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={()=>setCurrentPage(p=>Math.max(1, p-1))} disabled={currentPage===1} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 active:scale-95'}`}><ChevronLeft size={16}/></button>
                        <div className="bg-white border border-[#d2af94] px-6 h-9 flex items-center justify-center rounded-xl text-slate-800 text-[10.5px] font-black uppercase min-w-[120px] shadow-sm text-center">Page {currentPage} / {totalPages}</div>
                        <button onClick={()=>setCurrentPage(p=>Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 active:scale-95'}`}><ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <SaleOrderPIModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} data={editItem} />
    </div>
  );
}
