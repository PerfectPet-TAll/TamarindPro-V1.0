import React from 'react';
import { Printer } from 'lucide-react';
import { usePrintPreferences } from '../../context/PrintPreferencesContext';

interface PdfPrintProps {
  contentId: string;
  title?: string;
  className?: string;
}

export function PdfPrint({
  contentId,
  title = "Print Report",
  className
}: PdfPrintProps) {
  const { preferences } = usePrintPreferences();

  const handlePrint = () => {
    const printContent = document.getElementById(contentId);
    if (!printContent) return;

    const windowPrint = window.open('', '', 'width=950,height=750');
    if (!windowPrint) return;

    const currentTimestamp = new Date().toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    windowPrint.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
            
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              color: #111f42; 
              background-color: #ffffff;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              border-bottom: 2px solid #111f42; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .logo { 
              font-weight: 900; 
              font-size: 22px; 
              color: #f47729; 
              letter-spacing: 1px;
            }
            .title { 
              font-weight: 900; 
              font-size: 18px; 
              text-transform: uppercase; 
              letter-spacing: 2px; 
              text-align: right;
            }
            .date { 
              font-size: 11px; 
              color: #64748b; 
              text-align: right;
              font-family: 'JetBrains Mono', monospace;
              margin-top: 4px;
            }
            
            /* Responsive layout matching inside print */
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
              margin-bottom: 30px;
            }
            th { 
              background: #f8fafc; 
              text-align: left; 
              padding: 12px; 
              font-size: 10px; 
              font-weight: 900; 
              text-transform: uppercase; 
              border-bottom: 2px solid #e2e8f0; 
            }
            td { 
              padding: 12px; 
              font-size: 12px; 
              border-bottom: 1px solid #f1f5f9; 
            }
            
            /* Watermark design */
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-35deg);
              font-size: 90px;
              font-weight: 950;
              color: rgba(244, 119, 41, 0.05); /* very elegant light signature color overlay */
              pointer-events: none;
              white-space: nowrap;
              z-index: -9999;
              letter-spacing: 8px;
            }

            @media print {
              .no-print { display: none !important; }
              @page {
                size: ${preferences.paperOrientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
                margin: 20mm;
              }
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${preferences.showWatermark ? '<div class="watermark">TAMARINDPRO</div>' : ''}
          <div class="header">
            <div class="logo">TAMARINDPRO</div>
            <div>
              <div class="title">${title}</div>
              <div class="date">Printed on: ${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="print-layout-container">
            ${printContent.innerHTML}
          </div>

          ${preferences.includeSignature ? `
            <div class="print-layout-footer" style="margin-top: 60px; display: flex; justify-content: flex-end; page-break-inside: avoid;">
              <div style="width: 260px; border-top: 1.5px solid #2e3118; padding-top: 16px; text-align: center;">
                <div style="font-family: 'Georgia', serif; font-style: italic; font-size: 18px; color: #214573; margin-bottom: 6px;">Somchai J.</div>
                <div style="font-weight: 900; font-size: 12px; text-transform: uppercase; color: #2e3118;">( Somchai Jaidee )</div>
                <div style="font-weight: 700; font-size: 10px; color: #8c7361; margin-top: 4px; text-transform: uppercase; tracking-widest">Head of Sales & Export Operations</div>
                <div style="font-size: 8px; color: #adb2b0; font-family: 'JetBrains Mono', monospace; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Digitally Signed: ${currentTimestamp}</div>
              </div>
            </div>
          ` : ''}
        </body>
      </html>
    `);

    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 600);
  };

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-2 px-4 py-2 bg-slate-100 text-[#111f42] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer ${className}`}
    >
      <Printer size={14} />
      Print PDF
    </button>
  );
}

export default PdfPrint;
