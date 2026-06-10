import React from 'react';
import { Pencil } from 'lucide-react';
import { Customer, getCategoryStyle, getStatusStyle } from '../types';

interface CustomerRowProps {
  item: Customer;
  onEdit: () => void;
}

export default function CustomerRow({ item, onEdit }: CustomerRowProps) {
  return (
    <tr className="hover:bg-[#EAF2EA]/50 transition-colors group h-[68px]">
      <td className="py-2.5 px-6 pl-8 align-middle whitespace-nowrap">
        <span className="inline-block font-mono font-bold text-[#53483e] text-[12px] leading-none bg-[#F0EAE1] px-2.5 py-1.5 rounded-[6px] border border-[#d2af94]/50">
          {item.id}
        </span>
      </td>
      <td className="py-2.5 px-6 align-middle font-bold text-[#2e3118] text-[13px] leading-tight">
        {item.name}
        <div className="text-[10px] text-[#8c7361] font-mono mt-1">Tax ID: {item.taxId || '-'}</div>
      </td>
      <td className="py-2.5 px-6 align-middle whitespace-nowrap">
        <span className={`inline-block px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm font-mono ${getCategoryStyle(item.cat)}`}>
          {item.cat}
        </span>
      </td>
      <td className="py-2.5 px-6 align-middle text-center whitespace-nowrap font-mono font-bold text-[#5167a2] text-[12px]">
        {item.credit}
      </td>
      <td className="py-2.5 px-6 align-middle whitespace-nowrap">
        <div className="text-[12px] font-bold text-[#2e3118]">{item.contact}</div>
        <div className="text-[10px] text-[#8c7361] font-mono mt-0.5">{item.phone || '-'}</div>
      </td>
      <td className="py-2.5 px-6 align-middle text-center whitespace-nowrap">
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border shadow-sm font-black font-mono ${getStatusStyle(item.status)}`}>
          {item.status}
        </span>
      </td>
      <td className="py-2.5 px-6 pr-8 align-middle whitespace-nowrap">
        <div className="flex justify-center items-center gap-[1px]">
          <button 
            type="button"
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#5167a2]/20 text-[#5167a2] hover:border-[#1f2a44] hover:bg-[#5167a2]/10 transition-colors shadow-sm bg-white active:scale-90 cursor-pointer" 
            title={`Edit / View ${item.id}`}
          >
            <Pencil size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
