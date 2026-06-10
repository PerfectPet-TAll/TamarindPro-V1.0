const fs = require('fs');

const files = [
  'src/pages/Calendar/index.tsx',
  'src/pages/DevPermit/index.tsx',
  'src/pages/SystemLogs/index.tsx',
  'src/pages/UserPermissions/index.tsx',
  'src/pages/SaleOrder/index.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Icon colors & blur glow
    content = content.replace(/#CC0000/g, '#f47729');
    
    // Specifically in SaleOrder which uses #f91a47 for the header
    content = content.replace(/#f91a47/g, '#f47729');

    // Title gradient
    content = content.replace(/from-\[#8B0000\] to-\[#FFD700\]/g, 'from-[#ad7332] to-[#f47729]');
    
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
});
