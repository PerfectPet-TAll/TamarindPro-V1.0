import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Users, Star, AlertTriangle, CheckCircle2, UserPlus, HelpCircle, ChevronLeft, ChevronDownCircle, ListFilter, Zap,
  Upload, BarChart2, List
} from 'lucide-react';
import Swal from 'sweetalert2';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { CsvUpload } from '../../components/shared/CsvUpload';
import KpiCard from '../../components/shared/KpiCard';
import { DataExport } from '../../components/shared/DataExport';

import { THEME, CATEGORIES, Customer } from './types';
import CustomerRow from './components/CustomerRow';
import CreateCustomerModal from './components/CreateCustomerModal';
import EditCustomerModal from './components/EditCustomerModal';
import CustomerInsightView from './components/CustomerInsightView';

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

const generateCustomers = (): Customer[] => {
    return [
        { id: 'CUST-001', name: 'บริษัท ซีพี ออลล์ จำกัด (มหาชน)', cat: 'Modern Trade', subCat: 'Convenience Store', taxId: '0107542000011', billingAddress: '313 อาคาร ซี.พี.ทาวเวอร์ ชั้น 24 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500', shippingAddresses: [{id: 1, address: 'ศูนย์กระจายสินค้า DC ลาดกระบัง'}], credit: '30 Days', vatType: 'Vat', estRev: 5000000, status: 'Active', contact: 'คุณสมชาย ใจดี', phone: '081-234-5678', email: 'somchai@cpall.co.th', pp20: 'cpall_pp20.pdf', comReg: 'cpall_reg.pdf', updated: '2026-05-01', region: 'Domestic', country: 'Thailand', salesAccount: 'Somchai S.', registDate: '2020-01-15', note: 'ลูกค้ารายใหญ่ ต้องการสินค้าต่อเนื่อง', contactDetail: 'ส่งเอกสารทางไปรษณีย์ทุกสิ้นเดือน' },
        { id: 'CUST-002', name: 'บริษัท สยามแม็คโคร จำกัด (มหาชน)', cat: 'Modern Trade', subCat: 'Hypermarket', taxId: '0107537000521', billingAddress: '1468 ถนนพัฒนาการ แขวงพัฒนาการ เขตสวนหลวง กรุงเทพมหานคร 10250', shippingAddresses: [{id: 1, address: 'สาขาแจ้งวัฒนะ'}, {id: 2, address: 'สาขาศรีนครินทร์'}], credit: '45 Days', vatType: 'Vat', estRev: 8500000, status: 'Active', contact: 'คุณวิภาวรรณ แซ่ลี้', phone: '089-876-5432', email: 'wipawan@makro.co.th', pp20: '', comReg: '', updated: '2026-05-02', region: 'Domestic', country: 'Thailand', salesAccount: 'Suda M.', registDate: '2019-11-20', note: 'ต่อรองเรื่องราคาพิเศษ', contactDetail: '' },
        { id: 'CUST-003', name: 'Lotus\'s Thailand (เอก-ชัย ดีสทริบิวชั่น)', cat: 'Modern Trade', subCat: 'Hypermarket', taxId: '0105536034143', billingAddress: '629/1 ถนนนวมินทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230', shippingAddresses: [{id: 1, address: 'DC วังน้อย'}], credit: '60 Days', vatType: 'Vat', estRev: 6200000, status: 'Active', contact: 'Mr. John Smith', phone: '02-797-9000', email: 'purchasing@lotuss.com', pp20: '', comReg: '', updated: '2026-05-03', region: 'Domestic', country: 'Thailand', salesAccount: 'T-DCC Team', registDate: '2021-03-05', note: '', contactDetail: '' },
        { id: 'CUST-004', name: 'ร้านเจ๊หมวย ขายส่ง', cat: 'Traditional Trade', subCat: 'Wholesale', taxId: '3100201889921', billingAddress: 'ตลาดไท โซนอาหารสด จ.ปทุมธานี', shippingAddresses: [{id: 1, address: 'ตลาดไท โซนอาหารสด จ.ปทุมธานี'}], credit: 'Cash', vatType: 'No Vat', estRev: 150000, status: 'Active', contact: 'เจ๊หมวย', phone: '085-555-1234', email: '-', pp20: '', comReg: '', updated: '2026-05-03', region: 'Domestic', country: 'Thailand', salesAccount: 'Suda M.', registDate: '2023-08-12', note: 'รับเงินสดหน้างาน', contactDetail: 'ติดต่อเจ๊หมวยโดยตรง' },
        { id: 'CUST-005', name: 'บริษัท ไมเนอร์ ฟู้ด กรุ๊ป', cat: 'Food Service', subCat: 'Restaurant', taxId: '0107536000911', billingAddress: '88 อาคารเดอะ ปาร์ค ชั้น 12 ถนนรัชดาภิเษก กรุงเทพมหานคร', shippingAddresses: [{id: 1, address: 'คลังสินค้าสุขุมวิท 71'}], credit: '30 Days', vatType: 'Both', estRev: 1200000, status: 'Active', contact: 'คุณดนัย', phone: '02-365-6999', email: 'danai@minor.com', pp20: '', comReg: '', updated: '2026-05-04', region: 'Domestic', country: 'Thailand', salesAccount: 'Somchai S.', registDate: '2022-02-18', note: 'สั่งเฉพาะ Paste', contactDetail: '' },
        { id: 'CUST-006', name: 'CJ Express Group', cat: 'Modern Trade', subCat: 'Supermarket', taxId: '0105556111122', billingAddress: '393 ถนนสีลม แขวงสีลม เขตบางรัก กทม', shippingAddresses: [{id: 1, address: 'DC นครปฐม'}], credit: '30 Days', vatType: 'Vat', estRev: 3400000, status: 'Active', contact: 'คุณอรทัย', phone: '086-777-8899', email: 'orathai@cj.co.th', pp20: '', comReg: '', updated: '2026-05-04', region: 'Domestic', country: 'Thailand', salesAccount: 'Somchai S.', registDate: '2024-01-10', note: '', contactDetail: '' },
        { id: 'CUST-007', name: 'โรงแรมดุสิตธานี', cat: 'Food Service', subCat: 'Hotel', taxId: '0107536000014', billingAddress: '946 ถนนพระราม 4 กรุงเทพมหานคร 10500', shippingAddresses: [{id: 1, address: '946 ถนนพระราม 4 กรุงเทพมหานคร 10500'}], credit: '60 Days', vatType: 'Vat', estRev: 800000, status: 'Active', contact: 'คุณวิทย์', phone: '02-200-9000', email: 'fb@dusit.com', pp20: '', comReg: '', updated: '2026-05-05', region: 'Domestic', country: 'Thailand', salesAccount: 'Suda M.', registDate: '2018-06-25', note: '', contactDetail: '' },
        { id: 'CUST-008', name: 'ร้านอาหารเพนกวิน (สาขาสยาม)', cat: 'Food Service', subCat: 'Restaurant', taxId: '3100200019283', billingAddress: 'สยามสแควร์ ซอย 3', shippingAddresses: [{id: 1, address: 'สยามสแควร์ ซอย 3'}], credit: '7 Days', vatType: 'Both', estRev: 50000, status: 'Inactive', contact: 'ผู้จัดการร้าน', phone: '081-111-2222', email: '-', pp20: '', comReg: '', updated: '2026-05-06', region: 'Domestic', country: 'Thailand', salesAccount: 'Suda M.', registDate: '2025-05-14', note: 'หยุดรับสินค้าชั่วคราว', contactDetail: '' },
        { id: 'CUST-009', name: 'Thai Foods Distributor Ltd.', cat: 'Agent', subCat: 'Distributor', taxId: '0105560123456', billingAddress: '123 หมู่ 4 ถ.บางนา-ตราด จ.สมุทรปราการ', shippingAddresses: [{id: 1, address: '123 หมู่ 4 ถ.บางนา-ตราด จ.สมุทรปราการ'}], credit: '30 Days', vatType: 'Vat', estRev: 2500000, status: 'Hold', contact: 'คุณอำนาจ', phone: '089-000-1111', email: 'amnat@tfd.com', pp20: '', comReg: '', updated: '2026-05-07', region: 'Domestic', country: 'Thailand', salesAccount: 'Somchai S.', registDate: '2021-10-09', note: 'ค้างชำระเกินกำหนด', contactDetail: '' },
        { id: 'CUST-010', name: 'โรงพยาบาลกรุงเทพ', cat: 'Corporate', subCat: 'B2B Company', taxId: '0107537000017', billingAddress: '2 ซอยศูนย์วิจัย 7 ถนนเพชรบุรีตัดใหม่', shippingAddresses: [{id: 1, address: 'แผนกรับสินค้า ฝ่ายโภชนาการ ซอยศูนย์วิจัย'}], credit: '30 Days', vatType: 'Vat', estRev: 450000, status: 'Active', contact: 'แผนกจัดซื้อโภชนาการ', phone: '02-310-3000', email: 'food@bangkokhospital.com', pp20: '', comReg: '', updated: '2026-05-08', region: 'Domestic', country: 'Thailand', salesAccount: 'T-DCC Team', registDate: '2023-11-22', note: 'ต้องการใบรับรองความสะอาดก่อนส่ง', contactDetail: '' },
    ];
};

