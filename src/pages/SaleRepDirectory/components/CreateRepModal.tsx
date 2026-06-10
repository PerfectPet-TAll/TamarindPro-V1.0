import React from 'react';
import { UploadCloud, Save, UserPlus } from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { TEAMS, REGIONS, STATUSES } from '../types';

interface CreateRepModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRep: any;
  setNewRep: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateRepModal({
  isOpen,
  onClose,
  newRep,
  setNewRep,
  onSubmit
}: CreateRepModalProps) {
  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={(
        <span className="text-sm font-black uppercase text-[#091d38] tracking-widest flex items-center gap-2">
          <UserPlus size={16} className="text-[#f47729]"/> NEW REPRESENTATIVE REGISTRY
        </span>
      )} 
      width="800px"
    >
      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="flex flex-col md:flex-row h-[500px] bg-white text-sans overflow-hidden">
          <div className="w-full md:w-[240px] bg-[#f8f9fa] border-r border-[#d2af94]/50 flex flex-col font-mono text-[11px] font-black uppercase tracking-widest text-[#8c7361] shrink-0">
            <button type="button" className="text-left px-5 py-4 text-[#f47729] bg-white border-l-4 border-[#f47729] font-black w-full">PERSONAL IDENTITY</button>
            <button type="button" className="text-left px-5 py-4 hover:bg-white hover:text-[#2e3118] transition-colors border-l-4 border-transparent w-full">TEAM ASSIGNMENT</button>
            <button type="button" className="text-left px-5 py-4 hover:bg-white hover:text-[#2e3118] transition-colors border-l-4 border-transparent w-full">KPI TARGETS</button>
          </div>
          <div className="flex-1 flex flex-col p-8 overflow-y-auto font-mono">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#adb2b0] flex flex-col items-center justify-center text-[#8c7361] cursor-pointer hover:border-[#f47729] hover:text-[#f47729] transition-all bg-[#F0EAE1]/30">
                <UploadCloud size={20} />
                <span className="text-[9px] font-black mt-1 uppercase">PHOTO</span>
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">FULL NAME *</label>
                <input 
                  type="text" 
                  value={newRep.name}
                  onChange={(e) => setNewRep({ ...newRep, name: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] uppercase outline-none focus:border-[#f47729] shadow-sm font-mono"
                  placeholder="e.g. Somchai Jaidee"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">NICKNAME (AKA)</label>
                <input 
                  type="text" 
                  value={newRep.nickname}
                  onChange={(e) => setNewRep({ ...newRep, nickname: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm font-mono"
                  placeholder="e.g. Chai"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">MOBILE NUMBER</label>
                <input 
                  type="text" 
                  value={newRep.mobile}
                  onChange={(e) => setNewRep({ ...newRep, mobile: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm font-mono"
                  placeholder="e.g. 081-234-5678"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={newRep.email}
                  onChange={(e) => setNewRep({ ...newRep, email: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] lowercase outline-none focus:border-[#f47729] shadow-sm font-mono"
                  placeholder="e.g. somchai@tamarind.co.th"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">LINE ID / SOCIAL</label>
                <input 
                  type="text" 
                  value={newRep.lineId}
                  onChange={(e) => setNewRep({ ...newRep, lineId: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm font-mono"
                  placeholder="e.g. @chai_sales"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">ASSIGNED TEAM</label>
                <select 
                  value={newRep.team}
                  onChange={(e) => setNewRep({ ...newRep, team: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm bg-white font-mono"
                >
                  {TEAMS.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">ASSIGNED REGION</label>
                <select 
                  value={newRep.region}
                  onChange={(e) => setNewRep({ ...newRep, region: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm bg-white font-mono"
                >
                  {REGIONS.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">ANNUAL TARGET (THB)</label>
                <input 
                  type="number" 
                  value={newRep.target}
                  onChange={(e) => setNewRep({ ...newRep, target: Number(e.target.value) })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">STATUS</label>
                <select 
                  value={newRep.status}
                  onChange={(e) => setNewRep({ ...newRep, status: e.target.value })}
                  className="w-full h-11 border border-[#adb2b0]/60 rounded-xl px-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm bg-white font-mono"
                >
                  {STATUSES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="text-[11px] font-bold text-[#8c7361] uppercase tracking-widest block mb-1">SPECIAL REMARKS / NOTES</label>
                <textarea 
                  value={newRep.notes}
                  onChange={(e) => setNewRep({ ...newRep, notes: e.target.value })}
                  rows={2}
                  className="w-full border border-[#adb2b0]/60 rounded-xl p-4 text-[13px] font-black text-[#2e3118] outline-none focus:border-[#f47729] shadow-sm font-mono"
                  placeholder="Enter details..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 px-8 border-t border-[#d2af94]/50 bg-[#F0EAE1]/30 flex justify-end gap-4 shrink-0 font-mono">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-[#8c7361] bg-white border border-[#adb2b0]/50 hover:bg-[#adb2b0]/10 transition-all shadow-sm cursor-pointer">CANCEL</button>
          <button type="submit" className="px-8 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest text-white bg-[#091d38] hover:bg-[#214573] shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#091d38] cursor-pointer">
            <Save size={16} className="text-[#f47729]"/> ADD REPRESENTATIVE
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
