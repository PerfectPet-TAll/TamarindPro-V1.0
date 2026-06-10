import React, { useState } from 'react';
import { FileText, Printer, Search, Eye } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

const REGULATIONS_DATA = [
    { id: 1, title: 'ระเบียบข้อบังคับเกี่ยวกับการทำงานหมวดทั่วไป', rev: '01', docId: 'CAI-HR-001', date: '01/01/2026' },
    { id: 2, title: 'นโยบายความปลอดภัยอาชีวอนามัยและสภาพแวดล้อม', rev: '02', docId: 'CAI-HR-002', date: '15/02/2026' },
    { id: 3, title: 'คู่มือการปฏิบัติตนและจรรยาบรรณพนักงาน', rev: '01', docId: 'CAI-HR-003', date: '10/03/2026' },
];

export default function CompanyRegulations() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    const handlePreview = (doc: any) => {
        setSelectedDoc(doc);
        setShowPreview(true);
    };

    return (
        <div className="w-full h-full flex flex-col space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4 mb-4">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <FileText size={28} strokeWidth={2.5} className="text-[#f47729]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            COMPANY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">REGULATIONS</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            ข้อบังคับและระเบียบปฏิบัติเกี่ยวกับการทำงาน
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="SEARCH DOC..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#af7a2b] focus:ring-1 focus:ring-[#af7a2b] transition-all uppercase shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="px-4 sm:px-8 w-full flex-1 flex flex-col min-h-0 mb-8">
                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse print-layout-table">
                        <thead className="bg-[#091d38] text-white text-[10px] uppercase tracking-widest font-black sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Document ID</th>
                                <th className="px-6 py-4 w-1/2">Title</th>
                                <th className="px-6 py-4 text-center">Rev.</th>
                                <th className="px-6 py-4">Effective Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                            {REGULATIONS_DATA.map(doc => (
                                <tr key={doc.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 align-middle">
                                        <div className="font-bold text-[#091d38]">{doc.docId}</div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="font-bold text-[#4d5a44] text-[13px]">{doc.title}</div>
                                    </td>
                                    <td className="px-6 py-4 align-middle text-center">
                                        <div className="font-mono">{doc.rev}</div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="font-mono">{doc.date}</div>
                                    </td>
                                    <td className="px-6 py-4 align-middle text-right">
                                        <button 
                                            onClick={() => handlePreview(doc)}
                                            className="w-8 h-8 rounded-lg border border-[#f47729]/30 flex items-center justify-center text-[#f47729] hover:text-white hover:bg-[#f47729] transition-colors ml-auto shadow-sm"
                                            title="Print Preview / Download PDF"
                                        >
                                            <Printer size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>

            {/* Print Preview Modal */}
            <DraggableModal isOpen={showPreview} onClose={() => setShowPreview(false)} title={`PRINT PREVIEW - ${selectedDoc?.docId}`} width="max-w-[800px]">
                <div className="bg-slate-200 p-6 h-[75vh] overflow-y-auto flex justify-center custom-scrollbar">
                    {/* A4 Paper Wrapper */}
                    <div className="bg-white min-w-[210mm] w-[210mm] min-h-[297mm] shrink-0 relative shadow-2xl p-[1cm] print-template-container overflow-hidden">
                        
                        {/* Print Header */}
                        <div className="print-layout-header border-b-2 border-[#091d38] pb-4 mb-8 flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                {/* Fake Logo Placeholder for preview */}
                                <div className="w-16 h-16 bg-gradient-to-tr from-[#091d38] to-[#214573] rounded shadow flex items-center justify-center text-white font-black text-xs border-2 border-[#af7a2b]">CAI</div>
                                <div>
                                    <h2 className="text-[#091d38] text-[18px] font-black uppercase leading-tight tracking-tight">บริษัท ที ออลล์ อินเทลลิเจนซ์ จำกัด</h2>
                                    <h3 className="text-[#af7a2b] font-black text-[10px] tracking-widest mt-1">COMPANY REGULATIONS & POLICIES</h3>
                                </div>
                            </div>
                            <div className="text-right text-[10px] font-mono leading-relaxed mt-2 text-slate-800 font-bold border border-[#091d38] p-2 bg-slate-50">
                                <div>DOC ID: <span className="text-[#091d38]">{selectedDoc?.docId}</span></div>
                                <div>REVISION: <span className="text-[#f47729]">{selectedDoc?.rev}</span></div>
                                <div>EFFECTIVE DATE: <span className="text-slate-500">{selectedDoc?.date}</span></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="min-h-[600px] text-[13px] leading-loose text-slate-800">
                            <h1 className="text-center font-black text-[20px] mb-8 underline underline-offset-4 text-[#091d38]">{selectedDoc?.title}</h1>
                            
                            <p className="indent-8 text-justify mb-4">
                                เพื่อให้การบริหารงานของบริษัทเป็นไปอย่างมีประสิทธิภาพ และเกิดความเข้าใจอันดีร่วมกันระหว่างนายจ้างและลูกจ้าง 
                                ตลอดจนเพื่อให้เกิดความสงบเรียบร้อยและมีระเบียบวินัยในการทำงาน บริษัทฯ จึงได้กำหนดระเบียบข้อบังคับเกี่ยวกับการทำงานขึ้น 
                                เพื่อให้พนักงานทุกคนได้ใช้เป็นแนวทางในการปฏิบัติตนต่อไป
                            </p>
                            
                            <p className="indent-8 text-justify mb-4">
                                พนักงานของบริษัททุกคนมีหน้าที่ต้องศึกษาทำความเข้าใจ และปฏิบัติตามระเบียบข้อบังคับเกี่ยวกับการทำงานฉบับนี้โดยเคร่งครัด 
                                หากมีข้อสงสัยประการใด ให้สอบถามไปยังผู้บังคับบัญชา หรือฝ่ายทรัพยากรบุคคลเพื่อให้เกิดความเข้าใจที่ถูกต้อง
                            </p>

                            <ol className="list-decimal pl-8 space-y-4 mt-6 font-bold">
                                <li>วันทำงาน เวลาทำงานปกติ และเวลาพัก</li>
                                <li>วันหยุด และหลักเกณฑ์การหยุด</li>
                                <li>หลักเกณฑ์การทำงานล่วงเวลาและการทำงานในวันหยุด</li>
                                <li>วันลา และหลักเกณฑ์การลา</li>
                                <li>วินัยและการลงโทษทางวินัย</li>
                                <li>การร้องทุกข์</li>
                            </ol>
                        </div>

                        {/* Footer (Absolute Bottom of Page) */}
                        <div className="print-layout-footer absolute bottom-[1cm] left-[1cm] right-[1cm] border-t-2 border-[#091d38] pt-4 mt-12">
                            <div className="flex justify-between items-end">
                                <div className="text-[10px] text-slate-500 leading-relaxed font-bold">
                                    <div className="text-[#091d38] mb-1">บริษัท ที ออลล์ อินเทลลิเจนซ์ จำกัด</div>
                                    46 หมู่ที่ 5 ตำบลคลองสี่ อำเภอคลองหลวง<br/>จังหวัดปทุมธานี 12120<br/>
                                    Printed on: {new Date().toLocaleDateString('th-TH')}
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-b border-black mb-2"></div>
                                    <div className="text-[11px] font-bold text-[#091d38]">Authorized Signature</div>
                                    <div className="text-[9px] text-[#af7a2b] mt-1 uppercase tracking-widest">(Official Company Seal)</div>
                                </div>
                            </div>
                            {/* Page counter will be overlaid via CSS */}
                        </div>

                    </div>
                </div>
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 font-mono">
                    <button onClick={() => setShowPreview(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-600 rounded-xl font-bold text-[10.5px] uppercase tracking-widest hover:bg-slate-100 transition-all">Close</button>
                    <button 
                        onClick={() => window.print()} 
                        className="px-6 py-2.5 rounded-xl font-bold text-[10.5px] uppercase tracking-widest transition-all flex items-center gap-2 bg-[#091d38] border border-[#091d38] text-white hover:bg-slate-800"
                    >
                        <Printer size={15}/> PRINT / SAVE TO PDF
                    </button>
                </div>
            </DraggableModal>

        </div>
    );
}
