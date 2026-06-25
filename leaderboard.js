/* ============================================================
   AuraStylist — leaderboard.js
   Leaderboard · Weekly Challenge · My Rewards
   ============================================================ */
'use strict';

// ─── Leaderboard Data ─────────────────────────────────────────
const LEADERBOARD = [
  { rank:1,  name:'Preksha',      avatar:'P', pts:52400, isYou:true  },
  { rank:2,  name:'Prathiksha',   avatar:'P', pts:14890, isYou:false },
  { rank:3,  name:'Pratheeksha',  avatar:'P', pts:14500, isYou:false },
  { rank:4,  name:'Prerana',      avatar:'P', pts:13900, isYou:false },
  { rank:5,  name:'Divya P.',     avatar:'D', pts:13400, isYou:false },
  { rank:6,  name:'Meera T.',     avatar:'M', pts:12800, isYou:false },
  { rank:7,  name:'Roshni A.',    avatar:'R', pts:12100, isYou:false },
  { rank:8,  name:'Riya N.',      avatar:'R', pts:11500, isYou:false },
  { rank:9,  name:'Shreya B.',    avatar:'S', pts:11100, isYou:false },
  { rank:10, name:'Tanvi L.',     avatar:'T', pts:10800, isYou:false },
  { rank:11, name:'Pooja S.',     avatar:'P', pts:10500, isYou:false },
  { rank:12, name:'Nisha V.',     avatar:'N', pts:10200, isYou:false },
  { rank:13, name:'Leena R.',     avatar:'L', pts:9900,  isYou:false },
  { rank:14, name:'Asha M.',      avatar:'A', pts:9600,  isYou:false },
  { rank:15, name:'Geeta K.',     avatar:'G', pts:9400,  isYou:false }
];

const FIRST_NAMES = ["Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn", "Fatima", "Aisha", "Zainab", "Mariam", "Min", "Li", "Yuki", "Mei", "Maria", "Sofia", "Valentina", "Elena", "Kavya", "Ananya", "Zara", "Chloe", "Priya", "Neha", "Divya", "Meera", "Roshni", "Riya", "Shreya", "Tanvi", "Pooja", "Nisha", "Leena", "Asha", "Geeta", "Sara", "Maya", "Aria", "Layla", "Luna", "Mila"];
const LAST_INITIALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let currentPts = 9350;
const generatedUsers = [];
for (let i = 16; i <= 1000; i++) {
  const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lInit = LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)];
  const name = `${fName} ${lInit}.`;
  
  let pts;
  if (i >= 996) {
    pts = Math.floor(Math.random() * 5) + 1; // 1-5
  } else if (i >= 950) {
    pts = Math.floor(Math.random() * 16) + 5; // 5-20
  } else {
    if (i < 100) currentPts -= Math.floor(Math.random() * 60) + 30;
    else if (i < 500) currentPts -= Math.floor(Math.random() * 20) + 10;
    else currentPts -= Math.floor(Math.random() * 10) + 2;
    
    if (currentPts < 21) currentPts = Math.floor(Math.random() * 16) + 5;
    pts = currentPts;
  }

  generatedUsers.push({
    name: name,
    avatar: name.charAt(0).toUpperCase(),
    pts: pts,
    isYou: false
  });
}

// Sort descending and append to LEADERBOARD
generatedUsers.sort((a, b) => b.pts - a.pts);
generatedUsers.forEach((u, idx) => {
  u.rank = 16 + idx;
  LEADERBOARD.push(u);
});

// ─── Game Items (Weekly Rotation) ─────────────────────────────
//     BACKEND NOTE: Feed current week's array from DB
const WEEKLY_CHALLENGES = {
  week1: {
    tops: [
      { id:'t1', name:'Navy Blazer',      image:'top_navy_blazer.png', tag:'Formal',     _formality:9, _style:'formal',     _trend:6 },
      { id:'t2', name:'Graphic Band Tee', image:'top_band_tee.png',    tag:'Casual',     _formality:2, _style:'casual',     _trend:8 },
      { id:'t3', name:'Floral Blouse',    image:'top_floral_blouse.png', tag:'Feminine', _formality:5, _style:'feminine',   _trend:7 },
      { id:'t4', name:'Oversized Hoodie', image:'top_hoodie.png',      tag:'Streetwear', _formality:1, _style:'streetwear', _trend:9 },
      { id:'t5', name:'Silk Camisole',    image:'top_silk_camisole.png', tag:'Elegant',  _formality:7, _style:'elegant',   _trend:5 },
    ],
    bottoms: [
      { id:'b1', name:'Tailored Trousers',  image:'bottom_trousers.png', tag:'Formal',     _formality:9, _style:'formal',     _trend:6 },
      { id:'b2', name:'Ripped Jeans',       image:'https://loremflickr.com/400/400/jeans,clothing?lock=1', tag:'Casual', _formality:2, _style:'casual', _trend:9 },
      { id:'b3', name:'Pleated Midi Skirt', image:'https://loremflickr.com/400/400/skirt,pleated?lock=2', tag:'Feminine', _formality:6, _style:'feminine', _trend:7 },
      { id:'b4', name:'Cargo Shorts',       image:'https://loremflickr.com/400/400/cargo,shorts,clothing?lock=3', tag:'Streetwear', _formality:1, _style:'streetwear', _trend:8 },
      { id:'b5', name:'Leather Mini Skirt', image:'https://loremflickr.com/400/400/clothing,skirt,black?lock=42', tag:'Edgy', _formality:5, _style:'edgy', _trend:8 },
    ]
  }
};

