import React from 'react';

interface PrintProps {
  form: any;
  isPreview?: boolean;
}

export function BookingRequestPrintTemplate({ form, isPreview = false }: PrintProps) {
  return (
    <div className={`print-template ${isPreview ? 'block relative p-4 sm:p-10 print:hidden shadow-xl' : 'hidden print:block print:absolute print:inset-0 z-[100000] p-10 print:p-0 print:m-0'} bg-white text-black w-full print:h-auto overflow-visible font-sans max-w-[210mm] mx-auto`} style={{ minHeight: '297mm' }}>
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-black pb-1 mb-4">
        <div></div>
        <div className="text-center font-bold text-lg underline underline-offset-4 decoration-2 px-10">BOOKING REQUEST</div>
        <div className="flex border border-black divide-x divide-black text-[12px] font-bold">
            <div className="px-2 py-1">NO.: {form.bookingNo}</div>
            <div className="px-2 py-1">DATE: {form.bookingDate}</div>
        </div>
      </div>

      <table className="w-full border-collapse border border-black text-[11px] leading-snug">
        <tbody>
          {/* Row 1: REQ, TEL, PI, PO */}
          <tr className="border-b border-black divide-x divide-black font-bold h-6">
            <td className="px-2 align-middle">REQUEST BY: {form.requestBy}</td>
            <td className="px-2 align-middle">TEL: {form.requestTel}</td>
            <td className="px-2 align-middle">PI NO.: {form.piNo}</td>
            <td className="px-2 align-middle">PO NO.: {form.poNo}</td>
          </tr>

          {/* Row 2: SHIPPER */}
          <tr className="border-b border-black h-24">
            <td colSpan={2} className="border-r border-black p-2 align-top w-1/2">
                <div className="flex gap-2">
                    <span className="font-bold underline w-20 shrink-0">SHIPPER:</span>
                    <span className="whitespace-pre-wrap leading-relaxed">{form.shipper}</span>
                </div>
            </td>
            <td colSpan={2} className="p-2 align-top w-1/2">
                <div className="leading-relaxed">
                    CONTACT PERSON: {form.shipperContact}<br/>
                    MOB: {form.shipperMob}<br/>
                    TEL: {form.shipperTel}<br/>
                    E-mail: {form.shipperEmail}
                </div>
            </td>
          </tr>

          {/* Row 3: CONSIGNEE */}
          <tr className="border-b border-black h-20">
            <td colSpan={2} className="border-r border-black p-2 align-top">
                <div className="flex gap-2">
                    <span className="font-bold underline w-20 shrink-0">CONSIGNEE:</span>
                    <span className="whitespace-pre-wrap leading-relaxed">{form.consignee}</span>
                </div>
            </td>
            <td colSpan={2} className="p-2 align-top">
                <div className="leading-relaxed whitespace-pre-wrap">
                    {form.consigneeContact && `Contact Person: ${form.consigneeContact}\n`}
                    {form.consigneeEmail && `E-mail: ${form.consigneeEmail}\n`}
                    {form.consigneeNotes}
                </div>
            </td>
          </tr>

          {/* Row 4: NOTIFY PARTY */}
          <tr className="border-b border-black h-16">
            <td colSpan={2} className="border-r border-black p-2 align-top">
                <div className="flex gap-2">
                    <span className="font-bold underline w-24 shrink-0">NOTIFY PARTY:</span>
                    <span className="whitespace-pre-wrap leading-relaxed">{form.notifyParty}</span>
                </div>
            </td>
            <td colSpan={2} className="p-2 align-top">
                <div className="leading-relaxed whitespace-pre-wrap">{form.notifyPartyContact}</div>
            </td>
          </tr>

          {/* Row 5: FOR FOB TERM */}
          <tr className="border-b border-black">
            <td colSpan={2} className="border-r border-black p-2 align-top">
                <div className="font-bold underline mb-1">FOR FOB TERM:</div>
                <div className="flex gap-2 font-bold text-red-600">
                    <span className="w-32 shrink-0 text-black">SERVICE CONTRACT NO:</span>
                    <span>{form.scNo}</span>
                </div>
                <div className="mt-1 font-bold">
                    [VESSEL NOMINATE BY CUSTOMER]
                </div>
            </td>
            <td colSpan={2} className="p-2 align-top">
                <div className="font-bold mb-1 mt-4">AGENT: {form.fobAgent}</div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>CONTACT PERSON: {form.fobContact}</div>
                    <div>MOB: {form.fobMob}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>TEL: {form.fobTel}</div>
                    <div>E-mail: {form.fobEmail}</div>
                </div>
            </td>
          </tr>

          {/* Row 6: FOR CNF TERM */}
          <tr className="border-b border-black h-20">
            <td colSpan={2} className="border-r border-black p-2 align-top bg-gray-100/50">
                <div className="font-bold underline">FOR CNF TERM:</div>
            </td>
            <td colSpan={2} className="p-2 align-top bg-gray-100/50">
                <div className="space-y-1">
                    <div className="flex gap-2"><span className="w-24 shrink-0">SHIPPING LINE:</span> <span className="flex-1 border-b border-black inline-block">{form.cnfShippingLine}</span></div>
                    <div className="flex gap-2"><span className="w-24 shrink-0">CONTACT PERSON:</span> <span className="flex-1 border-b border-black inline-block">{form.cnfContact}</span></div>
                    <div className="flex gap-2"><span className="w-24 shrink-0">E-mail:</span> <span className="flex-1 border-b border-black inline-block">{form.cnfEmail}</span></div>
                </div>
            </td>
          </tr>

          {/* Row 7: DETAILS */}
          <tr className="border-b border-black">
            <td colSpan={2} className="border-r border-black p-2 align-top">
                <div className="space-y-2">
                    <div className="flex"><span className="w-20 inline-block font-bold">PRODUCT:</span> <span className="border-b border-black flex-1 font-bold">{form.product}</span></div>
                    <div className="flex"><span className="w-20 inline-block font-bold">TEMP.:</span> <span className="border-b border-black flex-1 font-bold">{form.temp}</span></div>
                    <div className="flex"><span className="w-20 inline-block font-bold">POL:</span> <span className="border-b border-black flex-1 font-bold">{form.pol}</span></div>
                    <div className="flex"><span className="w-20 inline-block font-bold">LOADING DATE:</span> <span className="border-b border-black flex-1 font-bold">{form.loadingDate}</span></div>
                    <div className="font-bold ml-20">AT FACTORY</div>
                </div>
            </td>
            <td colSpan={2} className="p-2 align-top text-[10px]">
                <div className="space-y-2">
                    <div className="flex"><span className="w-24 inline-block font-bold">CONTAINER TYPE:</span> <span className="font-bold">{form.containerType}</span></div>
                    <div className="flex"><span className="w-24 inline-block font-bold">VENT.:</span> <span className="font-bold">{form.vent}</span></div>
                    <div className="flex"><span className="w-24 inline-block font-bold">POD:</span> <span className="font-bold">{form.pod}</span></div>
                    <div className="flex items-start"><span className="w-24 inline-block font-bold shrink-0">ETD:</span> 
                        <div className="font-bold font-mono text-sm leading-tight text-blue-800">
                           : {form.etd}<br/>
                           (REQUESTED BY CUSTOMER)
                        </div>
                    </div>
                </div>
            </td>
          </tr>

          {/* Row 8: FREIGHT INFO */}
          <tr className="border-b border-black h-28 bg-gray-100/30">
            <td colSpan={4} className="p-2 align-top">
                <div className="flex gap-4">
                    <div className="space-y-2 w-48 shrink-0">
                        <div className="font-bold">FREIGHT RATE:</div>
                        <div className="font-bold">GROSS WEIGHT LIMIT:</div>
                        <div className="font-bold">PICK UP DD.-TIME-PLACE:</div>
                        <div className="font-bold">RETURN DD-TIME-PLACE:</div>
                        <div className="font-bold">CUT OFF DD-TIME:</div>
                    </div>
                    <div className="space-y-2 flex-1 pt-[1px]">
                        <div className="border-b border-black h-[14px] w-full">{form.freightRate}</div>
                        <div className="border-b border-black h-[14px] w-full font-bold">{form.grossWeightLimit}</div>
                        <div className="border-b border-black h-[14px] w-full">{form.pickupTime}</div>
                        <div className="border-b border-black h-[14px] w-full">{form.returnTime}</div>
                        <div className="border-b border-black h-[14px] w-full">{form.cutoffTime}</div>
                    </div>
                </div>
            </td>
          </tr>

          {/* Row 9: EXTRAS */}
          <tr className="">
            <td colSpan={4} className="p-2 align-top">
                <div className="flex gap-4 min-h-[100px]">
                    <div className="space-y-1 w-36 shrink-0">
                        <div className="font-bold uppercase">EXTRA REQUEST [IF ANY]:</div>
                        <div className="font-bold uppercase">REMARKS:</div>
                    </div>
                    <div className="flex-1 whitespace-pre-wrap font-bold leading-relaxed">
                        {form.remarks}
                    </div>
                </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}
