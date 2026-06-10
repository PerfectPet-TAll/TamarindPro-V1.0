import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  TrendingDown, 
  Target, 
  Truck, 
  BarChart2, 
  Settings, 
  Menu,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Building2,
  Clock,
  PackageCheck,
  PhoneCall,
  Mail,
  Calendar,
  DollarSign,
  PieChart,
  Award,
  Globe,
  Bell,
  Sparkles,
  Factory,
  CheckCircle2,
  FileText,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Container,
  Database,
  FileSearch,
  Scale,
  CreditCard,
  Zap,
  Handshake,
  Filter,
  Megaphone,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Percent,
  Ship,
  Printer,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserPermission from '../UserPermissions';
import SystemConfig from '../SystemConfig';
import CompanyRegulations from '../CompanyRegulations';
import DevPermit from '../DevPermit';
import SystemLogs from '../SystemLogs';
import CalendarHub from '../Calendar';
import ProductsCatalogue from '../ProductsCatalogue';
import CustomerDirectory from '../CustomerDirectory';
import SaleRepDirectory from '../SaleRepDirectory';
import FactoryPO from '../FactoryPO';
import PriceBooks from '../PriceBooks';
import BookingRequest from '../BookingRequest';
import BookingConfirmation from '../BookingConfirmation';
import ShippingInstruction from '../ShippingInstruction';
import LoadingNotice from '../LoadingNotice';
import PackingList from '../PackingList';
import CommercialInvoice from '../CommercialInvoice';
import ProformaInvoice from '../ProformaInvoice';
import Quotations from '../Quotations';
import ContractsManagement from '../ContractsManagement';
import Dashboard from '../Dashboard';
import RevenueForecast from '../RevenueForecast';
import SalesRepPerformance from '../SalesRepPerformance';
import DepositsDownPayment from '../DepositsDownPayment';
import PaymentCollection from '../PaymentCollection';
import CreditLimitManagement from '../CreditLimitManagement';
import ShippingStatusLookup from '../ShippingStatusLookup';
import DispatchContainer from '../DispatchContainer';
import GoogleSheetsSync from '../GoogleSheetsSync';
import AICopilot from '../AICopilot';
import NotificationCenter from '../NotificationCenter';
import { useVisibility } from '../../context/ModuleVisibilityContext';
import { useLanguage } from '../../context/LanguageContext';
import { UpcomingPICarousel } from '../../components/UpcomingPICarousel';
import { QuickActionsFAB } from '../../components/shared/QuickActionsFAB';
import GuidedPlaceholderModule from '../../components/shared/GuidedPlaceholderModule';

import { DashboardExtraCards } from '../../components/DashboardExtraCards';
import { ExploreBySector } from '../../components/ExploreBySector';
import { NotificationDrawer } from '../../components/NotificationDrawer';

// --- Theme Configuration (Vibrant Palette) ---
const THEME = {
    bgGradient: 'radial-gradient(circle, #EAF2EA, #F0EAE1, #E2D1C3, #C2A895)',
    sidebarBg: 'linear-gradient(to bottom, #1f2a44, #202024)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#f47729',
    primaryDark: '#ad7332',
    accent: '#af7a2b',
    textMain: '#2e3118',
    textMuted: '#53483e',
    textSubtle: '#8c7361',
    cardBg: '#FFFFFF',
    gold: '#af7a2b',
    navyDeep: '#091d38',
    navy: '#214573',
    orangeBright: '#f47729',
    olive: '#606934',
    blueMuted: '#5167a2',
    darkOlive: '#2e3118',
    warmGray: '#53483e',
    warmBrown: '#93644b',
    sageTeal: '#7c9d9c',
    deepTeal: '#426a77',
    earthyBrown: '#836350',
    lightAqua: '#5da7b3',
    slateBlue: '#627680',
    dustyRose: '#bf8f7e',
    darkKhaki: '#5e4b2b',
    bronze: '#ad7332',
    silver: '#adb2b0',
    taupe: '#8c7361',
    lightTan: '#d2af94',
};

