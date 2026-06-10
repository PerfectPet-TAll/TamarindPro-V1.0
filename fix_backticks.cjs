const fs = require('fs');
const files = ['/src/pages/CustomerDirectory/index.tsx', '/src/pages/SaleRepDirectory/index.tsx'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\`/g, '`');
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed backticks and dollars in new files');
