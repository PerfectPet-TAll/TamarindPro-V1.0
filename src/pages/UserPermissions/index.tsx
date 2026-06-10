import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Synced with Home Palette) ---
const THEME = {
  bgGradient: 'linear-gradient(135deg, #d8cfd6 50%, #f6f8ec 100%)',
  primary: '#2e3118', // Deep Navy
  primaryLight: '#5da7b3', // Blue
  accent: '#ffa64a', // Orange/Ochre
  gold: '#c3924c',
  brightGold: '#af7a2b',
  success: '#606934', // Green
  danger: '#e3624a', // Salmon
  skyBlue: '#5f7ab7',
  dustyBlue: '#8c7361',
  indigo: '#5f7ab7',
  softPurple: '#9293c3',
  deepPurple: '#9293c3',
  pinkAccent: '#ca649f',
  mutedSlate: '#8c7361',
  darkSlate: '#091d38',
  silver: '#8c7361',
  deepNavy: '#091d38',
  brownGold: '#af7a2b',
  vibrantPurple: '#091d38',
  burntOrange: '#a74353',
  slateBlue: '#606934',
  coolGray: '#8c7361'
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
  
  /* Global Font Hierarchy Enforcement */
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  span, input, td, th, div, p, select, textarea, button, h1, h2, h3, h4, h5, h6, label { 
    font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; 
  }

  /* Custom Scrollbar styled identically to Home */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #8c7361; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #e2d1c3; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
`;

// --- SYSTEM MODULES ---
const SYSTEM_MODULES = [
  { id: 'dashboard', label: 'SALE & MARKETING DASHBOARD', icon: 'layout-dashboard' },
  { id: 'calendar', label: 'CALENDAR', icon: 'calendar' },
  {
    id: 'lead_management', label: 'LEAD MANAGEMENT', icon: 'filter',
    subItems: [
      { id: 'lead_inbox', label: 'Lead Inbox' },
      { id: 'lead_scoring', label: 'Lead Scoring & Routing' },
      { id: 'hot_leads', label: 'Hot Leads (Priority)' }
    ]
  },
  {
    id: 'crm_pipeline', label: 'CRM & PIPELINE', icon: 'users',
    subItems: [
      { id: 'contact_directory', label: 'Contact Directory' },
      { id: 'key_accounts', label: 'Key Accounts (B2B)' },
      { id: 'sales_pipeline', label: 'Sales Pipeline (Kanban)' },
      { id: 'activity_logs', label: 'Activity Logs' }
    ]
  },
  {
    id: 'marketing_campaigns', label: 'MARKETING CAMPAIGNS', icon: 'megaphone',
    subItems: [
      { id: 'active_campaigns', label: 'Active Campaigns' },
      { id: 'email_automation', label: 'Email Automation' },
      { id: 'social_ads', label: 'Social & Ads Spend' },
      { id: 'events_webinars', label: 'Events & Webinars' }
    ]
  },
  {
    id: 'sales_operations', label: 'SALES OPERATIONS', icon: 'briefcase',
    subItems: [
      { id: 'performa_invoice', label: 'Proforma Invoice (PI)' },
      { id: 'quotations', label: 'Quotations & Proposals' },
      { id: 'contracts', label: 'Contracts Management' },
      { id: 'invoicing', label: 'Invoicing & Billing' }
    ]
  },
  {
    id: 'analytics', label: 'PERFORMANCE ANALYTICS', icon: 'trending-up',
    subItems: [
      { id: 'revenue_forecast', label: 'Revenue Forecast' },
      { id: 'conversion_rates', label: 'Conversion Rates' },
      { id: 'campaign_roi', label: 'Campaign ROI' },
      { id: 'sales_rep_performance', label: 'Sales Rep Performance' }
    ]
  },
  {
    id: 'customer_success', label: 'CUSTOMER SUCCESS', icon: 'message-square',
    subItems: [
      { id: 'support_tickets', label: 'Support Tickets' },
      { id: 'nps_feedback', label: 'NPS & Feedback' },
      { id: 'retention_tracking', label: 'Retention Tracking' }
    ]
  },
  {
    id: 'promotions_pricing', label: 'PROMOTIONS & PRICING', icon: 'badge-percent',
    subItems: [
      { id: 'discount_codes', label: 'Discount Codes' },
      { id: 'price_books', label: 'Price Books' }
    ]
  },
  {
    id: 'finance', label: 'FINANCE', icon: 'dollar-sign',
    subItems: [
      { id: 'payment_collection', label: 'Payment Collection' },
      { id: 'accounts_receivable', label: 'Accounts Receivable' },
      { id: 'credit_limit', label: 'Credit Limit Mgmt' },
      { id: 'marketing_fund', label: 'Marketing Fund Spend' },
      { id: 'sales_commission', label: 'Sales Commission' },
      { id: 'expense_claims_fin', label: 'Expense Claims' },
      { id: 'vendor_payments', label: 'Vendor Payments' }
    ]
  },
  {
    id: 'master_data', label: 'MASTER DATA', icon: 'file-text',
    subItems: [
      { id: 'categories_config', label: 'Categories Config' },
      { id: 'master_item', label: 'Master Item' }
    ]
  },
  { 
    id: 'settings', label: 'SETTINGS', icon: 'settings',
    subItems: [
      { id: 'user_permission', label: 'User Permission' },
      { id: 'system_config', label: 'System Config' }
    ]
  }
];

const PERMISSION_LEVELS = [
  { level: 0, label: 'No Access', icon: 'ban', color: THEME.dustyBlue, bg: '#e2d1c3' },
  { level: 1, label: 'Viewer', icon: 'eye', color: THEME.skyBlue, bg: '#e2d1c3' },
  { level: 2, label: 'Editor', icon: 'edit', color: THEME.accent, bg: '#ffa64a40' },
  { level: 3, label: 'Verifier', icon: 'check-square', color: THEME.indigo, bg: '#8c7361' },
  { level: 4, label: 'Approver', icon: 'award', color: THEME.success, bg: '#60693440' },
];

const PermissionBadges = ({ user, moduleId }: any) => {
    let perms = [];
    let isFullAccess = user.isDev || (user.permissions && user.permissions['*']);
    
    if (isFullAccess) {
        perms = [1, 2, 3, 4];
    } else if (user.permissions && user.permissions[moduleId]) {
        perms = user.permissions[moduleId];
    }

    if (!perms || perms.length === 0) {
        return <span className="text-[#8c7361] font-black text-[14px] opacity-50">-</span>;
    }

    return (
        <div className="flex items-center justify-center gap-1.5">
            {perms.sort().map(level => {
                const permInfo = PERMISSION_LEVELS.find(p => p.level === level);
                if (!permInfo || level === 0) return null;
                
                const IconComp = (isFullAccess ? Icons.Check : (Icons[kebabToPascal(permInfo.icon) as keyof typeof Icons] || Icons.Circle)) as React.ElementType;

                return (
                    <div key={level} className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm border" style={{ backgroundColor: permInfo.color + '15', borderColor: permInfo.color + '30', color: permInfo.color }}>
                        <IconComp size={12} strokeWidth={isFullAccess ? 4 : 2.5} />
                    </div>
                );
            })}
        </div>
    );
};

// --- HELPER COMPONENTS ---
const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
const LucideIcon = ({ name, size = 16, className = "", color, style, strokeWidth = 2.5 }: any) => {
    if (!name) return null;
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons[pascalName as keyof typeof Icons] as React.ElementType) || Icons.CircleHelp;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
};

const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#e2d1c3] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#af7a2b] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#8c7361] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={20} />
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between">
            <p className="text-[28px] font-black leading-none text-[#2e3118]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[11px] font-bold text-[#5da7b3] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#2e3118]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#af7a2b] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#af7a2b] bg-[#2e3118] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.BookOpen size={22} className="text-[#af7a2b]"/> PERMISSION GUIDE</h3>
            <p className="text-[12px] font-bold text-[#e7dedd] uppercase tracking-widest mt-1.5">Access Control Management</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#e3624a] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#091d38] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#2e3118] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#e7dedd] pb-2 font-mono">
              <Icons.ShieldAlert size={18} className="text-[#af7a2b]"/> 1. Confidential Restricted
            </h4>
            <p className="text-[12px] mb-3">ระบบอนุญาตให้คุณกำหนดความลับของข้อมูลได้ทั้งระดับ <b>โมดูลหลัก</b> และ <b>เมนูย่อย</b>:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#e2d1c3]">
                  <Icons.Eye size={16} className="shrink-0 text-[#5da7b3] mt-0.5"/> 
                  <div><strong className="text-[#5da7b3]">Public Node:</strong> ทุกคนในระบบได้รับสิทธิ์ในการเข้าถึงและมองเห็นเบื้องต้น (Viewer) ยกเว้นโดนจำกัดสิทธิ์รายบุคคล</div>
                </li>
                <li className="flex items-start gap-2 bg-[#e3624a]/10 p-3 rounded-xl border border-[#e3624a]/30">
                  <Icons.Lock size={16} className="shrink-0 text-[#e3624a] mt-0.5"/> 
                  <div><strong className="text-[#e3624a]">Restricted Area:</strong> ปิดกั้นการมองเห็นโดยสมบูรณ์ เมนูจะถูกซ่อน ต้องกำหนดสิทธิ์รายบุคคลแบบเจาะจงเท่านั้น</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#2e3118] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#e7dedd] pb-2 font-mono">
              <Icons.Key size={18} className="text-[#ffa64a]"/> 2. Permission Levels
            </h4>
            <p className="text-[12px] mb-3">สิทธิ์การใช้งานแต่ละโมดูล แบ่งออกเป็น 4 ระดับ (สามารถรับสิทธิ์ทับซ้อนกันได้):</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#5da7b3]">Viewer (สิทธิ์การดู):</strong> สามารถเข้าถึงหน้านั้นๆ ได้ แต่อ่านข้อมูลได้อย่างเดียว</li>
                <li><strong className="text-[#ffa64a]">Editor (สิทธิ์แก้ไข):</strong> สามารถสร้าง หรือแก้ไขข้อมูลและฟอร์มต่างๆ ภายในโมดูลได้</li>
                <li><strong className="text-[#2e3118]">Verifier (สิทธิ์ตรวจสอบ):</strong> มีอำนาจตรวจสอบความถูกต้อง (Verify) ก่อนส่งให้อนุมัติ</li>
                <li><strong className="text-[#606934]">Approver (สิทธิ์อนุมัติ):</strong> อำนาจขั้นสูงสุดในการอนุมัติเอกสารและคำสั่ง (Approve)</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#2e3118] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#e7dedd] pb-2 font-mono">
              <Icons.RefreshCw size={18} className="text-[#5f7ab7]"/> 3. System Sync
            </h4>
            <p className="text-[12px]">การตั้งค่าที่ถูกอัปเดตในหน้านี้จะทำการ <b>ซิงค์กับแถบเมนู (Sidebar) หลัก</b> ของระบบ SalePro โดยอัตโนมัติ การจำกัดสิทธิ์ส่งผลแบบ Real-time</p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#e2d1c3] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#2e3118] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#091d38] hover:text-white transition-all shadow-md tracking-[0.1em]">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

function EditUserModal({ isOpen, onClose, user, onSave }: any) {
    const [modalStep, setModalStep] = useState(0);
    const [tempPerms, setTempPerms] = useState<any>({});
    const [tempUser, setTempUser] = useState<any>({});

    useEffect(() => {
        if (isOpen && user) {
            setModalStep(0);
            setTempPerms(JSON.parse(JSON.stringify(user.permissions || {})));
            setTempUser(JSON.parse(JSON.stringify(user)));
        }
    }, [isOpen, user]);

    if (!isOpen || !user || !tempUser) return null;

    const handleTogglePerm = (moduleId: string, level: number) => {
        if (tempUser.isDev) return;
        setTempPerms((prev: any) => {
            const newPerms = { ...prev };
            if (!newPerms[moduleId]) newPerms[moduleId] = [];
            if (level === 0) {
                newPerms[moduleId] = [];
                return newPerms;
            }
            if (newPerms[moduleId].includes(level)) {
                newPerms[moduleId] = newPerms[moduleId].filter((l: number) => l !== level);
            } else {
                newPerms[moduleId] = [...newPerms[moduleId], level].sort();
            }
            return newPerms;
        });
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[950px]"
            customHeader={
                <div className="bg-[#2e3118] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#af7a2b]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
                            <img src={tempUser.avatar} className="w-full h-full object-cover" alt={tempUser.name || 'User'} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#e7dedd] uppercase tracking-widest leading-none">{tempUser.name || 'NEW USER'}</h3>
                            <p className="text-[10px] font-bold text-[#e7dedd]/70 uppercase tracking-widest mt-1">{tempUser.position || 'POSITION'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-[#e3624a] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><Icons.X size={16} /></button>
                </div>
            }
        >
                {/* Modal Body */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#f8f9fa]">
                    {/* Sidebar Steps */}
                    <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-[#e2d1c3] flex flex-row md:flex-col shrink-0">
                        <div className="hidden md:block px-4 py-4 text-[10px] font-black text-[#8c7361] uppercase tracking-widest border-b border-[#e2d1c3] bg-[#f8f9fa]">Configuration Nodes</div>
                        {[0, 1, 2].map(step => (
                            <button key={step} onClick={()=>setModalStep(step)} className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-left transition-all md:border-l-4 ${modalStep===step ? 'border-b-4 md:border-b-0 border-[#af7a2b] bg-[#f8f9fa] text-[#2e3118]' : 'border-transparent text-[#8c7361] hover:bg-[#f8f9fa]/50'}`}>
                                <LucideIcon name={step===0 ? 'User' : 'ShieldCheck'} size={16} color={modalStep===step ? THEME.brightGold : undefined} />
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">STEP {step+1}: {step===0 ? 'Profile' : step===1 ? 'Visibility' : 'Rights'}</span>
                            </button>
                        ))}
                    </div>
                    
                    {/* Content Panel */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-white">
                        {modalStep === 0 ? (
                            <div className="space-y-4 max-w-xl">
                                <div>
                                    <label className="block text-[11px] font-black text-[#8c7361] uppercase tracking-widest mb-1.5">Full Name</label>
                                    <input type="text" value={tempUser.name || ''} onChange={e => setTempUser({...tempUser, name: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#e2d1c3] rounded-lg px-4 py-2 text-[12px] font-bold text-[#2e3118] outline-none focus:border-[#af7a2b]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-[#8c7361] uppercase tracking-widest mb-1.5">Position / Role</label>
                                    <input type="text" value={tempUser.position || ''} onChange={e => setTempUser({...tempUser, position: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#e2d1c3] rounded-lg px-4 py-2 text-[12px] font-bold text-[#2e3118] outline-none focus:border-[#af7a2b]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-[#8c7361] uppercase tracking-widest mb-1.5">Email Address</label>
                                    <input type="email" value={tempUser.email || ''} onChange={e => setTempUser({...tempUser, email: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#e2d1c3] rounded-lg px-4 py-2 text-[12px] font-bold text-[#2e3118] outline-none focus:border-[#af7a2b]" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-[#8c7361] uppercase tracking-widest mb-1.5">Profile Picture</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-white border border-[#e2d1c3] rounded-lg p-3">
                                        <div className="w-16 h-16 rounded-xl bg-[#f8f9fa] border border-[#e2d1c3] flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                                            {tempUser.avatar ? (
                                                <img src={tempUser.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                            ) : (
                                                <Icons.User size={24} className="text-[#8c7361]" />
                                            )}
                                        </div>
                                        <div className="flex-1 w-full space-y-2">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e: any) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => {
                                                                setTempUser({...tempUser, avatar: ev.target?.result as string});
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    };
                                                    input.click();
                                                }} className="bg-[#f8f9fa] border border-[#e2d1c3] text-[#2e3118] hover:text-[#e3624a] hover:border-[#e3624a] py-1.5 px-3 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm flex items-center gap-1.5 flex-1 justify-center transition-colors"><Icons.Upload size={12}/> Computer</button>

                                                <button type="button" onClick={() => {
                                                    const Swal = typeof window !== 'undefined' ? (window as any).Swal || null : null;
                                                    if (Swal) {
                                                        Swal.fire({
                                                            title: 'Google Drive / URL',
                                                            input: 'url',
                                                            inputPlaceholder: 'Paste Image URL here...',
                                                            inputAttributes: {
                                                                autocapitalize: 'off'
                                                            },
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Preview',
                                                            confirmButtonColor: '#2e3118',
                                                        }).then((result: any) => {
                                                            if (result.isConfirmed && result.value) {
                                                                setTempUser({...tempUser, avatar: result.value});
                                                            }
                                                        });
                                                    } else {
                                                        const url = prompt("Enter Google Drive Image URL or any URL");
                                                        if (url) setTempUser({...tempUser, avatar: url});
                                                    }
                                                }} className="bg-[#f8f9fa] border border-[#e2d1c3] text-[#2e3118] hover:text-[#e3624a] hover:border-[#e3624a] py-1.5 px-3 rounded-lg text-[10px] uppercase font-black tracking-widest shadow-sm flex items-center gap-1.5 flex-1 justify-center transition-colors"><Icons.Link size={12}/> URL / Drive</button>
                                            </div>
                                            <input type="text" value={tempUser.avatar || ''} onChange={e => setTempUser({...tempUser, avatar: e.target.value})} placeholder="Or paste image URL here..." className="w-full bg-[#f8f9fa] border border-[#e2d1c3] rounded border-dashed px-2 py-1.5 text-[10px] font-bold text-[#2e3118] outline-none focus:border-[#af7a2b] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <input type="checkbox" checked={tempUser.isDev || false} onChange={e => setTempUser({...tempUser, isDev: e.target.checked})} className="w-4 h-4 accent-[#2e3118] cursor-pointer" id="isDevCheck" />
                                    <label htmlFor="isDevCheck" className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest cursor-pointer">Super Admin (Developer) Privileges</label>
                                </div>
                            </div>
                        ) : (
                        <div className="space-y-3">
                            {SYSTEM_MODULES.map(mod => {
                                const userHasMod = tempPerms[mod.id] && tempPerms[mod.id].length > 0;
                                const isDev = tempUser.isDev;
                                return (
                                    <div key={mod.id} className={`px-4 py-3 rounded-xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${userHasMod || isDev ? 'bg-[#f8f9fa] border-[#af7a2b]/50 shadow-sm' : 'bg-white border-[#e2d1c3]'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${userHasMod || isDev ? 'bg-[#2e3118] text-white border-[#2e3118]' : 'bg-[#f8f9fa] text-[#8c7361] border-[#e2d1c3]'}`}>
                                                <LucideIcon name={mod.icon} size={16}/>
                                            </div>
                                            <span className="font-black text-[#2e3118] uppercase text-[11px] tracking-widest leading-tight">{mod.label}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 p-1.5 bg-white rounded-lg border border-[#e2d1c3] w-full md:w-auto">
                                            {PERMISSION_LEVELS.filter(p => modalStep===1 ? p.level <= 1 : p.level===0 || p.level>=2).map(p => {
                                                const isSelected = isDev || (p.level === 0 && !userHasMod) || (tempPerms[mod.id] && tempPerms[mod.id].includes(p.level));
                                                return (
                                                    <button key={p.level} onClick={()=>handleTogglePerm(mod.id, p.level)} disabled={isDev} className={`flex-1 md:flex-none h-8 px-2.5 rounded-md border flex items-center justify-center gap-1.5 transition-all ${isSelected ? 'bg-[#2e3118] text-white border-[#2e3118] shadow-sm' : 'bg-white border-transparent text-[#8c7361] hover:bg-[#f8f9fa]'}`}>
                                                        <LucideIcon name={p.icon} size={12} color={isSelected ? THEME.brightGold : THEME.dustyBlue} />
                                                        {isSelected && <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#e2d1c3] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-5 py-2 bg-white border border-[#e2d1c3] text-[#091d38] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#e7dedd]/30 transition-all">Cancel</button>
                    <button onClick={()=>{onSave(tempUser, tempPerms); onClose();}} className="bg-[#2e3118] text-white px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#091d38] hover:text-white transition-all flex items-center gap-2"><Icons.Save size={14}/> Save User</button>
                </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function UserPermission() {
  const [activeTab, setActiveTab] = useState('registry'); 
  const [viewMode, setViewMode] = useState('list'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [editModal, setEditModal] = useState<any>({ isOpen: false, user: null });
  const [expandedModules, setExpandedModules] = useState<any>({ sr_so: true, vendors: true, analytics: true, inventory: true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({'settings': true, 'risk_management': true});

  const [users, setUsers] = useState([
    { id: 1, name: 'SOMCHAI WORKER', position: 'SALES MANAGER', email: 'somchai.w@salepro.com', avatar: 'https://i.pravatar.cc/150?img=11', isDev: false, permissions: { dashboard: [1, 2, 3, 4], analytics: [1, 2] } },
    { id: 2, name: 'SUDA QUALITY', position: 'QC SUPERVISOR', email: 'suda.q@salepro.com', avatar: 'https://i.pravatar.cc/150?img=5', isDev: false, permissions: { dashboard: [1] } },
    { id: 3, name: 'PHICHAMON ADMIN', position: 'Lead Developer', email: 'tallintelligence.dcc@gmail.com', avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400', isDev: true, permissions: { '*': [1, 2, 3, 4] } },
    { id: 4, name: 'SARAH ACCOUNTING', position: 'FINANCE', email: 'sarah@salepro.com', avatar: 'https://i.pravatar.cc/150?img=9', isDev: false, permissions: { dashboard: [1] } }
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.position.toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  const currentData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedModules((prev: any) => ({ ...prev, [id]: !prev[id] }));

  const saveUserPermissions = (savedUser: any, newPermissions: any) => {
    setUsers(prevUsers => {
      const exists = prevUsers.find(u => u.id === savedUser.id);
      if (exists) {
        return prevUsers.map(u => u.id === savedUser.id ? { ...u, ...savedUser, permissions: newPermissions } : u);
      } else {
        return [{ ...savedUser, permissions: newPermissions }, ...prevUsers];
      }
    });
  };

  return (
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)}
          title="USER PERMISSIONS"
          desc="ระบบจัดการสิทธิ์และโครงสร้างผู้ใช้งานระบบทั้งหมด (Role-Based Access Control)"
          sections={[
              {
                  id: "1",
                  title: "การจัดการบัญชีผู้ใช้ (User Accounts)",
                  icon: "Users",
                  description: "บริหารข้อมูลเบื้องต้นของพนักงาน ลบ หรือแก้ไขรหัสผ่านได้จากตารางด้านหน้า",
                  bullets: [
                      { icon: "Plus", iconColor: "#606934", title: "Add User", text: "เพิ่มบัญชีรายบุคคล กำหนดแผนก และเลือก Role แจกแจงหน้าที่อย่างรัดกุม" },
                      { icon: "ShieldAlert", iconColor: "#e3624a", title: "Lock Account", text: "สามารถระงับการเข้าถึงชั่วคราวได้โดยการกด Toggle ที่คอลัมน์สถานะ" }
                  ]
              },
              {
                  id: "2",
                  title: "ตั้งค่ากลุ่มสิทธิ์ส่วนกลาง (Global Roles)",
                  icon: "ShieldCheck",
                  description: "ระบบสิทธิ์จะถูกแบ่งตาม Roles เพื่อง่ายต่อการ Maintenance กรณีพนักงานย้ายแผนก",
                  bullets: [
                      { icon: "Shield", iconColor: "#af7a2b", title: "Admin", text: "มองเห็นและแก้ไขได้ทุกโมดูล (สามารถเข้าถึงหน้าตั้งค่าระบบได้)" },
                      { icon: "User", title: "Staff", text: "สิทธิ์เบื้องต้น ทำงานเฉพาะโมดูลที่ได้รับมอบหมายเท่านั้น" },
                      { icon: "Eye", title: "View Only", text: "สิทธิ์การอ่านอย่างเดียว (Read Only) ไม่สามารถเขียน แก้ไข หรือลบข้อมูลใดๆ ได้" }
                  ]
              }
          ]} 
      />
      <EditUserModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, user: null})} user={editModal.user} onSave={saveUserPermissions} />

      {/* HEADER SECTION */}
      <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.ShieldCheck size={28} strokeWidth={2.5} className="text-[#f47729]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      USER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">PERMISSIONS</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      SECURITY CONTROL & ACCESS AUTHORIZATION HUB
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#2e3118] text-white shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                    <Icons.Database size={16} /> Global Registry
                  </button>
                  <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-[#2e3118] text-white shadow-md' : 'text-[#8c7361] hover:text-[#e3624a]'}`}>
                    <Icons.Users size={16} /> Staff Access
                  </button>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 mb-8 mt-4">
        <div className="w-full mt-4">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
                <KpiCard label="Active Personnel" value={users.length} icon="users" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Managed Users" />
                <KpiCard label="Functional Modules" value={SYSTEM_MODULES.length} icon="layout-grid" colorAccent={THEME.accent} colorValue={THEME.primary} desc="Tracked Zones" />
                <KpiCard label="Restricted Keys" value={Object.values(confidentialityMap).filter(v=>v).length} icon="lock" colorAccent={THEME.danger} colorValue={THEME.primary} desc="Security Lock" />
                <KpiCard label="Security Status" value="AUDITED" icon="shield-check" colorAccent={THEME.success} colorValue={THEME.success} desc="System Verified" />
            </div>

            {activeTab === 'registry' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* ACCESS POLICIES CARD */}
                    <div className="lg:col-span-4 bg-white/90 p-8 rounded-3xl shadow-lg border border-[#e2d1c3] animate-fadeIn h-fit">
                        <h3 className="text-[14px] font-black text-[#2e3118] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#af7a2b] pb-4 mb-6"><Icons.ShieldAlert size={20} className="text-[#af7a2b]" /> ACCESS POLICIES</h3>
                        <div className="space-y-5">
                            <div className="p-5 bg-[#f8f9fa] border border-[#e2d1c3] rounded-2xl shadow-sm hover:border-[#5da7b3] transition-colors">
                                <div className="flex items-center gap-2 text-[#5da7b3] font-black text-[12px] uppercase tracking-widest mb-2"><Icons.Eye size={18}/> Public Node</div>
                                <p className="text-[12px] text-[#091d38] font-bold leading-relaxed">โมดูลมาตรฐาน: พนักงานจะได้รับสิทธิ์อ่าน (Viewer) เบื้องต้นโดยอัตโนมัติ</p>
                            </div>
                            <div className="p-5 bg-[#e3624a]/10 border border-[#e3624a]/30 rounded-2xl shadow-sm hover:border-[#e3624a] transition-colors">
                                <div className="flex items-center gap-2 text-[#e3624a] font-black text-[12px] uppercase tracking-widest mb-2"><Icons.Lock size={18}/> Restricted Area</div>
                                <p className="text-[12px] text-[#091d38] font-bold leading-relaxed">พื้นที่จำกัด: เมนูจะถูกซ่อนจากผู้ใช้ทั่วไป ต้องได้รับสิทธิ์แบบเจาะจงรายบุคคลเท่านั้น</p>
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL MODULE REGISTRY (SYNCED) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#e2d1c3] overflow-hidden">
                        <div className="p-6 bg-[#f8f9fa] border-b border-[#e2d1c3]">
                            <h4 className="text-[14px] font-black uppercase text-[#2e3118] tracking-widest flex items-center gap-3"><Icons.ListTree size={20} className="text-[#af7a2b]"/> GLOBAL MODULE REGISTRY</h4>
                        </div>
                        <div className="p-6 space-y-3 custom-scrollbar">
                            {SYSTEM_MODULES.map(mod => (
                                <div key={mod.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[mod.id] ? 'bg-[#e3624a]/5 border-[#e3624a]/30 shadow-sm' : 'bg-white border-[#e2d1c3] hover:border-[#5da7b3]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[mod.id] ? 'bg-[#e3624a]/20 text-[#e3624a] border-[#e3624a]/30' : 'bg-[#f8f9fa] text-[#2e3118] border-[#e2d1c3]'}`}>
                                                <LucideIcon name={mod.icon} size={22}/>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[#2e3118] text-[13px] uppercase tracking-widest">{mod.label}</span>
                                                    {mod.subItems && (
                                                        <button onClick={() => toggleExpand(mod.id)} className="p-1 hover:bg-[#e7dedd]/50 rounded transition-all text-[#af7a2b]">
                                                            <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedModules[mod.id] ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    )}
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[mod.id] ? 'text-[#e3624a]' : 'text-[#8c7361]'}`}>Module {confidentialityMap[mod.id] ? 'Restricted' : 'Public'}</span>
                                            </div>
                                        </div>
                                        <button onClick={()=>toggleConfidentiality(mod.id)} className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-90 ${confidentialityMap[mod.id] ? 'bg-[#e3624a] text-white' : 'bg-white text-[#8c7361] border border-[#e2d1c3] hover:bg-[#f8f9fa]'}`}>
                                            {confidentialityMap[mod.id] ? <Icons.Lock size={18}/> : <Icons.Eye size={18}/>}
                                        </button>
                                    </div>

                                    {/* SUB-ITEMS CONFIDENTIALITY */}
                                    {mod.subItems && expandedModules[mod.id] && (
                                        <div className="ml-16 space-y-2 animate-fadeIn pr-4 pb-4">
                                            {mod.subItems.map((sub: any) => (
                                                <div key={sub.id} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border bg-white transition-all ${confidentialityMap[sub.id] ? 'border-[#e3624a]/40 bg-[#e3624a]/5 shadow-inner' : 'border-[#e7dedd] hover:border-[#5da7b3]'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${confidentialityMap[sub.id] ? 'bg-[#e3624a] animate-pulse' : 'bg-[#af7a2b]'}`}></div>
                                                        <span className="text-[12px] font-black text-[#2e3118] uppercase tracking-widest">{sub.label}</span>
                                                    </div>
                                                    <button onClick={()=>toggleConfidentiality(sub.id)} className={`p-2 rounded-lg transition-all ${confidentialityMap[sub.id] ? 'bg-[#e3624a]/10 text-[#e3624a]' : 'text-[#8c7361] hover:bg-[#f8f9fa]'}`}>
                                                        {confidentialityMap[sub.id] ? <Icons.Lock size={16}/> : <Icons.Eye size={16}/>}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-lg border border-[#e2d1c3] overflow-hidden flex flex-col animate-fadeIn">
                    <div className="px-8 py-4 border-b border-[#e2d1c3] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex bg-[#f8f9fa] border border-[#e2d1c3] p-1 rounded-full shadow-sm inline-flex">
                                <button onClick={()=>setViewMode('list')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode==='list'?'bg-[#2e3118] text-[#e7dedd] shadow-md':'text-[#8c7361] hover:text-[#e3624a]'}`}>
                                    <Icons.List size={14}/> List View
                                </button>
                                <button onClick={()=>setViewMode('matrix')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode==='matrix'?'bg-[#2e3118] text-[#e7dedd] shadow-md':'text-[#8c7361] hover:text-[#e3624a]'}`}>
                                    <Icons.LayoutGrid size={14}/> Summary Matrix
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                                <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search personnel..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#e2d1c3] rounded-full font-bold outline-none focus:border-[#af7a2b] bg-white shadow-sm text-[#2e3118]" />
                            </div>
                            <button onClick={()=>setEditModal({isOpen: true, user: { id: Date.now(), name: 'NEW USER', position: 'POSITION', email: '', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', isDev: false, permissions: {} }})} className="bg-[#2e3118] text-white px-6 py-2.5 rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#091d38] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#2e3118]">
                                <Icons.UserPlus size={16} /> New User
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto custom-scrollbar">
                        {viewMode === 'list' ? (
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#2e3118] text-white">
                                    <tr className="border-b-2 border-[#af7a2b]">
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Personnel Identity</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Responsibility Node</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">E-Mail Channel</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center">Authorization</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#e2d1c3]">
                                    {currentData.map(user => (
                                        <tr key={user.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                            <td className="py-3 px-6 font-black text-[#2e3118] uppercase tracking-tight text-[12px]">
                                                <div className="flex items-center gap-4">
                                                    <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-[#e2d1c3] shadow-sm" />
                                                    <span>{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 font-bold text-[#5da7b3] uppercase text-[12px]">{user.position}</td>
                                            <td className="py-3 px-6 font-mono text-[#8c7361] text-[12px]">{user.email}</td>
                                            <td className="py-3 px-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border tracking-widest ${user.isDev ? 'bg-[#af7a2b]/10 text-[#ffa64a] border-[#af7a2b]/30' : 'bg-[#2e3118]/5 text-[#2e3118] border-[#e2d1c3]'}`}>
                                                    {user.isDev ? 'Developer' : 'General'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex justify-center items-center gap-[0.5px]">
                                                    <button onClick={()=>setEditModal({isOpen: true, user: user})} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5da7b3] bg-[#5da7b3]/10 hover:bg-[#5da7b3]/20 transition-all active:scale-90">
                                                        <Icons.UserCog size={16} />
                                                    </button>
                                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#e3624a] bg-[#e3624a]/10 hover:bg-[#e3624a]/20 transition-all active:scale-90">
                                                        <Icons.Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left font-sans border-collapse min-w-[900px]">
                                <thead className="bg-[#091d38] text-white">
                                    <tr className="border-b-[3px] border-[#af7a2b]">
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-r border-[#ffffff20] w-72">Module / Sub-Module</th>
                                        {currentData.map(user => (
                                            <th key={user.id} className="py-3 px-4 text-center border-r border-[#ffffff20] last:border-0 min-w-[140px]">
                                                <div className="flex flex-col items-center justify-center gap-1.5">
                                                    <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border-2 border-white/20 shadow-sm" />
                                                    <span className="text-[10px] uppercase tracking-widest font-black text-[#e7dedd]">{user.name.split(' ')[0]}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#e2d1c3]">
                                    {SYSTEM_MODULES.map(mod => (
                                        <React.Fragment key={mod.id}>
                                            <tr className="hover:bg-[#f8f9fa] transition-colors group">
                                                <td className="py-3 px-6 border-r border-[#e2d1c3]">
                                                    <div className="flex items-center gap-3">
                                                        {mod.subItems ? (
                                                            <button onClick={() => toggleExpand(mod.id)} className="text-[#5da7b3] p-0.5 rounded outline-none">
                                                                <Icons.ChevronDown size={14} className={`transition-transform duration-300 ${expandedModules[mod.id] ? '' : '-rotate-90'}`} />
                                                            </button>
                                                        ) : <div className="w-4 h-4 shrink-0" />}
                                                        <LucideIcon name={mod.icon} size={16} className="text-[#a74353]" />
                                                        <span className="font-black text-[#2e3118] uppercase text-[12px] tracking-widest">{mod.label}</span>
                                                    </div>
                                                </td>
                                                {currentData.map(user => (
                                                    <td key={user.id} className="py-3 px-4 text-center border-r border-[#e2d1c3] last:border-0">
                                                        <PermissionBadges user={user} moduleId={mod.id} />
                                                    </td>
                                                ))}
                                            </tr>
                                            {mod.subItems && expandedModules[mod.id] && mod.subItems.map((sub: any) => (
                                                <tr key={sub.id} className="bg-[#f8f9fa]/50 hover:bg-[#f8f9fa] transition-colors border-b border-[#e2d1c3]/50 last:border-b-0">
                                                    <td className="py-3 px-6 pl-14 border-r border-[#e2d1c3]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1 h-1 rounded-full bg-[#8c7361]"></div>
                                                            <span className="font-bold text-[#091d38] uppercase text-[11px] tracking-wider">{sub.label}</span>
                                                        </div>
                                                    </td>
                                                    {currentData.map(user => (
                                                        <td key={user.id} className="py-3 px-4 text-center border-r border-[#e2d1c3] last:border-0">
                                                            <PermissionBadges user={user} moduleId={sub.id} />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="px-8 py-3 bg-[#f8f9fa] border-t border-[#e2d1c3] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="flex items-center gap-6 text-[11px] font-black text-[#8c7361] uppercase tracking-widest">
                            <div className="flex items-center gap-3">
                                <span>Display Rows:</span>
                                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#e2d1c3] rounded-lg px-3 py-1.5 outline-none font-black text-[#2e3118] cursor-pointer shadow-sm">
                                    {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <p className="bg-white px-4 py-2 rounded-xl border border-[#e2d1c3] shadow-sm">Total Records: {filteredUsers.length}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 border border-[#e2d1c3] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#2e3118] hover:text-white shadow-md active:scale-90'}`}>
                                <Icons.ChevronLeft size={18}/>
                            </button>
                            <div className="bg-[#2e3118] text-white px-8 py-2.5 rounded-xl shadow-md font-black text-[11px] min-w-[140px] text-center uppercase tracking-widest">
                                Page {currentPage} / {totalPages}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`w-10 h-10 border border-[#e2d1c3] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#2e3118] hover:text-white shadow-md active:scale-90'}`}>
                                <Icons.ChevronRight size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
