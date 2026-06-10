import React, { useState, useMemo, useRef } from 'react';
import { 
  X, Info, Weight, UploadCloud, Trash2, Save, HardDrive, Link, Globe, Zap, Settings, Image as ImageIcon
} from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { Category, SubCategory, Variety, ProductForm } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  categories: Category[];
  subCategories: SubCategory[];
  varieties: Variety[];
  onSave: () => void;
  setConfigModal: (cfg: { isOpen: boolean, type: string }) => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  form,
  setForm,
  categories,
  subCategories,
  varieties,
  onSave,
  setConfigModal
}: ProductModalProps) {
  const [modalTab, setModalTab] = useState<'identity' | 'specs' | 'images'>('identity');
  const [imgSourceMode, setImgSourceMode] = useState<string>('computer');
  const [externalImgUrl, setExternalImgUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const netWeightCarton = useMemo(() => {
    const val = (form.netWeightGram * form.qtyPerCarton) / 1000;
    return isNaN(val) ? '0.000' : val.toFixed(3);
  }, [form.netWeightGram, form.qtyPerCarton]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddExternalImage = () => {
    if (externalImgUrl) {
      setForm(prev => ({ ...prev, images: [...prev.images, externalImgUrl] }));
      setExternalImgUrl('');
    }
  };

  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose}
      width="max-w-5xl w-[900px]"
      hideDefaultHeader={true}
    >
      {/* Header */}
      <div className="bg-[#091d38] px-6 py-4 flex justify-between items-center shrink-0 border-b border-[#f47729] w-full modal-handle cursor-move">
        <div className="flex items-center gap-4 pointer-events-none">
          <div className="w-12 h-12 rounded-[14px] bg-[#214573] text-white flex items-center justify-center border border-[#426a77]/50 shadow-sm overflow-hidden shrink-0">
            <Weight size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest leading-none mb-1.5 font-mono">
              PRODUCT REGISTRATION
            </h3>
            <span className="text-[10px] font-black text-[#f47729] bg-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-white/10 flex items-center gap-1.5 font-mono">
              <Zap size={10}/> Syncing structural database node
            </span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-[#adb2b0] hover:text-[#f47729] transition-all bg-white/5 hover:bg-white/10 p-2.5 rounded-full shrink-0 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Body tabs and fields */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F0EAE1]/20 h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-[#adb2b0]/30 flex flex-row md:flex-col shrink-0 overflow-x-auto no-scrollbar">
          <button 
            type="button"
            onClick={() => setModalTab('identity')} 
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-5 py-4 text-left transition-all md:border-l-4 ${modalTab === 'identity' ? 'border-b-4 md:border-b-0 border-[#af7a2b] bg-[#F0EAE1]/60 text-[#2e3118]' : 'border-transparent text-[#8c7361] hover:bg-[#F0EAE1]/30'}`}
          >
            <Info size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest font-mono">Identity</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setModalTab('specs')} 
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-5 py-4 text-left transition-all md:border-l-4 ${modalTab === 'specs' ? 'border-b-4 md:border-b-0 border-[#af7a2b] bg-[#F0EAE1]/60 text-[#2e3118]' : 'border-transparent text-[#8c7361] hover:bg-[#F0EAE1]/30'}`}
          >
            <Weight size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest font-mono">Weight & Tech</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setModalTab('images')} 
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-5 py-4 text-left transition-all md:border-l-4 ${modalTab === 'images' ? 'border-b-4 md:border-b-0 border-[#af7a2b] bg-[#F0EAE1]/60 text-[#2e3118]' : 'border-transparent text-[#8c7361] hover:bg-[#F0EAE1]/30'}`}
          >
            <ImageIcon size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest font-mono">Images</span>
          </button>
        </div>

        {/* Form Contents */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white/40 h-full">
          {modalTab === 'identity' && (
            <div className="space-y-6 animate-fadeIn font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest block">Product Name</label>
                  <input 
                    type="text" 
                    value={form.productName} 
                    onChange={e => setForm({ ...form, productName: e.target.value })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-black text-[13px] outline-none focus:border-[#af7a2b] uppercase font-sans bg-white shadow-sm" 
                    placeholder="TITLE" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest block">SKU Code</label>
                  <input 
                    type="text" 
                    value={form.skuCode} 
                    onChange={e => setForm({ ...form, skuCode: e.target.value })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-mono font-black text-[14px] outline-none focus:border-[#af7a2b] uppercase bg-white shadow-sm" 
                    placeholder="SKU-XXXXX" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest font-mono">Category</label>
                    <button 
                      type="button"
                      onClick={() => setConfigModal({ isOpen: true, type: 'category' })} 
                      className="text-[#af7a2b] hover:text-[#f47729]"
                    >
                      <Settings size={14} />
                    </button>
                  </div>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value, subCategory: '' })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-black text-[12px] outline-none bg-white uppercase"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest font-mono">Sub-Category</label>
                    <button 
                      type="button"
                      onClick={() => setConfigModal({ isOpen: true, type: 'subcategory' })} 
                      className="text-[#af7a2b] hover:text-[#f47729]"
                    >
                      <Settings size={14} />
                    </button>
                  </div>
                  <select 
                    value={form.subCategory} 
                    onChange={e => setForm({ ...form, subCategory: e.target.value })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-black text-[12px] outline-none bg-white uppercase"
                  >
                    <option value="">-- Choose Sub-Cat --</option>
                    {subCategories.filter(s => s.catId === form.category).map(s => (
                      <option key={s.id} value={s.label}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest font-mono">Variety</label>
                    <button 
                      type="button"
                      onClick={() => setConfigModal({ isOpen: true, type: 'variety' })} 
                      className="text-[#af7a2b] hover:text-[#f47729]"
                    >
                      <Settings size={14} />
                    </button>
                  </div>
                  <select 
                    value={form.variety} 
                    onChange={e => setForm({ ...form, variety: e.target.value })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-black text-[12px] outline-none bg-white uppercase"
                  >
                    <option value="">-- Select Variety --</option>
                    {varieties.map(v => <option key={v.id} value={v.label}>{v.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0EAE1]">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest block">Price (฿)</label>
                  <input 
                    type="number" 
                    value={form.stdPrice} 
                    onChange={e => setForm({ ...form, stdPrice: Number(e.target.value) })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-black text-[14px] text-[#f47729] outline-none bg-white shadow-inner" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest block">Flavor</label>
                  <input 
                    type="text" 
                    value={form.flavor} 
                    onChange={e => setForm({ ...form, flavor: e.target.value })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-bold text-[13px] outline-none font-sans bg-white shadow-sm" 
                    placeholder="e.g. Original" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest block">Internal Description</label>
                <textarea 
                  value={form.desc} 
                  onChange={e => setForm({ ...form, desc: e.target.value })} 
                  rows={2} 
                  className="w-full p-4 rounded-xl border border-[#adb2b0]/40 font-medium text-[13px] outline-none resize-none bg-white font-sans shadow-sm" 
                />
              </div>
            </div>
          )}

          {modalTab === 'specs' && (
            <div className="space-y-6 animate-fadeIn font-mono bg-white p-8 rounded-[28px] border border-[#d2af94]/30 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block">
                    Gross Wt (KG) <span className="text-[#f47729]">*</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={form.grossWeight} 
                    onChange={e => setForm({ ...form, grossWeight: Number(e.target.value) })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-mono font-black text-[15px] bg-slate-50/50 outline-none shadow-sm" 
                  />
                </div>
                
                <div className="space-y-2 opacity-80">
                  <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest block">Packing Label</label>
                  <input 
                    type="text" 
                    value={form.packingSize} 
                    onChange={e => setForm({ ...form, packingSize: e.target.value })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/20 font-bold text-[13px] bg-white outline-none font-sans shadow-sm" 
                    placeholder="e.g. Large" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block">
                    Net weight/unit (g) <span className="text-[#f47729]">*</span>
                  </label>
                  <input 
                    type="number" 
                    value={form.netWeightGram} 
                    onChange={e => setForm({ ...form, netWeightGram: Number(e.target.value) })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-mono font-black text-[15px] outline-none shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block">Display weight (on Label)</label>
                  <input 
                    type="text" 
                    value={form.netWeightLabel} 
                    onChange={e => setForm({ ...form, netWeightLabel: e.target.value })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-bold text-[13px] outline-none font-sans bg-white shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#2e3118] uppercase tracking-widest block">Units per Carton</label>
                  <input 
                    type="number" 
                    value={form.qtyPerCarton} 
                    onChange={e => setForm({ ...form, qtyPerCarton: Number(e.target.value) })} 
                    className="w-full h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-mono font-black text-[15px] outline-none shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#af7a2b] uppercase tracking-widest block font-mono">Net weight/carton (KG)</label>
                  <div className="w-full h-[46px] px-5 rounded-xl border border-[#af7a2b]/30 font-mono font-black text-[18px] flex items-center justify-end bg-[#af7a2b]/5 text-[#af7a2b] shadow-inner">
                    {netWeightCarton} <span className="ml-2 text-[10px] opacity-60 uppercase">KG</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {modalTab === 'images' && (
            <div className="space-y-6 animate-fadeIn font-mono">
              <div className="flex bg-[#F0EAE1]/50 p-1 rounded-2xl border border-[#d2af94]/30 gap-1 shadow-sm shrink-0">
                {[
                  { id: 'computer', label: 'Computer', icon: HardDrive }, 
                  { id: 'url', label: 'URL Link', icon: Link }, 
                  { id: 'gdrive', label: 'Google Drive', icon: Globe }
                ].map(mode => (
                  <button 
                    type="button"
                    key={mode.id} 
                    onClick={() => setImgSourceMode(mode.id)} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${imgSourceMode === mode.id ? 'bg-[#214573] text-white shadow-md' : 'text-[#8c7361] hover:bg-white/50'}`}
                  >
                    <mode.icon size={16} /> {mode.label}
                  </button>
                ))}
              </div>

              <div className="bg-white p-8 rounded-[24px] border border-[#d2af94]/30 shadow-sm animate-fadeIn">
                {imgSourceMode === 'computer' ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border-4 border-dashed border-[#adb2b0]/30 rounded-[28px] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#F0EAE1]/30 transition-all group shadow-inner"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                    />
                    <UploadCloud size={32} className="text-[#606934] group-hover:scale-110 transition-transform" />
                    <p className="text-[13px] font-black text-[#2e3118] uppercase tracking-widest font-sans">Upload Asset</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-[#8c7361] uppercase tracking-widest block mb-2 font-mono">External Link (URL/GDrive)</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={externalImgUrl} 
                        onChange={e => setExternalImgUrl(e.target.value)} 
                        className="flex-1 h-[46px] px-4 rounded-xl border border-[#adb2b0]/40 font-bold text-[12px] outline-none font-sans shadow-inner" 
                      />
                      <button 
                        type="button"
                        onClick={handleAddExternalImage} 
                        className="px-8 bg-[#af7a2b] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md"
                      >
                        Add Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-6">
                {form.images?.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[20px] overflow-hidden border border-[#d2af94]/50 group shadow-md bg-white">
                    <img src={img} className="w-full h-full object-cover" alt="Asset" />
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-[#f47729] text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm border border-white/20 uppercase tracking-tighter">
                        PRIMARY
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })} 
                        className="w-10 h-10 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-t border-[#adb2b0]/30 flex justify-end gap-3 shrink-0 font-mono w-full">
        <button 
          onClick={onClose} 
          className="px-6 py-2.5 bg-[#F0EAE1]/50 border border-[#adb2b0]/30 text-[#53483e] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#F0EAE1] transition-all font-mono"
        >
          Cancel
        </button>
        <button 
          onClick={onSave} 
          className="bg-[#214573] text-[#f47729] px-10 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#091d38] transition-all flex items-center gap-2 border border-[#214573] shadow-lg"
        >
          <Save size={16}/> Save Registry
        </button>
      </div>
    </DraggableModal>
  );
}
