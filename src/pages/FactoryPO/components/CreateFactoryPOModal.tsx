import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Factory, Trash2, Zap, Search, RefreshCw, FileText, Save } from 'lucide-react';
import { useAutoSync } from '../../../hooks/useAutoSync';

interface CreateFactoryPOModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: any, matrixItems: any[]) => void;
    uniquePIs: string[];
}

export function CreateFactoryPOModal({ isOpen, onClose, onSave, uniquePIs }: CreateFactoryPOModalProps) {
    const [modalActiveTab, setModalActiveTab] = useState('PI DATA & ITEMS');
    const { syncByPINumber, isSyncing } = useAutoSync();

    const [newPoForm, setNewPoForm] = useState({
        orderNo: `OEM-2605-0${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        piNo: '',
        customerName: '',
        status: 'DRAFT',
        verifiedBy: '',
        approvedBy: ''
    });

    const [matrixItems, setMatrixItems] = useState<any[]>([]);

    useEffect(() => {
        if (!isOpen) {
            setNewPoForm({
                orderNo: `OEM-2605-0${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                date: new Date().toISOString().split('T')[0],
                piNo: '',
                customerName: '',
                status: 'DRAFT',
                verifiedBy: '',
                approvedBy: ''
            });
            setMatrixItems([]);
            setModalActiveTab('PI DATA & ITEMS');
        }
    }, [isOpen]);

    const handleSelectPI = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPi = e.target.value;
        setNewPoForm(prev => ({ ...prev, piNo: selectedPi }));

        if (selectedPi) {
            const mockCustomerMap: Record<string, string> = {
                'PI-2024-001': 'TAMARIND PLUS CO., LTD.',
                'PI-2024-003': 'OEM-BRAND B TRADING',
                'PI-2024-004': 'HEALTHY PLUS GROUP'
            };
            const cust = mockCustomerMap[selectedPi] || 'GLOBAL FOODS TRADING';
            
            // Invoke hook (simulated delay/loading state)
            const autoData = await syncByPINumber(selectedPi);

            setNewPoForm(prev => ({ 
                ...prev, 
                customerName: autoData?.customerName || cust 
            }));
            
            // Assume we had a sync logic fetching items from the backend, for mock, we'll keep basic mapping
            // But we will use autoData items if available. (Here just a placeholder logic to mimic existing)
            setMatrixItems([
                {
                    product: autoData?.product || 'Auto Synced Product',
                    containWeight: '500g',
                    brand: 'BRAND',
                    packedWeight: '500g',
                    barcode: '',
                    quantity: 100,
                    expiryDate: '',
                    packingCarton: '24 Pcs',
                    note: ''
                }
            ]);

        } else {
            setNewPoForm(prev => ({ ...prev, customerName: '' }));
            setMatrixItems([]);
        }
    };

    const handleMatrixChange = (index: number, field: string, value: string) => {
        const updated = [...matrixItems];
        updated[index] = { ...updated[index], [field]: value };
        setMatrixItems(updated);
    };

    const handleSubmit = () => {
        onSave(newPoForm, matrixItems);
    };

    return (
        <DraggableModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={<span className="text-[13px] font-black tracking-widest text-[#214573] uppercase flex items-center gap-2"><Factory size={18} className="text-[#f47729]"/> CREATE FACTORY PO</span>} 
            width="max-w-[75vw]" 
        >
            <div className="flex flex-col md:flex-row h-[75vh] w-full relative">
                <button onClick={onClose} className="absolute right-4 top-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                    <Trash2 size={16} />
                </button>

                <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-[#adb2b0]/30 flex flex-row md:flex-col shrink-0 overflow-x-auto no-scrollbar font-mono">
                    <div className="hidden md:block px-5 py-3.5 text-[9px] font-black text-[#8c7361] uppercase tracking-[0.2em] border-b border-[#adb2b0]/20 bg-[#F0EAE1]/20">PO Segments</div>
                    {['PI DATA & ITEMS', 'VERIFY & APPROVE', 'HISTORY'].map(tab => (
                        <button key={tab} onClick={() => setModalActiveTab(tab)} className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-4 px-5 py-4 text-left transition-all md:border-l-4 ${modalActiveTab === tab ? 'border-b-4 md:border-b-0 border-[#f47729] bg-[#F0EAE1]/50 text-[#2e3118]' : 'border-transparent text-[#8c7361] hover:bg-[#F0EAE1]/20'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${modalActiveTab === tab ? 'text-[#f47729]' : ''}`}>{tab}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-6 text-[#2e3118] text-[12px] font-mono overflow-y-auto custom-scrollbar flex flex-col gap-6">
                    {modalActiveTab === 'PI DATA & ITEMS' && (
                        <>
                            <div className="bg-[#F0EAE1]/30 border border-[#d2af94]/40 p-5 rounded-2xl shadow-sm">
                                <h3 className="font-black text-[#af7a2b] uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#af7a2b]"></div> 1. PO INITIALIZATION</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">PO NO. (AUTO)</label>
                                        <input type="text" value={newPoForm.orderNo} disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl outline-none font-bold text-[#8c7361] text-[13px]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">ISSUE DATE</label>
                                        <input type="date" value={newPoForm.date} onChange={(e) => setNewPoForm({...newPoForm, date: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#af7a2b] font-bold text-[13px] text-[#2e3118]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2 flex items-center gap-1">
                                            PI NO. (AUTO-SYNC) <span className="text-red-500">*</span>
                                            {isSyncing && <RefreshCw size={12} className="animate-spin text-[#ad7332]" />}
                                        </label>
                                        <select 
                                            value={newPoForm.piNo} 
                                            onChange={handleSelectPI} 
                                            disabled={isSyncing}
                                            className="w-full px-4 py-2.5 bg-white border-2 border-[#d2af94]/60 rounded-xl outline-none focus:border-[#af7a2b] font-black text-[13px] text-[#2e3118] disabled:opacity-50"
                                        >
                                            <option value="">-- SELECT PI --</option>
                                            {uniquePIs.map(pi => (
                                                <option key={pi} value={pi}>{pi} - GLOBAL FOODS</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">CUSTOMER NAME</label>
                                        <input type="text" value={newPoForm.customerName} placeholder="AUTO-FILLED FROM PI" disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl outline-none font-bold text-[#8c7361] text-[12px]" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-[#adb2b0]/30 rounded-2xl shadow-sm flex flex-col flex-1 min-h-[300px]">
                                <div className="p-4 border-b border-[#adb2b0]/20 bg-slate-50/50 flex justify-between items-center rounded-t-2xl">
                                    <h3 className="font-black text-[#214573] uppercase tracking-widest text-[11px] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#214573]"></div> 2. ITEMS TO PRODUCE</h3>
                                    <span className="text-[10px] font-bold text-[#8c7361] bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{matrixItems.length} ITEMS</span>
                                </div>
                                
                                {!newPoForm.piNo ? (
                                    <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                                        <Search size={48} className="text-[#8c7361] mb-4" />
                                        <p className="font-black text-[12px] uppercase tracking-widest text-[#8c7361]">PLEASE SELECT PI NO. TO LOAD ITEMS</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto flex-1 custom-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[1000px]">
                                            <thead>
                                                <tr className="bg-slate-100/50 text-[#8c7361] text-[10px] uppercase font-black tracking-widest border-b border-[#adb2b0]/20">
                                                    <th className="px-4 py-2 w-[50px] text-center">NO.</th>
                                                    <th className="px-4 py-2 w-[250px]">PRODUCT / BRAND</th>
                                                    <th className="px-4 py-2 text-center w-[150px]">BARCODE <span className="text-[#f47729]">*</span></th>
                                                    <th className="px-4 py-2 text-center w-[110px]">จำนวน <br/><span className="text-[8px] opacity-70">(QUANTITY) *</span></th>
                                                    <th className="px-4 py-2 text-center w-[140px]">EXPIRY DATE * <br/><span className="text-[8px] opacity-70">(E.G. APR 2027)</span></th>
                                                    <th className="px-4 py-2 text-center w-[140px]">การบรรจุ/กล่อง <br/><span className="text-[8px] opacity-70">(PACKING/CARTON)</span></th>
                                                    <th className="px-4 py-2 w-[200px]">NOTE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {matrixItems.map((mat, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-4 py-3 text-center text-[#adb2b0] font-bold text-[10px]">{idx + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-bold text-[#2e3118] text-[11px] mb-1">{mat.product}</div>
                                                            <div className="text-[9px] text-[#8c7361] uppercase">{mat.brand} | {mat.containWeight}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <input type="text" value={mat.barcode} onChange={(e) => handleMatrixChange(idx, 'barcode', e.target.value)} placeholder="0000000000000" className="w-full px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-[#f47729] text-[11px] font-mono text-center bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <input type="number" value={mat.quantity} onChange={(e) => handleMatrixChange(idx, 'quantity', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-[#f47729] text-[11px] font-mono text-center font-bold text-[#214573] bg-[#F0EAE1]/30" />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <input type="text" value={mat.expiryDate} onChange={(e) => handleMatrixChange(idx, 'expiryDate', e.target.value)} placeholder="MMM YYYY" className="w-full px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-[#f47729] text-[11px] font-mono text-center uppercase" />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <input type="text" value={mat.packingCarton} onChange={(e) => handleMatrixChange(idx, 'packingCarton', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-[#f47729] text-[11px] text-center" />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <input type="text" value={mat.note} onChange={(e) => handleMatrixChange(idx, 'note', e.target.value)} placeholder="Remarks..." className="w-full px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-[#f47729] text-[11px] bg-white text-[#a27175]" />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {modalActiveTab === 'VERIFY & APPROVE' && (
                        <div className="bg-[#F0EAE1]/30 border border-[#d2af94]/40 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center py-12">
                            <h3 className="font-black text-[#af7a2b] uppercase tracking-widest text-[14px] mb-8">APPROVAL WORKFLOW</h3>
                            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">FACTORY PO STATUS</label>
                                    <select value={newPoForm.status} onChange={(e) => setNewPoForm({...newPoForm, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-[#2e3118] text-[12px] uppercase">
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="ISSUED">ISSUED</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">VERIFIED BY</label>
                                    <input type="text" value={newPoForm.verifiedBy} onChange={(e) => setNewPoForm({...newPoForm, verifiedBy: e.target.value})} placeholder="Verifier Name" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#af7a2b] font-bold text-[12px] text-[#2e3118]" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">APPROVED BY</label>
                                    <input type="text" value={newPoForm.approvedBy} onChange={(e) => setNewPoForm({...newPoForm, approvedBy: e.target.value})} placeholder="Approver Name" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#af7a2b] font-bold text-[12px] text-[#2e3118]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {modalActiveTab === 'HISTORY' && (
                        <div className="flex-1 flex items-center justify-center opacity-40">
                            <p className="font-black text-[12px] uppercase tracking-widest text-[#8c7361]">NO HISTORY FOR NEW RECORD</p>
                        </div>
                    )}

                    <div className="mt-auto pt-6 flex justify-between items-center border-t border-[#adb2b0]/30 shrink-0">
                        <button onClick={onClose} className="px-8 py-3 bg-[#F0EAE1]/50 text-[#53483e] font-black text-[11px] uppercase tracking-widest hover:bg-[#d2af94]/30 rounded-xl transition-colors border border-[#d2af94]/50">CANCEL</button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={!newPoForm.piNo || matrixItems.length === 0}
                            className={`px-8 py-3 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-colors shadow-md flex items-center gap-2 ${(!newPoForm.piNo || matrixItems.length === 0) ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#214573] hover:bg-[#091d38] active:scale-95'}`}
                        >
                            <Save size={16} /> SAVE FACTORY PO
                        </button>
                    </div>
                </div>
            </div>
        </DraggableModal>
    );
}
