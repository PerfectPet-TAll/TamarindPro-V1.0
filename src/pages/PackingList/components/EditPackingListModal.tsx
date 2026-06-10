import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Save, RefreshCw } from 'lucide-react';
import { useAutoSync } from '../../../hooks/useAutoSync';

const MOCK_PI_DATA = [
    {
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

interface EditPackingListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditPackingListModal({ isOpen, onClose, onSave, initialData }: EditPackingListModalProps) {
    const [formData, setFormData] = useState<any>({});
    const { syncByPINumber, isSyncing } = useAutoSync();

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                piNo: '', customerRef: '', poNo: '',
                beneficiary: '', consignee: '', notifyParty: '',
                term: '', vessel: '', invoiceNo: '', invoiceDate: '', fromStr: '', toStr: '',
                shippingMarks: '', quantityDescriptions: '', netWeight: '', grossWeight: '',
                totalNetWeight: '', totalGrossWeight: '', totalText: '', inspection: ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSelectPI = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPi = e.target.value;
        const fallbackData = MOCK_PI_DATA.find(p => p.piNo === selectedPi);
        
        const autoData = await syncByPINumber(selectedPi);

        setFormData((prev: any) => ({
            ...prev,
            piNo: selectedPi,
            ...(fallbackData || {}),
            ...(autoData || {})
        }));
    };

    return (
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Packing List" : "New Packing List"} width="max-w-[1000px]">
            <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh] custom-scrollbar text-[12px] font-sans">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Refs */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
                        <label>
                            <span className="mb-1 text-slate-500 font-bold text-[#ad7332] flex items-center gap-1">
                                P I NO. (Auto-Sync)
                                {isSyncing && <RefreshCw size={12} className="animate-spin text-[#ad7332]" />}
                            </span>
                            <select name="piNo" value={formData.piNo} onChange={handleSelectPI} disabled={isSyncing} className="w-full border p-2 rounded input-field focus:ring-1 bg-white border-[#f47729]/30 focus:border-[#f47729] disabled:opacity-50">
                                <option value="">-- Select PI --</option>
                                {MOCK_PI_DATA.map(pi => (
                                    <option key={pi.piNo} value={pi.piNo}>{pi.piNo}</option>
                                ))}
                            </select>
                        </label>
                        <label><span className="block mb-1 text-slate-500 font-bold">CUSTOMER REF.</span><input type="text" name="customerRef" value={formData.customerRef} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">P.O.NO.</span><input type="text" name="poNo" value={formData.poNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                    </div>

                    {/* Parties */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 space-y-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">BENEFICIARY</span><textarea name="beneficiary" value={formData.beneficiary} onChange={handleChange} rows={2} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                        <div className="grid grid-cols-2 gap-4">
                            <label><span className="block mb-1 text-slate-500 font-bold">CONSIGNEE</span><textarea name="consignee" value={formData.consignee} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">NOTIFY PARTY</span><textarea name="notifyParty" value={formData.notifyParty} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                        </div>
                    </div>

                    {/* Logistics & Invoice */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 gap-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">TERM</span><input type="text" name="term" value={formData.term} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">VESSEL</span><input type="text" name="vessel" value={formData.vessel} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 gap-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">INVOICE NO.</span><input type="text" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">DATE</span><input type="text" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">FROM</span><input type="text" name="fromStr" value={formData.fromStr} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">TO</span><input type="text" name="toStr" value={formData.toStr} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                    </div>

                    {/* Items Table Data */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 space-y-4">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">Items Detail</h4>
                        <div className="grid grid-cols-4 gap-4">
                            <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold">SHIPPING MARKS</span><textarea name="shippingMarks" value={formData.shippingMarks} onChange={handleChange} rows={10} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                            <label className="col-span-2"><span className="block mb-1 text-slate-500 font-bold">QUANTITY & DESCRIPTIONS</span><textarea name="quantityDescriptions" value={formData.quantityDescriptions} onChange={handleChange} rows={10} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono" /></label>
                            <div className="col-span-1 flex flex-col gap-4">
                                <label><span className="block mb-1 text-slate-500 font-bold">NET WEIGHT</span><textarea name="netWeight" value={formData.netWeight} onChange={handleChange} rows={4} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">GROSS WEIGHT</span><textarea name="grossWeight" value={formData.grossWeight} onChange={handleChange} rows={4} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono" /></label>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 border-t pt-4">
                            <div className="col-span-3 text-right font-bold pt-2">TOTAL:</div>
                            <div className="col-span-1 flex flex-col gap-2">
                                <input type="text" name="totalNetWeight" value={formData.totalNetWeight} onChange={handleChange} placeholder="Total Net" className="w-full border p-2 rounded input-field focus:ring-1 font-mono font-bold text-center" />
                                <input type="text" name="totalGrossWeight" value={formData.totalGrossWeight} onChange={handleChange} placeholder="Total Gross" className="w-full border p-2 rounded input-field focus:ring-1 font-mono font-bold text-center" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Texts */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 space-y-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">TOTAL TEXT</span><textarea name="totalText" value={formData.totalText} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-bold" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">INSPECTION</span><textarea name="inspection" value={formData.inspection} onChange={handleChange} rows={2} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                    </div>

                </div>

            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold"><Save size={16}/> Save Packing List</button>
            </div>
        </DraggableModal>
    );
}
