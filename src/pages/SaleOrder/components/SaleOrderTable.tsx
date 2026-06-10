import React from 'react';
import * as Icons from 'lucide-react';

const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED': return `bg-[#398797]/10 text-[#398797] border-[#398797]/30`;
        case 'SHIPPED': return `bg-[#5da7b3]/10 text-[#5da7b3] border-[#5da7b3]/30`;
        case 'PRODUCTION': return `bg-[#ffa64a]/10 text-[#ffa64a] border-[#ffa64a]/30`;
        case 'PENDING': return `bg-[#8c7361]/10 text-[#2e3118] border-[#8c7361]/30`;
        case 'CANCELLED': return `bg-[#f47729]/10 text-[#f47729] border-[#f47729]/30`;
        case 'DRAFT': return 'bg-slate-100 text-slate-500 border-slate-300';
        default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
};

export const SaleOrderTable = ({ paginatedData }: { paginatedData: any[] }) => {
    return (
        <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-[#2e3118] text-white border-b-2 border-[#af7a2b]">
                    <tr>
                        <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest">SO Number</th>
                        <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest">Customer</th>
                        <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest text-right">Amount</th>
                        <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest text-center">Status</th>
                        <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#adb2b0]">
                    {paginatedData.map(order => (
                        <tr key={order.soNumber} className="hover:bg-[#f8f9fa] group transition-colors">
                            <td className="py-3 px-6"><span className="text-[12px] font-bold text-[#f47729] font-mono">{order.soNumber}</span></td>
                            <td className="py-3 px-6"><span className="text-[12px] font-black text-[#2e3118] uppercase">{order.customer}</span></td>
                            <td className="py-3 px-6 text-right"><span className="text-[12px] font-black text-[#2e3118] font-mono">฿{order.financialSummary.grandTotal.toLocaleString()}</span></td>
                            <td className="py-3 px-6 text-center"><span className={`text-[11px] font-black uppercase px-2 py-1 border rounded-md ${getStatusStyle(order.status)}`}>{order.status}</span></td>
                            <td className="py-3 px-6 text-center">
                                <div className="flex justify-center gap-1">
                                    <button className="w-8 h-8 rounded-lg border border-[#adb2b0] text-[#8c7361] hover:bg-[#2e3118] hover:text-[#af7a2b] flex items-center justify-center transition-colors"><Icons.Eye size={14}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
