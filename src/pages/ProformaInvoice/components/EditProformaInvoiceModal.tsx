import React, { useState, useEffect } from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Save, Plus, Trash2, Info, CreditCard, List, FileText, Building2, Globe, Loader2 } from 'lucide-react';
import { FieldWithPreset } from '../../../components/shared/FieldWithPreset';
import Swal from 'sweetalert2';

const modalTabs = ['GENERAL INFORMATION', 'TRADE CONDITIONS', 'PDF PRINT FORMAT', 'ITEMS DATA', 'BANK DETAILS'];

const MOCK_PI_DATA = [
    {
        piNo: 'METC 03/2024',
        refNo: 'N/A',
        originalDate: '',
        rev: '1',
        seller: 'K.L. INTERFOOD CO., LTD.\n670/63 PHAHONYOTHIN RD, SAMSEANNAI, PHAYATHAI, BANGKOK 10400, THAILAND',
        buyer: 'MAY EXPORTS (THAILAND) CO., LTD.\n64/16 SOI SUKHUMVIT 20, SUKHUMVIT RD, , KLONG TOEY, BANGKOK 10110',
        consignee: 'SAME AS ABOVE',
        notifyParty: 'SAME AS ABOVE',
        totals: {
           fobBangkok: '90,642.00',
           freight: '0.00',
           insurance: '0.00',
           grandTotal: '90,642.00',
        },
        packaging: 'The cargo are packed by our standard packaging only. This contact does not apply for OEM term. Additional requirements such as stickers, the changes on packaging size and other changes are subject to additional cost which will be subject on this contract.\nThe extra cost is                                       USD',
        paymentTerm: '100% advance T/T payment within 3 days before loading cargo',
        deposit: '100%                 [APPROX.                                       USD ]',
        incoterm: 'EX-WORK',
        countryOfOrigin: 'THAILAND',
        shipmentMonth: '1 June 2024',
        portOfLoading: 'Bangkok Port, Thailand',
        portOfDischarge: 'Bangkok, Thailand',
        destination: 'Bangkok, Thailand',
        shippingDocuments: 'Standard shipping documents : Invoice, Packing List, Original BL, Certificate of Origin & Phytosanitary Certificate.\nAdditional documents :                                      , Extra cost (USD)',
        validity: 'This contract is valid 7 days from issueing date of this Proforma Invoice. The contract must be signed by authirized signature and company stamp withing the same period of time.',
        bankCharges: 'Bank charges outside thailand including intermediate are borne by buyer. Bank charges in thailand are on seller\'s responsibility.',
        bankName: 'THE SIAM COMMERCIAL BANK PUBLIC COMPANY LIMITED',
        branch: 'MUANGTHONG THANI',
        address: '453 BOND STREET ROAD,BAN MAI, PAK KRET, NONTHABURI 11120,THAILAND',
        accountName: 'K.L. INTERFOOD CO., LTD.',
        accountNo: '328 245705 5',
        swiftCode: 'SICOTHBK',
        shippingMarks: 'SAILING SEAS',
        quantityDescriptions: '1 X 40\' HIGH CUBE REEFER CONTAINER\n1) SWEET TAMARIND (A) SITHONG\n20 BOXES X 454 G /CARTON /N.W.         9.08 KGS.\n990 CARTONS/ N.W.                     8,989.20 KGS.',
        unitPrice: 'USD      31.50',
        amount: 'USD   31,185.00',
        items: []
    }
];

const BUYER_PRESETS = [
    'MAY EXPORTS (THAILAND) CO., LTD.\n64/16 SOI SUKHUMVIT 20, SUKHUMVIT RD, KLONG TOEY, BANGKOK 10110',
    'Global Foods Trading\n123 Market St, San Francisco, CA 94105, USA',
    'Pacific Mart\n456 Ocean Ave, Sydney NSW 2000, Australia',
    'CP All Public Co.\n119 Tara Sathorn, Bangkok, Thailand',
    'Makro Thailand\n1468 Phatthanakan Rd, Bangkok, Thailand',
    'Siam Export Co.\n789 Rama IV Rd, Bangkok, Thailand'
];

