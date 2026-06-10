import React, { useState } from 'react';
import { 
  BookOpen, Search, Plus, Save, Banknote,
  GitCompare, CheckSquare, Square, LineChart as LineChartIcon, AlertTriangle,
  Database
} from 'lucide-react';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { DataExport } from '../../components/shared/DataExport';

import { 
  MOCK_PRICE_BOOKS, 
  MOCK_ITEMS, 
  PriceBook 
} from './types';

import PriceBooksList from './components/PriceBooksList';
import CompareBooksView from './components/CompareBooksView';
import PriceTrendsChart from './components/PriceTrendsChart';

export default function PriceBooks() {
  const [activeBook, setActiveBook] = useState<PriceBook>(MOCK_PRICE_BOOKS[0]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const [isProductCompareMode, setIsProductCompareMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [priceEdits, setPriceEdits] = useState<Record<string, number>>({'SKU-002': 100, 'SKU-004': 50});

  const handleSelectBook = (book: PriceBook) => {
    setActiveBook(book);
  };

  const handleToggleCompareBook = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else if (selectedBooks.length < 4) {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleToggleProduct = (sku: string) => {
    if (selectedProducts.includes(sku)) {
      setSelectedProducts(selectedProducts.filter(id => id !== sku));
      if (selectedProducts.length <= 2 && isProductCompareMode) {
        setIsProductCompareMode(false);
      }
    } else {
      setSelectedProducts([...selectedProducts, sku]);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent">
        <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[150px] bg-white border border-[#d2af94]/50 border-r-0 text-[#214573] py-8 px-1.5 rounded-l-xl shadow-[0_8px_30px_rgba(46,49,24,0.12)] hover:bg-[#214573] hover:text-[#f47729] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group cursor-pointer">
            <BookOpen size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#af7a2b] group-hover:text-[#f47729]" />
            <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
        </button>

        <UserGuidePanel 
            isOpen={isGuideOpen} 
            onClose={() => setIsGuideOpen(false)}
            title="PRICE BOOKS"
            desc="ระบบจัดการฐานราคาสินค้าตามประเภทลูกค้าและโปรโมชั่น"
            sections={[
                {
                    id: "1",
                    title: "สมุดราคา (Price Books)",
                    icon: "BookOpen",
                    description: "รองรับการตั้งราคาสินค้าแยกตามลอจิกทางการขาย เช่น ขายปลีก ขายส่ง หรืองานส่งออก",
                    bullets: [
                        { icon: "CheckCircle2", iconColor: "#606934", text: "Standard Retail คือราคาฐานที่จะใช้อ้างอิงเป็นราคาเต็ม" },
                        { icon: "AlertCircle", iconColor: "#f47729", text: "หากตั้งสถานะเป็น Draft สมุดราคานี้จะไม่ปรากฏให้เลือกเวลาออกใบเสนอราคา (PI/SO)" }
                    ]
                }
            ]} 
        />

        {/* HEADER SECTION */}
        <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
            <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center group cursor-default shrink-0">
                    <div className="absolute inset-0 bg-[#214573] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                    <div className="relative z-10 p-1.5 border border-[#214573]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                        <Banknote size={28} strokeWidth={2.5} className="text-[#214573]" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="font-sans font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                        PRICE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214573] to-[#f47729]">BOOKS</span>
                    </h3>
                    <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                        PRICING STRATEGY & MARGIN LIMITS
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 px-3 bg-[#EAF2EA]/80 border border-[#606934]/30 rounded-lg h-[36px]">
                        <Database size={12} className="text-[#606934]" />
                        <span className="text-[9px] font-black text-[#606934] uppercase tracking-wider">Synced: Today</span>
                    </div>
                    <button onClick={() => {
                            setIsCompareMode(!isCompareMode);
                            if (!isCompareMode) setSelectedBooks([activeBook.id]);
                         }} className={`px-4 py-2 border font-black text-[11px] uppercase tracking-widest rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer h-[36px] ${isCompareMode ? 'bg-[#214573] text-white border-[#214573]' : 'bg-white text-[#214573] border-[#214573]/30 hover:bg-[#214573]/5'}`}>
                        <GitCompare size={16} /> Compare
                    </button>
                    <div className="h-[36px]">
                        <DataExport 
                            data={MOCK_ITEMS.map(item => ({ ...item, sku: item.id, unit: 'Box' }))}
                            columns={[
                                {key: 'sku', label: 'SKU'},
                                {key: 'name', label: 'Product Name'},
                                {key: 'category', label: 'Category'},
                                {key: 'unit', label: 'Unit'},
                                {key: 'basePrice', label: `Base Price (${activeBook.currency})`},
                                {key: 'bookPrice', label: `Book Price (${activeBook.currency})`},
                                {key: 'margin', label: 'Margin'}
                            ]}
                            filename={`Price_Book_${activeBook.id}`}
                        />
                    </div>
                    <button className="px-4 py-2 bg-[#091d38] text-white font-black text-[11px] uppercase tracking-widest rounded-lg hover:bg-[#214573] transition-all shadow-md flex items-center gap-2 cursor-pointer h-[36px]">
                        <Plus size={16} className="text-[#f47729]" /> New Book
                    </button>
                </div>
            </div>
        </div>

        <main className="flex-1 w-full mt-4 mb-4 px-4 sm:px-8 py-2 overflow-y-auto custom-scrollbar animate-fadeIn flex flex-col md:flex-row gap-8">
            <PriceBooksList 
              isCompareMode={isCompareMode}
              selectedBooks={selectedBooks}
              activeBook={activeBook}
              onSelectBook={handleSelectBook}
              onToggleCompareBook={handleToggleCompareBook}
            />

            {isCompareMode ? (
              <CompareBooksView 
                selectedBooks={selectedBooks}
                onExitCompare={() => setIsCompareMode(false)}
              />
            ) : (
              <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-[#d2af94]/30 flex flex-col min-h-[600px] overflow-hidden">
                <div className="px-8 py-6 bg-[#091d38] border-b border-[#f47729] shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 pointer-events-none">
                      <div className="w-12 h-12 rounded-[14px] bg-[#214573] text-white flex items-center justify-center border border-[#426a77]/50 shadow-sm overflow-hidden shrink-0">
                        <BookOpen size={24} className="text-[#f47729]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none mb-2 font-mono">{activeBook.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-[#5da7b3] bg-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-white/10 font-mono">ID: {activeBook.id}</span>
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest font-mono">UPDATED: {activeBook.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-5 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer">Edit Rules</button>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-4 border-b border-[#adb2b0]/30 bg-[#F0EAE1]/30 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                  <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e=>setSearchTerm(e.target.value)} 
                      placeholder="Search SKUs..." 
                      className="w-full pl-11 pr-4 h-[40px] text-[12px] border border-[#adb2b0]/40 rounded-xl font-black outline-none focus:border-[#af7a2b] bg-white shadow-sm transition-all uppercase" 
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsProductCompareMode(!isProductCompareMode)}
                      className={`px-5 h-[40px] border text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                        isProductCompareMode ? 'bg-[#214573] text-white border-[#214573] shadow-md' : 
                        selectedProducts.length > 0 ? 'bg-[#f47729] text-white border-[#f47729] shadow-md animate-pulse' : 
                        'bg-white border-[#214573]/40 text-[#214573] hover:bg-[#EAF2EA]'
                      }`}
                    >
                      <LineChartIcon size={16} /> 
                      {isProductCompareMode ? 'Exit Chart View' : 'Price Trends Chart '} 
                      {selectedProducts.length > 0 && !isProductCompareMode ? `(${selectedProducts.length})` : ''}
                    </button>
                    <button className="px-5 h-[40px] bg-white border border-[#2e3118]/20 text-[#2e3118] text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#EAF2EA] transition-all flex items-center gap-2 cursor-pointer">
                      <Plus size={16} /> Add Multiple SKU
                    </button>
                    <button className="px-8 h-[40px] bg-[#606934] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md hover:bg-[#2e3118] transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                  {isProductCompareMode ? (
                    <PriceTrendsChart 
                      selectedProducts={selectedProducts}
                      activeBook={activeBook}
                      onSelectProduct={handleToggleProduct}
                    />
                  ) : (
                    <table className="w-full text-left font-sans border-collapse font-mono">
                      <thead className="bg-[#f8f9fa] text-[#53483e] sticky top-0 z-10">
                        <tr>
                          <th className="py-4 px-6 w-12 border-b border-[#adb2b0]/40 text-center">
                            <Square size={16} className="text-[#8c7361] opacity-50 cursor-not-allowed mx-auto" />
                          </th>
                          <th className="py-4 px-8 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40">Product Identity</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-center">Category</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-right">Standard Price</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-right text-[#214573]">Book Price</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-center">Discount Margin</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#adb2b0]/20">
                        {MOCK_ITEMS.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => {
                          const isSelected = selectedProducts.includes(item.id);
                          const currentPrice = priceEdits[item.id] !== undefined ? priceEdits[item.id] : item.bookPrice;
                          const isDeviation = currentPrice < item.basePrice * 0.7 || currentPrice > item.basePrice;

                          return (
                            <tr key={idx} className={`hover:bg-[#EAF2EA]/30 transition-colors h-[64px] ${isSelected ? 'bg-[#EAF2EA]/20' : ''}`}>
                              <td className="py-3 px-6 text-center cursor-pointer" onClick={() => handleToggleProduct(item.id)}>
                                {isSelected ? <CheckSquare size={16} className="text-[#f47729] mx-auto" /> : <Square size={16} className="text-[#8c7361] mx-auto" />}
                              </td>
                              <td className="py-3 px-8">
                                <div className="flex flex-col">
                                  <span className="font-black text-[#2e3118] text-[12px] uppercase font-sans">{item.name}</span>
                                  <span className="text-[10px] font-bold text-[#8c7361]">{item.id}</span>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center text-[11px] font-bold text-[#8c7361]">{item.category}</td>
                              <td className="py-3 px-6 text-right font-black text-[13px] text-[#53483e] line-through decoration-[#e3624a]/40">{item.basePrice.toLocaleString()}</td>
                              <td className="py-3 px-6 text-right font-mono">
                                <div className="flex flex-col items-end gap-1">
                                  <div className="relative">
                                    <input 
                                      type="number" 
                                      value={currentPrice} 
                                      onChange={(e) => setPriceEdits({...priceEdits, [item.id]: Number(e.target.value)})}
                                      className={`w-28 px-3 py-1.5 border rounded-lg text-right font-black text-[14px] outline-none transition-all pr-8 ${
                                        isDeviation
                                          ? 'border-[#e3624a] text-[#e3624a] focus:border-[#e3624a] focus:ring-1 focus:ring-[#e3624a] bg-[#e3624a]/5' 
                                          : 'border-[#adb2b0]/40 text-[#214573] focus:border-[#f47729] focus:ring-1 focus:ring-[#f47729] bg-[#F0EAE1]/20'
                                      }`} 
                                    />
                                    {isDeviation && (
                                      <AlertTriangle size={14} className="text-[#e3624a] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    )}
                                  </div>
                                  {isDeviation && (
                                    <span className="text-[9px] font-bold text-[#e3624a] uppercase tracking-widest text-right">
                                      {currentPrice > item.basePrice ? 'Above Standard Price' : 'Unusually Low Margin'}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center font-black text-[11px] text-[#606934]">
                                {priceEdits[item.id] !== undefined ? `${Math.round(((item.basePrice - priceEdits[item.id]) / item.basePrice) * 100)}%` : item.margin}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
        </main>
    </div>
  );
}
