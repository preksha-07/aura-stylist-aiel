/* ============================================================
   AuraStylist — JavaScript
   ============================================================ */

// ---- Intersection Observer for fade-in ----------------------
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
fadeEls.forEach(el => observer.observe(el));

// ---- Header scroll shadow -----------------------------------
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });



// ---- Character counter -------------------------------------
const textarea  = document.getElementById('style-description');
const charCount = document.getElementById('char-count');
textarea?.addEventListener('input', () => {
  charCount.textContent = `${textarea.value.length} / 500`;
  charCount.style.color = textarea.value.length > 450 ? '#E062A0' : '';
});

// ---- Example chips -----------------------------------------
window.fillExample = function(text) {
  if (!textarea) return;
  textarea.value = text;
  textarea.dispatchEvent(new Event('input'));
  textarea.focus();
};

// ---- Pill toggles ------------------------------------------
function initPillGroup(groupId) {
  document.getElementById(groupId)?.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => pill.classList.toggle('active'));
  });
}
initPillGroup('fabric-pills');
initPillGroup('style-pills');

// ---- Size buttons ------------------------------------------
document.getElementById('size-grid')?.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('size-grid').querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ---- Colour chips ------------------------------------------
document.getElementById('color-chips-container')?.querySelectorAll('.color-chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// ---- Budget Range Slider ------------------------------------
const minSlider   = document.getElementById('budget-min');
const maxSlider   = document.getElementById('budget-max');
const budgetDisp  = document.getElementById('budget-display');
const rangeFill   = document.getElementById('range-fill');

function formatBudget(val) {
  if (val >= 1000) return `₹${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
  return `₹${val}`;
}

function updateRange() {
  if (!minSlider || !maxSlider) return;
  let min = parseInt(minSlider.value);
  let max = parseInt(maxSlider.value);
  if (min > max) { [min, max] = [max, min]; }

  const total = parseInt(minSlider.max) - parseInt(minSlider.min);
  const leftPct  = ((min - parseInt(minSlider.min)) / total) * 100;
  const rightPct = ((max - parseInt(minSlider.min)) / total) * 100;

  if (rangeFill) {
    rangeFill.style.left  = leftPct + '%';
    rangeFill.style.width = (rightPct - leftPct) + '%';
  }

  if (budgetDisp) {
    const maxLabel = max >= 50000 ? '₹50,000+' : formatBudget(max);
    budgetDisp.textContent = `${formatBudget(min)} – ${maxLabel}`;
  }
}

minSlider?.addEventListener('input', updateRange);
maxSlider?.addEventListener('input', updateRange);
updateRange();

// ---- File Upload -------------------------------------------
const fileInput       = document.getElementById('file-input');
const uploadedPreview = document.getElementById('uploaded-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const uploadZone      = document.getElementById('image-upload-zone');

fileInput?.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedPreview.src = e.target.result;
    uploadedPreview.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
    uploadZone.style.borderStyle = 'solid';
    uploadZone.style.borderColor = 'var(--lavender)';

    // Show file info
    const tags = document.getElementById('uploaded-tags');
    if (tags) {
      tags.innerHTML = `
        <span class="upload-tip">✓ ${file.name} &nbsp;·&nbsp; ${(file.size / 1024).toFixed(0)} KB</span>
        <button class="chip-example" onclick="clearUpload()" style="margin-left:8px;">Remove</button>
      `;
    }
  };
  reader.readAsDataURL(file);
});

window.clearUpload = function() {
  fileInput.value = '';
  uploadedPreview.src = '';
  uploadedPreview.classList.add('hidden');
  uploadPlaceholder.classList.remove('hidden');
  uploadZone.style.borderStyle = 'dashed';
  uploadZone.style.borderColor = '';
  document.getElementById('uploaded-tags').innerHTML = '<span class="upload-tip">Supported: JPG, PNG, WEBP · Max 10MB</span>';
};

// Drag & Drop
uploadZone?.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change'));
  }
});

// ---- AI Sketch Button (mock) --------------------------------
document.getElementById('generate-sketch-btn')?.addEventListener('click', () => {
  const btn = document.getElementById('generate-sketch-btn');
  const desc = textarea?.value?.trim();
  if (!desc) {
    showToast('✍️ Describe your style first for an AI sketch!', 'lavender');
    return;
  }
  btn.disabled = true;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Generating…`;

  setTimeout(() => {
    // Show placeholder image as "AI sketch"
    uploadedPreview.src = 'outfit_placeholder.png';
    uploadedPreview.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
    uploadZone.style.borderStyle = 'solid';
    uploadZone.style.borderColor = 'var(--lavender)';
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> AI Sketch`;
    showToast('✨ AI sketch generated!', 'lavender');
  }, 2200);
});

// ---- Generate Recommendation --------------------------------
document.getElementById('generate-btn')?.addEventListener('click', () => {
  const desc = textarea?.value?.trim();
  const occasion = document.getElementById('occasion-select')?.value;
  const age = document.getElementById('age-select')?.value;

  // Basic validation
  if (!desc) {
    showToast('✍️ Please describe your style first!', 'blush');
    textarea?.focus();
    return;
  }
  if (!occasion) {
    showToast('🎯 Please select an occasion!', 'blush');
    return;
  }
  if (!age) {
    showToast('🎯 Please select your age group!', 'blush');
    return;
  }

  // Collect selections
  const selectedColors = [...document.querySelectorAll('.color-chip.selected')].map(c => c.dataset.color);
  const selectedFabrics = [...document.querySelectorAll('#fabric-pills .pill.active')].map(p => p.dataset.value);
  const selectedStyles  = [...document.querySelectorAll('#style-pills .pill.active')].map(p => p.dataset.value);
  const selectedSize    = document.querySelector('.size-btn.active')?.dataset.value || '';
  const selectedBrand   = document.getElementById('brand-select')?.value;
  const selectedSeason  = document.getElementById('season-select')?.value;
  const budget          = budgetDisp?.textContent || '';

  const prefs = { desc, occasion, age, budget, colors: selectedColors, fabrics: selectedFabrics, styles: selectedStyles, size: selectedSize, brand: selectedBrand, season: selectedSeason };

  startGenerating(prefs);
});

function startGenerating(prefs) {
  const btn  = document.getElementById('generate-btn');
  const text = btn.querySelector('.btn-generate-text');
  btn.classList.add('loading');
  text.textContent = 'Styling your look';

  // Save preferences so the products page can read them
  sessionStorage.setItem('aurastylist_prefs', JSON.stringify(prefs));

  setTimeout(() => {
    // Navigate to the products page
    window.location.href = 'product.html';
  }, 2600);
}

// ---- Toast Notification ------------------------------------
function showToast(message, type = 'lavender') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const colors = {
    lavender: { bg: 'rgba(179,136,255,0.15)', border: 'rgba(179,136,255,0.4)', text: '#7C4DCC' },
    blush:    { bg: 'rgba(255,198,217,0.2)',  border: 'rgba(224,98,160,0.35)', text: '#C2185B' },
  };
  const c = colors[type] || colors.lavender;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: c.bg,
    border: `1px solid ${c.border}`,
    color: c.text,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '40px',
    padding: '12px 24px',
    fontSize: '14px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    zIndex: '9999',
    opacity: '0',
    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    pointerEvents: 'none',
    boxShadow: '0 8px 32px rgba(130,90,180,0.15)',
    whiteSpace: 'nowrap',
  });
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// ---- Add CSS for spin animation ----------------------------
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);
