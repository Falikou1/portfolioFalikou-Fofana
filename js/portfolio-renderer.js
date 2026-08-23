/**
 * ==========================================================================
 * FALIKOU FOFANA — PORTFOLIO DYNAMIC RENDERING & HYDRATION ENGINE
 * Connects the public website with the CMS data store / API / localStorage.
 * Handles instant rendering, live preview updates, modal data binding & theming.
 * ==========================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'falikou_portfolio_data';
  const DRAFT_KEY = 'falikou_portfolio_draft';

  const urlParams = new URLSearchParams(window.location.search);
  const isPreviewMode = urlParams.get('preview') === '1' || window.self !== window.top;

  window.PortfolioEngine = {
    data: null,
    isLoaded: false,

    async init() {
      // 1. Load cached data for instant 0ms first render
      const cached = isPreviewMode 
        ? (localStorage.getItem(DRAFT_KEY) || localStorage.getItem(STORAGE_KEY)) 
        : localStorage.getItem(STORAGE_KEY);

      if (cached) {
        try {
          this.data = JSON.parse(cached);
          this.renderAll();
        } catch (e) {
          console.warn('PortfolioEngine: Invalid cache', e);
        }
      }

      // 2. Fetch fresh data from backend / JSON
      await this.fetchData();

      // 3. Setup real-time listener for Admin Live Preview iframe
      this.setupLiveListener();
    },

    async fetchData() {
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
            this.renderAll();
            return;
          }
        }
      } catch (err) {
        // Fallback below
      }

      // Fallback to default json file
      if (!this.data) {
        try {
          const defRes = await fetch('data/default-portfolio.json');
          if (defRes.ok) {
            this.data = await defRes.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            this.renderAll();
          }
        } catch (e) {
          console.warn('PortfolioEngine: Could not load default json', e);
        }
      }
    },

    renderAll() {
      if (!this.data) return;
      const d = this.data;

      this.applyDesignTheme(d.design);
      this.renderProfile(d.profile);
      this.renderSectionsVisibility(d.sections);
      this.renderHero(d.profile, d.sections?.hero);
      this.renderMetrics(d.sections?.metrics);
      this.renderProjects(d.projects, d.sections?.projects);
      this.renderSkills(d.skills, d.sections?.skills);
      this.renderExperiences(d.experiences, d.sections?.experience);
      this.renderEducations(d.educations, d.sections?.education);
      this.renderFooter(d.profile);
      this.renderSEO(d.seo);

      this.isLoaded = true;
    },

    // 1. DESIGN THEME & CSS VARIABLES
    applyDesignTheme(design) {
      if (!design) return;
      const root = document.documentElement;

      if (design.accentColor) {
        root.style.setProperty('--accent', design.accentColor);
        // Also update any inline SVGs with stroke or fill
        document.querySelectorAll('.accent-colored').forEach(el => el.style.color = design.accentColor);
      }
      if (design.accentHover) root.style.setProperty('--accent-hover', design.accentHover);
      if (design.bgDark) root.style.setProperty('--bg-dark', design.bgDark);
      if (design.bgCardDark) root.style.setProperty('--bg-card', design.bgCardDark);
      if (design.borderRadius) root.style.setProperty('--border-radius-base', design.borderRadius);
      if (design.fontHeading) {
        root.style.setProperty('--font-sans', design.fontHeading);
        document.body.style.fontFamily = design.fontHeading;
      }
    },

    // 2. PROFILE & CONTACT INFO
    renderProfile(profile) {
      if (!profile) return;

      // Full Name
      const name = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
      document.querySelectorAll('.profile-name, .footer-bigname-text, .hero-author-name').forEach(el => {
        if (el) el.textContent = name;
      });

      // Title & Subtitle
      document.querySelectorAll('.profile-title, .hero-author-role').forEach(el => {
        if (el) el.textContent = profile.title || '';
      });

      // Avatars & Photos
      if (profile.photo) {
        document.querySelectorAll('.brand-avatar, .mobile-drawer-avatar, .hero-photo-img, .author-avatar').forEach(img => {
          if (img) {
            img.src = profile.photo;
            img.alt = name;
          }
        });
      }

      // Resume Links
      if (profile.resumeUrl) {
        document.querySelectorAll('a[download], .desktop-cv-btn, .mobile-drawer-cv-btn, .cv-download-link').forEach(a => {
          if (a) {
            a.href = profile.resumeUrl;
            a.setAttribute('download', profile.resumeUrl.split('/').pop());
          }
        });
      }

      // Location & University Badges
      if (profile.location) {
        document.querySelectorAll('.badge-location, .badge-text-sub').forEach(el => {
          if (el && el.textContent.includes('Abidjan') || el.classList.contains('badge-location')) {
            el.textContent = profile.location;
          }
        });
      }
    },

    // 3. SECTION VISIBILITY
    renderSectionsVisibility(sections) {
      if (!sections) return;
      Object.keys(sections).forEach(secKey => {
        const secConfig = sections[secKey];
        const secEl = document.getElementById(secKey) || document.querySelector(`section#${secKey}`) || document.querySelector(`footer#${secKey}`);
        if (secEl && secConfig.visible !== undefined) {
          secEl.style.display = secConfig.visible ? '' : 'none';
        }
      });
    },

    // 4. HERO SECTION
    renderHero(profile, heroConfig) {
      const heroTitle = document.querySelector('.hero__title');
      if (heroTitle && heroConfig && heroConfig.title) {
        heroTitle.innerHTML = heroConfig.title.replace(/\n/g, '<br>');
      }

      const heroBio = document.querySelector('.hero__desc');
      if (heroBio && profile && (profile.shortBio || profile.fullBio)) {
        heroBio.innerHTML = (profile.shortBio || profile.fullBio).replace(/\n/g, '<br>');
      }

      const statusBadge = document.querySelector('.status-indicator span:last-child');
      if (statusBadge && (heroConfig?.badge || profile?.statusBadge)) {
        statusBadge.textContent = heroConfig?.badge || profile?.statusBadge;
      }
    },

    // 5. METRICS / FUN-FACT
    renderMetrics(metricsConfig) {
      if (!metricsConfig || !Array.isArray(metricsConfig.items)) return;
      const counterNumbers = document.querySelectorAll('.counter__number');
      const counterLabels = document.querySelectorAll('.counter__card .counter__title');
      const counterDescs = document.querySelectorAll('.counter__card .counter__desc');

      metricsConfig.items.forEach((m, idx) => {
        if (counterNumbers[idx]) {
          counterNumbers[idx].setAttribute('data-target', m.value);
          counterNumbers[idx].textContent = m.value;
        }
        if (counterLabels[idx] && m.label) counterLabels[idx].textContent = m.label;
        if (counterDescs[idx] && m.desc) counterDescs[idx].textContent = m.desc;
      });
    },

    // 6. PROJECTS SECTION & MODAL RE-BINDING
    renderProjects(projects, secConfig) {
      if (!Array.isArray(projects)) return;
      const projectsSection = document.getElementById('projects');
      if (!projectsSection) return;

      if (secConfig) {
        const tagEl = projectsSection.querySelector('.section__title');
        if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;
        const titleEl = projectsSection.querySelector('.heading-h2, .projects-main-title');
        if (titleEl && secConfig.title) titleEl.textContent = secConfig.title;
        const subEl = projectsSection.querySelector('.section__subtitle');
        if (subEl && secConfig.subtitle) subEl.textContent = secConfig.subtitle;
      }

      // Update project detail data for modals in main.js
      if (window.projectDetailsData) {
        projects.forEach(p => {
          window.projectDetailsData[p.id] = {
            category: p.category,
            title: p.title,
            year: p.year || '',
            role: p.role || 'Data Analyst',
            image: p.image || 'assets/images/project-bi.jpg',
            desc: p.desc || '',
            details: p.details || [],
            tags: p.tags || []
          };
        });
      }

      // Update project cards on the page
      const cards = projectsSection.querySelectorAll('.project-card');
      projects.forEach((proj, idx) => {
        if (cards[idx]) {
          cards[idx].setAttribute('data-project-id', proj.id);
          const img = cards[idx].querySelector('.project__image img');
          if (img && proj.image) {
            img.src = proj.image;
            img.alt = proj.title;
          }
          const cat = cards[idx].querySelector('.project-category, .project__tag');
          if (cat && proj.category) cat.textContent = proj.category;
          const title = cards[idx].querySelector('.project__title, h3');
          if (title && proj.title) title.textContent = proj.title;
          const desc = cards[idx].querySelector('.project__desc, p');
          if (desc && proj.desc) desc.textContent = proj.desc;
        }
      });
    },

    // 7. SKILLS SECTION
    renderSkills(skills, secConfig) {
      if (!Array.isArray(skills)) return;
      const skillsSection = document.getElementById('skills');
      if (!skillsSection) return;

      if (secConfig) {
        const tagEl = skillsSection.querySelector('.section__title');
        if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;
        const subEl = skillsSection.querySelector('.section__subtitle');
        if (subEl && secConfig.subtitle) subEl.textContent = secConfig.subtitle;
      }
    },

    // 8. EXPERIENCES SECTION
    renderExperiences(experiences, secConfig) {
      if (!Array.isArray(experiences)) return;
      const expSection = document.getElementById('experience');
      if (!expSection) return;

      if (secConfig) {
        const tagEl = expSection.querySelector('.section__title');
        if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;
      }

      const timelineItems = expSection.querySelectorAll('.timeline-item, .exp-card');
      experiences.forEach((exp, idx) => {
        if (timelineItems[idx]) {
          const roleEl = timelineItems[idx].querySelector('.exp-role-title');
          if (roleEl && exp.role) roleEl.textContent = exp.role;
          const compEl = timelineItems[idx].querySelector('.exp-company-text');
          if (compEl && exp.company) compEl.textContent = exp.company;
          const periodEl = timelineItems[idx].querySelector('.exp-period-badge');
          if (periodEl && exp.period) periodEl.textContent = exp.period;
          const descEl = timelineItems[idx].querySelector('.exp-desc-text');
          if (descEl && exp.desc) descEl.textContent = exp.desc;
          const logoEl = timelineItems[idx].querySelector('.exp-logo-img');
          if (logoEl && exp.logo) logoEl.src = exp.logo;
        }
      });
    },

    // 9. EDUCATIONS & CERTIFICATIONS SECTION
    renderEducations(educations, secConfig) {
      if (!Array.isArray(educations)) return;
      const eduSection = document.getElementById('education');
      if (!eduSection) return;

      if (secConfig) {
        const tagEl = eduSection.querySelector('.section__title');
        if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;
      }

      const eduCards = eduSection.querySelectorAll('.blog__card');
      educations.forEach((edu, idx) => {
        if (eduCards[idx]) {
          const title = eduCards[idx].querySelector('.blog__title');
          if (title && edu.degree) title.textContent = edu.degree;
          const tag = eduCards[idx].querySelector('.blog-tag');
          if (tag && edu.category) tag.textContent = edu.category;
          const desc = eduCards[idx].querySelector('.blog-desc');
          if (desc && edu.desc) desc.innerHTML = edu.desc.replace(/\n/g, '<br>');
          const img = eduCards[idx].querySelector('.blog__figure img');
          if (img && edu.logo) {
            img.src = edu.logo;
            img.alt = edu.degree;
          }
        }
      });
    },

    // 10. FOOTER
    renderFooter(profile) {
      if (!profile) return;
      const footer = document.querySelector('footer');
      if (!footer) return;

      const phoneLink = footer.querySelector('a[href^="tel:"]');
      if (phoneLink && profile.phone) {
        phoneLink.href = `tel:${profile.phoneRaw || profile.phone.replace(/\s+/g, '')}`;
        const span = phoneLink.querySelector('span');
        if (span) span.textContent = `Tél : ${profile.phone}`;
      }

      const emailLink = footer.querySelector('a[href^="mailto:"]');
      if (emailLink && profile.email) {
        emailLink.href = `mailto:${profile.email}`;
      }

      const linkedinLink = footer.querySelector('a[title="LinkedIn"]');
      if (linkedinLink && profile.socials?.linkedin) {
        linkedinLink.href = profile.socials.linkedin;
      }

      const whatsappLink = footer.querySelector('a[title="WhatsApp"]');
      if (whatsappLink && profile.socials?.whatsapp) {
        whatsappLink.href = profile.socials.whatsapp;
      }
    },

    // 11. SEO META TAGS
    renderSEO(seo) {
      if (!seo) return;
      if (seo.metaTitle) document.title = seo.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && seo.metaDescription) metaDesc.setAttribute('content', seo.metaDescription);
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && seo.keywords) metaKeywords.setAttribute('content', seo.keywords);
    },

    // 12. REAL-TIME LIVE LISTENER (IFRAME STREAMING)
    setupLiveListener() {
      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'PORTFOLIO_PREVIEW_UPDATE' && e.data.payload) {
          this.data = e.data.payload;
          localStorage.setItem(DRAFT_KEY, JSON.stringify(this.data));
          this.renderAll();
        }
      });

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      }
    }
  };

  // Run automatically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PortfolioEngine.init());
  } else {
    window.PortfolioEngine.init();
  }
})();
