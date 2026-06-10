import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UPCOMING_PIS = [
    { title: "Asian Foods Co., Ltd.", pi: "PI-2606-001", items: "1,200 Boxes", etd: "15 June 2026", new: true },
    { title: "Euro Import GmbH", pi: "PI-2606-002", items: "500 Cartons", etd: "18 June 2026", new: true },
    { title: "US Trading Inc.", pi: "PI-2606-003", items: "8,000 Packs", etd: "22 June 2026", new: false },
    { title: "Middle East Spices", pi: "PI-2606-004", items: "300 Cartons", etd: "25 June 2026", new: false },
    { title: "Japan Snack Corp", pi: "PI-2606-005", items: "5,000 Packs", etd: "30 June 2026", new: false },
    { title: "Korea Distribution", pi: "PI-2606-006", items: "1,000 Cartons", etd: "05 July 2026", new: false },
];

export const UpcomingPICarousel = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollAmount = 300; // rough width of a card plus gap
            const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const cardWidth = 280 + 16; // width + gap approx
            const newIndex = Math.round(scrollLeft / cardWidth);
            setActiveIndex(newIndex);
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
            return () => currentRef.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="bg-[#fcfbf9] border border-[#e2e1df] rounded-[24px] p-5 shadow-sm relative w-full mb-6 mt-4">
            <div className="flex justify-between items-center gap-2">
                <button 
                    onClick={() => scroll('left')}
                    className="w-10 h-10 bg-[#6d7b87] rounded-md text-white flex items-center justify-center hover:bg-[#52606d] hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 focus:outline-none z-10 hidden sm:flex"
                >
                    <ChevronLeft size={20} />
                </button>

                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex gap-4 px-1 py-1 snap-x snap-mandatory"
                >
                    {UPCOMING_PIS.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[20px] w-[270px] shrink-0 snap-center snap-always border border-[#eae8e4] flex flex-col relative h-[185px] shadow-sm hover:shadow-md transition-shadow">
                            
                            {item.new && (
                                <div className="absolute top-0 left-0 overflow-hidden w-[100px] h-[100px] z-10 pointer-events-none rounded-tl-[20px]">
                                    <div className="absolute top-[20px] -left-[30px] w-[140px] bg-[#9e3a24] text-white text-[8px] font-black uppercase py-[3px] text-center -rotate-45 shadow-sm tracking-widest">
                                        NEW
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 px-5 pt-8 pb-2 flex flex-col items-center text-center">
                                <span className="text-[12px] font-black text-[#565f68]">PROFORMA INVOICE</span>
                                <span className="text-[10px] font-bold text-[#86919a] mb-1">({item.pi})</span>
                                <span className="text-[8.5px] font-semibold text-[#a9b3bd] tracking-wider uppercase">ลูกค้ารอจัดส่ง</span>
                                <span className="text-[14px] font-black text-[#1b3b55] leading-tight line-clamp-2 mt-1 px-2">
                                    {item.title}
                                </span>
                            </div>

                            <div className="px-3 pb-3 mt-auto">
                                <div className="bg-[#425263] rounded-xl flex items-center justify-between p-3 text-white shadow-inner relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                    
                                    <div className="flex flex-col flex-1 items-center border-r-[1.5px] border-dashed border-[#617488] pr-2 relative z-10">
                                        <span className="text-[8px] font-medium text-[#abb9cc] mb-0.5">ปริมาณจัดส่ง</span>
                                        <span className="text-[11px] font-black leading-tight text-center whitespace-nowrap">{item.items}</span>
                                        <div className="absolute -right-[3.5px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-[#425263] rounded-full border-[1.5px] border-[#a1afbf]"></div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 items-center pl-2 z-10">
                                        <span className="text-[8px] font-medium text-[#abb9cc] mb-0.5">กำหนดส่งมอบ</span>
                                        <span className="text-[11px] font-black text-center text-white">{item.etd}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => scroll('right')}
                    className="w-10 h-10 bg-[#6d7b87] rounded-md text-white flex items-center justify-center hover:bg-[#52606d] hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 focus:outline-none z-10 hidden sm:flex"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="flex justify-center items-center gap-2 mt-5 mb-1">
                {UPCOMING_PIS.map((_, idx) => (
                    <span 
                        key={idx}
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                            idx === activeIndex 
                                ? 'bg-[#1b3b55] ring-[3px] ring-offset-2 ring-[#a8b4c0] scale-110' 
                                : 'bg-[#a3b1c6] hover:bg-[#8695ad]'
                        }`}
                        onClick={() => {
                             if(scrollRef.current) {
                                 const cardWidth = 280 + 16;
                                 scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                             }
                        }}
                    ></span>
                ))}
            </div>
            
            <style>
                {`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </div>
    );
};