const SELLER_PRESETS = [
    'K.L. INTERFOOD CO., LTD.\n670/63 PHAHONYOTHIN RD, SAMSEANNAI, PHAYATHAI, BANGKOK 10400, THAILAND',
    'BANGKOK TAMARIND LTD. PART.\n124/46 BANG KHUNNON ROAD, BANG KHUNNON SUB-DISTRICT, BANGKOK NOI, BANGKOK 10700 THAILAND'
];

const CONSIGNEE_PRESETS = [
    'SAME AS ABOVE',
    'SERVENDI LDA\nSAME AS ABOVE',
    'TARIQ TRADERS\nGOOD LUCK TRADING\nOFFICE NO.1, VENUS PLAZA, LAHORE'
];

const NOTIFY_PARTY_PRESETS = [
    'SAME AS ABOVE',
    'AL MOIZ FOODSTUFF TRADING FZCO, DUBAI SILICON OASIS'
];

const INCOTERM_PRESETS = ['EX-WORK', 'FOB', 'CIF', 'CFR'];

const PAYMENT_PRESETS = [
    '100% advance T/T payment within 3 days before loading cargo',
    '30% Deposit, 70% against copy of BL',
    '100% L/C at sight'
];

const PORT_PRESETS = [
    'Bangkok Port, Thailand',
    'Laem Chabang, Thailand',
    'Chittagong, Bangladesh',
    'Rotterdam, Netherlands',
    'Los Angeles, U.S.A.',
    'Dubai, UAE'
];

const PACKAGING_PRESETS = [
    'The cargo are packed by our standard packaging only. This contact does not apply for OEM term. Additional requirements such as stickers, the changes on packaging size and other changes are subject to additional cost which will be subject on this contract.\nThe extra cost is                                       USD'
];

const COUNTRY_ORIGIN_PRESETS = ['THAILAND'];
const SHIPMENT_MONTH_PRESETS = ['June 2024', 'Prompt Shipment', 'Within 30 days after PI confirmed'];
const DEPOSIT_PRESETS = ['100%                 [APPROX.                                       USD ]', '30% Deposit', 'LC At Sight'];
const SHIPPING_DOCS_PRESETS = ['Standard shipping documents : Invoice, Packing List, Original BL, Certificate of Origin & Phytosanitary Certificate.\nAdditional documents :                                      , Extra cost (USD)'];
const VALIDITY_PRESETS = ['This contract is valid 7 days from issueing date of this Proforma Invoice. The contract must be signed by authirized signature and company stamp withing the same period of time.'];
const BANK_CHARGES_PRESETS = ['Bank charges outside thailand including intermediate are borne by buyer. Bank charges in thailand are on seller\'s responsibility.'];

const BANK_NAME_PRESETS = ['THE SIAM COMMERCIAL BANK PUBLIC COMPANY LIMITED'];
const BANK_BRANCH_PRESETS = ['MUANGTHONG THANI'];
const BANK_ADDR_PRESETS = ['453 BOND STREET ROAD,BAN MAI, PAK KRET, NONTHABURI 11120,THAILAND'];
const ACCOUNT_NAME_PRESETS = ['K.L. INTERFOOD CO., LTD.', 'BANGKOK TAMARIND LTD. PART.'];
const ACCOUNT_NO_PRESETS = ['328 245705 5', '328 245 696 0'];
const SWIFT_CODE_PRESETS = ['SICOTHBK'];

