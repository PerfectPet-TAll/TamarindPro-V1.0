import React from 'react';
import { X, Bell, AlertTriangle, Info, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const NOTIFICATIONS = [
    { id: 1, type: 'urgent', title: 'New Order Submission', message: 'Order #SO-2023-1025 needs immediate review.', time: '10 mins ago', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 2, type: 'approval', title: 'Pending Approval', message: 'PI #ELST 08/2023 is pending your approval.', time: '1 hour ago', icon: CheckCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 3, type: 'logistics', title: 'Container Dispatched', message: 'Container HLXU8123984 departed from factory.', time: '3 hours ago', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 4, type: 'info', title: 'System Update', message: 'Monthly revenue metrics have been updated.', time: '1 day ago', icon: Info, color: 'text-slate-500', bg: 'bg-slate-50' }
];

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999]"
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white shadow-2xl z-[10000] flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#091d38] text-white">
                            <div className="flex items-center gap-3">
                                <Bell className="text-[#f47729]" size={20} />
                                <h2 className="font-black text-[15px] uppercase tracking-widest">Notifications</h2>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                <X size={18} className="text-white" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                            {NOTIFICATIONS.map(note => (
                                <div key={note.id} className={`p-4 rounded-xl border border-slate-100 flex gap-4 ${note.bg} hover:-translate-y-0.5 transition-transform cursor-pointer`}>
                                    <div className={`mt-1 ${note.color}`}>
                                        <note.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`font-black text-[12px] uppercase tracking-tight text-slate-800`}>{note.title}</h4>
                                            <span className="text-[10px] text-slate-400 font-bold ml-2 shrink-0">{note.time}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">{note.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            <button className="w-full text-center text-[11px] font-black uppercase text-[#214573] tracking-widest hover:text-[#f47729] py-2">
                                Mark All As Read
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
