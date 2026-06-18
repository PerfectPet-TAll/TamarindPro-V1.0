import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { format } from 'date-fns';
import UserGuideButton from '../../components/shared/UserGuideButton';
import { Database, RefreshCw, Settings2, ShieldAlert, Play, Clock, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { SyncStatusBadge, SyncState } from '../../components/shared/SyncStatusBadge';

export default function BackgroundAutoSync({ hideGuide = false }: { hideGuide?: boolean }) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [syncConfig, setSyncConfig] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('cfg_sync_toggles');
    return saved ? JSON.parse(saved) : {
      'Employees': true,
      'CalendarEvents': true,
      'Leaves': true,
      'SystemConfig': true,
      'ProductionRecords': false,
      'QualityMetrics': false
    };
  });

  const [sheetStatuses, setSheetStatuses] = useState<Record<string, SyncState>>({});
  const [activityLogs, setActivityLogs] = useState<{ id: string; sheet: string; status: 'success' | 'failure'; timestamp: Date }[]>([
      { id: 'mock-1', sheet: 'Employees', status: 'success', timestamp: new Date(Date.now() - 1000 * 60 * 5) }
  ]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());
  const [pendingItemsCount, setPendingItemsCount] = useState(3);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [syncInterval, setSyncInterval] = useState('hourly');
  const [dataConflicts, setDataConflicts] = useState<{ id: string; sheet: string; recordId: string; localValue: string; remoteValue: string; field: string; timestamp: Date }[]>([
    { id: 'c1', sheet: 'Employees', recordId: 'EMP-001', localValue: 'Manager', remoteValue: 'Senior Manager', field: 'Position', timestamp: new Date() }
  ]);

  const handleResolveConflict = (id: string, resolution: 'local' | 'remote') => {
    setDataConflicts(prev => prev.filter(c => c.id !== id));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Conflict resolved using ${resolution} value`,
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleRefreshAll = () => {
    setIsRefreshingAll(true);
    let delays = 0;
    
    Object.keys(syncConfig).forEach((sheetName, index) => {
      setTimeout(() => {
        handleTestConnection(sheetName);
      }, delays);
      delays += 800; // stagger the checks
    });

    setTimeout(() => {
       setIsRefreshingAll(false);
    }, delays + 1500);
  };

  const handleToggleSync = (sheetName: string, value: boolean) => {
    const newConfig = { ...syncConfig, [sheetName]: value };
    setSyncConfig(newConfig);
    localStorage.setItem('cfg_sync_toggles', JSON.stringify(newConfig));
    
    if (!value) {
        setSheetStatuses(prev => ({ ...prev, [sheetName]: 'disconnected' }));
    }

    // Optional notification
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: value ? 'success' : 'info',
      title: `${value ? 'Enabled' : 'Disabled'} auto-sync for ${sheetName}`,
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleTestConnection = (sheetName: string) => {
    setSheetStatuses(prev => ({ ...prev, [sheetName]: 'testing' }));
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
      setSheetStatuses(prev => ({ ...prev, [sheetName]: isSuccess ? 'connected' : 'error' }));
      
      setActivityLogs(prev => [{
        id: Math.random().toString(36).substring(2, 9),
        sheet: sheetName,
        status: (isSuccess ? 'success' : 'failure') as 'success' | 'failure',
        timestamp: new Date()
      }, ...prev].slice(0, 10)); // keep last 10
      
      if (isSuccess) {
         setLastSyncTime(new Date());
         setPendingItemsCount(prev => Math.max(0, prev - 1));
      }
    }, 1500);
  };


  return (
    <div className="pt-4 pb-8 flex flex-col space-y-4 animate-fadeIn px-4 sm:px-8 w-full">
      {/* USER GUIDE FLOATING TAB */}
      {!hideGuide && <UserGuideButton onClick={() => setIsGuideOpen(true)} />}

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} title="AUTO-SYNC GUIDE" desc="คู่มือควบคุมความเร็วและกำหนดการเชื่อมข้อมูล">
        <div className="space-y-6">
            <div>
                <h3 className="text-[12px] font-black uppercase tracking-widest text-[#212c46] flex items-center gap-2 mb-3">
                    <RefreshCw size={14} className="text-emerald-600" /> 1. BACKGROUND AUTO-SYNC SYSTEM
                </h3>
                <div className="p-4 bg-white border border-[#eaeaec] rounded-xl text-[12px] text-[#414757] leading-relaxed">
                    <p className="mb-4">ระบบ Background Auto-Sync ทำงานเบื้องหลังด้วยการส่ง/ตรวจสอบข้อมูลระหว่างเว็บ Smart HR และคลังสเปรดชีต Google Sheets ที่ลงทะเบียนไว้ผ่าน Google Apps Script API</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">Active Synchronization:</span> ทุกการทำรายการของพนักงานในระบบ (เช่น ขออนุมัติลา, บันทึกประวัติ หรือลงเวลา) ข้อมูลจะส่งต่อไปบันทึกใน Google Sheets โดยอัตโนมัติหากเปิดสวิตซ์ toggle ไว้</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">Manual Queue Testing:</span> คุณสามารถกดทดสอบการสื่อสารแบบรายตารางได้ฟรีด้วยปุ่ม <span className="font-bold text-[#3f809e]">Test Connection</span> ดึงชุดข้อมูลทดลองและบันทึกในเวลานั้น</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div>
                <h3 className="text-[12px] font-black uppercase tracking-widest text-[#212c46] flex items-center gap-2 mb-3">
                    <ShieldAlert size={14} className="text-rose-600" /> 2. TOGGLE INDICATORS & STATUS
                </h3>
                <div className="p-4 bg-white border border-[#eaeaec] rounded-xl text-[12px] text-[#414757] space-y-4">
                    <div className="flex items-start gap-4">
                        <span className="inline-flex items-center justify-center px-2 py-1.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-widest min-w-[80px]">Connected</span>
                        <p className="mt-0.5">ตารางนั้นเชื่อมต่อด้วยระบบออโต้ บันทึกข้อมูลและตอบสนองได้อย่างดีเยี่ยม</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="inline-flex items-center justify-center px-2 py-1.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700 uppercase tracking-widest min-w-[80px]">Testing</span>
                        <p className="mt-0.5">ระบบกำลังทดลองคุยกับ Google Apps Script Web App พอร์ต 3000 หรือ URL ที่เกี่ยวข้อง</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="inline-flex items-center justify-center px-2 py-1.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 uppercase tracking-widest min-w-[80px]">Error</span>
                        <p className="mt-0.5">ไม่สามารถติดต่อ Google sheets ได้เนื่องจากคีย์ไม่ถูกต้อง ข้ามสิทธิ์ หรือขาดการเปิดใช้เว็บแอปพลิเคชัน</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-[12px] font-black uppercase tracking-widest text-[#212c46] flex items-center gap-2 mb-3">
                    <Database size={14} className="text-[#b58c4f]" /> 3. SYSTEM IMPACT & RECOMMENDATIONS
                </h3>
                <div className="p-4 bg-white border border-[#eaeaec] rounded-xl text-[12px] text-[#414757] leading-relaxed">
                    <p className="mb-4">คำแนะนำสำหรับการดูแลทรัพยากร API ของแอปพลิเคชัน:</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">Employees / SystemConfig</span> แนะนำให้สวิตช์ Toggle ON ไว้เสมอเพื่อหลีกเลี่ยงความล่าช้าในการดึงข้อมูลหลักและค่ากำหนดทางธุรกรรม</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">ProductionRecords / QualityMetrics</span> หากระบบไม่ได้ใช้กลุ่มงานผลิตหรือคิวโปรดักชั่นเป็นประจำ สามารถเลือกปิดซิงค์เพื่อลดภาระงานเขียนแผ่นสเปรดชีตและประหยัด API Limit ของทางฝั่ง Google Cloud ได้</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="h-px bg-[#eaeaec] w-full" />

            <div>
                <h3 className="text-[12px] font-black uppercase tracking-widest text-[#212c46] flex items-center gap-2 mb-3">
                    <Clock size={14} className="text-purple-600" /> 4. SYNC INTERVAL SETTINGS
                </h3>
                <div className="text-[12px] text-[#414757] leading-relaxed">
                    <p className="mb-4">กำหนดความถี่ที่ระบบจะทำงานตรวจสอบและเชื่อมข้อมูลโดยอัตโนมัติ:</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">30 Mins:</span> เหมาะสำหรับเวลาทำการปกติที่มีการเคลื่อนไหวของธุรกรรมสูง</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">Hourly:</span> ระดับพื้นฐาน แนะนำสำหรับระบบที่มีผู้ใช้น้อยลง</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">Daily:</span> สำหรับข้อมูลประเภทเก็บถาวรหรือระบบสำรองเท่านั้น</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="h-px bg-[#eaeaec] w-full" />

            <div>
                <h3 className="text-[12px] font-black uppercase tracking-widest text-[#212c46] flex items-center gap-2 mb-3">
                    <ShieldAlert size={14} className="text-amber-500" /> 5. CONFLICT RESOLUTION
                </h3>
                <div className="text-[12px] text-[#414757] leading-relaxed">
                    <p className="mb-4">เมื่อพบว่ามีการแก้ไขข้อมูลที่จุดเดียวกัน ทั้งบนเว็บแอปพลิเคชันและใน Google Sheets ระบบจะแสดงรายการข้อขัดแย้ง (Data Conflicts) เพื่อให้คุณตัดสินใจเลือก:</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">Keep Local:</span> บังคับใช้ข้อมูลบนเว็บนี้ และไปเขียนทับแผ่นงานบน Sheets</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#212c46] mt-1.5 rounded-full w-1 h-1 bg-[#212c46] shrink-0"></span>
                            <span><span className="font-bold text-[#212c46]">Overwrite:</span> ดึงข้อมูลดั้งเดิมจาก Sheets มาเขียนทับประวัติที่ขัดแย้งบนเว็บ</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </UserGuidePanel>

      {/* Title Header */}
      <div className="flex flex-row justify-between items-center py-2 h-14 shrink-0">
        <div className="text-left w-full pl-0">
          <h1 className="text-2xl font-black text-[#212c46] tracking-tight uppercase flex items-center gap-3">
            <RefreshCw size={28} className="text-emerald-600 shrink-0" />
            <span>Background Auto-Sync / การซิงค์อัตโนมัติ</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-[#7a8b95] font-bold uppercase mt-1">
            MANAGE BACKGROUND AUTOMATION AND DATA SYNCHRONIZATION SCHEDULES.
          </p>
        </div>
        <button 
           onClick={handleRefreshAll}
           disabled={isRefreshingAll}
           className="hidden sm:flex items-center gap-2 bg-[#212c46] hover:bg-[#3f809e] text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <RefreshCw size={14} className={isRefreshingAll ? "animate-spin" : ""} />
           {isRefreshingAll ? "Syncing..." : "Refresh All"}
        </button>
      </div>

      <div className="flex-1 w-full flex flex-col pt-0 gap-4 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden group hover:border-emerald-500 transition-all md:col-span-1">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none transform group-hover:scale-105 transition-transform duration-700 text-emerald-600">
              <RefreshCw size={110} />
            </div>
            <div className="relative z-10 flex justify-between items-start">
              <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-wider">Configured Modules</p>
              <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 bg-emerald-50 border-emerald-200 text-emerald-600`}>
                <Database size={18} />
              </div>
            </div>
            <div className="relative z-10 mt-3">
              <p className="text-2xl font-black text-[#212c46] leading-none">
                {Object.keys(syncConfig).length}
              </p>
              <p className="text-[10px] font-bold text-[#7a8b95] uppercase mt-1 tracking-wider">
                Total Sheets Configured
              </p>
            </div>
          </div>

          <div className="bg-white px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden group hover:border-[#b58c4f] transition-all md:col-span-1">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none transform group-hover:scale-105 transition-transform duration-700 text-[#b58c4f]">
                <Clock size={110} />
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-wider">Last Sync Time</p>
                <div className="p-2.5 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 text-amber-600">
                  <Clock size={18} />
                </div>
              </div>
              <div className="relative z-10 mt-3 text-left">
                <p className="text-xl font-black text-[#212c46] leading-none">
                  {lastSyncTime ? format(lastSyncTime, 'HH:mm:ss') : '--:--:--'}
                </p>
                <p className="text-[10px] font-bold text-[#7a8b95] uppercase mt-1 tracking-wider max-w-sm">
                  System Time UTC+7
                </p>
              </div>
          </div>

          <div className="bg-white px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden group hover:border-[#3f809e] transition-all md:col-span-1">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none transform group-hover:scale-105 transition-transform duration-700 text-[#3f809e]">
                <Activity size={110} />
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-wider">Pending Items</p>
                <div className="p-2.5 rounded-xl border flex items-center justify-center shrink-0 bg-blue-50 border-blue-200 text-[#3f809e]">
                  <Activity size={18} />
                </div>
              </div>
              <div className="relative z-10 mt-3 text-left">
                <p className="text-xl font-black text-[#212c46] leading-none">
                  {pendingItemsCount} queues
                </p>
                <p className="text-[10px] font-bold text-[#7a8b95] uppercase mt-1 tracking-wider max-w-sm">
                  Awaiting Next Cycle
                </p>
              </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          {/* BACKGROUND AUTOMATION CONTROL */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eaeaec] shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0 shadow-sm">
                <RefreshCw size={20} />
              </div>
              <div className="text-left w-full">
                <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2">
                  <span>Background Auto-Sync</span>
                </h3>
                <p className="text-[12px] font-bold text-[#7a8b95] mt-1 leading-relaxed">
                  การตั้งค่าแผนงานเชื่อมโยงไปยัง Google Sheets
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50/50 p-4 rounded-xl border border-[#eaeaec]/60">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(syncConfig).map(([sheetName, isEnabled]) => {
                  const status = sheetStatuses[sheetName];
                  return (
                    <div key={sheetName} className="flex flex-col gap-3 p-4 bg-white border border-[#eaeaec] rounded-xl shadow-sm transition-all hover:border-[#b58c4f]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database size={16} className={isEnabled ? "text-emerald-500" : "text-slate-300"} />
                          <span className={`text-[12px] font-black uppercase tracking-wider ${isEnabled ? "text-[#212c46]" : "text-slate-400"}`}>
                            {sheetName}
                          </span>
                          
                          {/* Status Badges */}
                          <SyncStatusBadge status={status || 'idling'} className="hidden sm:inline-flex" />
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isEnabled}
                            onChange={(e) => handleToggleSync(sheetName, e.target.checked)}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <button 
                          onClick={() => handleTestConnection(sheetName)} 
                          disabled={status === 'testing'}
                          className="text-[10px] font-bold uppercase tracking-widest text-[#3f809e] hover:text-white border-[#3f809e] border hover:bg-[#3f809e] transition-all flex items-center gap-1.5 px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {status === 'testing' ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                          Test Connection
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CUSTOM SYNC INTERVAL CONTROL */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eaeaec] shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 shrink-0 shadow-sm">
                <Clock size={20} />
              </div>
              <div className="text-left w-full">
                <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center justify-between">
                  <span>Custom Sync Interval</span>
                </h3>
                <p className="text-[12px] font-bold text-[#7a8b95] mt-1 leading-relaxed">
                  กำหนดความถี่ในการซิงโครไนซ์ข้อมูลอัตโนมัติ
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['every_15_mins', 'every_30_mins', 'hourly', 'daily'].map((interval) => (
                    <label key={interval} className={`cursor-pointer px-4 py-2.5 flex items-center gap-2.5 rounded-xl border transition-all select-none ${syncInterval === interval ? 'border-[#b58c4f] bg-amber-50/50' : 'border-[#eaeaec] bg-white hover:border-slate-300'}`}>
                      <input type="radio" className="w-4 h-4 text-[#b58c4f] outline-none" checked={syncInterval === interval} onChange={() => setSyncInterval(interval)} />
                      <span className={`text-[12px] font-bold uppercase tracking-wider mt-0.5 ${syncInterval === interval ? 'text-[#b58c4f]' : 'text-[#7a8b95]'}`}>
                        {interval.replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Activity Log & Data Conflicts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[300px]">
          {/* Sync Activity Log Table */}
          <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-[#eaeaec] shrink-0">
              <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2">
                <Activity size={18} className="text-[#3f809e]" />
                <span>Sync Activity Log</span>
              </h3>
              <p className="text-[12px] font-bold text-[#7a8b95] uppercase mt-1">ประวัติการซิงโครไนซ์ข้อมูลล่าสุด</p>
            </div>
            <div className="overflow-x-auto flex-1 h-0 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50 border-b border-[#eaeaec]">
                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Timestamp</th>
                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Sheet / Module</th>
                    <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaec] bg-white">
                  {activityLogs.length > 0 ? (
                    activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-5 whitespace-nowrap text-[12px] font-bold text-[#414757]">
                          {format(log.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                        </td>
                        <td className="py-3 px-5 whitespace-nowrap text-[12px] font-bold text-[#212c46]">
                          {log.sheet}
                        </td>
                        <td className="py-3 px-5 whitespace-nowrap">
                          {log.status === 'success' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-widest">
                              <CheckCircle2 size={12} /> Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 uppercase tracking-widest">
                              <XCircle size={12} /> Failed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-[12px] font-bold text-[#7a8b95] uppercase tracking-widest">
                        No activity logs recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Conflicts Table */}
          <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-[#eaeaec] shrink-0">
               <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2">
                 <ShieldAlert size={18} className="text-rose-600" />
                 <span>Data Conflicts</span>
               </h3>
               <p className="text-[12px] font-bold text-[#7a8b95] uppercase mt-1">รายการพบข้อขัดแย้งของข้อมูล</p>
            </div>
            <div className="overflow-x-auto flex-1 h-0 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50 border-b border-[#eaeaec]">
                      <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Record</th>
                      <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95]">Conflict Details</th>
                      <th className="py-3 px-5 text-[10px] font-black uppercase tracking-widest text-[#7a8b95] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaec] bg-white">
                    {dataConflicts.length > 0 ? (
                      dataConflicts.map((conflict) => (
                        <tr key={conflict.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-5 whitespace-nowrap text-[12px]">
                            <div className="font-bold text-[#212c46]">{conflict.recordId}</div>
                            <div className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-widest mt-0.5">{conflict.sheet}</div>
                          </td>
                          <td className="py-3 px-5 whitespace-nowrap text-[12px]">
                             <div className="font-bold text-[#b58c4f] mb-1">Field: {conflict.field}</div>
                             <div className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] inline-flex items-center mb-1 w-full"><span className="text-emerald-600 font-bold mr-1 w-12 shrink-0">LOCAL:</span> <span className="truncate">{conflict.localValue}</span></div>
                             <div className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px] inline-flex items-center w-full"><span className="text-rose-600 font-bold mr-1 w-12 shrink-0">REMOTE:</span> <span className="truncate">{conflict.remoteValue}</span></div>
                          </td>
                          <td className="py-3 px-5 whitespace-nowrap text-right space-x-2">
                            <button className="text-[10px] font-bold uppercase tracking-widest text-[#212c46] border border-[#eaeaec] hover:bg-slate-100 px-3 py-1.5 rounded transition-all shadow-sm" onClick={() => handleResolveConflict(conflict.id, 'local')}>Keep Local</button>
                            <button className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:text-white bg-white border border-rose-200 hover:bg-rose-600 hover:border-rose-600 px-3 py-1.5 rounded transition-all shadow-sm" onClick={() => handleResolveConflict(conflict.id, 'remote')}>Overwrite</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-[12px] font-bold text-[#7a8b95] uppercase tracking-widest bg-emerald-50/30">
                          <div className="flex flex-col items-center gap-2">
                             <CheckCircle2 size={24} className="text-emerald-500" />
                             No conflicts detected.
                          </div>
                        </td>
                      </tr>
                    )}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
