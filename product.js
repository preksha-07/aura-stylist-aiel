/* ============================================================
   AuraStylist — product.js  (v2 — Two-View SPA)
   Grid View  ↔  Detail View page transition
   ============================================================ */

'use strict';

// ─── State ───────────────────────────────────────────────────
let allProducts   = [];
let rawProducts   = [];
let sizeGuideData = [];
let prefs         = {};
let currentSort   = 'relevance';
let activeProduct = null;   // product currently shown in detail view
let wishlist      = new Set();

// Per-product transient state (selected color / size / gallery index)
const cardState = {};

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Read preferences from session
  try {
    const raw = sessionStorage.getItem('aurastylist_prefs');
    if (raw) prefs = JSON.parse(raw);
  } catch (_) {}

  // Load product data
  try {
    const res  = await fetch('product-data.json');
    const data = await res.json();
    sizeGuideData = data.sizeGuide || [];
    rawProducts = data.products;

    // Auto-hydrate missing fields for the recommendation engine
    data.products.forEach(p => {
      p.budget = p.price;
      p.purchases = p.boughtLastMonth;
      p.reviewsCount = p.reviewCount;
      if (!p.wishlistCount) p.wishlistCount = Math.floor(Math.random() * 500) + 100;
      if (!p.size && p.sizes) p.size = p.sizes;
      
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
        p.colour = colours.find(c => text.includes(c)) || 'blue';
      }
      if (!p.fabric) {
        const fabrics = ['cotton', 'denim', 'silk', 'linen', 'polyester', 'wool', 'satin', 'rayon', 'viscose'];
        p.fabric = fabrics.find(f => text.includes(f)) || 'cotton';
      }
      if (!p.season) {
        const seasons = ['summer', 'winter', 'spring', 'autumn', 'fall'];
        p.season = seasons.find(s => text.includes(s)) || 'summer';
      }
      if (!p.style) {
        if (text.includes('ethnic') || text.includes('kurti') || text.includes('kurta')) p.style = 'ethnic';
        else if (text.includes('retro') || text.includes('vintage')) p.style = 'retro';
        else if (text.includes('athletic') || text.includes('sport')) p.style = 'athletic';
        else p.style = 'casual';
      }
      if (!p.category) {
        if (text.includes('dress')) p.category = 'Dress';
        else if (text.includes('pant') || text.includes('jeans') || text.includes('trouser')) p.category = 'Bottom';
        else p.category = 'Top';
      }
    });

    if (prefs && Object.keys(prefs).length > 0) {
      // Parse budget properly (e.g. '₹1k – 5k' or '₹1000 - 5000')
      let budgetLimit = Infinity;
      if (prefs.budget) {
        const matches = prefs.budget.match(/\d+([.,]\d+)?/g);
        if (matches && matches.length > 0) {
          let maxVal = parseFloat(matches[matches.length - 1].replace(',', ''));
          if (prefs.budget.toLowerCase().includes('k')) maxVal *= 1000;
          if (maxVal > 0) budgetLimit = maxVal * 1.5; // Allow some flex in budget
        }
      }
      
      const scoredProducts = data.products.map(p => {
        let score = 70; // Base score
        const tagsStr = Array.isArray(p.tags) ? p.tags.join(" ") : "";
        const aboutStr = Array.isArray(p.about) ? p.about.join(" ") : "";
        const highlightsStr = p.highlights ? JSON.stringify(p.highlights) : "";
        const text = (p.title + " " + tagsStr + " " + highlightsStr + " " + aboutStr).toLowerCase();
        
        // 1. Strict filtering
        if (prefs.budget && p.price > budgetLimit) score -= 40; // Penalty for over budget
        
        // 2. Occasion matching
        if (prefs.occasion) {
          const occText = prefs.occasion.toLowerCase();
          if (p.occasion === occText || text.includes(occText)) score += 15;
          else score -= 20; // Penalty for wrong occasion
        }
        
        // 3. Keyword matching from description
        if (prefs.desc) {
          const tokens = prefs.desc.toLowerCase().split(/\s+/).filter(t => t.length > 3);
          let matchCount = 0;
          tokens.forEach(t => { if (text.includes(t)) matchCount++; });
          if (matchCount > 0) score += (matchCount * 10);
        }
        
        // 4. Colors
        if (prefs.colors && prefs.colors.length > 0) {
          const colorMatched = prefs.colors.some(c => p.colour === c.toLowerCase() || text.includes(c.toLowerCase()));
          if (colorMatched) score += 15;
        }
        
        // 5. Fabrics
        if (prefs.fabrics && prefs.fabrics.length > 0) {
          const fabricMatched = prefs.fabrics.some(f => p.fabric === f.toLowerCase() || text.includes(f.toLowerCase()));
          if (fabricMatched) score += 15;
        }

        // 6. Styles
        if (prefs.styles && prefs.styles.length > 0) {
          const styleMatched = prefs.styles.some(s => p.style === s.toLowerCase() || text.includes(s.toLowerCase()));
          if (styleMatched) score += 15;
        }

        p._matchScore = Math.min(99, Math.max(40, score));
        return { product: p, score };
      }).filter(item => item.score >= 50); // Keep only matching products
      
      scoredProducts.sort((a, b) => b.score - a.score);
      
      if (scoredProducts.length > 0) {
        allProducts = scoredProducts.map(i => i.product);
        const countEl = document.getElementById('results-count');
        if (countEl) countEl.textContent = `Showing ${scoredProducts.length} matches`;
      } else {
        allProducts = data.products;
        const countEl = document.getElementById('results-count');
        if (countEl) countEl.textContent = `Showing all ${data.products.length} products (No exact matches found)`;
      }
    } else {
      allProducts = data.products;
    }
  } catch (e) {
    console.error('Failed to load product data:', e);
    return;
  }

  // Initialise per-product state
  allProducts.forEach(p => {
    const activeColor = p.colors.find(c => c.active) || p.colors[0];
    cardState[p.id] = {
      colorName: activeColor?.name || '',
      size: '',
      galleryIdx: 0,
    };
  });

  renderHeaderPrefs();
  renderFilterChips();
  renderGrid();
  initSort();
  initScrollShadow();

  // Handle browser back/forward
  window.addEventListener('popstate', e => {
    if (e.state && e.state.productId) {
      const p = allProducts.find(x => x.id === e.state.productId);
      if (p) openDetailView(p, false);
    } else {
      closeDetailView(false);
    }
  });

  // Handle initial hash routing
  if (window.location.hash && window.location.hash.startsWith('#product/')) {
    const hashId = parseInt(window.location.hash.split('/')[1], 10);
    // Find in allProducts (which are the filtered items), if missing, fallback to rawProducts if we had them.
    let targetProduct = allProducts.find(x => x.id === hashId);
    if (!targetProduct && rawProducts && rawProducts.length) {
      targetProduct = rawProducts.find(x => x.id === hashId);
      if (targetProduct) console.warn("Product hidden by filters. Showing it anyway due to direct link.");
    }
    
    if (targetProduct) {
      setTimeout(() => openDetailView(targetProduct, false), 50);
    }
  }
});

