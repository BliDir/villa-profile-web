// DAI-104 — Room detail gallery with lightbox

const galleryFigures = Array.from(
  document.querySelectorAll('.room-detail__gallery figure')
);

if (galleryFigures.length > 0) {

const galleryImgs = galleryFigures.map(f => f.querySelector('img'));

// ── Build lightbox DOM ────────────────────────────────────────────────────────

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Image viewer');
lightbox.innerHTML = `
  <div class="lightbox__backdrop"></div>
  <div class="lightbox__content">
    <button class="lightbox__prev" aria-label="Previous image">&#8249;</button>
    <img class="lightbox__img" src="" alt="" />
    <button class="lightbox__next" aria-label="Next image">&#8250;</button>
    <button class="lightbox__close" aria-label="Close image viewer">&times;</button>
  </div>
`;
document.body.appendChild(lightbox);

const lbImg   = lightbox.querySelector('.lightbox__img');
const lbPrev  = lightbox.querySelector('.lightbox__prev');
const lbNext  = lightbox.querySelector('.lightbox__next');
const lbClose = lightbox.querySelector('.lightbox__close');

let currentIndex = 0;
let openerEl = null;

function show(index) {
  currentIndex = (index + galleryImgs.length) % galleryImgs.length;
  lbImg.src = galleryImgs[currentIndex].src;
  lbImg.alt = galleryImgs[currentIndex].alt;
}

function open(index, trigger) {
  openerEl = trigger;
  show(index);
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function close() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
  openerEl?.focus();
}

// ── Register figures ──────────────────────────────────────────────────────────

galleryFigures.forEach((fig, i) => {
  fig.classList.add('lightbox-trigger');
  fig.setAttribute('tabindex', '0');
  fig.setAttribute('role', 'button');
  fig.setAttribute('aria-label', `View full size: ${galleryImgs[i]?.alt || 'photo'}`);
  fig.addEventListener('click', () => open(i, fig));
  fig.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, fig); }
  });
});

// ── Controls ──────────────────────────────────────────────────────────────────

lbClose.addEventListener('click', close);
lightbox.querySelector('.lightbox__backdrop').addEventListener('click', close);
lbPrev.addEventListener('click', () => show(currentIndex - 1));
lbNext.addEventListener('click', () => show(currentIndex + 1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape')     close();
  if (e.key === 'ArrowLeft')  show(currentIndex - 1);
  if (e.key === 'ArrowRight') show(currentIndex + 1);
});

// Focus trap
lightbox.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = Array.from(lightbox.querySelectorAll('button'));
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// Swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) show(currentIndex + (delta > 0 ? 1 : -1));
}, { passive: true });

} // end: if (galleryFigures.length > 0)
