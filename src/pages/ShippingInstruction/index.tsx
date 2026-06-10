import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, Navigation } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { EditShippingInstructionModal } from './components/EditShippingInstructionModal';
import { ShippingInstructionPrintTemplate } from './components/ShippingInstructionPrintTemplate';
import { DataExport } from '../../components/shared/DataExport';
import { PrintPreviewModal } from '../../components/shared/PrintPreviewModal';

const DUMMY_DATA = [
    {
        id: 1,
        piNo: 'ELST 08/2023',
        bookingNo: '2733389150',
        docDate: '13 FEB 2024',
        shipper: 'K.L. INTERFOOD CO., LTD.\n670/63 PHAHONYOTHIN ROAD, SAMSEANNAI,\nPHAYATHAI, BANGKOK 10400, THAILAND',
        fromStr: 'K.L. INTERFOOD CO.,LTD.\nTEL: 02-981-7731-2 EXT. 20\nFAX:02-981-7737 EXT.12\nCONTACT: KWANG',
        consignee: 'CHEN FOODS\n54-66 ROSEBANK AVE, CLAYTON SOUTH VIC 3169, AUSTRALIA\nTEL: +61 3 9793 4828, FAX: +61 3 9795 4868',
        toStr: 'DSV AIR&SEA LTD.\nATTN : DOC TEAM',
        notifyParty: 'CHEN FOODS\n54-66 ROSEBANK AVE, CLAYTON SOUTH VIC 3169, AUSTRALIA\nTEL: +61 3 9793 4828, FAX: +61 3 9795 4868',
        placeOfReceipt: 'LAT KRABANG, THAILAND',
        portOfLoading: 'LAEM CHABANG, THAILAND',
        placeOfDelivery: 'MELBOURNE, AUSTRALIA',
        portOfDischarge: 'MELBOURNE, AUSTRALIA',
        feeder: '',
        motherVessel: 'OOCL BRISBANE V.227S',
        marksAndNumbers: 'SAILING SEAS',
        quantities: '1,624 CARTONS',
        descriptionOfGoods: '1 X 40 HIGH CUBE REEFER CONTAINER\n\n1. SWEET TAMARIND (A) SITHONG\n20 BOXES X 454 G/CARTON/9.08 KGS.\n990 CARTONS/N.W. 8,989.20 KGS.\n\n2. SWEET TAMARIND (B) KUNTI\n20 BOXES X 454 G/CARTON/9.08 KGS.\n634 CARTONS/N.W. 5,756.72 KGS.\n\nTOTAL 1,624 CARTONS/N.W. 14,745.92 KGS./CONTAINER\n\nTEMPERATURE -18 CELSIUS',
        grossWeight: '17,993.92 KGS',
        measurement: '59 CBM',
        containerNo: 'TBA',
        sealNo: 'TBA',
        hsCode: '081090',
        note: '**PLEASE DO NOT SHOW FOR ALL EXPENSE & HS CODE ON BL**\n\nFREIGHT:COLLECT\nNUMBER OF ORIGIN B/L AND COPIES\n3',
        status: 'Confirmed'
    }
];

export default function ShippingInstruction() {
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
                        <div className="absolute inset-0 bg-[#5bb396] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#5bb396]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Navigation size={28} strokeWidth={2.5} className="text-[#5bb396]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            SHIPPING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a6853] to-[#5bb396]">INSTRUCTION</span>
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
                            placeholder="SEARCH S.I..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#5bb396] focus:ring-1 focus:ring-[#5bb396] transition-all uppercase shadow-sm"
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
                                { key: 'portOfLoading', label: 'Port of Loading' },
                                { key: 'portOfDischarge', label: 'Port of Discharge' },
                                { key: 'status', label: 'Status' }
                            ]}
                            filename="Shipping_Instructions"
                        />
                        <button onClick={() => { setSelectedForm(null); setShowEdit(true); }} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#2e3118] text-white shadow-md hover:bg-[#1a1c0e]">
                            <Plus size={16} className="text-[#5bb396]"/> NEW INSTRUCTION
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
                                <th className="px-6 py-4">Port of Loading</th>
                                <th className="px-6 py-4">Port of Discharge</th>
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
                                        <div className="font-bold text-[#091d38] uppercase mb-1">{item.consignee.split('\n')[0]}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#4d5a44] uppercase mb-1">{item.portOfLoading}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#091d38] uppercase mb-1">{item.portOfDischarge}</div>
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
                                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#5bb396] hover:bg-slate-50 transition-colors"
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
                <EditShippingInstructionModal 
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
                    title={`SHIPPING INSTRUCTION - ${selectedForm.bookingNo}`}
                    onPrint={handlePrint}
                >
                    <div className="bg-white shadow-md relative w-[210mm] transition-all">
                        <div className="absolute top-4 right-4 print:hidden opacity-30 z-[0] pointer-events-none">
                            <Printer size={120} />
                        </div>
                        <ShippingInstructionPrintTemplate data={selectedForm} isPreview={true} />
                    </div>
                </PrintPreviewModal>
            )}

            {/* HIDDEN PRINT COMPONENT */}
            {showPreview && <ShippingInstructionPrintTemplate data={selectedForm} />}

        </div>
    );
}
