import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Database, 
  ShoppingCart, 
  Factory, 
  Ship, 
  Calendar, 
  Settings,
  HelpCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { NotificationService } from '../../../services/NotificationService';
import Swal from 'sweetalert2';

interface SimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ITEMS = [
  { id: 'sheets', label: 'Sheets Sync', icon: Database, color: 'text-emerald-500' },
  { id: 'sales', label: 'Sales Alert', icon: ShoppingCart, color: 'text-indigo-500' },
  { id: 'oem', label: 'Factory PO (OEM)', icon: Factory, color: 'text-[#ad7332]' },
  { id: 'logistics', label: 'Logistics', icon: Ship, color: 'text-sky-500' },
  { id: 'calendar', label: 'Calendar Event', icon: Calendar, color: 'text-purple-500' },
  { id: 'system', label: 'System Guard', icon: Settings, color: 'text-slate-500' }
];

const SEVERITY_ITEMS = [
  { id: 'info', label: 'Info (Standard Log)', btnStyle: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
  { id: 'success', label: 'Success (Resolved / Stamped)', btnStyle: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  { id: 'warning', label: 'Warning (Cautions)', btnStyle: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
  { id: 'critical', label: 'Critical (Error / Urgency)', btnStyle: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' }
];

export default function SimulatorModal({ isOpen, onClose }: SimulatorProps) {
  const [selectedCat, setSelectedCat] = useState('sales');
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (severity: string) => {
    setLoading(true);
    try {
      await NotificationService.triggerSimulatedNotification(selectedCat, severity);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Mock ${severity.toUpperCase()} Alert Injected!`,
        text: 'The notification was added to Firestore securely.',
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire('Payload Blocked', 'Strict Firestore Rules validation failed or permission was denied.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedCatObj = CATEGORY_ITEMS.find(c => c.id === selectedCat) || CATEGORY_ITEMS[0];
  const ActiveCatIcon = selectedCatObj.icon;

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-lg"
      title={
        <div className="flex items-center gap-2 select-none">
          <Sparkles className="text-[#f47729] animate-spin duration-[4000ms]" size={16} />
          <span className="text-xs font-black uppercase text-[#111f42] tracking-widest">
            CO-DRIVER ALERT INJECTOR
          </span>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <label className="sys-label-tiny">Step 1: Choose Operational Node</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    isActive 
                      ? 'border-primary bg-primary/5 shadow-inner' 
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className={cat.color} />
                  <span className={`text-[10px] font-black uppercase tracking-wider mt-1 ${isActive ? 'text-[#111f42]' : 'text-slate-500'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="sys-label-tiny">Step 2: Fire Event Severity Trigger</label>
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 leading-none select-none">
            <ActiveCatIcon size={12} className={selectedCatObj.color} /> Target Node: {selectedCatObj.label}
          </p>
          <div className="flex flex-col gap-2 pt-1.5Packed">
            {SEVERITY_ITEMS.map((sev) => (
              <button
                key={sev.id}
                disabled={loading}
                onClick={() => handleSimulate(sev.id)}
                className={`w-full py-3 px-4 border rounded-2xl text-[10.5px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-between ${sev.btnStyle}`}
              >
                <span>Trigger {sev.label}</span>
                {loading ? (
                  <Loader2 size={13} className="animate-spin text-slate-400" />
                ) : (
                  <Send size={12} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="flex gap-2.5 items-start">
            <HelpCircle size={16} className="text-[#f47729] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-600">Strict rules in operation</span>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                This triggers a real Firestore document creation. All schema inputs are strictly audited against `/firestore.rules` matching parameters on length, attributes and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DraggableModal>
  );
}
