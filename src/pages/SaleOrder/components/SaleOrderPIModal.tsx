import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Plus, Trash2, Save, FileText, CheckCircle2, History, RefreshCw, Box, Tag, Layers
} from 'lucide-react';

const SYNC_PORTS = ['Bangkok, Thailand', 'Chittagong, Bangladesh', 'Rotterdam, Netherlands', 'Los Angeles, U.S.A.'];

export function SaleOrderPIModal({ isOpen, onClose, data, onSave }: any) {
    const [activeTab, setActiveTab] = useState('GENERAL INFORMATION');
    
    const [form, setForm] = useState({
        id: null as any, piId: '', piOrgDate: '', piRev: '0', piRevDate: '', buyerCus: '', consignee: '', notifyParty: '',
        incoterm: 'FOB', downPayment: '100%', 
        paymentTerm: '100% advance T/T payment within 7 days from issuing date of this Proforma Invoice to confirm order.',
        addDoc: '', docCost: 0, freightCost: 0, insuranceCost: 0,
        shipmentMonth: 'May 2026', pol: SYNC_PORTS[0], pod: '', destination: '', cusRef: '', exchangeRate: 35.00
    });

    const [containers, setContainers] = useState([{ id: Date.now(), seq: 1, size: "20' DRY" }]);
    const [productItems, setProductItems] = useState([
        { id: Date.now() + 1, containerId: '', freshDried: 'FRESH TAMARIND', item: '', itemCode: '', note: '', brand: '', netPack: '', qty: 0, price: 0, fumigated: 0, total: 0 }
    ]);

    useEffect(() => {
        if (isOpen && data) {
            setForm({
                id: data.id, 
                piId: data.piId || '', 
                piOrgDate: data.piOrgDate || new Date().toISOString().split('T')[0], 
                piRev: data.piRev || '0', 
                piRevDate: data.piRevDate || '',
                buyerCus: data.buyerCus || '', consignee: '', notifyParty: '', incoterm: 'FOB', downPayment: '100%', 
                paymentTerm: '100% advance T/T payment within 7 days from issuing date of this Proforma Invoice to confirm order.',
                addDoc: '', docCost: 0, freightCost: 0, insuranceCost: 0,
                shipmentMonth: 'May 2026', pol: SYNC_PORTS[0], pod: '', destination: '', cusRef: '', exchangeRate: 35.00
            });
            if (data.status === 'Draft' && !data.piId) setActiveTab('GENERAL INFORMATION');
        } else if (!isOpen) { setActiveTab('GENERAL INFORMATION'); }
    }, [isOpen, data]);

    if (!isOpen) return null;

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const addContainer = () => setContainers([...containers, { id: Date.now(), seq: containers.length + 1, size: "20' DRY" }]);
    const addProductItem = () => setProductItems([...productItems, { id: Date.now(), containerId: '', freshDried: 'FRESH TAMARIND', item: '', itemCode: '', note: '', brand: '', netPack: '', qty: 0, price: 0, fumigated: 0, total: 0 }]);
    const updateProductItem = (id: number, field: string, value: any) => {
        setProductItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const removeProductItem = (id: number) => setProductItems(prev => prev.filter(i => i.id !== id));

    const recalcItemTotal = (id: number) => {
        setProductItems(prev => prev.map(item => {
            if (item.id === id) {
                const total = (Number(item.qty) || 0) * (Number(item.price) || 0) + (Number(item.fumigated) || 0);
                return { ...item, total };
            }
            return item;
        }));
    };

    const handleModalSave = () => {
        onSave({ form, containers, productItems });
    };

    const TABS = ['GENERAL INFORMATION', 'COMMODITY & CONTAINERS', 'COSTING & PAYMENT LOGIC', 'REVISION TRACE'];

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
            <div className="absolute inset-0 bg-[#1f2a44] bg-opacity-70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-[1400px] h-full max-h-[92vh] bg-[#F0EAE1] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-fadeIn border border-[#d2af94]/50">
                <div className="px-8 py-5 bg-[#091d38] flex justify-between items-center shrink-0 border-b-4 border-[#f47729]">
                    <div className="flex items-center gap-5">
                        <div className="bg-white/10 p-3 rounded-2xl border border-white/5 shadow-inner">
                            <FileText size={24} className="text-[#f47729]"/>
                        </div>
                        <div>
                            <h2 className="text-[#f8f9fa] text-[18px] font-black uppercase tracking-[0.1em] font-mono shadow-sm pb-1 flex items-center gap-2">PROFORMA INVOICE REGISTRY</h2>
                            <div className="flex items-center gap-3">
                                <span className="inline-block px-2.5 py-0.5 bg-[#af7a2b] text-white text-[9px] font-black tracking-widest rounded uppercase">System Formatted</span>
                                <span className="text-[#a27175] text-[10px] font-bold tracking-widest">RECORD ID: {data?.id || 'NEW'}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 text-white flex flex-col items-center justify-center transition-colors"><X size={18}/></button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 min-h-0 bg-white">
                    <div className="w-full lg:w-[260px] bg-[#F0EAE1]/30 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto no-scrollbar border-b lg:border-b-0 lg:border-r border-[#adb2b0]/30 shrink-0 font-mono">
                        <div className="hidden lg:block px-6 py-4 text-[9px] font-black text-[#8c7361] uppercase tracking-[0.2em] border-b border-[#adb2b0]/20 bg-[#e2d1c3]/20">Configuration Nodes</div>
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-6 py-4.5 text-left transition-all border-b-2 lg:border-b-0 lg:border-l-4 min-w-[200px] lg:min-w-0 ${activeTab === tab ? 'border-[#f47729] bg-white text-[#214573] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' : 'border-transparent text-[#8c7361] hover:bg-white/50'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest leading-snug ${activeTab === tab ? 'text-[#f47729]' : ''}`}>{tab}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar font-mono text-[#53483e] bg-slate-50/50">
                        {activeTab === 'GENERAL INFORMATION' && (
                            <div className="space-y-8 max-w-4xl animate-fadeIn">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2af94]/30">
                                    <div className="flex items-center gap-2 mb-6 border-b border-[#F0EAE1] pb-3 text-[#214573]">
                                        <History size={16} className="text-[#f47729]"/> <h3 className="text-[12px] font-black tracking-widest uppercase">Document Master Link</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                        <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">PI NO.</label><input type="text" name="piId" value={form.piId} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] focus:border-[#af7a2b] font-black text-[13px] bg-transparent outline-none transition-colors text-[#214573]" placeholder="e.g. METC 03/2026"/></div>
                                        <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">DATE OF ISSUE</label><input type="date" name="piOrgDate" value={form.piOrgDate} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] focus:border-[#af7a2b] font-bold text-[12px] bg-transparent outline-none transition-colors"/></div>
                                        <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">REVISION (REV)</label><input type="text" disabled value={form.piRev} className="w-full h-9 border-b-2 border-[#F0EAE1] bg-transparent font-mono text-[12px] opacity-70"/></div>
                                        <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">REV. DATE</label><input type="text" disabled value={form.piRevDate || '-'} className="w-full h-9 border-b-2 border-[#F0EAE1] bg-transparent font-mono text-[12px] opacity-70"/></div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2af94]/30">
                                    <div className="flex items-center gap-2 mb-6 border-b border-[#F0EAE1] pb-3 text-[#214573]">
                                        <Box size={16} className="text-[#f47729]"/> <h3 className="text-[12px] font-black tracking-widest uppercase">Entity Logistics Mapping</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-3"><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">BUYER / CUSTOMER</label><input type="text" name="buyerCus" value={form.buyerCus} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] focus:border-[#af7a2b] font-bold text-[12px] bg-transparent outline-none"/></div>
                                            <div className="md:col-span-3"><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">CONSIGNEE DETAILS</label><textarea name="consignee" value={form.consignee} onChange={handleFormChange} rows={3} className="w-full p-3 border border-[#F0EAE1] focus:border-[#af7a2b] rounded-xl font-bold text-[12px] bg-slate-50 outline-none resize-none"/></div>
                                            <div className="md:col-span-3"><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">NOTIFY PARTY</label><textarea name="notifyParty" value={form.notifyParty} onChange={handleFormChange} rows={3} className="w-full p-3 border border-[#F0EAE1] focus:border-[#af7a2b] rounded-xl font-bold text-[12px] bg-slate-50 outline-none resize-none"/></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2af94]/30">
                                    <div className="flex items-center gap-2 mb-6 border-b border-[#F0EAE1] pb-3 text-[#214573]">
                                        <CheckCircle2 size={16} className="text-[#f47729]"/> <h3 className="text-[12px] font-black tracking-widest uppercase">Routing & Freight Config</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">PORT OF LOADING</label>
                                        <select name="pol" value={form.pol} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] font-bold text-[12px] bg-transparent outline-none">{SYNC_PORTS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                        <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">PORT OF DISCHARGE</label>
                                        <select name="pod" value={form.pod} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] font-bold text-[12px] bg-transparent outline-none"><option value="">-- Choose Port --</option>{SYNC_PORTS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                        <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">FINAL DESTINATION</label>
                                        <select name="destination" value={form.destination} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] font-bold text-[12px] bg-transparent outline-none"><option value="">-- Choose Destination --</option>{SYNC_PORTS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'COMMODITY & CONTAINERS' && (
                            <div className="space-y-6 flex flex-col h-full animate-fadeIn">
                                <div className="bg-white p-4 rounded-xl border border-[#d2af94]/30 shadow-sm shrink-0 flex items-center justify-between">
                                    <h3 className="text-[11px] font-black tracking-widest uppercase text-[#214573] flex items-center gap-2">
                                        <Layers size={16} className="text-[#f47729]"/> CONTAINER ALLOCATION
                                    </h3>
                                    <button onClick={addContainer} className="px-4 py-1.5 bg-[#e2d1c3]/30 hover:bg-[#d2af94]/30 text-[#8c7361] rounded border border-[#d2af94]/50 text-[10px] font-black tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> ADD INSTANCE</button>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar shrink-0">
                                    {containers.map(c => (
                                        <div key={c.id} className="min-w-[150px] p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-center items-center shadow-sm relative group cursor-pointer hover:border-[#af7a2b] transition-colors">
                                            <div className="absolute top-1 left-2 text-[9px] font-black text-slate-300">#{c.seq}</div>
                                            <Trash2 size={12} className="absolute top-2 right-2 text-red-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"/>
                                            <span className="font-black text-[#214573] text-[13px]">{c.size}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white border border-[#d2af94]/50 rounded-2xl shadow-sm flex flex-col flex-1 min-h-[300px] overflow-hidden">
                                     <div className="p-4 bg-slate-50/50 border-b border-[#adb2b0]/30 flex justify-between items-center shrink-0">
                                        <h3 className="text-[11px] font-black tracking-widest uppercase text-[#214573] flex items-center gap-2">
                                            <Tag size={16} className="text-[#f47729]"/> COMMODITY MANIFEST
                                        </h3>
                                        <button onClick={addProductItem} className="px-5 py-2 bg-[#1f2a44] text-white hover:bg-[#091d38] rounded-lg border border-[#214573] text-[10px] font-black tracking-widest flex items-center gap-2 shadow-sm transition-colors"><Plus size={14}/> ADD LINE ITEM</button>
                                    </div>
                                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[1200px]">
                                            <thead className="bg-[#EAF2EA] text-[#606934] text-[9px] uppercase font-black tracking-widest sticky top-0 border-b border-[#adb2b0]/30 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                                <tr>
                                                    <th className="px-4 py-3 min-w-[120px]">CONTAINER</th>
                                                    <th className="px-4 py-3 min-w-[200px]">LINE ITEM</th>
                                                    <th className="px-4 py-3 w-[150px]">BRAND</th>
                                                    <th className="px-4 py-3 w-[100px] text-center">N.W. PACK</th>
                                                    <th className="px-4 py-3 w-[100px] text-center">QTY</th>
                                                    <th className="px-4 py-3 w-[100px] text-right">UNIT PRICE</th>
                                                    <th className="px-4 py-3 w-[100px] text-center">FUMIGT($)</th>
                                                    <th className="px-4 py-3 w-[120px] text-right">TOTAL</th>
                                                    <th className="px-4 py-3 w-[60px] text-center">ACT</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100/60 bg-white">
                                                {productItems.map((item, idx) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-4 py-3">
                                                            <select value={item.containerId} onChange={(e) => updateProductItem(item.id, 'containerId', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-[#f47729] bg-slate-50 text-[10px] font-bold">
                                                                <option value="">-- NO MAP --</option>
                                                                {containers.map(c => <option key={c.id} value={c.id}>#{c.seq} - {c.size}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="px-4 py-3 flex gap-2"><input type="text" placeholder="Item Name" value={item.item} onChange={(e) => updateProductItem(item.id, 'item', e.target.value)} className="w-full p-2 border border-transparent hover:border-slate-200 focus:border-[#f47729] rounded-md outline-none focus:bg-white text-[11px] font-bold text-[#2e3118] transition-all" /></td>
                                                        <td className="px-4 py-3"><input type="text" placeholder="Brand" value={item.brand} onChange={(e) => updateProductItem(item.id, 'brand', e.target.value)} className="w-full p-2 border border-transparent hover:border-slate-200 focus:border-[#f47729] rounded-md outline-none focus:bg-white text-[10px] font-bold text-[#f47729] uppercase transition-all" /></td>
                                                        <td className="px-4 py-3"><input type="text" placeholder="N.W." value={item.netPack} onChange={(e) => updateProductItem(item.id, 'netPack', e.target.value)} className="w-full p-2 border border-transparent hover:border-slate-200 focus:border-[#f47729] rounded-md outline-none focus:bg-white text-[11px] text-center font-bold text-[#8c7361] transition-all" /></td>
                                                        <td className="px-4 py-3"><input type="number" placeholder="0" value={item.qty} onChange={(e) => { updateProductItem(item.id, 'qty', e.target.value); recalcItemTotal(item.id); }} className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-[#f47729] bg-white text-center font-black text-[#214573] text-[12px] shadow-sm appearance-none" /></td>
                                                        <td className="px-4 py-3"><input type="number" placeholder="0.00" value={item.price} onChange={(e) => { updateProductItem(item.id, 'price', e.target.value); recalcItemTotal(item.id); }} className="w-full p-2 border border-transparent hover:border-slate-200 focus:border-[#f47729] rounded-md outline-none focus:bg-white text-right font-mono text-[11px] font-bold transition-all" /></td>
                                                        <td className="px-4 py-3"><input type="number" placeholder="0" value={item.fumigated} onChange={(e) => { updateProductItem(item.id, 'fumigated', e.target.value); recalcItemTotal(item.id); }} className="w-full p-2 border border-transparent hover:border-slate-200 focus:border-[#f47729] rounded-md outline-none focus:bg-white text-center font-mono text-[11px] transition-all" /></td>
                                                        <td className="px-4 py-3 text-right font-mono font-black text-[12px] text-[#ad7332] bg-[#F0EAE1]/20 rounded">{item.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                        <td className="px-4 py-3 text-center"><button onClick={() => removeProductItem(item.id)} className="p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"><Trash2 size={12}/></button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'COSTING & PAYMENT LOGIC' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl animate-fadeIn">
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2af94]/30">
                                        <h3 className="text-[11px] font-black tracking-widest uppercase text-[#214573] mb-5 pb-3 border-b border-[#F0EAE1]">ACCESSORIAL CHARGES MATRIX</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center"><label className="text-[10px] font-black uppercase tracking-widest text-[#8c7361]">DOC / B/L SURCHARGE</label><input type="number" name="docCost" value={form.docCost} onChange={handleFormChange} className="w-1/3 h-9 border-b-2 border-slate-100 focus:border-[#af7a2b] text-right font-mono text-[12px] font-bold outline-none"/></div>
                                            <div className="flex justify-between items-center"><label className="text-[10px] font-black uppercase tracking-widest text-[#8c7361]">FREIGHT COST</label><input type="number" name="freightCost" value={form.freightCost} onChange={handleFormChange} className="w-1/3 h-9 border-b-2 border-slate-100 focus:border-[#af7a2b] text-right font-mono text-[12px] font-bold outline-none"/></div>
                                            <div className="flex justify-between items-center"><label className="text-[10px] font-black uppercase tracking-widest text-[#8c7361]">INSURANCE PREMIUM</label><input type="number" name="insuranceCost" value={form.insuranceCost} onChange={handleFormChange} className="w-1/3 h-9 border-b-2 border-slate-100 focus:border-[#af7a2b] text-right font-mono text-[12px] font-bold outline-none"/></div>
                                            <div className="flex justify-between items-center"><label className="text-[10px] font-black uppercase tracking-widest text-[#8c7361]">ADDITIONAL DOCUMENTS</label><input type="text" name="addDoc" value={form.addDoc} onChange={handleFormChange} className="w-1/2 h-9 border-b-2 border-slate-100 focus:border-[#af7a2b] text-right text-[11px] font-bold outline-none" placeholder="Certificates etc."/></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2af94]/30">
                                        <h3 className="text-[11px] font-black tracking-widest uppercase text-[#214573] mb-5 pb-3 border-b border-[#F0EAE1]">CURRENCY CONTROLS</h3>
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8c7361]">FIXED EXCHANGE RATE (THB)</label>
                                            <input type="number" name="exchangeRate" value={form.exchangeRate} onChange={handleFormChange} className="w-1/3 h-9 border-b-2 border-slate-100 focus:border-[#af7a2b] text-right font-mono text-[14px] font-black text-[#f47729] outline-none"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2af94]/30">
                                        <h3 className="text-[11px] font-black tracking-widest uppercase text-[#214573] mb-5 pb-3 border-b border-[#F0EAE1]">TERMS AND CONDITIONS</h3>
                                        <div className="space-y-5">
                                            <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">INCOTERM</label><input type="text" name="incoterm" value={form.incoterm} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] focus:border-[#af7a2b] font-bold text-[13px] bg-slate-50 px-2 outline-none uppercase tracking-widest"/></div>
                                            <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">DOWN PAYMENT STRUCTURE</label><input type="text" name="downPayment" value={form.downPayment} onChange={handleFormChange} className="w-full h-9 border-b-2 border-[#F0EAE1] focus:border-[#af7a2b] font-bold text-[12px] bg-transparent outline-none"/></div>
                                            <div><label className="block text-[10px] font-black uppercase tracking-widest text-[#8c7361] mb-2">FULL PAYMENT CLAUSE</label><textarea name="paymentTerm" value={form.paymentTerm} onChange={handleFormChange} rows={3} className="w-full p-3 border border-[#F0EAE1] focus:border-[#af7a2b] rounded-xl font-bold text-[11px] bg-slate-50 outline-none resize-none leading-relaxed"/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'REVISION TRACE' && (
                            <div className="flex items-center justify-center h-full animate-fadeIn">
                                <div className="flex flex-col items-center bg-white p-10 rounded-[32px] border border-[#d2af94]/20 shadow-sm max-w-lg w-full text-center">
                                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                        <RefreshCw size={36} className="text-[#a27175]/30" />
                                    </div>
                                    <h3 className="text-[14px] font-black tracking-widest uppercase text-[#214573] mb-3">VERSION CONTROL AUDIT</h3>
                                    <p className="text-[11px] text-[#8c7361] leading-relaxed mb-6">Traceability logging tracks manual interventions and systematic auto-increments upon commit. Currently examining working draft.</p>
                                    
                                    <div className="w-full border border-slate-100 rounded-2xl bg-slate-50 p-6 flex flex-col gap-4 text-left">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center"><Plus size={16}/></div>
                                                <div><p className="text-[12px] font-black text-slate-800 uppercase">PI INITIALIZED</p><p className="text-[10px] text-slate-400 mt-0.5">Admin Account</p></div>
                                            </div>
                                            <span className="font-black text-slate-400">{form.piOrgDate}</span>
                                        </div>
                                        {Number(form.piRev) > 0 && (
                                            <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center"><RefreshCw size={16}/></div>
                                                    <div><p className="text-[12px] font-black text-[#ad7332] uppercase">REVISION {form.piRev} LOGGED</p><p className="text-[10px] text-[#ad7332]/70 mt-0.5 font-bold">Auto-increment triggered</p></div>
                                                </div>
                                                <span className="font-black text-[#ad7332]/50">{form.piRevDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-8 py-3.5 bg-white border-t border-[#adb2b0]/30 flex justify-end gap-4 shrink-0 font-mono">
                    <button onClick={onClose} className="px-6 py-2.5 bg-[#F0EAE1]/50 border border-[#adb2b0]/30 text-[#53483e] rounded-xl font-bold text-[10.5px] uppercase tracking-widest hover:bg-[#F0EAE1] transition-all">Cancel Node</button>
                    <button onClick={handleModalSave} className="bg-[#214573] text-[#f47729] px-10 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] shadow-lg hover:bg-[#091d38] transition-all border border-[#214573] flex items-center gap-2"><Save size={16}/> COMMIT PI REGISTRY</button>
                </div>
            </div>
        </div>, document.body
    );
}
