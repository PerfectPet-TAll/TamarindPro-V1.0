import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Save, RefreshCw } from 'lucide-react';
import { useAutoSync } from '../../../hooks/useAutoSync';

const MOCK_PI_DATA = [
    {
        piNo: 'ELST 08/2023',
        bookingNo: '2733389150',
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
        note: '**PLEASE DO NOT SHOW FOR ALL EXPENSE & HS CODE ON BL**\n\nFREIGHT:COLLECT\nNUMBER OF ORIGIN B/L AND COPIES\n3'
    }
];

interface EditShippingInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditShippingInstructionModal({ isOpen, onClose, onSave, initialData }: EditShippingInstructionModalProps) {
    const [formData, setFormData] = useState<any>({});
    const { syncByPINumber, isSyncing } = useAutoSync();

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                piNo: '', docDate: '', bookingNo: '',
                shipper: '', fromStr: '',
                consignee: '', toStr: '',
                notifyParty: '',
                feeder: '', motherVessel: '',
                placeOfReceipt: '', portOfLoading: '',
                placeOfDelivery: '', portOfDischarge: '',
                marksAndNumbers: '', quantities: '', descriptionOfGoods: '', grossWeight: '', measurement: '',
                containerNo: '', sealNo: '', hsCode: '', note: ''
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
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Shipping Instruction" : "New Shipping Instruction"} width="max-w-[1000px]">
            <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh] custom-scrollbar text-[12px] font-sans">
                
                <div className="grid grid-cols-1 gap-6">
                    {/* General */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-3 gap-4">
                        <label>
                            <span className="mb-1 text-slate-500 font-bold text-[#ad7332] flex items-center gap-1">
                                PI No. (Auto-Sync)
                                {isSyncing && <RefreshCw size={12} className="animate-spin text-[#f47729]" />}
                            </span>
                            <select name="piNo" value={formData.piNo} onChange={handleSelectPI} disabled={isSyncing} className="w-full border p-2 rounded input-field focus:ring-1 bg-white border-[#f47729]/30 focus:border-[#f47729] disabled:opacity-50">
                                <option value="">-- Select PI --</option>
                                {MOCK_PI_DATA.map(pi => (
                                    <option key={pi.piNo} value={pi.piNo}>{pi.piNo}</option>
                                ))}
                            </select>
                        </label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Date</span><input type="text" name="docDate" value={formData.docDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Booking No.</span><input type="text" name="bookingNo" value={formData.bookingNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
                            <label><span className="block mb-1 text-slate-500 font-bold">Shipper</span><textarea name="shipper" value={formData.shipper} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Consignee</span><textarea name="consignee" value={formData.consignee} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Notify Party</span><textarea name="notifyParty" value={formData.notifyParty} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
                            <label><span className="block mb-1 text-slate-500 font-bold">From</span><textarea name="fromStr" value={formData.fromStr} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">To / Attn</span><textarea name="toStr" value={formData.toStr} onChange={handleChange} rows={3} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-slate-50/50" /></label>
                        </div>
                    </div>

                    {/* Routing Details */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 gap-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">Feeder</span><input type="text" name="feeder" value={formData.feeder} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Mother Vessel</span><input type="text" name="motherVessel" value={formData.motherVessel} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Place of receipt</span><input type="text" name="placeOfReceipt" value={formData.placeOfReceipt} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Port of loading</span><input type="text" name="portOfLoading" value={formData.portOfLoading} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Place of delivery</span><input type="text" name="placeOfDelivery" value={formData.placeOfDelivery} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Port of discharge</span><input type="text" name="portOfDischarge" value={formData.portOfDischarge} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                    </div>

                    {/* Particulars */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
                         <h4 className="font-bold text-[#091d38] border-b pb-2">Particulars Furnished By Shipper</h4>
                         <div className="grid grid-cols-5 gap-4">
                            <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold">Mark And Number</span><textarea name="marksAndNumbers" value={formData.marksAndNumbers} onChange={handleChange} rows={5} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                            <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold">Quantities</span><textarea name="quantities" value={formData.quantities} onChange={handleChange} rows={5} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                            <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold">Description of Goods</span><textarea name="descriptionOfGoods" value={formData.descriptionOfGoods} onChange={handleChange} rows={5} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                            <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold">Gross Weight KGS</span><textarea name="grossWeight" value={formData.grossWeight} onChange={handleChange} rows={5} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                            <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold">Measurement CBM</span><textarea name="measurement" value={formData.measurement} onChange={handleChange} rows={5} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                         </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">Container No.</span><input type="text" name="containerNo" value={formData.containerNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">Seal No.</span><input type="text" name="sealNo" value={formData.sealNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">HS Code</span><input type="text" name="hsCode" value={formData.hsCode} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label className="col-span-1 md:col-span-3"><span className="block mb-1 text-slate-500 font-bold">Note / Footer Remarks</span><textarea name="note" value={formData.note} onChange={handleChange} rows={4} className="w-full border p-2 rounded input-field focus:ring-1 resize-none" /></label>
                    </div>

                </div>

            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold"><Save size={16}/> Save Shipping Instruction</button>
            </div>
        </DraggableModal>
    );
}
