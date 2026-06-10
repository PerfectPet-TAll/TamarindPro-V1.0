import React from 'react';

interface Props {
    data: any;
    isPreview?: boolean;
}

export const ProformaInvoicePrintTemplate: React.FC<Props> = ({ data, isPreview = false }) => {
    const sellerLines = data?.seller ? data.seller.split('\n') : [];
    const sellerName = sellerLines[0] || 'BANGKOK TAMARIND LTD. PART.';
    const sellerAddr = sellerLines.slice(1).join(', ') || '58/76 MOO 3 KHLONG KLUEA, PAKKRET, 11120 NONTHABURI, THAILAND';

    return (
        <div className={`print-template ${isPreview ? 'block relative p-4 print:hidden shadow-xl' : 'hidden print:block print:absolute print:inset-0 z-[100000] p-0 print:p-0 print:m-0'} bg-white text-black w-full overflow-visible font-serif text-[11px] max-w-[210mm] mx-auto leading-tight`} style={{ minHeight: '297mm' }}>
            {/* Page 1 */}
            <div className="max-w-[190mm] mx-auto flex flex-col pt-[10mm] min-h-[297mm] pb-4">
                
                {/* Header */}
                <div className="w-full text-center mb-1">
                    <h2 className="font-bold text-[13px] mb-1 uppercase">{sellerName}</h2>
                    <p className="text-[10px] uppercase font-semibold">{sellerAddr}</p>
                    <p className="text-[10px]">TEL: 66 2 9817731 - 2, 66 2 9817737, Fax: Please Dial 12, E-mail: amy@tamarindkl.com, www.tamarindkl.com</p>
                </div>
                
                <div className="border-b-[1.5px] border-[#8a3324] w-full mb-2"></div>
                <h1 className="font-bold text-[15px] text-center tracking-wide mb-1">MASTER PROFORMA INVOICE / SALE CONTRACT</h1>
                
                {/* Dates */}
                <div className="flex justify-end mb-2">
                    <div className="flex flex-col border border-black w-48 bg-[#f9f9f9]">
                        <div className="flex border-b border-black">
                            <div className="w-24 text-right pr-2 font-bold py-0.5 text-[10px]">Original Date :</div>
                            <div className="flex-1 bg-white px-2 py-0.5 text-[10px]">{data?.originalDate}</div>
                        </div>
                        <div className="flex">
                            <div className="w-24 text-right pr-2 font-bold py-0.5 text-[10px]">Rev.:</div>
                            <div className="flex-1 bg-white px-2 py-0.5 text-[10px]">{data?.rev}</div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-[180px_10px_1fr] text-[10.5px] gap-y-[3px] mb-3 font-bold uppercase items-start leading-snug">
                    <div>REF. NO.</div><div>:</div><div>{data?.refNo}</div>
                    <div>PI / SALES CONTRACT NO.</div><div>:</div><div>{data?.piNo}</div>
                    <div>SELLER</div><div>:</div><div className="whitespace-pre-wrap">{data?.seller}</div>
                    
                    {/* Spacer / grey background style like in PDF for BUYER row if needed, here just mapped */}
                    <div className="col-span-3 h-1"></div>
                    <div className="col-span-3 bg-[#f2f2f2] -mx-1 px-1 grid grid-cols-[180px_10px_1fr] py-0.5">
                        <div className="font-bold">BUYER</div><div>:</div><div className="whitespace-pre-wrap font-bold">{data?.buyer}</div>
                    </div>
                    
                    <div>CONSIGNEE</div><div>:</div><div className="whitespace-pre-wrap">{data?.consignee}</div>
                    <div>NOTIFY PARTY</div><div>:</div><div className="whitespace-pre-wrap">{data?.notifyParty}</div>
                </div>

                <div className="font-bold italic text-[9.5px] mb-1">WE HEREBY CONFIRM SELLING TO YOU THE PRODUCT AS PER TERMS & CONDITIONS STATED HEREUNDER :</div>

                {/* Complex Table Header */}
                <table className="w-full text-center border-collapse border border-black mb-0 text-[8px] leading-tight font-serif uppercase table-fixed">
                    <thead>
                        <tr className="bg-[#f0f0f0]">
                            <th rowSpan={2} className="border border-black font-normal w-[45px]">SHIPMENT</th>
                            <th rowSpan={2} className="border border-black font-normal w-[25px]">CON<br/>NO.</th>
                            <th rowSpan={2} className="border border-black font-normal w-[90px]">PRODUCT<br/>DESCRIPTION</th>
                            <th rowSpan={2} className="border border-black font-normal w-[40px]">Item Code</th>
                            <th rowSpan={2} className="border border-black font-normal w-[40px]">BRAND</th>
                            <th colSpan={2} className="border border-black font-normal">N.W. PACKING/CRT</th>
                            <th colSpan={2} className="border border-black font-normal">PACKED W. WITH<br/>INNER BOX</th>
                            <th rowSpan={2} className="border border-black font-normal w-[35px]">G.W.<br/>KG/CRT</th>
                            <th rowSpan={2} className="border border-black font-normal w-[40px]">QTY<br/>CARTON</th>
                            <th rowSpan={2} className="border border-black font-normal w-[40px]">TOTAL<br/>N.W. KG</th>
                            <th rowSpan={2} className="border border-black font-normal w-[40px]">TOTAL<br/>G.W. KG</th>
                            <th rowSpan={2} className="border border-black font-normal w-[40px]">PRICE<br/>USD</th>
                            <th rowSpan={2} className="border border-black font-normal bg-[#808080] text-white w-[35px]">@/CTN</th>
                            <th rowSpan={2} className="border border-black font-normal bg-[#808080] text-white w-[50px]">fumigation</th>
                            <th rowSpan={2} className="border border-black font-normal w-[50px]">AMOUNT<br/>USD</th>
                        </tr>
                        <tr className="bg-[#f0f0f0]">
                            <th className="border border-black font-normal w-[35px]">N.W.</th>
                            <th className="border border-black font-normal w-[25px]">KG</th>
                            <th className="border border-black font-normal w-[55px]">PACKED W.</th>
                            <th className="border border-black font-normal w-[25px]">KG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.items && data.items.length > 0 ? (
                            data.items.map((item: any, idx: number) => (
                                <tr key={idx} className="align-middle border-b border-black text-[8px] text-center font-bold">
                                    <td className="border-r border-black p-1 text-center font-bold">{item.shipment || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.conNo || (idx + 1)}</td>
                                    <td className="border-r border-black p-1 text-left font-bold whitespace-pre-wrap">{item.productDescription}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.itemCode || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.brand || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.nw || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.nwKg || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.packedW || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.packedWKg || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.gwKgCrt || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.qtyCarton || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.totalNwKg || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{item.totalGwKg || '-'}</td>
                                    <td className="border-r border-black p-1 text-right font-bold">{item.priceUsd || '-'}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{(item.perCtn && item.perCtn !== 'N/A') ? item.perCtn : ''}</td>
                                    <td className="border-r border-black p-1 text-center font-bold">{(item.fumigation && item.fumigation !== 'N/A') ? item.fumigation : ''}</td>
                                    <td className="p-1 text-right font-bold">{item.amountUsd || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            /* Fallback old row style */
                            <tr className="align-top border-b border-black">
                                <td colSpan={2} className="border-r border-black text-left p-1">
                                    <div className="min-h-[250px] whitespace-pre-wrap break-words">{data?.shippingMarks}</div>
                                </td>
                                <td colSpan={11} className="border-r border-black text-left p-1">
                                    <div className="min-h-[250px] whitespace-pre-wrap break-words">{data?.quantityDescriptions}</div>
                                </td>
                                <td colSpan={3} className="border-r border-black text-right p-1">
                                    <div className="min-h-[250px] whitespace-pre-wrap break-words">{data?.unitPrice}</div>
                                </td>
                                <td colSpan={1} className="text-right p-1 font-bold">
                                    <div className="min-h-[250px] whitespace-pre-wrap break-words">{data?.amount}</div>
                                </td>
                            </tr>
                        )}
                        {/* Totals Rows */}
                        <tr className="h-[20px] font-bold text-[8px] bg-slate-50">
                            <td colSpan={11} className="border border-black text-left pl-1">
                                {data?.items && data.items.length > 0 ? (
                                    <span>TOTAL N.W. KG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>{data.totalNw || '5,791.00'}</strong></span>
                                ) : (
                                    "TOTAL N.W. KG"
                                )}
                            </td>
                            <td colSpan={1} className="border border-black text-left pl-1">
                                {data?.items && data.items.length > 0 ? (
                                    <span>TOTAL G.W. KG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>{data.totalGw || '7,467.00'}</strong></span>
                                ) : (
                                    "TOTAL G.W. KG"
                                )}
                            </td>
                            <td colSpan={4} className="border border-black text-right pr-2">FOB (BANGKOK) / SHIPPING TERMS</td>
                            <td className="border border-black text-right pr-1 font-bold">{data?.totals?.fobBangkok || '-'}</td>
                        </tr>
                        <tr className="h-[20px] font-bold text-[8px]">
                            <td colSpan={12} className="border border-black text-left pl-1 uppercase text-slate-700">
                                {data?.items && data.items.length > 0 ? (
                                    <span>{data.quantityDescriptions || `TOTAL: ${data.totalQty || '670'} CARTONS / N.W. ${data.totalNw || '5,791.00'} KGS / G.W. ${data.totalGw || '7,467.00'} KGS`}</span>
                                ) : (
                                    "TOTAL"
                                )}
                            </td>
                            <td colSpan={4} className="border border-black text-right pr-2 bg-[#f0f0f0]">FREIGHT</td>
                            <td className="border border-black text-right pr-1">{data?.totals?.freight || '-'}</td>
                        </tr>
                        <tr className="h-[20px] font-bold text-[8px]">
                            <td colSpan={12} className="border border-black text-left pl-1 uppercase text-slate-700">
                                {data?.incoterm && <span>CONTRACT SHIPPING TERMS: <strong>{data.incoterm}</strong></span>}
                            </td>
                            <td colSpan={4} className="border border-black text-right pr-2 bg-[#f0f0f0]">INSURANCE</td>
                            <td className="border border-black text-right pr-1">{data?.totals?.insurance || '-'}</td>
                        </tr>
                        <tr className="h-[22px] font-bold text-[9px] bg-[#f9f9f9]">
                            <td colSpan={12} className="border border-black text-left pl-1 italic font-semibold text-slate-800">
                                {data?.totalAmountLabel && <span>{data.totalAmountLabel}</span>}
                            </td>
                            <td colSpan={4} className="border border-black text-right pr-2 font-black uppercase text-[#d35400] bg-[#fdf2e9]">GRAND TOTAL USD</td>
                            <td className="border border-black text-right pr-1 font-black text-[#d35400] bg-[#fdf2e9]">{data?.totals?.grandTotal}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Terms and conditions block */}
                <div className="grid grid-cols-[140px_10px_1fr] text-[9.5px] mt-4 gap-y-1.5 flex-1 items-start leading-snug">
                    <div className="font-bold">PACKAGING**</div><div>:</div><div className="whitespace-pre-wrap">{data?.packaging}</div>
                    <div className="font-bold">PAYMENT TERM</div><div>:</div><div className="whitespace-pre-wrap">{data?.paymentTerm}</div>
                    <div className="font-bold">DEPOSIT</div><div>:</div><div className="whitespace-pre-wrap">{data?.deposit}</div>
                    <div className="font-bold">INCOTERM</div><div>:</div><div className="whitespace-pre-wrap">{data?.incoterm}</div>
                    <div className="font-bold">COUNTRY OF ORIGIN</div><div>:</div><div>{data?.countryOfOrigin}</div>
                    <div className="font-bold">SHIPMENT MONTH</div><div>:</div><div>{data?.shipmentMonth}</div>
                    <div className="font-bold">PORT OF LOADING</div><div>:</div><div>{data?.portOfLoading}</div>
                    <div className="font-bold">PORT OF DISCHARGE</div><div>:</div><div>{data?.portOfDischarge}</div>
                    <div className="font-bold">DESTINATION</div><div>:</div><div>{data?.destination}</div>
                    <div className="font-bold items-start">SHIPPING DOCUMENTS</div><div>:</div><div className="whitespace-pre-wrap">{data?.shippingDocuments}</div>
                    <div className="font-bold">VALIDITY</div><div>:</div><div className="whitespace-pre-wrap">{data?.validity}</div>
                    <div className="font-bold mt-2">BANK CHARGES</div><div className="mt-2">:</div><div className="mt-2 whitespace-pre-wrap">{data?.bankCharges}</div>
                    <div className="font-bold underline underline-offset-2 mt-2">OUR BANK DETAILS :</div><div></div><div></div>
                    <div className="font-normal pl-0 uppercase">BANK NAME</div><div>:</div><div>{data?.bankName}</div>
                    <div className="font-normal pl-0 uppercase">BRANCH</div><div>:</div><div>{data?.branch}</div>
                    <div className="font-normal pl-0 uppercase">ADDRESS</div><div>:</div><div>{data?.address}</div>
                    <div className="font-normal pl-0 uppercase">ACCOUNT NAME</div><div>:</div><div>{data?.accountName}</div>
                    <div className="font-normal pl-0 uppercase">ACCOUNT NO.</div><div>:</div><div>{data?.accountNo}</div>
                    <div className="font-normal pl-0 uppercase">SWIFT CODE</div><div>:</div><div>{data?.swiftCode}</div>
                </div>

                <div className="mt-4 text-[9px] leading-snug tracking-tight">
                    <div className="font-bold underline underline-offset-2 mb-1">OTHER TERMS & CONDITIONS :</div>
                    <div className="pl-4 -indent-4 mb-1"><span className="font-bold">1). 5% MORE OR LESS IS ACCEPTABLE IN BOTH QUANTITY & TOTAL SHIPMENT VALUE</span></div>
                    <div className="pl-4 -indent-4 mb-0.5"><span className="font-bold">2). QUALITY,QUANTITY INSPECTION AND GUARANTEE</span></div>
                    <div className="pl-4 mb-1 text-justify">
                        To be inspected by seller at factory in the first step showing that the cargo is loaded in the perfect conditions as per terms & conditions stated in this PI. The result is final at loading in factory. Loading pictures will be sent to buyer by e-mail and buyer must confirm by return e-mail of this perfect cargo loading within 7 days after receiving these pictures. Buyer must inspect cargo on quality & quantity within 10 days after cargo arrival at destination port [ETA Port]. If there is any quality issues, buyer must take pictures as evidence while cargo unloading , showing damage , quality problems and must be showing container no. and container picture. Buyer must send written notice to inform seller by e-mail or letter at the same time buyer must contact shipping line, insurance company [if you have any] and also third party surveyor SGS to inspect the cargo within same period of time [10 days after ETA date].An official survey report from SGS and the shipping line must be sent with in 14 days after ETA date to seller by registered air courier to proceed a claim. All cost related to above procedures on buyer's side. [Please Note : cargo has to be partly unloaded while in contact with shipping line and insurance company for a successful claim without any delay. We only accept SGS inspection company ].
                    </div>
                    <div className="pl-4 -indent-4 mb-0.5"><span className="font-bold">3). IMPORT PERMIT [ please ignore if buyer does not require ]</span></div>
                    <div className="pl-4 mb-1 text-justify">
                        Buyer must have import permit available for the shipment.Import permit and any related cost are on buyer's responsibility. Issues arrise not having import permit , buyer will be responsible for any circumstances.
                    </div>
                </div>
            </div>

            {/* Page Break for Print */}
            <div className="print:break-before-page"></div>
            {isPreview && <div className="w-full h-4 bg-slate-200 border-y border-slate-300 my-4 text-center text-[10px] text-slate-400">PAGE BREAK</div>}

            {/* Page 2 */}
            <div className="max-w-[190mm] mx-auto flex flex-col pt-[15mm] text-[9px] leading-snug tracking-tight">
                <div className="pl-4 -indent-4 mb-0.5"><span className="font-bold">4). INSURANCE [ apply by buyer ]</span></div>
                <div className="pl-4 mb-1 text-justify">
                    In case of damage and loss during marine transportation all claim will be handled by Insurance party when you have Insurance policy.
                </div>
                <div className="pl-4 -indent-4 mb-0.5"><span className="font-bold">5). RESPONSIBILITIES OF THE PARTIES</span></div>
                <div className="pl-4 mb-1 text-justify">
                    In case of either party's refusal of performance of the present contract, it pays the other party. The penalty of 5% of the amount of the covered goods and restitutes the relative loses inspite of the penalty.
                </div>
                <div className="pl-4 -indent-4 mb-0.5"><span className="font-bold">6). FORCE MAJEURE :</span></div>
                <div className="pl-4 mb-1 text-justify">
                    The seller shall not be held responsible for failure or delay of the covered cargo or a portion under the present contract in consequence of any force majeure incidents.
                </div>
                <div className="pl-4 -indent-4 mb-0.5"><span className="font-bold">7). ARBITRATION</span></div>
                <div className="pl-4 mb-1 text-justify">
                    Any discrepencies and / or disputes arising out or in connection with this contract, not settled amicably shall be referred to arbitration in accordance with rules and regulation of statute of the arbitration center of Thai Chamber Of Commerce and arbitration rule of Thai Law.
                </div>
                <div className="pl-4 -indent-4 mb-0.5"><span className="font-bold">8). U.S.A. SHIPMENT [ please ignore for other destination ]</span></div>
                <div className="pl-4 mb-2 text-justify">
                    We will provide necessary import permit for shipment to USA. In the event container cannot enter the port, buyer will send back the container to Thailand and will bear any expenses related to this shipment at destination. Seller will repack & recondition cargo and make return shipment. Seller will bear all expenses at origin.
                </div>
                <div className="font-bold uppercase text-justify mb-2">
                    BOTH PARTIES HAVE READ ALL THE TERMS AND CONDITIONS ABOVE WITH UNDERSTANDING.THEREFORE <br/>
                    BOTH PARTIES AGREED TO SET THE HANDWRITE WITH THE AUTHORIZED SIGNATURE AND COMPANY STAMP. <br/>
                    THIS AGREEMENT IS LEGAL PAPER FOR BOTH PARTIES THROUGH THE FAX TRANSMISSION OR BY E-MAIL
                </div>

                <div className="font-bold mt-4 mb-8">PLEASE SIGN & STAMP:</div>

                <div className="flex justify-between items-start mt-8 w-full max-w-[170mm] mx-auto text-[10px]">
                    <div className="flex flex-col items-center w-1/2 pr-8">
                        <div className="mb-1 w-full font-bold ml-12">Seller (Signature)</div>
                        <div className="border-b border-black w-full h-16 mb-2"></div>
                        <div>(NONGLAK KULSETSOPHON)</div>
                        <div>Authorized Person</div>
                        <div>Company Stamp</div>
                    </div>
                    <div className="flex flex-col items-center w-1/2 pl-8">
                        <div className="mb-1 w-full font-bold">Buyer (Signature)</div>
                        <div className="border-b border-black w-full h-16 border-dashed mb-2 relative">
                             <div className="absolute top-[60px] left-0">(</div>
                             <div className="absolute top-[60px] right-0">) full name</div>
                        </div>
                        <div className="mt-2">Authorized Person</div>
                        <div>Company Stamp</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
