import React from 'react';

interface TamarindLogoProps {
  className?: string;
}

export const TamarindLogo: React.FC<TamarindLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center rounded-full bg-[#191970] border-2 border-[#f47729] shadow-[0_0_15px_rgba(244,119,41,0.3)] ${className}`}>
      <img 
        src="https://static.vecteezy.com/system/resources/thumbnails/014/568/199/small_2x/sweet-tamarind-a-healthy-fruit-that-is-high-in-fiber-help-the-digestive-system-for-vegetarians-png.png" 
        alt="Tamarind Logo" 
        className="w-full h-full object-contain drop-shadow-md" 
      />
    </div>
  );
};
