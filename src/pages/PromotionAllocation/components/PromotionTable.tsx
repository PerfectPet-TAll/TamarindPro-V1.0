import React from 'react';
import { Tag, Users, Calendar, Settings, MoreHorizontal } from 'lucide-react';
import { DataTable } from '../../../components/shared/DataTable';
import { Promotion } from '../data/mockData';

interface Props {
  data: Promotion[];
}

export default function PromotionTable({ data }: Props) {
  const columns = [
    {
      key: 'name',
      label: 'Promotion Detail',
      sortable: true,
      render: (_: any, promo: Promotion) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-black text-[#212c46] flex items-center gap-2 transition-colors">
            {promo.name}
          </span>
          <span className="text-[11px] font-mono font-bold text-[#7a8b95] mt-0.5 uppercase tracking-wide flex items-center gap-1">
            {promo.id}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Category & Target',
      sortable: true,
      render: (_: any, promo: Promotion) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#212c46] uppercase flex items-center gap-1">
              <Tag size={10} /> {promo.type}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-tighter flex items-center gap-1">
            <Users size={10} /> {promo.targetAudience}
          </span>
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Duration',
      sortable: true,
      render: (_: any, promo: Promotion) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-mono font-bold text-[#212c46] flex items-center gap-1">
            <Calendar size={10} /> {promo.startDate}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#7a8b95] mt-0.5 ml-3">
            to {promo.endDate}
          </span>
        </div>
      )
    },
    {
      key: 'budget',
      label: 'Total Budget',
      sortable: true,
      render: (_: any, promo: Promotion) => (
        <div className="text-right w-full">
            <span className="text-[12px] font-black font-mono text-[#4d621b]">
            ฿{promo.budget.toLocaleString()}
            </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_: any, promo: Promotion) => (
        <div className="flex flex-col items-center">
          <span
            className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest shadow-sm border ${
              promo.status === 'Active'
                ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30'
                : promo.status === 'Completed'
                ? 'bg-[#7a8b95]/10 text-[#7a8b95] border-[#7a8b95]/30'
                : 'bg-[#d1a45f]/10 text-[#d1a45f] border-[#d1a45f]/30'
            }`}
          >
            {promo.status}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex justify-center gap-[4px]">
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#728298] border border-[#eaeaec] hover:border-[#728298] hover:bg-[#728298]/15 bg-white shadow-sm transition-all active:scale-95"
            title="Edit Promotion"
          >
            <Settings size={14} />
          </button>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#212c46] border border-[#eaeaec] hover:border-[#212c46] hover:bg-[#212c46]/15 bg-white shadow-sm transition-all active:scale-95"
            title="More Options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      )
    }
  ];

  return <DataTable columns={columns} data={data} />;
}
