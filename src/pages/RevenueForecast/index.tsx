import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, LineChart as LineChartIcon, PieChart, 
  Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Package, Truck, ArrowRight,
  Target, HelpCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, LineChart, Line, ComposedChart, ReferenceLine, 
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

const THEME = {
  primary: '#f47729',
  secondary: '#af7a2b',
  navy: '#214573',
  darkNavy: '#091d38',
  olive: '#606934',
  danger: '#e3624a',
  success: '#5da7b3',
  gray: '#adb2b0',
  textMain: '#2e3118',
  textMuted: '#8c7361'
};

const MOCK_REVENUE_DATA = [
  { month: 'Jan', actual: 4200000, forecast: 4000000, target: 4500000, growth: 5.2 },
  { month: 'Feb', actual: 4800000, forecast: 4200000, target: 4800000, growth: 14.2 },
  { month: 'Mar', actual: 5100000, forecast: 4600000, target: 5000000, growth: 6.2 },
  { month: 'Apr', actual: 4900000, forecast: 5000000, target: 5200000, growth: -3.9 },
  { month: 'May', actual: 5400000, forecast: 5200000, target: 5500000, growth: 10.2 },
  { month: 'Jun', actual: null, forecast: 5800000, target: 6000000, growth: 7.4 },
  { month: 'Jul', actual: null, forecast: 6200000, target: 6500000, growth: 6.8 },
  { month: 'Aug', actual: null, forecast: 6500000, target: 7000000, growth: 4.8 },
  { month: 'Sep', actual: null, forecast: 6800000, target: 7200000, growth: 4.6 },
  { month: 'Oct', actual: null, forecast: 7100000, target: 7500000, growth: 4.4 },
  { month: 'Nov', actual: null, forecast: 7500000, target: 8000000, growth: 5.6 },
  { month: 'Dec', actual: null, forecast: 8200000, target: 9000000, growth: 9.3 },
];

const MOCK_CHANNEL_DATA = [
  { name: 'B2B Enterprise', value: 45, color: THEME.primary },
  { name: 'Retail Global', value: 30, color: THEME.navy },
  { name: 'Domestic Market', value: 15, color: THEME.olive },
  { name: 'E-Commerce', value: 10, color: THEME.secondary },
];

const MOCK_PRODUCT_PERFORMANCE = [
  { name: 'Sweet Tamarind Premium', revenue: 1250000, growth: 12.5 },
  { name: 'Tamarind Paste 500g', revenue: 850000, growth: 8.2 },
  { name: 'Spicy Tamarind Balls', revenue: 620000, growth: -2.4 },
  { name: 'Seedless Tamarind', revenue: 450000, growth: 15.6 },
];