let TOPS = WEEKLY_CHALLENGES.week1.tops;
let BOTTOMS = WEEKLY_CHALLENGES.week1.bottoms;

// ─── Internal: Style Harmony Matrix ───────────────────────────
//     BACKEND ONLY — Defines intentional contrast quality
//     between style categories. NOT exposed to users.
const _STYLE_HARMONY = {
  'formal-casual':     85, 'casual-formal':     85,
  'formal-edgy':       92, 'edgy-formal':       92,
  'formal-streetwear': 44, 'streetwear-formal': 44,
  'formal-feminine':   58, 'feminine-formal':   58,
  'formal-elegant':    48, 'elegant-formal':    48,
  'casual-edgy':       68, 'edgy-casual':       68,
  'casual-streetwear': 54, 'streetwear-casual': 54,
  'casual-feminine':   62, 'feminine-casual':   62,
  'casual-elegant':    78, 'elegant-casual':    78,
  'elegant-edgy':      88, 'edgy-elegant':      88,
  'elegant-streetwear':82, 'streetwear-elegant':82,
  'elegant-feminine':  47, 'feminine-elegant':  47,
  'feminine-streetwear':72,'streetwear-feminine':72,
  'feminine-edgy':     75, 'edgy-feminine':     75,
  'streetwear-edgy':   57, 'edgy-streetwear':   57,
};

// ─── Internal: Score Calculation ──────────────────────────────
//     BACKEND ONLY — Formula: Maps contrast/harmony to strict 10–70 range.
function _calcScore(top, bottom) {
  const fDiff      = Math.abs(top._formality - bottom._formality);
  const contrast   = (fDiff / 8) * 100;
  const harmonyKey = `${top._style}-${bottom._style}`;
  const harmony    = _STYLE_HARMONY[harmonyKey] || 45;
  const creativity = ((top._trend + bottom._trend) / 18) * 100;
  
  // Base raw score 0 to 100
  const raw = (contrast * 0.5) + (harmony * 0.3) + (creativity * 0.2);
  
  // Scale raw score (0-100) to (10-70) range
  const scaled = 10 + (raw * (60 / 100));
  
  return Math.min(70, Math.max(10, Math.round(scaled)));
}

// ─── Internal: Score Component Breakdown (for display bars) ───
function _calcComponents(top, bottom) {
  const fDiff    = Math.abs(top._formality - bottom._formality);
  const contrast = Math.round((fDiff / 8) * 100);
  const key      = `${top._style}-${bottom._style}`;
  const harmony  = _STYLE_HARMONY[key] || 45;
  const creativity = Math.round(((top._trend + bottom._trend) / 18) * 100);
  return { contrast, harmony, creativity };
}

// ─── Internal: Score Reasons ───────────────────────────────────
function _getReasons(top, bottom, score) {
  const fDiff = Math.abs(top._formality - bottom._formality);
  const key   = `${top._style}-${bottom._style}`;
  const harmony = _STYLE_HARMONY[key] || 45;
  const creative = (top._trend + bottom._trend) / 18 * 100;
  const reasons = [];
  if (fDiff >= 6) reasons.push('Excellent formal/casual contrast creates powerful tension');
  else if (fDiff >= 4) reasons.push('Strong style contrast between the two pieces');
  else if (fDiff >= 2) reasons.push('Moderate contrast — subtle but intentional');
  else reasons.push('Similar formality levels — contrast relies on other elements');
  if (harmony >= 82) reasons.push('Pairing feels deeply intentional — expert-level cohesion');
  else if (harmony >= 68) reasons.push('Creative decision-making shows clear aesthetic vision');
  else if (harmony >= 54) reasons.push('Combination is bold and experimental');
  else reasons.push('High-risk pairing — visually striking but polarising');
  if (creative >= 80) reasons.push('Highly creative — this pairing is rarely seen');
  else if (creative >= 65) reasons.push('Trendy combination with strong fashion-forward energy');
  else reasons.push('Classic pairing — familiar but reliably stylish');
  return reasons;
}

