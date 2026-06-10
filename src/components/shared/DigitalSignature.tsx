import React from 'react';

interface DigitalSignatureProps {
  name?: string;
  designation?: string;
  includeTimestamp?: boolean;
}

export function DigitalSignature({
  name = "Somchai Jaidee",
  designation = "Head of Sales & Export Operations",
  includeTimestamp = true
}: DigitalSignatureProps) {
  const timestamp = new Date().toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="print-layout-footer mt-8 pt-6 border-t border-[#adb2b0]/40 flex flex-col items-end justify-end ml-auto text-right font-mono max-w-[320px] pr-4">
      <div className="w-[220px] border-t border-[#2e3118]/40 pt-4 mt-6 text-center">
        <div className="h-10 flex items-center justify-center relative mb-1">
          <span className="font-serif italic text-lg text-[#214573]/90 select-none">Somchai J.</span>
        </div>
        <div className="text-[12px] font-black text-[#2e3118] uppercase tracking-wide">
          ( {name} )
        </div>
        <div className="text-[10px] font-bold text-[#8c7361] uppercase mt-1 tracking-wider">
          {designation}
        </div>
        {includeTimestamp && (
          <div className="text-[9px] text-[#adb2b0] mt-2 font-mono uppercase tracking-widest">
            Signed: {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}

export default DigitalSignature;
