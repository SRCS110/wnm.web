/* Shared page behaviour — loaded on every page. */

/* Scroll reveals */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
} else {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* Vendor category tabs */
const vendorTabs = document.querySelectorAll('.vendor-tab');
vendorTabs.forEach(tab => {
  tab.addEventListener('click', function () {
    vendorTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');
  });
});

/* Gallery filters */
const galleryBtns = document.querySelectorAll('.gf-btn');
const galleryItems = document.querySelectorAll('.gi');
galleryBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    galleryBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    this.classList.add('active');
    this.setAttribute('aria-pressed', 'true');

    const filter = this.dataset.filter;
    galleryItems.forEach(item => {
      const show = !filter || filter === 'all' || item.dataset.category === filter;
      item.hidden = !show;
    });
  });
});
