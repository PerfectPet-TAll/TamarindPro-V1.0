import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Save, RefreshCw } from 'lucide-react';
import { useAutoSync } from '../../../hooks/useAutoSync';

const MOCK_PI_DATA = [
    {
        piNo: 'PI.ASST01/2024',
        poNo: 'PO.012/05',
        company: 'BANGKOK TAMARIND',
        bookingNo: '050400650735',
        productionOrderNo: '012/05',
        brand: 'MUY SABROSO BRAND',
        tempVent: '+2 VENT ,30 CMH',
        destinationCountry: 'NEW YORK, USA',
        carrier: 'EVERGREEN'
    },
    {
        piNo: 'ELST 08/2023',
        poNo: '002/09',
        company: 'K.L.INTERFOOD',
        bookingNo: '2733389150',
        productionOrderNo: '002/09',
        brand: 'SAILING SEAS',
        tempVent: '-18 CELSIUS',
        destinationCountry: 'MELBOURNE, AUSTRALIA',
        carrier: 'OOCL'
    }
];

interface EditLoadingNoticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditLoadingNoticeModal({ isOpen, onClose, onSave, initialData }: EditLoadingNoticeModalProps) {
    const [formData, setFormData] = useState<any>({});
    const { syncByPINumber, isSyncing } = useAutoSync();

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                piNo: '', poNo: '', company: 'BANGKOK TAMARIND',
                loadingDate: '', bookingNo: '', productionOrderNo: '',
                containerType: '40 HQ Reefer', quantity: '1', closingTime: '',
                brand: '', tempVent: '', destinationCountry: '',
                transporter: '', carrier: '',
                pickupDate: '', pickupPlace: '', pickupContact: '', pickupTel: '',
                returnDate: '', returnPlace: '', returnBefore: '', returnContact: '', returnTel: '',
                packingDate: '', packingPlace: '',
                sendBy: '', sendDate: '', approvedBy: '', approvedDate: ''
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
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Loading Notice (ใบแจ้งขึ้นตู้)" : "New Loading Notice (ใบแจ้งขึ้นตู้)"} width="max-w-[1000px]">
            <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh] custom-scrollbar text-[12px] font-sans">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Header Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
                        <label>
                            <span className="mb-1 text-slate-500 font-bold text-[#ad7332] flex items-center gap-1">
                                PI No. (Auto-Sync)
                                {isSyncing && <RefreshCw size={12} className="animate-spin text-[#ad7332]" />}
                            </span>
                            <select name="piNo" value={formData.piNo} onChange={handleSelectPI} disabled={isSyncing} className="w-full border p-2 rounded input-field focus:ring-1 bg-white border-[#f47729]/30 focus:border-[#f47729] disabled:opacity-50">
                                <option value="">-- Select PI --</option>
                                {MOCK_PI_DATA.map(pi => (
                                    <option key={pi.piNo} value={pi.piNo}>{pi.piNo}</option>
                                ))}
                            </select>
                        </label>
                        <label><span className="block mb-1 text-slate-500 font-bold">PO No.</span><input type="text" name="poNo" value={formData.poNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label>
                            <span className="block mb-1 text-slate-500 font-bold">Company</span>
                            <select name="company" value={formData.company} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white">
                                <option value="K.L.INTERFOOD">K.L.INTERFOOD</option>
                                <option value="BANGKOK TAMARIND">BANGKOK TAMARIND</option>
                            </select>
                        </label>
                    </div>

                    {/* Booking & Container Details */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <label><span className="block mb-1 text-slate-500 font-bold">วันที่ขึ้นตู้</span><input type="text" name="loadingDate" value={formData.loadingDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">BOOKING NO.</span><input type="text" name="bookingNo" value={formData.bookingNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">ใบสั่งผลิตเลขที่</span><input type="text" name="productionOrderNo" value={formData.productionOrderNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label>
                            <span className="block mb-1 text-slate-500 font-bold">ชนิดตู้</span>
                            <select name="containerType" value={formData.containerType} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white">
                                <option value="20 Dry">20 Dry</option>
                                <option value="20 Reefer">20 Reefer</option>
                                <option value="40 HQ Dry">40 HQ Dry</option>
                                <option value="40 HQ Reefer">40 HQ Reefer</option>
                            </select>
                        </label>
                        <label><span className="block mb-1 text-slate-500 font-bold">จำนวนตู้</span><input type="text" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">CLOSING TIME</span><input type="text" name="closingTime" value={formData.closingTime} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">สินค้ายี่ห้อ</span><input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">TEMP / VENT</span><input type="text" name="tempVent" value={formData.tempVent} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
                        <label className="col-span-3 lg:col-span-1"><span className="block mb-1 text-slate-500 font-bold">ประเทศปลายทาง</span><input type="text" name="destinationCountry" value={formData.destinationCountry} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        <label className="col-span-3 lg:col-span-1"><span className="block mb-1 text-slate-500 font-bold">หัวลาก</span><input type="text" name="transporter" value={formData.transporter} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 relative" /></label>
                        <label className="col-span-3 lg:col-span-1"><span className="block mb-1 text-slate-500 font-bold">สายเรือ</span><input type="text" name="carrier" value={formData.carrier} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                    </div>

                    {/* Pickup Container */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">รับตู้</h4>
                        <div className="space-y-3">
                            <label><span className="block mb-1 text-slate-500 font-bold">รับตู้วันที่</span><input type="text" name="pickupDate" value={formData.pickupDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">สถานที่รับตู้</span><input type="text" name="pickupPlace" value={formData.pickupPlace} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <div className="grid grid-cols-2 gap-3">
                                <label><span className="block mb-1 text-slate-500 font-bold">ติดต่อ</span><input type="text" name="pickupContact" value={formData.pickupContact} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">TEL.</span><input type="text" name="pickupTel" value={formData.pickupTel} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            </div>
                        </div>
                    </div>

                    {/* Return Container */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">คืนตู้</h4>
                        <div className="space-y-3">
                            <label><span className="block mb-1 text-slate-500 font-bold">คืนตู้วันที่</span><input type="text" name="returnDate" value={formData.returnDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <div className="grid grid-cols-[2fr_1fr] gap-3">
                                <label><span className="block mb-1 text-slate-500 font-bold">สถานที่คืนตู้</span><input type="text" name="returnPlace" value={formData.returnPlace} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">ก่อนเวลา</span><input type="text" name="returnBefore" value={formData.returnBefore} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <label><span className="block mb-1 text-slate-500 font-bold">ติดต่อ</span><input type="text" name="returnContact" value={formData.returnContact} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">TEL.</span><input type="text" name="returnTel" value={formData.returnTel} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            </div>
                        </div>
                    </div>

                    {/* Packing & Approval */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label><span className="block mb-1 text-slate-500 font-bold">บรรจุสินค้าวันที่</span><input type="text" name="packingDate" value={formData.packingDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">สถานที่บรรจุสินค้า</span><input type="text" name="packingPlace" value={formData.packingPlace} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label><span className="block mb-1 text-slate-500 font-bold">SEND BY</span><input type="text" name="sendBy" value={formData.sendBy} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">DATE (SEND)</span><input type="text" name="sendDate" value={formData.sendDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">APPROVED I</span><input type="text" name="approvedBy" value={formData.approvedBy} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">DATE (APPROVED)</span><input type="text" name="approvedDate" value={formData.approvedDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        </div>
                    </div>
                </div>

            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold"><Save size={16}/> Save Loading Notice</button>
            </div>
        </DraggableModal>
    );
}
