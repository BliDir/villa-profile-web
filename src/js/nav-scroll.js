// Transparent nav over hero, transitions to solid cream on scroll
const header = document.querySelector('header');
const hero   = document.getElementById('hero');

if (header && hero) {
  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting),
    { threshold: 0.1 }
  );
  observer.observe(hero);
}