const MetricCard = ({ title, value, subtext, trend, isPositive, icon: Icon, color }: any) => (
  <div className="bg-white rounded-[20px] p-5 border border-[#adb2b0]/30 shadow-sm relative overflow-hidden group">
    <div className={`absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={100} style={{ color }} />
    </div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-2.5 rounded-xl`} style={{ backgroundColor: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isPositive ? 'bg-[#5da7b3]/10 text-[#5da7b3]' : 'bg-[#e3624a]/10 text-[#e3624a]'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-[#2e3118] tracking-tight mb-2.5 font-mono">{value}</h3>
      <p className="text-[11px] font-bold text-[#8c7361]">{subtext}</p>
    </div>
  </div>
);

export default function RevenueForecast() {
  const [timeRange, setTimeRange] = useState('2026');
  const [targetKPI, setTargetKPI] = useState(5500000);
  const [showGuide, setShowGuide] = useState(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#091d38] p-4 rounded-xl border border-[#214573] shadow-xl">
          <p className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest mb-3 border-b border-[#214573] pb-2">{label} {timeRange}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-1.5 line-clamp-1 py-1">
              <span className="text-[11px] font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="text-[12px] font-black font-mono text-white">
                {entry.name.includes('Growth') ? `${entry.value > 0 ? '+' : ''}${entry.value}%` : `฿${(entry.value / 1000000).toFixed(2)}M`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
        <div className="flex flex-col flex-1 w-full font-sans overflow-hidden bg-transparent">
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>

            {/* HEADER SECTION */}
            <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <TrendingUp size={28} strokeWidth={2.5} className="text-[#f47729]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            REVENUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">FORECAST</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            PREDICTIVE SALES ANALYTICS & TARGET TRACKING
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-2">
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 bg-white border border-[#adb2b0]/50 rounded-lg text-[11px] font-black text-[#214573] uppercase tracking-widest outline-none focus:border-[#f47729] shadow-sm appearance-none cursor-pointer pr-10 relative h-[36px]"
                        >
                            <option value="2026">FY 2026</option>
                            <option value="2025">FY 2025</option>
                            <option value="Q3_2026">Q3 2026</option>
                            <option value="Q4_2026">Q4 2026</option>
                        </select>
                        <button className="px-5 py-2 bg-[#091d38] text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#214573] transition-all shadow-md flex items-center gap-2 h-[36px]">
                            <BarChart3 size={16} className="text-[#f47729]" />
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            <main className="w-full px-4 sm:px-8 mb-8 mt-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                <div className="w-full mt-4 flex-1 flex flex-col min-h-0">
                    {/* KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
          <MetricCard 
            title="Total Revenue YTD" 
            value="฿24.4M" 
            subtext="From ฿48.0M Annual Target"
            trend="+12.5%" 
            isPositive={true}
            icon={DollarSign}
            color={THEME.primary}
          />
          <MetricCard 
            title="Projected FY Revenue" 
            value="฿78.5M" 
            subtext="Based on current run rate"
            trend="+8.2%" 
            isPositive={true}
            icon={TrendingUp}
            color={THEME.navy}
          />
          <MetricCard 
            title="Average Deal Size" 
            value="฿420K" 
            subtext="Across all B2B segments"
            trend="-2.4%" 
            isPositive={false}
            icon={Package}
            color={THEME.danger}
          />
          <MetricCard 
            title="Sales Pipeline Value" 
            value="฿18.2M" 
            subtext="Weighted value of open deals"
            trend="+15.8%" 
            isPositive={true}
            icon={LineChartIcon}
            color={THEME.success}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Forecast Chart */}
          <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[450px]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2">
                  <LineChartIcon size={18} className="text-[#f47729]" /> Revenue vs Forecast ({timeRange})
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-[#8c7361] uppercase tracking-widest">Global Target KPI:</span>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7361] font-bold text-[12px]">฿</span>
                     <input 
                       type="number" 
                       value={targetKPI} 
                       onChange={(e) => setTargetKPI(Number(e.target.value))}
                       className="pl-7 pr-3 py-1.5 border border-[#adb2b0]/40 rounded-lg text-right font-black text-[12px] text-[#214573] outline-none focus:border-[#f47729] focus:ring-1 focus:ring-[#f47729] bg-[#f8f9fa] w-32"
                     />
                  </div>
                </div>
             </div>
             <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MOCK_REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.navy} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={THEME.navy} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#adb2b0" opacity={0.3} vertical={false} />
                    <XAxis dataKey="month" stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickMargin={12} />
                    <YAxis 
                      stroke="#8c7361" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={12}
                      tickFormatter={(val) => `฿${(val/1000000)}M`} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <ReferenceLine y={targetKPI} label={{ position: 'top', value: 'Target KPI', fill: THEME.danger, fontSize: 10, fontWeight: 'bold' }} stroke={THEME.danger} strokeWidth={2} strokeDasharray="4 4" />
                    <Area type="monotone" name="Actual Revenue" dataKey="actual" stroke={THEME.navy} strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                    <Line type="monotone" name="Target Budget" dataKey="target" stroke={THEME.gray} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Area type="monotone" name="AI Forecast" dataKey="forecast" stroke={THEME.primary} strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorForecast)" />
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Revenue by Channel */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[450px]">
             <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2 mb-6">
                <PieChart size={18} className="text-[#af7a2b]" /> Revenue by Channel
             </h3>
             <div className="flex-1 w-full flex flex-col justify-center">
                <div className="space-y-6">
                  {MOCK_CHANNEL_DATA.map((item, index) => (
                    <div key={index} className="w-full relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-black text-[#53483e] uppercase tracking-widest">{item.name}</span>
                        <span className="text-[12px] font-black font-mono text-[#214573]">{item.value}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#f0eae1] rounded-full overflow-hidden">
                         <div 
                           className="h-full rounded-full transition-all duration-1000" 
                           style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                         />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto pt-8 border-t border-[#adb2b0]/20">
                   <div className="bg-[#EAF2EA]/50 p-4 rounded-xl border border-[#606934]/20 flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                         <Truck size={16} className="text-[#606934]" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-[#606934] uppercase tracking-widest mb-1">Growth Insight</p>
                         <p className="text-[11px] font-medium text-[#53483e] leading-snug">
                           Retail Global segment shows a 15% WoW growth trend. Consider reallocating ad budget to support this channel.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Growth Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[400px]">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#5da7b3]" /> Monthly Revenue Growth Trends (%)
                  </h3>
               </div>
               <div className="flex-1 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={MOCK_REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#adb2b0" opacity={0.3} vertical={false} />
                        <XAxis dataKey="month" stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickMargin={12} />
                        <YAxis stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickMargin={12} tickFormatter={(val) => `${val}%`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                        <Line type="monotone" name="MoM Growth Trend" dataKey="growth" stroke={THEME.success} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
          </div>

          {/* Target Progress Gauge */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[400px] relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#EAF2EA] to-transparent w-32 h-32 opacity-50 rounded-bl-full pointer-events-none" />
             <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                <Target size={18} className="text-[#f47729]" /> Annual Target Progress
             </h3>
             <p className="text-[10px] font-bold text-[#8c7361] uppercase tracking-widest relative z-10 border-b border-[#adb2b0]/30 pb-4">
                YTD Revenue against ฿48.0M Goal
             </p>
             <div className="flex-1 w-full relative flex items-center justify-center -mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="70%" 
                      outerRadius="100%" 
                      barSize={18} 
                      data={[{ name: 'Progress', value: 51, fill: THEME.primary }]}
                      startAngle={210}
                      endAngle={-30}
                   >
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar
                         background={{ fill: '#F0EAE1', opacity: 0.5 }}
                         dataKey="value"
                         cornerRadius={10}
                      />
                      <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-[#2e3118] text-4xl font-black font-mono">
                         51%
                      </text>
                      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-[#8c7361] text-[10px] font-bold uppercase tracking-widest">
                         Achieved
                      </text>
                   </RadialBarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[#adb2b0]/30 overflow-hidden mb-8">
           <div className="px-6 py-5 border-b border-[#adb2b0]/30 bg-[#f8f9fa] flex justify-between items-center">
              <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2">
                 <Package size={18} className="text-[#091d38]" /> Top Performing Products
              </h3>
              <button className="text-[10px] font-black text-[#214573] uppercase tracking-widest hover:text-[#f47729] transition-colors flex items-center gap-1">
                 View All <ArrowRight size={14} />
              </button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left font-sans border-collapse">
                <thead className="bg-white text-[#53483e] font-mono border-b border-[#adb2b0]/20">
                   <tr>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px]">Product Name</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right">QTD Revenue</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right">Target Achievement</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center">MoM Growth</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#adb2b0]/10 font-mono">
                   {MOCK_PRODUCT_PERFORMANCE.map((product, idx) => (
                      <tr key={idx} className="hover:bg-[#EAF2EA]/20 transition-colors">
                         <td className="py-4 px-6 font-black text-[#2e3118] text-[12px] uppercase font-sans tracking-tight">
                            {product.name}
                         </td>
                         <td className="py-4 px-6 text-right font-black text-[13px] text-[#214573]">
                            ฿{product.revenue.toLocaleString()}
                         </td>
                         <td className="py-4 px-6 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <span className="text-[11px] font-bold text-[#8c7361]">{Math.min(100, Math.round(product.revenue / 1500000 * 100))}%</span>
                              <div className="w-24 h-1.5 bg-[#f0eae1] rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-[#f47729] rounded-full" 
                                    style={{ width: `${Math.min(100, Math.round(product.revenue / 1500000 * 100))}%` }} 
                                 />
                              </div>
                           </div>
                         </td>
                         <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black ${
                               product.growth > 0 ? 'bg-[#5da7b3]/10 text-[#5da7b3]' : 'bg-[#e3624a]/10 text-[#e3624a]'
                            }`}>
                               {product.growth > 0 ? '+' : ''}{product.growth}%
                            </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
        </div>
      </main>
      <UserGuidePanel 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        title="Revenue Forecast Guide"
        desc="คู่มือการวิเคราะห์คาดการณ์รายได้ประจำปี"
        sections={[
            {
                id: "1",
                title: "ตัวชี้วัด (KPIs)",
                icon: "Target",
                description: "ข้อมูลสรุปยอดขาย",
                bullets: [
                    { icon: "DollarSign", iconColor: "#f47729", title: "Total Revenue YTD", text: "รายได้รวมตั้งแต่ต้นปีถึงปัจจุบัน" },
                    { icon: "TrendingUp", iconColor: "#091d38", title: "Projected FY Revenue", text: "รายได้คาดการณ์ทั้งปี" }
                ]
            }
        ]}
      />
    </div>
  );
}
