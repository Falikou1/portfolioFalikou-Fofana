/**
 * FALIKOU FOFANA — Dynamic Portfolio Renderer & Hydration Engine
 * Connects the public website with the CMS backend / localStorage cache.
 * Supports Live Split-View Preview with real-time postMessage streaming.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'falikou_portfolio_data';
  const DRAFT_KEY = 'falikou_portfolio_draft';

  // Check if page is in preview mode (e.g. inside Admin iframe or ?preview=1)
  const urlParams = new URLSearchParams(window.location.search);
  const isPreviewMode = urlParams.get('preview') === '1' || window.self !== window.top;

  window.PortfolioEngine = {
    data: null,
    isLoaded: false,

    async init() {
      // 1. Try to load cached data first for 0ms initial render
      const cached = isPreviewMode ? localStorage.getItem(DRAFT_KEY) || localStorage.getItem(STORAGE_KEY) : localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          this.data = JSON.parse(cached);
          this.render();
        } catch (e) {
          console.warn('Invalid local portfolio cache', e);
        }
      }

      // 2. Fetch fresh data from backend
      await this.fetchFreshData();

      // 3. Setup Live Preview listener for Admin CMS iframe
      if (isPreviewMode) {
        this.setupLivePreviewListener();
      }
    },

    async fetchFreshData() {
      try {
        const endpoint = window.location.pathname.includes('/portfolio/') 
          ? 'api/index.php?route=portfolio' 
          : '/api/portfolio';

        const res = await fetch(endpoint, { cache: 'no-cache' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            this.data = json.data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            this.render();
            return;
          }
        }
      } catch (err) {
        console.log('Using static or cached portfolio data fallback');
      }

      // 4. Fallback to default json file if API offline
      if (!this.data) {
        try {
          const res = await fetch('data/default-portfolio.json');
          if (res.ok) {
            this.data = await res.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            this.render();
          }
        } catch (e) {
          console.warn('Could not load default-portfolio.json', e);
        }
      }
    },

    render() {
      if (!this.data) return;
      const d = this.data;

      // A. APPLY DESIGN TOKENS (CSS VARIABLES)
      if (d.design) {
        const root = document.documentElement;
        if (d.design.accentColor) root.style.setProperty('--accent', d.design.accentColor);
        if (d.design.accentHover) root.style.setProperty('--accent-hover', d.design.accentHover);
        if (d.design.bgDark) root.style.setProperty('--bg-dark', d.design.bgDark);
        if (d.design.bgCardDark) root.style.setProperty('--bg-card', d.design.bgCardDark);
        if (d.design.borderRadius) root.style.setProperty('--border-radius-base', d.design.borderRadius);
        if (d.design.fontHeading) root.style.setProperty('--font-sans', d.design.fontHeading);
      }

      // B. PROFILE & HEADER
      if (d.profile) {
        const p = d.profile;

        // Name & Titles
        document.querySelectorAll('.profile-name, .footer-bigname-text').forEach(el => el.textContent = p.fullName || `${p.firstName} ${p.lastName}`);
        document.querySelectorAll('.profile-title').forEach(el => el.textContent = p.title);
        
        // Brand avatars
        if (p.photo) {
          document.querySelectorAll('.brand-avatar, .mobile-drawer-avatar').forEach(img => {
            img.src = p.photo;
            img.alt = p.fullName;
          });
          const heroAvatar = document.querySelector('.hero-photo-img');
          if (heroAvatar) heroAvatar.src = p.photo;
        }

        // Contact info
        if (p.email) {
          document.querySelectorAll('.link-email').forEach(a => {
            a.href = `mailto:${p.email}`;
            a.textContent = p.email;
          });
        }
        if (p.phone) {
          document.querySelectorAll('.link-phone').forEach(a => {
            a.href = `tel:${p.phoneRaw || p.phone.replace(/\s+/g, '')}`;
            const span = a.querySelector('span');
            if (span) span.textContent = `Tél : ${p.phone}`;
          });
        }
        if (p.location) {
          document.querySelectorAll('.badge-location').forEach(el => el.textContent = p.location);
        }
        if (p.resumeUrl) {
          document.querySelectorAll('a[download]').forEach(a => {
            a.href = p.resumeUrl;
            a.setAttribute('download', p.resumeUrl.split('/').pop());
          });
        }
      }

      // C. SECTION VISIBILITY
      if (d.sections) {
        Object.keys(d.sections).forEach(secKey => {
          const secConfig = d.sections[secKey];
          const secEl = document.getElementById(secKey) || document.querySelector(`section#${secKey}`);
          if (secEl && secConfig.visible !== undefined) {
            secEl.style.display = secConfig.visible ? '' : 'none';
          }
        });
      }

      // D. HERO CONTENT
      if (d.sections && d.sections.hero) {
        const h = d.sections.hero;
        const heroTitle = document.querySelector('.hero__title');
        if (heroTitle && h.title) {
          heroTitle.innerHTML = h.title.replace(/\n/g, '<br>');
        }
        const heroBadge = document.querySelector('.status-indicator span:last-child');
        if (heroBadge && h.badge) heroBadge.textContent = h.badge;
      }

      // E. METRICS
      if (d.sections && d.sections.metrics && Array.isArray(d.sections.metrics.items)) {
        const metricNumbers = document.querySelectorAll('.counter__number');
        d.sections.metrics.items.forEach((m, idx) => {
          if (metricNumbers[idx]) {
            metricNumbers[idx].setAttribute('data-target', m.value);
            metricNumbers[idx].textContent = m.value;
          }
        });
      }

      // F. SEO SETTINGS
      if (d.seo) {
        if (d.seo.metaTitle) document.title = d.seo.metaTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && d.seo.metaDescription) metaDesc.setAttribute('content', d.seo.metaDescription);
      }

      this.isLoaded = true;
    },

    setupLivePreviewListener() {
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PORTFOLIO_PREVIEW_UPDATE') {
          this.data = event.data.payload;
          localStorage.setItem(DRAFT_KEY, JSON.stringify(this.data));
          this.render();
        }
      });

      // Signal to parent window that preview iframe is ready
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      }
    }
  };

  // Initialize engine
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PortfolioEngine.init());
  } else {
    window.PortfolioEngine.init();
  }
})();