// ─── Internal: Points from score ──────────────────────────────
function _scoreToPoints(score, tryIndex) {
  let basePts = 1;
  if (score >= 60) basePts = 5;
  else if (score >= 45) basePts = 4;
  else if (score >= 30) basePts = 3;
  else if (score >= 20) basePts = 2;

  // Diminishing returns: Try 1 (100%), Try 2 (60%), Try 3 (20%)
  if (tryIndex === 0) return basePts;
  if (tryIndex === 1) return Math.max(1, Math.round(basePts * 0.6));
  return 1;
}

// ─── Game State ────────────────────────────────────────────────
let gameState = {
  selectedTopId:    null,
  selectedBottomId: null,
  usedTops: new Set(),
  usedBottoms: new Set(),
  submissions: [],   // [{top, bottom, score, components, reasons}]
  maxSubmissions: 3,
  phase: 'pick',     // 'pick' | 'score' | 'results'
  totalPointsEarned: 0
};

// ─── Points History (demo data) ───────────────────────────────
const POINTS_LOG = [];
(function generateHistory() {
  let currentDate = new Date(); // Current date
  
  const products = ["BIBA Cotton Kurta", "Rayon Floral Kurti", "Georgette A-Line", "Silk Saree", "Denim Jacket", "White Sneakers", "Tote Bag", "Summer Dress", "Office Blazer", "Pleated Skirt"];
  const names = ["Deepa M.", "Kavya S.", "Neha P.", "Ananya R.", "Priya V.", "Divya K.", "Meera T.", "Shreya B."];

  for (let i = 0; i < 50; i++) {
    // Keep it within the last 2 days (subtract between 30 mins to 1.5 hours per entry)
    currentDate.setMinutes(currentDate.getMinutes() - (Math.floor(Math.random() * 60) + 30));
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const day = currentDate.getDate();
    const dateStr = `${month} ${day}`;

    const r = Math.random();
    let ptsEarned = 0;
    let label = '';
    let icon = '';

    if (r < 0.6) {
      // Purchase based on price thresholds + cart speed bonus
      icon = '🛍️';
      const priceR = Math.random();
      let productPts = 0;
      let priceLabel = '';
      
      if (priceR < 0.05) { productPts = 10; priceLabel = '≥₹50k'; }
      else if (priceR < 0.15) { productPts = 8; priceLabel = '≥₹25k'; }
      else if (priceR < 0.35) { productPts = 6; priceLabel = '≥₹10k'; }
      else if (priceR < 0.60) { productPts = 4; priceLabel = '≥₹6k'; }
      else if (priceR < 0.80) { productPts = 2; priceLabel = '≥₹4k'; }
      else { productPts = 1; priceLabel = '<₹4k'; }
      
      // Cart speed
      const cartR = Math.random();
      let cartPts = 0;
      let cartLabel = '';
      if (cartR < 0.3) { cartPts = 5; cartLabel = 'Same day checkout'; }
      else if (cartR < 0.6) { cartPts = 4; cartLabel = '≤1 week in cart'; }
      else if (cartR < 0.8) { cartPts = 3; cartLabel = '1-2 weeks in cart'; }
      else if (cartR < 0.95) { cartPts = 2; cartLabel = '>2 weeks in cart'; }
      else { cartPts = 0; cartLabel = '>1 month in cart'; }
      
      ptsEarned = productPts + cartPts;
      label = `Purchase: ${products[Math.floor(Math.random() * products.length)]}`;
    } else if (r < 0.9) {
      // Referral
      ptsEarned = 5;
      icon = '👥';
      label = `Referral used by ${names[Math.floor(Math.random() * names.length)]}`;
    } else {
      // Gamification Challenge
      ptsEarned = Math.floor(Math.random() * 5) + 1;
      icon = '🎮';
      label = `Weekly Style Challenge (Score ${Math.floor(Math.random() * 50) + 40})`;
    }

    if (ptsEarned > 0) {
      POINTS_LOG.push({ icon, label, pts: `+${ptsEarned} pts`, date: dateStr });
    }
  }
})();

// ─── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderRankings();
  renderGameItems();
  renderPointsLog();
  initCountdown();
  initTabs();
  animateRankBar();
});

// ─── Tab Navigation ────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.lb-tab').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function switchView(viewId) {
  // Update tabs
  document.querySelectorAll('.lb-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.view === viewId);
    t.setAttribute('aria-selected', t.dataset.view === viewId);
  });
  // Update views
  document.querySelectorAll('.lb-view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  // Update body class for background
  document.body.className = viewId === 'game' ? 'view-game' : '';
  // Trigger any view-specific animations
  if (viewId === 'rewards') {
    setTimeout(() => {
      const fill = document.getElementById('rank-bar-fill');
      if (fill) fill.style.width = '100%';
      const refFill = document.querySelector('.ref-prog-fill');
      if (refFill) refFill.style.width = '100%';
    }, 100);
  }
}

