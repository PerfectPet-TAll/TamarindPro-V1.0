import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, PackageOpen } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { EditPackingListModal } from './components/EditPackingListModal';
import { PackingListPrintTemplate } from './components/PackingListPrintTemplate';
import { DataExport } from '../../components/shared/DataExport';
import { PrintPreviewModal } from '../../components/shared/PrintPreviewModal';

const DUMMY_DATA = [
    {
        id: 1,
        piNo: 'CFST01/2024',
        customerRef: 'KL05-MEL',
        poNo: '005/01',
        beneficiary: 'K.L.INTERFOOD CO., LTD.\n670/63 PHAHONYOTHIN ROAD, SAMSEANNAI, PHAYATHAI,\nBANGKOK 10400, THAILAND',
        consignee: 'CHEN FOODS\n54-66 ROSEBANK AVE,CLAYTON SOUTH VIC 3169 AUSTRALIA\nTEL:+61 39793 4828 FAX:+61 39795 4868',
        notifyParty: 'CHEN FOODS\n54-66 ROSEBANK AVE,CLAYTON SOUTH VIC 3169 AUSTRALIA\nTEL:+61 39793 4828 FAX:+61 39795 4868',
        term: 'FOB BANGKOK, THAILAND',
        vessel: 'OOCL BRISBANE V.227S',
        invoiceNo: 'KL2024/018',
        invoiceDate: 'FEBRUARY 25, 2024',
        fromStr: 'LAEM CHABANG, THAILAND',
        toStr: 'MELBOURNE, AUSTRALIA',
        shippingMarks: 'SAILING SEAS',
        quantityDescriptions: '1 X 40\' HIGH CUBE REEFER CONTAINER\n1) SWEET TAMARIND (A) SITHONG\n20 BOXES X 454 G /CARTON /N.W.         9.08 KGS.\n990 CARTONS/ N.W.                     8,989.20 KGS.\n2) SWEET TAMARIND (A) KUNTI\n20 BOXES X 454 G /CARTON /N.W.         9.08 KGS.\n634 CARTONS/ N.W.                     5,756.72 KGS.\nTOTAL 1,624 CARTONS/ N.W.           14,745.92 KGS./CONTAINER\n\nTEMP -18 °C\nTERM OF PAYMENT : T/T',
        netWeight: '8,989.20 KGS.\n\n\n5,756.72 KGS.',
        grossWeight: '10,969.20 KGS.\n\n\n7,024.72 KGS.',
        totalNetWeight: '14,745.92 KGS.',
        totalGrossWeight: '17,993.92 KGS.',
        totalText: 'FOURTEEN THOUSAND SEVEN HUNDRED FORTY FIVE KILOGRAMS AND NINE HUNDRED TWENTY GRAMS\nNET WEIGHT/SEVENTEEN THOUSAND NINE HUNDRED NINETY THREE KILOGRAMS AND NINE HUNDRED\nTWENTY GRAMS GROSS WEIGHT',
        inspection: 'ON QUALITY AND WEIGHT IS INSPECTED BY K.L.INTERFOOD CO., LTD. AND\nRESULT IS FINAL AT LOADING.'
    }
];

export default function PackingList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedForm, setSelectedForm] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(DUMMY_DATA.map(d => d.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBatchDownload = () => {
        alert(`Downloaded ${selectedIds.length} packing lists as merged PDF.`);
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
                        <div className="absolute inset-0 bg-[#8e44ad] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#8e44ad]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <PackageOpen size={28} strokeWidth={2.5} className="text-[#8e44ad]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            PACKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c3483] to-[#8e44ad]">LIST</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            EXPORT DOCUMENTATION
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="SEARCH PACKING LIST..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#8e44ad] focus:ring-1 focus:ring-[#8e44ad] transition-all uppercase shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    </div>
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        {selectedIds.length > 0 && (
                            <button onClick={handleBatchDownload} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#8e44ad] text-white shadow-md hover:bg-[#6c3483]">
                                <Printer size={16} /> Batch PDF ({selectedIds.length})
                            </button>
                        )}
                        <DataExport
                            data={DUMMY_DATA}
                            columns={[
                                { key: 'id', label: 'ID' },
                                { key: 'invoiceNo', label: 'Invoice No' },
                                { key: 'piNo', label: 'PI No' },
                                { key: 'vessel', label: 'Vessel' },
                                { key: 'invoiceDate', label: 'Date' }
                            ]}
                            filename="Packing_List_Records"
                        />
                        <button onClick={() => { setSelectedForm(null); setShowEdit(true); }} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#2e3118] text-white shadow-md hover:bg-[#1a1c0e]">
                            <Plus size={16} className="text-[#8e44ad]"/> NEW LIST
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
                                <th className="px-4 py-4 w-10 text-center"><input type="checkbox" checked={selectedIds.length === DUMMY_DATA.length && DUMMY_DATA.length > 0} onChange={handleSelectAll}/></th>
                                <th className="px-6 py-4">Invoice / PI No.</th>
                                <th className="px-6 py-4">Consignee</th>
                                <th className="px-6 py-4">Vessel</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                            {DUMMY_DATA.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-4 text-center align-top">
                                        <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleSelectOne(item.id)} />
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#f47729] mb-1">{item.invoiceNo}</div>
                                        <div className="text-[10px] uppercase font-mono tracking-wider opacity-60">PI: {item.piNo}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#091d38] uppercase mb-1">{item.consignee.split('\n')[0]}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#8e44ad] uppercase mb-1">{item.vessel}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#4d5a44] uppercase mb-1">{item.invoiceDate}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top text-right">
                                        <div className="flex items-center justify-end gap-[1px]">
                                          <button 
                                              onClick={() => { setSelectedForm(item); setShowEdit(true); }}
                                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#8e44ad] hover:bg-slate-50 transition-colors"
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
                <EditPackingListModal 
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
                    title={`PACKING LIST - ${selectedForm.invoiceNo}`}
                    onPrint={handlePrint}
                >
                    <div className="bg-white shadow-md relative w-[210mm] transition-all">
                        <div className="absolute top-4 right-4 print:hidden opacity-30 z-[0] pointer-events-none">
                            <Printer size={120} />
                        </div>
                        <PackingListPrintTemplate data={selectedForm} isPreview={true} />
                    </div>
                </PrintPreviewModal>
            )}

            {/* HIDDEN PRINT COMPONENT */}
            {showPreview && <PackingListPrintTemplate data={selectedForm} />}

        </div>
    );
}
