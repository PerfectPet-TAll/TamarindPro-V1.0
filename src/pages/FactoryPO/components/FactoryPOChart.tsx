import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function FactoryPOChart({ items, currency = 'THB', rate = 1 }: { items: any[], currency?: string, rate?: number }) {
    const data = useMemo(() => {
        const monthMap: Record<string, number> = {};
        
        items.forEach(item => {
            if (item.issueDate) {
                const date = new Date(item.issueDate);
                const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                monthMap[monthStr] = (monthMap[monthStr] || 0) + ((item.totalValue || 0) * rate);
            }
        });

        return Object.entries(monthMap)
            .map(([month, value]) => ({ month, value }))
            .sort((a, b) => {
                const [mA, yA] = a.month.split(' ');
                const [mB, yB] = b.month.split(' ');
                return new Date(`${mA} 1, ${yA}`).getTime() - new Date(`${mB} 1, ${yB}`).getTime();
            });
    }, [items, rate]);

    const formatYAxis = (val: number) => {
        return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(val);
    };

    const formatTooltip = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: currency === 'JPY' ? 0 : 2 }).format(val);
    };

    return (
        <div className="w-full h-[200px] bg-white/50 backdrop-blur-md rounded-xl border border-white/60 shadow-sm p-4 mb-6">
            <h3 className="text-[11px] font-black tracking-widest uppercase text-[#8c7361] mb-4">Total PO Value Run Rate ({currency})</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f47729" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f47729" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8c7361', fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8c7361', fontWeight: 600 }} tickFormatter={formatYAxis} width={50} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                            formatter={(value: number) => [formatTooltip(value), 'Total']}
                            labelStyle={{ color: '#8c7361', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#f47729" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#8c7361]">No data available</div>
            )}
        </div>
    );
}
