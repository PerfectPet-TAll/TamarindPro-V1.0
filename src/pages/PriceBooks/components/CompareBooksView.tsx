import React from 'react';
import { GitCompare } from 'lucide-react';
import { MOCK_PRICE_BOOKS, MOCK_ITEMS, MOCK_MULTI_BOOK_PRICES } from '../types';

interface CompareBooksViewProps {
  selectedBooks: string[];
  onExitCompare: () => void;
}

export default function CompareBooksView({
  selectedBooks,
  onExitCompare
}: CompareBooksViewProps) {
  return (
    <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-[#d2af94]/30 flex flex-col min-h-[600px] overflow-hidden">
      <div className="px-8 py-6 bg-[#091d38] border-b border-[#f47729] shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 pointer-events-none">
            <div className="w-12 h-12 rounded-[14px] bg-[#f47729] text-white flex items-center justify-center border border-[#426a77]/50 shadow-sm overflow-hidden shrink-0">
              <GitCompare size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none mb-2 font-mono">Compare Price Books</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-[#5da7b3] bg-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-white/10 font-mono">
                  Selected: {selectedBooks.length}/4
                </span>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest font-mono">
                  Select up to 4 books from the left panel
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={onExitCompare} 
              className="px-5 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              Exit Compare
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {selectedBooks.length > 0 ? (
          <table className="w-full text-left font-sans border-collapse">
            <thead className="bg-[#f8f9fa] text-[#53483e] sticky top-0 z-10 font-mono">
              <tr>
                <th className="py-4 px-8 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40">Product Identity</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-center">Standard</th>
                {selectedBooks.map(bookId => (
                  <th key={bookId} className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-right text-[#214573]">
                    {MOCK_PRICE_BOOKS.find(b => b.id === bookId)?.name || bookId}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#adb2b0]/20 font-mono">
              {MOCK_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#EAF2EA]/30 transition-colors h-[64px]">
                  <td className="py-3 px-8">
                    <div className="flex flex-col">
                      <span className="font-black text-[#2e3118] text-[12px] uppercase font-sans">{item.name}</span>
                      <span className="text-[10px] font-bold text-[#8c7361]">{item.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center font-black text-[13px] text-[#53483e] line-through decoration-[#e3624a]/40">
                    {item.basePrice.toLocaleString()}
                  </td>
                  {selectedBooks.map(bookId => {
                    const price = MOCK_MULTI_BOOK_PRICES[item.id]?.[bookId] || item.bookPrice;
                    return (
                      <td key={bookId} className="py-3 px-6 text-right font-black text-[14px] text-[#214573]">
                        {price.toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#8c7361] opacity-70 mt-12">
            <GitCompare size={48} className="mb-4 text-[#af7a2b]" />
            <h4 className="text-lg font-black uppercase tracking-widest text-[#214573]">Select Books to Compare</h4>
            <p className="text-[12px] mt-2 font-medium max-w-md">
              Click on up to 4 price books in the left panel to compare their SKU prices side-by-side to identify margin discrepancies easily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
