import React, { useState } from 'react';
import { FileText, Printer, Plus, Search, FileSpreadsheet, Activity } from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { EditProformaInvoiceModal } from './components/EditProformaInvoiceModal';
import { ProformaInvoicePrintTemplate } from './components/ProformaInvoicePrintTemplate';
import { DataExport } from '../../components/shared/DataExport';
import { PrintPreviewModal } from '../../components/shared/PrintPreviewModal';
import { PIStatusTracker } from './components/PIStatusTracker';
import { INITIAL_PI_DATA } from './data';

export default function ProformaInvoice() {
    const [searchTerm, setSearchTerm] = useState('');
    const [proformaList, setProformaList] = useState<any[]>(INITIAL_PI_DATA);
    const [showPreview, setShowPreview] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedForm, setSelectedForm] = useState<any>(null);
    const [trackingPI, setTrackingPI] = useState<any>(null);

    const handlePrint = () => {
        window.print();
    };

    const filteredList = proformaList.filter(item => 
        (item.piNo || '').toUpperCase().includes(searchTerm.toUpperCase()) || 
        (item.buyer || '').toUpperCase().includes(searchTerm.toUpperCase()) ||
        (item.refNo || '').toUpperCase().includes(searchTerm.toUpperCase())
    );

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
                            PROFORMA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d35400] to-[#e67e22]">INVOICE</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            SALES CONTRACT
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="SEARCH PI..."
                            className="bg-white border border-[#adb2b0]/30 text-[#2e3118] text-[11px] font-black placeholder:text-slate-400 rounded-xl px-4 py-2.5 pl-10 w-64 focus:outline-none focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] transition-all uppercase shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                    </div>
                    <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <DataExport
                            data={proformaList}
                            columns={[
                                { key: 'id', label: 'ID' },
                                { key: 'piNo', label: 'PI No' },
                                { key: 'buyer', label: 'Buyer' }
                            ]}
                            filename="Proforma_Invoices"
                        />
                        <button onClick={() => { setSelectedForm(null); setShowEdit(true); }} className="px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#2e3118] text-white shadow-md hover:bg-[#1a1c0e]">
                            <Plus size={16} className="text-[#e67e22]"/> NEW PI
                        </button>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="px-4 sm:px-8 w-full flex-1 flex flex-col min-h-0 mb-8">
                
                {trackingPI && (
                    <PIStatusTracker 
                        piNo={trackingPI.piNo} 
                        currentStepIndex={trackingPI.currentStepIndex || 0} 
                    />
                )}

                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#091d38] text-white text-[10px] uppercase tracking-widest font-black sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">PI No.</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600">
                            {filteredList.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#f47729] mb-1">{item.piNo}</div>
                                        {item.refNo && item.refNo !== 'N/A' && <div className="text-[10px] text-slate-400">Ref: {item.refNo}</div>}
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#091d38] uppercase mb-1">{item.buyer.split('\n')[0]}</div>
                                        {item.destination && <div className="text-[10px] text-slate-400 uppercase">Dst: {item.destination}</div>}
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-[#e67e22] uppercase mb-1">USD {item.totals?.grandTotal}</div>
                                        {item.incoterm && <div className="text-[10px] text-slate-400 uppercase">{item.incoterm}</div>}
                                    </td>
                                    <td className="px-6 py-4 align-top text-right">
                                        <div className="flex items-center justify-end gap-[1px]">
                                          <button 
                                              onClick={() => setTrackingPI(trackingPI?.id === item.id ? null : item)}
                                              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${trackingPI?.id === item.id ? 'bg-[#e67e22] border-[#e67e22] text-white' : 'border-slate-200 text-slate-500 hover:text-[#e67e22] hover:bg-slate-50'}`}
                                              title="Track Status"
                                          >
                                              <Activity size={14} />
                                          </button>
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
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 uppercase">
                                        No Proforma Invoices found matching search query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>

            {showEdit && (
                <EditProformaInvoiceModal 
                    isOpen={showEdit} 
                    onClose={() => setShowEdit(false)} 
                    initialData={selectedForm}
                    onSave={(data) => {
                        if (selectedForm?.id) {
                            setProformaList(prev => prev.map(p => p.id === selectedForm.id ? { ...p, ...data } : p));
                        } else {
                            const newId = proformaList.length ? Math.max(...proformaList.map(p => p.id)) + 1 : 1;
                            setProformaList(prev => [...prev, { ...data, id: newId }]);
                        }
                        setShowEdit(false);
                    }}
                />
            )}

            {/* Print Modal Overlay */}
            {showPreview && selectedForm && (
                <PrintPreviewModal 
                    isOpen={showPreview} 
                    onClose={() => setShowPreview(false)} 
                    title={`PROFORMA INVOICE - ${selectedForm.piNo}`}
                    onPrint={handlePrint}
                >
                    <div className="bg-white shadow-xl relative w-[210mm] transition-all">
                        <div className="absolute top-4 right-4 print:hidden opacity-20 z-[0] pointer-events-none">
                            <Printer size={120} />
                        </div>
                        <ProformaInvoicePrintTemplate data={selectedForm} isPreview={true} />
                    </div>
                </PrintPreviewModal>
            )}

            {/* HIDDEN PRINT COMPONENT */}
            {showPreview && <ProformaInvoicePrintTemplate data={selectedForm} />}

        </div>
    );
}
