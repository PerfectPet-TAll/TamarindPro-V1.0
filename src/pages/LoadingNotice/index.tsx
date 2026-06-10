import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, Truck } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { EditLoadingNoticeModal } from './components/EditLoadingNoticeModal';
import { LoadingNoticePrintTemplate } from './components/LoadingNoticePrintTemplate';
import { DataExport } from '../../components/shared/DataExport';
import { PrintPreviewModal } from '../../components/shared/PrintPreviewModal';

const DUMMY_DATA = [
    {
        id: 1,
        piNo: 'PI.ASST01/2024',
        poNo: 'PO.012/05',
        company: 'BANGKOK TAMARIND',
        loadingDate: '14 มิ.ย 24 (8.00 น.)',
        bookingNo: '050400650735',
        productionOrderNo: '012/05',
        containerType: '40 HQ Reefer',
        quantity: '1',
        closingTime: '14 มิ.ย. 24 (ก่อน 23.59)',
        brand: 'MUY SABROSO BRAND',
        tempVent: '+2 VENT ,30 CMH',
        destinationCountry: 'NEW YORK, USA',
        transporter: 'เพอเฟคเทรลเลอร์',
        carrier: 'EVERGREEN',
        pickupDate: '13-Jun-24',
        pickupPlace: 'EVERGREEN CONTAINER',
        pickupContact: 'N/A',
        pickupTel: '02-7377474',
        returnDate: '14-Jun-24',
        returnPlace: 'EVERGREEN CONTAINER',
        returnBefore: '23.59',
        returnContact: 'N/A',
        returnTel: '02-7377474',
        packingDate: '13/06/24',
        packingPlace: 'รง. อ.หล่มเก่า จ.เพชรบูรณ์',
        sendBy: 'AMP',
        sendDate: '12-Jun-67',
        approvedBy: 'AMP',
        approvedDate: '12-Jun-67'
    }
];

export default function LoadingNotice() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedForm, setSelectedForm] = useState<any>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full h-full flex flex-col space-y-4 animate-fadeIn">
            {/* Header */}
            <div className="h-14 w-full px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0 mt-4 mb-4">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#e74c3c] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#e74c3c]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Truck size={28} strokeWidth={2.5} className="text-[#e74c3c]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            ใบแจ้งขึ้นตู้ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0392b] to-[#e74c3c]">(LOADING NOTICE)</span>
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
                            placeholder="SEARCH LOADING NOTICE..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#e74c3c] focus:ring-1 focus:ring-[#e74c3c] transition-all uppercase shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    </div>
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <DataExport
                            data={DUMMY_DATA}
                            columns={[
                                { key: 'id', label: 'ID' },
                                { key: 'piNo', label: 'PI No.' },
                                { key: 'poNo', label: 'PO No.' },
                                { key: 'bookingNo', label: 'Booking No.' },
                                { key: 'company', label: 'Company' },
                                { key: 'loadingDate', label: 'Loading Date' }
                            ]}
                            filename="Loading_Notices"
                        />
                        <button onClick={() => { setSelectedForm(null); setShowEdit(true); }} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#2e3118] text-white shadow-md hover:bg-[#1a1c0e]">
                            <Plus size={16} className="text-[#e74c3c]"/> NEW NOTICE
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
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Loading Date</th>
                                <th className="px-6 py-4">Destination</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                            {DUMMY_DATA.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#f47729] mb-1">{item.bookingNo}</div>
                                        <div className="text-[10px] uppercase font-mono tracking-wider opacity-60">PI: {item.piNo}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#091d38] uppercase mb-1">{item.company}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#e74c3c] uppercase mb-1">{item.loadingDate}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#4d5a44] uppercase mb-1">{item.destinationCountry}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top text-right">
                                        <div className="flex items-center justify-end gap-[1px]">
                                          <button 
                                              onClick={() => { setSelectedForm(item); setShowEdit(true); }}
                                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#e74c3c] hover:bg-slate-50 transition-colors"
                                          >
                                              <FileText size={14} />
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
                <EditLoadingNoticeModal 
                    isOpen={showEdit} 
                    onClose={() => setShowEdit(false)} 
                    initialData={selectedForm}
                    onSave={(data) => {
                        setShowEdit(false);
                    }}
                />
            )}

            {/* Print Modal Overlay */}
            {showPreview && selectedForm && (
                <PrintPreviewModal 
                    isOpen={showPreview} 
                    onClose={() => setShowPreview(false)} 
                    title={`ใบแจ้งการขึ้นตู้ - ${selectedForm.bookingNo}`}
                    onPrint={handlePrint}
                >
                    <div className="bg-white shadow-md relative w-[210mm] transition-all">
                        <div className="absolute top-4 right-4 print:hidden opacity-30 z-[0] pointer-events-none">
                            <Printer size={120} />
                        </div>
                        <LoadingNoticePrintTemplate data={selectedForm} isPreview={true} />
                    </div>
                </PrintPreviewModal>
            )}

            {/* HIDDEN PRINT COMPONENT */}
            {showPreview && <LoadingNoticePrintTemplate data={selectedForm} />}

        </div>
    );
}
