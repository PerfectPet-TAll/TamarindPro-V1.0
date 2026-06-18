import React from 'react';
import KpiCard from '../../../components/shared/KpiCard';
import { Target, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { Promotion } from '../data/mockData';

interface Props {
  promotions: Promotion[];
}

export default function StatCards({ promotions }: Props) {
  const activePromos = promotions.filter(p => p.status === 'Active').length;
  const totalBudget = promotions.reduce((acc, p) => acc + p.budget, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
        <KpiCard 
           title="Total Campaigns" 
           value={promotions.length} 
           icon={Target} 
           colorAccent="#212c46" 
           desc="All records"
        />
        <KpiCard 
           title="Active Promos" 
           value={activePromos} 
           icon={CheckCircle2} 
           colorAccent="#657f4d" 
           desc="Running now"
        />
        <KpiCard 
           title="Total Budget (THB)" 
           value={`${(totalBudget / 1000000).toFixed(1)}M`} 
           icon={FileText} 
           colorAccent="#d1a45f" 
           desc="Allocated Capital"
        />
        <KpiCard 
           title="Requires Review" 
           value={1} 
           icon={AlertTriangle} 
           colorAccent="#932c2e" 
           desc="Awaiting Action"
        />
    </div>
  );
}
