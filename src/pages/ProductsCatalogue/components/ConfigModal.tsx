import React from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Category, SubCategory, Variety } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  categories: Category[];
  subCategories: SubCategory[];
  varieties: Variety[];
  category: string;
  addRegistryItem: (type: string, value: string) => void;
  removeRegistryItem: (type: string, id: string) => void;
}

export default function ConfigModal({
  isOpen,
  onClose,
  type,
  categories,
  subCategories,
  varieties,
  category,
  addRegistryItem,
  removeRegistryItem
}: ConfigModalProps) {
  const getItems = () => {
    if (type === 'category') return categories;
    if (type === 'variety') return varieties;
    return subCategories.filter(s => s.catId === category);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value;
      if (val.trim()) {
        addRegistryItem(type, val);
        e.currentTarget.value = '';
      }
    }
  };

  const handleAddBtnClick = () => {
    const inp = document.getElementById('newRegistryValue') as HTMLInputElement;
    if (inp && inp.value.trim()) {
      addRegistryItem(type, inp.value);
      inp.value = '';
    }
  };

  const shownItems = getItems();

  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose}
      width="max-w-md w-full"
      title={`Registry Config: ${type}`}
    >
      <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
        {shownItems.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 border border-[#d2af94]/20 rounded-xl group">
            <span className="font-black text-[12px] uppercase text-[#2e3118]">{item.label}</span>
            <div className="flex gap-2">
              <button 
                type="button"
                className="text-[#5167a2] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 size={14}/>
              </button>
              <button 
                type="button"
                onClick={() => removeRegistryItem(type, item.id)} 
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
        ))}
        {type === 'subcategory' && shownItems.length === 0 && (
          <div className="py-10 text-center text-slate-400 uppercase text-[10px]">
            No sub-categories linked to {category}
          </div>
        )}
      </div>
      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex gap-2">
          <input 
            id="newRegistryValue" 
            type="text" 
            placeholder={`New ${type}...`} 
            className="flex-1 px-4 h-11 rounded-xl border border-slate-300 font-bold text-[12px] outline-none shadow-sm bg-white" 
            onKeyDown={handleKeyDown} 
          />
          <button 
            type="button"
            onClick={handleAddBtnClick} 
            className="bg-[#214573] text-white w-11 h-11 rounded-xl flex items-center justify-center shadow-md cursor-pointer"
          >
            <Plus size={20}/>
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}
