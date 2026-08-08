/* ════════════════════════════════════════════════════════════
   WEDNESDAY NIGHT MARKET — CENTRALIZED NAVIGATION
   ------------------------------------------------------------
   SITE_NAV is the single source of truth for every link on the
   site. The header, the mobile menu, and the footer link columns
   all render from this object. To add, rename, reorder, or remove
   a page, edit SITE_NAV below — nothing else needs to change.

   Usage on a page:
     <body data-page="vendors">
       <site-nav></site-nav>
       ...
       <site-footer></site-footer>
       <script src="nav.js"></script>
   ════════════════════════════════════════════════════════════ */

const SITE_NAV = {
  brand: { label: 'WNM', accent: '2026', href: 'index.html' },

  /* Primary pages.
     id          — matches <body data-page="…"> for active state
     header      — show in the top nav (default true)
     footer      — show in the footer "Navigate" column (default true)
     footerLabel — longer label used in the footer only            */
  pages: [
    { id: 'home',     label: 'Home',     href: 'index.html',    header: false },
    { id: 'about',    label: 'About',    href: 'about.html' },
    { id: 'vendors',  label: 'Vendors',  href: 'vendors.html' },
    { id: 'concerts', label: 'Concerts', href: 'concerts.html', footerLabel: 'Concert Schedule' },
    { id: 'vip',      label: 'VIP',      href: 'vip.html',      footerLabel: 'VIP Tickets' },
    { id: 'gallery',  label: 'Gallery',  href: 'gallery.html' },
    { id: 'sponsors', label: 'Sponsors', href: 'sponsors.html' },
    { id: 'donate',   label: 'Donate',   href: 'donate.html' },
    { id: 'contact',  label: 'Contact',  href: 'contact.html' },
    { id: 'vendor-portal', label: 'Vendor Portal', href: 'vendor-portal.html', header: false, footerLabel: 'Vendor Portal' }
  ],

  cta: { label: 'Get VIP Tickets', href: 'vip.html' },

  /* Secondary footer column */
  vendorLinks: [
    { label: 'Craft & Art Applications', href: 'vendor-portal.html' },
    { label: 'Food Vendor Applications', href: 'vendor-portal.html' },
    { label: 'Non-Profit Booths',        href: 'vendor-portal.html' },
    { label: 'Vendor Portal',            href: 'vendor-portal.html' }
  ],

  social: [
    { label: 'Facebook',  glyph: 'f',  href: '#' },
    { label: 'Instagram', glyph: '📷', href: '#' }
  ],

  footer: {
    blurb: "Santa Rosa's largest street fair, celebrating community every Wednesday night from May through August. Free for the whole family.",
    newsletterNote: 'Get weekly lineup updates and market news.',
    copyright: '© 2026 Wednesday Night Market · Santa Rosa, CA · Non-profit organization',
    address: '755 Fourth Street, Suite H, Santa Rosa CA 95404'
  }
};

/* ── helpers ───────────────────────────────────────────────── */
const navPages = (where) => SITE_NAV.pages.filter(p => p[where] !== false);

function currentPageId() {
  if (document.body.dataset.page) return document.body.dataset.page;
  const file = location.pathname.split('/').pop() || 'index.html';
  const match = SITE_NAV.pages.find(p => p.href === file);
  return match ? match.id : 'home';
}

/* ── <site-nav> ────────────────────────────────────────────── */
class SiteNav extends HTMLElement {
  connectedCallback() {
    const active = currentPageId();
    const links = navPages('header').map(p => `
        <li><a href="${p.href}"${p.id === active ? ' class="is-active" aria-current="page"' : ''}>${p.label}</a></li>`
    ).join('');

    this.innerHTML = `
<nav aria-label="Main">
  <a class="nav-logo" href="${SITE_NAV.brand.href}">${SITE_NAV.brand.label} <span class="accent">${SITE_NAV.brand.accent}</span></a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="nav-links">${links}
    <li><a href="${SITE_NAV.cta.href}" class="nav-cta">${SITE_NAV.cta.label}</a></li>
  </ul>
</nav>`;

    const toggle = this.querySelector('.nav-toggle');
    const list = this.querySelector('.nav-links');
    const setOpen = (open) => {
      list.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => setOpen(!list.classList.contains('open')));
    list.addEventListener('click', (e) => { if (e.target.tagName === 'A') setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }
}

/* ── <site-footer> ─────────────────────────────────────────── */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    const navCol = navPages('footer').map(p =>
      `<li><a href="${p.href}">${p.footerLabel || p.label}</a></li>`
    ).join('\n        ');

    const vendorCol = SITE_NAV.vendorLinks.map(l =>
      `<li><a href="${l.href}">${l.label}</a></li>`
    ).join('\n        ');

    const social = SITE_NAV.social.map(s =>
      `<a class="f-s-btn" href="${s.href}" aria-label="${s.label}">${s.glyph}</a>`
    ).join('\n        ');

    this.innerHTML = `
<footer>
  <div class="footer-top">
    <div>
      <div class="f-logo">${SITE_NAV.brand.label} <span>${SITE_NAV.brand.accent}</span></div>
      <p class="f-about">${SITE_NAV.footer.blurb}</p>
      <div class="f-social">
        ${social}
      </div>
    </div>
    <div class="f-col">
      <h4>Navigate</h4>
      <ul>
        ${navCol}
      </ul>
    </div>
    <div class="f-col">
      <h4>Vendors</h4>
      <ul>
        ${vendorCol}
      </ul>
    </div>
    <div class="f-col">
      <h4>Stay Updated</h4>
      <p class="f-note">${SITE_NAV.footer.newsletterNote}</p>
      <div class="f-newsletter">
        <label class="visually-hidden" for="f-email">Email address</label>
        <input id="f-email" type="email" placeholder="Your email">
        <button class="btn-amber" type="button">Join</button>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>${SITE_NAV.footer.copyright}</p>
    <p>${SITE_NAV.footer.address}</p>
  </div>
</footer>`;
  }
}

customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