interface EditProformaInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export function EditProformaInvoiceModal({ isOpen, onClose, onSave, initialData }: EditProformaInvoiceModalProps) {
    const [activeTab, setActiveTab] = useState(modalTabs[0]);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                piNo: '', refNo: '', originalDate: '', rev: '1', seller: '', buyer: '', consignee: '', notifyParty: '',
                packaging: '', paymentTerm: '', deposit: '', incoterm: '', countryOfOrigin: '',
                shipmentMonth: '', portOfLoading: '', portOfDischarge: '', destination: '',
                shippingDocuments: '', validity: '', bankCharges: '', bankName: '', branch: '', address: '',
                accountName: '', accountNo: '', swiftCode: '',
                totals: { fobBangkok: '', freight: '', insurance: '', grandTotal: '' },
                items: []
            });
            setActiveTab(modalTabs[0]);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const [translating, setTranslating] = useState(false);

    const handleTranslateFields = async () => {
        setTranslating(true);
        try {
            const fieldsToTranslate = {
                quantityDescriptions: formData.quantityDescriptions || '',
                shippingMarks: formData.shippingMarks || '',
                packaging: formData.packaging || '',
                paymentTerm: formData.paymentTerm || '',
                items: (formData.items || []).map((item: any) => ({
                    productDescription: item.productDescription || '',
                    brand: item.brand || ''
                }))
            };

            const response = await fetch('/api/translate-shipping-fields', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fields: fieldsToTranslate,
                    destination: formData.destination || 'International Port',
                    targetLanguage: 'English'
                }),
            });

            const result = await response.json();
            if (result.success && result.data) {
                const translatedData = result.data;
                setFormData((prev: any) => {
                    const newItems = (prev.items || []).map((item: any, idx: number) => {
                        const translatedItem = translatedData.items?.[idx];
                        if (translatedItem) {
                            return {
                                ...item,
                                productDescription: translatedItem.productDescription || item.productDescription,
                                brand: translatedItem.brand || item.brand
                            };
                        }
                        return item;
                    });

                    return {
                        ...prev,
                        quantityDescriptions: translatedData.quantityDescriptions || prev.quantityDescriptions,
                        shippingMarks: translatedData.shippingMarks || prev.shippingMarks,
                        packaging: translatedData.packaging || prev.packaging,
                        paymentTerm: translatedData.paymentTerm || prev.paymentTerm,
                        items: newItems
                    };
                });
                
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Auto-translated documentation successfully!'
                });
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (err: any) {
            console.error('Translation error:', err);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            Toast.fire({
                icon: 'error',
                title: 'Unable to translate docs: ' + (err.message || 'offline fallback used')
            });
        } finally {
            setTranslating(false);
        }
    };
    
    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, totals: { ...prev.totals, [name]: value } }));
    };

    const handleAddItem = () => {
        setFormData((prev: any) => ({
            ...prev,
            items: [...(prev.items || []), {
                shipment: '', conNo: '', productDescription: '', itemCode: '', brand: '',
                nw: '', nwKg: '', packedW: '', packedWKg: '', gwKgCrt: '', qtyCarton: '',
                totalNwKg: '', totalGwKg: '', priceUsd: '', perCtn: '', fumigation: '', amountUsd: ''
            }]
        }));
    };

    const handleRemoveItem = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            items: prev.items.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        setFormData((prev: any) => {
            const newItems = [...(prev.items || [])];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const handleSelectPI = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPi = e.target.value;
        const piData = MOCK_PI_DATA.find(p => p.piNo === selectedPi);
        
        setFormData((prev: any) => ({
            ...prev,
            piNo: selectedPi,
            ...(piData || {})
        }));
    };

    return (
        <DraggableModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Proforma Invoice" : "New Proforma Invoice"} width="max-w-[1200px]">
            <div className="flex flex-col md:flex-row h-[70vh]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 bg-[#f8f9fa] border-r border-[#E5E7EB] flex flex-row md:flex-col overflow-x-auto md:overflow-visible shrink-0">
                    {modalTabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-5 py-3.5 text-left transition-all md:border-l-4 ${activeTab === tab ? 'border-b-4 md:border-b-0 border-[#f47729] bg-white text-[#091d38] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
                            <span className={`text-[11px] uppercase tracking-widest ${activeTab === tab ? 'text-[#f47729]' : ''}`}>
                                {tab}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white font-sans text-[12px]">
                    <div className="animate-fadeIn max-w-[1000px] mx-auto space-y-6">
                        {activeTab === 'GENERAL INFORMATION' && (
                            <>
                                <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200">
                                    <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3 flex items-center gap-2 uppercase text-[11px] tracking-wider"><Info size={16} className="text-[#f47729]"/> Header Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <label className="col-span-1 border-r pr-4">
                                            <span className="block mb-1 text-slate-500 font-bold text-[#ad7332]">PI NO. (Auto-Sync)</span>
                                            <select name="piNo" value={formData.piNo || ''} onChange={handleSelectPI} className="w-full border p-2 rounded input-field focus:ring-1 bg-white border-[#f47729]/30 focus:border-[#f47729]">
                                                <option value="">-- Select PI --</option>
                                                {MOCK_PI_DATA.map(pi => (
                                                    <option key={pi.piNo} value={pi.piNo}>{pi.piNo}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold uppercase">REF. NO.</span><input type="text" name="refNo" value={formData.refNo || ''} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white" /></label>
                                        <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold uppercase">Original Date</span><input type="text" name="originalDate" value={formData.originalDate || ''} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white" /></label>
                                        <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold uppercase">Rev.</span><input type="text" name="rev" value={formData.rev || ''} onChange={handleChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white" /></label>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200">
                                    <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3 flex items-center gap-2 uppercase text-[11px] tracking-wider"><Building2 size={16} className="text-[#f47729]"/> Parties</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FieldWithPreset label="SELLER" name="seller" value={formData.seller || ''} onChange={handleChange} type="textarea" storageKey="seller" defaultPresets={SELLER_PRESETS} />
                                        <FieldWithPreset label="BUYER" name="buyer" value={formData.buyer || ''} onChange={handleChange} type="textarea" storageKey="buyer" defaultPresets={BUYER_PRESETS} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <FieldWithPreset label="CONSIGNEE" name="consignee" value={formData.consignee || ''} onChange={handleChange} storageKey="consignee" defaultPresets={CONSIGNEE_PRESETS} />
                                        <FieldWithPreset label="NOTIFY PARTY" name="notifyParty" value={formData.notifyParty || ''} onChange={handleChange} storageKey="notifyParty" defaultPresets={NOTIFY_PARTY_PRESETS} />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'TRADE CONDITIONS' && (
                            <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3 flex items-center gap-2 uppercase text-[11px] tracking-wider"><CreditCard size={16} className="text-[#f47729]"/> Terms & Conditions</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <FieldWithPreset className="col-span-2" label="PACKAGING" name="packaging" value={formData.packaging || ''} onChange={handleChange} type="textarea" storageKey="packaging" defaultPresets={PACKAGING_PRESETS} />
                                    
                                    <FieldWithPreset label="PAYMENT TERM" name="paymentTerm" value={formData.paymentTerm || ''} onChange={handleChange} storageKey="paymentTerm" defaultPresets={PAYMENT_PRESETS} />
                                    <FieldWithPreset label="DEPOSIT" name="deposit" value={formData.deposit || ''} onChange={handleChange} storageKey="deposit" defaultPresets={DEPOSIT_PRESETS} />
                                    <FieldWithPreset label="INCOTERM" name="incoterm" value={formData.incoterm || ''} onChange={handleChange} storageKey="incoterm" defaultPresets={INCOTERM_PRESETS} />
                                    <FieldWithPreset label="COUNTRY OF ORIGIN" name="countryOfOrigin" value={formData.countryOfOrigin || ''} onChange={handleChange} storageKey="countryOrigin" defaultPresets={COUNTRY_ORIGIN_PRESETS} />
                                    <FieldWithPreset label="SHIPMENT MONTH" name="shipmentMonth" value={formData.shipmentMonth || ''} onChange={handleChange} storageKey="shipmentMonth" defaultPresets={SHIPMENT_MONTH_PRESETS} />
                                    <FieldWithPreset label="PORT OF LOADING" name="portOfLoading" value={formData.portOfLoading || ''} onChange={handleChange} storageKey="portLoading" defaultPresets={PORT_PRESETS} />
                                    <FieldWithPreset label="PORT OF DISCHARGE" name="portOfDischarge" value={formData.portOfDischarge || ''} onChange={handleChange} storageKey="portDischarge" defaultPresets={PORT_PRESETS} />
                                    <FieldWithPreset label="DESTINATION" name="destination" value={formData.destination || ''} onChange={handleChange} storageKey="destination" defaultPresets={PORT_PRESETS} />
                                </div>
                                <FieldWithPreset className="block mt-4" label="SHIPPING DOCUMENTS" name="shippingDocuments" value={formData.shippingDocuments || ''} onChange={handleChange} type="textarea" storageKey="shippingDocs" defaultPresets={SHIPPING_DOCS_PRESETS} />
                                <FieldWithPreset className="block mt-4" label="VALIDITY" name="validity" value={formData.validity || ''} onChange={handleChange} storageKey="validity" defaultPresets={VALIDITY_PRESETS} />
                                <FieldWithPreset className="block mt-4" label="BANK CHARGES" name="bankCharges" value={formData.bankCharges || ''} onChange={handleChange} storageKey="bankCharges" defaultPresets={BANK_CHARGES_PRESETS} />
                            </div>
                        )}

                        {activeTab === 'PDF PRINT FORMAT' && (
                            <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 space-y-4 max-w-full">
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3 flex items-center gap-2 uppercase text-[11px] tracking-wider"><FileText size={16} className="text-[#f47729]"/> Print Form Detail (New Format)</h4>
                                <div className="grid grid-cols-4 gap-4">
                                    <label className="col-span-1"><span className="block mb-1 text-slate-500 font-bold uppercase">SHIPPING MARKS</span><textarea name="shippingMarks" value={formData.shippingMarks || ''} onChange={handleChange} rows={10} className="w-full border p-2 rounded input-field focus:ring-1 resize-none bg-white font-mono" /></label>
                                    <label className="col-span-2"><span className="block mb-1 text-slate-500 font-bold uppercase">QUANTITY & DESCRIPTIONS</span><textarea name="quantityDescriptions" value={formData.quantityDescriptions || ''} onChange={handleChange} rows={10} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono bg-white" /></label>
                                    <div className="col-span-1 flex flex-col gap-4">
                                        <label><span className="block mb-1 text-slate-500 font-bold uppercase">UNIT PRICE</span><textarea name="unitPrice" value={formData.unitPrice || ''} onChange={handleChange} rows={4} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono bg-white" /></label>
                                        <label><span className="block mb-1 text-slate-500 font-bold uppercase">AMOUNT</span><textarea name="amount" value={formData.amount || ''} onChange={handleChange} rows={4} className="w-full border p-2 rounded input-field focus:ring-1 resize-none font-mono bg-white" /></label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4 border-t pt-4 items-center">
                                    <div className="col-span-3 text-right">
                                        <input type="text" name="totalAmountLabel" value={formData.totalAmountLabel || ''} onChange={handleChange} placeholder="TOTAL LABEL" className="w-64 border p-2 rounded input-field focus:ring-1 font-bold text-right bg-white" />
                                    </div>
                                    <div className="col-span-1">
                                        <input type="text" name="totalAmountValue" value={formData.totalAmountValue || ''} onChange={handleChange} placeholder="Total Amount" className="w-full border p-2 rounded input-field focus:ring-1 font-mono font-bold text-center bg-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                     <label><span className="block mb-1 text-slate-500 font-bold uppercase">FOB (BANGKOK)</span><input type="text" name="fobBangkok" value={formData.totals?.fobBangkok || ''} onChange={handleTotalChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white font-mono" /></label>
                                     <label><span className="block mb-1 text-slate-500 font-bold uppercase">FREIGHT</span><input type="text" name="freight" value={formData.totals?.freight || ''} onChange={handleTotalChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white font-mono" /></label>
                                     <label><span className="block mb-1 text-slate-500 font-bold uppercase">INSURANCE</span><input type="text" name="insurance" value={formData.totals?.insurance || ''} onChange={handleTotalChange} className="w-full border p-2 rounded input-field focus:ring-1 bg-white font-mono" /></label>
                                     <label><span className="block mb-1 text-slate-500 font-bold uppercase text-[#ad7332]">GRAND TOTAL</span><input type="text" name="grandTotal" value={formData.totals?.grandTotal || ''} onChange={handleTotalChange} className="w-full border p-2 rounded input-field focus:ring-1 font-bold bg-[#f47729]/10 border-[#f47729]/30 font-mono text-lg" /></label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ITEMS DATA' && (
                            <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-[#091d38] border-b pb-2 flex-1 flex items-center gap-2 uppercase text-[11px] tracking-wider"><List size={16} className="text-[#f47729]"/> Items Grid (Raw Data)</h4>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg max-w-[900px]">
                                    <table className="text-left border-collapse min-w-[2000px] text-[10px]">
                                        <thead className="bg-[#f0f0f0] text-[10px] uppercase font-bold text-slate-600">
                                            <tr>
                                                <th className="p-2 border-r w-10 text-center sticky left-0 bg-[#f0f0f0] z-10">Del</th>
                                                <th className="p-2 border-r">Shipment</th>
                                                <th className="p-2 border-r">Con. No.</th>
                                                <th className="p-2 border-r">Product Description</th>
                                                <th className="p-2 border-r">Item Code</th>
                                                <th className="p-2 border-r">Brand</th>
                                                <th className="p-2 border-r">N.W.</th>
                                                <th className="p-2 border-r">KG</th>
                                                <th className="p-2 border-r">Packed W.</th>
                                                <th className="p-2 border-r">KG</th>
                                                <th className="p-2 border-r">G.W. KG/CRT</th>
                                                <th className="p-2 border-r">QTY CARTON</th>
                                                <th className="p-2 border-r">Total N.W. KG</th>
                                                <th className="p-2 border-r">Total G.W. KG</th>
                                                <th className="p-2 border-r">Price USD</th>
                                                <th className="p-2 border-r">@/CTN</th>
                                                <th className="p-2 border-r">Fumigation</th>
                                                <th className="p-2">Amount USD</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(formData.items || []).map((item: any, idx: number) => (
                                                <tr key={idx} className="border-t hover:bg-white transition-colors bg-white group/row">
                                                    <td className="p-1 border-r text-center sticky left-0 bg-white group-hover/row:bg-slate-50 z-10">
                                                        <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 p-1.5 hover:bg-red-100 rounded transition-colors" title="Remove Item">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                    <td className="p-1 border-r"><input type="text" value={item.shipment || ''} onChange={(e) => handleItemChange(idx, 'shipment', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.conNo || ''} onChange={(e) => handleItemChange(idx, 'conNo', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r w-64"><input type="text" value={item.productDescription || ''} onChange={(e) => handleItemChange(idx, 'productDescription', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.itemCode || ''} onChange={(e) => handleItemChange(idx, 'itemCode', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.brand || ''} onChange={(e) => handleItemChange(idx, 'brand', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.nw || ''} onChange={(e) => handleItemChange(idx, 'nw', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.nwKg || ''} onChange={(e) => handleItemChange(idx, 'nwKg', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1 origin-center" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.packedW || ''} onChange={(e) => handleItemChange(idx, 'packedW', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.packedWKg || ''} onChange={(e) => handleItemChange(idx, 'packedWKg', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.gwKgCrt || ''} onChange={(e) => handleItemChange(idx, 'gwKgCrt', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.qtyCarton || ''} onChange={(e) => handleItemChange(idx, 'qtyCarton', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1 font-bold text-center" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.totalNwKg || ''} onChange={(e) => handleItemChange(idx, 'totalNwKg', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.totalGwKg || ''} onChange={(e) => handleItemChange(idx, 'totalGwKg', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.priceUsd || ''} onChange={(e) => handleItemChange(idx, 'priceUsd', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1 text-right text-green-700" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.perCtn || ''} onChange={(e) => handleItemChange(idx, 'perCtn', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1 border-r"><input type="text" value={item.fumigation || ''} onChange={(e) => handleItemChange(idx, 'fumigation', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1" /></td>
                                                    <td className="p-1"><input type="text" value={item.amountUsd || ''} onChange={(e) => handleItemChange(idx, 'amountUsd', e.target.value)} className="w-full border border-transparent hover:border-slate-300 p-1 rounded focus:border-[#f47729] focus:ring-1 font-bold text-right" /></td>
                                                </tr>
                                            ))}
                                            {(!formData.items || formData.items.length === 0) && (
                                                <tr><td colSpan={18} className="text-center p-8 text-slate-400 bg-white">No items added. Click + ADD ITEM ROW.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4">
                                    <button type="button" onClick={handleAddItem} className="px-4 py-2 flex items-center gap-2 bg-[#f47729] text-white rounded-lg hover:bg-[#d66620] text-[11px] font-bold shadow-sm transition-colors uppercase tracking-widest">
                                        <Plus size={16}/> Add Item Row
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'BANK DETAILS' && (
                            <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
                                <h4 className="font-bold text-[#091d38] border-b pb-2 mb-3 flex items-center gap-2 uppercase text-[11px] tracking-wider"><Building2 size={16} className="text-[#f47729]"/> Our Bank Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <FieldWithPreset label="BANK NAME" name="bankName" value={formData.bankName || ''} onChange={handleChange} storageKey="bankName" defaultPresets={BANK_NAME_PRESETS} />
                                    <FieldWithPreset label="BRANCH" name="branch" value={formData.branch || ''} onChange={handleChange} storageKey="bankBranch" defaultPresets={BANK_BRANCH_PRESETS} />
                                    <FieldWithPreset className="col-span-2" label="ADDRESS" name="address" value={formData.address || ''} onChange={handleChange} storageKey="bankAddr" defaultPresets={BANK_ADDR_PRESETS} />
                                    <FieldWithPreset label="ACCOUNT NAME" name="accountName" value={formData.accountName || ''} onChange={handleChange} storageKey="acctName" defaultPresets={ACCOUNT_NAME_PRESETS} />
                                    <FieldWithPreset label="ACCOUNT NO." name="accountNo" value={formData.accountNo || ''} onChange={handleChange} storageKey="acctNo" defaultPresets={ACCOUNT_NO_PRESETS} />
                                    <FieldWithPreset label="SWIFT CODE" name="swiftCode" value={formData.swiftCode || ''} onChange={handleChange} storageKey="swiftCode" defaultPresets={SWIFT_CODE_PRESETS} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-[#f8f9fa] shrink-0">
                <button
                    type="button"
                    onClick={handleTranslateFields}
                    disabled={translating}
                    className="mr-auto px-5 py-2.5 bg-orange-50 border border-[#f47729]/30 text-[#f47729] hover:bg-[#f47729] hover:text-white rounded-lg flex items-center gap-2 font-bold transition-all uppercase tracking-widest text-[11px] shadow-sm disabled:opacity-50"
                >
                    {translating ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />}
                    {translating ? 'Translating...' : 'AI Translate (EN/TH)'}
                </button>
                <button onClick={onClose} className="px-8 py-2.5 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-widest text-[11px]">Cancel</button>
                <button onClick={() => onSave(formData)} className="px-8 py-2.5 bg-[#091d38] text-white rounded-lg flex items-center gap-2 hover:bg-[#1a2d48] font-bold transition-colors uppercase tracking-widest text-[11px] shadow-sm"><Save size={16}/> Save Proforma</button>
            </div>
        </DraggableModal>
    );
}

