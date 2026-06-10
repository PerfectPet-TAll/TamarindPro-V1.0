import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import { clsx } from 'clsx';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DataExportProps {
  data: any[];
  columns: { key: string; label: string }[];
  filename?: string;
  className?: string;
}

export function DataExport({
  data,
  columns,
  filename = "export",
  className
}: DataExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'exporting' | 'done'>('idle');

  const handleExportExcel = () => {
    if (data.length === 0) return;
    setStatus('exporting');
    
    setTimeout(() => {
      try {
        const worksheet = XLSX.utils.json_to_sheet(
          data.map(row => {
            const newRow: any = {};
            columns.forEach(col => {
              newRow[col.label] = row[col.key];
            });
            return newRow;
          })
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        setStatus('done');
      } catch (err) {
        console.error(err);
        setStatus('idle');
      }
      setTimeout(() => { setStatus('idle'); setIsOpen(false); }, 2000);
    }, 500);
  };

  const handleExportPDF = () => {
    if (data.length === 0) return;
    setStatus('exporting');
    
    setTimeout(() => {
      try {
        const doc = new jsPDF('l', 'pt', 'a4');
        const tableColumn = columns.map(c => c.label);
        const tableRows = data.map(row => columns.map(c => row[c.key]));
        
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          theme: 'grid',
          styles: { font: 'helvetica', fontSize: 8 },
          headStyles: { fillColor: [9, 29, 56] }
        });
        
        doc.save(`${filename}.pdf`);
        setStatus('done');
      } catch (err) {
        console.error(err);
        setStatus('idle');
      }
      setTimeout(() => { setStatus('idle'); setIsOpen(false); }, 2000);
    }, 500);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={status === 'exporting' || data.length === 0}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all h-[44px]",
          status === 'done' 
            ? "bg-[#EAF2EA] text-[#606934] border border-[#606934] shadow-sm"
            : "bg-white border border-[#adb2b0]/30 text-[#8c7361] hover:bg-[#F0EAE1] hover:text-[#f47729]",
          className
        )}
      >
        {status === 'exporting' ? <Loader2 size={16} className="animate-spin" /> : 
         status === 'done' ? <CheckCircle2 size={16} /> : 
         <Download size={16} />}
        {status === 'exporting' ? 'EXPORTING...' : status === 'done' ? 'DONE' : 'EXPORT'}
        <ChevronDown size={14} className={clsx("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 flex flex-col animate-fadeIn">
            <button
              onClick={handleExportExcel}
              className="px-4 py-3 text-left text-[11px] font-black tracking-widest uppercase text-slate-600 hover:bg-slate-50 hover:text-green-700 flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet size={16} /> Excel (.xlsx)
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-3 text-left text-[11px] font-black tracking-widest uppercase text-slate-600 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2 border-t border-slate-100 transition-colors"
            >
              <FileText size={16} /> PDF (.pdf)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
