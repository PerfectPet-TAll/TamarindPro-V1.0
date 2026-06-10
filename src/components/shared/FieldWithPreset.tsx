import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, X } from 'lucide-react';

interface FieldWithPresetProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    type?: 'text' | 'textarea';
    storageKey: string;
    defaultPresets: string[];
    rows?: number;
    className?: string;
}

export function FieldWithPreset({ label, name, value, onChange, type = 'text', storageKey, defaultPresets, rows = 2, className = '' }: FieldWithPresetProps) {
    const [presets, setPresets] = useState<string[]>([]);
    const [isManaging, setIsManaging] = useState(false);
    const [newPreset, setNewPreset] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem(`preset_${storageKey}`);
        if (stored) {
            try {
                setPresets(JSON.parse(stored));
            } catch (e) {
                setPresets(defaultPresets);
            }
        } else {
            setPresets(defaultPresets);
            localStorage.setItem(`preset_${storageKey}`, JSON.stringify(defaultPresets));
        }
    }, [storageKey]); // removed defaultPresets from deps to avoid infinite loop if passed inline

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            onChange({ target: { name, value: e.target.value } });
            e.target.value = '';
        }
    };

    const savePresets = (newP: string[]) => {
        setPresets(newP);
        localStorage.setItem(`preset_${storageKey}`, JSON.stringify(newP));
    };

    const addPreset = () => {
        if (newPreset && !presets.includes(newPreset)) {
            savePresets([...presets, newPreset]);
            setNewPreset('');
        }
    };

    const removePreset = (i: number) => {
        savePresets(presets.filter((_, idx) => idx !== i));
    };

    return (
        <div className={`block ${className}`}>
            <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 font-bold uppercase">{label}</span>
                <div className="flex items-center gap-0.5">
                    <select onChange={handleSelect} className="text-[10px] border border-slate-300 rounded bg-white w-28 py-0.5 ml-2 font-normal text-slate-600 focus:outline-none focus:border-[#f47729] cursor-pointer" title="Select Preset">
                        <option value="">-- Preset --</option>
                        {presets.map((opt, i) => (
                            <option key={i} value={opt}>{opt.split('\n')[0].substring(0, 20)}{opt.length > 20 ? '...' : ''}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => setIsManaging(true)} className="p-1 text-slate-400 hover:text-[#f47729] rounded transition-colors" title="Manage Config">
                        <Settings size={14} />
                    </button>
                </div>
            </div>
            
            {type === 'textarea' ? (
                <textarea name={name} value={value} onChange={onChange} rows={rows} className="w-full border p-2 rounded input-field focus:ring-1 focus:border-[#f47729] resize-none bg-slate-50" />
            ) : (
                <input type="text" name={name} value={value} onChange={onChange} className="w-full border p-2 rounded input-field focus:ring-1 focus:border-[#f47729] bg-slate-50" />
            )}

            {isManaging && (
                <div className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[500px] border border-slate-200 flex flex-col max-h-[80vh] overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-[#091d38] text-white shrink-0">
                            <h3 className="font-bold text-[14px]">Manage Config: {label}</h3>
                            <button type="button" onClick={() => setIsManaging(false)} className="hover:text-[#f47729] transition-colors"><X size={18} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-[#f8f9fa]">
                            <div className="flex gap-2 mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                <textarea value={newPreset} onChange={(e) => setNewPreset(e.target.value)} rows={2} placeholder="Add new preset value..." className="flex-1 text-[12px] border border-slate-300 rounded-lg p-2 resize-none outline-none focus:border-[#f47729]" />
                                <button type="button" onClick={addPreset} className="bg-[#2e3118] text-white px-4 rounded-lg flex items-center gap-1 hover:bg-[#af7a2b] font-bold text-[12px] transition-colors"><Plus size={16}/> Add</button>
                            </div>
                            <div className="space-y-2">
                                {presets.length === 0 && <p className="text-slate-400 text-center py-4 text-[12px]">No presets available.</p>}
                                {presets.map((opt, i) => (
                                    <div key={i} className="flex justify-between items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm group">
                                        <div className="text-[11px] whitespace-pre-wrap flex-1 text-slate-700 font-mono leading-relaxed">{opt}</div>
                                        <button type="button" onClick={() => removePreset(i)} className="text-slate-300 hover:text-[#f47729] bg-slate-50 hover:bg-orange-50 p-1.5 rounded-lg shrink-0 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t bg-white flex justify-end">
                            <button type="button" onClick={() => setIsManaging(false)} className="px-6 py-2 bg-[#f47729] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d66620] transition-colors">Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
