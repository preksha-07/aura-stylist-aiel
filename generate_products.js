/**
 * AuraStylist — 5000 Product Dataset Generator
 * Run: node generate_products.js
 * Output: product-data.json
 */

const fs = require('fs');
const path = require('path');

// ─── Female reviewer names ────────────────────────────────────
const REVIEWER_NAMES = [
  'Priya S.', 'Sneha R.', 'Asha M.', 'Ritu K.', 'Meena J.', 'Deepa L.', 'Kavya N.', 'Tara P.',
  'Nandini B.', 'Rekha V.', 'Divya T.', 'Pooja A.', 'Ananya C.', 'Neha G.', 'Sita H.',
  'Lakshmi I.', 'Radha J.', 'Uma K.', 'Gayatri L.', 'Padma M.', 'Shreya N.', 'Ankita O.',
  'Bhavna P.', 'Chitra Q.', 'Diya R.', 'Esha S.', 'Falak T.', 'Geeta U.', 'Hema V.',
  'Indira W.', 'Jyoti X.', 'Kamala Y.', 'Latika Z.', 'Manju A.', 'Nisha B.', 'Parvati C.',
  'Rashmi D.', 'Savita E.', 'Trishna F.', 'Usha G.', 'Vandana H.', 'Yamini I.', 'Zara J.',
  'Aisha K.', 'Bhumi L.', 'Chhaya M.', 'Drishti N.', 'Ekta O.', 'Falguni P.', 'Gunjan Q.'
];

// ─── Brands ───────────────────────────────────────────────────
const BRANDS = [
  { name: 'H&M',           tier: 'fast-fashion', priceMin: 500,   priceMax: 8000   },
  { name: 'Zara',          tier: 'premium',       priceMin: 900,   priceMax: 15000  },
  { name: 'Mango',         tier: 'premium',       priceMin: 1500,  priceMax: 18000  },
  { name: 'Uniqlo',        tier: 'mid',           priceMin: 800,   priceMax: 10000  },
  { name: 'ONLY',          tier: 'mid',           priceMin: 700,   priceMax: 8000   },
  { name: 'BIBA',          tier: 'mid',           priceMin: 800,   priceMax: 12000  },
  { name: 'W for Woman',   tier: 'mid',           priceMin: 700,   priceMax: 10000  },
  { name: 'FabIndia',      tier: 'mid',           priceMin: 600,   priceMax: 15000  },
  { name: 'Gucci',         tier: 'luxury',        priceMin: 30000, priceMax: 500000 },
  { name: 'Louis Vuitton', tier: 'ultra-luxury',  priceMin: 50000, priceMax: 1000000},
  { name: 'Forever 21',    tier: 'budget',        priceMin: 500,   priceMax: 4000   }
];

// ─── Occasions ────────────────────────────────────────────────
const OCCASIONS = [
  'Wedding / Ceremony', 'Party / Celebration', 'Casual / Everyday',
  'Office / Professional', 'Date Night', 'College / Campus',
  'Festival / Cultural', 'Beach / Vacation', 'Sports / Active', 'Black Tie / Formal'
];
const OCCASION_TAGS = {
  'Wedding / Ceremony': 'wedding',
  'Party / Celebration': 'party',
  'Casual / Everyday': 'casual',
  'Office / Professional': 'formal',
  'Date Night': 'date-night',
  'College / Campus': 'casual',
  'Festival / Cultural': 'ethnic',
  'Beach / Vacation': 'casual',
  'Sports / Active': 'sports',
  'Black Tie / Formal': 'formal'
};

// ─── Fabrics ──────────────────────────────────────────────────
const FABRICS = [
  'Cotton', 'Silk', 'Linen', 'Denim', 'Chiffon', 'Velvet',
  'Georgette', 'Knit', 'Rayon', 'Satin', 'Polyester', 'Viscose'
];

// ─── Style Aesthetics ─────────────────────────────────────────
const STYLES = [
  'Minimalist', 'Boho', 'Streetwear', 'Classic', 'Romantic',
  'Edgy', 'Preppy', 'Cottagecore', 'K-Fashion', 'Ethnic'
];

