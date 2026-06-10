import React from 'react';
import * as Icons from 'lucide-react';

interface KpiCardProps {
    title?: string;
    label?: string; // Alias for backward compatibility
    value: React.ReactNode;
    color?: string;
    colorAccent?: string;
    colorValue?: string;
    icon?: any;
    IconComponent?: any; 
    description?: string;
    desc?: string;
    subLabel?: string; // Alias for backward compatibility
}

const KpiCard: React.FC<KpiCardProps> = ({ 
    title, 
    label, 
    value, 
    color, 
    colorAccent,
    colorValue,
    icon, 
    IconComponent: ExplicitIconComponent,
    description, 
    desc,
    subLabel 
}) => {
    const displayTitle = title || label || '';
    const displayDescription = description || subLabel || desc;
    
    const resolvedColor = color || colorAccent || '#5167a2';
    const valColor = color || colorValue || resolvedColor;

    let IconToRender: any = ExplicitIconComponent || icon || Icons.Activity;

    if (typeof IconToRender === 'string') {
        const iconName = IconToRender.charAt(0).toUpperCase() + IconToRender.slice(1).replace(/-./g, x => x[1].toUpperCase());
        IconToRender = (Icons as any)[iconName] || Icons.Circle;
    }

    // Helper to add alpha to hex color
    const getAlphaColor = (hex: string, alpha: string) => {
        if (!hex) return 'transparent';
        if (hex.startsWith('#')) {
            return `${hex}${alpha}`;
        }
        return hex;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-white/60 relative overflow-hidden group h-full transition-all duration-300">
            {/* Watermark Icon */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0">
                <IconToRender size={100} style={{ color: resolvedColor }} />
            </div>

            <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* KPI Title */}
                    <p className="text-[12px] font-black opacity-90 truncate uppercase tracking-widest text-slate-500">
                        {displayTitle}
                    </p>
                    
                    {/* KPI Value */}
                    <div className="flex items-baseline gap-2 mt-1">
                        <h4 className="text-3xl font-black truncate" style={{ color: valColor }}>
                            {value}
                        </h4>
                    </div>

                    {/* KPI Description */}
                    {displayDescription && (
                        <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 truncate uppercase tracking-wider mt-1">
                            {displayDescription}
                        </p>
                    )}
                </div>

                {/* Main Icon Box */}
                <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white transition-transform duration-300 group-hover:rotate-6 bg-opacity-20" 
                    style={{ backgroundColor: getAlphaColor(resolvedColor, '33') }} // 20% Opacity (Hex 33 = 20%)
                >
                    <IconToRender size={22} style={{ color: resolvedColor }} />
                </div>
            </div>
        </div>
    );
};

export default KpiCard;
