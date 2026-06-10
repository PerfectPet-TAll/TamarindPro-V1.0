import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { TopCustomersD3 } from './TopCustomersD3';
import { THEME } from '../types';

const COMPONENT_CHART_COLORS = [
    THEME.palette.navy,
    THEME.palette.orangeBright,
    THEME.palette.olive,
    THEME.palette.gold,
    THEME.palette.blueMuted,
    THEME.palette.dustyRose
];

interface CustomerInsightViewProps {
  categoryData: { name: string; value: number }[];
  statusData: { name: string; value: number }[];
  topPerformingData: any[];
}

export default function CustomerInsightView({
  categoryData,
  statusData,
  topPerformingData
}: CustomerInsightViewProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#F0EAE1]/30 border border-[#d2af94]/30 rounded-[20px] p-6 shadow-sm">
          <h3 className="text-[14px] font-black text-[#091d38] uppercase tracking-widest mb-6 border-b border-[#adb2b0]/30 pb-3">Customers by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPONENT_CHART_COLORS[index % COMPONENT_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'JetBrains Mono' }}
                  itemStyle={{ color: '#1f2a44', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#F0EAE1]/30 border border-[#d2af94]/30 rounded-[20px] p-6 shadow-sm">
          <h3 className="text-[14px] font-black text-[#091d38] uppercase tracking-widest mb-6 border-b border-[#adb2b0]/30 pb-3">Customer Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fontFamily: 'JetBrains Mono' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(244, 119, 41, 0.05)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPONENT_CHART_COLORS[(index + 2) % COMPONENT_CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#F0EAE1]/30 border border-[#d2af94]/30 rounded-[20px] p-6 shadow-sm col-span-1 lg:col-span-2">
          <h3 className="text-[14px] font-black text-[#091d38] uppercase tracking-widest mb-6 border-b border-[#adb2b0]/30 pb-3">Top Performing Customers (Est. Revenue)</h3>
          <TopCustomersD3 data={topPerformingData} />
        </div>
      </div>
    </div>
  );
}
