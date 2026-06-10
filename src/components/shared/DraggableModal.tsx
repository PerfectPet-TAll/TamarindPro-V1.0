import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  className?: string;
  customHeader?: React.ReactNode;
  hideDefaultHeader?: boolean;
}

export function DraggableModal({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
  className,
  customHeader,
  hideDefaultHeader = false
}: DraggableModalProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1f2a44]/80 backdrop-blur-md p-4 animate-fadeIn print:static print:bg-transparent print:p-0 print:block">
      <Draggable nodeRef={nodeRef} handle=".modal-handle">
        <div 
          ref={nodeRef}
          className={clsx(
            "bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print:overflow-visible print:max-h-none print:shadow-none print:border-none flex flex-col max-h-[90vh] print:h-auto",
            width,
            className
          )}
          style={{ width: width?.includes('px') ? undefined : width }} // Just in case passing exact w-[...] class vs width string
        >
          {/* Header / Handle */}
          {!hideDefaultHeader && (
            <div className="modal-handle cursor-move w-full shrink-0 print:hidden">
              {customHeader ? customHeader : (
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  {typeof title === 'string' ? (
                    <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">
                      {title}
                    </h3>
                  ) : (
                    title
                  )}
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden print:overflow-visible flex flex-col print:block">
            {children}
          </div>
        </div>
      </Draggable>
    </div>
  );

  return createPortal(content, document.body);
}