export default function CustomerDirectory() {
    const [items, setItems] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setItems(generateCustomers());
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeStatus, setActiveStatus] = useState('All');
    const [mainTab, setMainTab] = useState('DIRECTORY');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showGuide, setShowGuide] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const [newCust, setNewCust] = useState({
        name: '',
        taxId: '',
        cat: 'Modern Trade',
        subCat: '',
        contact: '',
        phone: '',
        credit: '30 Days',
        status: 'Active',
        billingAddress: '',
        email: '',
        region: 'Domestic',
        country: 'Thailand',
        shippingAddresses: [],
        vatType: 'Vat',
        pp20: '',
        comReg: '',
        salesAccount: 'Somchai S.',
        note: '',
        contactDetail: ''
    });

    const [editCust, setEditCust] = useState<Customer | null>(null);

    const handleRegisterCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCust.name.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกชื่อบริษัท / คู่ค้า',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#f47729',
                customClass: { popup: 'font-mono' }
            });
            return;
        }

        const formattedId = `CUST-${String(items.length + 1).padStart(3, '0')}`;
        const customer: Customer = {
            ...newCust,
            id: formattedId,
            estRev: 0,
            registDate: new Date().toISOString().split('T')[0],
            updated: new Date().toISOString().split('T')[0]
        } as any;

        setItems(prev => [customer, ...prev]);
        setShowCreateModal(false);
        setNewCust({
            name: '',
            taxId: '',
            cat: 'Modern Trade',
            subCat: '',
            contact: '',
            phone: '',
            credit: '30 Days',
            status: 'Active',
            billingAddress: '',
            email: '',
            region: 'Domestic',
            country: 'Thailand',
            shippingAddresses: [],
            vatType: 'Vat',
            pp20: '',
            comReg: '',
            salesAccount: 'Somchai S.',
            note: '',
            contactDetail: ''
        });

        Swal.fire({
            icon: 'success',
            title: 'ลงทะเบียนสำเร็จ',
            text: `ลงทะเบียนคู่ค้าใหม่ ${customer.name} เรียบร้อยแล้ว`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#091d38',
            customClass: { popup: 'font-mono' }
        });
    };

    const handleUpdateCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCust || !editCust.name.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกชื่อบริษัท / คู่ค้า',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#f47729',
                customClass: { popup: 'font-mono' }
            });
            return;
        }

        setItems(prev => prev.map(item => item.id === editCust.id ? { ...editCust, updated: new Date().toISOString().split('T')[0] } : item));
        setEditCust(null);

        Swal.fire({
            icon: 'success',
            title: 'อัปเดตข้อมูลสำเร็จ',
            text: `ปรับปรุงข้อมูลของคู่ค้า ${editCust.name} เรียบร้อยแล้ว`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#091d38',
            customClass: { popup: 'font-mono' }
        });
    };

    const filteredData = useMemo(() => {
        return items.filter(item => {
            const matchSearch = (item.id + item.name + item.taxId + item.contact).toLowerCase().includes(searchTerm.toLowerCase());
            const matchCat = activeCategory === 'All' || item.cat === activeCategory;
            const matchStatus = activeStatus === 'All' || item.status === activeStatus;
            return matchSearch && matchCat && matchStatus;
        });
    }, [items, searchTerm, activeCategory, activeStatus]);

    const categoryData = useMemo(() => {
        const counts = items.reduce((acc, curr) => {
            acc[curr.cat] = (acc[curr.cat] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value: Number(value) })).sort((a,b)=>b.value-a.value);
    }, [items]);

    const statusData = useMemo(() => {
        const counts = items.reduce((acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value: Number(value) })).sort((a,b)=>b.value-a.value);
    }, [items]);

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    const kpiData = useMemo(() => {
        const count = items.length;
        const activeCount = items.filter(o => o.status === 'Active').length;
        const highValueCount = items.filter(o => o.estRev >= 1000000).length;

        return [
            { icon: Users, value: count, label: "Total Customers", colorAccent: THEME.palette.blueMuted, colorValue: THEME.textMain, desc: `Registered DB` },
            { icon: CheckCircle2, value: activeCount, label: "Active Accounts", colorAccent: THEME.success, colorValue: THEME.success, desc: "Ready for Orders" },
            { icon: Star, value: highValueCount, label: "High Value Clients", colorAccent: THEME.accent, colorValue: THEME.accent, desc: "Rev > 1M THB" },
            { icon: AlertTriangle, value: items.filter(o => o.status === 'Hold').length, label: "On Hold", colorAccent: THEME.palette.orangeBright, colorValue: THEME.palette.orangeBright, desc: "Action Required" }
        ];
    }, [items]);

    const topPerformingData = useMemo(() => {
        return [...items]
            .sort((a, b) => b.estRev - a.estRev)
            .slice(0, 5)
            .map(item => ({
                name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
                score: item.estRev,
                kpi1: `Status: ${item.status}`,
                kpi2: `Credit: ${item.credit}`
            }));
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
                    title="CUSTOMER DIRECTORY"
                    desc="ระบบจัดการข้อมูลลูกค้า และนโยบายการขาย (B2B)"
                    sections={[
                        {
                            id: "1",
                            title: "การจัดการข้อมูลลูกค้าหลัก",
                            icon: "Users",
                            description: "คุณสามารถดูและค้นหาข้อมูลลูกค้า หรืออัปโหลดข้อมูลจากไฟล์ CSV ได้แบบ Batch",
                            bullets: [
                                { icon: "Plus", iconColor: "#e3624a", title: "NEW CUSTOMER", text: "คลิกปุ่มเพื่อสร้างโปรไฟล์ลูกค้าใหม่ ระบุชื่อบริษัทและหมวดหมู่" },
                                { icon: "Upload", iconColor: "#5da7b3", title: "UPLOAD CSV", text: "นำเข้าข้อมูลลูกค้าแบบ Bulk โดยใช้ไฟล์รูปแบบ CSV เพื่อความรวดเร็ว" },
                                { icon: "Copy", iconColor: "#af7a2b", title: "COPY DATA", text: "คัดลอกข้อมูลในตารางทั้งหมด (Format TSV) ลงสู่ Clipboard เพื่อนำไปวางใน Excel" },
                            ]
                        }
                    ]} 
                />
                
                <header className="h-28 px-8 flex items-center justify-between z-20 shrink-0 bg-transparent no-print">
                    <div className="flex items-center gap-5">
                        <div className="relative flex items-center justify-center group cursor-default shrink-0">
                            <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                            <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                                <Users size={28} strokeWidth={2.5} className="text-[#f47729]" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-inter font-black text-[#2e3118] uppercase tracking-widest text-[24px] flex items-center gap-2 leading-none">
                                CUSTOMER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">DIRECTORY</span>
                            </h3>
                            <div className="flex items-center gap-1.5 mt-[6px]">
                                <div className="w-8 h-[2px] bg-[#af7a2b]"></div>
                                <p className="text-[11px] font-medium text-[#53483e] uppercase tracking-[0.2em] leading-none font-mono">CLIENT RELATIONSHIP MANAGEMENT</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <input type="month" className="px-4 py-2 rounded-xl border border-[#adb2b0]/40 text-[11px] font-black text-[#2e3118] bg-[#F0EAE1]/30 outline-none focus:border-[#af7a2b] shadow-inner uppercase tracking-widest h-[42px]" />
                        <div className="bg-white/50 backdrop-blur-md p-1 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                            <button onClick={() => setMainTab('DIRECTORY')} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${mainTab === 'DIRECTORY' ? 'bg-[#2e3118] text-[#f47729] shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                                <List size={16} /> DIRECTORY
                            </button>
                            <button onClick={() => setMainTab('INSIGHT')} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${mainTab === 'INSIGHT' ? 'bg-[#2e3118] text-[#f47729] shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                                <BarChart2 size={16} /> INSIGHT
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full px-8 pb-10 flex flex-col relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {kpiData.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
                    </div>

                    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(46,49,24,0.03)] border border-[#d2af94]/30 flex flex-col flex-1 min-h-[600px] overflow-hidden animate-fadeIn">
                        {mainTab === 'DIRECTORY' ? (
                        <>
                        <div className="px-8 py-4 border-b border-[#adb2b0]/30 bg-white flex flex-col xl:flex-row items-center justify-between gap-4 shrink-0 font-mono">
                            <div className="flex flex-wrap items-center gap-3 shrink-0 flex-1 w-full xl:w-auto">
                                <div className="relative group min-w-[200px]">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ListFilter size={14} className="text-[#8c7361] group-hover:text-[#f47729] transition-colors" />
                                    </div>
                                    <select 
                                        className="w-full pl-9 pr-8 py-2 border border-[#adb2b0]/40 rounded-xl text-[11px] font-black focus:outline-none focus:border-[#af7a2b] bg-[#F0EAE1]/30 focus:bg-white shadow-inner text-[#2e3118] h-[42px] transition-all appearance-none cursor-pointer uppercase tracking-widest"
                                        value={activeCategory}
                                        onChange={(e) => { setActiveCategory(e.target.value); setCurrentPage(1); }}
                                    >
                                        <option value="All">CAT: ALL ({items.length})</option>
                                        {CATEGORIES.filter(c => c !== 'All').map(c => (
                                            <option key={c} value={c}>CAT: {c.toUpperCase()} ({items.filter(i => i.cat === c).length})</option>
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
                                        {['Active', 'Hold', 'Inactive'].map(s => (
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
                            
                            <div className="flex items-center gap-3 shrink-0 ml-auto xl:ml-0">
                                <DataExport
                                    data={filteredData}
                                    columns={[
                                        { key: 'id', label: 'Cust ID' },
                                        { key: 'name', label: 'Customer Name' },
                                        { key: 'cat', label: 'Category' },
                                        { key: 'country', label: 'Country' },
                                        { key: 'estRev', label: 'Est Revenue' },
                                        { key: 'status', label: 'Status' }
                                    ]}
                                    filename="Customer_Directory"
                                />
                                <button onClick={() => setShowUploadModal(true)} className="shrink-0 bg-white hover:bg-[#F0EAE1] text-[#214573] border border-[#214573]/30 px-5 py-2.5 rounded-[16px] font-black text-[11px] uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 h-[42px] cursor-pointer">
                                    <Upload size={16} /> UPLOAD CSV
                                </button>
                                <button onClick={() => setShowCreateModal(true)} className="shrink-0 bg-[#f47729] hover:bg-[#ad7332] text-white px-6 py-2.5 rounded-[16px] font-black text-[11px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#f47729] h-[42px] cursor-pointer">
                                    <UserPlus size={16} /> NEW CUSTOMER
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto custom-scrollbar bg-[#F0EAE1]/10">
                            <table className="w-full text-left font-sans border-collapse min-w-[1050px]">
                                <thead className="bg-[#091d38] border-b-2 border-[#f47729] sticky top-0 z-10 text-white font-mono uppercase tracking-widest text-[12px] font-black">
                                    <tr>
                                        <th className="py-4 px-6 pl-8 w-[12%] whitespace-nowrap">Cust ID</th>
                                        <th className="py-4 px-6 w-[25%] whitespace-nowrap">Customer Name</th>
                                        <th className="py-4 px-6 w-[15%] whitespace-nowrap">Category</th>
                                        <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Credit</th>
                                        <th className="py-4 px-6 w-[15%] whitespace-nowrap">Contact</th>
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
                                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                                </td>
                                                <td className="py-2.5 px-6">
                                                    <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                                                </td>
                                                <td className="py-2.5 px-6 text-center text-[12px]">
                                                    <div className="h-4 bg-slate-200 rounded w-[60px] mx-auto"></div>
                                                </td>
                                                <td className="py-2.5 px-6">
                                                    <div className="h-4 bg-slate-200 rounded w-full mb-1"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-[60%]"></div>
                                                </td>
                                                <td className="py-2.5 px-6 text-center">
                                                    <div className="h-6 bg-slate-200 rounded-full w-20 mx-auto"></div>
                                                </td>
                                                <td className="py-2.5 px-6 pr-8">
                                                    <div className="h-8 w-8 bg-slate-200 rounded-lg mx-auto"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : paginatedData.map(item => (
                                        <CustomerRow 
                                            key={item.id} 
                                            item={item} 
                                            onEdit={() => setEditCust({ ...item })} 
                                        />
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center text-[#8c7361] font-black uppercase tracking-widest text-[12px] opacity-50 font-mono">
                                                No Records Found
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
                                  <div className="bg-white px-4 py-1.5 rounded-xl border border-[#d2af94] shadow-sm text-[#2e3118]">TOTAL {filteredData.length} CLIENTS</div>
                              </div>
                              <div className="flex items-center gap-3 mt-4 md:mt-0">
                                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all cursor-pointer ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] shadow-sm active:scale-90'}`}><ChevronLeft size={16}/></button>
                                  <div className="bg-white border border-[#d2af94] px-6 h-9 flex items-center justify-center rounded-xl shadow-sm text-[#2e3118] font-black min-w-[120px] text-center uppercase tracking-widest">
                                      PAGE {currentPage} OF {totalPages}
                                  </div>
                                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className={`w-9 h-9 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all cursor-pointer ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] shadow-sm active:scale-90'}`}><ChevronLeft size={16} className="rotate-180"/></button>
                              </div>
                          </div>
                        )}
                        </>
                        ) : (
                          <CustomerInsightView 
                            categoryData={categoryData}
                            statusData={statusData}
                            topPerformingData={topPerformingData}
                          />
                        )}
                    </div>
                </main>
            </div>

            <CreateCustomerModal 
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              newCust={newCust}
              setNewCust={setNewCust}
              onSubmit={handleRegisterCustomer}
            />

            <DraggableModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="BULK UPLOAD CUSTOMERS">
               <CsvUpload 
                 onUpload={(data) => {
                    console.log('Uploaded Data:', data);
                    setShowUploadModal(false);
                 }}
                 requiredHeaders={['Name', 'Tax ID', 'Contact', 'Category', 'Status']}
                 instructions={[
                    "Ensure the file is in .csv or .xlsx format",
                    "No spaces in header names before upload",
                    "Status must be Active, Validation, Warning or Inactive",
                    "Maximum file size: 10MB"
                 ]}
               />
            </DraggableModal>

            {editCust && (
              <EditCustomerModal 
                editCust={editCust}
                setEditCust={setEditCust}
                onSubmit={handleUpdateCustomer}
              />
            )}
        </>
    );
}
