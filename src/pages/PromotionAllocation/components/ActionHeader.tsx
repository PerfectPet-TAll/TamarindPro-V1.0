import React from 'react';
import { Target, Download, Plus } from 'lucide-react';

export default function ActionHeader() {
  return (
    <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#212c46] border border-[#eaeaec] shadow-sm relative overflow-hidden">
                <Target size={24} strokeWidth={2.5} />
            </div>
            <div>
                <h3 className="font-black text-[#212c46] uppercase tracking-widest text-[24px] leading-none">
                    PROMOTION <span className="text-[#a3acbe]">ALLOCATION</span>
                </h3>
                <div className="flex items-center gap-2 mt-[6px]">
                    <div className="w-8 h-[2px] bg-[#212c46]"></div>
                    <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] leading-none">
                        Sales & Marketing Budget Control
                    </p>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="h-10 px-5 rounded-xl bg-white border border-[#eaeaec] shadow-sm flex items-center gap-2 hover:bg-[#f8f9fa] transition-all text-[#212c46] font-black text-[11px] uppercase tracking-widest cursor-pointer">
                <Download size={14} /> Export Plan
            </button>
            <button className="h-10 px-5 rounded-xl bg-[#212c46] text-white shadow-sm flex items-center gap-2 hover:bg-[#1c273e] transition-all font-black text-[11px] uppercase tracking-widest cursor-pointer">
                <Plus size={14} /> New Campaign
            </button>
        </div>
    </div>
  );
}
