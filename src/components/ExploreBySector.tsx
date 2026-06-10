import React from 'react';
import { 
    FileText, FileSignature, Factory, Activity, 
    CalendarPlus, CalendarCheck, Ship, Box, 
    ListChecks, Truck, FolderOpen, TrendingUp, Hexagon
} from 'lucide-react';

const SHORTCUTS = [
    { id: 'pi', title: 'Proforma Invoice (PI)', sub: 'ใบแจ้งหนี้ล่วงหน้า', icon: FileText },
    { id: 'quote', title: 'Quotations & Proposals', sub: 'ใบเสนอราคา', icon: FileSignature },
    { id: 'factory_po', title: 'Issue Factory PO (OEM)', sub: 'ออกใบสั่งผลิต', icon: Factory },
    { id: 'production', title: 'Production Tracking', sub: 'ติดตามสถานะการผลิต', icon: Activity },
    { id: 'booking_req', title: 'BOOKING REQUEST', sub: 'คำขอจองระวางเรือ', icon: CalendarPlus },
    { id: 'booking_conf', title: 'BOOKING CONFIRMATION', sub: 'ยืนยันการจองระวางเรือ', icon: CalendarCheck },
    { id: 'shipping_inst', title: 'SHIPPING INSTRUCTION', sub: 'คำสั่งจัดส่งสินค้า', icon: Ship },
    { id: 'loading_notice', title: 'ใบแจ้งขึ้นตู้', sub: 'Loading Notice', icon: Box },
    { id: 'packing_list', title: 'PACKING LIST', sub: 'ใบรายการบรรจุหีบห่อ', icon: ListChecks },
    { id: 'dispatch', title: 'Dispatch Container & Truck', sub: 'จัดการระบบขนส่ง', icon: Truck },
    { id: 'export_docs', title: 'Export Documentation', sub: 'เอกสารส่งออก', icon: FolderOpen },
    { id: 'revenue', title: 'Revenue Forecast', sub: 'คาดการณ์รายได้', icon: TrendingUp },
];

export const ExploreBySector = () => {
    return (
        <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6 md:p-8 shadow-sm mb-6 relative overflow-hidden">
            <div className="flex flex-col mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-[#9c3636] flex items-center justify-center border border-red-100">
                        <span className="font-bold text-lg leading-none">@</span>
                    </div>
                    <h2 className="text-[14px] font-black text-[#1e293b] uppercase tracking-widest flex items-center gap-2">
                        EXPLORE BY SECTOR <span className="text-[#64748b] font-normal">/</span> <span className="text-[#64748b] font-bold">สำรวจแยกตามหมวดหมู่</span>
                    </h2>
                </div>
                <p className="text-[10px] font-black tracking-widest uppercase text-[#94a3b8] ml-11">
                    QUICK SHORTCUT HUBS TO CENTRAL DATABASE SECTORS AND PROCESSES
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {SHORTCUTS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <button 
                            key={idx}
                            className="group relative flex flex-col items-center justify-center p-4 bg-white border border-[#e2e8f0] rounded-[16px] hover:bg-[#091d38] hover:border-[#091d38] transition-all duration-300 shadow-sm hover:shadow-md h-[120px]"
                        >
                            <Icon size={28} className="text-[#9c3636] mb-3 group-hover:text-[#f47729] transition-colors duration-300" strokeWidth={1.5} />
                            <h3 className="text-[10px] font-black text-[#1e293b] text-center uppercase tracking-widest leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2 px-1">
                                {item.title}
                            </h3>
                            <p className="text-[9px] font-bold text-[#64748b] text-center mt-1.5 group-hover:text-[#cbd5e1] transition-colors duration-300 line-clamp-1">
                                {item.sub}
                            </p>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
