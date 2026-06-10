import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Save, Plus, Trash2, User, BookOpen, FileText } from 'lucide-react';

const MOCK_PRICE_BOOKS = [
  { id: 'PB-001', name: 'Standard Retail (RRP)', type: 'Base', currency: 'THB' },
  { id: 'PB-002', name: 'Wholesale Tier 1 (MOQ 100)', type: 'Volume', currency: 'THB' },
  { id: 'PB-003', name: 'International Distributor', type: 'Export', currency: 'USD' },
];

const MOCK_ITEMS = [
  { id: 'SKU-001', name: 'Sweet Tamarind Premium Box', category: 'FT' },
  { id: 'SKU-002', name: 'Pickled Tamarind Jar (500g)', category: 'PT' },
  { id: 'SKU-003', name: 'Tamarind Balls Spicy', category: 'TB' },
  { id: 'SKU-004', name: 'Tamarind Paste Original', category: 'TP' },
];

const MOCK_MULTI_BOOK_PRICES: Record<string, Record<string, number>> = {
  'SKU-001': { 'PB-001': 200, 'PB-002': 180, 'PB-003': 150 },
  'SKU-002': { 'PB-001': 70,  'PB-002': 60,  'PB-003': 50 },
  'SKU-003': { 'PB-001': 95,  'PB-002': 85,  'PB-003': 70 },
  'SKU-004': { 'PB-001': 150, 'PB-002': 130, 'PB-003': 120 },
};

