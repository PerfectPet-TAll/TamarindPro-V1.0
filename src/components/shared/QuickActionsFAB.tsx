import React, { useState } from 'react';
import { Plus, Users, FileText, ShoppingCart, Target, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function QuickActionsFAB({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'performa_invoice', label: 'New PI', icon: FileText, color: 'text-[#f47729]', bg: 'bg-[#f47729]/10' },
    { id: 'customer_directory', label: 'New Customer', icon: Users, color: 'text-[#5da7b3]', bg: 'bg-[#5da7b3]/10' },
    { id: 'issue_factory_po', label: 'Issue PO', icon: ShoppingCart, color: 'text-[#af7a2b]', bg: 'bg-[#af7a2b]/10' },
    { id: 'products_catalogue', label: 'New Product', icon: Target, color: 'text-[#5167a2]', bg: 'bg-[#5167a2]/10' },
  ];

  return (
    <div className="fixed bottom-6 right-24 z-[170] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="flex flex-col gap-2 items-end mb-2"
          >
            {actions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: (actions.length - i - 1) * 0.05 }}
                  onClick={() => {
                    setActiveTab(action.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-[#adb2b0]/30 hover:bg-[#f0f2f5] transition-colors group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2e3118] pl-2">{action.label}</span>
                  <div className={`w-8 h-8 rounded-full ${action.bg} flex items-center justify-center shrink-0`}>
                     <Icon size={14} className={action.color} />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#2e3118] text-[#f47729] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all outline-none border border-[#606934] group"
        title="Quick Actions"
      >
        <span className="absolute right-16 px-3 py-1.5 bg-black/80 text-white text-[10px] font-bold uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity tracking-widest whitespace-nowrap pointer-events-none">Quick Actions</span>
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}
