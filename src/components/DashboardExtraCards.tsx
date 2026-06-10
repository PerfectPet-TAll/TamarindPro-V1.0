import React from 'react';
import { BookOpen, Award, Newspaper, AlertCircle, FileText, Send, Plus, ArrowUpRight } from 'lucide-react';

const NEW_PRODUCTS = [
  { img: 'https://images.unsplash.com/photo-1599813098555-520e5e01ca2f?w=400&q=80', title: 'Premium Tamarind Paste', sub: 'GRADE A - 500G', category: 'Culinary Paste', date: '12 MAY' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-M60uN09YV_tO2tU1Q0rP8B-o0g36X2Qtw&s', title: 'Spicy Tamarind Candy', sub: 'RETAIL PACK - 100G', category: 'Confectionery', date: '10 MAY' },
  { img: 'https://images.unsplash.com/photo-1626015509705-cb13be0daefa?w=400&q=80', title: 'Tamarind Concentrate', sub: 'BULK DRUM - 50KG', category: 'Industrial', date: '08 MAY' },
];

const TOP_REPS = [
  { name: 'Sarah Jenkins', role: 'EU Region Director', score: '124%', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'David Chen', role: 'APAC Sales Lead', score: '112%', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
];

const MARKET_INSIGHTS = [
  { img: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c50a63?w=500&q=80', badge: 'SHIPPING', date: '14 May 2026', title: 'Freight rates to Europe show signs of stabilization' },
  { img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80', badge: 'MARKET TREND', date: '12 May 2026', title: 'Surge in organic tamarind demand across North America' },
  { img: 'https://images.unsplash.com/photo-1511135232973-c3ee80040060?w=500&q=80', badge: 'REGULATION', date: '10 May 2026', title: 'New EU import documentation requirements announced' },
];

const ALERTS = [
  { type: 'critical', title: 'Shipment Delayed: V-2900', desc: 'Vessel delayed at transit port. Update customer immediately. Ensure all documentary evidence is ready.', icon: AlertCircle, bg: 'bg-[#faecec]', text: 'text-[#9c3636]', iconText: 'text-[#9c3636]' },
  { type: 'info', title: 'FDA Certificate Expiring', desc: 'Facility FDA registration expires in 30 days. Renewal process should be initiated immediately.', icon: FileText, bg: 'bg-[#e7f0ee]', text: 'text-[#2e5950]', iconText: 'text-[#2e5950]' },
];

export const DashboardExtraCards = () => {
    return (
        <div className="flex flex-col gap-5 mb-6">
            {/* ROW 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left: New Deals (Span 2) */}
                <div className="lg:col-span-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-[24px] p-6 shadow-sm relative w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-[#475569]" />
                            <h3 className="text-[13px] font-black tracking-[0.1em] uppercase text-[#1e293b]">LATEST EXPORT DEALS</h3>
                        </div>
                        <button className="px-4 py-1.5 bg-[#e2e8f0] text-[#334155] rounded-full text-[10px] font-black tracking-wider uppercase border border-[#cbd5e1] hover:bg-[#cbd5e1] transition-colors">
                            VIEW ALL
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {NEW_PRODUCTS.map((prod, i) => (
                            <div key={i} className="bg-white border border-[#e2e8f0] rounded-[20px] p-5 flex flex-col items-center hover:shadow-md transition-shadow relative">
                                <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden mb-4 shadow-sm relative border border-slate-100">
                                    <img src={prod.img} className="w-full h-full object-cover" alt="Product" />
                                    <div className="absolute -bottom-2 -right-2 w-[24px] h-[24px] bg-[#3b82f6] rounded-md border-2 border-white flex items-center justify-center text-white">
                                        <ArrowUpRight size={12} strokeWidth={3} />
                                    </div>
                                </div>
                                <h4 className="text-[13px] font-bold text-[#1e293b] text-center mb-1 leading-tight px-1">{prod.title}</h4>
                                <p className="text-[9px] font-black text-[#0ea5e9] uppercase tracking-widest mb-1">{prod.sub}</p>
                                <p className="text-[10px] font-medium text-[#64748b] mb-5">{prod.category}</p>
                                
                                <div className="w-full mt-auto pt-4 border-t border-[#f1f5f9] flex justify-between items-center">
                                    <span className="text-[9px] font-black text-[#94a3b8] tracking-[0.1em] uppercase">JOIN</span>
                                    <span className="text-[10px] font-black text-[#334155] uppercase">{prod.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Top Reps (Span 1) */}
                <div className="lg:col-span-1 bg-[#f9fafb] border border-[#e5e7eb] rounded-[24px] p-6 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Award size={18} className="text-[#ef4444]" />
                        <h3 className="text-[13px] font-black tracking-[0.1em] uppercase text-[#1e293b]">TOP PERFORMING REPS</h3>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                        {TOP_REPS.map((rep, i) => (
                            <div key={i} className={`flex items-center p-3 rounded-[16px] border ${i===0 ? 'bg-white border-[#fca5a5]/40 shadow-sm' : 'bg-white border-[#e2e8f0]'}`}>
                                <img src={rep.img} className="w-10 h-10 rounded-full border border-[#e2e8f0] mr-3 object-cover" alt="Rep" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[12px] font-black text-[#1e293b] truncate leading-tight">{rep.name}</h4>
                                    <p className="text-[10px] font-medium text-[#64748b] truncate mt-0.5">{rep.role}</p>
                                </div>
                                <div className="text-[11px] font-black text-[#ef4444] ml-2 shrink-0">{rep.score}</div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 w-full py-3 bg-[#bca465] hover:bg-[#a68f54] text-white rounded-[12px] text-[10px] font-black uppercase tracking-widest shadow-sm transition-colors flex justify-center items-center gap-2">
                        <Send size={12} /> SEND COMMENDATION
                    </button>
                </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left: Insights (Span 2) */}
                <div className="lg:col-span-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-[24px] p-6 shadow-sm relative w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Newspaper size={18} className="text-[#475569]" />
                            <h3 className="text-[13px] font-black tracking-[0.1em] uppercase text-[#1e293b]">MARKET INSIGHTS & NEWS</h3>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 bg-[#cd7f45] text-white rounded-md text-[10px] font-black tracking-wider uppercase hover:bg-[#ba703b] shadow-sm transition-colors flex items-center gap-1">
                                <Plus size={11} strokeWidth={3} /> ADD UPDATE
                            </button>
                            <button className="px-4 py-1.5 bg-white text-[#334155] rounded-md text-[10px] font-black tracking-wider uppercase border border-[#cbd5e1] hover:bg-[#f1f5f9] transition-colors">
                                ALL
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {MARKET_INSIGHTS.map((item, i) => (
                            <div key={i} className="bg-white border border-[#e2e8f0] rounded-[20px] overflow-hidden flex flex-col hover:shadow-md transition-all group">
                                <div className="h-[120px] relative overflow-hidden">
                                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#3b82f6]/90 backdrop-blur-sm text-white text-[8px] font-black tracking-[0.05em] uppercase rounded-[4px]">
                                        {item.badge}
                                    </div>
                                    <div className="absolute bottom-2 right-3 text-white/95 text-[9px] font-bold">
                                        {item.date}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-center">
                                    <h4 className="text-[12.5px] font-bold text-[#1e293b] leading-[1.4] line-clamp-2">{item.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Alerts (Span 1) */}
                <div className="lg:col-span-1 bg-[#f9fafb] border border-[#e5e7eb] rounded-[24px] p-6 shadow-sm flex flex-col">
                     <div className="flex items-center gap-2 mb-6">
                        <AlertCircle size={18} className="text-[#ef4444]" />
                        <h3 className="text-[13px] font-black tracking-[0.1em] uppercase text-[#1e293b]">LOGISTICS ALERTS</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {ALERTS.map((alert, i) => {
                            const Icon = alert.icon;
                            return (
                                <div key={i} className={`${alert.bg} rounded-[16px] p-4 flex gap-3 relative overflow-hidden`}>
                                    <Icon size={16} className={`${alert.iconText} shrink-0 mt-0.5`} strokeWidth={2.5} />
                                    <div>
                                        <h4 className={`text-[12px] font-bold ${alert.text} mb-1.5 leading-tight pr-2`}>{alert.title}</h4>
                                        <p className={`text-[10px] font-medium ${alert.text} opacity-80 leading-[1.5] pr-1`}>{alert.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
