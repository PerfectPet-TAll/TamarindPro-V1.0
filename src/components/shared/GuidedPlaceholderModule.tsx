import React, { useState } from 'react';
import { Database, HelpCircle } from 'lucide-react';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

export default function GuidedPlaceholderModule({ 
    title, desc, guideTitle, guideDesc, icon: Icon = Database, sections 
}: any) {
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent relative animate-fadeIn h-full">
            <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 pt-2 flex flex-col justify-center">
                <div className="w-full px-4 sm:px-8 py-12 text-center animate-fadeIn flex-1 flex flex-col justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#091d38] flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-[#5da7b3]">
                        <Icon size={28} className="text-[#5167a2]" />
                    </div>
                    <h2 className="text-xl font-black text-[#2e3118] uppercase tracking-tight mb-3">{title}</h2>
                    <div className="rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 bg-white/50 max-w-sm mx-auto py-8">
                        <p className="text-[10px] text-[#53483e] font-bold leading-relaxed mb-6">
                            {desc || `Workspace "${title}" is ready.`}
                        </p>
                    </div>
                </div>
            </main>

            <UserGuidePanel 
                isOpen={showGuide} 
                onClose={() => setShowGuide(false)} 
                title={guideTitle}
                desc={guideDesc}
                sections={sections}
            />
        </div>
    );
}
