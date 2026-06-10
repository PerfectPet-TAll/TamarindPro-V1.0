import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

interface PIStatusTrackerProps {
    piNo: string;
    currentStepIndex: number;
}

const STEPS = [
    { id: 'open_pi', label: 'เปิด PI' },
    { id: 'factory_po', label: 'Issue Factory PO (OEM)' },
    { id: 'booking', label: 'BOOKING' },
    { id: 'booking_confirmation', label: 'BOOKING CONFIRMATION' },
    { id: 'shipping_instruction', label: 'SHIPPING INSTRUCTION' },
    { id: 'loading_notice', label: 'LOADING NOTICE' },
    { id: 'packing_list', label: 'PACKING LIST' },
    { id: 'commercial_invoice', label: 'COMMERCIAL INVOICE' },
    { id: 'dispatch', label: 'Dispatch Container & Truck' },
];

export function PIStatusTracker({ piNo, currentStepIndex }: PIStatusTrackerProps) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm w-full mb-6 relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#e67e22]/5 to-transparent pointer-events-none blur-3xl"></div>
             
             <div className="flex items-center justify-between mb-6 relative z-10">
                 <div>
                    <h3 className="text-[14px] font-black tracking-widest text-[#091d38] uppercase flex items-center gap-2">
                        <Clock size={16} className="text-[#e67e22]" />
                        STATUS TRACKER: <span className="text-[#e67e22]">{piNo}</span>
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        Supply Chain Progress
                    </p>
                 </div>
                 <div className="bg-[#e67e22]/10 text-[#e67e22] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-[#e67e22]/20 shadow-sm">
                     {Math.round((currentStepIndex / (STEPS.length - 1)) * 100)}% Completed
                 </div>
             </div>

             <div className="relative z-10 w-full overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex items-start min-w-max pt-2 px-2">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        
                        return (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center w-24 relative group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 shadow-sm bg-white
                                        ${isCompleted ? 'border-[#e67e22] bg-[#e67e22] text-white' : 
                                          isCurrent ? 'border-[#e67e22] text-[#e67e22] ring-4 ring-[#e67e22]/20 scale-110' : 
                                          'border-slate-200 text-slate-300'}`}
                                    >
                                        {isCompleted ? <CheckCircle2 size={20} /> : <span className="text-[11px] font-black">{index + 1}</span>}
                                    </div>
                                    <div className={`mt-3 text-center transition-all duration-300 ${isCurrent ? 'scale-105' : ''}`}>
                                        <p className={`text-[10px] uppercase font-black tracking-wider leading-tight w-24
                                            ${isCurrent ? 'text-[#e67e22]' : isCompleted ? 'text-[#091d38]' : 'text-slate-400'}`}>
                                            {step.label}
                                        </p>
                                        {isCurrent && (
                                            <p className="text-[9px] font-bold text-[#e67e22] mt-1 animate-pulse">In Progress</p>
                                        )}
                                    </div>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className="w-16 h-[2px] mx-1 -mt-8 relative hidden sm:block">
                                        <div className={`absolute inset-0 transition-all duration-500
                                            ${isCompleted ? 'bg-[#e67e22]' : 'bg-slate-200'}`}
                                        ></div>
                                         {isCurrent && (
                                            <div className="absolute inset-0 bg-[#e67e22] w-1/2 animate-pulse"></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
             </div>
        </div>
    );
}
