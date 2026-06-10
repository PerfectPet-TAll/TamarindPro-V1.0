import React from 'react';
import { Category } from '../types';

interface ProductCardProps {
  product: any;
  categories: Category[];
  onClick: () => void;
}

export default function ProductCard({ product, categories, onClick }: ProductCardProps) {
  const catLabel = categories.find(c => c.id === product.catId)?.label || product.catId;
  return (
    <div 
      onClick={onClick} 
      className="group bg-white rounded-[22px] border border-[#d2af94]/30 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer text-center relative h-[210px] flex flex-col font-mono"
    >
      <div className="h-[130px] overflow-hidden bg-slate-100 relative shrink-0">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300x200'} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={product.name} 
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-md text-[8px] font-black uppercase tracking-widest text-[#214573] border border-[#214573]/20">
          {catLabel}
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="font-black text-[#2e3118] text-[11px] leading-tight line-clamp-1 uppercase font-sans">
            {product.name}
          </h4>
          <span className="text-[9px] font-mono font-bold text-[#8c7361] block">
            {product.id}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[#F0EAE1]/50">
          <span className="text-[14px] font-black text-[#f47729] font-mono">
            ฿{product.price.toLocaleString()}
          </span>
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}