// ─── Colors ───────────────────────────────────────────────────
const COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Red', hex: '#E84B4B' },
  { name: 'Blue', hex: '#2F54EB' },
  { name: 'Green', hex: '#3D9A5C' },
  { name: 'Pink', hex: '#FFB7C5' },
  { name: 'Yellow', hex: '#FFC300' },
  { name: 'Beige', hex: '#C9A97C' },
  { name: 'Navy', hex: '#1B2A6B' },
  { name: 'Mustard', hex: '#D4A017' },
  { name: 'Teal', hex: '#2EBFA5' },
  { name: 'Lavender', hex: '#C4A9FF' },
  { name: 'Olive', hex: '#7C8A50' },
  { name: 'Coral', hex: '#FF6B6B' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Mint', hex: '#7DE8CB' },
  { name: 'Peach', hex: '#FFCBA4' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Cobalt', hex: '#0047AB' },
  { name: 'Blush', hex: '#DE5D83' }
];

// ─── Seasons ──────────────────────────────────────────────────
const SEASONS = ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter', 'All Seasons'];

// ─── Age Groups ───────────────────────────────────────────────
const AGE_GROUPS = ['teen', 'young-adult', 'adult', 'mid-adult', 'mature', 'senior'];

// ─── Sizes ────────────────────────────────────────────────────
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Plus Size', 'Petite'];
const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// ─── Category Types ───────────────────────────────────────────
const CATEGORIES = ['Top', 'Bottom', 'Dress', 'Ethnic Set', 'Outerwear', 'Jumpsuit'];

// ─── Product name templates by occasion and style ─────────────
const PRODUCT_TEMPLATES = {
  Top: [
    'Floral Print {fabric} Crop Top', '{fabric} Off-Shoulder Blouse', 'Striped {fabric} Shirt',
    '{fabric} Wrap Top with Tie-Up', 'Embroidered {fabric} Kurti', '{fabric} Peplum Top',
    'Solid {fabric} Sleeveless Top', '{fabric} V-Neck Fitted Top', 'Printed {fabric} Casual Top',
    '{fabric} Halter Neck Top', 'Lace Trim {fabric} Blouse', '{fabric} Smocked Top',
    'Tie-Dye {fabric} Tank Top', '{fabric} Ruffled Sleeve Top', 'Polka Dot {fabric} Blouse',
    'Sheer {fabric} Overlay Top', '{fabric} Cold Shoulder Top', 'Abstract Print {fabric} Top',
    '{fabric} Button-Down Shirt', 'Cutout Detail {fabric} Top'
  ],
  Bottom: [
    '{fabric} Wide-Leg Trousers', 'High-Rise {fabric} Jeans', '{fabric} Palazzo Pants',
    'Floral {fabric} Midi Skirt', '{fabric} Pencil Skirt', 'Pleated {fabric} Mini Skirt',
    '{fabric} Jogger Pants', 'Flared {fabric} Skirt', '{fabric} Cargo Pants',
    'Wrap {fabric} Skirt', '{fabric} Culottes', 'Printed {fabric} Leggings',
    '{fabric} High-Slit Maxi Skirt', 'Striped {fabric} Shorts', '{fabric} Bermuda Shorts',
    'Distressed {fabric} Denim Shorts', '{fabric} Layered Skirt', 'Ethnic {fabric} Patiala',
    '{fabric} Track Pants', 'Pleated {fabric} A-Line Skirt'
  ],
  Dress: [
    'Floral {fabric} Maxi Dress', '{fabric} Bodycon Midi Dress', 'Off-Shoulder {fabric} Mini Dress',
    'Wrap {fabric} Dress', '{fabric} A-Line Party Dress', 'Printed {fabric} Shift Dress',
    '{fabric} Slip Dress', 'Tiered {fabric} Boho Dress', '{fabric} Shirt Dress',
    'Ruched {fabric} Evening Dress', 'Embroidered {fabric} Anarkali', '{fabric} Pleated Sundress',
    'Sequin {fabric} Cocktail Dress', '{fabric} Asymmetric Hem Dress', 'Halter {fabric} Backless Dress',
    '{fabric} Puff Sleeve Dress', 'Balloon Sleeve {fabric} Dress', '{fabric} Slip-On Maxi Dress',
    'Vintage {fabric} Tea Dress', '{fabric} Ruffled Wrap Dress'
  ],
  'Ethnic Set': [
    '{fabric} Kurta with Palazzo Set', '{fabric} Anarkali Suit Set', '{fabric} Straight Kurta with Dupatta',
    '{fabric} Sharara Set', '{fabric} Lehenga Choli', '{fabric} Saree with Blouse',
    '{fabric} Salwar Kameez Set', '{fabric} Indo-Western Fusion Set', '{fabric} Kurti with Churidar',
    '{fabric} Kaftan with Pants', '{fabric} Patiala Suit Set', '{fabric} Gown Style Kurta',
    'Embroidered {fabric} Ethnic Set', '{fabric} Festival Outfit Set', '{fabric} Bridal Lehenga Set'
  ],
  Outerwear: [
    '{fabric} Blazer', '{fabric} Trench Coat', '{fabric} Bomber Jacket',
    'Cropped {fabric} Jacket', '{fabric} Overcoat', '{fabric} Shrug',
    '{fabric} Denim Jacket', '{fabric} Cape Jacket', '{fabric} Double-Breasted Coat',
    '{fabric} Puffer Jacket'
  ],
  Jumpsuit: [
    'Halter Neck {fabric} Jumpsuit', '{fabric} Wide-Leg Jumpsuit', 'Floral {fabric} Playsuit',
    '{fabric} Strapless Jumpsuit', 'Printed {fabric} Romper', '{fabric} Utility Jumpsuit',
    'Off-Shoulder {fabric} Jumpsuit', '{fabric} Belted Jumpsuit', 'Ruched {fabric} Playsuit',
    '{fabric} Co-ord Set'
  ]
};

// ─── Highlight templates by category ─────────────────────────
function generateHighlights(fabric, category, occasion) {
  const base = {
    'Material Composition': fabric,
    'Fit': pick(['Relaxed', 'Regular', 'Slim', 'Oversized', 'Fitted', 'Straight']),
    'Occasion': occasion,
    'Pattern': pick(['Solid', 'Printed', 'Floral', 'Striped', 'Embroidered', 'Abstract', 'Geometric', 'Tie-Dye'])
  };
  if (category === 'Top' || category === 'Dress' || category === 'Jumpsuit') {
    base['Neck Style'] = pick(['V-Neck', 'Round Neck', 'Square Neck', 'Off-Shoulder', 'Halter Neck', 'Cowl Neck']);
    base['Sleeve Type'] = pick(['Sleeveless', 'Short Sleeve', 'Full Sleeve', '3/4 Sleeve', 'Cap Sleeve', 'Puff Sleeve']);
  }
  if (category === 'Dress' || category === 'Bottom') {
    base['Length'] = pick(['Mini (Above Knee)', 'Midi (Knee to Calf)', 'Maxi (Floor Length)', 'Knee Length']);
  }
  if (category === 'Ethnic Set') {
    base['Style'] = pick(['Straight Cut', 'A-Line', 'Flared', 'Anarkali', 'Sharara']);
    base['Work'] = pick(['Mirror Work', 'Thread Embroidery', 'Zari Work', 'Block Print', 'Bandhani']);
  }
  base['Fabric'] = fabric + ' Blend';
  return base;
}

// ─── Review templates ─────────────────────────────────────────
const REVIEW_POSITIVES = [
  'Absolutely love this piece! The fabric is super soft and the colour is exactly as shown.',
  'Perfect fit! Runs true to size. Great quality for the price.',
  'Stunning design. Got so many compliments wearing this!',
  'Amazing quality. The stitching is impeccable and the fabric feels luxurious.',
  'Exactly what I was looking for. Fast delivery and beautiful packaging.',
  'The colour is gorgeous and the fit is flattering. Will definitely order more!',
  'Exceeded my expectations. Feels even better in person than in the photos.',
  'Wore this to a party and it was a showstopper. Love it!',
  'Beautiful piece! The material is breathable and comfortable for long hours.',
  'Superb quality! The embroidery / print is detailed and elegant.',
  'Great value for money. Looks premium without breaking the bank.',
  'My new favourite outfit! The drape is perfect and it looks stunning.',
  'Bought this for a special occasion and received so many compliments.',
  'Fits like a dream! The length is perfect and the fabric is non-itchy.',
  'Love how versatile this is — wore it for office, then dressed it up for dinner!'
];

const REVIEW_NEGATIVES = [
  'Colour looks slightly different from photos, but the quality is decent.',
  'Sizing runs a bit small. Suggest ordering one size up.',
  'Good quality but delivery took longer than expected.',
  'Nice design but the fabric is slightly thinner than expected.',
  'The stitching came undone after a few washes. Disappointing.',
  'Colour faded slightly after first wash. Recommend hand-washing.',
  'Not as described — the length was shorter than shown.',
  'The material feels synthetic even though it says natural fabric.'
];

const REVIEW_TITLES = [
  'Worth every rupee!', 'Highly recommend!', 'Love this purchase!', 'Beautiful piece!',
  'Great quality', 'Perfect fit!', 'Stunning!', 'Good buy', 'Nice design', 'Happy with purchase',
  'Decent quality', 'Okay for the price', 'Could be better', 'Slightly disappointed',
  'Will buy again!', 'Excellent product', 'Good value', 'Impressed!', 'Amazing!'
];

const DATES = [
  '5 Jun 2026', '28 May 2026', '20 May 2026', '10 May 2026', '2 May 2026',
  '25 Apr 2026', '18 Apr 2026', '10 Apr 2026', '5 Apr 2026', '28 Mar 2026',
  '20 Mar 2026', '12 Mar 2026', '5 Mar 2026', '25 Feb 2026', '18 Feb 2026'
];

// ─── Unsplash image pools by category (verified, stable IDs) ──
const IMAGES = {
  Top: [
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80',
    'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80',
    'https://images.unsplash.com/photo-1562572159-4efd90232b6a?w=600&q=80',
    'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
    'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80',
    'https://images.unsplash.com/photo-1475180429745-57e9f879e60c?w=600&q=80',
    'https://images.unsplash.com/photo-1559060017-445fb3e17250?w=600&q=80',
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80',
    'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&q=80',
    'https://images.unsplash.com/photo-1598531122440-2fcec3c41e25?w=600&q=80'
  ],
  Bottom: [
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80',
    'https://images.unsplash.com/photo-1561861422-a549073e547a?w=600&q=80',
    'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&q=80',
    'https://images.unsplash.com/photo-1548549557-dbe9946621da?w=600&q=80',
    'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&q=80',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80',
    'https://images.unsplash.com/photo-1609248232936-ed2e7a50b680?w=600&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80'
  ],
  Dress: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80',
    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80',
    'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=600&q=80',
    'https://images.unsplash.com/photo-1546961342-ea5f62d6d546?w=600&q=80',
    'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&q=80',
    'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&q=80'
  ],
  'Ethnic Set': [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=600&q=80',
    'https://images.unsplash.com/photo-1617195737496-bc30194e3a19?w=600&q=80',
    'https://images.unsplash.com/photo-1597983073493-88cd0d0ce4fe?w=600&q=80',
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&q=80',
    'https://images.unsplash.com/photo-1575359291870-5e7e34498dcc?w=600&q=80',
    'https://images.unsplash.com/photo-1640944503289-e5de40e8a45e?w=600&q=80',
    'https://images.unsplash.com/photo-1542338106-5e9fc0f06375?w=600&q=80',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
    'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&q=80'
  ],
  Outerwear: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
  ],
  Jumpsuit: [
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80',
    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80',
    'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80'
  ]
};

