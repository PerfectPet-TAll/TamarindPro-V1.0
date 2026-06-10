import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, Calendar, Pencil, FileCheck } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { EditBookingConfirmationModal } from './components/EditBookingConfirmationModal';
import { BookingConfirmationPrintTemplate } from './components/BookingConfirmationPrintTemplate';
import { DataExport } from '../../components/shared/DataExport';
import { PrintPreviewModal } from '../../components/shared/PrintPreviewModal';

const DUMMY_DATA = [
    {
        id: 1,
        piNo: 'ELST 08/2023',
        issueDate: '7 SEP 2023',
        product: 'SWEET TAMARIND',
        bookingNo: '050300909923',
        consignee: 'EASTLAND FOOD CORPORATION',
        country: 'USA',
        term: 'Collect',
        freightUsd: '',
        volume: "1 \u00D7 40' HCRF",
        temperature: '+2°C',
        humidity: '',
        ventilation: '30 CMH',
        returnPlace: 'EVERGREEN CONTAINER TERMINAL',
        pol: 'LAEM CHABANG',
        pod: 'BALTIMORE, MD, USA',
        cyDate: '10 NOV 2023',
        returnDate: '11 NOV 2023',
        closingTime: '13 NOV 2023 @ 2:00 AM',
        paperlessCode: '2812',
        etd: '15 NOV 2023',
        eta: '9 JAN 2024',
        approvedBy: 'Meena',
        approvedDate: '18 OCT 2023',
        status: 'Confirmed'
    }
];

export default function BookingConfirmation() {
    const [dataList, setDataList] = useState(DUMMY_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedForm, setSelectedForm] = useState<any>(null);

    const handleSave = (updatedData: any) => {
        if (selectedForm) {
            setDataList(prev => prev.map(item => item.id === selectedForm.id ? { ...updatedData, id: item.id, status: 'Confirmed' } : item));
        } else {
            setDataList(prev => [...prev, { ...updatedData, id: prev.length + 1, status: 'Confirmed' }]);
        }
        setShowEdit(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full h-full flex flex-col space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4 mb-4">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#5167a2] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#5167a2]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <FileCheck size={28} strokeWidth={2.5} className="text-[#5167a2]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            BOOKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214573] to-[#5167a2]">CONFIRMATION</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            EXPORT LOGISTICS FORM
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="SEARCH BOOKING..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#5167a2] focus:ring-1 focus:ring-[#5167a2] transition-all uppercase shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    </div>
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <DataExport
                            data={dataList}
                            columns={[
                                { key: 'id', label: 'ID' },
                                { key: 'bookingNo', label: 'Booking No' },
                                { key: 'piNo', label: 'PI No' },
                                { key: 'consignee', label: 'Consignee' },
                                { key: 'pod', label: 'POD' },
                                { key: 'etd', label: 'ETD' },
                                { key: 'status', label: 'Status' }
                            ]}
                            filename="Booking_Confirmations"
                        />
                        <button onClick={() => { setSelectedForm(null); setShowEdit(true); }} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#2e3118] text-white shadow-md hover:bg-[#1a1c0e]">
                            <Plus size={16} className="text-[#5167a2]"/> NEW CONFIRMATION
                        </button>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="px-4 sm:px-8 w-full flex-1 flex flex-col min-h-0 mb-8">
                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#091d38] text-white text-[10px] uppercase tracking-widest font-black sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Booking / PI No.</th>
                                <th className="px-6 py-4">Consignee</th>
                                <th className="px-6 py-4">POD</th>
                                <th className="px-6 py-4">ETD</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                            {dataList.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#f47729] mb-1">{item.bookingNo}</div>
                                        <div className="text-[10px] uppercase font-mono tracking-wider opacity-60">PI: {item.piNo}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#091d38] uppercase mb-1">{item.consignee}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#4d5a44] uppercase mb-1">{item.pod}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-mono text-[12px] font-bold text-[#2e3118]">{item.etd}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                            item.status === 'Confirmed' ? 'bg-[#EAF2EA] text-[#606934]' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {item.status || 'Draft'}
                                        </span>
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
                                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#f47729] hover:bg-slate-50 transition-colors"
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
                <EditBookingConfirmationModal 
                    isOpen={showEdit} 
                    onClose={() => setShowEdit(false)} 
                    initialData={selectedForm}
                    onSave={handleSave}
                />
            )}

            {/* Print Modal Overlay */}
            {showPreview && selectedForm && (
                <PrintPreviewModal 
                    isOpen={showPreview} 
                    onClose={() => setShowPreview(false)} 
                    title={`BOOKING CONFIRMATION - ${selectedForm.bookingNo}`}
                    onPrint={handlePrint}
                >
                    <div className="bg-white shadow-md relative w-[210mm] transition-all">
                        <div className="absolute top-4 right-4 print:hidden opacity-30 z-[0] pointer-events-none">
                            <Printer size={120} />
                        </div>
                        <BookingConfirmationPrintTemplate data={selectedForm} isPreview={true} />
                    </div>
                </PrintPreviewModal>
            )}

            {/* HIDDEN PRINT COMPONENT */}
            {showPreview && <BookingConfirmationPrintTemplate data={selectedForm} />}

        </div>
    );
}