// --- System Modules Data ---
const SYSTEM_MODULES = [
  { id: 'dashboard', label: 'HOME', icon: LayoutDashboard },
  { id: 'calendar', label: 'CALENDAR', icon: Calendar },
  { id: 'notification_center', label: 'NOTIFICATION CENTER', icon: Bell },
  { id: 'ai_copilot', label: 'AI COPILOT', icon: Sparkles },
  { id: 'heading_op', isHeading: true, label: 'OPERATIONAL MODULES' },
  {
    id: 'sales_operations', label: 'SALES OPERATIONS', icon: ShoppingCart,
    subItems: [
      { id: 'customer_directory', label: 'Customer Directory' },
      { id: 'sale_rep_directory', label: 'Sale Representative' },
      { id: 'performa_invoice', label: 'Proforma Invoice (PI)' },
      { id: 'products_catalogue', label: 'Products Catalogue' },
      { id: 'quotations', label: 'Quotations & Proposals' },
      { id: 'contracts', label: 'Contracts Management' },
      { id: 'invoicing', label: 'Invoicing & Billing' }
    ]
  },
  {
    id: 'oem_procurement', label: 'OEM PROCUREMENT', icon: Factory,
    subItems: [
      { id: 'issue_factory_po', label: 'Issue Factory PO (OEM)' },
      { id: 'oem_agreements', label: 'OEM Agreements' },
      { id: 'production_tracking', label: 'Production Tracking' }
    ]
  },
  {
    id: 'export_logistics', label: 'EXPORT LOGISTICS', icon: Ship,
    subItems: [
      { id: 'booking_request', label: 'BOOKING REQUEST' },
      { id: 'booking_confirmation', label: 'BOOKING CONFIRMATION' },
      { id: 'shipping_instruction', label: 'SHIPPING INSTRUCTION' },
      { id: 'loading_notice', label: 'LOADING NOTICE' },
      { id: 'packing_list', label: 'PACKING LIST' },
      { id: 'commercial_invoice', label: 'COMMERCIAL INVOICE' },
      { id: 'dispatch_container', label: 'Dispatch Container & Truck' },
      { id: 'export_documentation', label: 'Export Documentation' },
      { id: 'shipping_status_lookup', label: 'Shipping Status Lookup' }
    ]
  },
  {
    id: 'analytics', label: 'PERFORMANCE ANALYTICS', icon: TrendingUp,
    subItems: [
      { id: 'revenue_forecast', label: 'Revenue Forecast' },
      { id: 'conversion_rates', label: 'Conversion Rates' },
      { id: 'sales_rep_performance', label: 'Sales Rep Performance' },
      { id: 'deposits_down_payment', label: 'Deposits & Down Payment' },
      { id: 'credit_limit_mgmt_analytics', label: 'Credit Limit Management' },
      { id: 'sales_commission_analytics', label: 'Sales Commission' },
      { id: 'price_books', label: 'Price Books' }
    ]
  },
  {
    id: 'finance', label: 'FINANCE', icon: DollarSign,
    subItems: [
      { id: 'payment_collection', label: 'Payment Collection' },
      { id: 'accounts_receivable', label: 'Accounts Receivable' },
      { id: 'credit_limit_mgmt_fin', label: 'Credit Limit Mgmt' },
      { id: 'marketing_fund', label: 'Marketing Fund Spend' },
      { id: 'sales_commission_fin', label: 'Sales Commission' },
      { id: 'expense_claims_fin', label: 'Expense Claims' },
      { id: 'vendor_payments', label: 'Vendor Payments' }
    ]
  },
  {
    id: 'master_data', label: 'MASTER DATA', icon: Database,
    subItems: [
      { id: 'categories_config', label: 'Categories Config' },
      { id: 'master_item', label: 'Master Item' },
      { id: 'customer_directory', label: 'Customer Directory' },
      { id: 'sale_representative', label: 'Sale Representative' }
    ]
  },
  { 
    id: 'settings', 
    label: 'SETTINGS', 
    icon: Settings,
    subItems: [
      { id: 'user_permission', label: 'User Permission' },
      { id: 'system_config', label: 'System Config' },
      { id: 'company_regulations', label: 'Company Regulations' },
      { id: 'google_sheets_sync', label: 'Google Sheets Sync' }
    ]
  }
];

const MOCK_STATS = [
    { label: 'Total Revenue (YTD)', value: '$4.82M', sub: '+12.4% vs Budget', icon: DollarSign, color: THEME.orangeBright },
    { label: 'Active Leads', value: '142', sub: '24 Pending Follow-up', icon: Target, color: THEME.slateBlue },
    { label: 'Conversion Rate', value: '24.8%', sub: '+2.1% vs Last Month', icon: TrendingUp, color: THEME.bronze },
    { label: 'Marketing ROI', value: '320%', sub: 'Across all campaigns', icon: Target, color: THEME.deepTeal },
];

const GlassCard = ({ children, className = '', hoverEffect = true, style = {} }: any) => (
    <div className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);

