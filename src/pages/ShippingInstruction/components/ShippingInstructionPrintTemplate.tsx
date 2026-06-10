import React from 'react';

interface Props {
    data: any;
    isPreview?: boolean;
}

export const ShippingInstructionPrintTemplate: React.FC<Props> = ({ data, isPreview = false }) => {
    return (
        <div className={`print-template ${isPreview ? 'block relative p-4 sm:p-10 print:hidden shadow-xl' : 'hidden print:block print:absolute print:inset-0 z-[100000] p-10 print:p-0 print:m-0'} bg-white text-black w-full print:h-auto overflow-visible font-serif text-[12px] max-w-[210mm] mx-auto`} style={{ minHeight: '297mm' }}>
            <div className="border border-black max-w-[190mm] mx-auto mt-8 flex flex-col">
                
                {/* Header Row */}
                <div className="p-4 border-b border-black flex flex-col gap-2 relative">
                    <div className="font-bold">
                        <span className="w-24 inline-block">DATE</span><span className="mr-2">:</span>{data?.docDate}
                    </div>
                    <div className="font-bold">
                        <span className="w-24 inline-block">BOOKING NO</span><span className="mr-2">:</span>{data?.bookingNo}
                    </div>
                    <div className="absolute w-full left-0 bottom-4 text-center">
                        <span className="uppercase font-bold underline underline-offset-4 tracking-wider text-[14px]">SHIPPING INSTRUCTION</span>
                    </div>
                </div>

                {/* Second Row */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 border-r border-black p-2 pr-4 flex">
                        <div className="font-bold w-20 shrink-0">Shipper:</div>
                        <div className="flex-1 whitespace-pre-wrap leading-relaxed">{data?.shipper}</div>
                    </div>
                    <div className="w-1/2 p-2 pr-4 flex">
                        <div className="font-bold w-14 shrink-0">From:</div>
                        <div className="flex-1 whitespace-pre-wrap leading-relaxed">{data?.fromStr}</div>
                    </div>
                </div>

                {/* Third Row */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 border-r border-black p-2 pr-4 flex items-start min-h-[60px]">
                        <div className="font-bold w-20 shrink-0">Consignee:</div>
                        <div className="flex-1 whitespace-pre-wrap leading-tight">{data?.consignee}</div>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <div className="p-2 border-b border-black flex min-h-[40px] items-start">
                            <div className="font-bold w-14 shrink-0">To :</div>
                            <div className="flex-1 whitespace-pre-wrap leading-tight">{data?.toStr}</div>
                        </div>
                        <div className="p-2 flex min-h-[30px] items-center">
                            <div className="font-bold w-14 shrink-0">Feeder :</div>
                            <div className="flex-1">{data?.feeder}</div>
                        </div>
                    </div>
                </div>

                {/* Fourth Row */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 border-r border-black p-2 pr-4 flex items-start">
                        <div className="font-bold w-24 shrink-0">Notify party:</div>
                        <div className="flex-1 whitespace-pre-wrap leading-tight">{data?.notifyParty}</div>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <div className="p-2 border-b border-black flex min-h-[40px]">
                            <div className="font-bold w-28 shrink-0">Mother Vessel :</div>
                            <div className="flex-1 whitespace-pre-wrap leading-tight">{data?.motherVessel}</div>
                        </div>
                        <div className="p-2 border-b border-black flex flex-col min-h-[40px]">
                            <div className="font-bold">Place of receipt</div>
                            <div className="text-center mt-1 uppercase">{data?.placeOfReceipt}</div>
                        </div>
                        <div className="p-2 flex flex-col min-h-[40px]">
                            <div className="font-bold">Port of loading</div>
                            <div className="text-center mt-1 uppercase">{data?.portOfLoading}</div>
                        </div>
                    </div>
                </div>

                {/* Fifth Row */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 border-r border-black p-2 flex flex-col min-h-[40px]">
                        <div className="font-bold">Place of delivery</div>
                        <div className="text-center mt-1 uppercase">{data?.placeOfDelivery}</div>
                    </div>
                    <div className="w-1/2 p-2 flex flex-col min-h-[40px]">
                        <div className="font-bold">Port of discharge</div>
                        <div className="text-center mt-1 uppercase">{data?.portOfDischarge}</div>
                    </div>
                </div>

                {/* Particulars Section */}
                <div className="border-b border-black p-1 text-center font-bold">
                    PARTICULARS FURNISHED BY SHIPPER
                </div>
                
                <div className="w-full flex-1 min-h-[300px] flex flex-col pt-2 pb-6 px-2">
                    <div className="w-full table border-collapse">
                        <div className="table-header-group font-bold text-center border-b border-black">
                            <div className="table-row px-2">
                                <div className="table-cell px-2 py-1 w-[20%] text-left align-top">MARK AND NUMBER</div>
                                <div className="table-cell px-2 py-1 w-[15%] text-left align-top">QUANTITIES</div>
                                <div className="table-cell px-2 py-1 w-[35%] align-top text-center pb-2">
                                    <div className="w-full text-center">DESCRIPTION OF GOODS</div>
                                </div>
                                <div className="table-cell px-2 py-1 w-[15%] align-top text-center pb-2">
                                    <div className="w-full text-center border-b border-transparent">GROSS WEIGHT</div>
                                    <div className="w-full text-center mt-1">KGS</div>
                                </div>
                                <div className="table-cell px-2 py-1 w-[15%] align-top text-center pb-2">
                                    <div className="w-full text-center border-b border-transparent">MEASUREMENT</div>
                                    <div className="w-full text-center mt-1">CBM</div>
                                </div>
                            </div>
                        </div>

                        <div className="table-row-group text-center">
                            <div className="table-row mt-4">
                                <div className="table-cell px-2 py-4 align-top whitespace-pre-wrap text-left break-words">{data?.marksAndNumbers}</div>
                                <div className="table-cell px-2 py-4 align-top whitespace-pre-wrap text-left">{data?.quantities}</div>
                                <div className="table-cell px-2 py-4 align-top whitespace-pre-wrap text-left">{data?.descriptionOfGoods}</div>
                                <div className="table-cell px-2 py-4 align-top whitespace-pre-wrap font-mono uppercase">{data?.grossWeight}</div>
                                <div className="table-cell px-2 py-4 align-top whitespace-pre-wrap font-mono uppercase">{data?.measurement}</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Container / Seal */}
                    <div className="mt-8 flex justify-between pr-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex">
                                <span className="w-24">CONTAINER NO. :</span>
                                <span className="uppercase">{data?.containerNo}</span>
                            </div>
                            <div className="flex">
                                <span className="w-24">SEAL NO. :</span>
                                <span className="uppercase">{data?.sealNo}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-end">
                            <div className="font-bold text-[14px]">
                                HS CODE : {data?.hsCode}
                            </div>
                        </div>
                    </div>
                    
                    {/* Notes Footer */}
                    <div className="mt-12 w-full text-center flex flex-col gap-2 font-bold whitespace-pre-wrap">
                        {data?.note}
                    </div>
                </div>

            </div>
        </div>
    );
}
