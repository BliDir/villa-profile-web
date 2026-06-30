// DAI-95 — Scroll-triggered fade-in via IntersectionObserver
// Respects prefers-reduced-motion; if motion is reduced the observer still
// runs but instantly marks elements visible so content is never hidden.

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // trigger once only
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('[data-animate]').forEach(el => {
  if (prefersReduced) {
    // Immediately mark visible — no layout shift, no hidden content
    el.classList.add('is-visible');
  } else {
    observer.observe(el);
  }
});
