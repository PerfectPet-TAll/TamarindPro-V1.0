import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, Calendar, Ship, Pencil } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { BookingRequestPrintTemplate } from './components/BookingRequestPrintTemplate';
import { EditBookingModal } from './components/EditBookingModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function BookingRequest() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedForm, setSelectedForm] = useState<any>(null);

    // Initial dummy data matching the image
    const demoData = {
        id: "BR-2023-159",
        bookingNo: "159/2023",
        bookingDate: "2 OCTOBER 2023",
        requestBy: "BOONG",
        requestTel: "098 2618370",
        piNo: "ELST 08/2023",
        poNo: "002/09",
        shipper: "Bangkok Tamarind Ltd., Part.\nBANG KHUNNON ROAD, BANG KHUNNON SUB-DISTRICT,\nBANGKOK NOI, BANGKOK 10700 THAILAND",
        shipperContact: "Khun Amp",
        shipperMob: "081-989-5886 [24hrs.]",
        shipperTel: "02 981 7731-32 EXT # 19",
        shipperEmail: "shipping@tamarindkl.com",
        consignee: "EASTLAND FOOD CORPORATION\n8305 STAYTON DRIVE, SUITE C, JESSUP, MARYLAND\n20794, U.S.A",
        consigneeContact: "Meena Prakrim (Meena)",
        consigneeEmail: "meena@eastlandfood.com\n[send shipping documents to this address]",
        consigneeNotes: "",
        notifyParty: "same as above",
        notifyPartyContact: "same as above",
        scNo: "SC-94803",
        fobAgent: "EVERGREEN",
        fobContact: "K. KUNTHIDA",
        fobMob: "089-520-0169",
        fobTel: "02-229-9013",
        fobEmail: "kunthida@evergreen-shipping.co.th",
        cnfShippingLine: "",
        cnfContact: "",
        cnfEmail: "",
        product: "Fresh / Dried Tamarind",
        temp: "+2 deg. cel.",
        pol: "Laem Chabang, Thailand",
        loadingDate: "",
        containerType: "1 X 40' HCRF",
        vent: "15% OR 30 CMH",
        pod: ": CHARLESTON, SC, U.S.A.",
        etd: "18 NOVEMBER 2023",
        freightRate: "",
        grossWeightLimit: "NOT OVER 20 TONS",
        pickupTime: "",
        returnTime: "",
        cutoffTime: "",
        remarks: "Please provide us new and clean container only.\nCBM 59\nNO PRECOOL\nETD REQUESTED BY CUSTOMER"
    };

    const [items] = useState([demoData]);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        const input = document.getElementById('booking-print-preview');
        if (!input) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`BOOKING_REQUEST_${selectedForm.bookingNo.replace('/','_')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4 mb-4">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Ship size={28} strokeWidth={2.5} className="text-[#f47729]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            BOOKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">REQUEST</span> NODE
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            EXPORT LOGISTICS MANAGEMENT HUB
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="SEARCH BOOKING..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#af7a2b] focus:ring-1 focus:ring-[#af7a2b] transition-all uppercase shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    </div>
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <button onClick={() => { setSelectedForm(null); setShowEdit(true); }} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#2e3118] text-white shadow-md hover:bg-[#1a1c0e]">
                            <Plus size={16} className="text-[#f47729]"/> NEW BOOKING
                        </button>
                    </div>
                </div>
            </div>

            {/* Content list */}
            <div className="px-4 sm:px-8 w-full flex-1 flex flex-col min-h-0 mb-8">
                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#091d38] text-white text-[10px] uppercase tracking-widest font-black sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Booking No / PI No</th>
                                <th className="px-6 py-4 w-1/3">Consignee</th>
                                <th className="px-6 py-4">Vessel / Agent</th>
                                <th className="px-6 py-4">ETD</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                            {items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#f47729] font-mono text-[13px]">{item.bookingNo}</div>
                                        <div className="text-[10px] text-[#8c7361] font-mono mt-1">PI: {item.piNo}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#091d38] truncate">{item.consignee.split('\n')[0]}</div>
                                        <div className="text-[10px] text-slate-400 mt-1">POD: {item.pod.replace(': ','')}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#4d5a44]">{item.fobAgent || item.cnfShippingLine || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-mono text-[12px] font-bold text-[#2e3118]">{item.etd}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top text-right">
                                        <div className="flex items-center justify-end gap-[1px]">
                                          <button 
                                              onClick={() => { setSelectedForm(item); setShowEdit(true); }}
                                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#5167a2] hover:bg-slate-50 transition-colors"
                                          >
                                              <Pencil size={14} />
                                          </button>
                                          <button 
                                              onClick={() => { setSelectedForm(item); setShowPreview(true); }}
                                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#091d38] hover:bg-slate-50 transition-colors"
                                          >
                                              <Printer size={14} />
                                          </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>

            {showEdit && (
                <EditBookingModal 
                    isOpen={showEdit} 
                    onClose={() => setShowEdit(false)} 
                    initialData={selectedForm}
                    onSave={(data) => {
                        if (selectedForm) {
                            // Update
                            // (mocked for preview)
                            setShowEdit(false);
                        } else {
                            // Add
                            // (mocked for preview)
                            setShowEdit(false);
                        }
                    }}
                />
            )}

            {/* Print Modal Overlay */}
            {showPreview && selectedForm && (
                <DraggableModal isOpen={showPreview} onClose={() => setShowPreview(false)} title={`BOOKING REQUEST - ${selectedForm.bookingNo}`} width="max-w-[75vw]">
                    <div className="bg-slate-300 p-6 h-[70vh] overflow-y-auto flex justify-center custom-scrollbar">
                        <div id="booking-print-preview" className="bg-white min-w-[210mm] min-h-[297mm] h-fit shrink-0 relative shadow-xl">
                            <BookingRequestPrintTemplate form={selectedForm} isPreview={true} />
                        </div>
                    </div>
                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 font-mono">
                        <button onClick={() => setShowPreview(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-600 rounded-xl font-bold text-[10.5px] uppercase tracking-widest hover:bg-slate-100 transition-all">Close</button>
                        <button 
                            onClick={handleDownloadPDF} 
                            disabled={isDownloading}
                            className={`px-6 py-2.5 rounded-xl font-bold text-[10.5px] uppercase tracking-widest transition-all flex items-center gap-2 ${isDownloading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#091d38] border border-[#091d38] text-white hover:bg-slate-800'}`}
                        >
                            <Printer size={15}/> {isDownloading ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}
                        </button>
                    </div>
                </DraggableModal>
            )}

            {/* Print template (for rendering out of sight during real print if needed) */}
            <div className="absolute left-[-9999px] top-[-9999px]">
                {selectedForm && (
                    <BookingRequestPrintTemplate form={selectedForm} isPreview={true} />
                )}
            </div>
        </div>
    );
}
