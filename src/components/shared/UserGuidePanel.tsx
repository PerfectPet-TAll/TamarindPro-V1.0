import React from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';

export interface GuideBullet {
    icon?: string;
    iconColor?: string;
    bgColor?: string;
    borderColor?: string;
    title?: string;
    titleColor?: string;
    text: React.ReactNode;
}

export interface GuideSection {
    id: string;
    title: string;
    icon?: string;
    iconColor?: string;
    description?: React.ReactNode;
    bullets?: GuideBullet[];
}

export interface UserGuidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    desc?: string;
    sections?: GuideSection[];
    children?: React.ReactNode;
}

export const UserGuidePanel = ({ isOpen, onClose, title = "GUIDELINES", desc = "System Documentation", sections, children }: UserGuidePanelProps) => {
    if (!isOpen || typeof document === 'undefined') return null;

    const renderIcon = (name?: string, color?: string, size = 18, className = "") => {
        if (!name) return null;
        const IconComp = (Icons as any)[name] || Icons.CircleHelp;
        return <IconComp size={size} className={className} style={color ? { color } : undefined} />;
    };

    return createPortal(
        <>
            <div className="fixed inset-0 z-[190] bg-[#2e3118]/60 backdrop-blur-sm transition-opacity duration-500 opacity-100" onClick={onClose}/>
            <div className="fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#af7a2b] translate-x-0">
                <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#af7a2b] bg-[#2e3118] text-white shrink-0">
                    <div>
                        <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.BookOpen size={22} className="text-[#af7a2b]"/> {title}</h3>
                        <p className="text-[12px] font-bold text-[#e7dedd] uppercase tracking-widest mt-1.5">{desc}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/50 hover:text-[#e3624a] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#091d38] text-[12px] leading-relaxed custom-scrollbar bg-white">
                    {children ? children : sections ? sections.map((section, index) => (
                        <section key={section.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                            <h4 className="text-[14px] font-black text-[#2e3118] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#e7dedd] pb-2 font-mono">
                                {renderIcon(section.icon, section.iconColor || "#af7a2b", 18, "shrink-0")} {index + 1}. {section.title}
                            </h4>
                            {section.description && <div className="text-[12px] mb-3">{section.description}</div>}
                            {section.bullets && section.bullets.length > 0 && (
                                <ul className="list-none pl-0 space-y-3">
                                    {section.bullets.map((bullet, i) => (
                                        <li key={i} className={`flex items-start gap-2 p-3 rounded-xl border ${bullet.bgColor || 'bg-[#f8f9fa]'} ${bullet.borderColor || 'border-[#e2d1c3]'}`}>
                                            {renderIcon(bullet.icon || 'Circle', bullet.iconColor || "#8c7361", 16, "shrink-0 mt-0.5")}
                                            <div>
                                                {bullet.title && <strong style={{ color: bullet.titleColor || "#2e3118" }} className="mr-1">{bullet.title}:</strong>}
                                                <span className="opacity-90">{bullet.text}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )) : (
                        <p className="font-mono">{desc}</p>
                    )}
                </div>
                
                <div className="p-4 bg-[#f8f9fa] border-t border-[#e2d1c3] flex justify-end shrink-0">
                    <button onClick={onClose} className="px-8 py-2.5 bg-[#2e3118] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#091d38] hover:text-white transition-all shadow-md tracking-[0.1em]">Got It</button>
                </div>
            </div>
        </>, document.body
    );
};
