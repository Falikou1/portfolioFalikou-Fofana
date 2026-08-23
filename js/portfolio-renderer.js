/**
 * ==========================================================================
 * FALIKOU FOFANA — PORTFOLIO DYNAMIC HYDRATION ENGINE v3.0
 * Connecte le site public avec le CMS Admin en temps réel.
 * Synchronisation instantanée : BroadcastChannel + Storage Event + postMessage + API
 * Rendu 0ms : charge immédiatement les données locales puis synchronise avec le serveur.
 * ==========================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'falikou_portfolio_data';
  const DRAFT_KEY   = 'falikou_portfolio_draft';
  const CHANNEL_NAME = 'falikou_portfolio_channel';

  window.PortfolioEngine = {
    data: null,
    isHydrated: false,

    async init() {
      // 1. Charger immédiatement les données locales (Rendu instantané 0ms)
      this.loadLocalData();

      // 2. Écouter les canaux de communication temps réel
      this.setupListeners();

      // 3. Récupérer les données fraîches depuis le serveur / API / JSON
      await this.fetchServerData();
    },

    loadLocalData() {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(DRAFT_KEY);
      if (raw) {
        try {
          this.data = JSON.parse(raw);
          this.renderAll();
        } catch (e) {
          console.warn('PortfolioEngine: cache local invalide', e);
        }
      }
    },

    async fetchServerData() {
      const endpoints = [
        window.location.pathname.includes('/portfolio/') ? 'api/index.php?route=portfolio' : '/api/portfolio',
        'data/portfolio.json',
        'data/default-portfolio.json'
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { cache: 'no-cache' });
          if (res.ok) {
            const json = await res.json();
            const payload = (json && json.data) ? json.data : json;
            if (payload && (payload.profile || payload.sections)) {
              this.data = payload;
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
              this.renderAll();
              return;
            }
          }
        } catch (_) {}
      }
    },

    renderAll() {
      if (!this.data) return;
      const d = this.data;

      this.applyDesignTheme(d.design);
      this.renderProfile(d.profile);
      this.renderHero(d.profile, d.sections?.hero);
      this.renderMetrics(d.sections?.metrics);
      this.renderProjects(d.projects, d.sections?.projects);
      this.renderExperiences(d.experiences, d.sections?.experience);
      this.renderEducations(d.educations, d.sections?.education);
      this.renderSkills(d.skills, d.sections?.skills);
      this.renderFooter(d.profile);
      this.renderSEO(d.seo);
      this.renderVisibility(d.sections);

      this.isHydrated = true;
    },

    // ── 1. APPARENCE, COULEURS & DESIGN STUDIO ───────────────────────────────
    applyDesignTheme(design) {
      if (!design) return;
      const root = document.documentElement;

      if (design.accentColor) {
        root.style.setProperty('--accent', design.accentColor);
        document.querySelectorAll('.accent-colored').forEach(el => el.style.color = design.accentColor);
      }
      if (design.accentHover) {
        root.style.setProperty('--accent-hover', design.accentHover);
      }
      if (design.bgDark) {
        root.style.setProperty('--bg-dark', design.bgDark);
      }
      if (design.bgCardDark) {
        root.style.setProperty('--bg-card', design.bgCardDark);
      }
      if (design.borderRadius) {
        root.style.setProperty('--border-radius-base', design.borderRadius);
      }
      if (design.fontHeading) {
        root.style.setProperty('--font-sans', design.fontHeading);
        document.body.style.fontFamily = design.fontHeading;
      }
    },

    // ── 2. PROFIL & COORDONNÉES GLOBALES ─────────────────────────────────────
    renderProfile(profile) {
      if (!profile) return;

      const fullName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Falikou FOFANA';

      // Noms et légendes
      document.querySelectorAll('.hero-photo-name, .profile-name, .footer-bigname-text').forEach(el => {
        el.textContent = fullName;
      });

      // Titres professionnels
      document.querySelectorAll('.hero-photo-sub, .profile-title, .hero-author-role').forEach(el => {
        if (profile.title) el.textContent = profile.title;
      });

      // Avatars & Photos
      if (profile.photo) {
        document.querySelectorAll('.hero-img-container img, .brand-avatar, .mobile-drawer-avatar, .hero-photo-img').forEach(img => {
          img.src = profile.photo;
          img.alt = fullName;
        });
      }

      // CV Téléchargement
      if (profile.resumeUrl) {
        document.querySelectorAll('a[download], .desktop-cv-btn, .mobile-drawer-cv-btn, .primary__button[href$=".pdf"]').forEach(a => {
          a.href = profile.resumeUrl;
          a.setAttribute('download', profile.resumeUrl.split('/').pop());
        });
      }
    },

    // ── 3. HERO SECTION (TITRE PRINCIPAL & BIO) ──────────────────────────────
    renderHero(profile, heroConfig) {
      // 1. Titre H1 Principal du site
      const heroH1 = document.querySelector('.hero-h1');
      if (heroH1 && heroConfig && heroConfig.title) {
        heroH1.innerHTML = heroConfig.title.replace(/\n/g, '<br>');
      }

      // 2. Texte de présentation / Bio sous le grand titre
      const heroBio = document.querySelector('.hero-bio');
      if (heroBio && profile) {
        const bioContent = profile.fullBio || profile.shortBio;
        if (bioContent) {
          heroBio.innerHTML = bioContent.replace(/\n/g, '<br>');
        }
      }

      // 3. Sous-titre académique ou badge dans les badges flottants
      if (profile) {
        const academicSub = document.querySelector('.hero-badge-bottom .badge-text-sub');
        if (academicSub && profile.university) academicSub.textContent = profile.university;

        const academicTitle = document.querySelector('.hero-badge-bottom .badge-text-title');
        if (academicTitle && profile.subTitle) academicTitle.textContent = profile.subTitle;
      }
    },

    // ── 4. FAITS MARQUANTS & MÉTRIQUES (COMPTEURS) ───────────────────────────
    renderMetrics(metricsConfig) {
      if (!metricsConfig || !Array.isArray(metricsConfig.items)) return;

      const numbers = document.querySelectorAll('.counter__number');
      const titles  = document.querySelectorAll('.counter__title');
      const descs   = document.querySelectorAll('.counter-desc');

      metricsConfig.items.forEach((m, idx) => {
        if (numbers[idx]) {
          numbers[idx].setAttribute('data-target', m.value);
          numbers[idx].textContent = m.value;
        }
        if (titles[idx] && m.label) titles[idx].textContent = m.label;
        if (descs[idx]  && m.desc)  descs[idx].textContent  = m.desc;
      });
    },

    // ── 5. PROJETS & RÉALISATIONS (CARTES & MODALS) ──────────────────────────
    renderProjects(projects, secConfig) {
      if (!Array.isArray(projects) || projects.length === 0) return;

      const section = document.getElementById('projects');
      if (!section) return;

      // Titres de la section
      if (secConfig) {
        const tagEl = section.querySelector('.section__title');
        if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;

        const titleEl = section.querySelector('h2');
        if (titleEl && secConfig.title) titleEl.textContent = secConfig.title;

        const subEl = section.querySelector('.section__description');
        if (subEl && secConfig.subtitle) subEl.textContent = secConfig.subtitle;
      }

      // Cartes projets dans le DOM
      const cards = section.querySelectorAll('article.project__card');
      projects.forEach((proj, idx) => {
        const card = cards[idx];
        if (!card) return;

        // Image
        const img = card.querySelector('.project-img-box img');
        if (img && proj.image) {
          img.src = proj.image;
          img.alt = proj.title;
        }

        // Année
        const yearTag = card.querySelector('.project-year-tag');
        if (yearTag && proj.year) yearTag.textContent = proj.year;

        // Catégorie
        const cat = card.querySelector('.project__category');
        if (cat && proj.category) cat.textContent = proj.category;

        // Titre
        const title = card.querySelector('.project__title');
        if (title && proj.title) title.textContent = proj.title;

        // Description
        const desc = card.querySelector('.project__summery');
        if (desc && proj.desc) desc.textContent = proj.desc;

        // Visibilité
        card.style.display = (proj.visible === false) ? 'none' : '';
      });

      // Synchroniser l'objet global des détails de modal (utilisé par main.js)
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
    },

    // ── 6. EXPÉRIENCES & PARCOURS ────────────────────────────────────────────
    renderExperiences(experiences, secConfig) {
      if (!Array.isArray(experiences) || experiences.length === 0) return;

      const section = document.getElementById('experience');
      if (!section) return;

      if (secConfig) {
        const tagEl = section.querySelector('.section__title');
        if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;
        const titleEl = section.querySelector('h2');
        if (titleEl && secConfig.title) titleEl.textContent = secConfig.title;
      }

      const roles     = section.querySelectorAll('.exp-role-title');
      const companies = section.querySelectorAll('.exp-company-text');
      const periods   = section.querySelectorAll('.exp-period-badge');
      const descs     = section.querySelectorAll('.exp-desc-text');
      const logos     = section.querySelectorAll('.exp-logo-img');

      experiences.forEach((exp, idx) => {
        if (roles[idx]     && exp.role)    roles[idx].textContent     = exp.role;
        if (companies[idx] && exp.company) companies[idx].textContent = exp.company;
        if (periods[idx]   && exp.period)  periods[idx].textContent   = exp.period;
        if (descs[idx]     && exp.desc)    descs[idx].textContent     = exp.desc;
        if (logos[idx]     && exp.logo)    logos[idx].src             = exp.logo;
      });
    },

    // ── 7. FORMATIONS & CERTIFICATIONS ───────────────────────────────────────
    renderEducations(educations, secConfig) {
      if (!Array.isArray(educations) || educations.length === 0) return;

      const section = document.getElementById('education');
      if (!section) return;

      if (secConfig) {
        const tagEl = section.querySelector('.section__title');
        if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;
      }

      const cards = section.querySelectorAll('.blog__card');
      educations.forEach((edu, idx) => {
        const card = cards[idx];
        if (!card) return;

        const title = card.querySelector('.blog__title');
        if (title && edu.degree) title.textContent = edu.degree;

        const tag = card.querySelector('.blog-tag');
        if (tag && edu.category) tag.textContent = edu.category;

        const desc = card.querySelector('.blog-desc');
        if (desc && edu.desc) desc.innerHTML = edu.desc.replace(/\n/g, '<br>');

        const img = card.querySelector('.blog__figure img, img');
        if (img && edu.logo) {
          img.src = edu.logo;
          img.alt = edu.degree;
        }

        card.style.display = (edu.visible === false) ? 'none' : '';
      });
    },

    // ── 8. COMPÉTENCES & OUTILS ──────────────────────────────────────────────
    renderSkills(skills, secConfig) {
      if (!secConfig) return;
      const section = document.getElementById('skills');
      if (!section) return;

      const tagEl = section.querySelector('.section__title');
      if (tagEl && secConfig.tag) tagEl.textContent = secConfig.tag;

      const titleEl = section.querySelector('h2');
      if (titleEl && secConfig.title) titleEl.textContent = secConfig.title;

      const subEl = section.querySelector('.section__subtitle, .section__description');
      if (subEl && secConfig.subtitle) subEl.textContent = secConfig.subtitle;
    },

    // ── 9. FOOTER & LIENS SOCIAUX ────────────────────────────────────────────
    renderFooter(profile) {
      if (!profile) return;
      const footer = document.querySelector('footer');
      if (!footer) return;

      const phoneLink = footer.querySelector('a[href^="tel:"]');
      if (phoneLink && profile.phone) {
        phoneLink.href = `tel:${(profile.phoneRaw || profile.phone).replace(/\s+/g, '')}`;
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

    // ── 10. BALISES SEO ──────────────────────────────────────────────────────
    renderSEO(seo) {
      if (!seo) return;
      if (seo.metaTitle) document.title = seo.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && seo.metaDescription) metaDesc.setAttribute('content', seo.metaDescription);
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && seo.keywords) metaKeywords.setAttribute('content', seo.keywords);
    },

    // ── 11. VISIBILITÉ DES SECTIONS ──────────────────────────────────────────
    renderVisibility(sections) {
      if (!sections) return;
      const map = {
        hero: '#hero',
        'fun-fact': '#fun-fact',
        metrics: '#fun-fact',
        projects: '#projects',
        experience: '#experience',
        skills: '#skills',
        education: '#education',
        services: '#services',
        contact: '#contact'
      };

      Object.entries(sections).forEach(([key, cfg]) => {
        if (cfg && cfg.visible !== undefined) {
          const sel = map[key] || `#${key}`;
          const el = document.querySelector(sel);
          if (el) el.style.display = cfg.visible ? '' : 'none';
        }
      });
    },

    // ── 12. ÉCOUTE MULTI-CANAUX (BROADCASTCHANNEL + STORAGE + POSTMESSAGE) ──
    setupListeners() {
      // 1. BroadcastChannel (Cross-Tabs temps réel instantané)
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel(CHANNEL_NAME);
          bc.onmessage = (e) => {
            if (e.data && e.data.payload) {
              this.data = e.data.payload;
              this.renderAll();
            }
          };
        }
      } catch (_) {}

      // 2. Storage event (Quand un autre onglet écrit dans localStorage)
      window.addEventListener('storage', (e) => {
        if ((e.key === STORAGE_KEY || e.key === DRAFT_KEY) && e.newValue) {
          try {
            this.data = JSON.parse(e.newValue);
            this.renderAll();
          } catch (_) {}
        }
      });

      // 3. postMessage (Pour iframe preview dans l'admin)
      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'PORTFOLIO_PREVIEW_UPDATE' && e.data.payload) {
          this.data = e.data.payload;
          this.renderAll();
        }
      });

      // Signaler au parent (si iframe) que le portfolio est prêt
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      }
    }
  };

  // Démarrage automatique dès le chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PortfolioEngine.init());
  } else {
    window.PortfolioEngine.init();
  }
})();
