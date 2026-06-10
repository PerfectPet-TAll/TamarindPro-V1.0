const fs = require('fs');

const files = [
  'src/pages/Calendar/index.tsx',
  'src/pages/DevPermit/index.tsx',
  'src/pages/SystemLogs/index.tsx',
  'src/pages/UserPermissions/index.tsx'
];

const colorMap = {
  '#022d41': '#2e3118',
  '#f91a47': '#e3624a',
  '#1f2a44': '#2e3118',
  '#c6a75e': '#af7a2b',
  '#ce870a': '#f47729',
  '#5372ba': '#5da7b3',
  '#ff929a': '#e3624a',
  '#fe424d': '#e3624a',
  '#b84530': '#ad7332',
  '#6293b9': '#5167a2',
  '#e8dcc8': '#cdbdae',
  '#7691ad': '#627680',
  '#435665': '#53483e',
  '#1aa6b7': '#5da7b3',
  '#daecf3': '#e2d1c3',
  '#a3c2d2': '#8c7361',
  '#214573': '#091d38',
  '#398797': '#606934',
  '#254268': '#091d38',
  '#cdd0db': '#adb2b0',
  '#7f360f': '#f47729'
};

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [oldC, newC] of Object.entries(colorMap)) {
      content = content.replace(new RegExp(oldC, 'ig'), newC);
    }
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