interface EditQuotationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditQuotationModal({ isOpen, onClose, onSave, initialData }: EditQuotationModalProps) {
    const [formData, setFormData] = useState<any>({
        id: '', date: new Date().toISOString().split('T')[0], customer: '', bookId: 'PB-001', 
        validUntil: '', items: []
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    ...initialData,
                    customer: initialData.customer || '',
                    date: initialData.date || '',
                    validUntil: initialData.validUntil || '',
                    items: initialData.items || []
                });
            } else {
                setFormData({
                    id: `QT-NEW-${Math.floor(Math.random() * 1000)}`,
                    date: new Date().toISOString().split('T')[0],
                    customer: '',
                    bookId: 'PB-001',
                    validUntil: '',
                    items: []
                });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { sku: 'SKU-001', qty: 1, unitPrice: MOCK_MULTI_BOOK_PRICES['SKU-001'][formData.bookId] }]
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData({...formData, items: newItems});
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Auto-sync price if SKU changes
        if (field === 'sku') {
            newItems[index].unitPrice = MOCK_MULTI_BOOK_PRICES[value][formData.bookId] || 0;
        }
        
        setFormData({...formData, items: newItems});
    };

    const handleBookChange = (e: any) => {
        const newBookId = e.target.value;
        // Sync all current items to the new book price
        const updatedItems = formData.items.map((item: any) => ({
            ...item,
            unitPrice: MOCK_MULTI_BOOK_PRICES[item.sku]?.[newBookId] || 0
        }));
        setFormData({...formData, bookId: newBookId, items: updatedItems});
    };

    const grandTotal = formData.items.reduce((sum: number, item: any) => sum + (item.qty * item.unitPrice), 0);
    const currencySymbol = MOCK_PRICE_BOOKS.find(b => b.id === formData.bookId)?.currency || 'THB';

    return (
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? `Edit Quotation - ${formData.id}` : "New Quotation"} width="max-w-[1000px]">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f8f9fa] font-sans text-[12px] max-h-[70vh]">
                <div className="max-w-[850px] mx-auto space-y-6">
                    {/* Header Info */}
                    <div className="bg-white p-6 rounded-2xl border border-[#adb2b0]/30 shadow-sm space-y-4">
                        <h4 className="font-bold text-[#091d38] border-b pb-2 mb-4 flex items-center gap-2 uppercase text-[11px] tracking-wider"><User size={16} className="text-[#f47729]"/> Client & General Info</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="col-span-2">
                                <span className="block mb-1 text-[#8c7361] font-bold text-[10px] uppercase">Customer / Company</span>
                                <input type="text" value={formData.customer || ''} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full border border-[#adb2b0]/40 p-2.5 rounded-xl text-[12px] focus:ring-1 focus:border-[#f47729] outline-none" placeholder="Enter Client Name" />
                            </label>
                            <label className="col-span-1">
                                <span className="block mb-1 text-[#8c7361] font-bold text-[10px] uppercase">Date</span>
                                <input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full border border-[#adb2b0]/40 p-2.5 rounded-xl text-[12px] font-mono focus:ring-1 focus:border-[#f47729] outline-none bg-slate-50" />
                            </label>
                            <label className="col-span-1">
                                <span className="block mb-1 text-[#8c7361] font-bold text-[10px] uppercase">Valid Until</span>
                                <input type="date" value={formData.validUntil || ''} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} className="w-full border border-[#adb2b0]/40 p-2.5 rounded-xl text-[12px] font-mono focus:ring-1 focus:border-[#f47729] outline-none" />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <label className="col-span-2 p-3 bg-[#EAF2EA]/40 border border-[#606934]/30 rounded-xl">
                                <span className="flex items-center gap-2 mb-2 text-[#606934] font-black text-[11px] uppercase tracking-widest"><BookOpen size={14}/> Price Book Configuration (Auto-Sync)</span>
                                <select value={formData.bookId} onChange={handleBookChange} className="w-full border border-[#adb2b0]/40 p-2.5 rounded-lg text-[13px] font-bold focus:ring-1 focus:border-[#f47729] outline-none bg-white text-[#214573]">
                                    {MOCK_PRICE_BOOKS.map(book => (
                                        <option key={book.id} value={book.id}>{book.name} ({book.currency}) - {book.type}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-[#8c7361] mt-2">* Changing the Price Book will automatically update all existing items in the table below to their respective book prices.</p>
                            </label>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white p-6 rounded-2xl border border-[#adb2b0]/30 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-[#091d38] border-b pb-2 flex-grow flex items-center gap-2 uppercase text-[11px] tracking-wider"><FileText size={16} className="text-[#f47729]"/> Items Details</h4>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-4">
                            <table className="w-full text-left border-collapse text-[11px]">
                                <thead className="bg-[#f0f0f0] uppercase font-bold text-slate-600">
                                    <tr>
                                        <th className="p-3 border-r w-10 text-center">Del</th>
                                        <th className="p-3 border-r">Product / SKU</th>
                                        <th className="p-3 border-r w-32 text-right">Qty</th>
                                        <th className="p-3 border-r w-40 text-right">Unit Price ({currencySymbol})</th>
                                        <th className="p-3 w-40 text-right">Amount ({currencySymbol})</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {(formData.items || []).map((item: any, idx: number) => (
                                        <tr key={idx} className="border-t hover:bg-slate-50 transition-colors group">
                                            <td className="p-2 border-r text-center">
                                                <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:bg-red-100 p-1.5 rounded transition-colors"><Trash2 size={14} /></button>
                                            </td>
                                            <td className="p-2 border-r">
                                                <select value={item.sku} onChange={(e) => handleItemChange(idx, 'sku', e.target.value)} className="w-full p-2 border border-transparent hover:border-slate-300 focus:border-[#f47729] rounded outline-none font-bold text-[#214573]">
                                                    {MOCK_ITEMS.map(sku => (
                                                        <option key={sku.id} value={sku.id}>{sku.id} - {sku.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2 border-r">
                                                <input type="number" min="1" value={item.qty ?? ''} onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))} className="w-full p-2 border border-transparent hover:border-slate-300 focus:border-[#f47729] rounded outline-none text-right font-mono" />
                                            </td>
                                            <td className="p-2 border-r">
                                                <input type="number" value={item.unitPrice ?? ''} onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))} className="w-full p-2 border border-transparent hover:border-slate-300 focus:border-[#f47729] rounded outline-none text-right font-mono text-[#f47729] font-bold" />
                                            </td>
                                            <td className="p-3 text-right font-mono font-black text-[#53483e]">
                                                {((item.qty || 0) * (item.unitPrice || 0)).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {formData.items?.length === 0 && (
                                        <tr><td colSpan={5} className="text-center p-8 text-slate-400">No items added. Click + ADD ITEM.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={handleAddItem} className="px-5 py-2 bg-[#F0EAE1]/50 text-[#8c7361] border border-[#8c7361]/30 rounded-xl hover:bg-[#F0EAE1] hover:text-[#f47729] transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Plus size={14} /> Add Item Row
                            </button>
                            <div className="flex items-center gap-4 bg-[#EAF2EA] py-3 px-6 rounded-xl border border-[#606934]/30">
                                <span className="text-[11px] font-black text-[#53483e] uppercase tracking-widest">Grand Total</span>
                                <span className="text-2xl font-black font-mono text-[#606934]">{grandTotal.toLocaleString()} <span className="text-[14px]">{currencySymbol}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-[#f8f9fa] shrink-0">
                <button onClick={onClose} className="px-8 py-2.5 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-widest text-[11px]">Cancel</button>
                <button onClick={() => onSave({...formData, total: grandTotal})} className="px-8 py-2.5 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold transition-colors uppercase tracking-widest text-[11px] shadow-sm"><Save size={16}/> Save Quotation</button>
            </div>
        </DraggableModal>
    );
}
