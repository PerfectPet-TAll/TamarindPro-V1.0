import React from 'react';

interface Props {
    data: any;
    isPreview?: boolean;
}

export const CommercialInvoicePrintTemplate: React.FC<Props> = ({ data, isPreview = false }) => {
    return (
        <div className={`print-template ${isPreview ? 'block relative p-4 sm:p-10 print:hidden shadow-xl' : 'hidden print:block print:absolute print:inset-0 z-[100000] p-10 print:p-0 print:m-0'} bg-white text-black w-full print:h-auto overflow-visible font-serif text-[13px] max-w-[210mm] mx-auto`} style={{ minHeight: '297mm' }}>
            <div className="max-w-[190mm] mx-auto mt-8 flex flex-col pt-8">
                
                {/* Header */}
                <div className="flex border-b border-black pb-4 mb-2">
                    <div className="w-[120px] shrink-0 border border-black h-[100px] flex items-center justify-center mr-6">
                        <span className="text-[50px] font-black italic tracking-tighter" style={{ fontFamily: 'serif' }}>KL</span>
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                        <h2 className="font-bold text-[18px]">K.L.INTERFOOD CO., LTD.</h2>
                        <p className="tracking-wide">670/63 Phahonyothin Road, Samseannai, Phayathai, Bangkok 10400, Thailand</p>
                        <p className="tracking-wide">Tel : 662-981-7731-2, 981-7737 Fax : Ext.12  E-mail : klfood@cscoms.com</p>
                    </div>
                </div>

                <div className="text-center font-bold tracking-widest uppercase mb-4 text-[14px]">
                    COMMERCIAL INVOICE
                </div>

                {/* ORIGINAL Watermark Text */}
                <div className="absolute top-[180px] right-20 opacity-30 text-[40px] tracking-widest font-sans font-bold transform -rotate-12 pointer-events-none">
                    ORIGINAL
                </div>

                {/* Header Info */}
                <div className="flex flex-col gap-1 mb-4 uppercase">
                    <div className="flex"><span className="w-[150px]">CUSTOMER REF.</span> : {data?.customerRef}</div>
                    <div className="flex"><span className="w-[150px]">P I NO.</span> : {data?.piNo}</div>
                    <div className="flex"><span className="w-[150px]">P.O.NO.</span> : {data?.poNo}</div>
                </div>

                {/* Parties */}
                <div className="flex mb-4 uppercase">
                    <div className="w-[150px] font-bold">BENEFICIARY</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 whitespace-pre-wrap">{data?.beneficiary}</div>
                </div>
                <div className="flex mb-4 uppercase">
                    <div className="w-[150px] font-bold">CONSIGNEE</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 whitespace-pre-wrap">{data?.consignee}</div>
                </div>
                <div className="flex mb-8 uppercase">
                    <div className="w-[150px] font-bold">NOTIFY PARTY</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 whitespace-pre-wrap">{data?.notifyParty}</div>
                </div>

                {/* Logistics & Invoice Info */}
                <div className="flex justify-between mb-8 uppercase text-[12.5px]">
                    <div className="flex flex-col gap-2 w-1/2">
                        <div className="flex"><span className="w-[120px]">TERM</span> : {data?.term}</div>
                        <div className="flex"><span className="w-[120px]">VESSEL</span> : {data?.vessel}</div>
                    </div>
                    <div className="flex flex-col gap-2 w-1/2 pl-8">
                        <div className="flex"><span className="w-[100px]">INVOICE NO.</span> : {data?.invoiceNo}</div>
                        <div className="flex"><span className="w-[100px]">DATE</span> : {data?.invoiceDate}</div>
                        <div className="flex"><span className="w-[100px]">FROM</span> : {data?.fromStr}</div>
                        <div className="flex"><span className="w-[100px]">TO</span> : {data?.toStr}</div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="border-t border-b border-black py-2 flex text-center font-bold uppercase text-[12px]">
                    <div className="w-[120px] text-left">SHIPPING MARKS</div>
                    <div className="flex-1 text-center pr-12">QUANTITY & DESCRIPTIONS</div>
                    <div className="w-[120px] flex flex-col items-center">
                        <span>UNIT PRICE</span>
                        <span className="font-normal text-[11px]">(PER CARTON)</span>
                    </div>
                    <div className="w-[120px] flex flex-col items-center">
                        <span>AMOUNT</span>
                        <span className="font-normal text-[11px]">(USD)</span>
                    </div>
                </div>

                <div className="flex pt-4 min-h-[220px]">
                    <div className="w-[120px] whitespace-pre-wrap text-[13px]">{data?.shippingMarks}</div>
                    <div className="flex-1 pl-2 whitespace-pre-wrap font-mono uppercase text-[12px]">{data?.quantityDescriptions}</div>
                    <div className="w-[120px] text-center justify-start flex pl-4 whitespace-pre-wrap font-mono text-[12px]">{data?.unitPrice}</div>
                    <div className="w-[120px] text-right whitespace-pre-wrap font-mono pr-4 text-[12px]">{data?.amount}</div>
                </div>

                {/* Bank Detail */}
                <div className="mb-4 text-[12px] font-bold uppercase">
                    <div className="underline underline-offset-2 mb-2">BANK DETAIL :</div>
                    <div className="whitespace-pre-wrap font-normal leading-relaxed">{data?.bankDetail}</div>
                </div>

                {/* Totals */}
                <div className="flex justify-end pt-4 pb-4 border-t border-b border-black mb-4 items-center">
                    <div className="font-bold mr-8 uppercase">{data?.totalAmountLabel}</div>
                    <div className="w-[150px] text-right font-mono pr-4 font-bold border-b-2 border-black border-double uppercase h-8 flex items-center justify-end">{data?.totalAmountValue}</div>
                </div>

                {/* Footer Texts */}
                <div className="flex mb-2 uppercase text-[12px]">
                    <div className="w-[150px] font-bold">TOTAL</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 whitespace-pre-wrap leading-relaxed">{data?.totalText}</div>
                </div>
                <div className="flex mb-2 uppercase text-[12px]">
                    <div className="w-[150px] font-bold">INSPECTION</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 whitespace-pre-wrap leading-relaxed">{data?.inspection}</div>
                </div>
                <div className="flex mb-8 uppercase text-[12px] pb-4 border-b-2 border-slate-300">
                    <div className="w-[150px] font-bold">ORIGIN</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 whitespace-pre-wrap leading-relaxed">{data?.origin}</div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end mt-2 mb-16">
                    <div className="flex flex-col gap-1 w-1/2 relative text-[11px]">
                        <div className="font-bold italic text-lg opacity-80 mb-1">N. An</div>
                        <div className="font-bold">SARINI CHUNDI</div>
                        <div className="font-bold italic">FINANCIAL</div>
                        <div className="h-8 mt-1 font-black text-2xl italic tracking-tighter opacity-80">N. An</div>
                        <div className="uppercase">CHANIKA NANTAWANICH</div>
                        <div className="uppercase">INTERNATIONAL MARKETING OFFICER</div>
                    </div>
                    <div className="flex flex-col items-center justify-center relative pl-8 pb-10 w-1/2 text-center uppercase text-[12px]">
                        {/* Stamp placeholder */}
                        <div className="absolute top-[-80px] left-8 w-[100px] h-[100px] border-4 border-slate-200 rounded-full flex items-center justify-center opacity-20 transform -rotate-12">
                            <span className="text-3xl font-serif">KL</span>
                        </div>
                        <div className="mb-2">K.L.INTERFOOD CO., LTD.</div>
                        <div className="mb-2">NONGLAK KULSETSOPHON</div>
                        <div>DIRECTOR</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
