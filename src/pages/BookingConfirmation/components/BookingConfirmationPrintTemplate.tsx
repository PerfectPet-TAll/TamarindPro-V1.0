import React from 'react';

interface Props {
    data: any;
    isPreview?: boolean;
}

export const BookingConfirmationPrintTemplate: React.FC<Props> = ({ data, isPreview = false }) => {
    return (
        <div className={`print-template ${isPreview ? 'block relative p-4 sm:p-10 print:hidden shadow-xl' : 'hidden print:block print:absolute print:inset-0 z-[100000] p-10 print:p-0 print:m-0'} bg-white text-black w-full print:h-auto overflow-visible font-sans max-w-[210mm] mx-auto`} style={{ minHeight: '297mm' }}>
            {/* Header */}
            <div className="text-center mb-10 pt-8">
                <h1 className="text-[18px] font-black underline underline-offset-4 tracking-wide font-serif">CHECK LIST FOR BOOKING CONFIRMATION</h1>
            </div>

            {/* General Info Table-like layout */}
            <div className="space-y-4 text-[14px] font-serif pl-8 pr-12 w-full max-w-[170mm] mx-auto">
                <div className="flex">
                    <div className="w-[200px] uppercase">PROFORMA INVOICE NO.</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 font-mono uppercase bg-transparent w-full">{data?.piNo}</div>
                </div>
                <div className="flex">
                    <div className="w-[200px] uppercase">ISSUE DATE</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 font-mono uppercase border-b border-black border-dashed min-h-[24px] pb-1">{data?.issueDate}</div>
                </div>
                <div className="flex">
                    <div className="w-[200px] uppercase">PRODUCT</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 font-mono border-b border-black border-dashed min-h-[24px] pb-1 uppercase">{data?.product}</div>
                </div>
                <div className="flex">
                    <div className="w-[200px] uppercase">CARRIER & BOOKING NO.</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 font-mono border-b border-black border-dashed min-h-[24px] pb-1 uppercase">{data?.bookingNo}</div>
                </div>
                <div className="flex">
                    <div className="w-[200px] uppercase">CONSIGNEE</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 font-mono border-b border-black border-dashed min-h-[24px] pb-1 uppercase">{data?.consignee}</div>
                </div>
                <div className="flex">
                    <div className="w-[200px] uppercase">COUNTRY</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="flex-1 font-mono border-b border-black border-dashed min-h-[24px] pb-1 uppercase">{data?.country}</div>
                </div>
            </div>

            {/* Terms */}
            <div className="mt-8 text-[14px] font-serif pl-8 pr-12 w-full max-w-[170mm] mx-auto">
                <div className="flex mb-4">
                    <div className="w-[100px] uppercase">TERM</div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                            <span className="border border-black w-3 h-3 flex items-center justify-center p-0.5">
                                {data?.term === 'Prepaid' && <span className="w-1.5 h-1.5 bg-black" />}
                            </span>
                            Prepaid
                        </label>
                        <label className="flex items-center gap-2">
                            <span className="border border-black w-3 h-3 flex items-center justify-center p-0.5">
                                {data?.term === 'Collect' && <span className="w-1.5 h-1.5 bg-black" />}
                            </span>
                            Collect
                        </label>
                        <label className="flex items-center gap-2">
                            <span className="border border-black w-3 h-3 flex items-center justify-center p-0.5">
                                {data?.term === 'Prepaid at destination' && <span className="w-1.5 h-1.5 bg-black" />}
                            </span>
                            Prepaid at destination
                        </label>
                    </div>
                </div>

                <div className="flex mt-2 items-end">
                    <div className="w-[100px] uppercase">Freight USD</div>
                    <div className="w-[20px] text-center">:</div>
                    <div className="w-[250px] border-b border-black font-mono ml-2 pb-1 text-center">{data?.freightUsd}</div>
                </div>
            </div>

            {/* Container Details */}
            <div className="mt-8 text-[14px] font-serif pl-8 pr-12 w-full max-w-[170mm] mx-auto space-y-3">
                <div className="flex justify-between w-full">
                    <div className="flex w-1/2 items-end">
                        <span className="border border-black w-3 h-3 inline-block relative top-[10px] mr-2 text-center text-[10px] pb-1 font-mono">{data?.volume ? '✓' : ''}</span>
                        <div className="w-[80px]">Volume</div>
                        <div className="flex-1 border-b border-black min-h-[24px] uppercase font-mono px-2 text-center pb-0.5">{data?.volume}</div>
                    </div>
                    <div className="flex w-1/2 items-end pl-8">
                        <span className="border border-black w-3 h-3 inline-block relative top-[10px] mr-2 text-center text-[10px] pb-1 font-mono">{data?.temperature ? '✓' : ''}</span>
                        <div className="w-[100px]">Temperature</div>
                        <div className="flex-1 border-b border-black min-h-[24px] uppercase font-mono px-2 text-center pb-0.5">{data?.temperature}</div>
                    </div>
                </div>
                
                <div className="flex justify-between w-full mt-4">
                    <div className="flex w-1/2 items-end">
                        <span className="border border-black w-3 h-3 inline-block relative top-[10px] mr-2 text-center text-[10px] pb-1 font-mono">{data?.humidity ? '✓' : ''}</span>
                        <div className="w-[80px]">Humidity</div>
                        <div className="flex-1 border-b border-black min-h-[24px] uppercase font-mono px-2 text-center pb-0.5">{data?.humidity}</div>
                    </div>
                    <div className="flex w-1/2 items-end pl-8">
                        <span className="border border-black w-3 h-3 inline-block relative top-[10px] mr-2 text-center text-[10px] pb-1 font-mono">{data?.ventilation ? '✓' : ''}</span>
                        <div className="w-[100px]">Ventilation</div>
                        <div className="flex-1 border-b border-black min-h-[24px] uppercase font-mono px-2 text-center pb-0.5">{data?.ventilation}</div>
                    </div>
                </div>

                <div className="mt-8 space-y-4 max-w-[650px]">
                    <div className="flex items-end">
                        <span className="border border-black w-3 h-3 inline-flex relative top-[1px] mr-2 items-center justify-center text-[10px] font-mono">{data?.returnPlace ? '✓' : ''}</span>
                        <div className="w-[200px]">ท่าที่คืนตู้สินค้า (Return Place)</div>
                        <div className="w-[20px] text-center">:</div>
                        <div className="flex-1 border-b border-black min-h-[24px] pb-0.5 uppercase font-mono px-2">{data?.returnPlace}</div>
                    </div>
                    <div className="flex items-end">
                        <span className="border border-black w-3 h-3 inline-flex relative top-[1px] mr-2 items-center justify-center text-[10px] font-mono">{data?.pol ? '✓' : ''}</span>
                        <div className="w-[200px]">ท่าที่ตู้สินค้าขึ้นเรือ(POL)</div>
                        <div className="w-[20px] text-center">:</div>
                        <div className="flex-1 border-b border-black min-h-[24px] pb-0.5 uppercase font-mono px-2">{data?.pol}</div>
                    </div>
                    <div className="flex items-end">
                        <span className="border border-black w-3 h-3 inline-flex relative top-[1px] mr-2 items-center justify-center text-[10px] font-mono">{data?.pod ? '✓' : ''}</span>
                        <div className="w-[200px]">ท่าเรือปลายทาง(POD)</div>
                        <div className="w-[20px] text-center">:</div>
                        <div className="flex-1 border-b border-black min-h-[24px] pb-0.5 uppercase font-mono px-2">{data?.pod}</div>
                    </div>
                    <div className="flex items-end mt-6">
                        <span className="border border-black w-3 h-3 inline-flex relative top-[1px] mr-2 items-center justify-center text-[10px] font-mono">{data?.cyDate ? '✓' : ''}</span>
                        <div className="w-[200px]">CY: Date and time</div>
                        <div className="w-[20px] text-center">:</div>
                        <div className="flex-1 border-b border-black min-h-[24px] pb-0.5 uppercase font-mono px-2">{data?.cyDate}</div>
                    </div>
                    <div className="flex items-end">
                        <span className="border border-black w-3 h-3 inline-flex relative top-[1px] mr-2 items-center justify-center text-[10px] font-mono">{data?.returnDate ? '✓' : ''}</span>
                        <div className="w-[200px]">Return: Date and time</div>
                        <div className="w-[20px] text-center">:</div>
                        <div className="flex-1 border-b border-black min-h-[24px] pb-0.5 uppercase font-mono px-2">{data?.returnDate}</div>
                    </div>
                    <div className="flex items-end">
                        <span className="border border-black w-3 h-3 inline-flex relative top-[1px] mr-2 items-center justify-center text-[10px] font-mono">{data?.closingTime ? '✓' : ''}</span>
                        <div className="w-[200px]">Closing time</div>
                        <div className="w-[20px] text-center">:</div>
                        <div className="flex-1 border-b border-black min-h-[24px] pb-0.5 uppercase font-mono px-2">{data?.closingTime}</div>
                    </div>
                    <div className="flex items-end">
                        <span className="border border-black w-3 h-3 inline-flex relative top-[1px] mr-2 items-center justify-center text-[10px] font-mono">{data?.paperlessCode ? '✓' : ''}</span>
                        <div className="w-[200px]">Paperless code</div>
                        <div className="w-[20px] text-center">:</div>
                        <div className="flex-1 border-b border-black min-h-[24px] pb-0.5 uppercase font-mono px-2">{data?.paperlessCode}</div>
                    </div>
                </div>
            </div>

            {/* ETD / ETA / Approval Section */}
            <div className="mt-16 text-[14px] font-serif pl-8 w-full max-w-[170mm] mx-auto">
                <div className="flex justify-between w-[80%] mx-auto mb-16">
                    <div className="flex w-1/2 items-end justify-center pr-4 border-r border-transparent">
                        <span className="border border-black w-3 h-3 inline-block relative top-[1px] mr-2 text-center text-[10px] font-mono">{data?.etd ? '✓' : ''}</span>
                        <div className="w-12 font-bold px-1">ETD</div>
                        <div className="flex-1 border-b border-black uppercase font-mono text-center pb-0.5">{data?.etd}</div>
                    </div>
                    <div className="flex w-1/2 items-end justify-center pl-8">
                        <span className="border border-black w-3 h-3 inline-block relative top-[1px] mr-2 text-center text-[10px] font-mono">{data?.eta ? '✓' : ''}</span>
                        <div className="w-12 font-bold px-1">ETA</div>
                        <div className="flex-1 border-b border-black uppercase font-mono text-center pb-0.5">{data?.eta}</div>
                    </div>
                </div>

                <div className="flex justify-between w-[90%] mx-auto mt-20">
                    <div className="w-1/2 px-4 text-center">
                        <div className="border-b border-black uppercase font-mono min-h-[24px] pb-1">{data?.approvedBy}</div>
                        <div className="mt-2">Approved By</div>
                    </div>
                    <div className="w-1/2 px-4 pl-12 text-center">
                        <div className="border-b border-black uppercase font-mono min-h-[24px] pb-1">{data?.approvedDate}</div>
                        <div className="mt-2">Date</div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
