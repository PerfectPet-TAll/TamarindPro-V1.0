import React, { useState } from 'react';
import { Printer, Settings2, X, FileText, CheckCircle2 } from 'lucide-react';
import { DraggableModal } from './DraggableModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onPrint: () => void;
    children: React.ReactNode;
}

export function PrintPreviewModal({ isOpen, onClose, title, onPrint, children }: Props) {
    const [theme, setTheme] = useState<'color' | 'bw'>('color');
    const [version, setVersion] = useState<'original' | 'copy'>('original');
    const [hasWatermark, setHasWatermark] = useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            document.body.classList.remove('has-print-watermark');
            document.body.removeAttribute('data-print-watermark');
            setHasWatermark(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <DraggableModal isOpen={isOpen} onClose={onClose} title={title} width="max-w-[1200px]">
            <div className="flex h-[80vh] bg-slate-50 overflow-hidden font-sans">
                {/* Left Side: Controls */}
                <div className="w-[300px] shrink-0 border-r border-slate-200 bg-white flex flex-col items-center custom-scrollbar">
                    <div className="p-6 w-full flex-1 overflow-y-auto">
                        <div className="mb-6 pb-6 border-b border-slate-100 w-full">
                            <h3 className="font-bold text-[12px] uppercase tracking-widest text-[#091d38] mb-4 flex items-center gap-2"><Settings2 size={14}/> Print Settings</h3>
                            
                            <label className="block mb-4">
                                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Print Theme</span>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setTheme('color')}
                                        className={`flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${theme === 'color' ? 'bg-white shadow-sm text-[#f47729]' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Color
                                    </button>
                                    <button 
                                        onClick={() => setTheme('bw')}
                                        className={`flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${theme === 'bw' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        B&W
                                    </button>
                                </div>
                            </label>

                            <label className="block">
                                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Document Version</span>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => setVersion('original')}
                                        className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all ${version === 'original' ? 'border-[#091d38] bg-[#091d38]/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className={version === 'original' ? 'text-[#091d38]' : 'text-slate-400'}/>
                                            <span className={`text-[12px] font-bold ${version === 'original' ? 'text-[#091d38]' : 'text-slate-600'}`}>1. ORIGINAL</span>
                                        </div>
                                        {version === 'original' && <CheckCircle2 size={16} className="text-[#091d38]"/>}
                                    </button>
                                    <button 
                                        onClick={() => setVersion('copy')}
                                        className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all ${version === 'copy' ? 'border-[#091d38] bg-[#091d38]/5' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className={version === 'copy' ? 'text-[#091d38]' : 'text-slate-400'}/>
                                            <span className={`text-[12px] font-bold ${version === 'copy' ? 'text-[#091d38]' : 'text-slate-600'}`}>2. DUPLICATE COPY</span>
                                        </div>
                                        {version === 'copy' && <CheckCircle2 size={16} className="text-[#091d38]"/>}
                                    </button>
                                </div>
                            </label>
                            <label className="block mt-6">
                                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Security Overlay</span>
                                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded text-[#091d38] focus:ring-[#091d38]"
                                        checked={hasWatermark}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setHasWatermark(isChecked);
                                            if (isChecked) {
                                                document.body.classList.add('has-print-watermark');
                                                document.body.setAttribute('data-print-watermark', 'CONFIDENTIAL');
                                            } else {
                                                document.body.classList.remove('has-print-watermark');
                                                document.body.removeAttribute('data-print-watermark');
                                            }
                                        }}
                                    />
                                    <span className="text-[12px] font-bold text-slate-700">CONFIDENTIAL WATERMARK</span>
                                </label>
                            </label>
                            
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border-t border-slate-200 w-full shrink-0">
                        <button 
                            onClick={onPrint} 
                            className="w-full px-6 py-3 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-[#091d38] text-white hover:bg-[#1a2d48] shadow-md hover:-translate-y-0.5"
                        >
                            <Printer size={16}/> Finalize PDF
                        </button>
                    </div>
                </div>

                {/* Right Side: Preview */}
                <div className="flex-1 overflow-y-auto bg-slate-400 p-8 flex flex-col items-center custom-scrollbar relative">
                     <div className={`transition-all duration-300 ${theme === 'bw' ? 'grayscale' : ''}`}>
                         {children}
                     </div>
                </div>
            </div>
            {/* INJECT PRINT VERSION HEADER/FOOTER CSS HACK BASED ON VERSION PROPS */}
            {version === 'copy' && (
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body::before { content: "DUPLICATE COPY"; position: fixed; top: 10mm; right: 10mm; font-size: 14pt; font-family: monospace; font-weight: bold; color: black; z-index: 999999; }
                    }
                `}}/>
            )}
            {version === 'original' && (
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body::before { content: "ORIGINAL"; position: fixed; top: 10mm; right: 10mm; font-size: 14pt; font-family: monospace; font-weight: bold; color: black; z-index: 999999; }
                    }
                `}}/>
            )}
        </DraggableModal>
    );
}
