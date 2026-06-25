/**
 * AuraStylist — JSON to Excel Exporter
 * Run: node export_excel.js
 * Output: products_dataset.xlsx
 */

const fs   = require('fs');
const path = require('path');

// ── Install xlsx if missing ──────────────────────────────────
let XLSX;
try {
  XLSX = require('xlsx');
} catch(e) {
  console.log('📦 Installing xlsx package...');
  require('child_process').execSync('npm install xlsx', { stdio: 'inherit', cwd: __dirname });
  XLSX = require('xlsx');
}

console.log('📖 Reading product-data.json...');
const raw   = fs.readFileSync(path.join(__dirname, 'product-data.json'), 'utf8');
const data  = JSON.parse(raw);
const prods = data.products;

// ── Sheet 1: Products ────────────────────────────────────────
console.log('📊 Building Products sheet...');
const productRows = prods.map(p => ({
  'Product ID':       p.id,
  'Brand':            p.brand,
  'Title':            p.title,
  'Category':         p.category,
  'Price (₹)':        p.price,
  'MRP (₹)':          p.mrp,
  'Discount %':       p.discount,
  'Rating':           p.rating,
  'Review Count':     p.reviewCount,
  'Bought Last Month':p.boughtLastMonth,
  'Wishlist Count':   p.wishlistCount,
  'In Stock':         p.inStock ? 'Yes' : 'No',
  'Occasion':         p.occasion,
  'Fabric':           p.fabric,
  'Style':            p.style,
  'Season':           p.season,
  'Age Group':        p.age,
  'Colour':           p.colour,
  'Sizes Available':  Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
  'Tags':             Array.isArray(p.tags) ? p.tags.join(', ') : '',
  'Image URL':        p.image,
  'Delivery':         p.delivery,
  'Coupon':           p.coupon || '',
  // Highlights
  'Material':         p.highlights?.['Material Composition'] || '',
  'Fit':              p.highlights?.['Fit'] || '',
  'Pattern':          p.highlights?.['Pattern'] || '',
  'Neck Style':       p.highlights?.['Neck Style'] || '',
  'Sleeve Type':      p.highlights?.['Sleeve Type'] || '',
  'Length':           p.highlights?.['Length'] || '',
  // About (first 2 bullet points)
  'About Line 1':     Array.isArray(p.about) ? p.about[0] || '' : '',
  'About Line 2':     Array.isArray(p.about) ? p.about[1] || '' : '',
  'About Line 3':     Array.isArray(p.about) ? p.about[2] || '' : '',
}));

// ── Sheet 2: Reviews ─────────────────────────────────────────
console.log('💬 Building Reviews sheet...');
const reviewRows = [];
prods.forEach(p => {
  (p.reviews || []).forEach(r => {
    reviewRows.push({
      'Product ID':    p.id,
      'Product Title': p.title,
      'Brand':         p.brand,
      'Reviewer Name': r.name,
      'Rating':        r.rating,
      'Review Title':  r.title,
      'Review Body':   r.body,
      'Date':          r.date,
    });
  });
});

// ── Sheet 3: Brand Summary ────────────────────────────────────
console.log('🏷️  Building Brand Summary sheet...');
const brandMap = {};
prods.forEach(p => {
  if (!brandMap[p.brand]) {
    brandMap[p.brand] = { count: 0, totalRev: 0, minPrice: Infinity, maxPrice: 0, totalDisc: 0 };
  }
  const b = brandMap[p.brand];
  b.count++;
  b.totalRev  += p.reviewCount;
  b.minPrice   = Math.min(b.minPrice, p.price);
  b.maxPrice   = Math.max(b.maxPrice, p.price);
  b.totalDisc += p.discount;
});
const brandRows = Object.entries(brandMap).map(([name, b]) => ({
  'Brand':            name,
  'Total Products':   b.count,
  'Min Price (₹)':    b.minPrice,
  'Max Price (₹)':    b.maxPrice,
  'Avg Discount %':   (b.totalDisc / b.count).toFixed(1),
  'Total Reviews':    b.totalRev,
  'Avg Reviews/Product': Math.round(b.totalRev / b.count),
}));

// ── Build Workbook ────────────────────────────────────────────
console.log('📝 Writing Excel file...');
const wb = XLSX.utils.book_new();

const wsProducts = XLSX.utils.json_to_sheet(productRows);
const wsReviews  = XLSX.utils.json_to_sheet(reviewRows);
const wsBrands   = XLSX.utils.json_to_sheet(brandRows);

// Auto column widths
function autoCols(ws, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  ws['!cols'] = cols.map(k => ({
    wch: Math.min(60, Math.max(k.length, ...rows.slice(0,100).map(r => String(r[k]||'').length))) + 2
  }));
}
autoCols(wsProducts, productRows);
autoCols(wsReviews, reviewRows);
autoCols(wsBrands, brandRows);

XLSX.utils.book_append_sheet(wb, wsProducts, 'Products');
XLSX.utils.book_append_sheet(wb, wsReviews,  'Reviews');
XLSX.utils.book_append_sheet(wb, wsBrands,   'Brand Summary');

const outPath = path.join(__dirname, 'products_dataset.xlsx');
XLSX.writeFile(wb, outPath);

const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
console.log(`\n✅ Excel file created!`);
console.log(`📁 Path: ${outPath}`);
console.log(`📦 Size: ${sizeMB} MB`);
console.log(`📊 Sheets:`);
console.log(`   • Products     — ${productRows.length} rows`);
console.log(`   • Reviews      — ${reviewRows.length} rows`);
console.log(`   • Brand Summary — ${brandRows.length} rows`);
