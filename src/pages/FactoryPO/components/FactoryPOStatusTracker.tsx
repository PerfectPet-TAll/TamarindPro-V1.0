import React from 'react';
import { Check, ClipboardList, PenTool, Truck, PackageCheck, XSquare } from 'lucide-react';

interface FactoryPOStatusTrackerProps {
    status: string;
}

const STEPS = [
    { label: 'Draft', activeStatus: ['Draft'] },
    { label: 'Pending Approval', activeStatus: ['Pending'] },
    { label: 'Confirmed', activeStatus: ['Approved'] },
    { label: 'Completed', activeStatus: ['Completed'] }
];

const ICONS = [ClipboardList, PenTool, PackageCheck, Truck];

export const FactoryPOStatusTracker: React.FC<FactoryPOStatusTrackerProps> = ({ status }) => {
    // If cancelled, show a specific error state
    if (status === 'Cancelled') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center justify-center gap-4 shadow-sm w-full">
                <XSquare size={32} className="text-red-500" />
                <div>
                    <h3 className="text-red-600 font-black uppercase text-[15px] tracking-widest">Order Cancelled</h3>
                    <p className="text-red-400 text-[12px] font-bold mt-1">This production authorization has been cancelled.</p>
                </div>
            </div>
        );
    }

    let currentIndex = STEPS.findIndex(s => s.activeStatus.includes(status));
    if (currentIndex === -1) currentIndex = 0; // Default to draft if unknown

    return (
        <div className="w-full relative">
            {/* Connecting Lines */}
            <div className="absolute top-6 left-[12.5%] right-[12.5%] h-1 bg-[#adb2b0]/20 rounded-full" />
            
            <div className="absolute top-6 left-[12.5%] h-1 bg-[#f47729] rounded-full transition-all duration-700 ease-in-out" 
                 style={{ width: `${(currentIndex / Math.max(1, STEPS.length - 1)) * 75}%` }} />

            <div className="flex justify-between relative z-10 w-full">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = ICONS[index % ICONS.length];
                    
                    return (
                        <div key={step.label} className="flex flex-col items-center flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 transform ${
                                isCompleted ? 'bg-[#f47729] border-[#f47729] text-white shadow-md' :
                                isCurrent ? 'bg-white border-[#f47729] text-[#f47729] scale-110 shadow-lg' :
                                'bg-white border-[#adb2b0]/30 text-[#adb2b0] hover:border-[#adb2b0] shadow-sm'
                            }`}>
                                {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} strokeWidth={isCurrent ? 2.5 : 2} />}
                            </div>
                            
                            <div className={`mt-4 text-center ${
                                isCurrent ? 'scale-105' : ''
                            } transition-transform`}>
                                <p className={`uppercase text-[11px] font-black tracking-widest ${
                                    isCurrent ? 'text-[#091d38]' : 
                                    isCompleted ? 'text-[#8c7361]' : 
                                    'text-[#adb2b0]'
                                }`}>
                                    {step.label}
                                </p>
                                {isCurrent && (
                                    <p className="text-[9px] text-[#f47729] font-bold uppercase mt-1 animate-pulse">Current Phase</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
