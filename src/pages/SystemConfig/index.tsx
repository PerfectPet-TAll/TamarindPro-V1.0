import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { 
  Settings2, 
  Building2, 
  Layers, 
  Tag, 
  Users, 
  Printer, 
  Barcode, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Database, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Award, 
  Zap, 
  Globe, 
  Bell, 
  LogOut, 
  ChevronDown, 
  Check,
  LayoutGrid,
  FileText,
  Handshake,
  ShieldCheck,
  Key
} from 'lucide-react';
import * as Icons from 'lucide-react';

// --- Theme Configuration (Synced with Home Palette) ---
const THEME = {
    bgGradient: 'radial-gradient(circle, #EAF2EA, #F0EAE1, #E2D1C3, #C2A895)',
    sidebarBg: 'linear-gradient(to bottom, #1f2a44, #202024)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#f47729',
    primaryDark: '#ad7332',
    accent: '#af7a2b',
    textMain: '#2e3118',
    textMuted: '#53483e',
    textSubtle: '#8c7361',
    cardBg: '#FFFFFF',
    gold: '#af7a2b',
    navyDeep: '#091d38',
    navy: '#426a77',
    orangeBright: '#f47729',
    olive: '#606934',
    blueMuted: '#5167a2',
    darkOlive: '#2e3118',
    warmGray: '#53483e',
    warmBrown: '#93644b',
    sageTeal: '#7c9d9c',
    deepTeal: '#426a77',
    earthyBrown: '#836350',
    lightAqua: '#5da7b3',
    slateBlue: '#627680',
    dustyRose: '#bf8f7e',
    darkKhaki: '#5e4b2b',
    bronze: '#ad7332',
    silver: '#adb2b0',
    taupe: '#8c7361',
    lightTan: '#d2af94',
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
  
  /* Global Font Hierarchy Enforcement */
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  span, input, td, th, div, p, select, textarea, button, h1, h2, h3, h4, h5, h6, label { 
    font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; 
  }

  /* Custom Scrollbar styled identically to Home */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #adb2b0; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #d2af94; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
`;

// --- Mock Data ---
const INITIAL_DATA = {
  departments: [
    { id: 1, name: 'Management', code: 'MGT' },
    { id: 2, name: 'Human Resources', code: 'HR' },
    { id: 3, name: 'Information Technology', code: 'IT' },
    { id: 4, name: 'Production', code: 'PROD' },
    { id: 5, name: 'Quality Assurance', code: 'QA' },
    { id: 6, name: 'Quality Control', code: 'QC' },
    { id: 7, name: 'Warehouse', code: 'WH' },
  ],
  categories: [
    { id: 1, name: 'FRESH TAMARIND (FT)', subCats: 'SWEET TAMARIND SITHONG, SWEET TAMARIND KUNTI, SWEET TAMARIND MIX, SOUR TAMARIND JUMBO, SOUR TAMARIND STANDARD, SOUR TAMARIND MEDIUM' },
    { id: 2, name: 'Tamarind Balls (TB)', subCats: 'ORIGINAL, FLAVORING, COATING' },
    { id: 3, name: 'Pickle Tamarind (PT)', subCats: 'SYRUP, DRIED' },
    { id: 4, name: 'Tamarind Sauce (TS)', subCats: 'ORIGINAL, FLAVORING' },
    { id: 5, name: 'TAMARIND PASTE (TP)', subCats: 'ORIGINAL, FLAVORING' },
  ],
  brands: [
    'NATCHA', 'KING', 'TAMARIND AROI', 'VRADA', 'RADA', 'TEDDYBEAR', 'ICE', '888', 'BEST', 'TOP QUALITY', 'LUCKY TARO', 'CLOVER', 'PEARL', 'SEALING SEAS', 'REESE', 'ALVITA', "AYOUB'S", 'ALEWANG', 'ASIAN BEST', 'THOPHY', 'SINGLONG', 'SUIMAMA', 'VERITA', 'MUY SABRODSO', 'ตราม้า', 'วังเดิม', 'NO BRAND', "MELISSA'S"
  ].map((name, index) => ({ id: index + 1, name })),
  sellers: [
    {
      id: 1,
      name: 'BANGKOK TAMARIND LTD. PART.',
      address: '124/46 BANG KHUNNON ROAD,BANG KHUNNON SUB-DISTRICT,BANGKOK NOI,BANGKOK 10700 THAILAND',
      contactDesc: 'TEL : 66 2 9817731 - 2,66 2 9817737,Fax : Please Dial 12,E-mail : amy@tamarindkl.com , www.tamarindkl.com',
      companyTh: 'ห้างหุ้นส่วนจำกัด บางกอกมะขามหวาน (สาขา 00001)',
      addressTh: '124/46 ถ.บางขุนนนท์ แขวงบางขุนนนท์ เขตบางกอกน้อย กรุงเทพฯ 10700',
      taxId: '0-1035-40003-65-6',
      bankName: 'THE SIAM COMMERCIAL BANK PUBLIC COMPANY LIMITED',
      branch: 'MUANGTHONG THANI',
      bankAddr: '453 BOND STREET ROAD,BAN MAI, PAK KRET, NONTHABURI 11120,THAILAND',
      accountName: 'BANGKOK TAMARIND LTD., PART.',
      accountNo: '328 245 696 0',
      swiftCode: 'SICOTHBK'
    },
    {
      id: 2,
      name: 'K.L. INTERFOOD CO., LTD.',
      address: '670/63 PHAHONYOTHIN RD, SAMSEANNAI, PHAYATHAI, BANGKOK 10400, THAILAND',
      contactDesc: 'TEL : 66 2 9817731 - 2,66 2 9817737,Fax : Please Dial 12,E-mail : amy@tamarindkl.com, www.tamarindkl.com',
      companyTh: 'บริษัท เค.แอล. อินเตอร์ฟู้ด จำกัด',
      addressTh: '670/63 ถ.พหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
      taxId: '0-1055-43088-41-7',
      bankName: 'THE SIAM COMMERCIAL BANK PUBLIC COMPANY LIMITED',
      branch: 'MUANGTHONG THANI',
      bankAddr: '453 BOND STREET ROAD,BAN MAI, PAK KRET, NONTHABURI 11120,THAILAND',
      accountName: 'K.L. INTERFOOD CO., LTD.',
      accountNo: '328 245705 5',
      swiftCode: 'SICOTHBK'
    }
  ],
  advances: [
    '100%', '70%', '50%', '30%', '20%', '15%', '12.50%', '0%'
  ].map((name, index) => ({ id: index + 1, name })),
  paymentTerms: [
    '100% advance T/T payment within 7 days from issuing date of this PI to confirm order.',
    '100% advance T/T payment within 3 days before loading cargo advance T/T deposit within 7 days from issuing date of this PI and balance for each container T/T payment to be paid before loading. USD ....................... payment to be made by LC at sight irrevocable from a first class bank.',
    '100% T/T payment after loading and we send copy of shipping documents via E-mail but before arrival of cargo.',
    '15% Advance T/T payment after agreement within 7 days from issuing date of this PI. 15% within 3 days after receiving the draft shipping documents by email. Balance 70% T/T payment of this PI to be paid 7 days before arrival.',
    '100% T/T payment after FDA passed',
    '30% advance T/T payment within 7 days from issuing date of this PI and balance 70% T/T payment to be paid within 3 days after receiving copy of Shipping Documents via e-mail.',
    '30% advanced T/T payment of USD ................ within 7 days from issuing date of this proforma invoice to confirm all terms and condition in this contract. USD ................... T/T payment against this PI to be paid within 3 days after receiving copy of shipping documents by e-mail and before arrival of container at destination port. Overpaid USD ..........................',
    '15% advance T/T payment after agreement within 7 days from issuing date of this PI and 45% T/T payment to be paid within 3 days after receiving copy of shipping documents via E-mail. An amount of USD ...................... will be paid by DP at sight through customer\'s bank.',
    '15% advance T/T payment within 7 days from issuing date of this PI and balance 85% T/T payment to be paid within 3  days after receiving copy of shipping documents via E-mail.',
    '50% advance T/T payment within 7 days from issuing date of this PI and balance 50% T/T payment to be paid within 3 days after receiving copy of Shipping Documents via E-mail.',
    '100% TT payment within 20 days after receiving date in the warehouse of buyer’s warehouse and based on released report of container from shipping line. Buyer must pick up container from ETA port as soon as possible to avoid demurrage & detention charge.',
    'TT payment within 21 days after container arrival at port of destination. Buyer must pick up container from eta port as soon as possible to avoid demurrage & detention charge.',
    '100% T/T payment after cargo arrived at destination port',
    '30% advance tt payment after agreement within 7 days from issuing date of this pi to confirm order.\n  50% tt payment of this pi to be paid within 3 days after receiving copy of shipping documents by e-mail.\n  20% tt payment of this pi to be paid upon receiving the container within 7 days.'
  ].map((name, index) => ({ id: index + 1, name })),
  incoterms: [
    'EX-WORK', 'FOB Bangkok port', 'C&F Chittagong Port', 'CFR Chittagong Port', 
    'C&I Rotterdam Port', 'C&F Auckland Port', 'C&F Karachi port', 'CIF Jebel Ali Port', 
    'CIF Los Angeles Port', 'C&F Los Angeles Port', 'Delivery at warehouse in Bangkok location', 
    'CIF Dakar Port', 'C&F Melbourne Port', 'C&F Manila Port', 'CIF Felixstowe Port', 
    'C&I Oslo Port', 'CIF Cat Lai, Ho Chi Minh Port', 'CIF Hai Phong port', 'C&F Sydney Port', 
    'C&F New York Port', 'C&F Bandar Abbas Port', 'C&I Bangkok Port', 'C&F Chattogram', 
    'CIF Atlanta Port', 'C&F Atlanta Port', 'C&I Long Beach Port', 'Nhava Sheva, India'
  ].map((name, index) => ({ id: index + 1, name })),
  destinations: [
    'Bangkok, Thailand', 'Chittagong, Bangladesh', 'Rotterdam, Netherlands', 
    'Auckland, New Zealand', 'Karachi, Pakistan', 'Jebel Ali, U.A.E.', 'Los Angeles, U.S.A.', 
    'Dakar, Senegal', 'Melbourne, Australia', 'Manila, Philippines', 'Felixstowe, U.K.', 
    'Oslo, Norway', 'Cat Lai, Ho Chi Minh, Vietnam', 'Hai Phong', 'Sydney, Australia', 
    'New York, U.S.A.', 'Bandar Abbas, Iran', 'Chattogram, Bangladesh', 'Atlanta, U.S.A.', 
    'Long Beach, U.S.A.', 'Yokohama, Japan', 'Nhava Sheva, India'
  ].map((name, index) => ({ id: index + 1, name })),
  consignees: [
    { id: 1, name: 'SERVENDI LDA', address: 'SAME AS ABOVE', notifyParty: 'SAME AS ABOVE' },
    { 
      id: 2, 
      name: 'TARIQ TRADERS / GOOD LUCK TRADING', 
      address: 'OFFICE NO.1, VENUS PLAZA, 7-E EGERTON ROAD LAHORE NTN NO. D534617-8', 
      notifyParty: 'AL MOIZ FOODSTUFF TRADING FZCO DUBAI SILICON OASIS, P.O. BOX 296360 UNITED ARAB EMIRATES TEL: +971 56 317 7459 EMAIL: ALMOIZ_FOODSTUFF@OUTLOOK.COM' 
    }
  ],
  pdfTemplates: [
    { id: 1, name: 'DAR FORM', dept: 'DC CENTER', code: 'FM-DC01-01', revision: 'REV. 02' },
    { id: 2, name: 'DESTRUCTION REPORT', dept: 'DC CENTER', code: 'FM-DC03-01', revision: 'REV. 01' },
    { id: 3, name: 'DISTRIBUTION REPORT', dept: 'DC CENTER', code: 'FM-DC04-01', revision: 'REV. 01' },
  ],
  idFormats: [
    {
      id: 1,
      pages: ['Plan from Planning', 'Production Planning'],
      prefix: 'PL',
      format: 'YYMMDD',
      sequenceDigit: 3,
      reset: 'Daily',
      note: 'Replacement format: PLYYMMDD/R.1'
    },
    {
      id: 2,
      pages: ['Daily Problem'],
      prefix: 'DF',
      format: 'YYMMDD',
      sequenceDigit: 3,
      reset: 'Daily',
      note: ''
    }
  ]
};

const TABS = [
  { id: 'sellers', label: 'Seller', icon: 'Store', title: 'Sellers', desc: 'Manage Seller details, addresses, and bank accounts.' },
  { id: 'brands', label: 'Brand', icon: 'Tag', title: 'Brands', desc: 'Manage manufacturing and OEM branding.' },
  { id: 'categories', label: 'Category & Sub-Cat', icon: 'Layers', title: 'Categories', desc: 'Manage product classification and groupings.' },
  { id: 'advances', label: '% Advance', icon: 'Percent', title: 'Advance Payments', desc: 'Manage upfront payment percentages.' },
  { id: 'paymentTerms', label: 'PAYMENT TERM', icon: 'CreditCard', title: 'Payment Terms', desc: 'Manage payment conditions.' },
  { id: 'incoterms', label: 'INCOTERM', icon: 'Anchor', title: 'INCOTERMS', desc: 'Manage shipping and incoterm rules.' },
  { id: 'destinations', label: 'Destination', icon: 'MapPin', title: 'Port of Discharge / Destination', desc: 'Manage global ports and destination addresses.' },
  { id: 'consignees', label: 'Consignee', icon: 'UserSquare', title: 'Consignees', desc: 'Manage consignee references and notify parties.' },
  { id: 'departments', label: 'Departments', icon: 'Building2', title: 'Departments Registry', desc: 'Manage organizational units and coding structures.' },
  { id: 'pdfTemplates', label: 'PDF Templates', icon: 'Printer', title: 'PDF FORM TEMPLATES', desc: 'Configure official document layouts and compliance headers.' },
  { id: 'idFormats', label: 'ID Formats', icon: 'Barcode', title: 'ID FORMAT CONFIG', desc: 'Define auto-generation rules for system identifiers.' }
];

const AVAILABLE_PAGES = ['Plan from Planning', 'Production Planning', 'Daily Problem', 'Master Item', 'Equipment Registry', 'STD Process'];

import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

// --- Helper Components ---
const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return null;
    const IconComponent = (Icons[name as keyof typeof Icons] as React.ElementType) || Icons.CircleHelp;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2} />;
};

const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#adb2b0] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#af7a2b] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#8c7361] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={20} />
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between">
            <p className="text-[28px] font-black leading-none text-[#2e3118]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[11px] font-bold text-[#5da7b3] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

// UserGuidePanel inline has been removed

// --- Main Component ---
export default function SystemConfig() {
  const [activeTab, setActiveTab] = useState('departments'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [data, setData] = useState<any>(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); 
  const [formData, setFormData] = useState<any>({ 
      name: '', code: '', dept: '', revision: '', 
      pages: [], prefix: '', format: 'YYMMDD', sequenceDigit: 3, reset: 'Daily', note: '' 
  });

  const activeTabData: any = TABS.find(t => t.id === activeTab);
  const currentList = data[activeTab] || [];

  const filteredList = useMemo(() => {
      return currentList.filter((item: any) => {
          const s = search.toLowerCase();
          if (activeTab === 'idFormats') {
              return (item.prefix?.toLowerCase().includes(s) || 
                      item.pages?.join(',').toLowerCase().includes(s));
          }
          return (item.name?.toLowerCase().includes(s) || 
                  item.code?.toLowerCase().includes(s) || 
                  item.dept?.toLowerCase().includes(s));
      });
  }, [currentList, search, activeTab]);

  const paginatedData = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); setSearch(''); }, [activeTab]);

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : { 
      name: '', code: '', dept: '', revision: '',
      pages: [], prefix: '', format: 'YYMMDD', sequenceDigit: 3, reset: 'Daily', note: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (editingItem) {
      setData((prev: any) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item: any) => item.id === editingItem.id ? { ...item, ...formData } : item)
      }));
    } else {
      const newId = currentList.length > 0 ? Math.max(...currentList.map((i: any) => i.id)) + 1 : 1;
      setData((prev: any) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { id: newId, ...formData }]
      }));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: any) => {
    if(window.confirm('Are you sure you want to delete this configuration?')) {
      setData((prev: any) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item: any) => item.id !== id)
      }));
    }
  };

  const togglePageSelection = (page: string) => {
      setFormData((prev: any) => {
          const pages = prev.pages || [];
          if (pages.includes(page)) return { ...prev, pages: pages.filter((p: string) => p !== page) };
          return { ...prev, pages: [...pages, page] };
      });
  };

  return (
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      {/* USER GUIDE TAB BUTTON */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[150px] bg-[#f8f9fa] border border-[#adb2b0] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#091d38] hover:text-white hover:border-[#091d38] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)}
          title="CONFIG GUIDE"
          desc="System Master Data Configuration"
          sections={[
              {
                  id: "1",
                  title: "Master Data Management",
                  icon: "Database",
                  description: "หน้านี้คือศูนย์กลางการควบคุมข้อมูลพื้นฐานของระบบ (Global Master Data Node) สำหรับใช้งานร่วมกันทุกโมดูล",
                  bullets: [
                      { icon: "CheckCircle2", iconColor: "#5da7b3", title: "Departments", text: "กำหนดรหัสแผนกเพื่อใช้จัดหมวดหมู่พนักงาน การอนุมัติ และสิทธิ์การเข้าถึง" },
                      { icon: "CheckCircle2", iconColor: "#ad7332", title: "Categories & Brands", text: "จัดกลุ่มสินค้าหลักและจัดการแบรนด์สินค้า (ทั้งแบรนด์ภายในและ OEM) เพื่อความแม่นยำในการทำรายงาน Inventory และ Sales" }
                  ]
              },
              {
                  id: "2",
                  title: "ID Generation Rules",
                  icon: "Barcode",
                  iconColor: "#5f7ab7",
                  description: "กำหนดรูปแบบรหัสเอกสารอัตโนมัติ (Document Auto-Numbering) ในระบบ",
                  bullets: [
                      { icon: "ChevronRight", title: "Prefix & Formatting", text: "ป้อนตัวอักษรนำหน้า รันเลข และเพิ่มรูปแบบวัน/เดือน/ปี ต่อท้ายอัตโนมัติ" }
                  ]
              },
              {
                  id: "3",
                  title: "System Warning",
                  icon: "AlertTriangle",
                  iconColor: "#f47729",
                  bullets: [
                      { icon: "AlertTriangle", iconColor: "#f47729", bgColor: "bg-[#f47729]/10", borderColor: "border-[#f47729]/30", title: "Deletion Risk", text: "การลบข้อมูล Master Data ที่มีการผูกกับตารางอื่นไปแล้ว อาจส่งผลให้รายงานพัง โปรดระวัง" }
                  ]
              }
          ]}
      />

      {/* HEADER SECTION */}
      <div className="px-4 sm:px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Settings2 size={28} strokeWidth={2.5} className="text-[#f47729]" />
                  </div>
              </div>
              <div>
                  <h1 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      CONFIG <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">CENTER</span>
                  </h1>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      GLOBAL MASTER DATA & SYSTEM CONFIGURATION NODE
                  </p>
              </div>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3 bg-[#2e3118] text-white px-5 py-2.5 rounded-xl shadow-lg border border-[#af7a2b]/30">
                  <ShieldCheck size={16} />
                  <div className="text-[10px] font-black font-mono tracking-widest uppercase">
                      Admin Access Verified
                  </div>
              </div>
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="px-4 sm:px-8 mt-2 pb-6">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
                <KpiCard label="Total Records" value={filteredList.length} icon="Database" colorAccent={THEME.lightAqua} colorValue={THEME.primary} desc={`Active in ${activeTabData.label}`} />
                <KpiCard label="System Node" value={activeTab.charAt(0).toUpperCase() + activeTab.slice(1, 5)} icon="LayoutGrid" colorAccent={THEME.accent} colorValue={THEME.primary} desc="Master Data Module" />
                <KpiCard label="Last Modified" value="Now" icon="Clock" colorAccent={THEME.gold} colorValue={THEME.primary} desc={new Date().toLocaleTimeString()} />
                <KpiCard label="Sync Status" value="Active" icon="CheckCircle" colorAccent={THEME.sageTeal} colorValue={THEME.sageTeal} desc="Database Connected" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* SIDEBAR TABS */}
                <div className="lg:col-span-3 space-y-2 bg-white/90 p-6 rounded-3xl border border-[#adb2b0] shadow-lg h-fit">
                    <p className="text-[12px] font-black text-[#2e3118] uppercase tracking-widest mb-4 border-b-2 border-[#af7a2b] pb-2">Control Nodes</p>
                    {TABS.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${activeTab === tab.id ? 'bg-[#2e3118] text-white shadow-md' : 'bg-white text-[#8c7361] hover:bg-[#f8f9fa] hover:text-[#f47729] border border-[#adb2b0]'}`}
                        >
                            <div className={`p-2 rounded-xl shrink-0 ${activeTab === tab.id ? 'bg-[#af7a2b]/20 text-[#af7a2b]' : 'bg-[#f8f9fa] text-[#5da7b3] border border-[#adb2b0]'}`}>
                                <LucideIcon name={tab.icon} size={18} />
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className={`text-[13px] font-black uppercase tracking-tight truncate ${activeTab === tab.id ? 'text-[#F0EAE1]' : 'text-[#2e3118]'}`}>{tab.label}</p>
                                <p className={`text-[11px] font-bold uppercase tracking-widest mt-0.5 truncate ${activeTab === tab.id ? 'text-[#af7a2b]' : 'text-[#8c7361]'}`}>{data[tab.id].length} Items</p>
                            </div>
                            {activeTab === tab.id && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#af7a2b] shadow-[0_0_8px_#af7a2b]"></div>}
                        </button>
                    ))}
                </div>

                {/* CONTENT LIST */}
                <div className="lg:col-span-9 bg-white rounded-3xl shadow-lg border border-[#adb2b0] overflow-hidden flex flex-col animate-fadeIn">
                    <div className="px-8 py-5 border-b border-[#adb2b0] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h4 className="text-[18px] font-black uppercase text-[#2e3118] tracking-tight flex items-center gap-3">
                                <LucideIcon name={activeTabData.icon} size={22} className="text-[#af7a2b]"/> {activeTabData.title}
                            </h4>
                            <p className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest mt-1">{activeTabData.desc}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                                <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={`Search ${activeTabData.label}...`} className="w-full pl-12 pr-4 py-2.5 text-[12px] border border-[#adb2b0] rounded-xl font-bold outline-none focus:border-[#af7a2b] bg-white shadow-sm text-[#2e3118]" />
                            </div>
                            <button onClick={() => handleOpenModal()} className="bg-[#2e3118] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#426a77] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#2e3118]">
                                <Plus size={16} /> New Record
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#2e3118] border-b-2 border-[#af7a2b] text-white uppercase tracking-widest text-[12px] font-black sticky top-0 z-10">
                                <tr>
                                    {activeTab === 'idFormats' ? (
                                        <>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Pages</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Prefix</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Format</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Rule</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                        </>
                                    ) : activeTab === 'pdfTemplates' ? (
                                        <>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Template</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Department</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Code</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Revision</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                        </>
                                    ) : activeTab === 'sellers' ? (
                                        <>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Seller Details</th>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Company (TH)</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Tax ID</th>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Bank Info</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                        </>
                                    ) : activeTab === 'consignees' ? (
                                        <>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Consignee</th>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Consignee Address</th>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Notify Party</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="py-4 px-6 whitespace-nowrap text-[12px]">Identification</th>
                                            {activeTab === 'departments' && <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Sys Code</th>}
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Status</th>
                                            <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#adb2b0]">
                                {paginatedData.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                        {activeTab === 'idFormats' ? (
                                            <>
                                                <td className="py-3 px-6 text-[12px]">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.pages?.map((p: any, i: any) => (
                                                            <span key={i} className="px-2.5 py-1 bg-[#2e3118]/5 text-[#2e3118] rounded-lg text-[11px] font-black border border-[#adb2b0] uppercase">{p}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6 text-center font-black text-[#5da7b3] text-[12px] font-mono">{item.prefix}</td>
                                                <td className="py-3 px-6 text-center text-[12px]">
                                                    <span className="bg-[#f8f9fa] text-[#2e3118] px-3 py-1.5 rounded-lg font-mono font-black text-[12px] border border-[#adb2b0]">{item.format}</span>
                                                </td>
                                                <td className="py-3 px-6 text-center text-[12px]">
                                                    <p className="text-[12px] font-black text-[#2e3118]">{item.sequenceDigit} Digits</p>
                                                    <p className="text-[11px] font-bold text-[#8c7361] uppercase mt-0.5">{item.reset} Reset</p>
                                                </td>
                                            </>
                                        ) : activeTab === 'pdfTemplates' ? (
                                            <>
                                                <td className="py-3 px-6 font-black text-[#2e3118] text-[12px] uppercase tracking-tight">{item.name}</td>
                                                <td className="py-3 px-6 text-center font-bold text-[#8c7361] text-[11px] uppercase tracking-widest">{item.dept}</td>
                                                <td className="py-3 px-6 text-center font-mono font-black text-[#2e3118] text-[12px]">{item.code}</td>
                                                <td className="py-3 px-6 text-center font-black text-[#ad7332] text-[12px]">{item.revision}</td>
                                            </>
                                        ) : activeTab === 'sellers' ? (
                                            <>
                                                <td className="py-3 px-6 text-[12px]">
                                                    <p className="font-black text-[#2e3118]">{item.name}</p>
                                                    <p className="text-[11px] text-[#8c7361] mt-1">{item.address}</p>
                                                    <p className="text-[11px] font-mono text-[#5da7b3] mt-1">{item.contactDesc}</p>
                                                </td>
                                                <td className="py-3 px-6 text-[12px]">
                                                    <p className="font-black text-[#2e3118]">{item.companyTh}</p>
                                                    <p className="text-[11px] text-[#8c7361] mt-1">{item.addressTh}</p>
                                                </td>
                                                <td className="py-3 px-6 text-center text-[12px] font-mono font-black text-[#5da7b3]">
                                                    {item.taxId}
                                                </td>
                                                <td className="py-3 px-6 text-[12px]">
                                                    <p className="font-black text-[#2e3118]">{item.bankName}</p>
                                                    <p className="text-[11px] text-[#8c7361] mt-1">{item.branch} | {item.bankAddr}</p>
                                                    <p className="text-[11px] text-[#2e3118] mt-1">Acct: <span className="font-bold">{item.accountName}</span> - <span className="font-mono text-[#5da7b3] font-bold">{item.accountNo}</span></p>
                                                    <p className="text-[11px] text-[#8c7361] mt-0.5">SWIFT: {item.swiftCode}</p>
                                                </td>
                                            </>
                                        ) : activeTab === 'consignees' ? (
                                            <>
                                                <td className="py-3 px-6 font-black text-[#2e3118] text-[12px]">{item.name}</td>
                                                <td className="py-3 px-6 text-[11px] text-[#8c7361] max-w-[200px] truncate" title={item.address}>{item.address}</td>
                                                <td className="py-3 px-6 text-[11px] text-[#8c7361] max-w-[200px] truncate" title={item.notifyParty}>{item.notifyParty}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-3 px-6 text-[12px] max-w-[400px]">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-[#af7a2b] shrink-0 mt-1.5"></div>
                                                        <div>
                                                            <span className={`font-black text-[#2e3118] text-[12px] tracking-tight whitespace-pre-wrap ${activeTab !== 'paymentTerms' ? 'uppercase' : ''}`}>{item.name}</span>
                                                            {item.subCats && (
                                                                <div className="mt-1.5 flex flex-wrap gap-1">
                                                                    {item.subCats.split(',').map((c: string, i: number) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-[#f8f9fa] border border-[#adb2b0] rounded text-[10px] text-[#426a77] uppercase font-bold">{c.trim()}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                {activeTab === 'departments' && <td className="py-3 px-6 text-center font-mono font-black text-[#5da7b3] text-[12px]">{item.code}</td>}
                                                <td className="py-3 px-6 text-center text-[12px]">
                                                   <span className="px-3 py-1 bg-[#7c9d9c]/10 text-[#7c9d9c] border border-[#7c9d9c]/20 rounded-full text-[11px] font-black uppercase tracking-widest">Active</span>
                                                </td>
                                            </>
                                        )}
                                        <td className="py-3 px-6 text-center text-[12px]">
                                            <div className="flex justify-center items-center gap-[0.5px]">
                                                <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#adb2b0] text-[#5da7b3] hover:border-[#2e3118] hover:text-[#f47729] hover:bg-[#2e3118]/5 transition-all shadow-sm bg-white active:scale-90" title="Edit">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#adb2b0] text-[#f47729] hover:border-[#f47729] hover:bg-[#f47729]/10 transition-all shadow-sm bg-white active:scale-90" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="px-8 py-3 bg-[#f8f9fa] border-t-[1.5px] border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6 text-[11px] font-black text-[#8c7361] uppercase tracking-widest">
                            <div className="flex items-center gap-3">
                                <span>Display Rows:</span>
                                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#adb2b0] rounded-lg px-3 py-1.5 outline-none font-black text-[#2e3118] cursor-pointer shadow-sm">
                                    {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <p className="bg-white px-4 py-2 rounded-xl border border-[#adb2b0] shadow-sm">Total Records: {filteredList.length}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 border border-[#adb2b0] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#2e3118] hover:text-white shadow-md active:scale-90'}`}>
                                <ChevronLeft size={18}/>
                            </button>
                            <div className="bg-[#2e3118] text-white px-8 py-2.5 rounded-xl shadow-md font-black text-[11px] min-w-[140px] text-center uppercase tracking-widest">
                                Page {currentPage} / {totalPages || 1}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-10 h-10 border border-[#adb2b0] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#2e3118] hover:text-white shadow-md active:scale-90'}`}>
                                <ChevronRight size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
      </div>

      {/* MODAL SYSTEM */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        width="max-w-2xl"
        customHeader={
            <div className="bg-[#2e3118] px-6 py-4 flex justify-between items-center shrink-0 border-b-4 border-[#af7a2b]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-[#af7a2b] flex items-center justify-center border border-white/20 shadow-md backdrop-blur-md">
                        <LucideIcon name={activeTabData.icon} size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#F0EAE1] uppercase tracking-widest leading-none">{editingItem ? `Modify` : `Create`} {activeTabData.label}</h3>
                        <p className="text-[11px] font-bold text-[#F0EAE1]/70 uppercase tracking-widest mt-1 flex items-center gap-2">
                          <Zap size={10} className="text-[#af7a2b]" /> Strategic Config Node Management
                        </p>
                    </div>
                </div>
                <button onClick={()=>setIsModalOpen(false)} className="text-white/70 hover:text-[#f47729] transition-all bg-white/10 hover:bg-white/20 p-2 rounded-full relative z-10 active:scale-90"><X size={18} /></button>
            </div>
        }
      >
             <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#f8f9fa]">
                <form id="configForm" onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#adb2b0] shadow-sm space-y-6">
                    {activeTab === 'idFormats' ? (
                      <div className="space-y-6">
                        <div>
                          <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Connect to System Pages <span className="text-[#f47729]">*</span></label>
                          <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-4 rounded-xl border border-[#adb2b0]">
                              {AVAILABLE_PAGES.map(page => (
                                  <label key={page} className="flex items-center gap-3 cursor-pointer group p-1">
                                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.pages.includes(page) ? 'bg-[#2e3118] border-[#2e3118] text-[#af7a2b]' : 'bg-white border-[#adb2b0] group-hover:border-[#2e3118]'}`} onClick={() => togglePageSelection(page)}>
                                          {formData.pages.includes(page) && <Check size={12} strokeWidth={4} />}
                                      </div>
                                      <span className="text-[12px] font-bold text-[#426a77] uppercase tracking-tight group-hover:text-[#f47729] transition-colors">{page}</span>
                                  </label>
                              ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Prefix Header <span className="text-[#f47729]">*</span></label>
                                <input type="text" required value={formData.prefix} onChange={(e) => setFormData({...formData, prefix: e.target.value.toUpperCase()})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] font-mono outline-none focus:border-[#af7a2b] transition-all uppercase placeholder:opacity-30 shadow-sm" placeholder="e.g. PO" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Date Signature <span className="text-[#f47729]">*</span></label>
                                <select required value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] transition-all font-mono cursor-pointer shadow-sm">
                                    <option value="YYMMDD">YYMMDD (Standard)</option>
                                    <option value="YYYYMMDD">YYYYMMDD (Extended)</option>
                                    <option value="YYMM">YYMM (Monthly)</option>
                                    <option value="YYYYMM">YYYYMM (Full Monthly)</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Sequence Digits <span className="text-[#f47729]">*</span></label>
                                <input type="number" min="1" max="10" required value={formData.sequenceDigit} onChange={(e) => setFormData({...formData, sequenceDigit: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Reset Cycle <span className="text-[#f47729]">*</span></label>
                                <select required value={formData.reset} onChange={(e) => setFormData({...formData, reset: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] transition-all cursor-pointer shadow-sm">
                                    <option value="Daily">Daily Reset</option>
                                    <option value="Monthly">Monthly Reset</option>
                                    <option value="Yearly">Yearly Reset</option>
                                    <option value="Never">Never Reset</option>
                                </select>
                            </div>
                        </div>
                      </div>
                    ) : activeTab === 'sellers' ? (
                      <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Seller/Company Name (EN) <span className="text-[#f47729]">*</span></label>
                            <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Address (EN)</label>
                            <textarea value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" rows={2} />
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Contact Description</label>
                            <input type="text" value={formData.contactDesc || ''} onChange={(e) => setFormData({...formData, contactDesc: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Company (TH)</label>
                                <input type="text" value={formData.companyTh || ''} onChange={(e) => setFormData({...formData, companyTh: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Tax ID</label>
                                <input type="text" value={formData.taxId || ''} onChange={(e) => setFormData({...formData, taxId: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] font-mono font-bold text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Address (TH)</label>
                            <textarea value={formData.addressTh || ''} onChange={(e) => setFormData({...formData, addressTh: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" rows={2} />
                        </div>
                        <div className="pt-4 border-t border-[#adb2b0]">
                            <h4 className="text-[13px] font-black text-[#af7a2b] uppercase tracking-widest mb-3">Bank Information</h4>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">Bank Name</label>
                                        <input type="text" value={formData.bankName || ''} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">Branch</label>
                                        <input type="text" value={formData.branch || ''} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">Bank Address</label>
                                    <textarea value={formData.bankAddr || ''} onChange={(e) => setFormData({...formData, bankAddr: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" rows={1} />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">Account Name</label>
                                    <input type="text" value={formData.accountName || ''} onChange={(e) => setFormData({...formData, accountName: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">Account No.</label>
                                        <input type="text" value={formData.accountNo || ''} onChange={(e) => setFormData({...formData, accountNo: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] font-mono font-bold text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">SWIFT Code</label>
                                        <input type="text" value={formData.swiftCode || ''} onChange={(e) => setFormData({...formData, swiftCode: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2 text-[12px] font-mono font-bold text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    ) : activeTab === 'consignees' ? (
                      <div className="space-y-4">
                         <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Consignee Name <span className="text-[#f47729]">*</span></label>
                            <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" />
                         </div>
                         <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Consignee Address</label>
                            <textarea value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" rows={3} />
                         </div>
                         <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Notify Party</label>
                            <textarea value={formData.notifyParty || ''} onChange={(e) => setFormData({...formData, notifyParty: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" rows={3} />
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                            <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">{activeTab.slice(0, -1).toUpperCase()} Title/Name <span className="text-[#f47729]">*</span></label>
                            {activeTab === 'paymentTerms' ? (
                                <textarea required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] transition-all shadow-sm min-h-[100px]" placeholder={`Enter ${activeTab.slice(0, -1)} description...`} />
                            ) : (
                                <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] transition-all uppercase shadow-sm" placeholder={`Enter ${activeTab.slice(0, -1)} description...`} />
                            )}
                        </div>
                        {activeTab === 'categories' && (
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Sub-Categories <span className="text-[#8c7361] font-normal normal-case">(comma separated)</span></label>
                                <textarea value={formData.subCats || ''} onChange={(e) => setFormData({...formData, subCats: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] transition-all uppercase shadow-sm min-h-[80px]" placeholder="e.g. EXTRA LARGE, LARGE, MEDIUM" />
                            </div>
                        )}
                        {activeTab === 'departments' && (
                            <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">System Routing Code <span className="text-[#f47729]">*</span></label>
                                <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] font-mono outline-none focus:border-[#af7a2b] transition-all uppercase shadow-sm" placeholder="e.g. FIN" />
                            </div>
                        )}
                        {activeTab === 'pdfTemplates' && (
                          <div className="grid grid-cols-3 gap-4">
                             <div className="col-span-2">
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Form Code (ISO)</label>
                                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" placeholder="FM-XX-XX" />
                             </div>
                             <div>
                                <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block mb-2">Revision</label>
                                <input type="text" value={formData.revision} onChange={(e) => setFormData({...formData, revision: e.target.value})} className="w-full bg-white border border-[#adb2b0] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm" placeholder="REV 00" />
                             </div>
                          </div>
                        )}
                      </div>
                    )}
                </form>
             </div>

             <div className="p-4 bg-[#f8f9fa] border-t border-[#adb2b0] flex justify-end items-center gap-3 shrink-0">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="px-6 py-2 bg-white border border-[#adb2b0] text-[#426a77] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#F0EAE1]/30 transition-all">Cancel</button>
                <button type="submit" form="configForm" className="bg-[#2e3118] text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#426a77] hover:text-white transition-all flex items-center gap-2">
                    <Save size={14}/> Save Config
                </button>
             </div>
      </DraggableModal>
    </div>
  );
}