// ─── Header Preference Chips ──────────────────────────────────
function renderHeaderPrefs() {
  const container = document.getElementById('header-prefs');
  if (!container || !prefs.occasion) return;
  const chips = [prefs.occasion, prefs.budget, ...(prefs.styles || []).slice(0,1)].filter(Boolean);
  container.innerHTML = chips.map(c => `<span class="pref-chip">${c}</span>`).join('');
}

// ─── Filter Chips ─────────────────────────────────────────────
function renderFilterChips() {
  const row = document.getElementById('filters-row');
  if (!row) return;

  const tags = [
    prefs.occasion  && capitalize(prefs.occasion),
    prefs.season    && capitalize(prefs.season),
    ...(prefs.fabrics || []).map(capitalize),
    prefs.budget    && `Budget: ${prefs.budget}`,
    prefs.age       && capitalize(prefs.age),
    ...(prefs.colors || []).map(c => capitalize(c) + ' tones'),
    ...(prefs.styles || []).map(capitalize),
    prefs.size      && `Size: ${prefs.size}`,
  ].filter(Boolean);

  if (!tags.length) {
    row.innerHTML = '<span style="font-size:12px;color:var(--text-muted);">All products — AI curated</span>';
    return;
  }
  row.innerHTML = tags.map((t, i) =>
    `<span class="filter-tag">${t}
      <span class="remove" onclick="removeFilter(event,this)">✕</span>
     </span>`
  ).join('');
}

window.removeFilter = function(e, el) {
  e.stopPropagation();
  el.closest('.filter-tag').remove();
};

