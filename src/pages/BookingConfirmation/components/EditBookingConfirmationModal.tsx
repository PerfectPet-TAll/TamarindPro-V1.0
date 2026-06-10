import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useAutoSync } from '../../../hooks/useAutoSync';

const MOCK_PI_DATA = [
    {
        piNo: 'ELST 08/2023',
        issueDate: '7 SEP 2023',
        product: 'SWEET TAMARIND',
        consignee: 'EASTLAND FOOD CORPORATION',
        country: 'USA'
    },
    {
        piNo: 'ELST 09/2023',
        issueDate: '10 SEP 2023',
        product: 'CANNED PINEAPPLE',
        consignee: 'WESTLAND TRADING INC.',
        country: 'USA'
    }
];

interface EditBookingConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditBookingConfirmationModal({ isOpen, onClose, onSave, initialData }: EditBookingConfirmationModalProps) {
    const [formData, setFormData] = useState<any>({});
    const { syncByPINumber, isSyncing } = useAutoSync();

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                piNo: '', issueDate: '', product: '', bookingNo: '', consignee: '', country: '',
                term: '', freightUsd: '',
                volume: '', temperature: '', humidity: '', ventilation: '',
                returnPlace: '', pol: '', pod: '',
                cyDate: '', returnDate: '', closingTime: '', paperlessCode: '',
                etd: '', eta: '',
                approvedBy: '', approvedDate: ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Booking Confirmation" : "New Booking Confirmation"} width="max-w-[1000px]">
            <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh] custom-scrollbar text-[12px] font-sans">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 col-span-1 md:col-span-2">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">General Information</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                            <label><span className="block mb-1 text-slate-500 font-bold">Issue Date</span><input name="issueDate" value={formData.issueDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Product</span><input name="product" value={formData.product} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                            
                            <label><span className="block mb-1 text-slate-500 font-bold">Carrier & Booking No.</span><input name="bookingNo" value={formData.bookingNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Consignee</span><input name="consignee" value={formData.consignee} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Country</span><input name="country" value={formData.country} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-slate-50/50" /></label>
                        </div>
                    </div>

                    {/* Terms & Cargo Details */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">Terms & Freight</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <label>
                                <span className="block mb-1 text-slate-500 font-bold">Term</span>
                                <select name="term" value={formData.term} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white">
                                    <option value="">-- Select --</option>
                                    <option value="Prepaid">Prepaid</option>
                                    <option value="Collect">Collect</option>
                                    <option value="Prepaid at destination">Prepaid at destination</option>
                                </select>
                            </label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Freight USD</span><input name="freightUsd" value={formData.freightUsd} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        </div>

                        <h4 className="font-bold text-[#091d38] border-b pb-2 mt-4 pt-4">Container Specs</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <label><span className="block mb-1 text-slate-500 font-bold">Volume</span><input name="volume" value={formData.volume} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Temperature</span><input name="temperature" value={formData.temperature} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Humidity</span><input name="humidity" value={formData.humidity} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Ventilation</span><input name="ventilation" value={formData.ventilation} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">Logistics & Locations</h4>
                        <label><span className="block mb-1 text-slate-500 font-bold">ท่าที่คืนตู้สินค้า (Return Place)</span><input name="returnPlace" value={formData.returnPlace} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">ท่าที่ตู้สินค้าขึ้นเรือ (POL)</span><input name="pol" value={formData.pol} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        <label><span className="block mb-1 text-slate-500 font-bold">ท่าเรือปลายทาง (POD)</span><input name="pod" value={formData.pod} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                    </div>

                    {/* Timing */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 col-span-1 md:col-span-2">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">Schedule Info</h4>
                                <div className="space-y-3">
                                    <label><span className="block mb-1 text-slate-500 font-bold">CY: Date and time</span><input name="cyDate" value={formData.cyDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Return: Date and time</span><input name="returnDate" value={formData.returnDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Closing time</span><input name="closingTime" value={formData.closingTime} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Paperless code</span><input name="paperlessCode" value={formData.paperlessCode} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">Voyage Info</h4>
                                <div className="space-y-3">
                                    <label><span className="block mb-1 text-slate-500 font-bold">ETD</span><input name="etd" value={formData.etd} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">ETA</span><input name="eta" value={formData.eta} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                </div>
                                
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3 mt-4 pt-4">Approval</h4>
                                <div className="space-y-3">
                                    <label><span className="block mb-1 text-slate-500 font-bold">Approved By</span><input name="approvedBy" value={formData.approvedBy} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Date</span><input name="approvedDate" value={formData.approvedDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold"><Save size={16}/> Save Confirmation</button>
            </div>
        </DraggableModal>
    );
}