// ─── Utility helpers ──────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateReviews(count, productTitle) {
  const reviews = [];
  const usedNames = new Set();
  const actualCount = rndInt(5, 8); // 5 to 8 reviews per product
  for (let i = 0; i < actualCount; i++) {
    let name;
    do { name = pick(REVIEWER_NAMES); } while (usedNames.has(name));
    usedNames.add(name);
    const rating = i < 2 ? rndInt(4, 5) : (i === actualCount - 1 ? rndInt(1, 3) : rndInt(3, 5));
    reviews.push({
      name,
      rating,
      title: pick(REVIEW_TITLES),
      body: rating >= 4 ? pick(REVIEW_POSITIVES) : pick(REVIEW_NEGATIVES),
      date: DATES[i % DATES.length]
    });
  }
  return reviews;
}

function generateRatingsBreakdown(avgRating) {
  // Generate realistic star breakdown given average rating
  const total = rndInt(50, 2000);
  const five = Math.round(total * (avgRating / 5) * rndFloat(0.6, 0.9));
  const four = Math.round(total * rndFloat(0.1, 0.2));
  const three = Math.round(total * rndFloat(0.05, 0.12));
  const two = Math.round(total * rndFloat(0.02, 0.07));
  const one = total - five - four - three - two;
  return { '5': Math.max(five, 0), '4': Math.max(four, 0), '3': Math.max(three, 0), '2': Math.max(two, 0), '1': Math.max(one, 0) };
}

