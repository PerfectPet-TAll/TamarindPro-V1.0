import React from 'react';
import { Pencil } from 'lucide-react';
import { SalesRep, getTeamStyle, getStatusStyle } from '../types';

interface SaleRepRowProps {
  item: SalesRep;
  onEdit: () => void;
}

export default function SaleRepRow({ item, onEdit }: SaleRepRowProps) {
  return (
    <tr className="hover:bg-[#EAF2EA]/50 transition-colors group h-[68px]">
      <td className="py-2.5 px-6 pl-8 align-middle whitespace-nowrap">
        <span className="inline-block font-mono font-bold text-[#53483e] text-[12px] leading-none bg-[#F0EAE1] px-2.5 py-1.5 rounded-[6px] border border-[#d2af94]/50">
          {item.id}
        </span>
      </td>
      <td className="py-2.5 px-6 align-middle font-bold text-[#2e3118] text-[13px] leading-tight">
        <div className="flex items-center gap-3">
          <img src={item.avatar || 'https://i.pravatar.cc/150'} className="w-10 h-10 rounded-[10px] object-cover border border-[#d2af94]/50 shadow-sm" alt="Avatar"/>
          <div className="flex flex-col">
            <span className="font-black text-[#2e3118] text-[12px] uppercase">{item.name}</span>
            <span className="text-[10px] font-mono font-bold text-[#8c7361] mt-0.5">AKA: {item.nickname || '-'}</span>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-6 align-middle text-center whitespace-nowrap font-mono">
        <div className="text-[11px] font-bold text-[#2e3118]">{item.mobile}</div>
        <div className="text-[10px] text-[#5167a2] mt-0.5">{item.email}</div>
      </td>
      <td className="py-2.5 px-6 align-middle whitespace-nowrap text-center">
        <span className={`inline-block px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm font-mono ${getTeamStyle(item.team)}`}>
          {item.team}
        </span>
        <div className="text-[9px] text-[#8c7361] mt-1 uppercase font-bold truncate max-w-[150px] mx-auto">{item.region}</div>
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
            title={`Edit ${item.id}`}
          >
            <Pencil size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
