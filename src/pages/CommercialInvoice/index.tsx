import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, FileSpreadsheet } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { EditCommercialInvoiceModal } from './components/EditCommercialInvoiceModal';
import { CommercialInvoicePrintTemplate } from './components/CommercialInvoicePrintTemplate';
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
        unitPrice: 'USD      31.50\n\n\nUSD      25.75',
        amount: 'USD   31,185.00\n\n\nUSD   16,325.50',
        bankDetail: 'BANK : THE SIAM COMMERCIAL BANK PUBLIC COMPANY LIMITED\nBRANCH : MUANGTHONG THANI\nADDRESS : 453 BOND STREET ROAD, BAN MAI, PAK KRET, NONTHABURI,11120, THAILAND\nACCOUNT NAME : K.L. INTERFOOD CO.,LTD.\nACCOUNT NO. : 328-245705-5\nSWIFT CODE : SICOTHBK',
        totalAmountLabel: 'TOTAL FOB BANGKOK,THAILAND',
        totalAmountValue: 'USD 47,510.50',
        totalText: 'US DOLLARS FORTY SEVEN THOUSAND FIVE HUNDRED TEN AND FIFTY CENTS ONLY.',
        inspection: 'ON QUALITY AND WEIGHT IS INSPECTED BY K.L.INTERFOOD CO., LTD. AND\nRESULT IS FINAL AT LOADING',
        origin: 'THAILAND 1,624 CARTONS NET WEIGHT 14,745.92 KGS. GROSS WEIGHT 17,993.92 KGS.'
    }
];

export default function CommercialInvoice() {
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
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleBatchDownload = () => {
        // Mock batch download
        alert(`Downloaded ${selectedIds.length} invoices as merged PDF.`);
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
                        <div className="absolute inset-0 bg-[#e67e22] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#e67e22]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <FileSpreadsheet size={28} strokeWidth={2.5} className="text-[#e67e22]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#2e3118] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            COMMERCIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d35400] to-[#e67e22]">INVOICE</span>
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
                            placeholder="SEARCH INVOICE..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] transition-all uppercase shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    </div>
                    {selectedIds.length > 0 && (
                        <button onClick={handleBatchDownload} className="px-4 py-2.5 rounded-lg border border-[#e67e22] text-[#e67e22] text-[11px] font-black uppercase shadow-sm hover:bg-[#e67e22]/10 transition-colors">
                            Batch PDF ({selectedIds.length})
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
                        filename="Commercial_Invoices"
                    />
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <button onClick={() => { setSelectedForm(null); setShowEdit(true); }} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#2e3118] text-white shadow-md hover:bg-[#1a1c0e]">
                            <Plus size={16} className="text-[#e67e22]"/> NEW INVOICE
                        </button>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="px-4 sm:px-8 w-full flex-1 flex flex-col min-h-0 mb-8">
                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#091d38] text-white text-[12px] uppercase tracking-widest font-black sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-4 w-10 text-center"><input type="checkbox" checked={selectedIds.length === DUMMY_DATA.length && DUMMY_DATA.length > 0} onChange={handleSelectAll}/></th>
                                <th className="px-4 py-4">Invoice / PI No.</th>
                                <th className="px-4 py-4">Consignee</th>
                                <th className="px-4 py-4">Amount</th>
                                <th className="px-4 py-4">Date</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-slate-600">
                            {DUMMY_DATA.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-2.5 text-center align-top pt-5">
                                        <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleSelectOne(item.id)} />
                                    </td>
                                    <td className="px-4 py-2.5 align-top">
                                        <div className="font-bold text-[#f47729] mb-1">{item.invoiceNo}</div>
                                        <div className="text-[10px] uppercase font-mono tracking-wider opacity-60">PI: {item.piNo}</div>
                                    </td>
                                    <td className="px-4 py-2.5 align-top">
                                        <div className="font-bold text-[#091d38] uppercase mb-1">{item.consignee.split('\n')[0]}</div>
                                    </td>
                                    <td className="px-4 py-2.5 align-top">
                                        <div className="font-bold text-[#e67e22] uppercase mb-1">{item.totalAmountValue}</div>
                                    </td>
                                    <td className="px-4 py-2.5 align-top">
                                        <div className="font-bold text-[#4d5a44] uppercase mb-1">{item.invoiceDate}</div>
                                    </td>
                                    <td className="px-4 py-2.5 align-top text-right">
                                        <div className="flex items-center justify-end gap-[1px]">
                                          <button 
                                              onClick={() => { setSelectedForm(item); setShowEdit(true); }}
                                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#e67e22] hover:bg-slate-50 transition-colors"
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
                <EditCommercialInvoiceModal 
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
                    title={`COMMERCIAL INVOICE - ${selectedForm.invoiceNo}`}
                    onPrint={handlePrint}
                >
                    <div className="bg-white shadow-md relative w-[210mm] transition-all">
                        <div className="absolute top-4 right-4 print:hidden opacity-30 z-[0] pointer-events-none">
                            <Printer size={120} />
                        </div>
                        <CommercialInvoicePrintTemplate data={selectedForm} isPreview={true} />
                    </div>
                </PrintPreviewModal>
            )}

            {/* HIDDEN PRINT COMPONENT (for regular printing if triggered without dialog) */}
            {showPreview && <CommercialInvoicePrintTemplate data={selectedForm} />}

        </div>
    );
}