function pickColors(count = null) {
  const n = count || rndInt(2, 5);
  const selected = pickN(COLORS, n);
  selected[0].active = true;
  return selected.map(c => ({ name: c.name, hex: c.hex, ...(c.active ? { active: true } : {}) }));
}

function pickSizes(category) {
  if (category === 'Ethnic Set' || category === 'Dress') {
    return pickN(COMMON_SIZES, rndInt(3, 6));
  }
  if (category === 'Bottom') {
    const waistSizes = ['24', '26', '28', '30', '32', '34', '36'];
    const useSandard = Math.random() > 0.5;
    return useSandard ? pickN(COMMON_SIZES, rndInt(4, 6)) : pickN(waistSizes, rndInt(4, 7));
  }
  return pickN([...COMMON_SIZES, 'Plus Size', 'Petite'], rndInt(4, 7));
}

// ─── Main Product Generator ───────────────────────────────────
function generateProduct(id, brandData, category, occasion, fabric, style, season, ageGroup) {
  const templates = PRODUCT_TEMPLATES[category];
  const template = pick(templates);
  const title = template.replace('{fabric}', fabric);
  const color1 = pick(COLORS);
  
  // Selling price is within the brand's authentic range; MRP is derived from it
  const discountPct = rndInt(5, 15);
  const finalPrice = Math.round(rndInt(brandData.priceMin, brandData.priceMax) / 50) * 50;
  const mrp = Math.round(finalPrice / (1 - discountPct / 100) / 50) * 50;

  const rating = rndFloat(3.2, 5.0);
  const reviewCount = rndInt(50, 15000);
  const boughtLastMonth = rndInt(10, Math.min(5000, reviewCount));

  const highlights = generateHighlights(fabric, category, occasion);
  const colors = pickColors();
  const sizes = pickSizes(category);
  const reviews = generateReviews(8, title);
  const ratingsBreakdown = generateRatingsBreakdown(rating);

  const imagePool = IMAGES[category] || IMAGES['Dress'];
  const image = imagePool[id % imagePool.length];
  const images = [image]; // Single picture

  const aboutPoints = [
    `Material & Care: Crafted from premium ${fabric} blend. Hand wash or gentle machine wash in cold water.`,
    `Design & Fit: Features a tailored silhouette with a comfortable regular fit. Please refer to our size guide before ordering.`,
    `Occasion: Ideally suited for ${occasion} events. Pairs beautifully with minimalistic accessories.`,
    `Key Attributes: Detailed craftsmanship, breathable fabric, and excellent durability make it a wardrobe staple.`,
    `Length & Style: Categorized under our exclusive '${category}' collection with a modern ${style} aesthetic.`,
    `Warranty & Authenticity: 100% authentic ${brandData.name} product with assured quality check.`
  ];
  if (Math.random() > 0.5) aboutPoints.push(`Color Details: Rich ${color1.name.toLowerCase()} hue that resists fading after multiple washes.`);
  if (Math.random() > 0.5) aboutPoints.push(`Sustainable: Produced adhering to ethical and eco-friendly manufacturing standards.`);

  const occasionTag = OCCASION_TAGS[occasion] || 'casual';
  const tags = [
    occasionTag,
    fabric.toLowerCase(),
    season.toLowerCase(),
    style.toLowerCase().replace(' ', '-'),
    category.toLowerCase().replace(' ', '-')
  ];

  const offers = [
    { icon: '🎁', text: `Flat ${discountPct}% OFF on this item` },
    { icon: '🚚', text: 'Free Delivery on orders above ₹499' },
    { icon: '🔄', text: '10-day easy returns and exchanges' },
    { icon: '💳', text: 'Bank Offer: ₹250 Cashback on select cards' }
  ];

  return {
    id,
    brand: brandData.name,
    title: `${brandData.name} ${title} for Women`,
    rating,
    reviewCount,
    boughtLastMonth,
    price: finalPrice,
    mrp,
    discount: discountPct,
    coupon: Math.random() > 0.6 ? `SAVE${rndInt(10, 30)}` : null,
    delivery: `Free Delivery by ${pick(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}, ${rndInt(22, 30)} Jun`,
    inStock: Math.random() > 0.05,
    image,
    images,
    colors,
    sizes,
    highlights,
    about: aboutPoints,
    offers,
    ratingsBreakdown,
    reviews,
    tags,
    // Recommendation engine fields
    budget: finalPrice,
    purchases: boughtLastMonth,
    reviewsCount: reviewCount,
    wishlistCount: rndInt(100, 5000),
    size: sizes,
    occasion: occasionTag,
    age: ageGroup,
    colour: color1.name.toLowerCase(),
    fabric: fabric.toLowerCase(),
    season: season.toLowerCase(),
    style: style.toLowerCase().replace(' ', '-'),
    category
  };
}