// ─── Leaderboard Render ────────────────────────────────────────
function renderRankings() {
  const body = document.getElementById('rankings-body');
  if (!body) return;
  // Show ranks 4–1000 (top 3 are on the podium)
  const rows = LEADERBOARD.filter(u => u.rank >= 4);
  body.innerHTML = rows.map((u, i) => `
    <div class="ranking-row ${u.isYou ? 'is-you' : ''}" style="${i < 50 ? 'animation-delay:' + (i * 0.04) + 's' : ''}">
      <span class="row-rank">${u.rank}</span>
      <div class="row-player">
        <div class="row-avatar ${u.isYou ? 'you-av' : ''}">${u.avatar}</div>
        <span class="row-name">${u.name}</span>
        ${u.isYou ? '<span class="you-tag">You</span>' : ''}
      </div>
      <span class="row-pts">${u.pts.toLocaleString()}</span>
      <div class="row-status">
        ${u.rank <= 15
          ? '<span class="status-badge badge-top5">🎁 Top 15</span>'
          : ''}
      </div>
    </div>
  `).join('');
}

// ─── Countdown Timer ───────────────────────────────────────────
function initCountdown() {
  function update() {
    const now     = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    const diff    = endOfMonth - now;
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs     = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const el      = document.getElementById('countdown-text');
    if (el) el.textContent = `${days}d ${hrs}h remaining`;
  }
  update();
  setInterval(update, 60000);
}

// ─── Game Items Render ─────────────────────────────────────────
function renderGameItems() {
  renderItems('tops-grid',    TOPS,    'top');
  renderItems('bottoms-grid', BOTTOMS, 'bottom');
}

