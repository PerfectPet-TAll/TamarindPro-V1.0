import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Globe, ShoppingCart, BarChart3, Clock, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KpiCard from '../../components/shared/KpiCard';
import { DataTable } from '../../components/shared/DataTable';

const MOCK_MONTHLY_VOLUME = [
    { month: 'Jan', volume: 4000, revenue: 2400 },
    { month: 'Feb', volume: 3000, revenue: 1398 },
    { month: 'Mar', volume: 2000, revenue: 9800 },
    { month: 'Apr', volume: 2780, revenue: 3908 },
    { month: 'May', volume: 1890, revenue: 4800 },
    { month: 'Jun', volume: 2390, revenue: 3800 },
    { month: 'Jul', volume: 3490, revenue: 4300 },
];

const MOCK_TOP_PRODUCTS = [
    { name: 'Product A', sales: 400 },
    { name: 'Product B', sales: 300 },
    { name: 'Product C', sales: 300 },
    { name: 'Product D', sales: 200 },
];

const COLORS = ['#f47729', '#ad7332', '#606934', '#091d38'];

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch delay for skeleton demonstration
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const recentOrders = [
        { id: 'ORD-2606-001', customer: 'Global Foods (UK)', date: '2026-06-08', value: '$45,000', status: 'Pending' },
        { id: 'ORD-2606-002', customer: 'Munchies Supply', date: '2026-06-08', value: '$12,500', status: 'Approved' },
        { id: 'ORD-2606-003', customer: 'Thai Steel Co.', date: '2026-06-07', value: '$8,200', status: 'Shipped' },
        { id: 'ORD-2606-004', customer: 'ABC Corp', date: '2026-06-06', value: '$22,000', status: 'Approved' },
        { id: 'ORD-2606-005', customer: 'EuroTrader GMBH', date: '2026-06-05', value: '$18,500', status: 'Shipped' },
    ];

    const columns = [
        { key: 'id', label: 'Order ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'date', label: 'Date' },
        { key: 'value', label: 'Value' },
        { 
            key: 'status', 
            label: 'Status',
            render: (val: string) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    val === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                    val === 'Approved' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                    {val}
                </span>
            )
        }
    ];

    return (
        <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
            {/* Header */}
            <div className="h-14 px-4 md:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <BarChart3 size={28} strokeWidth={2.5} className="text-[#f47729]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            PERFORMANCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">DASHBOARD</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            Key Business Metrics & Analytics
                        </p>
                    </div>
                </div>
            </div>

            <main className="w-full px-4 sm:px-8 flex-1 overflow-auto custom-scrollbar shrink-0 mb-8 mt-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <KpiCard title="Total Pending Orders" value="142" icon={Clock} colorAccent="#f47729" desc="Awaiting Approval" />
                    <KpiCard title="Monthly Sales Revenue" value="$1.2M" icon={DollarSign} colorAccent="#10b981" desc="Current Month" />
                    <KpiCard title="Active Export Markets" value="24" icon={Globe} colorAccent="#5167a2" desc="Global Reach" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/90 rounded-[24px] border border-[#e2d1c3] shadow-lg overflow-hidden flex flex-col p-5">
                        <h4 className="text-[13px] font-black uppercase tracking-widest text-[#2e3118] flex items-center gap-2 mb-4">
                            <TrendingUp size={16} className="text-[#f47729]" /> Monthly Export Volume
                        </h4>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_MONTHLY_VOLUME}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8c7361' }} />
                                    <YAxis tick={{ fontSize: 10, fill: '#8c7361' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                    <Bar dataKey="volume" name="Export Volume" fill="#091d38" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="revenue" name="Revenue ($)" fill="#f47729" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-white/90 rounded-[24px] border border-[#e2d1c3] shadow-lg overflow-hidden flex flex-col p-5">
                        <h4 className="text-[13px] font-black uppercase tracking-widest text-[#2e3118] flex items-center gap-2 mb-4">
                            <Package size={16} className="text-[#606934]" /> Top Performing Products
                        </h4>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={MOCK_TOP_PRODUCTS}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="sales"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                        style={{ fontSize: '10px', fontWeight: 'bold' }}
                                    >
                                        {MOCK_TOP_PRODUCTS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Sub Content */}
                <div className="bg-white/90 rounded-[24px] border border-[#e2d1c3] shadow-lg overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-5 border-b border-[#e2d1c3] flex items-center justify-between bg-[#f8f9fa]">
                        <h4 className="text-[13px] font-black uppercase tracking-widest text-[#2e3118] flex items-center gap-2">
                            <ShoppingCart size={16} className="text-[#8c7361]" /> Recent Orders Activity
                        </h4>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <DataTable 
                            columns={columns} 
                            data={recentOrders} 
                            isLoading={isLoading} 
                            hasPagination={false} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
