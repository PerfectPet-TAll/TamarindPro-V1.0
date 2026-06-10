import React from 'react';

interface Props {
    data: any;
    isPreview?: boolean;
}

export const LoadingNoticePrintTemplate: React.FC<Props> = ({ data, isPreview = false }) => {
    
    // Helper to generate company profile text
    const renderCompanyProfile = () => {
        if (data?.company === 'K.L.INTERFOOD') {
            return (
                <>
                    <div className="flex gap-2">
                        <div className="w-[100px] shrink-0">ชื่อบริษัท (ไทย):</div>
                        <div className="flex-1 font-bold">บริษัท เค.แอล.อินเตอร์ฟู้ด จำกัด</div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <div className="w-[100px] shrink-0">ที่อยู่ (ไทย) :</div>
                        <div className="flex-1">670/63 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400</div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <div className="w-[100px] shrink-0">ชื่อบริษัท (Eng):</div>
                        <div className="flex-1 font-bold">K.L. INTERFOOD CO., LTD.</div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <div className="w-[100px] shrink-0">ที่อยู่ (Eng) :</div>
                        <div className="flex-1">670/63 PHAHONYOTHIN ROAD, SAMSEANNAI, PHAYATHAI, BANGKOK 10400</div>
                    </div>
                    <div className="flex gap-2 mt-2 font-bold">
                        <div className="w-[180px] shrink-0">เลขประจำตัวผู้เสียภาษีอากร :</div>
                        <div className="flex-1">0105545115162</div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="flex gap-2">
                        <div className="w-[100px] shrink-0">ชื่อบริษัท (ไทย):</div>
                        <div className="flex-1 font-bold">ห้างหุ้นส่วนจำกัด บางกอกมะขามหวาน (สาขา 00001)</div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <div className="w-[100px] shrink-0">ที่อยู่ (ไทย) :</div>
                        <div className="flex-1">124/46 ถ.บางขุนนนท์ แขวงบางขุนนนท์ เขตบางกอกน้อย กรุงเทพฯ 10700</div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <div className="w-[100px] shrink-0">ชื่อบริษัท (Eng):</div>
                        <div className="flex-1 font-bold">BANGKOK TAMARIND LTD., PART. (BRANCH 00001)</div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <div className="w-[100px] shrink-0">ที่อยู่ (Eng) :</div>
                        <div className="flex-1">124/46 BANGKHUNNON ROAD, BANGKHUNNON,<br/>BANGKOKNOI, BANGKOK 10700</div>
                    </div>
                    <div className="flex gap-2 mt-2 font-bold mb-4">
                        <div className="w-[180px] shrink-0">เลขประจำตัวผู้เสียภาษีอากร :</div>
                        <div className="flex-1">0-1035-40003-65-6</div>
                    </div>
                </>
            );
        }
    };

    return (
        <div className={`print-template ${isPreview ? 'block relative p-4 sm:p-10 print:hidden shadow-xl' : 'hidden print:block print:absolute print:inset-0 z-[100000] p-10 print:p-0 print:m-0'} bg-white text-black w-full print:h-auto overflow-visible font-serif text-[15px] max-w-[210mm] mx-auto`} style={{ minHeight: '297mm' }}>
            <div className="max-w-[190mm] mx-auto mt-8 flex flex-col pt-8">
                
                {/* Title */}
                <h1 className="text-center text-[24px] font-bold mb-6">ใบแจ้งการขึ้นตู้</h1>

                {/* Header Info */}
                <div className="flex justify-between items-start mb-6 font-bold text-[16px]">
                    <div className="flex-1"></div>
                    <div className="flex gap-8">
                        <div>PI.{data?.piNo?.replace('PI.', '')}</div>
                        <div>PO.{data?.poNo?.replace('PO.', '')}</div>
                    </div>
                </div>

                {/* Company Profile Area */}
                <div className="mb-4 text-[14px]">
                    {renderCompanyProfile()}
                </div>

                {/* Form Data */}
                <div className="flex flex-col border-t border-black pt-4 gap-y-4 text-[14px]">
                    <div className="flex items-center">
                        <div className="w-[100px] font-bold shrink-0">วันที่ขึ้นตู้</div>
                        <div className="w-[200px] border-b border-black text-center border-dashed font-bold text-[#0000ff]">{data?.loadingDate}</div>
                        <div className="w-[150px] font-bold text-center shrink-0">BOOKING NO.</div>
                        <div className="flex-1 border-b border-black text-center font-bold">{data?.bookingNo}</div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-[120px] font-bold shrink-0">ใบสั่งผลิตเลขที่</div>
                        <div className="w-[160px] border-b border-black text-center">{data?.productionOrderNo}</div>
                        <div className="flex-1 flex gap-4 pl-4 font-bold">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border border-black flex items-center justify-center`}>
                                    {data?.company === 'K.L.INTERFOOD' && <div className="w-3 h-3 bg-black rounded-full" />}
                                </div>
                                K.L.INTERFOOD
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border border-black flex items-center justify-center`}>
                                    {data?.company === 'BANGKOK TAMARIND' && <div className="w-3 h-3 bg-black rounded-full" />}
                                </div>
                                BANGKOK TAMARIND
                            </label>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="w-[80px] font-bold shrink-0">ชนิดตู้</div>
                        <div className="w-[150px] flex flex-col gap-3">
                            <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border border-black flex items-center justify-center`}>
                                    {data?.containerType === '20 Dry' && <div className="w-3 h-3 bg-black rounded-full" />}
                                </div>
                                20 Dry
                            </label>
                            <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border border-black flex items-center justify-center`}>
                                    {data?.containerType === '20 Reefer' && <div className="w-3 h-3 bg-black rounded-full" />}
                                </div>
                                20 Reefer
                            </label>
                        </div>
                        <div className="flex-1 flex flex-col gap-3">
                            <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border border-black flex items-center justify-center`}>
                                    {data?.containerType === '40 HQ Dry' && <div className="w-3 h-3 bg-black rounded-full" />}
                                </div>
                                40 HQ Dry
                            </label>
                            <label className="flex items-center gap-2 font-bold cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border border-black flex items-center justify-center`}>
                                    {data?.containerType === '40 HQ Reefer' && <div className="w-3 h-3 bg-black rounded-full" />}
                                </div>
                                40 HQ Reefer
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center mt-2">
                        <div className="w-[80px] font-bold shrink-0">จำนวน</div>
                        <div className="w-[150px] border-b border-black text-center font-bold">{data?.quantity}</div>
                        <div className="w-[40px] font-bold text-center shrink-0">ตู้</div>
                        <div className="w-[130px] font-bold text-center shrink-0">CLOSING TIME</div>
                        <div className="flex-1 border-b border-black text-center font-bold text-[#0000ff]">{data?.closingTime}</div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-[80px] font-bold shrink-0">สินค้ายี่ห้อ</div>
                        <div className="w-[250px] border-b border-black text-center">{data?.brand}</div>
                        <div className="w-[100px] font-bold text-center shrink-0">TEMP /VENT</div>
                        <div className="flex-1 border-b border-black text-center">{data?.tempVent}</div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-[120px] font-bold shrink-0">ประเทศปลายทาง</div>
                        <div className="flex-1 border-b border-black pl-4">{data?.destinationCountry}</div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-[80px] font-bold shrink-0">หัวลาก</div>
                        <div className="w-[250px] border-b border-black text-center">{data?.transporter}</div>
                        <div className="w-[80px] font-bold text-center shrink-0">สายเรือ</div>
                        <div className="flex-1 border-b border-black text-center">{data?.carrier}</div>
                    </div>

                    {/* Pickup Container */}
                    <div className="flex items-center">
                        <div className="w-[80px] font-bold shrink-0">รับตู้วันที่</div>
                        <div className="w-[150px] border-b border-black text-center">{data?.pickupDate}</div>
                        <div className="w-[100px] font-bold text-center shrink-0">สถานที่รับตู้</div>
                        <div className="flex-1 border-b border-black pl-4 uppercase">{data?.pickupPlace}</div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-[80px] font-bold shrink-0">ติดต่อ</div>
                        <div className="w-[150px] border-b border-black pl-4">{data?.pickupContact}</div>
                        <div className="w-[80px] font-bold text-center shrink-0">TEL.</div>
                        <div className="flex-1 border-b border-black pl-4">{data?.pickupTel}</div>
                    </div>

                    {/* Return Container */}
                    <div className="flex items-center">
                        <div className="w-[80px] font-bold shrink-0">คืนตู้วันที่</div>
                        <div className="w-[150px] border-b border-black text-center">{data?.returnDate}</div>
                        <div className="w-[100px] font-bold text-center shrink-0">สถานที่คืนตู้</div>
                        <div className="w-[200px] border-b border-black pl-4 uppercase">{data?.returnPlace}</div>
                        <div className="w-[80px] font-bold text-center shrink-0">ก่อนเวลา</div>
                        <div className="flex-1 border-b border-black text-center font-bold text-[#0000ff] border-dashed">{data?.returnBefore}</div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-[80px] font-bold shrink-0">ติดต่อ</div>
                        <div className="w-[150px] border-b border-black pl-4">{data?.returnContact}</div>
                        <div className="w-[80px] font-bold text-center shrink-0">TEL.</div>
                        <div className="flex-1 border-b border-black pl-4">{data?.returnTel}</div>
                    </div>

                    {/* Packing */}
                    <div className="flex items-center border-b pb-4">
                        <div className="w-[120px] font-bold shrink-0">บรรจุสินค้าวันที่</div>
                        <div className="w-[120px] border-b border-black text-center">{data?.packingDate}</div>
                        <div className="w-[120px] font-bold text-center shrink-0">สถานที่บรรจุสินค้า</div>
                        <div className="flex-1 border-b border-black pl-4">{data?.packingPlace}</div>
                    </div>

                    {/* Approval section */}
                    <div className="flex items-center mt-2">
                        <div className="w-[80px] font-bold shrink-0 uppercase">Send By</div>
                        <div className="w-[200px] border-b border-black text-center uppercase">{data?.sendBy}</div>
                        <div className="w-[120px] font-bold text-center shrink-0 uppercase">Approved I</div>
                        <div className="flex-1 border-b border-black text-center uppercase">{data?.approvedBy}</div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-[80px] font-bold shrink-0 uppercase">Date</div>
                        <div className="w-[200px] border-b border-black text-center">{data?.sendDate}</div>
                        <div className="w-[120px] font-bold text-center shrink-0 uppercase">Date</div>
                        <div className="flex-1 border-b border-black text-center">{data?.approvedDate}</div>
                    </div>

                </div>

            </div>
        </div>
    );
}
