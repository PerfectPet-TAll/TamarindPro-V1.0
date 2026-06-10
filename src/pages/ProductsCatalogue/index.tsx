import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Database, CheckCircle, Package, List, LayoutGrid, 
  ChevronLeft, ChevronRight, HelpCircle, FileCheck, RefreshCw, Plus, Edit3, Trash2, Upload
} from 'lucide-react';

import KpiCard from '../../components/shared/KpiCard';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { api } from '../../services/api';
import Swal from 'sweetalert2';
import { DataExport } from '../../components/shared/DataExport';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { CsvUpload } from '../../components/shared/CsvUpload';

import { 
  THEME, 
  DEFAULT_CATEGORIES, 
  DEFAULT_SUB_CATEGORIES, 
  DEFAULT_VARIETIES, 
  ProductForm,
  Category
} from './types';

import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import ConfigModal from './components/ConfigModal';

export default function ProductsCatalogue() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Registry States
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [subCategories, setSubCategories] = useState(DEFAULT_SUB_CATEGORIES);
  const [varieties, setVarieties] = useState(DEFAULT_VARIETIES);

  // Pagination & List States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Config Modal State
  const [configModal, setConfigModal] = useState({ isOpen: false, type: 'category' }); 

  // Form State
  const [form, setForm] = useState<ProductForm>({
    rowId: null, skuCode: '', productName: '', category: 'FT', subCategory: '', 
    variety: '', flavor: '', packaging: '', packingSize: '',
    grossWeight: 0, netWeightGram: 0, netWeightLabel: '',
    qtyPerCarton: 0, stdPrice: 0, images: [], desc: ''
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);

  const handleCsvImportSuccess = (importedRows: any[]) => {
    // Automatic field validation of mandatory fields
    const validProducts: any[] = [];
    const errors: string[] = [];

    importedRows.forEach((row, index) => {
      const sku = row['SKU_CODE']?.trim();
      const name = row['PRODUCT_NAME']?.trim();
      const category = row['CATEGORY_CODE']?.trim();
      const stdPrice = Number(row['STD_PRICE']);

      if (!sku) {
        errors.push(`แถวที่ ${index + 2}: ไม่พบรหัสสินค้า (SKU_CODE)`);
        return;
      }
      if (!name) {
        errors.push(`แถวที่ ${index + 2}: ไม่พบชื่อสินค้า (PRODUCT_NAME)`);
        return;
      }
      if (!category) {
        errors.push(`แถวที่ ${index + 2}: ไม่พบประเภทสินค้า (CATEGORY_CODE)`);
        return;
      }
      if (isNaN(stdPrice) || stdPrice <= 0) {
        errors.push(`แถวที่ ${index + 2}: สกุลเงิน/ราคาสินค้า (STD_PRICE) ต้องเป็นตัวเลขมากกว่าศูนย์`);
        return;
      }

      validProducts.push({
        rowId: Date.now() + index,
        id: sku,
        name: name,
        catId: category,
        subCategory: row['SUB_CATEGORY'] || '',
        price: stdPrice,
        variety: row['VARIETY'] || '',
        grossWeight: Number(row['GROSS_WEIGHT']) || 0,
        netWeightLabel: row['NET_WEIGHT_LABEL'] || '0g',
        qtyPerCarton: Number(row['QTY_PER_CARTON']) || 0,
        images: ["https://obsoninternational.com/wp-content/uploads/2024/09/Fruit-Pulp-Tamarind-Imli-Candy-3.jpeg"],
        status: 'Active',
        desc: row['DESCRIPTION'] || 'Bulk Imported via XLSX/CSV'
      });
    });

    if (errors.length > 0) {
      Swal.fire({
        title: 'ข้อมูลไม่ถูกต้อง',
        html: `<div class="text-left text-xs text-red-600 max-h-48 overflow-y-auto font-mono bg-slate-50 p-3 rounded border border-slate-200">${errors.join('<br/>')}</div>`,
        icon: 'error',
        confirmButtonColor: '#E3624A'
      });
      return;
    }

    setProducts(prev => [...validProducts, ...prev]);
    setShowCsvImport(false);

    Swal.fire({
      title: 'นำเข้าสำเร็จ!',
      text: `นำเข้าข้อมูลสินค้าล็อตใหญ่ เรียบร้อยแล้ว ทั้งหมด ${validProducts.length} รายการ`,
      icon: 'success',
      confirmButtonColor: '#606934'
    });
  };

  // Populate Mock Data
  useEffect(() => {
    setIsLoading(true);
    const urls = [
      "https://obsoninternational.com/wp-content/uploads/2024/09/Fruit-Pulp-Tamarind-Imli-Candy-3.jpeg",
      "https://pekis.net/sites/default/files/styles/social_share_1200/public/2025-02/Tamarind.jpg?itok=TEwaArhV",
      "https://i.ebayimg.com/images/g/FJIAAOSw-iljcIso/s-l1200.jpg",
      "https://moonandspoonandyum.com/wp-content/uploads/2022/10/tamarind.jpg",
      "https://www.webstaurantstore.com/uploads/blog/2025/5/tamarind_2_how-to-use-tamarind.jpg",
      "https://ik.imagekit.io/tvlk/dam/i/01kf5m8ehry13mxwm8t3s3ccen.jpeg?tr=q-70,c-at_max,w-1000,h-600",
      "https://img500.exportersindia.com/product_images/bc-500/2018/8/5828010/tamarind-candy-1534415525-4201043.jpeg",
      "https://www.keepitsweet.co.uk/images/003BRI-CHE-CBB.jpg",
      "https://img.lazcdn.com/g/ff/kf/Sabf396040bbd4b20b8664deed7e310ab8.jpg_720x720q80.jpg",
      "https://i.etsystatic.com/23140051/r/il/cfdedd/3255731457/il_570xN.3255731457_jd37.jpg",
      "https://i0.wp.com/caribbeansydney.com.au/wp-content/uploads/2025/06/caribbean-sydney-tamarind-paste-1kg-front.webp",
      "https://filebroker-cdn.lazada.co.th/kf/S0b999b0efa67476eb3b5bd5371603b98L.jpg"
    ];
    
    const timer = setTimeout(() => {
        setProducts(urls.map((url, i) => ({
          rowId: i + 1, id: `SKU-FG-00${i+1}`, name: i % 2 === 0 ? 'Sweet Tamarind Candy' : 'Industrial Paste',
          catId: i % 2 === 0 ? 'FT' : 'TP', price: 150 + (i * 20), images: [url], 
          netWeightLabel: '500g', grossWeight: 0.6, qtyPerCarton: 24, status: 'Active'
        })));
        setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'all' ? true : p.catId === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(filteredProducts.length / itemsPerPage) || 1, [filteredProducts, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleBatchUpdate = async () => {
    setIsSyncing(true);
    try {
      const result = await api.post('read', 'Products');
      if (result && result.status === 'success' && result.data && result.data.length > 0) {
        console.log('Batch updated products:', result.data);
      }
      setTimeout(() => setIsSyncing(false), 800);
    } catch (error) {
      console.error('Failed to sync products:', error);
      setIsSyncing(false);
    }
  };

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setForm({
        rowId: item.rowId,
        skuCode: item.id,
        productName: item.name,
        category: item.catId,
        subCategory: item.subCategory || '',
        variety: item.variety || varieties[0]?.label || '',
        flavor: item.flavor || '',
        packaging: item.packaging || '',
        packingSize: item.packingSize || item.netWeightLabel || '',
        grossWeight: item.grossWeight || 0,
        netWeightGram: item.netWeightGram || 0,
        netWeightLabel: item.netWeightLabel || '',
        qtyPerCarton: item.qtyPerCarton || 0,
        stdPrice: item.price || 0,
        images: item.images || [],
        desc: item.desc || ''
      });
    } else {
      setForm({
        rowId: null, skuCode: '', productName: '', category: categories[0]?.id || '', subCategory: '', 
        variety: varieties[0]?.label || '', flavor: '', packaging: '', packingSize: '',
        grossWeight: 0, netWeightGram: 0, netWeightLabel: '',
        qtyPerCarton: 0, stdPrice: 0, images: [], desc: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (!form.skuCode || !form.productName) return;
    const newProduct = {
      ...form,
      rowId: form.rowId || Date.now(),
      id: form.skuCode,
      name: form.productName,
      catId: form.category,
      price: form.stdPrice,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    if (form.rowId) setProducts(products.map(p => p.rowId === form.rowId ? newProduct : p));
    else setProducts([newProduct, ...products]);
    setShowModal(false);
  };

  const addRegistryItem = (type: string, value: string) => {
    if(!value.trim()) return;
    const newItem = { id: Date.now().toString(), catId: form.category, label: value.trim(), icon: Database };
    if(type === 'category') setCategories([...categories, newItem as any]);
    if(type === 'subcategory') setSubCategories([...subCategories, newItem as any]);
    if(type === 'variety') setVarieties([...varieties, newItem as any]);
  };

  const removeRegistryItem = (type: string, id: string) => {
    if(type === 'category') setCategories(categories.filter(c => c.id !== id));
    if(type === 'subcategory') setSubCategories(subCategories.filter(s => s.id !== id));
    if(type === 'variety') setVarieties(varieties.filter(v => v.id !== id));
  };

  const ActiveCatData = categories.find(c => c.id === activeCategory) || categories[0];
  const ActiveCatIcon = ActiveCatData.icon || Database;

  return (
    <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent">
      
      <button 
        type="button"
        onClick={() => setIsGuideOpen(true)} 
        className="fixed right-0 top-[150px] bg-white border border-[#d2af94]/50 border-r-0 text-[#214573] py-8 px-1.5 rounded-l-xl shadow-[0_8px_30px_rgba(46,49,24,0.12)] hover:bg-[#214573] hover:text-[#f47729] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group cursor-pointer"
      >
        <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#af7a2b] group-hover:text-[#f47729]" />
        <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)} 
          title="MASTER ITEM / PRODUCTS CATALOGUE" 
          desc="คู่มือการใช้งานระบบจัดการข้อมูลสินค้าหลัก (Product Master Data)" 
          sections={[
              {
                  id: "1",
                  title: "ภาพรวมของระบบและแดชบอร์ด",
                  icon: "Box",
                  description: "แถบ KPI ด้านบนใช้สำหรับดูสถิติภาพรวมจำนวนสินค้า แบ่งตามสถานะการทำงาน (Active, Draft, Out of Stock)",
                  bullets: [
                      { icon: "CheckCircle2", iconColor: THEME.success, title: "Active SKUs", text: "รายการสินค้าที่พร้อมจำหน่ายและสามารถเลือกใช้ใน PO/PI ได้" },
                      { icon: "AlertTriangle", iconColor: THEME.palette.orangeBright, title: "Draft Items", text: "สินค้าที่อยู่ระหว่างร่างข้อมูล ยังไม่เปิดให้ดึงไปใช้งานจริง" }
                  ]
              },
              {
                  id: "2",
                  title: "เครื่องมือการจัดการข้อมูลดิบ (Data Operations)",
                  icon: "Settings",
                  description: "ระบบนี้ออกแบบมาเพื่อลดความซ้ำซ้อนของข้อมูล และช่วยให้คัดลอกหรืออัปเดตข้อมูลง่ายขึ้น",
                  bullets: [
                      { icon: "RefreshCw", iconColor: "#5da7b3", title: "Batch Update", text: "ปุ่มใช้อัปเดตข้อมูลจำนวนมากจากฐานข้อมูลต้นทาง (เช่น Google Sheets Sync)" },
                      { icon: "Plus", iconColor: THEME.primary, title: "New Product", text: "เปิดฟอร์มเพื่อสร้างรหัสสินค้าใหม่" }
                  ]
              }
          ]}
      />

      {/* PAGE HEADER */}
      <div className="px-4 sm:px-8 pt-3 pb-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 z-20 shrink-0 bg-transparent">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Package size={28} strokeWidth={2.5} className="text-[#f47729]" />
                  </div>
              </div>
              <div className="flex flex-col">
                  <h3 className="font-sans font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">PRODUCTS</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
                      <div className="w-8 h-[2px] bg-[#af7a2b]"></div>
                      <p className="text-[11px] font-medium text-[#53483e] uppercase tracking-[0.2em] leading-none">Central Registry & Catalogue</p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-sm flex flex-wrap items-center gap-1 shrink-0">
                  <button onClick={() => { setActiveTab('catalog'); setCurrentPage(1); }} className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'catalog' ? 'bg-[#091d38] text-[#f47729] shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                      <LayoutGrid size={16} /> Catalogue
                  </button>
                  <button onClick={() => { setActiveTab('list'); setCurrentPage(1); }} className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'list' ? 'bg-[#091d38] text-[#f47729] shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                      <List size={16} /> SKU Registry
                  </button>
              </div>
          </div>
      </div>

      <main className="flex-1 px-4 sm:px-8 pt-2 pb-12 overflow-y-auto custom-scrollbar animate-fadeIn">
        <div className="w-full space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard label="Registry SKUs" value={products.length} icon={Database} colorAccent={THEME.palette.blueMuted} colorValue={THEME.textMain} desc="Active Nodes" />
                <KpiCard label="Fresh Node" value={products.filter(p=>p.catId==='FT').length} icon={CheckCircle} colorAccent={THEME.palette.olive} colorValue={THEME.textMain} desc="Raw Products" />
                <KpiCard label="Processed Node" value={products.filter(p=>p.catId!=='FT').length} icon={Package} colorAccent={THEME.palette.orangeBright} colorValue={THEME.textMain} desc="Market Ready" />
                <KpiCard label="Node Status" value="SYNC" icon={RefreshCw} colorAccent={THEME.palette.gold} colorValue={THEME.palette.gold} desc="Live Connection" />
            </div>

            <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(46,49,24,0.03)] border border-[#d2af94]/30 overflow-hidden flex flex-col min-h-[700px]">
                
                {/* TOOLBAR */}
                <div className="px-8 py-4 border-b border-[#adb2b0]/30 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                    <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                            <input type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search catalogue..." className="w-full pl-11 pr-4 h-[44px] text-[12px] border border-[#adb2b0]/40 rounded-xl font-black outline-none focus:border-[#af7a2b] bg-[#F0EAE1]/30 focus:bg-white shadow-sm transition-all uppercase" />
                        </div>
                        <div className="flex items-center bg-[#F0EAE1]/30 border border-[#adb2b0]/40 h-[44px] px-4 rounded-xl gap-3 shadow-inner shrink-0">
                           <ActiveCatIcon size={14} className="text-[#af7a2b]" />
                           <select value={activeCategory} onChange={e=>{ setActiveCategory(e.target.value); setCurrentPage(1); }} className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                              <option value="all">All Categories ({products.length})</option>
                              {categories.map(cat=><option key={cat.id} value={cat.id}>{cat.label} ({products.filter(p => p.catId === cat.id).length})</option>)}
                           </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <DataExport
                            data={filteredProducts}
                            columns={[
                                { key: 'id', label: 'Item Code' },
                                { key: 'name', label: 'Product Name' },
                                { key: 'catId', label: 'Category' },
                                { key: 'variant', label: 'Variant' },
                                { key: 'status', label: 'Status' }
                            ]}
                            filename="Products_Catalogue"
                        />
                        <button onClick={() => setShowCsvImport(true)} className="px-5 h-[44px] bg-[#606934]/10 border border-[#606934] text-[#606934] hover:bg-[#606934] hover:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <Upload size={14} /> Import Bulk
                        </button>
                        <button onClick={handleBatchUpdate} disabled={isSyncing} className={`px-5 h-[44px] bg-white border border-[#af7a2b]/30 text-[#af7a2b] hover:border-[#af7a2b] hover:bg-[#af7a2b]/10 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'Syncing...' : 'Batch Sync'}
                        </button>
                        <button onClick={() => handleOpenModal()} className="px-6 h-[44px] bg-[#f47729] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-[0_4px_15px_rgba(244,119,41,0.2)] hover:bg-[#ad7332] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-[#f47729] cursor-pointer">
                            <Plus size={16} /> New Product
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {activeTab === 'catalog' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 p-8 animate-fadeIn overflow-y-auto custom-scrollbar bg-[#F0EAE1]/10 flex-1">
                            {isLoading ? (
                                Array.from({ length: 12 }).map((_, i) => (
                                    <div key={`skel-${i}`} className="bg-white rounded-[22px] border border-[#d2af94]/30 shadow-sm overflow-hidden h-[210px] flex flex-col font-mono animate-pulse">
                                        <div className="h-[130px] bg-slate-200 shrink-0"></div>
                                        <div className="p-3 flex-1 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : paginatedItems.map(product => (
                                <ProductCard 
                                  key={product.rowId}
                                  product={product}
                                  categories={categories}
                                  onClick={() => handleOpenModal(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#091d38] text-white sticky top-0 z-10 font-mono">
                                    <tr>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] border-b-2 border-[#f47729]">SKU / Product Identity</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] border-b-2 border-[#f47729]">Category</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center border-b-2 border-[#f47729]">Net Wt (Label)</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center border-b-2 border-[#f47729]">Gross Wt</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] text-center border-b-2 border-[#f47729]">QTY/CTN</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] text-center border-b-2 border-[#f47729]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#adb2b0]/20">
                                    {isLoading ? (
                                        Array.from({ length: itemsPerPage }).map((_, i) => (
                                            <tr key={`skel-${i}`} className="h-[70px] animate-pulse">
                                                <td className="py-2.5 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0"></div>
                                                        <div className="flex flex-col w-full">
                                                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
                                                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-6"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                                <td className="py-2.5 px-6"><div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div></td>
                                                <td className="py-2.5 px-6"><div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div></td>
                                                <td className="py-2.5 px-4"><div className="h-4 bg-slate-200 rounded w-10 mx-auto"></div></td>
                                                <td className="py-2.5 px-4">
                                                    <div className="flex justify-center gap-[1px]">
                                                        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : paginatedItems.map(item => (
                                        <tr key={item.rowId} className="hover:bg-[#EAF2EA]/50 transition-colors group h-[70px] font-mono">
                                            <td className="py-2.5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={item.images?.[0] || 'https://via.placeholder.com/100'} className="w-10 h-10 rounded-lg overflow-hidden border border-[#d2af94]/30 shadow-sm shrink-0 bg-slate-50 object-cover" alt="" />
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-[#2e3118] text-[12px] uppercase font-sans">{item.name}</span>
                                                        <span className="text-[10px] font-mono font-bold text-[#8c7361]">{item.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-6 font-bold text-[#53483e] text-[12px] uppercase">{categories.find(c=>c.id===item.catId)?.label || item.catId}</td>
                                            <td className="py-2.5 px-6 text-center font-black font-mono text-[11px] text-[#214573]">{item.netWeightLabel}</td>
                                            <td className="py-2.5 px-6 text-center font-bold text-[#606934] text-[11px] uppercase">{item.grossWeight} KG</td>
                                            <td className="py-2.5 px-4 text-center font-black text-[#af7a2b] text-[11px]">{item.qtyPerCarton}</td>
                                            <td className="py-2.5 px-4 text-center">
                                                <div className="flex justify-center items-center gap-[1px]">
                                                    <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5167a2] bg-[#5167a2]/10 hover:bg-[#5167a2]/20 active:scale-90 transition-all cursor-pointer"><Edit3 size={14} /></button>
                                                    <button onClick={() => setProducts(products.filter(p=>p.rowId!==item.rowId))} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#bf8f7e] bg-[#bf8f7e]/10 hover:bg-[#bf8f7e]/20 active:scale-90 transition-all cursor-pointer"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                <div className="px-8 py-3 bg-[#F0EAE1]/80 border-t-[1.5px] border-[#adb2b0]/50 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-mono">
                    <div className="flex items-center gap-6 text-[11px] font-black text-[#53483e] uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                            <span>Display:</span>
                            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#d2af94] rounded-xl px-3 py-1.5 outline-none font-black text-[#2e3118] cursor-pointer shadow-sm focus:border-[#af7a2b]">
                                {[6, 12, 24, 48].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <p className="bg-white px-4 py-1.5 rounded-xl border border-[#d2af94]/30 shadow-sm font-mono text-[10px]">Total Found: {filteredProducts.length}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all cursor-pointer ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] hover:border-[#214573] shadow-sm active:scale-90'}`}><ChevronLeft size={18}/></button>
                        <div className="bg-white text-[#2e3118] px-8 py-2 rounded-xl font-black text-[11px] min-w-[140px] text-center uppercase tracking-widest border border-[#d2af94] shadow-sm font-mono font-bold">Page {currentPage} / {totalPages}</div>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`w-10 h-10 border border-[#d2af94] bg-white rounded-xl flex items-center justify-center transition-all cursor-pointer ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#214573] hover:text-[#f47729] hover:border-[#214573] shadow-sm active:scale-90'}`}><ChevronRight size={18}/></button>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* MODAL SECTION */}
      {showModal && (
        <ProductModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          form={form}
          setForm={setForm}
          categories={categories}
          subCategories={subCategories}
          varieties={varieties}
          onSave={handleSaveProduct}
          setConfigModal={setConfigModal}
        />
      )}

      {/* REGISTRY CONFIG MODAL */}
      {configModal.isOpen && (
        <ConfigModal 
          isOpen={configModal.isOpen}
          onClose={() => setConfigModal({ isOpen: false, type: 'category' })}
          type={configModal.type}
          categories={categories}
          subCategories={subCategories}
          varieties={varieties}
          category={form.category}
          addRegistryItem={addRegistryItem}
          removeRegistryItem={removeRegistryItem}
        />
      )}

      {/* CSV/EXCEL BULK IMPORT MODAL */}
      {showCsvImport && (
        <DraggableModal
          isOpen={showCsvImport}
          onClose={() => setShowCsvImport(false)}
          title={
            <div className="flex items-center gap-2">
              <Upload className="text-[#606934] w-5 h-5" />
              <span>Bulk Import Products Catalogue</span>
            </div>
          }
        >
          <div className="p-2 space-y-4 font-mono select-none">
            <CsvUpload
              requiredHeaders={['SKU_CODE', 'PRODUCT_NAME', 'CATEGORY_CODE', 'NET_WEIGHT_LABEL', 'GROSS_WEIGHT', 'QTY_PER_CARTON', 'STD_PRICE']}
              templateName="products_import_template.xlsx"
              instructions={[
                "แนบไฟล์ CSV หรือ Excel (.xlsx / .xls) สำหรับนำเข้าข้อมูลสินค้าล็อตใหญ่",
                "หัวข้อต้องสะกดตรงตามที่กำหนดเป๊ะๆ (ตัวอักษรพิมพ์ใหญ่): SKU_CODE, PRODUCT_NAME, CATEGORY_CODE, NET_WEIGHT_LABEL, GROSS_WEIGHT, QTY_PER_CARTON, STD_PRICE",
                "CATEGORY_CODE ที่ถูกต้องในการจัดกลุ่ม เช่น FT (Fresh Tamarind), TB (Tamarind Balls), PT, TS, TP",
                "ระบบจะทำการตรวจสอบความถูกต้องและแจ้งข้อผิดพลาดหากพบฟิลด์สำคัญเป็นค่าว่าง"
              ]}
              onUpload={handleCsvImportSuccess}
            />
          </div>
        </DraggableModal>
      )}

    </div>
  );
}
