import React from 'react';
import { Package, MapPin, Calendar, Building2, FileText, Factory, Fingerprint, Scissors, CheckCircle2 } from 'lucide-react';

interface PrintProps {
  po: any;
  isPreview?: boolean;
}

export function FactoryPOPrintTemplate({ po, isPreview = false }: PrintProps) {
  if (!po) return null;

    const displayItems = po.items && po.items.length > 0 ? po.items : [po];

  return (
    <div className={`print-template ${isPreview ? 'block relative mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-2xl print:hidden rounded-lg overflow-hidden' : 'hidden print:block print:absolute print:inset-0 z-[100000] p-0 print:m-0 w-[210mm] h-[297mm]'} bg-white text-black font-sans box-border relative`}>
      
      {/* Decorative Top Accent */}
      <div className="h-4 w-full bg-gradient-to-r from-[#091d38] via-[#214573] to-[#ad7332]"></div>

      {/* Main Content Container with absolute padding based on A4 */}
      <div className="px-12 py-10 relative z-10 w-full h-full flex flex-col">
          
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
            <Factory size={400} />
        </div>

        {/* Header section */}
        <div className="flex justify-between items-start mb-8 relative z-10 border-b border-[#e2d1c3] pb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#091d38] flex items-center justify-center shadow-md border border-white/20">
              <Factory size={32} className="text-[#f47729] mb-1" />
            </div>
            <div>
              <h1 className="text-[28px] font-black uppercase text-[#091d38] tracking-tighter leading-none mb-1">
                FACTORY ORDER
              </h1>
              <p className="text-[12px] font-bold text-[#8c7361] tracking-[0.2em] uppercase">
                Production Authorization
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-[#f8f9fa] border border-[#e2d1c3] rounded-xl px-4 py-2 text-center mb-2 shadow-sm">
                <p className="text-[10px] font-black uppercase text-[#8c7361] tracking-widest mb-0.5">PO NUMBER</p>
                <p className="text-[20px] font-black text-[#ad7332] font-mono leading-none">{po.id || 'N/A'}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <p className="text-[12px] font-bold text-[#4d5a44] font-mono"><span className="text-[#8c7361] font-sans mr-2">DATE:</span> {po.issueDate}</p>
                <p className="text-[10px] font-black text-white uppercase tracking-widest bg-[#214573] px-2.5 py-0.5 rounded border border-[#091d38] inline-block shadow-sm">STS: {po.status}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
          {/* Factory / Issuer */}
          <div className="bg-[#f8f9fa] border border-[#e2d1c3] rounded-2xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Building2 size={60} />
             </div>
            <h3 className="text-[11px] font-black text-[#af7a2b] uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10"><Building2 size={14}/> ISSUED FROM (OEM HUB)</h3>
            <p className="font-black text-[14px] text-[#091d38] relative z-10 uppercase tracking-wide">PERFECT PET PRODUCTS O.E.M. CO., LTD.</p>
            <p className="text-[12px] text-[#4d5a44] mt-1.5 leading-relaxed font-medium relative z-10">
              123 Factory Road, Industrial Zone<br/>
              Bangkok 10540, Thailand<br/>
            </p>
          </div>

          {/* Reference */}
          <div className="bg-[#f8f9fa] border border-[#e2d1c3] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                 <FileText size={60} />
             </div>
            <h3 className="text-[11px] font-black text-[#af7a2b] uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10"><FileText size={14}/> REFERENCE DATA</h3>
            <div className="space-y-3 relative z-10">
                <div className="bg-white border border-[#e2d1c3] px-3 py-2 rounded-lg flex justify-between items-center shadow-sm">
                    <span className="text-[11px] font-bold text-[#8c7361] uppercase tracking-wider">REF PI</span>
                    <span className="font-black text-[#214573] text-[13px] font-mono">{po.refPI}</span>
                </div>
                <div className="bg-white border border-[#e2d1c3] px-3 py-2 rounded-lg flex justify-between items-center shadow-sm">
                    <span className="text-[11px] font-bold text-[#8c7361] uppercase tracking-wider">APPROVER</span>
                    <span className="font-black text-[#2e3118] text-[13px]">{po.approver}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Production Details Highlight */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-1.5 bg-[#f47729] rounded-full"></div>
              <h3 className="text-[14px] font-black text-[#091d38] uppercase tracking-widest">PRODUCTION SPECIFICATIONS</h3>
          </div>
          
          <div className="bg-white border-2 border-[#e2d1c3] rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-[#f8f9fa] border-b-2 border-[#e2d1c3]">
                              <th className="px-4 py-3 text-[10px] font-black text-[#8c7361] uppercase tracking-widest">Target Product</th>
                              <th className="px-4 py-3 text-[10px] font-black text-[#8c7361] uppercase tracking-widest text-center">Qty</th>
                              <th className="px-4 py-3 text-[10px] font-black text-[#8c7361] uppercase tracking-widest">Brand Label</th>
                              <th className="px-4 py-3 text-[10px] font-black text-[#8c7361] uppercase tracking-widest">Barcode</th>
                              <th className="px-4 py-3 text-[10px] font-black text-[#8c7361] uppercase tracking-widest">Packing</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2d1c3]">
                          {displayItems.map((item: any, i: number) => (
                              <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-4 py-3">
                                      <p className="font-black text-[#2e3118] text-[13px]">{item.product}</p>
                                      <p className="text-[10px] font-bold text-[#8c7361] mt-0.5">W: {item.containWeight} / {item.packedWeight}</p>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                      <p className="font-black text-[#f47729] text-[15px] font-mono">{item.quantity?.toLocaleString()}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                      <p className="font-black text-[#214573] text-[11px] uppercase">{item.brand}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                      <p className="font-black text-[#4d5a44] font-mono text-[11px]">{item.barcode}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                      <p className="font-bold text-[#2e3118] text-[11px]">{item.packingCarton}</p>
                                      <p className="text-[10px] font-bold text-[#8c7361] mt-0.5 uppercase">Exp: {item.expiryDate}</p>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="p-4 border-t-2 border-[#e2d1c3] bg-[#f8f9fa] flex justify-between items-center">
                    <p className="text-[11px] font-black text-[#091d38] uppercase tracking-widest">Total Qty.</p>
                    <p className="font-black text-[#f47729] text-[18px] font-mono leading-none">{po.quantity?.toLocaleString()}</p>
                  </div>
              </div>
        </div>

        {po.note && (
           <div className="mb-8 p-5 rounded-2xl border border-orange-200 bg-orange-50/80 relative z-10 flex gap-4 items-start shadow-sm">
              <div className="bg-white p-2 rounded-xl text-orange-500 shadow-sm shrink-0 border border-orange-100">
                  <Scissors size={20} />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-1 shadow-orange-500/20">SPECIAL INSTRUCTIONS</h3>
                <p className="text-[13px] font-bold text-orange-900 leading-relaxed">{po.note}</p>
              </div>
           </div>
        )}

         {/* Footer / Signatures - Pushed to bottom */}
         <div className="mt-auto grid grid-cols-3 gap-6 relative z-10 h-32 pt-8">
            <div className="text-center flex flex-col items-center">
              <div className="h-12 border-b-2 border-[#1f2a44] w-4/5 mb-3 border-dashed relative">
                  <Fingerprint size={32} className="absolute inset-0 m-auto text-[#e2d1c3] opacity-30" />
              </div>
              <p className="text-[10px] font-black text-[#091d38] uppercase tracking-[0.1em]">Prepared By</p>
              <p className="text-[9px] text-[#8c7361] mt-0.5 font-bold uppercase">Production Planning</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="h-12 border-b-2 border-[#1f2a44] w-4/5 mb-3 border-dashed relative">
                  <CheckCircle2 size={24} className="absolute -top-1 -right-2 text-[#10b981] opacity-20" />
              </div>
              <p className="text-[10px] font-black text-[#091d38] uppercase tracking-[0.1em]">Verified By</p>
              <p className="text-[9px] text-[#8c7361] mt-0.5 font-bold uppercase">Quality Assurance</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="h-12 border-b-2 border-[#1f2a44] w-4/5 mb-3 border-dashed relative flex items-end justify-center pb-1">
                  {po.status === 'Approved' || po.status === 'Completed' ? (
                      <span className="font-mono text-[#f47729] font-black text-lg -rotate-12 absolute bottom-2 opacity-80 border-2 border-[#f47729] px-2 rounded">APPROVED</span>
                  ) : null}
              </div>
              <p className="text-[10px] font-black text-[#091d38] uppercase tracking-[0.1em]">Authorized By</p>
              <p className="text-[10px] text-[#ad7332] mt-0.5 font-black uppercase">{po.approver}</p>
            </div>
         </div>
      </div>
      
      {/* Decorative Bottom Accent */}
      <div className="absolute bottom-0 w-full h-2 bg-[#f8f9fa] border-t border-[#e2d1c3] flex items-center justify-between px-8 text-[8px] font-mono text-[#adb2b0]">
          <span>PPP-OEM: PO.FORM:v2</span>
          <span>SYSTEM GENERATED</span>
      </div>

    </div>
  );
}

