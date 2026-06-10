import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useAutoSync } from '../../../hooks/useAutoSync';

const MOCK_PI_DATA = [
    {
        piNo: 'ELST 08/2023',
        poNo: '002/09',
        product: 'Fresh / Dried Tamarind',
        consignee: 'EASTLAND FOOD CORPORATION\n8305 STAYTON DRIVE, SUITE C, JESSUP, MARYLAND\n20794, U.S.A',
        consigneeContact: 'Meena Prakrim (Meena)',
        consigneeEmail: 'meena@eastlandfood.com\n[send shipping documents to this address]',
        notifyParty: 'same as above',
        notifyPartyContact: 'same as above',
        pod: ': CHARLESTON, SC, U.S.A.'
    },
    {
        piNo: 'ELST 09/2023',
        poNo: '003/10',
        product: 'Canned Sweet Corn',
        consignee: 'WESTLAND TRADING INC.\n123 MAIN ST, NY 10001, U.S.A.',
        consigneeContact: 'John Doe',
        consigneeEmail: 'johndoe@westland.com',
        notifyParty: 'WESTLAND TRADING INC.',
        notifyPartyContact: 'John Doe',
        pod: ': NEW YORK, NY, U.S.A.'
    }
];

interface EditBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditBookingModal({ isOpen, onClose, onSave, initialData }: EditBookingModalProps) {
    const [formData, setFormData] = useState<any>({});
    const { syncByPINumber, isSyncing } = useAutoSync();

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                bookingNo: '', bookingDate: '',
                requestBy: '', requestTel: '', piNo: '', poNo: '',
                shipper: '', shipperContact: '', shipperMob: '', shipperTel: '', shipperEmail: '',
                consignee: '', consigneeContact: '', consigneeEmail: '', consigneeNotes: '',
                notifyParty: '', notifyPartyContact: '',
                scNo: '', fobAgent: '', fobContact: '', fobMob: '', fobTel: '', fobEmail: '',
                cnfShippingLine: '', cnfContact: '', cnfEmail: '',
                product: '', temp: '', pol: '', loadingDate: '',
                containerType: '', vent: '', pod: '', etd: '',
                freightRate: '', grossWeightLimit: '', pickupTime: '', returnTime: '', cutoffTime: '',
                remarks: ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Booking Request" : "New Booking Request"} width="max-w-[1000px]">
            <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh] custom-scrollbar text-[12px] font-sans">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">General Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <label><span className="block mb-1 text-slate-500 font-bold">Booking No.</span><input name="bookingNo" value={formData.bookingNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Booking Date</span><input name="bookingDate" value={formData.bookingDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Request By</span><input name="requestBy" value={formData.requestBy} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Request Tel</span><input name="requestTel" value={formData.requestTel} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
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
                            <label><span className="block mb-1 text-slate-500 font-bold">PO No.</span><input name="poNo" value={formData.poNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        </div>
                    </div>

                    {/* Shipper */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">Shipper Details</h4>
                        <label><span className="block mb-1 text-slate-500 font-bold">Shipper Info</span><textarea name="shipper" value={formData.shipper} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 h-20" /></label>
                        <div className="grid grid-cols-2 gap-3">
                            <label><span className="block mb-1 text-slate-500 font-bold">Contact</span><input name="shipperContact" value={formData.shipperContact} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Mobile</span><input name="shipperMob" value={formData.shipperMob} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Email</span><input name="shipperEmail" value={formData.shipperEmail} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                        </div>
                    </div>

                     {/* Consignee */}
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 col-span-1 md:col-span-2">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">Consignee & Notify Party</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label><span className="block mb-1 text-slate-500 font-bold">Consignee</span><textarea name="consignee" value={formData.consignee} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 h-16" /></label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <label><span className="block mb-1 text-slate-500 font-bold">Contact</span><input name="consigneeContact" value={formData.consigneeContact} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Email</span><input name="consigneeEmail" value={formData.consigneeEmail} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                </div>
                            </div>
                            <div>
                                <label><span className="block mb-1 text-slate-500 font-bold">Notify Party</span><textarea name="notifyParty" value={formData.notifyParty} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 h-16" /></label>
                                <label className="block mt-2"><span className="block mb-1 text-slate-500 font-bold">Notify Contact</span><input name="notifyPartyContact" value={formData.notifyPartyContact} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">FOB Term</h4>
                            <div className="space-y-3">
                                <label><span className="block mb-1 text-slate-500 font-bold">Service Contract</span><input name="scNo" value={formData.scNo} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">Agent</span><input name="fobAgent" value={formData.fobAgent} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label><span className="block mb-1 text-slate-500 font-bold">Contact</span><input name="fobContact" value={formData.fobContact} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Mob</span><input name="fobMob" value={formData.fobMob} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">CNF Term</h4>
                            <div className="space-y-3">
                                <label><span className="block mb-1 text-slate-500 font-bold">Shipping Line</span><input name="cnfShippingLine" value={formData.cnfShippingLine} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">Contact</span><input name="cnfContact" value={formData.cnfContact} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                <label><span className="block mb-1 text-slate-500 font-bold">Email</span><input name="cnfEmail" value={formData.cnfEmail} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            </div>
                        </div>
                    </div>

                    {/* Cargo & Logistics */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 col-span-1 md:col-span-2">
                        <h4 className="font-bold text-[#091d38] border-b pb-2">Cargo & Logistics Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label><span className="block mb-1 text-slate-500 font-bold">Product</span><input name="product" value={formData.product} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Container Type</span><input name="containerType" value={formData.containerType} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Temp.</span><input name="temp" value={formData.temp} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Vent.</span><input name="vent" value={formData.vent} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            
                            <label><span className="block mb-1 text-slate-500 font-bold">POL</span><input name="pol" value={formData.pol} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">POD</span><input name="pod" value={formData.pod} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">Loading Date</span><input name="loadingDate" value={formData.loadingDate} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                            <label><span className="block mb-1 text-slate-500 font-bold">ETD</span><input name="etd" value={formData.etd} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 text-blue-700" /></label>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 col-span-1 md:col-span-2">
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">Freight & Setup</h4>
                                <div className="space-y-3">
                                    <label><span className="block mb-1 text-slate-500 font-bold">Gross Wgt. Limit</span><input name="grossWeightLimit" value={formData.grossWeightLimit} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Pickup DD-Time</span><input name="pickupTime" value={formData.pickupTime} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Return DD-Time</span><input name="returnTime" value={formData.returnTime} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                    <label><span className="block mb-1 text-slate-500 font-bold">Cutoff Time</span><input name="cutoffTime" value={formData.cutoffTime} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1" /></label>
                                </div>
                             </div>
                             <div>
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3">Remarks & Extras</h4>
                                <label><span className="block mb-1 text-slate-500 font-bold">Remarks (Appears on form)</span><textarea name="remarks" value={formData.remarks} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 h-32" /></label>
                             </div>
                         </div>
                    </div>
                </div>

            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-6 py-2 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold"><Save size={16}/> Save Booking</button>
            </div>
        </DraggableModal>
    );
}
