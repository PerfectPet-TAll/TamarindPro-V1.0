import React, { useState } from 'react';
import { 
  Users, Trophy, Target, TrendingUp, Award,
  ArrowUpRight, ArrowDownRight, User, Star, Filter, Search, MoreHorizontal,
  Medal, Crown, Shield, HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Cell, RadialBarChart, RadialBar, PolarAngleAxis,
  Radar, RadarChart, PolarGrid, PolarRadiusAxis
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

const MOCK_REPS = [
  { id: 'REP-001', name: 'Sarawut T.', role: 'Senior Sales Exec', dealsWon: 45, value: 12500000, target: 10000000, conversionRate: 68, status: 'Top Performer', avatar: 'https://i.pravatar.cc/150?u=sarawut' },
  { id: 'REP-004', name: 'Kittisak P.', role: 'Key Account', dealsWon: 42, value: 15400000, target: 15000000, conversionRate: 72, status: 'Overachiever', avatar: 'https://i.pravatar.cc/150?u=kittisak' },
  { id: 'REP-002', name: 'Nattapong K.', role: 'Sales Manager', dealsWon: 38, value: 9800000, target: 8000000, conversionRate: 62, status: 'On Track', avatar: 'https://i.pravatar.cc/150?u=nattapong' },
  { id: 'REP-003', name: 'Pimchanok S.', role: 'Sales Executive', dealsWon: 29, value: 7200000, target: 7500000, conversionRate: 55, status: 'At Risk', avatar: 'https://i.pravatar.cc/150?u=pimchanok' },
  { id: 'REP-005', name: 'Wipawanee R.', role: 'Sales Executive', dealsWon: 21, value: 4500000, target: 6000000, conversionRate: 48, status: 'Off Track', avatar: 'https://i.pravatar.cc/150?u=wipawanee' },
];

const MOCK_PERFORMANCE_TREND = [
  { name: 'Sarawut T.', q1: 2500000, q2: 3200000, q3: 3800000, q4: 3000000 },
  { name: 'Kittisak P.', q1: 3500000, q2: 4000000, q3: 4200000, q4: 3700000 },
  { name: 'Nattapong K.', q1: 1800000, q2: 2400000, q3: 2800000, q4: 2800000 },
  { name: 'Pimchanok S.', q1: 1500000, q2: 1800000, q3: 2200000, q4: 1700000 },
];

const MOCK_TEAM_METRICS = [
  { name: 'Targets Achieved', value: 78, fill: THEME.success },
  { name: 'Pipeline Health', value: 65, fill: THEME.primary },
  { name: 'Activity Score', value: 82, fill: THEME.navy },
  { name: 'Win Rate', value: 54, fill: THEME.secondary }
];

const MOCK_RADAR_DATA = [
  { subject: 'Total Sales', 'Sarawut T.': 95, 'Pimchanok S.': 65, fullMark: 100 },
  { subject: 'New Customers', 'Sarawut T.': 80, 'Pimchanok S.': 40, fullMark: 100 },
  { subject: 'Lead Conversion', 'Sarawut T.': 85, 'Pimchanok S.': 55, fullMark: 100 },
  { subject: 'Activity Count', 'Sarawut T.': 75, 'Pimchanok S.': 85, fullMark: 100 },
  { subject: 'Client Retention', 'Sarawut T.': 90, 'Pimchanok S.': 70, fullMark: 100 }
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

export default function SalesRepPerformance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const filteredReps = MOCK_REPS.filter(rep => 
    rep.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rep.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                        <Users size={28} strokeWidth={2.5} className="text-[#f47729]" />
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                        SALES REP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">PERFORMANCE</span>
                    </h3>
                    <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                        TEAM TRACKING & LEADERBOARD ANALYTICS
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-2">
                    <button className="px-5 py-2.5 bg-white border border-[#adb2b0]/50 text-[#214573] rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#f8f9fa] transition-all shadow-sm flex items-center gap-2">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="px-5 py-2.5 bg-[#091d38] text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#214573] transition-all shadow-md flex items-center gap-2">
                        <Award size={16} className="text-[#f47729]" />
                        Assess Rewards
                    </button>
                </div>
            </div>
        </div>

        <main className="w-full px-4 sm:px-8 mb-8 mt-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
            <div className="w-full mt-4 flex-1 flex flex-col min-h-0">
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
          <MetricCard 
            title="Total Deals Won" 
            value="175" 
            subtext="YTD Across all team members"
            trend="+12%" 
            isPositive={true}
            icon={Target}
            color={THEME.primary}
          />
          <MetricCard 
            title="Avg Target Achievement" 
            value="89%" 
            subtext="Team average vs quota"
            trend="+4.5%" 
            isPositive={true}
            icon={TrendingUp}
            color={THEME.navy}
          />
          <MetricCard 
            title="Avg Sales Cycle" 
            value="24 Days" 
            subtext="From lead to won deal"
            trend="-3 Days" 
            isPositive={true}
            icon={ArrowDownRight}
            color={THEME.success}
          />
          <MetricCard 
            title="Reps at Risk" 
            value="2" 
            subtext="Under 60% of quota"
            trend="+1" 
            isPositive={false}
            icon={Shield}
            color={THEME.danger}
          />
        </div>

        {/* Charts & Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Performers Chart */}
          <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[400px]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-[#214573] uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={18} className="text-[#f47729]" /> Quarterly Performance by Rep
                </h3>
             </div>
             <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={MOCK_PERFORMANCE_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#adb2b0" opacity={0.3} vertical={false} />
                      <XAxis dataKey="name" stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `฿${(val/1000000).toFixed(1)}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: THEME.darkNavy, borderColor: THEME.navy, borderRadius: '12px' }}
                        itemStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                        labelStyle={{ color: THEME.gray, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Bar dataKey="q1" name="Q1 Sales" fill={THEME.navy} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="q2" name="Q2 Sales" fill={THEME.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="q3" name="Q3 Sales" fill={THEME.olive} radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Team Efficiency Radar / Radial */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#adb2b0]/30 flex flex-col h-[400px] relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#EAF2EA] to-transparent w-32 h-32 opacity-50 rounded-bl-full pointer-events-none" />
             <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                <Star size={18} className="text-[#af7a2b]" /> Multi-Metric Analysis
             </h3>
             <p className="text-[10px] font-bold text-[#8c7361] uppercase tracking-widest relative z-10 border-b border-[#adb2b0]/30 pb-4">
                Comparing Representative Performance
             </p>
             <div className="flex-1 w-full relative -mt-2">
                <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="65%" data={MOCK_RADAR_DATA}>
                      <PolarGrid stroke="#adb2b0" strokeOpacity={0.4} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#8c7361', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Sarawut T." dataKey="Sarawut T." stroke={THEME.navy} fill={THEME.navy} fillOpacity={0.5} />
                      <Radar name="Pimchanok S." dataKey="Pimchanok S." stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.5} />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                      <Tooltip contentStyle={{ backgroundColor: THEME.darkNavy, borderColor: THEME.navy, borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff' }} />
                   </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Directory / Leaderboard List */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[#adb2b0]/30 overflow-hidden mb-8">
           <div className="px-6 py-5 border-b border-[#adb2b0]/30 bg-[#f8f9fa] flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-sm font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-2">
                 <Crown size={18} className="text-[#091d38]" /> Representative Roster
              </h3>
              <div className="relative w-full max-w-xs">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7361]" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search representative..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#adb2b0]/40 rounded-xl text-[12px] font-bold text-[#2e3118] bg-white outline-none focus:border-[#f47729] focus:ring-1 focus:ring-[#f47729] transition-all"
                 />
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left font-sans border-collapse min-w-[800px]">
                <thead className="bg-white text-[#53483e] font-mono border-b border-[#adb2b0]/20">
                   <tr>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] w-12 text-center">Rank</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px]">Sales Representative</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center">Deals Won</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right">Revenue Gen</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-right">Quota Target</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center">Progress</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] text-center">Status</th>
                      <th className="py-4 px-6 font-black uppercase tracking-widest text-[10px] w-12"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#adb2b0]/10 font-mono">
                   {filteredReps.map((rep, idx) => {
                      const progressPct = Math.min(100, Math.round((rep.value / rep.target) * 100));
                      // Mocking rank medals visually
                      let RankIcon = null;
                      if (idx === 0) RankIcon = <Medal size={20} className="text-[#FFD700] mx-auto" />;
                      else if (idx === 1) RankIcon = <Medal size={20} className="text-[#C0C0C0] mx-auto" />;
                      else if (idx === 2) RankIcon = <Medal size={20} className="text-[#CD7F32] mx-auto" />;

                      return (
                      <tr key={rep.id} className="hover:bg-[#EAF2EA]/20 transition-colors">
                         <td className="py-4 px-6 text-center font-black text-[#8c7361] text-[14px]">
                            {RankIcon ? RankIcon : idx + 1}
                         </td>
                         <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                               <img src={rep.avatar} alt={rep.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                               <div className="flex flex-col">
                                  <span className="font-black text-[#214573] text-[13px] uppercase font-sans tracking-tight">{rep.name}</span>
                                  <span className="text-[10px] font-bold text-[#8c7361] uppercase tracking-widest">{rep.role}</span>
                               </div>
                            </div>
                         </td>
                         <td className="py-4 px-6 text-center font-black text-[14px] text-[#2e3118]">
                            {rep.dealsWon}
                         </td>
                         <td className="py-4 px-6 text-right font-black text-[13px] text-[#606934]">
                            ฿{rep.value.toLocaleString()}
                         </td>
                         <td className="py-4 px-6 text-right font-black text-[13px] text-[#8c7361]">
                            ฿{rep.target.toLocaleString()}
                         </td>
                         <td className="py-4 px-6">
                           <div className="flex items-center justify-center gap-3">
                              <span className="text-[11px] font-bold text-[#2e3118] w-8 text-right">{progressPct}%</span>
                              <div className="w-20 h-2 bg-[#f0eae1] rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${progressPct >= 100 ? 'bg-[#5da7b3]' : progressPct >= 70 ? 'bg-[#f47729]' : 'bg-[#e3624a]'}`} 
                                    style={{ width: `${progressPct}%` }} 
                                 />
                              </div>
                           </div>
                         </td>
                         <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-black ${
                               rep.status === 'Top Performer' || rep.status === 'Overachiever' ? 'bg-[#5da7b3]/10 text-[#5da7b3] border border-[#5da7b3]/20' : 
                               rep.status === 'On Track' ? 'bg-[#f47729]/10 text-[#f47729] border border-[#f47729]/20' : 
                               'bg-[#e3624a]/10 text-[#e3624a] border border-[#e3624a]/20'
                            }`}>
                               {rep.status}
                            </span>
                         </td>
                         <td className="py-4 px-6 text-center">
                            <button className="p-2 hover:bg-[#adb2b0]/20 rounded-lg transition-colors text-[#8c7361]">
                               <MoreHorizontal size={18} />
                            </button>
                         </td>
                      </tr>
                   )})}
                </tbody>
             </table>
           </div>
        </div>
        </div>
      </main>

      <UserGuidePanel 
        isOpen={showGuide} 
        onClose={() => setShowGuide(false)} 
        title="Sales Rep Performance Guide"
        desc="คู่มือการติดตามผลงานของพนักงานขาย"
        sections={[
            {
                id: "1",
                title: "ตัวชี้วัด (KPIs)",
                icon: "Target",
                description: "ข้อมูลสรุปยอดผลงาน",
                bullets: [
                    { icon: "Target", iconColor: "#f47729", title: "Total Deals Won", text: "จำนวนดีลที่ปิดสำเร็จทั้งหมด" },
                    { icon: "TrendingUp", iconColor: "#091d38", title: "Avg Target Achievement", text: "ค่าเฉลี่ยความสำเร็จเทียบกับเป้าหมาย" }
                ]
            }
        ]}
      />
    </div>
  );
}
