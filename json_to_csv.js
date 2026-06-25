const fs = require('fs');
const data = JSON.parse(fs.readFileSync('product-data.json'));
const items = data.products || data;
const keys = ['id', 'brand', 'title', 'price', 'category', 'occasion', 'material'];
const csv = [keys.join(',')].concat(items.map(p => keys.map(k => '"' + String(p[k] || '').replace(/"/g, '""') + '"').join(','))).join('\n');
fs.writeFileSync('product-data.csv', csv);
console.log('CSV created');
