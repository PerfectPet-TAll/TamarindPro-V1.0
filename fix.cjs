const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('./src/pages');
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('top-[220px] -translate-y-1/2')) {
        content = content.replace(/top-\[220px\] -translate-y-1\/2/g, 'top-[150px]');
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated ${file}`);
    }
});
console.log(`Total files updated: ${count}`);
