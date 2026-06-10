import React from 'react';
import { Search, BookOpen, CheckSquare, Square } from 'lucide-react';
import KpiCard from '../../../components/shared/KpiCard';
import { PriceBook, MOCK_PRICE_BOOKS } from '../types';

interface PriceBooksListProps {
  isCompareMode: boolean;
  selectedBooks: string[];
  activeBook: PriceBook;
  onSelectBook: (book: PriceBook) => void;
  onToggleCompareBook: (bookId: string) => void;
}

export default function PriceBooksList({
  isCompareMode,
  selectedBooks,
  activeBook,
  onSelectBook,
  onToggleCompareBook
}: PriceBooksListProps) {
  return (
    <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4">
      <div className="bg-white p-5 rounded-[20px] shadow-sm border border-[#d2af94]/30">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7361]" />
          <input 
            type="text" 
            placeholder="Search Books..." 
            className="w-full pl-11 pr-4 h-[44px] text-[12px] border border-[#adb2b0]/40 rounded-xl font-black outline-none focus:border-[#214573] bg-[#EAF2EA]/30 focus:bg-white shadow-sm transition-all uppercase" 
          />
        </div>
        
        <div className="space-y-3">
          {MOCK_PRICE_BOOKS.map(book => {
            const isSelected = isCompareMode ? selectedBooks.includes(book.id) : activeBook.id === book.id;
            return (
              <div 
                key={book.id} 
                onClick={() => {
                  if (isCompareMode) {
                    onToggleCompareBook(book.id);
                  } else {
                    onSelectBook(book);
                  }
                }}
                className={`p-4 rounded-[16px] cursor-pointer transition-all border flex gap-3 ${
                  isSelected 
                    ? 'bg-[#214573] border-[#214573] shadow-md -translate-y-0.5 relative z-10' 
                    : 'bg-white border-[#d2af94]/30 hover:border-[#214573]/40 hover:bg-[#EAF2EA]'
                }`}
              >
                {isCompareMode && (
                  <div className="pt-0.5 shrink-0">
                    {isSelected ? <CheckSquare size={16} className="text-white" /> : <Square size={16} className="text-[#8c7361]" />}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`font-black text-[12px] tracking-tight uppercase ${isSelected ? 'text-white' : 'text-[#2e3118]'}`}>
                      {book.name}
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                      isSelected ? 'bg-white/20 text-[#f47729]' : 'bg-[#EAF2EA] text-[#606934]'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${isSelected ? 'text-white/60' : 'text-[#8c7361]'}`}>
                        Items: {book.items}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${isSelected ? 'text-white/60' : 'text-[#8c7361]'}`}>
                        Type: {book.type}
                      </span>
                    </div>
                    <div className={`text-[11px] font-black uppercase font-mono ${isSelected ? 'text-[#f47729]' : 'text-[#214573]'}`}>
                      {book.currency}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <KpiCard 
        label="Total Books" 
        value={MOCK_PRICE_BOOKS.length} 
        icon={BookOpen} 
        colorAccent="#af7a2b" 
        colorValue="#2e3118" 
        desc="Active in system" 
      />
    </div>
  );
}
