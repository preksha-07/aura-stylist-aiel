const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'product-data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

data.products.forEach(p => {
  // Map existing fields to required fields for the recommendation engine
  p.budget = p.price;
  p.purchases = p.boughtLastMonth;
  p.reviewsCount = p.reviewCount;
  if (!p.wishlistCount) {
    p.wishlistCount = Math.floor(Math.random() * 500) + 100;
  }
  if (!p.size && p.sizes) {
    p.size = p.sizes;
  }
  
  // Extract features from text if they don't exist
  const text = (p.title + " " + (p.tags||[]).join(" ") + " " + JSON.stringify(p.highlights)).toLowerCase();
  
  if (!p.occasion) {
    if (text.includes('party') || text.includes('club')) p.occasion = 'party';
    else if (text.includes('formal') || text.includes('office')) p.occasion = 'formal';
    else if (text.includes('sport') || text.includes('active')) p.occasion = 'sports';
    else if (text.includes('wedding') || text.includes('festive') || text.includes('ethnic')) p.occasion = 'wedding';
    else p.occasion = 'casual';
  }
  
  if (!p.age) p.age = 'adults';
  
  if (!p.colour) {
    const colours = ['black', 'white', 'red', 'blue', 'green', 'pink', 'yellow', 'beige', 'navy', 'mustard', 'teal'];
    p.colour = colours.find(c => text.includes(c)) || 'blue'; // default
  }
  
  if (!p.fabric) {
    const fabrics = ['cotton', 'denim', 'silk', 'linen', 'polyester', 'wool', 'satin', 'rayon', 'viscose'];
    p.fabric = fabrics.find(f => text.includes(f)) || 'cotton'; // default
  }
  
  if (!p.season) {
    const seasons = ['summer', 'winter', 'spring', 'autumn', 'fall'];
    p.season = seasons.find(s => text.includes(s)) || 'summer';
  }
  
  if (!p.style) {
    if (text.includes('ethnic') || text.includes('kurti') || text.includes('kurta')) p.style = 'ethnic';
    else if (text.includes('retro') || text.includes('vintage')) p.style = 'retro';
    else if (text.includes('athletic') || text.includes('sport')) p.style = 'athletic';
    else p.style = 'casual'; // Or western
  }
  
  if (!p.category) {
    if (text.includes('dress')) p.category = 'Dress';
    else if (text.includes('pant') || text.includes('jeans') || text.includes('trouser')) p.category = 'Bottom';
    else p.category = 'Top'; // default
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('product-data.json has been updated with required recommendation fields.');