// ─── Grid Render ──────────────────────────────────────────────
function renderGrid(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const list = products || sortedProducts();

  document.getElementById('results-count').textContent =
    `Showing ${list.length} product${list.length !== 1 ? 's' : ''}`;

  grid.innerHTML = '';
  list.forEach((p, i) => {
    const card = createProductCard(p, i);
    grid.appendChild(card);
  });

  // Intersection observer for staggered fade-in
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06 });
  grid.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ─── Build a Product Card ────────────────────────────────────
function createProductCard(p, idx) {
  const card = document.createElement('div');
  card.className = 'product-card fade-in';
  card.dataset.id = p.id;
  card.style.transitionDelay = `${idx * 0.05}s`;

  const extraColors = p.colors.length > 4 ? p.colors.length - 4 : 0;
  const swatches = p.colors.slice(0, 4).map(c =>
    `<span class="card-color-dot" style="background:${c.hex};" title="${c.name}"></span>`
  ).join('');

  const matchBadge = p._matchScore ? `<span class="card-match-badge" style="position:absolute; top:8px; left:8px; background:linear-gradient(135deg, var(--lavender), var(--sky)); color:white; padding:4px 8px; border-radius:12px; font-size:11px; font-weight:600; z-index:2; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">${p._matchScore}% Match</span>` : '';

  card.innerHTML = `
    <div class="card-img-wrap" style="position:relative;">
      ${matchBadge}
      <img src="${p.image}" alt="${p.title}" loading="lazy"
           onerror="this.style.opacity=0" />
      <span class="card-discount-badge">-${p.discount}%</span>
    </div>
    <div class="card-colors">
      ${swatches}
      ${extraColors ? `<span class="card-color-more">+${extraColors}</span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-brand">${p.brand}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-rating">
        <span class="stars">${renderStars(p.rating)}</span>
        <span class="rating-num">${p.rating}</span>
        <span class="review-count">(${fmtNum(p.reviewCount)})</span>
      </div>
      <div class="card-price-row">
        <span class="price-current">₹${p.price}</span>
        <span class="price-mrp">MRP ₹${fmtNum(p.mrp)}</span>
        <span class="price-off">${p.discount}% off</span>
      </div>
      <button class="btn-add-cart" onclick="cardAddToCart(event, ${p.id})">Add to Cart</button>
    </div>
  `;

  // Clicking the card (not the button) opens detail view
  card.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) return;
    openDetailView(p, true);
  });

  return card;
}

window.cardAddToCart = function(e, id) {
  e.stopPropagation();
  const btn = e.target;
  btn.textContent = '✓ Added!';
  btn.style.background = 'linear-gradient(135deg, #2E8B57, #52B788)';
  setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 1800);
};

// ─── VIEW TRANSITIONS ─────────────────────────────────────────

/**
 * Show the DETAIL VIEW for a product.
 * pushHistory: true = push a new history state
 */
function openDetailView(product, pushHistory = true) {
  activeProduct = product;
  const state = cardState[product.id];

  // Fill detail view content
  populateDetailView(product, state);

  // Push history state for browser back button support
  if (pushHistory) {
    history.pushState({ productId: product.id }, '', `#product/${product.id}`);
  }

  const gridView   = document.getElementById('grid-view');
  const detailView = document.getElementById('detail-view');

  // Slide grid out to the left
  gridView.classList.add('slide-out-left');

  // Slide detail in from the right
  detailView.classList.remove('hidden');
  // Force reflow so the transition fires
  detailView.offsetHeight;
  detailView.classList.add('slide-in');

  // Scroll detail page to top
  const detailPage = document.getElementById('detail-page');
  if (detailPage) detailPage.scrollTop = 0;

  // Update document title
  document.title = `${product.brand} — ${product.title.slice(0, 50)} | AuraStylist`;
}

/**
 * Go back to the GRID VIEW.
 * pushHistory: true = push history (normal back button pop doesn't need this)
 */
window.showGridView = function(pushHistory = true) {
  activeProduct = null;

  if (pushHistory) {
    history.pushState({ productId: null }, '', window.location.pathname + window.location.search);
  }

  const gridView   = document.getElementById('grid-view');
  const detailView = document.getElementById('detail-view');

  // Slide detail out to the right
  detailView.classList.remove('slide-in');
  detailView.classList.add('slide-out-right');

  // Slide grid back in from the left
  gridView.classList.remove('slide-out-left');

  // After animation, hide detail view completely
  setTimeout(() => {
    detailView.classList.add('hidden');
    detailView.classList.remove('slide-out-right');
    document.title = 'AuraStylist — AI Outfit Recommendations';
  }, 440);
};

