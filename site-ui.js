(() => {
  let footer = document.querySelector('footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'site-generated-footer';
    const footerMessage = document.createElement('span');
    footerMessage.textContent = 'Made for the next generation of racers.';
    footer.append(footerMessage);
    document.body.append(footer);
  }

  if (!footer.querySelector('.copyright, .site-copyright')) {
    const footerMessage = footer.querySelector('span') || footer;
    const copyright = document.createElement('small');
    copyright.className = 'site-copyright';
    copyright.textContent = '© 2026 PurpleLap-Sim';
    footerMessage.append(copyright);
  }

  const setupStartLink = document.querySelector('[data-scroll-without-hash]');
  if (setupStartLink) {
    window.history.scrollRestoration = 'manual';
    const navigation = window.performance.getEntriesByType('navigation')[0];
    if (navigation?.type === 'reload') {
      window.addEventListener('load', () => window.scrollTo({ top: 0, behavior: 'auto' }), { once: true });
    }

    setupStartLink.addEventListener('click', (event) => {
      const target = document.querySelector(setupStartLink.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }

  if (document.querySelector('#back-to-top')) return;

  const backToTop = document.createElement('button');
  backToTop.className = 'site-back-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V4M5 11l7-7 7 7"/></svg><span>BACK TO TOP</span>';
  document.body.append(backToTop);

  const updateVisibility = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 320);
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  });
  updateVisibility();
})();