function renderItems(containerId, items, type) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = items.map(item => {
    const isUsed = type === 'top' ? gameState.usedTops.has(item.id) : gameState.usedBottoms.has(item.id);
    const usedClass = isUsed ? 'used-item' : '';
    const clickAttr = isUsed ? '' : `onclick="selectItem('${type}','${item.id}')"`;
    
    return `
      <div class="clothing-card ${usedClass}" id="card-${item.id}" ${clickAttr}>
        <div class="card-img-wrap" style="height: 110px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
          <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div class="card-info">
          <div class="card-item-name">${item.name}</div>
          <span class="card-style-tag">${item.tag}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ─── Game: Item Selection ──────────────────────────────────────
window.selectItem = function(type, id) {
  if (gameState.phase !== 'pick') return;

  if (type === 'top') {
    gameState.selectedTopId = id;
    document.querySelectorAll('#tops-grid .clothing-card').forEach(c => {
      c.classList.toggle('selected', c.id === `card-${id}`);
    });
    updatePreview('top', id);
  } else {
    gameState.selectedBottomId = id;
    document.querySelectorAll('#bottoms-grid .clothing-card').forEach(c => {
      c.classList.toggle('selected', c.id === `card-${id}`);
    });
    updatePreview('bottom', id);
  }

  const canSubmit = gameState.selectedTopId && gameState.selectedBottomId;
  document.getElementById('btn-submit').disabled = !canSubmit;
};

function updatePreview(type, id) {
  const items   = type === 'top' ? TOPS : BOTTOMS;
  const item    = items.find(i => i.id === id);
  const slotEl  = document.getElementById(`preview-${type}`);
  if (!item || !slotEl) return;
  slotEl.innerHTML = `
    <div class="preview-filled">
      <div class="preview-img" style="width:44px;height:44px;border-radius:8px;overflow:hidden;background:#f0f0f0;flex-shrink:0;">
        <img src="${item.image}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
      <span class="preview-name">${item.name}</span>
    </div>
  `;
}

// ─── Game: Submit Outfit ───────────────────────────────────────
window.submitOutfit = function() {
  const top    = TOPS.find(t => t.id === gameState.selectedTopId);
  const bottom = BOTTOMS.find(b => b.id === gameState.selectedBottomId);
  if (!top || !bottom) return;

  const score      = _calcScore(top, bottom);
  const components = _calcComponents(top, bottom);
  const reasons    = _getReasons(top, bottom, score);
  const tryIndex = gameState.submissions.length;
  const pts        = _scoreToPoints(score, tryIndex);

  const submission = { top, bottom, score, components, reasons, pts };
  gameState.submissions.push(submission);
  gameState.submissions.sort((a, b) => b.score - a.score);
  if (gameState.submissions.length > 3) gameState.submissions.length = 3;
  
  // Lock these items
  gameState.usedTops.add(top.id);
  gameState.usedBottoms.add(bottom.id);
  
  // Add points directly to user
  gameState.totalPointsEarned += pts;
  updateUserRewards(pts, score);

  const count = gameState.submissions.length;
  updateComboDots(count);
  document.getElementById('combo-count').textContent = count;

  // Show score phase
  gameState.phase = 'score';
  showScorePhase(submission);
};

function showScorePhase(sub) {
  document.getElementById('phase-pick').classList.add('hidden');
  document.getElementById('phase-score').classList.remove('hidden');
  document.getElementById('phase-results').classList.add('hidden');

  // Animate score count-up
  animateCount('score-display', sub.score, 1400);

  // Points badge
  document.getElementById('score-pts-badge').textContent = `+${sub.pts} pts earned`;

  // Score bars (animate after a delay)
  const barsEl = document.getElementById('score-bars');
  barsEl.innerHTML = `
    <div class="score-bar-row">
      <span class="score-bar-label">Contrast</span>
      <div class="score-bar-track"><div class="score-bar-fill bar-contrast" id="bar-contrast"></div></div>
      <span class="score-bar-pct">${sub.components.contrast}%</span>
    </div>
    <div class="score-bar-row">
      <span class="score-bar-label">Harmony</span>
      <div class="score-bar-track"><div class="score-bar-fill bar-harmony" id="bar-harmony"></div></div>
      <span class="score-bar-pct">${sub.components.harmony}%</span>
    </div>
    <div class="score-bar-row">
      <span class="score-bar-label">Creativity</span>
      <div class="score-bar-track"><div class="score-bar-fill bar-creative" id="bar-creative"></div></div>
      <span class="score-bar-pct">${sub.components.creativity}%</span>
    </div>
  `;
  setTimeout(() => {
    document.getElementById('bar-contrast').style.width = sub.components.contrast + '%';
    document.getElementById('bar-harmony').style.width  = sub.components.harmony  + '%';
    document.getElementById('bar-creative').style.width = sub.components.creativity + '%';
  }, 200);

  // Reasons
  document.getElementById('score-reasons').innerHTML = `
    <div class="score-reasons-title">AI Analysis — ${sub.top.name} + ${sub.bottom.name}</div>
    ${sub.reasons.map(r => `
      <div class="score-reason-item">
        <span class="reason-bullet">•</span>
        <span>${r}</span>
      </div>
    `).join('')}
  `;

  // Disable try again if max submissions reached
  const remaining = gameState.maxSubmissions - gameState.submissions.length;
  const tryBtn    = document.getElementById('btn-try-again');
  if (remaining <= 0) {
    tryBtn.textContent = '🏁 No more combos';
    tryBtn.disabled = true;
  } else {
    tryBtn.textContent  = `🔄 Try Another (${remaining} left)`;
    tryBtn.disabled = false;
  }

  // Show "See All" if more than 1 submission
  if (gameState.submissions.length >= 1) {
    document.getElementById('btn-see-all').style.display = 'block';
  }
}

// ─── Game: Try Another ────────────────────────────────────────
window.tryAnother = function() {
  if (gameState.submissions.length >= gameState.maxSubmissions) {
    showResults();
    return;
  }
  // Reset selection
  gameState.selectedTopId    = null;
  gameState.selectedBottomId = null;
  gameState.phase = 'pick';

  // Re-render items to show locked state
  renderGameItems();

  // Reset previews
  ['top', 'bottom'].forEach(type => {
    const sl = document.getElementById(`preview-${type}`);
    const emoji = type === 'top' ? '👕' : '👖';
    const label = type === 'top' ? 'Pick a top' : 'Pick a bottom';
    if (sl) sl.innerHTML = `<div class="preview-placeholder"><span>${emoji}</span><span>${label}</span></div>`;
  });

  document.getElementById('btn-submit').disabled = true;

  // Switch phases
  document.getElementById('phase-score').classList.add('hidden');
  document.getElementById('phase-pick').classList.remove('hidden');
};

// ─── Game: Show Results ────────────────────────────────────────
window.showResults = function() {
  gameState.phase = 'results';
  document.getElementById('phase-pick').classList.add('hidden');
  document.getElementById('phase-score').classList.add('hidden');
  document.getElementById('phase-results').classList.remove('hidden');

  const medals = ['🥇', '🥈', '🥉'];
  const labels = ['Best', '2nd', '3rd'];
  const totalPts = gameState.submissions.reduce((sum, s) => sum + s.pts, 0);

  document.getElementById('total-pts-pill').textContent = `🏆 ${totalPts} pts total earned`;

  const grid = document.getElementById('results-grid');
  grid.innerHTML = gameState.submissions.map((s, i) => `
    <div class="result-card" style="animation-delay:${i * 0.12}s">
      <div class="result-medal-col">
        <span class="result-medal">${medals[i] || '🎖'}</span>
        <span class="result-rank-label">${labels[i] || `#${i+1}`}</span>
      </div>
      <div class="result-outfit-info">
        <div class="result-outfit-name">${s.top.name} + ${s.bottom.name}</div>
        <div class="result-outfit-score-row">
          <span class="result-score-num">${s.score}</span>
          <span class="result-score-label">/ 70</span>
        </div>
        <div class="result-reasons">
          ${s.reasons.map(r => `<span class="result-reason"><span>•</span>${r}</span>`).join('')}
        </div>
      </div>
      <div class="result-pts-badge">
        <span class="result-pts-num">+${s.pts}</span>
        <span class="result-pts-label">pts</span>
      </div>
    </div>
  `).join('');
};

// ─── Game: Reset ───────────────────────────────────────────────
window.resetGame = function() {
  gameState = {
    selectedTopId: null, selectedBottomId: null,
    usedTops: new Set(), usedBottoms: new Set(),
    submissions: [], maxSubmissions: 3, phase: 'pick',
    totalPointsEarned: 0
  };
  renderGameItems();
  ['top','bottom'].forEach(type => {
    const sl = document.getElementById(`preview-${type}`);
    const emoji = type === 'top' ? '👕' : '👖';
    const label = type === 'top' ? 'Pick a top' : 'Pick a bottom';
    if (sl) sl.innerHTML = `<div class="preview-placeholder"><span>${emoji}</span><span>${label}</span></div>`;
  });
  document.getElementById('btn-submit').disabled = true;
  document.getElementById('btn-see-all').style.display = 'none';
  document.getElementById('combo-count').textContent = '0';
  updateComboDots(0);
  document.getElementById('phase-results').classList.add('hidden');
  document.getElementById('phase-score').classList.add('hidden');
  document.getElementById('phase-pick').classList.remove('hidden');
};

// ─── Combo Dots ────────────────────────────────────────────────
function updateComboDots(count) {
  for (let i = 0; i < 3; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) dot.classList.toggle('filled', i < count);
  }
}

// ─── Rewards: Points Log ───────────────────────────────────────
function renderPointsLog() {
  const log = document.getElementById('points-log');
  if (!log) return;
  log.innerHTML = POINTS_LOG.map(e => `
    <div class="ph-row">
      <span class="ph-icon">${e.icon}</span>
      <span class="ph-label">${e.label}</span>
      <span class="ph-pts">${e.pts}</span>
      <span class="ph-date">${e.date}</span>
    </div>
  `).join('');
}

// ─── Rewards: Rank bar ─────────────────────────────────────────
function animateRankBar() {
  const fill = document.getElementById('rank-bar-fill');
  if (fill) {
    setTimeout(() => { fill.style.width = '100%'; }, 0);
  }
}

// ─── Mystery Box: Open & Reward Logic ──────────────────────────
//     BACKEND NOTE: Eligibility (Top 5 + 50k pts) verified server-side.
//     Coupon brand-selection logic is NEVER exposed to the user.
let _mysteryOpened = false;

window.openMysteryBox = function() {
  if (_mysteryOpened) return;
  _mysteryOpened = true;

  const modal       = document.getElementById('mystery-modal');
  const spinnerEl   = document.getElementById('mb-spinner-phase');
  const revealEl    = document.getElementById('mb-reveal-phase');
  const giftEl      = document.getElementById('mystery-gift');
  const titleEl     = document.getElementById('mystery-modal-title');
  const rewardEl    = document.getElementById('mystery-modal-reward');
  const noteEl      = document.getElementById('mystery-modal-note');
  const copyBtn     = document.getElementById('mb-copy-btn');

  // ─── Internal Reward Engine ─────────────────────────────────
  //     BACKEND ONLY: Server decides which pool to draw from.
  //     Coupon targeting (newbie/low-traffic brands) is computed
  //     server-side and NEVER surfaced in the UI. Users see only
  //     a generic "exclusive offer" — not why it was selected.
  const _bonusPts = Math.floor(Math.random() * 51);           // 0–50
  const _discPct  = Math.floor(Math.random() * 11) + 5;       // 5–15
  const _couponId = Math.random().toString(36).substring(2,7).toUpperCase();

  const PARTNER_BRANDS = [
    "Aapro", "Aatachi", "Admyrin", "AkroBon", "Atrangi", "Azani", "Azga", "BandBox", "Be Awara", "BogglingShop", 
    "BollyWoo", "Candid Knots", "Candyskin", "Cbazaar", "Closet37", "CoutLoot", "CrazeVilla", "Cyahi", "DesiClik", 
    "D’Vibgyor", "Earoma", "Ediy.in", "Ellementry", "EmbroideryPlus", "ENAH", "Esse", "ETashee", "Everstylish", 
    "Fancypants", "Farida Gupta", "Fashion Ka Fatka", "Fatfatiya", "Faye", "Ferosh", "Firangistore", "Flirtatious", 
    "Fonzel", "Giskaa", "Habbana", "Hauterfly", "Hoppingo", "Kada", "KalkiFashion", "Khantil", "Lola’s Closet", 
    "Loomkart", "Lovetobag", "Lucknowi Andaaz", "Lulu and Sky", "Lurap", "Maanja", "Naksh Creation", "Namhah", 
    "Natasha Couture", "Natty", "Naturalkart", "Nautinati.com", "Neva", "Newchic", "Nighty House", "Ninecolours", 
    "Nordlich", "Ombré Lane", "Orosilber", "Oxolloxo", "Paparazzi Closet", "Parisera", "Pastels & Pop", "Pavitraa", 
    "Peachmode", "Peeli Dori", "Phive Rivers", "PinkCuckoo", "Planeteves", "PLNK", "PostFold", "Presa Flats", 
    "Purple Panchi", "Quirk Box", "Red Riding", "Refindyou", "Renge", "Rhome", "Rigo", "Rivir", "Rust Orange", 
    "Saavra", "Sahej Suits", "SALT Attire", "Scarlett Rose Collection", "SchrotFlinte", "Secret Wish", "Shailesh Singhania", 
    "Shelltag", "Shilpsutra", "Shoe That Fits You", "ShopDesiNow", "Shophunk", "Shopolics", "Shoponn", "Shoppingkart24", 
    "Shopwati", "Shopyfly", "Shyaway", "ShyCart", "Silkrute", "Silly Punter", "Smritiapparels", "Snoogg", "Socratees", 
    "Soie", "Specade", "SpiceStyle", "Spring Break", "SR Store", "Stage3", "Strand of Silk", "STREET 9", "Street Style Store", 
    "Strollay.com", "Stybuzz", "Style Dotty", "Stylecracker", "Stylish Play", "Suit Up India", "Svaiza", "Swishlist", 
    "Tacfab Fashions", "Talking Threads", "Tangy", "The Label Life", "The Lion and the Fish", "The Loom", "The Postbox", 
    "The Saffron Saga", "The Stiff Collar", "The Tickle Toe", "The Vanca", "The Wedding Brigade", "The Wishing Chair", 
    "The Yellow Door", "Threads and Shirts", "Tiktauli", "Tjori", "Toteteca", "Trendin", "Trendmagnet", "Triveni Ethnics", 
    "Truworth Homes", "Turms Intelligent Apparel", "Twigly", "Undandy", "Underaman", "Unnatisilks", "Uptownie101", 
    "Urban Monkey", "Urban Pitara", "UrbanTouch", "Utsav Fashion", "Vajor", "Vaph", "Varanga", "Ventra", "Via East", 
    "Violet Bag", "Vivaah Surat", "Voylla", "Vyom Design", "Vyomini", "We The Chic", "Wear Your Opinion", "Wholesale7", 
    "Wholesalebox", "Wildflower", "Wishcart.in", "World Art Community", "Wowemall", "Yellow Fashion", "Yepme", "Yoins", 
    "YOOX", "Youngbirds", "YourDesignerWear", "Yufta", "ZAFUL", "Zilingo", "Zubiya"
  ];
  const _randomBrand = PARTNER_BRANDS[Math.floor(Math.random() * PARTNER_BRANDS.length)];

  const REWARD_POOL = [
    // Priority 1a: Partner site voucher
    {
      type: 'coupon', icon: '🏷️', label: `${_randomBrand} Voucher`,
      code: `${_randomBrand.substring(0,4).toUpperCase()}-CB-${_couponId}`,
      note: `Enjoy an exclusive cashback on your next order at ${_randomBrand}. Redeem at checkout on their site.`,
    },
    // Priority 1b: Emerging boutique offer
    {
      type: 'coupon', icon: '🛍️', label: `${_randomBrand} Offer`,
      code: `${_randomBrand.substring(0,4).toUpperCase()}-OFF-${_couponId}`,
      note: `Discover new styles! Redeem this code at ${_randomBrand} for a special discount.`,
    },
    // Priority 2: Bonus Points (0–50)
    {
      type: 'points', icon: '⭐', label: `+${_bonusPts} Bonus Points`,
      code: null,
      note: _bonusPts === 0
        ? 'Better luck next time — keep playing to earn more points!'
        : `${_bonusPts} points have been added to your June balance.`,
    },
    // Priority 3: Discount Voucher for partner site
    {
      type: 'discount', icon: '🎉', label: `${_discPct}% Off at ${_randomBrand}`,
      code: `${_randomBrand.substring(0,4).toUpperCase()}-${_discPct}OFF-${_couponId}`,
      note: `Valid for 7 days. Your ${_discPct}% discount applies at ${_randomBrand}.`,
    },
  ];

  // Weighted draw: coupons first, then points, then discount
  const weights = [0.35, 0.30, 0.20, 0.15];
  const rand = Math.random();
  let cumulative = 0;
  let reward = REWARD_POOL[0];
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) { reward = REWARD_POOL[i]; break; }
  }

  // ── Phase 1: Show modal with spinner ──────────────────────
  spinnerEl.classList.remove('hidden');
  revealEl.classList.add('hidden');
  modal.classList.add('visible');

  // ── Phase 2: After 2.2s, swap to reward reveal ────────────
  setTimeout(() => {
    // Transition out spinner
    spinnerEl.classList.add('fade-out');

    setTimeout(() => {
      spinnerEl.classList.add('hidden');
      spinnerEl.classList.remove('fade-out');

      // Populate reward content
      giftEl.textContent = reward.icon;
      titleEl.textContent =
        reward.type === 'coupon'  ? '🏷️ Coupon Unlocked!'  :
        reward.type === 'points'  ? '⭐ Bonus Points!'      :
                                    '🎉 Discount Voucher!';

      rewardEl.innerHTML = reward.code
        ? `<div class="mb-reward-code" id="mb-code-text">${reward.code}</div>
           <div class="mb-reward-label">${reward.label}</div>`
        : `<div class="mb-reward-value">${reward.label}</div>`;

      noteEl.textContent = reward.note;

      // Show copy button only for coupon/discount codes
      if (reward.code) {
        copyBtn.classList.remove('hidden');
        copyBtn._codeValue = reward.code;
      } else {
        copyBtn.classList.add('hidden');
      }

      // Reveal the reward phase with pop animation
      revealEl.classList.remove('hidden');
      revealEl.style.animation = 'none';
      requestAnimationFrame(() => {
        revealEl.style.animation = 'revealPop 0.45s var(--ease)';
      });

      _spawnConfetti();
    }, 350);
  }, 2200);

  // Disable box so it can't be reopened
  const box = document.getElementById('mystery-box');
  if (box) {
    box.style.cursor = 'default';
    const ctaBtn = box.querySelector('.mystery-cta-btn');
    if (ctaBtn) ctaBtn.textContent = '✓ Opened';
  }
};

window.copyMysteryCode = function() {
  const btn   = document.getElementById('mb-copy-btn');
  const label = document.getElementById('mb-copy-label');
  const code  = btn?._codeValue || '';
  navigator.clipboard?.writeText(code).catch(() => {});
  if (label) {
    label.textContent = '✅ Copied!';
    setTimeout(() => { label.textContent = '📋 Copy Code'; }, 2500);
  }
};

window.closeMysteryModal = function(e) {
  if (e && e.target !== document.getElementById('mystery-modal')) return;
  document.getElementById('mystery-modal').classList.remove('visible');
};

function _spawnConfetti() {
  const container = document.getElementById('mystery-confetti');
  if (!container) return;
  container.innerHTML = '';
  const colours = ['#F59E0B','#C4A9FF','#FFB7C5','#7DE8CB','#8FD3FE','#FF6B6B'];
  for (let i = 0; i < 40; i++) {
    const dot = document.createElement('span');
    dot.className = 'confetti-dot';
    dot.style.cssText = `
      background: ${colours[i % colours.length]};
      left: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 0.6}s;
      animation-duration: ${0.8 + Math.random() * 0.6}s;
    `;
    container.appendChild(dot);
  }
}

// ─── Referral Copy ─────────────────────────────────────────────
window.copyReferral = function() {
  const code  = document.getElementById('ref-code')?.textContent || '';
  const label = document.getElementById('copy-label');
  navigator.clipboard?.writeText(code).catch(() => {});
  if (label) {
    label.textContent = 'Copied!';
    setTimeout(() => { label.textContent = 'Copy'; }, 2000);
  }
};

// ─── Utility: Animate count-up ─────────────────────────────────
function animateCount(elId, target, duration) {
  const el = document.getElementById(elId);
  if (!el) return;
  const steps = 60;
  const delay = duration / steps;
  let step = 0;
  el.textContent = 0;
  const iv = setInterval(() => {
    step++;
    el.textContent = Math.min(Math.round(target / steps * step), target);
    if (step >= steps) { clearInterval(iv); el.textContent = target; }
  }, delay);
}

// ─── Rewards: Dynamic Points Add ───────────────────────────────
function updateUserRewards(earnedPts, score) {
  // Update header pts and rewards pts (Base starts at 11500)
  const newTotal = 52400 + gameState.totalPointsEarned;
  
  const headerPts = document.getElementById('header-pts');
  if (headerPts) headerPts.textContent = newTotal.toLocaleString() + ' pts';
  
  const rankBigPts = document.querySelector('.rank-pts-big');
  if (rankBigPts) rankBigPts.textContent = newTotal.toLocaleString() + ' pts this month';
  
  // Add to log
  POINTS_LOG.unshift({
    icon: '🎮', 
    label: `Challenge Week 3 — Score ${score}`, 
    pts: `+${earnedPts} pts`, 
    date: 'Just now'
  });
  renderPointsLog();
}
