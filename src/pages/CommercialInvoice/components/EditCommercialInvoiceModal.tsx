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

interface EditCommercialInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditCommercialInvoiceModal({ isOpen, onClose, onSave, initialData }: EditCommercialInvoiceModalProps) {
    const [formData, setFormData] = useState<any>({});
    const { syncByPINumber, isSyncing } = useAutoSync();

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                piNo: '', customerRef: '', poNo: '',
                beneficiary: '', consignee: '', notifyParty: '',
                term: '', vessel: '', invoiceNo: '', invoiceDate: '', fromStr: '', toStr: '',
                shippingMarks: '', quantityDescriptions: '', unitPrice: '', amount: '',
                bankDetail: '', totalAmountLabel: '', totalAmountValue: '', totalText: '', inspection: '', origin: ''
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
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Commercial Invoice" : "New Commercial Invoice"} width="max-w-[1000px]">
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
                                <label><span className="block mb-1 text-slate-500 font-bold">UNIT PRICE</span><textarea name="unitPrice" value={formData.unitPrice} onChange={handleChange} rows={4} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">AMOUNT</span><textarea name="amount" value={formData.amount} onChange={handleChange} rows={4} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono" /></label>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 border-t pt-4 items-center">
                            <div className="col-span-3 text-right">
                                <input type="text" name="totalAmountLabel" value={formData.totalAmountLabel} onChange={handleChange} placeholder="TOTAL LABEL" className="w-64 border p-2 rounded input-field focus:ring-1 font-bold text-right" />
                            </div>
                            <div className="col-span-1">
                                <input type="text" name="totalAmountValue" value={formData.totalAmountValue} onChange={handleChange} placeholder="Total Amount" className="w-full border p-2 rounded input-field focus:ring-1 font-mono font-bold text-center" />
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2">
                        <label><span className="block mb-1 text-slate-500 font-bold">BANK DETAIL</span><textarea name="bankDetail" value={formData.bankDetail} onChange={handleChange} rows={6} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                    </div>

                    {/* Footer Texts */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 space-y-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">TOTAL TEXT</span><textarea name="totalText" value={formData.totalText} onChange={handleChange} rows={2} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-bold" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">INSPECTION</span><textarea name="inspection" value={formData.inspection} onChange={handleChange} rows={2} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">ORIGIN</span><textarea name="origin" value={formData.origin} onChange={handleChange} rows={2} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                    </div>

                </div>

            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold"><Save size={16}/> Save Invoice</button>
            </div>
        </DraggableModal>
    );
}
