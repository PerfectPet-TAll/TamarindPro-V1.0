import React from 'react';
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';

export type SyncState = 'connected' | 'disconnected' | 'testing' | 'error' | 'idling';

interface Props {
  status: SyncState;
  className?: string;
}

export function SyncStatusBadge({ status, className = '' }: Props) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle2 size={12} />,
          text: 'Connected',
          classes: 'bg-emerald-50 text-emerald-600 border-emerald-200'
        };
      case 'testing':
        return {
          icon: <Loader2 size={12} className="animate-spin" />,
          text: 'Syncing',
          classes: 'bg-blue-50 text-blue-600 border-blue-200'
        };
      case 'error':
        return {
          icon: <XCircle size={12} />,
          text: 'Failed',
          classes: 'bg-rose-50 text-rose-600 border-rose-200'
        };
      case 'disconnected':
        return {
          icon: <XCircle size={12} />,
          text: 'Disabled',
          classes: 'bg-slate-50 text-slate-400 border-slate-200'
        };
      case 'idling':
      default:
        return {
          icon: <Clock size={12} />,
          text: 'Waiting',
          classes: 'bg-amber-50 text-amber-600 border-amber-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.classes} ${className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
