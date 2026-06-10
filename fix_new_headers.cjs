const fs = require('fs');

const fixHeader = (file, iconName) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace the simple header icon container with the exact System Config copy
    const oldIconContainerRegex = /<div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-\[#f47729\] border border-\[#d2af94\] shadow-sm relative overflow-hidden">[\s\S]*?<\/div>/m;
    const newIconContainer = `<div className="relative flex items-center justify-center group cursor-default shrink-0">
                            <div className="absolute inset-0 bg-[#f47729] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                            <div className="relative z-10 p-1.5 border border-[#f47729]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                                <${iconName} size={28} strokeWidth={2.5} className="text-[#f47729]" />
                            </div>
                        </div>`;

    content = content.replace(oldIconContainerRegex, newIconContainer);
    
    // Replace the text gradient
    content = content.replace(/<span className="text-\[#f47729\]">/g, '<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ad7332] to-[#f47729]">');

    fs.writeFileSync(file, content);
  }
};

fixHeader('./src/pages/CustomerDirectory/index.tsx', 'Users');
fixHeader('./src/pages/SaleRepDirectory/index.tsx', 'Briefcase');

console.log('Fixed headers of new modules');
