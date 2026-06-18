import React, { useState, useMemo } from 'react';
import { Search, Filter, Settings, Target, Tag, Users, Calendar } from 'lucide-react';
import ActionHeader from './components/ActionHeader';
import StatCards from './components/StatCards';
import PromotionTable from './components/PromotionTable';
import { MOCK_PROMOTIONS } from './data/mockData';
import UserGuideButton from '../../components/shared/UserGuideButton';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

export default function PromotionAllocation() {
  const [search, setSearch] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_PROMOTIONS.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 relative">
      
      {/* USER GUIDE FLOATING TAB */}
      <UserGuideButton onClick={() => setIsGuideOpen(true)} className="bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] hover:bg-[#212c46] hover:text-white" iconClassName="text-[#d1a45f]" />

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} title="PROMOTION GUIDE" desc="Sales & Marketing Budget Control">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-2 font-mono">
              <Target size={18} className="text-[#b58c4f]"/> 1. Budget Allocation Logic
            </h4>
            <p className="text-[12px] mb-3 text-[#414757]">การจัดสรรงบประมาณส่งเสริมการขาย สำหรับแคมเปญต่าง ๆ จะถูกแยกตามสัดส่วนกลยุทธ์ของบริษัท:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Tag size={16} className="shrink-0 text-[#212c46] mt-0.5"/> 
                  <div className="text-[#414757]"><strong className="text-[#212c46]">Trade Promo:</strong> มุ่งเน้นการกระตุ้นยอดขายกับคู่ค้า ยี่ปั๊ว ซาปั๊ว หรือกลุ่มร้านค้าแบบดั้งเดิม (Traditional Trade)</div>
                </li>
                <li className="flex items-start gap-2 bg-[#d1a45f]/10 p-3 rounded-xl border border-[#d1a45f]/30">
                  <Users size={16} className="shrink-0 text-[#d1a45f] mt-0.5"/> 
                  <div className="text-[#414757]"><strong className="text-[#d1a45f]">Consumer Promo:</strong> สำหรับจัดแคมเปญกระตุ้นการซื้อของผู้บริโภคโดยตรง ผ่านช่องทาง Modern Trade หรือ E-Commerce</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn mt-6" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-2 font-mono">
              <Calendar size={18} className="text-[#657f4d]"/> 2. Campaign Status Lifecycle
            </h4>
            <p className="text-[12px] mb-3 text-[#414757]">กระบวนการควบคุมสถานะของแคมเปญ (Campaign Statuses) จะต้องสอดคล้องกับงวดบัญชี:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px] text-[#414757]">
                <li><strong className="text-[#d1a45f]">Draft (ร่าง):</strong> ช่วงวางแผนแคมเปญและจัดเตรียมงบประมาณ ยังไม่มีผลผูกพันบัญชีกองกลาง</li>
                <li><strong className="text-[#657f4d]">Active (เปิดใช้งาน):</strong> แคมเปญอยู่ระหว่างการดำเนินการ งบประมาณถูกกันไว้ในระบบและเริ่มเบิกจ่ายจริง</li>
                <li><strong className="text-[#7a8b95]">Completed (เสร็จสิ้น):</strong> สิ้นสุดระยะเวลาแคมเปญ ระบบจะดึงงบส่วนเกินที่ไม่ได้ใช้กลับสู่กองกลางโดยอัตโนมัติ</li>
            </ul>
          </section>

          <section className="animate-fadeIn mt-6" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-2 font-mono">
              <Settings size={18} className="text-[#7a8b95]"/> 3. System Auditing
            </h4>
            <p className="text-[12px] text-[#414757]">ระบบจะบันทึก Log ทุกครั้งที่มีการแก้ไขแผนงบประมาณ และสามารถทำการ Export ตารางเป็นข้อมูลรายงานความคุ้มค่าของการลงทุน (ROI) ได้แบบ Real-time</p>
          </section>
      </UserGuidePanel>

      <ActionHeader />

      <div className="mx-auto px-4 sm:px-8 w-full mt-[2px] flex-1 flex flex-col min-h-0">
        <div className="w-full flex-1 flex flex-col min-h-0 pb-8">
            <StatCards promotions={MOCK_PROMOTIONS} />

            <div className="bg-white rounded-3xl border border-[#eaeaec] shadow-lg flex flex-col flex-1 min-h-[400px]">
                <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center gap-4 shrink-0 rounded-t-3xl">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative z-20">
                            <button className="h-10 px-4 bg-white border border-[#eaeaec] rounded-xl flex items-center gap-3 min-w-[180px] justify-between text-[11px] font-black uppercase tracking-widest text-[#212c46] shadow-sm hover:bg-[#eaeaec] cursor-pointer">
                                <div className="flex items-center gap-2"><Filter size={14} className="text-[#a3acbe]" /><span>ALL TYPES</span></div>
                                <Search size={14} className="text-[#7a8b95]" />
                            </button>
                        </div>
                        <div className="relative w-full max-w-[320px] h-10">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3acbe]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => setSearch(e.target.value)} 
                                placeholder="Search promotion name or ID..." 
                                className="w-full h-full pl-11 pr-5 text-[11px] border border-[#eaeaec] bg-white shadow-sm rounded-xl font-bold outline-none focus:border-[#d1a45f] text-[#212c46] placeholder-[#a3acbe]" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <PromotionTable data={filteredData} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