const HeroBanner = () => {
    const bgImage = "https://img.freepik.com/premium-photo/tamarind-tropical-fruits-with-leaf-wooden-bowl-stone-background_187166-58111.jpg";
    return (
      <div className="relative w-full h-[180px] md:h-[220px] rounded-3xl overflow-hidden shadow-xl mb-4 group bg-[#1f2a44]">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <img
            src={bgImage}
            alt="Tamarind Pro Organic Ingredients Background"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            style={{ objectPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f2a44] via-[#1f2a44]/80 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center p-6 md:px-10 w-full md:w-3/4 lg:w-2/3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} className="text-[#f47729] animate-pulse" />
            <span className="text-[9px] text-[#f47729] font-bold uppercase tracking-widest">COMMAND CENTER</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-3 drop-shadow-md">
            INTELLIGENT SALES & <span className="text-[#f47729]">EXPORT</span>
          </h2>
          <div className="pl-3 border-l-[3px] border-[#f47729] mb-5">
            <p className="text-[#E2D1C3] text-[11px] md:text-[13px] font-medium tracking-wide max-w-xl leading-relaxed">
              Intelligent sales and export management system. Accelerate global revenue through data-driven insights and automation tailored for comprehensive processed tamarind products.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white hover:bg-slate-100 text-[#f47729] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg">
              <Zap size={12} className="text-[#f47729]" /> ACTION REQUIRED
            </button>
            <button className="bg-[#1f2a44]/80 hover:bg-[#254268] backdrop-blur-md text-white border border-[#3d5591] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">
              VIEW REPORTS
            </button>
          </div>
        </div>
      </div>
    );
};

const MetricCard = ({ label, val, unit, icon: Icon, color, desc }: any) => (
  <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-[#cdd0db] relative overflow-hidden group h-full transition-all hover:shadow-md">
    <div className="absolute -right-6 -bottom-6 opacity-[0.1] transform rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
        <Icon size={100} style={{color: color}} />
    </div>
    <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#7691ad] uppercase tracking-wider opacity-90 truncate">{label}</p>
            <h4 className="text-2xl font-black tracking-tight mt-0.5" style={{color: '#1f2a44'}}>{val}</h4>
            {desc && (
                <p className="text-[9px] text-[#5a4e70] font-bold mt-2 flex items-center gap-1.5 bg-white/40 w-fit px-2 py-0.5 rounded-full border border-black/5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: color}}></span>
                    {desc}
                </p>
            )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white backdrop-blur-md shadow-sm" 
            style={{backgroundColor: color + '15'}}>
            <Icon size={18} style={{color: color}} />
        </div>
    </div>
  </div>
);

const SalesChartArea = () => {
  const data = [
    { name: "B2B Enterprise", target: 60, actual: 64, color: THEME.orangeBright },
    { name: "Retail Channels", target: 25, actual: 20, color: THEME.sageTeal },
    { name: "E-commerce", target: 15, actual: 16, color: THEME.gold },
  ];
  return (
    <GlassCard className="lg:col-span-2 bg-gradient-to-br from-white to-[#f0f2f5] border-[#adb2b0]">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-base font-black text-[#2e3118] flex items-center gap-2 uppercase tracking-tight">
            <BarChart2 size={16} className="text-[#f47729]" /> Strategic Sales Analysis
        </h2>
        <span className="text-[8px] text-white font-black bg-[#5da7b3] px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Real-time</span>
      </div>
      <div className="space-y-4 relative z-10">
        {data.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group/bar">
              <div className="w-28 text-[9px] font-black text-[#53483e] uppercase truncate tracking-tight">{item.name}</div>
              <div className="flex-1 h-4 rounded-lg relative flex items-center bg-[#adb2b0]/40 shadow-inner overflow-hidden">
                <div className="h-full transition-all duration-1000 relative z-10 rounded-lg"
                  style={{ width: `${item.actual}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)` }} />
              </div>
              <div className="w-10 text-right">
                <span className="text-[10px] font-black text-[#2e3118]">{item.actual}%</span>
              </div>
            </div>
        ))}
      </div>
    </GlassCard>
  );
};

const UrgentTasks = () => (
  <GlassCard className="bg-gradient-to-b from-white to-[#adb2b0]/20 border-[#8c7361]/30">
    <div className="flex justify-between items-center mb-4 relative z-10">
      <h2 className="text-base font-black text-[#2e3118] flex items-center gap-2 uppercase tracking-tight">
          <AlertCircle size={16} className="text-[#f47729]" /> Critical Action
      </h2>
      <span className="text-[8px] font-black bg-[#f47729]/10 text-[#f47729] px-3 py-1 rounded-full uppercase tracking-widest">3 Tasks</span>
    </div>
    <div className="space-y-2.5 relative z-10">
        {[
          { title: "Approve Enterprise Deal SO-2026-001", type: "Sales Order", icon: ShoppingCart, urgent: true, color: 'text-[#f47729]', bg: 'bg-[#f47729]/10' },
          { title: "Follow up on Hot Lead - TechCorp", type: "Lead Action", icon: Target, urgent: true, color: 'text-[#af7a2b]', bg: 'bg-[#af7a2b]/10' },
          { title: "Review Q3 Marketing Campaign", type: "Campaign Mgmt", icon: Megaphone, urgent: false, color: 'text-[#5da7b3]', bg: 'bg-[#5da7b3]/10' },
        ].map((task, i) => (
          <div key={i} className="p-3 bg-white/70 rounded-xl border border-[#adb2b0]/30 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
            <div className={`p-2 rounded-lg ${task.bg} ${task.color} shrink-0`}>
                <task.icon size={12}/>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-[#2e3118] tracking-tight truncate">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[8px] text-[#8c7361] font-bold uppercase">{task.type}</p>
                    {task.urgent && <span className="text-[7px] font-black text-[#f47729] uppercase animate-pulse">Critical</span>}
                </div>
            </div>
          </div>
        ))}
    </div>
    <button className="w-full mt-4 py-3 bg-[#091d38] text-white text-[9px] font-bold uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-widest hover:bg-[#214573]">
        <Calendar size={12} /> Schedule
    </button>
  </GlassCard>
);

const NavItem = ({ item, depth = 0, activeTab, setActiveTab, expandedMenus, toggleMenu, isSidebarOpen }: any) => {
    if (item.isHeading) {
        if (!isSidebarOpen) return <div className="h-4" />;
        return (
            <div className="mt-6 mb-2 px-4">
                <span className="text-[10px] font-black text-[#5368a6] opacity-90 uppercase tracking-widest">{item.label}</span>
            </div>
        );
    }

    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus[item.id];
    const isActive = activeTab === item.id;
    const isChildActive = (items: any) => items?.some((child: any) => child.id === activeTab || isChildActive(child.subItems));
    const childActive = isChildActive(item.subItems);

    if (depth === 0) {
        return (
            <div className="mb-1.5">
                <button onClick={() => hasSubItems ? toggleMenu(item.id) : setActiveTab(item.id)}
                    className={`group w-full flex items-center transition-all duration-300 relative rounded-xl mx-auto
                        ${isActive ? 'text-white shadow-lg bg-[#5368a6] border border-white/10' : childActive ? 'text-white bg-transparent border border-transparent' : 'text-[#8a9cbf] hover:bg-[#3d5591] hover:text-white border border-transparent'}
                        ${!isSidebarOpen ? 'justify-center w-12 px-0' : 'w-[94%] px-3 justify-start'} py-3`}
                    >
                    <item.icon size={18} className={`relative z-10 transition-transform ${isActive || childActive ? 'text-white scale-110' : 'text-[#e8a77f]/90 group-hover:text-[#e8a77f] group-hover:scale-110'}`} />
                    {isSidebarOpen && (
                        <div className="relative z-10 flex items-center justify-between flex-1 ml-3 overflow-hidden">
                            <span className={`text-[11.5px] tracking-wider uppercase text-left ${isActive || childActive ? 'font-black text-white' : 'font-bold opacity-90 group-hover:text-[#8a9cbf]'}`}>{item.label}</span>
                            {hasSubItems && <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />}
                        </div>
                    )}
                </button>
                {isSidebarOpen && hasSubItems && (
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        {item.subItems.map((sub: any) => (
                            <NavItem key={sub.id} item={sub} depth={depth + 1} activeTab={activeTab} setActiveTab={setActiveTab} expandedMenus={expandedMenus} toggleMenu={toggleMenu} isSidebarOpen={isSidebarOpen} />
                        ))}
                    </div>
                )}
            </div>
        );
    } else {
        const paddingLeft = depth * 12 + 15;
        return (
            <div className="mb-1">
                <button onClick={() => hasSubItems ? toggleMenu(item.id) : setActiveTab(item.id)}
                    className={`group w-full flex items-center py-2 pr-3 rounded-lg transition-all relative
                        ${isActive ? 'text-white font-black bg-[#5368a6]/50' : 'text-[#8a9cbf] hover:text-white hover:bg-[#3d5591] font-bold'}`}
                    style={{ paddingLeft: `${paddingLeft}px` }}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-all ${isActive ? 'bg-[#af7a2b] scale-150 shadow-[0_0_8px_rgba(175,122,43,0.6)]' : 'bg-[#5167a2] group-hover:bg-[#f47729] group-hover:scale-125'}`} />
                    <span className="flex-1 text-left text-[10.5px] uppercase tracking-wider truncate transition-colors">{item.label}</span>
                    {hasSubItems && <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                </button>
                {isSidebarOpen && hasSubItems && (
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        {item.subItems.map((sub: any) => (
                            <NavItem key={sub.id} item={sub} depth={depth + 1} activeTab={activeTab} setActiveTab={setActiveTab} expandedMenus={expandedMenus} toggleMenu={toggleMenu} isSidebarOpen={isSidebarOpen} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
};

// --- Main App ---

export default function Home() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  
  const { visibility } = useVisibility();
  const { language, setLanguage, t } = useLanguage();

  // Filter SYSTEM_MODULES based on visibility state
  const visibleModules = useMemo(() => {
    return SYSTEM_MODULES.map(module => {
      // Admin injected tabs
      let finalModule: any = { ...module };

      // Translate top-level and heading labels
      if (finalModule.id === 'dashboard') finalModule.label = t('label_home', finalModule.label);
      if (finalModule.id === 'calendar') finalModule.label = t('label_calendar', finalModule.label);
      if (finalModule.id === 'notification_center') finalModule.label = t('label_notification', finalModule.label);
      if (finalModule.id === 'ai_copilot') finalModule.label = t('label_ai_copilot', finalModule.label);
      if (finalModule.id === 'sales_operations') finalModule.label = t('label_sales_operations', finalModule.label);
      if (finalModule.id === 'oem_procurement') finalModule.label = t('label_oem_procurement', finalModule.label);
      if (finalModule.id === 'export_logistics') finalModule.label = t('label_export_logistics', finalModule.label);
      if (finalModule.id === 'analytics') finalModule.label = t('label_analytics', finalModule.label);
      if (finalModule.id === 'finance') finalModule.label = t('label_finance', finalModule.label);
      if (finalModule.id === 'master_data') finalModule.label = t('label_master', finalModule.label);
      if (finalModule.id === 'settings') finalModule.label = t('label_settings', finalModule.label);
      
      if (module.id === 'settings' && (user as any)?.isDev) {
        finalModule = {
          ...finalModule,
          subItems: [
            ...(module.subItems || []),
            { id: 'dev_permit', label: 'DEV PERMIT BETA' },
            { id: 'dev_logs', label: 'System Logs' }
          ]
        };
      }
      
      // Filter out root items if visibility says false
      if (visibility[finalModule.id] === false) return null;
      
      // Filter out sub items
      if (finalModule.subItems) {
        const filteredSubs = finalModule.subItems.filter((sub: any) => visibility[sub.id] !== false);
        return { ...finalModule, subItems: filteredSubs };
      }
      return finalModule;
    }).filter(Boolean);
  }, [visibility, user, t]);
  const currentUser = {
      name: user?.name || 'T-DCC Developer',
      position: user?.role || 'LEAD DEVELOPER',
      avatar: user?.avatar || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (window as any).toggleConfidentialWatermark = (force?: boolean) => {
        const hasWatermark = document.body.classList.contains('has-print-watermark');
        const shouldAdd = force !== undefined ? force : !hasWatermark;
        
        if (shouldAdd) {
            document.body.classList.add('has-print-watermark');
            document.body.setAttribute('data-print-watermark', 'CONFIDENTIAL');
        } else {
            document.body.classList.remove('has-print-watermark');
            document.body.removeAttribute('data-print-watermark');
        }
    };
  }, []);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({...prev, [menuKey]: !prev[menuKey]}));
    if(!sidebarOpen) setSidebarOpen(true);
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden flex-col md:flex-row" style={{ background: THEME.bgGradient }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Noto+Sans+Thai:wght@400;700;900&display=swap');
        body, .font-sans { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #5372ba22; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #5372ba; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      {/* SVG Gradient Definition for Gemini Theme Icon - Optimized for Relation/Partnership */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="geminiRelationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="45%" stopColor="#9B72CB" />
            <stop offset="100%" stopColor="#D96570" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* SIDEBAR */}
      <aside className={`print-hide flex-shrink-0 flex flex-col transition-all duration-700 z-30 shadow-2xl relative ${sidebarOpen ? 'w-72' : 'w-24'}`} style={{ background: THEME.sidebarBg }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-10 w-7 h-7 bg-gradient-to-tr from-[#f47729] via-[#ad7332] to-[#af7a2b] text-white rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(244,119,41,0.4)] z-50 border-2 border-[#202024] transition-transform hover:scale-110">
            {sidebarOpen ? <ChevronRight size={12} className="rotate-180" /> : <ChevronRight size={12} />}
        </button>

        <div className="h-24 flex items-center justify-center border-b border-white/5 px-4 shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#c6a75e] via-[#e6be63] to-[#f0f6f4] shadow-[0_0_15px_rgba(198,167,94,0.3)] relative shrink-0">
                    <div className="w-full h-full rounded-full bg-[#0F172A] bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[sys-shimmer_2s_infinite]"></div>
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/014/568/199/small_2x/sweet-tamarind-a-healthy-fruit-that-is-high-in-fiber-help-the-digestive-system-for-vegetarians-png.png" alt="Tamarind Logo" className="w-[32px] h-[32px] object-contain relative z-10 drop-shadow-md" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#ff929a] rounded-full border-2 border-[#202024] animate-pulse"></div>
                </div>
                {sidebarOpen && (
                    <div className="overflow-hidden">
                        <h1 className="text-[24px] font-black tracking-tighter leading-none uppercase flex items-center">
                            <span className="text-white">TAMARIND</span><span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#c6a75e] to-[#e6be63]">PRO</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1.5 opacity-80">
                            <div className="h-[1px] w-4 bg-gradient-to-r from-[#c6a75e] to-transparent"></div>
                            <p className="text-[#8a9cbf] text-[9px] font-medium uppercase tracking-[0.2em] leading-none">Sales & Export Hub</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar py-4">
          {visibleModules.map((module: any) => (
            <NavItem key={module.id} item={module} activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={sidebarOpen} expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
          ))}
        </nav>

        {/* SIDEBAR FOOTER - DEV PROFILE */}
        <div className="p-4 shrink-0 pb-6 flex flex-col gap-4 border-t border-white/5 pt-4">
            <div className="shrink-0 flex items-center justify-center">
                {sidebarOpen ? (
                   <div className="flex items-center gap-2 bg-black/20 rounded-full px-3 py-1.5 w-full justify-between shadow-inner">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]"></div>
                            <span className="text-[9px] text-[#8a9cbf] uppercase tracking-widest font-black">SHEETS SYNC</span>
                        </div>
                        <span className="text-[9px] text-white/70 font-mono" title="Last auto sync time">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                   </div>
                ) : (
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" title="Google Sheets Sync: Active"></div>
                )}
            </div>
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                <div className="w-10 h-10 rounded-full border border-[#5372ba]/40 overflow-hidden shadow-md bg-white/5 shrink-0">
                    <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Avatar" />
                </div>
                {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-[11px] font-black tracking-tight leading-none truncate">{currentUser.name}</p>
                        <p className="text-[#6293b9] text-[9px] font-black uppercase tracking-widest mt-1.5">{currentUser.position}</p>
                    </div>
                )}
                {sidebarOpen && <LogOut onClick={logout} size={16} className="text-[#ff929a] opacity-70 hover:opacity-100 cursor-pointer transition-all ml-auto" />}
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-transparent">
        {/* GLOBAL SCROLLABLE AREA - ENCOMPASSES HEADER, CONTENT, AND FOOTER */}
        <div className="flex-1 custom-scrollbar overflow-y-auto flex flex-col min-h-0">
            <header className="print-hide pt-5 pb-3 px-8 flex items-center justify-between z-10 shrink-0 bg-transparent">
                <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center shrink-0">
                        <svg width="0" height="0" className="absolute">
                          <linearGradient id="tamarindGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop stopColor="#6C4E3D" offset="0%" />
                            <stop stopColor="#af7a2b" offset="50%" />
                            <stop stopColor="#4d5a44" offset="100%" />
                          </linearGradient>
                        </svg>
                        <Target size={34} stroke="url(#tamarindGrad)" strokeWidth={2.6} className="drop-shadow-sm" />
                    </div>
                    <div>
                        <h3 className="font-black uppercase tracking-tighter leading-none flex items-center" style={{ fontSize: '22px' }}>
                            <span className="text-[#3b4737] mr-2 text-[26px]">WORLD CLASS</span> 
                            <span className="text-[#f47729] mr-2 text-[26px]">TAMARIND</span> 
                            <span className="text-[#3b4737] text-[26px]">PRODUCT</span>
                        </h3>
                        {/* Compact Spacing between Title and Subtitle */}
                        <div className="flex items-center gap-3 mt-1.5 opacity-90">
                            <div className="h-[2px] w-10 bg-[#a97042]"></div>
                            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] leading-tight text-[#8c6b4f]">
                                SALE, REVENUE TRACKING & EXPORT MANAGEMENT
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="hidden md:flex items-center justify-center bg-white border-2 border-[#091d38] text-[#091d38] rounded-full shadow-sm px-4 h-11 hover:bg-[#091d38] hover:text-white transition-colors gap-2 group"
                        title="Print Preview"
                    >
                        <Eye size={16} className="text-[#af7a2b] group-hover:text-[#f47729]" />
                        <span className="text-[11px] font-black uppercase tracking-widest hidden lg:inline">Print Preview</span>
                    </button>
                    <button 
                        onClick={() => (window as any).toggleConfidentialWatermark?.()}
                        className="hidden md:flex items-center justify-center bg-white rounded-full shadow-sm px-4 border border-[#cdd0db]/50 h-11 hover:bg-[#f8f9fa] transition-colors gap-2"
                        title="Toggle Confidential Watermark"
                    >
                        <ShieldCheck size={16} className="text-[#5167a2]" />
                        <span className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest hidden lg:inline">Watermark</span>
                    </button>
                    <button 
                        onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                        className="hidden md:flex items-center justify-center bg-white rounded-full shadow-sm px-3 border border-[#cdd0db]/50 h-11 hover:bg-[#f8f9fa] transition-colors"
                        title={language === 'en' ? 'Switch to Thai' : 'Switch to English'}
                    >
                        <Globe size={16} className="text-[#627680] mr-1.5" />
                        <span className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest">
                            {language === 'en' ? 'EN' : 'TH'}
                        </span>
                    </button>
                    <div className="hidden lg:flex items-center bg-white rounded-full shadow-sm p-1 pr-1.5 pl-6 gap-5 border border-[#cdd0db]/50 h-11">
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-[9px] font-black text-[#627680] uppercase tracking-[0.1em] leading-none mb-0.5">{currentTime.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                            <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2e3118] to-[#426a77] leading-none">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="bg-[#2e3118] text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner h-full">
                            <Clock size={14} className="text-[#f47729]" strokeWidth={2.5} />
                            <span className="text-[12px] font-black font-mono tracking-widest mt-0.5">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsNotificationDrawerOpen(true)}
                        className="relative w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5da7b3] hover:bg-[#091d38] hover:text-[#f47729] transition-all group border border-[#adb2b0]/50 hover:scale-105"
                        title="Alerts, Pending Approvals & Shipment Updates"
                    >
                        <Bell size={18} className="group-hover:rotate-12 transition-transform" strokeWidth={2} />
                        <span className="absolute top-2.5 right-2 rounded-full w-2.5 h-2.5 bg-red-500 shadow-[0_0_0_2px_#ffffff] animate-ping"></span>
                        <span className="absolute top-2.5 right-2 rounded-full w-2.5 h-2.5 bg-red-500 shadow-[0_0_0_2px_#ffffff]"></span>
                    </button>
                </div>
            </header>

            {/* DYNAMIC CONTENT AREA */}
            <div className={`flex-1 flex flex-col justify-start w-full`}>
            {activeTab === 'dashboard' ? (
                <div className="w-full px-4 sm:px-8 space-y-6 animate-fadeIn pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-[#2e3118] tracking-tight uppercase">
                                Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f47729] to-[#ad7332]">{currentUser.name}!</span>
                            </h1>
                            <p className="text-[#627680] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                <TrendingUp size={14} className="text-[#f47729]" /> Export Target: <span className="text-[#5da7b3]">On Track (120.5%)</span>
                            </p>
                        </div>
                    </div>

                    <HeroBanner />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                        {MOCK_STATS.map((stat, idx) => (
                            <MetricCard key={idx} {...stat} val={stat.value} desc={stat.sub} />
                        ))}
                    </div>

                    <ExploreBySector />

                    <UpcomingPICarousel />

                    <DashboardExtraCards />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <SalesChartArea />
                        <UrgentTasks />
                    </div>
                </div>
            ) : activeTab === 'calendar' ? (
                <div className="w-full flex-1 flex flex-col">
                <CalendarHub />
                </div>
            ) : activeTab === 'notification_center' ? (
                <div className="w-full flex-1 flex flex-col">
                <NotificationCenter />
                </div>
            ) : activeTab === 'ai_copilot' ? (
                <div className="w-full flex-1 flex flex-col">
                <AICopilot />
                </div>
            ) : activeTab === 'user_permission' ? (
                <div className="w-full flex-1 flex flex-col">
                <UserPermission />
                </div>
            ) : activeTab === 'system_config' ? (
                <div className="w-full flex-1 flex flex-col">
                <SystemConfig />
                </div>
            ) : activeTab === 'company_regulations' ? (
                <div className="w-full flex-1 flex flex-col">
                <CompanyRegulations />
                </div>
            ) : activeTab === 'google_sheets_sync' ? (
                <div className="w-full flex-1 flex flex-col">
                <GoogleSheetsSync />
                </div>
            ) : activeTab === 'quotations' ? (
                <div className="w-full flex-1 flex flex-col">
                <Quotations />
                </div>
            ) : activeTab === 'contracts' ? (
                <div className="w-full flex-1 flex flex-col">
                <ContractsManagement />
                </div>
            ) : activeTab === 'performa_invoice' || activeTab === 'proforma_invoice' ? (
                <div className="w-full flex-1 flex flex-col">
                <ProformaInvoice />
                </div>
            ) : activeTab === 'master_item' || activeTab === 'products_catalogue' ? (
                <div className="w-full flex-1 flex flex-col">
                <ProductsCatalogue />
                </div>
            ) : activeTab === 'customer_directory' ? (
                <div className="w-full flex-1 flex flex-col">
                <CustomerDirectory />
                </div>
            ) : activeTab === 'sale_representative' || activeTab === 'sale_rep_directory' ? (
                <div className="w-full flex-1 flex flex-col">
                <SaleRepDirectory />
                </div>
            ) : activeTab === 'issue_factory_po' ? (
                <div className="w-full flex-1 flex flex-col">
                <FactoryPO />
                </div>
            ) : activeTab === 'booking_request' ? (
                <div className="w-full flex-1 flex flex-col">
                <BookingRequest />
                </div>
            ) : activeTab === 'booking_confirmation' ? (
                <div className="w-full flex-1 flex flex-col">
                <BookingConfirmation />
                </div>
            ) : activeTab === 'shipping_instruction' ? (
                <div className="w-full flex-1 flex flex-col">
                <ShippingInstruction />
                </div>
            ) : activeTab === 'loading_notice' ? (
                <div className="w-full flex-1 flex flex-col">
                <LoadingNotice />
                </div>
            ) : activeTab === 'packing_list' ? (
                <div className="w-full flex-1 flex flex-col">
                <PackingList />
                </div>
            ) : activeTab === 'commercial_invoice' ? (
                <div className="w-full flex-1 flex flex-col">
                <CommercialInvoice />
                </div>
            ) : activeTab === 'dev_permit' ? (
                <div className="w-full flex-1 flex flex-col">
                <DevPermit />
                </div>
            ) : activeTab === 'dev_logs' ? (
                <div className="w-full flex-1 flex flex-col">
                <SystemLogs />
                </div>
            ) : activeTab === 'price_books' ? (
                <div className="w-full flex-1 flex flex-col">
                <PriceBooks />
                </div>
            ) : activeTab === 'revenue_forecast' ? (
                <div className="w-full flex-1 flex flex-col">
                <RevenueForecast />
                </div>
            ) : activeTab === 'sales_rep_performance' ? (
                <div className="w-full flex-1 flex flex-col">
                <SalesRepPerformance />
                </div>
            ) : activeTab === 'deposits_down_payment' ? (
                <div className="w-full flex-1 flex flex-col">
                <DepositsDownPayment />
                </div>
            ) : activeTab === 'payment_collection' ? (
                <div className="w-full flex-1 flex flex-col">
                <PaymentCollection />
                </div>
            ) : activeTab === 'credit_limit_mgmt_fin' || activeTab === 'credit_limit_mgmt_analytics' || activeTab === 'credit_limit' ? (
                <div className="w-full flex-1 flex flex-col">
                <CreditLimitManagement />
                </div>
            ) : activeTab === 'shipping_status_lookup' ? (
                <div className="w-full flex-1 flex flex-col">
                <ShippingStatusLookup />
                </div>
            ) : activeTab === 'dispatch_container' ? (
                <div className="w-full flex-1 flex flex-col">
                <DispatchContainer />
                </div>
            ) : activeTab === 'dashboard' ? (
                <div className="w-full flex-1 flex flex-col">
                <Dashboard />
                </div>
            ) : activeTab === 'accounts_receivable' ? (
                <GuidedPlaceholderModule 
                    title="Accounts Receivable"
                    desc="Monitor and manage aging receivable accounts."
                    guideTitle="Accounts Receivable Guide"
                    guideDesc="คู่มือจัดการบัญชีลูกหนี้"
                    sections={[
                        { id: '1', title: 'การจัดการลูกหนี้ (AR)', icon: 'DollarSign', description: 'ติดตามสถานะลูกหนี้และอายุลูกหนี้', bullets: [{ icon: 'FileText', text: 'สรุปยอดที่ยังไม่เรียกเก็บและที่เกินกำหนด' }] }
                    ]}
                />
            ) : activeTab === 'marketing_fund' ? (
                <GuidedPlaceholderModule 
                    title="Marketing Fund Spend"
                    desc="Track marketing budgets and expenditures."
                    guideTitle="Marketing Fund Guide"
                    guideDesc="คู่มือการใช้งบประมาณการตลาด"
                    sections={[
                        { id: '1', title: 'การเบิกจ่ายงบประมาณ (Fund Spend)', icon: 'Megaphone', description: 'ควบคุมงบการใช้งานด้านการตลาด', bullets: [{ icon: 'DollarSign', text: 'วางแผนและติดตามงบประมานรายแคมเปญ' }] }
                    ]}
                />
            ) : activeTab === 'sales_commission' || activeTab === 'sales_commission_fin' || activeTab === 'sales_commission_analytics' ? (
                <GuidedPlaceholderModule 
                    title="Sales Commission"
                    desc="Calculate and review sales representative commissions."
                    guideTitle="Sales Commission Guide"
                    guideDesc="คู่มือคำนวณและจ่ายค่าคอมมิชชั่น"
                    sections={[
                        { id: '1', title: 'ค่าคอมมิชชั่นพนักงานขาย', icon: 'Award', description: 'สรุปยอดเบิกจ่ายและการคำนวณผลตอบแทน', bullets: [{ icon: 'TrendingUp', text: 'คำนวณยอดจาก Conversion และระดับผลงาน' }] }
                    ]}
                />
            ) : activeTab === 'expense_claims_fin' || activeTab === 'expense_claims' ? (
                <GuidedPlaceholderModule 
                    title="Expense Claims"
                    desc="Review and approve employee expense reimbursements."
                    guideTitle="Expense Claims Guide"
                    guideDesc="คู่มือการเบิกค่าใช้จ่าย"
                    sections={[
                        { id: '1', title: 'คำขอเบิกค่าใช้จ่ายต่างๆ (Expense)', icon: 'ClipboardList', description: 'ระบบอนุมัติคำขอค่าใช้จ่ายพนักงานเบ็ดเตล็ด', bullets: [{ icon: 'CheckCircle2', text: 'ตรวจสอบและอนุมัติตามลำดับขั้น' }] }
                    ]}
                />
            ) : activeTab === 'vendor_payments' ? (
                <GuidedPlaceholderModule 
                    title="Vendor Payments"
                    desc="Manage payouts and balances for suppliers."
                    guideTitle="Vendor Payments Guide"
                    guideDesc="คู่มือการจัดการจ่ายเงิน Supplier"
                    sections={[
                        { id: '1', title: 'การชำระเงินผู้ขาย (Vendor Pays)', icon: 'Briefcase', description: 'ดำเนินการชำระเงินแก่คู่ค้าที่บันทึกในระบบ', bullets: [{ icon: 'DollarSign', text: 'การชำระบิลตามรอบระยะเวลาต่างๆ' }] }
                    ]}
                />
            ) : (
                <div className="w-full px-4 sm:px-8 py-12 text-center animate-fadeIn flex-1 flex flex-col justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#091d38] flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-[#5da7b3]">
                        <Database size={28} className="text-[#5167a2]" />
                    </div>
                    <h2 className="text-xl font-black text-[#2e3118] uppercase tracking-tight mb-3">{activeTab.replace(/_/g, ' ')} Module</h2>
                    <GlassCard className="max-w-sm mx-auto py-8">
                        <p className="text-[10px] text-[#53483e] font-bold leading-relaxed mb-6">
                            Workspace "{activeTab}" is loading real-time sales data.
                        </p>
                        <button onClick={() => setActiveTab('dashboard')} className="px-6 py-2.5 bg-[#091d38] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#214573] transition-colors shadow-lg">
                            Back to Dashboard
                        </button>
                    </GlassCard>
                </div>
            )}
            </div>

            {/* FINAL BALANCED FOOTER SHARED ACROSS ALL PAGES */}
            <footer className="print-hide mt-auto shrink-0 py-3.5 flex flex-col items-center gap-1.5 text-center px-8 text-[#2e3118] w-full bg-transparent">
                <div className="flex items-center justify-center">
                    <span className="text-[12px] flex items-center gap-2 font-black uppercase tracking-widest opacity-80">
                        <Award size={16} className="text-[#af7a2b]" /> TAMARIND PRO • EMPOWERING BUSINESS GROWTH & CUSTOMER SUCCESS
                    </span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#8c7361]">
                    <p className="flex items-center"><span className="font-light mr-1">System by</span> <span className="font-black text-[#2e3118]">T All Intelligence</span></p>
                    <span className="hidden md:inline text-[#adb2b0]">|</span>
                    <p className="flex items-center gap-1.5"><PhoneCall size={14} className="text-[#af7a2b]" /> 082-5695654, 091-5165999</p>
                    <span className="hidden md:inline text-[#adb2b0]">|</span>
                    <p className="flex items-center gap-1.5"><Mail size={14} className="text-[#426a77]" /> tallintelligence.ho@gmail.com</p>
                </div>
            </footer>
        </div>
        <QuickActionsFAB setActiveTab={setActiveTab} />
        <NotificationDrawer isOpen={isNotificationDrawerOpen} onClose={() => setIsNotificationDrawerOpen(false)} />
      </main>
    </div>
  );
}