// ─── Generate 5000 products ───────────────────────────────────
console.log('🚀 Generating 5000 products...');

const products = [];
let id = 1;

// Distribute products evenly across all combinations
const totalNeeded = 500;
let i = 0;

while (products.length < totalNeeded) {
  const brand = BRANDS[i % BRANDS.length];
  const category = CATEGORIES[Math.floor(i / BRANDS.length) % CATEGORIES.length];
  const occasion = OCCASIONS[Math.floor(i / (BRANDS.length * CATEGORIES.length)) % OCCASIONS.length];
  const fabric = FABRICS[i % FABRICS.length];
  const style = STYLES[i % STYLES.length];
  const season = SEASONS[i % SEASONS.length];
  const ageGroup = AGE_GROUPS[i % AGE_GROUPS.length];

  const product = generateProduct(id++, brand, category, occasion, fabric, style, season, ageGroup);
  products.push(product);

  i++;
  if (i % 500 === 0) console.log(`  Generated ${products.length} products...`);
}

// ─── Size Guide (existing structure) ─────────────────────────
const sizeGuide = [
  { size: 'XS', bust: '80cm', waist: '63cm', hips: '87cm', fits: 'UK 6 / US 2' },
  { size: 'S',  bust: '84cm', waist: '67cm', hips: '91cm', fits: 'UK 8 / US 4' },
  { size: 'M',  bust: '88cm', waist: '71cm', hips: '95cm', fits: 'UK 10 / US 6' },
  { size: 'L',  bust: '94cm', waist: '77cm', hips: '101cm', fits: 'UK 12 / US 8' },
  { size: 'XL', bust: '100cm', waist: '83cm', hips: '107cm', fits: 'UK 14 / US 10' },
  { size: 'XXL', bust: '108cm', waist: '91cm', hips: '115cm', fits: 'UK 16 / US 12' }
];

const output = { products, sizeGuide };
const outputPath = path.join(__dirname, 'product-data.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

const stats = fs.statSync(outputPath);
console.log(`\n✅ Done! Generated ${products.length} products`);
console.log(`📦 File size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
console.log(`📁 Saved to: ${outputPath}`);

// Print breakdown
const brandCount = {};
products.forEach(p => { brandCount[p.brand] = (brandCount[p.brand] || 0) + 1; });
console.log('\n📊 Products per brand:');
Object.entries(brandCount).sort((a,b) => b[1]-a[1]).forEach(([b,c]) => console.log(`   ${b}: ${c}`));
