import React, { useState } from 'react';
import { Truck, Package, Camera, CheckCircle2, XCircle, Clock, AlertTriangle, FileText, Search, Maximize, HelpCircle } from 'lucide-react';
import { Scanner } from '../../components/shared/Scanner';
import KpiCard from '../../components/shared/KpiCard';
import Swal from 'sweetalert2';

interface ManifestItem {
  id: string;
  trackingNo: string;
  customer: string;
  destination: string;
  status: 'Pending' | 'Verified' | 'Error';
  scannedAt?: string;
}

const INITIAL_MANIFEST: ManifestItem[] = [
  { id: '1', trackingNo: 'PKG-2603-001', customer: 'ABC Corp', destination: 'Tokyo, Japan', status: 'Pending' },
  { id: '2', trackingNo: 'PKG-2603-002', customer: 'Thai Steel Co.', destination: 'Singapore', status: 'Pending' },
  { id: '3', trackingNo: 'PKG-2603-003', customer: 'Global Foods (UK)', destination: 'London, UK', status: 'Pending' },
  { id: '4', trackingNo: 'PKG-2603-004', customer: 'Munchies Supply', destination: 'Sydney, Australia', status: 'Pending' },
];

export default function DispatchContainer() {
  const [manifest, setManifest] = useState<ManifestItem[]>(INITIAL_MANIFEST);
  const [showScanner, setShowScanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleScan = (data: string) => {
    setShowScanner(false);
    
    // Check if the scanned data matches any tracking number in the manifest
    const matchedIndex = manifest.findIndex(item => item.trackingNo === data);
    
    if (matchedIndex !== -1) {
      const item = manifest[matchedIndex];
      if (item.status === 'Verified') {
         Swal.fire({
          icon: 'warning',
          title: 'Already Verified',
          text: `Package ${data} was already verified.`,
          confirmButtonColor: '#f47729'
        });
        return;
      }

      setManifest(prev => {
        const newManifest = [...prev];
        newManifest[matchedIndex] = {
          ...newManifest[matchedIndex],
          status: 'Verified',
          scannedAt: new Date().toLocaleTimeString()
        };
        return newManifest;
      });

      Swal.fire({
        icon: 'success',
        title: 'Verified Successfully',
        text: `Package ${data} has been verified for dispatch.`,
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Package',
        text: `The scanned barcode ${data} is not in the current manifest.`,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const filteredManifest = manifest.filter(item => 
    item.trackingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: manifest.length,
    verified: manifest.filter(i => i.status === 'Verified').length,
    pending: manifest.filter(i => i.status === 'Pending').length,
  };

  const progressPercent = Math.round((stats.verified / stats.total) * 100) || 0;

  return (
    <div className="flex flex-1 w-full font-mono flex-col pb-0 animate-fadeIn bg-transparent">
      
      {/* USER GUIDE FLOATING TAB */}
      <button className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#e2d1c3] border-r-0 text-[#2e3118] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#8c7361] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      {/* Header */}
      <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
              <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
              <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                  <Truck size={28} strokeWidth={2.5} className="text-[#f47729]" />
              </div>
          </div>
          <div>
            <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
              DISPATCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">CONTAINER</span>
            </h3>
            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
               TRUCK & CONTAINER MANIFEST VERIFICATION
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowScanner(true)}
              className="px-5 py-2.5 bg-[#091d38] text-white hover:bg-[#214573] transition-colors rounded-lg font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-2"
            >
              <Camera size={16} className="text-[#f47729]" />
              Scan Package QR
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-8 mb-8 mt-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <div className="w-full mt-4 flex-1 flex flex-col min-h-0">
          {/* Analytics Top Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3 shrink-0">
            <KpiCard title="Total Packages" value={stats.total} icon={FileText} colorAccent="#5167a2" />
            <KpiCard title="Verified" value={stats.verified} icon={CheckCircle2} colorAccent="#10b981" />
            <KpiCard title="Pending" value={stats.pending} icon={Clock} colorAccent="#f47729" />
        </div>

        {/* Progress Bar */}
        <div className="mb-4 bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dispatch Progress</span>
                <span className="text-[10px] font-black text-[#091d38] uppercase tracking-widest">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
            </div>
        </div>

        {/* Manifest Table */}
        <div className="bg-white/90 rounded-[24px] border border-[#e2d1c3] shadow-lg overflow-hidden flex flex-col">
             <div className="p-5 border-b border-[#e2d1c3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f8f9fa]">
                 <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7361]" />
                    <input 
                        type="text" 
                        placeholder="Search Tracking No or Customer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-white border border-[#e2d1c3] rounded-xl text-[12px] font-bold text-[#2e3118] outline-none focus:border-[#af7a2b] shadow-sm uppercase tracking-wider placeholder:text-[#8c7361]/70"
                    />
                 </div>
                 <div className="px-4 py-2 bg-white border border-[#e2d1c3] rounded-xl text-[10px] font-black text-[#8c7361] tracking-widest uppercase">
                    Manifest Items: {filteredManifest.length}
                 </div>
             </div>

             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                     <thead>
                         <tr className="bg-white">
                             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#e2d1c3]">Tracking No</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#e2d1c3]">Customer</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#e2d1c3]">Destination</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#e2d1c3] text-center">Status</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-[#e2d1c3]">Timestamp</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-[#e2d1c3]">
                         {filteredManifest.map((item) => (
                             <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                         <Package size={16} className={item.status === 'Verified' ? "text-[#10b981]" : "text-slate-300"} />
                                         <span className="text-[12px] font-black text-[#2e3118] tracking-widest">{item.trackingNo}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                     {item.customer}
                                 </td>
                                 <td className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                     {item.destination}
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                     {item.status === 'Verified' ? (
                                         <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-black text-[9px] uppercase tracking-widest rounded-lg border border-emerald-200">
                                            <CheckCircle2 size={12} /> Verified
                                         </span>
                                     ) : (
                                         <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-orange-50 text-[#f47729] font-black text-[9px] uppercase tracking-widest rounded-lg border border-orange-200">
                                            <AlertTriangle size={12} /> Pending
                                         </span>
                                     )}
                                 </td>
                                 <td className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">
                                     {item.scannedAt || '-'}
                                 </td>
                             </tr>
                         ))}
                         {filteredManifest.length === 0 && (
                             <tr>
                                 <td colSpan={5} className="py-12 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                     No manifest items found
                                 </td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
        </div>
        </div>
      </main>

      {/* Scanner Modal */}
      {showScanner && (
          <Scanner 
            title="Scan Package Barcode"
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
      )}

    </div>
  );
}