// Close = alias for grid view
window.closeDetailView = function(pushHistory) { window.showGridView(pushHistory); };

// ─── Populate Detail View ─────────────────────────────────────
function populateDetailView(p, state) {

  // Header breadcrumb
  document.getElementById('breadcrumb-brand').textContent = p.brand;

  // Wishlist button
  const wishBtn = document.getElementById('detail-wish-btn');
  wishBtn.textContent = wishlist.has(p.id) ? '♥' : '♡';
  wishBtn.classList.toggle('active', wishlist.has(p.id));

  // Gallery — main image only
  const mainSrc = document.getElementById('gallery-main-src');
  mainSrc.src = p.image;
  mainSrc.alt = p.title;

  // Product info
  document.getElementById('dp-brand').textContent = p.brand;
  document.getElementById('dp-title').textContent = p.title;
  document.getElementById('dp-stars').textContent = renderStars(p.rating);
  document.getElementById('dp-rating').textContent = p.rating;
  document.getElementById('dp-review-count').textContent = `${fmtNum(p.reviewCount)} ratings`;
  const bought = p.boughtLastMonth >= 1000
    ? `${Math.floor(p.boughtLastMonth / 1000)}K+`
    : `${p.boughtLastMonth}+`;
  document.getElementById('dp-bought').textContent = `${bought} bought last month`;

  // Price
  document.getElementById('dp-discount-pct').textContent = `-${p.discount}%`;
  document.getElementById('dp-price').textContent = `₹${p.price}`;
  document.getElementById('dp-mrp').textContent = `M.R.P.: ₹${fmtNum(p.mrp)}`;



  // Stock
  document.getElementById('dp-stock').textContent =
    `✓ In Stock · ${p.delivery}`;

  // Colors
  const activeColorName = state.colorName || (p.colors.find(c => c.active) || p.colors[0])?.name || '';
  document.getElementById('dp-color-name').textContent = activeColorName;
  const colorsEl = document.getElementById('dp-colors');
  colorsEl.innerHTML = p.colors.map((c, i) => `
    <div class="detail-color-swatch ${c.name === activeColorName ? 'active' : ''}" data-color="${c.name}">
      <div class="swatch-circle" style="background:${c.hex};"></div>
      <span class="swatch-name">${c.name}</span>
    </div>`).join('');

  colorsEl.querySelectorAll('.detail-color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      colorsEl.querySelectorAll('.detail-color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      document.getElementById('dp-color-name').textContent = sw.dataset.color;
      cardState[p.id].colorName = sw.dataset.color;
    });
  });

  // Sizes
  const currentSize = cardState[p.id].size;
  document.getElementById('dp-size-name').textContent = currentSize || 'Select a size';
  const sizesEl = document.getElementById('dp-sizes');
  sizesEl.innerHTML = p.sizes.map(s => `
    <button class="size-btn ${currentSize === s ? 'active' : ''}" data-size="${s}">${s}</button>`
  ).join('');

  sizesEl.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sizesEl.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('dp-size-name').textContent = btn.dataset.size;
      cardState[p.id].size = btn.dataset.size;
    });
  });

  // Size Guide
  const sgToggle = document.getElementById('dp-sg-toggle');
  const sgTable  = document.getElementById('dp-sg-table');
  sgToggle.className = 'size-guide-toggle'; // reset
  sgTable.className  = 'size-guide-table';  // reset (closed)
  sgToggle.onclick = () => {
    const open = sgTable.classList.toggle('open');
    sgToggle.classList.toggle('open', open);
  };
  const sgBody = document.getElementById('dp-sg-body');
  sgBody.innerHTML = sizeGuideData.map(r =>
    `<tr><td><strong>${r.size}</strong></td><td>${r.bust}</td><td>${r.waist}</td><td>${r.hip}</td></tr>`
  ).join('');



  // Highlights
  document.getElementById('dp-highlights').innerHTML =
    Object.entries(p.highlights).map(([k, v]) =>
      `<tr><td>${k}</td><td>${v}</td></tr>`
    ).join('');

  // About
  document.getElementById('dp-about').innerHTML =
    p.about.map(a => `<li>${a}</li>`).join('');

  // Ratings
  document.getElementById('dp-big-rating').textContent = p.rating;
  document.getElementById('dp-big-stars').innerHTML = renderStarsFixed(p.rating);

  const rb = p.ratingsBreakdown;
  document.getElementById('dp-rating-bars').innerHTML = [5,4,3,2,1].map(n => `
    <div class="rating-bar-row">
      <span class="rating-bar-label">${n} ★</span>
      <div class="rating-bar-track">
        <div class="rating-bar-fill" style="width:${rb[n]}%;"></div>
      </div>
      <span class="rating-bar-pct">${rb[n]}%</span>
    </div>`).join('');

  // Reviews carousel
  document.getElementById('dp-reviews-track').innerHTML = p.reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${renderStars(r.rating)}</div>
      <div class="review-title">${r.title}</div>
      <div class="review-body">${r.body}</div>
      <div class="review-footer">
        <span class="review-name">— ${r.name}</span>
        <span>${r.date}</span>
      </div>
    </div>`).join('');
}

// ─── Add to Cart (detail view) ───────────────────────────────
window.addToCartDetail = function() {
  if (!activeProduct) return;
  const btn = document.getElementById('dp-cart-btn');
  const size = cardState[activeProduct.id]?.size;
  if (!size) {
    btn.textContent = '⚠ Select a size first';
    btn.style.background = 'linear-gradient(135deg, #E65100, #FF8F00)';
    setTimeout(() => { btn.textContent = '🛒 Add to Cart'; btn.style.background = ''; }, 2000);
    return;
  }
  btn.textContent = '✓ Added to Cart!';
  btn.style.background = 'linear-gradient(135deg, #2E8B57, #52B788)';
  setTimeout(() => { btn.textContent = '🛒 Add to Cart'; btn.style.background = ''; }, 2200);
};

window.buyNow = function() {
  if (!activeProduct) return;
  const btn = document.getElementById('dp-buy-btn');
  const size = cardState[activeProduct.id]?.size;
  if (!size) {
    btn.textContent = '⚠ Select a size first';
    setTimeout(() => { btn.textContent = 'Buy Now'; }, 2000);
    return;
  }
  btn.textContent = 'Proceeding…';
  setTimeout(() => { btn.textContent = 'Buy Now'; }, 2000);
};

// ─── Wishlist (detail view) ───────────────────────────────────
window.toggleWishlistDetail = function() {
  if (!activeProduct) return;
  const id  = activeProduct.id;
  const btn = document.getElementById('detail-wish-btn');
  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.textContent = '♡';
    btn.classList.remove('active');
  } else {
    wishlist.add(id);
    btn.textContent = '♥';
    btn.classList.add('active');
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => { btn.style.transform = ''; }, 300);
  }
};



// ─── Sort ─────────────────────────────────────────────────────
function initSort() {
  const sel = document.getElementById('sort-select');
  if (!sel) return;
  sel.addEventListener('change', () => {
    currentSort = sel.value;
    renderGrid();
  });
}

function sortedProducts() {
  const arr = [...allProducts];
  switch (currentSort) {
    case 'price-asc':   return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':  return arr.sort((a, b) => b.price - a.price);
    case 'rating':      return arr.sort((a, b) => b.rating - a.rating);
    case 'discount':    return arr.sort((a, b) => b.discount - a.discount);
    default:            return arr;
  }
}

// ─── Scroll Shadow on Grid Header ────────────────────────────
function initScrollShadow() {
  const gridScrollArea = document.querySelector('.grid-scroll-area');
  const gridHeader     = document.getElementById('grid-header');
  const detailPage     = document.getElementById('detail-page');
  const detailHeader   = document.getElementById('detail-header');

  if (gridScrollArea) {
    gridScrollArea.addEventListener('scroll', () => {
      gridHeader?.classList.toggle('scrolled', gridScrollArea.scrollTop > 20);
    }, { passive: true });
  }
  if (detailPage) {
    detailPage.addEventListener('scroll', () => {
      detailHeader?.classList.toggle('scrolled', detailPage.scrollTop > 20);
    }, { passive: true });
  }
}

// ─── Utilities ────────────────────────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function renderStarsFixed(rating) {
  const pct = (rating / 5) * 100;
  return `
    <div style="position:relative;font-size:24px;line-height:1;display:inline-block;">
      <span style="color:#E0D0C0;">★★★★★</span>
      <span style="position:absolute;left:0;top:0;overflow:hidden;width:${pct}%;color:var(--star);">★★★★★</span>
    </div>`;
}

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
  return String(n);
}

function capitalize(s) {
  if (!s) return '';
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
