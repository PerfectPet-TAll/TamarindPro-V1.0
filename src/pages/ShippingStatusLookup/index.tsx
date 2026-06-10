import React, { useState } from 'react';
import { Search, PackageSearch, Loader2, MapPin, Calendar, Ship, AlertCircle, Info, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GlassCard from '../../components/shared/GlassCard';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

export default function ShippingStatusLookup() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [statusData, setStatusData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showGuide, setShowGuide] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) return;

        setLoading(true);
        setError('');
        setStatusData('');

        try {
            const res = await fetch('/api/shipping-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingNumber })
            });
            const data = await res.json();
            
            if (data.success) {
                setStatusData(data.data);
            } else {
                setError(data.message || 'เกิดข้อผิดพลาดในการค้นหา');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent relative animate-fadeIn">
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>

            {/* HEADER SECTION */}
            <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#091d38] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#091d38]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <PackageSearch size={28} strokeWidth={2.5} className="text-[#091d38]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            SHIPPING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214573] to-[#f47729]">STATUS LOOKUP</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            REAL-TIME CONTAINER TRACKING VIA AI COPILOT
                        </p>
                    </div>
                </div>
            </div>

            <main className="w-full px-4 sm:px-8 mb-8 mt-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                <div className="w-full mt-4 flex-1 flex flex-col min-h-0  xl:w-2/3 mx-auto">
                <GlassCard className="p-8 mb-6 border border-[#cdd0db]/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent opacity-20 transform rotate-12 transition-transform duration-700 group-hover:rotate-45" />
                    
                    <h2 className="text-[14px] font-black uppercase tracking-widest text-[#091d38] mb-4 flex items-center gap-2">
                        <Search size={18} className="text-[#5167a2]" />
                        Tracking Number Lookup
                    </h2>
                    <form onSubmit={handleSearch} className="flex gap-3 relative z-10 w-full mb-6">
                        <input
                            type="text"
                            placeholder="Enter Container / B/L / Tracking Number"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="flex-1 h-12 px-5 bg-white border border-[#adb2b0] rounded-xl font-bold text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm uppercase tracking-wider text-sm placeholder:text-[#adb2b0]/70"
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !trackingNumber.trim()}
                            className="h-12 px-8 bg-[#091d38] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#214573] transition-colors shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "TRACK"}
                        </button>
                    </form>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                         <Info size={18} className="text-[#5167a2] shrink-0 mt-0.5" />
                         <p className="text-[11px] font-semibold text-slate-600 leading-relaxed uppercase tracking-widest">
                           AI Copilot จะใช้โครงข่าย Search Grounding เพื่อดึงข้อมูลสถานะล่าสุดแบบ Real-time จากผู้ให้บริการขนส่งสาธารณะโดยไม่ต้องตั้งค่า API ภายนอก
                         </p>
                    </div>
                </GlassCard>

                {error && (
                    <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 animate-fadeIn mb-6 shadow-sm">
                        <AlertCircle size={20} className="shrink-0" />
                        <span className="font-bold text-sm tracking-wider uppercase">{error}</span>
                    </div>
                )}

                {statusData && !loading && (
                    <GlassCard className="p-8 border border-[#cdd0db]/50 relative animate-fadeIn">
                         <div className="absolute top-0 left-0 w-2 h-full bg-[#f47729]" />
                         <h3 className="text-[12px] font-black uppercase tracking-widest text-[#091d38] mb-6 flex items-center gap-2">
                             <MapPin size={16} className="text-[#f47729]" />
                             Tracking Result
                         </h3>
                         <div className="prose prose-sm max-w-none text-[#2e3118] font-bold markdown-body bg-white p-6 rounded-xl border border-[#e2e8f0]">
                            <ReactMarkdown>{statusData}</ReactMarkdown>
                         </div>
                    </GlassCard>
                )}
                </div>
            </main>

            <UserGuidePanel 
                isOpen={showGuide} 
                onClose={() => setShowGuide(false)} 
                title="Shipping Status Lookup Guide"
                desc="คู่มือการติดตามสถานะการขนส่งสินค้า"
                sections={[
                    {
                        id: "1",
                        title: "ค้นหาสถานะขนส่ง (Tracking)",
                        icon: "Search",
                        description: "ค้นหาด้วยรหัสคอนเทนเนอร์หรือ B/L",
                        bullets: [
                            { icon: "Ship", iconColor: "#f47729", title: "Container/B/L", text: "กรอกหมายเลข Tracking ของคอนเทนเนอร์" },
                            { icon: "MapPin", iconColor: "#091d38", title: "AI Tracking", text: "ให้ข้อมูลแบบ Real-time ด้วย AI Copilot" }
                        ]
                    }
                ]}
            />
        </div>
    );
}
