import React from 'react';
import { Save, UserPlus } from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { CREDIT_TERMS } from '../types';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  newCust: any;
  setNewCust: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateCustomerModal({
  isOpen,
  onClose,
  newCust,
  setNewCust,
  onSubmit
}: CreateCustomerModalProps) {
  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={(
        <span className="text-sm font-black uppercase text-[#091d38] tracking-widest flex items-center gap-2">
          <UserPlus size={16} className="text-[#f47729]"/> NEW CUSTOMER REGISTRY
        </span>
      )} 
      width="800px"
    >
      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="flex flex-col md:flex-row h-[500px] bg-white text-sans overflow-hidden">
          <div className="w-full md:w-[240px] bg-[#f8f9fa] border-r border-[#d2af94]/50 flex flex-col font-mono text-[11px] font-black uppercase tracking-widest text-[#8c7361]">
            <button type="button" className="text-left px-5 py-4 text-[#f47729] bg-white border-l-4 border-[#f47729] font-black">COMPANY PROFILE</button>
            <button type="button" className="text-left px-5 py-4 hover:bg-white hover:text-[#2e3118] transition-colors border-l-4 border-transparent">FINANCIAL TERMS</button>
            <button type="button" className="text-left px-5 py-4 hover:bg-white hover:text-[#2e3118] transition-colors border-l-4 border-transparent">ADDRESSES</button>
            <button type="button" className="text-left px-5 py-4 hover:bg-white hover:text-[#2e3118] transition-colors border-l-4 border-transparent">DOCUMENTS</button>
          </div>
          <div className="flex-1 flex flex-col p-8 overflow-y-auto font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1 md:col-span-2">
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">COMPANY / ENTITY NAME *</label>
                <input 
                  type="text" 
                  value={newCust.name}
                  onChange={e => setNewCust({ ...newCust, name: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm"
                  placeholder="Enter Customer Name"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">TAX ID NUMBER</label>
                <input 
                  type="text" 
                  value={newCust.taxId}
                  onChange={e => setNewCust({ ...newCust, taxId: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm"
                  placeholder="Tax Identification No."
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">CATEGORY</label>
                <select 
                  value={newCust.cat}
                  onChange={e => setNewCust({ ...newCust, cat: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm appearance-none bg-white"
                >
                  <option value="Modern Trade">Modern Trade</option>
                  <option value="Traditional Trade">Traditional Trade</option>
                  <option value="Food Service">Food Service</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">PRIMARY CONTACT PERSON</label>
                <input 
                  type="text" 
                  value={newCust.contact}
                  onChange={e => setNewCust({ ...newCust, contact: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">PHONE NUMBER</label>
                <input 
                  type="text" 
                  value={newCust.phone}
                  onChange={e => setNewCust({ ...newCust, phone: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm"
                  placeholder="e.g. 0812345678"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">CREDIT TERM</label>
                <select 
                  value={newCust.credit}
                  onChange={e => setNewCust({ ...newCust, credit: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm appearance-none bg-white"
                >
                  {CREDIT_TERMS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-2">BILLING ADDRESS</label>
                <input 
                  type="text" 
                  value={newCust.billingAddress}
                  onChange={e => setNewCust({ ...newCust, billingAddress: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm"
                  placeholder="Address Details"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 px-8 border-t border-[#d2af94]/50 bg-[#F0EAE1]/30 flex justify-end gap-4 shrink-0 col-span-1 md:col-span-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-[#8c7361] bg-white border border-[#adb2b0]/50 hover:bg-[#adb2b0]/10 transition-all font-mono shadow-sm"
          >
            CANCEL
          </button>
          <button 
            type="submit" 
            className="px-8 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-white bg-[#091d38] hover:bg-[#214573] shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#091d38] font-mono cursor-pointer"
          >
            <Save size={16} className="text-[#f47729]"/> REGISTER CUSTOMER
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
