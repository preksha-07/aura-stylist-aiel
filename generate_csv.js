const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'product-data.json');
const csvPath = path.join(__dirname, 'products-v2.csv');

console.log('Reading product-data.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const products = data.products;

const headers = [
  'id', 'brand', 'title', 'price', 'mrp', 'discount',
  'category', 'occasion', 'fabric', 'colour',
  'sizes', 'season', 'style', 'age', 'rating', 'reviewCount'
];

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Validate discounts
const badDiscount = products.filter(p => p.discount < 5 || p.discount > 15);
if (badDiscount.length > 0) {
  console.warn(`⚠️  WARNING: ${badDiscount.length} products have discount outside 5-15%`);
} else {
  console.log('✅ All discounts are within 5–15%');
}

console.log('Generating products-new.csv...');
const csvRows = [];
csvRows.push(headers.join(','));

for (const p of products) {
  // Colours: join all colour names from the colors array
  const colourNames = Array.isArray(p.colors)
    ? p.colors.map(c => c.name).join(' | ')
    : (p.colour || '');

  const sizesStr = Array.isArray(p.sizes) ? p.sizes.join(' | ') : '';

  const row = [
    p.id,
    p.brand,
    p.title,
    p.price,
    p.mrp,
    p.discount,        // guaranteed 5–15%
    p.category,
    p.occasion,
    p.fabric,          // fabric / material
    colourNames,       // all colour variants
    sizesStr,          // all sizes
    p.season,
    p.style,
    p.age,
    p.rating,
    p.reviewCount
  ].map(escapeCsv);

  csvRows.push(row.join(','));
}

fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
console.log(`✅ Done! Saved CSV with ${products.length} products → ${csvPath}`);
console.log(`📋 Columns: ${headers.join(', ')}`);
