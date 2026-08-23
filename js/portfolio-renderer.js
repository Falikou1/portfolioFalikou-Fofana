/**
 * ==========================================================================
 * FALIKOU FOFANA — PORTFOLIO DYNAMIC HYDRATION & SYNC ENGINE v4.0 (COMPLET)
 * CONTRÔLE ABSOLU ET 100% FONCTIONNEL DU SITE PUBLIC DEPUIS L'ADMIN CMS
 *
 * 1. Synchronisation instantanée 0ms (localStorage) + Cloud API (PHP/JSON/Vercel)
 * 2. Multi-canaux temps réel : BroadcastChannel + StorageEvent + postMessage
 * 3. Contrôle total de TOUS les éléments visibles sur le site public :
 *    - Thème & Couleurs (Accent, Hover, Fond du site, Fond des cartes, Bordures, Textes, Titres, Polices)
 *    - Photos & Images (Profil, Hero, Couvertures, Projets, Logos écoles, Logos entreprises)
 *    - Titres H1/H2, Textes, Biographies, Slogans, Boutons d'action, Badges flottants
 *    - Métriques d'impact & Compteurs animés
 *    - Projets (Cartes, Tags, Modales popups avec détails complets)
 *    - Expériences, Formations et Certifications
 *    - Soft Skills, Compétences et Niveaux
 *    - Services proposés et Contact
 *    - Coordonnées (Téléphone, Email, Réseaux sociaux, CV Téléchargement)
 *    - Visibilité et Balises SEO
 * ==========================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY  = 'falikou_portfolio_data';
  const DRAFT_KEY    = 'falikou_portfolio_draft';
  const CHANNEL_NAME = 'falikou_portfolio_channel';

  window.PortfolioEngine = {
    data: null,
    isLoaded: false,

    async init() {
      // 1. Rendu synchrone immédiat depuis le stockage local (0ms sans aucun scintillement)
      this.loadLocalCache();

      // 2. Établir les écoutes temps réel multi-onglets
      this.setupLiveSync();

      // 3. Charger les données fraîches depuis le serveur / API
      await this.fetchServerData();
    },

    loadLocalCache() {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(DRAFT_KEY);
      if (raw) {
        try {
          this.data = JSON.parse(raw);
          this.renderAll();
        } catch (e) {
          console.warn('PortfolioEngine: lecture cache local', e);
        }
      }
    },

    async fetchServerData() {
      const isLocal = window.location.pathname.includes('/portfolio/') || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.hostname.startsWith('192.168.') || 
                      window.location.hostname.startsWith('10.');

      const endpoints = isLocal
        ? [
            'api/index.php?route=portfolio',
            'data/portfolio.json',
            'https://raw.githubusercontent.com/Falikou1/portfolioFalikou-Fofana/main/data/portfolio.json'
          ]
        : [
            '/api/portfolio',
            'data/portfolio.json',
            'https://raw.githubusercontent.com/Falikou1/portfolioFalikou-Fofana/main/data/portfolio.json'
          ];

      for (const base of endpoints) {
        try {
          const sep = base.includes('?') ? '&' : '?';
          const url = `${base}${sep}_t=${Date.now()}`;
          const res = await fetch(url, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            const payload = (json && json.data) ? json.data : json;
            if (payload && (payload.profile || payload.sections)) {
              const localPublished = this.data?.settings?.lastPublished ? new Date(this.data.settings.lastPublished).getTime() : 0;
              const serverPublished = payload?.settings?.lastPublished ? new Date(payload.settings.lastPublished).getTime() : 0;

              // N'écraser le cache local QUE si les données du serveur sont plus récentes ou égales
              if (serverPublished >= localPublished || !localPublished) {
                this.data = payload;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
                this.renderAll();
                return;
              } else {
                // Les modifications locales sont plus récentes : on conserve les données locales
                return;
              }
            }
          }
        } catch (_) {}
      }
    },

    // =========================================================================
    // RENDU GLOBAL & SYNCHRONISATION EXHAUSTIVE DU DOM
    // =========================================================================
    renderAll() {
      if (!this.data) return;
      const d = this.data;

      // 1. Design & Apparence Visuelle (Couleurs, Fond, Bordures, Polices)
      this.applyDesignTheme(d.design);

      // 2. Profil, Photos & Coordonnées
      this.renderProfile(d.profile);

      // 3. Section Hero (Grand Titre H1, Bio, Boutons, Badges)
      this.renderHero(d.profile, d.sections?.hero);

      // 4. Faits Marquants & Métriques (Compteurs)
      this.renderMetrics(d.sections?.metrics);

      // 5. Projets & Réalisations (Cartes, Images & Popups Modales)
      this.renderProjects(d.projects, d.sections?.projects);

      // 6. Expériences & Parcours
      this.renderExperiences(d.experiences, d.sections?.experience);

      // 7. Formations & Certifications
      this.renderEducations(d.educations, d.sections?.education);

      // 8. Soft Skills & Leadership
      this.renderSkills(d.skills, d.sections?.skills);

      // 9. Services Proposés
      this.renderServices(d.services, d.sections?.services);

      // 10. Contact & Pied de page (Footer)
      this.renderFooter(d.profile, d.sections?.contact);

      // 11. Balises SEO
      this.renderSEO(d.seo);

      // 12. Visibilité des Sections (Affichage / Masquage)
      this.renderSectionsVisibility(d.sections);

      this.isLoaded = true;
    },

    // ── 1. GESTION DES COULEURS & DU THÈME (DESIGN STUDIO) ───────────────────
    applyDesignTheme(design) {
      if (!design) return;
      const root = document.documentElement;

      // Couleur d'accent principale
      if (design.accentColor) {
        root.style.setProperty('--accent', design.accentColor);
        root.style.setProperty('--accent-glow', `${design.accentColor}40`);
        document.querySelectorAll('.accent-colored').forEach(el => el.style.color = design.accentColor);
      }

      // Couleur d'accent au survol (Hover)
      if (design.accentHover) {
        root.style.setProperty('--accent-hover', design.accentHover);
      }

      // Fond général du site (Background)
      if (design.bgDark) {
        root.style.setProperty('--black', design.bgDark);
        root.style.setProperty('--black-alt', design.bgDark);
        root.style.setProperty('--bg-dark', design.bgDark);
        document.body.style.backgroundColor = design.bgDark;
      }

      // Fond des cartes
      if (design.bgCardDark) {
        root.style.setProperty('--card-bg', design.bgCardDark);
        root.style.setProperty('--bg-card', design.bgCardDark);
      }

      // Bordure des cartes
      if (design.borderColor) {
        root.style.setProperty('--card-border', design.borderColor);
        root.style.setProperty('--border-color', design.borderColor);
      }

      // Couleur du texte principal
      if (design.textColor) {
        root.style.setProperty('--light', design.textColor);
        document.body.style.color = design.textColor;
      }

      // Couleur des titres
      if (design.textHeadingColor) {
        root.style.setProperty('--white', design.textHeadingColor);
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, .hero-h1, .blog__title, .project__title, .exp__title').forEach(el => {
          el.style.color = design.textHeadingColor;
        });
      }

      // Arrondi des bordures
      if (design.borderRadius) {
        root.style.setProperty('--radius-lg', design.borderRadius);
        root.style.setProperty('--radius-md', `calc(${design.borderRadius} * 0.75)`);
        root.style.setProperty('--border-radius-base', design.borderRadius);
      }

      // Typographie
      if (design.fontHeading) {
        root.style.setProperty('--font-sans', design.fontHeading);
        root.style.setProperty('--font-primary', design.fontHeading);
        document.body.style.fontFamily = design.fontHeading;
      }
    },

    // ── 2. PROFIL & GESTION DES PHOTOS ───────────────────────────────────────
    renderProfile(profile) {
      if (!profile) return;

      const fullName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Falikou FOFANA';

      // Noms complets
      document.querySelectorAll('.hero-photo-name, .profile-name, .footer-bigname-text').forEach(el => {
        el.textContent = fullName;
      });

      // Titres & rôles
      document.querySelectorAll('.hero-photo-sub, .profile-title, .hero-author-role').forEach(el => {
        if (profile.title) el.textContent = profile.title;
      });

      // Photos et Avatars (Hero, Navbar, Drawer mobile)
      if (profile.photo) {
        document.querySelectorAll('.hero-img-container img, .brand-avatar, .mobile-drawer-avatar, .hero-photo-img').forEach(img => {
          img.src = profile.photo;
          img.alt = fullName;
        });
      }

      // Fichier CV PDF téléchargeable
      if (profile.resumeUrl) {
        const downloadName = profile.resumeFileName || (profile.resumeUrl.startsWith('data:') ? 'CV_Falikou_FOFANA_Data_Analyst.pdf' : profile.resumeUrl.split('/').pop());
        document.querySelectorAll('a[download], .desktop-cv-btn, .mobile-drawer-cv-btn, .primary__button[href*=".pdf"], a[href*=".pdf"], a[title*="CV"], a[title*="cv"]').forEach(a => {
          a.href = profile.resumeUrl;
          a.setAttribute('download', downloadName);
        });
      }

      // Localisation
      if (profile.location) {
        document.querySelectorAll('.badge-location').forEach(el => el.textContent = profile.location);
      }
    },

    // ── 3. HERO SECTION (TITRE PRINCIPAL, BIO, BOUTONS & BADGES) ──────────────
    renderHero(profile, heroConfig) {
      // Grand Titre H1
      const heroH1 = document.querySelector('.hero-h1');
      if (heroH1 && heroConfig && heroConfig.title) {
        heroH1.innerHTML = heroConfig.title.replace(/\n/g, '<br>');
      }

      // Présentation / Bio sous le H1
      const heroBio = document.querySelector('.hero-bio');
      if (heroBio && profile) {
        const bioText = profile.fullBio || profile.shortBio;
        if (bioText) {
          heroBio.innerHTML = bioText.replace(/\n/g, '<br>');
        }
      }

      // Textes des boutons d'action du Hero
      if (heroConfig) {
        const btnCta1 = document.querySelector('.hero-actions .primary__button span, .hero-actions a.primary__button');
        if (btnCta1 && heroConfig.ctaPrimary) {
          const span = btnCta1.querySelector('span') || btnCta1;
          span.textContent = heroConfig.ctaPrimary;
        }

        const btnCta2 = document.querySelector('.hero-actions .outline__button__light span, .hero-actions a.outline__button__light');
        if (btnCta2 && heroConfig.ctaSecondary) {
          const span = btnCta2.querySelector('span') || btnCta2;
          span.textContent = heroConfig.ctaSecondary;
        }

        // Badges flottants
        const badgeTopTitle = document.querySelector('.hero-badge-top .badge-text-title');
        if (badgeTopTitle && heroConfig.badgeTopTitle) badgeTopTitle.textContent = heroConfig.badgeTopTitle;

        const badgeTopSub = document.querySelector('.hero-badge-top .badge-text-sub');
        if (badgeTopSub && heroConfig.badgeTopSub) badgeTopSub.textContent = heroConfig.badgeTopSub;

        const badgeBottomTitle = document.querySelector('.hero-badge-bottom .badge-text-title');
        if (badgeBottomTitle && (heroConfig.badgeBottomTitle || profile?.subTitle)) {
          badgeBottomTitle.textContent = heroConfig.badgeBottomTitle || profile.subTitle;
        }

        const badgeBottomSub = document.querySelector('.hero-badge-bottom .badge-text-sub');
        if (badgeBottomSub && (heroConfig.badgeBottomSub || profile?.university)) {
          badgeBottomSub.textContent = heroConfig.badgeBottomSub || profile.university;
        }
      }
    },

    // ── 4. FAITS MARQUANTS & MÉTRIQUES (COMPTEURS D'IMPACT) ───────────────────
    renderMetrics(metricsConfig) {
      if (!metricsConfig) return;

      const sec = document.getElementById('fun-fact');
      if (sec) {
        const tag = sec.querySelector('.section__title');
        if (tag && metricsConfig.tag) tag.textContent = metricsConfig.tag;
        const h2 = sec.querySelector('h2');
        if (h2 && metricsConfig.title) h2.textContent = metricsConfig.title;
        const desc = sec.querySelector('.section__description');
        if (desc && metricsConfig.description) desc.textContent = metricsConfig.description;
      }

      if (Array.isArray(metricsConfig.items)) {
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
      }
    },

    // ── 5. PROJETS & RÉALISATIONS (CARTES & POPUPS MODALES) ──────────────────
    renderProjects(projects, secConfig) {
      if (!Array.isArray(projects)) return;

      const section = document.getElementById('projects');
      if (!section) return;

      // En-têtes de section
      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
        const desc = section.querySelector('.section__description');
        if (desc && secConfig.subtitle) desc.textContent = secConfig.subtitle;
      }

      // Synchroniser la base de données globale pour les fenêtres modales
      if (!window.projectDetailsData) window.projectDetailsData = {};
      projects.forEach(p => {
        window.projectDetailsData[p.id] = {
          category: p.category,
          title: p.title,
          year: p.year || '',
          role: p.role || 'Data Analyst & Concepteur BI',
          image: p.image || 'assets/images/project-bi.jpg',
          desc: p.desc || '',
          details: Array.isArray(p.details) && p.details.length > 0 ? p.details : [p.desc || ''],
          tags: p.tags || []
        };
      });

      // Cartes projets dans le DOM
      const cards = section.querySelectorAll('article.project__card, .project-card');
      projects.forEach((proj, idx) => {
        const card = cards[idx];
        if (!card) return;

        card.setAttribute('data-project-id', proj.id);

        const img = card.querySelector('.project-img-box img, img');
        if (img && proj.image) {
          img.src = proj.image;
          img.alt = proj.title;
        }

        const yearTag = card.querySelector('.project-year-tag');
        if (yearTag && proj.year) yearTag.textContent = proj.year;

        const cat = card.querySelector('.project__category, .project-category');
        if (cat && proj.category) cat.textContent = proj.category;

        const title = card.querySelector('.project__title, h3');
        if (title && proj.title) title.textContent = proj.title;

        const summery = card.querySelector('.project__summery, p');
        if (summery && proj.desc) summery.textContent = proj.desc;

        // Tags / Badges
        const tagsBox = card.querySelector('.project__content > div:last-child, div:last-child');
        if (tagsBox && Array.isArray(proj.tags) && proj.tags.length > 0) {
          tagsBox.innerHTML = proj.tags.map(t => `<span class="project-tag-pill">${t}</span>`).join(' ');
        }

        // Visibilité
        card.style.display = (proj.visible === false) ? 'none' : '';
      });
    },

    // ── 6. EXPÉRIENCES PROFESSIONNELLES ──────────────────────────────────────
    renderExperiences(experiences, secConfig) {
      if (!Array.isArray(experiences)) return;

      const section = document.getElementById('experience');
      if (!section) return;

      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
        const desc = section.querySelector('.section__description');
        if (desc && secConfig.subtitle) desc.textContent = secConfig.subtitle;
      }

      const cards = section.querySelectorAll('.experience__card, .exp-timeline-item');
      experiences.forEach((exp, idx) => {
        const card = cards[idx];
        if (!card) return;

        const period = card.querySelector('.exp__meta, .exp-period-badge');
        if (period && exp.period) period.textContent = exp.period;

        const title = card.querySelector('.exp__title, .exp-role-title');
        if (title && exp.role) title.textContent = exp.role;

        const comp = card.querySelector('.exp-company-text');
        if (comp && exp.company) comp.textContent = exp.company;

        const summery = card.querySelector('.exp__summery, .exp-desc-text');
        if (summery && exp.desc) summery.innerHTML = exp.desc.replace(/\n/g, '<br>');

        card.style.display = (exp.visible === false) ? 'none' : '';
      });
    },

    // ── 7. FORMATIONS & CERTIFICATIONS ───────────────────────────────────────
    renderEducations(educations, secConfig) {
      if (!Array.isArray(educations)) return;

      const section = document.getElementById('education');
      if (!section) return;

      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
        const desc = section.querySelector('.section__description');
        if (desc && secConfig.subtitle) desc.textContent = secConfig.subtitle;
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

    // ── 8. SOFT SKILLS & LEADERSHIP ──────────────────────────────────────────
    renderSkills(skills, secConfig) {
      const section = document.getElementById('skills');
      if (!section) return;

      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
        const desc = section.querySelector('.section__description');
        if (desc && secConfig.subtitle) desc.textContent = secConfig.subtitle;
      }

      if (Array.isArray(skills)) {
        const cards = section.querySelectorAll('.soft-skill-card, .skill-card');
        skills.forEach((s, idx) => {
          const card = cards[idx];
          if (!card) return;

          const title = card.querySelector('.soft-skill-title, h3');
          if (title && s.name) title.textContent = s.name;

          const desc = card.querySelector('.soft-skill-desc, p');
          if (desc && s.desc) desc.textContent = s.desc;

          const badge = card.querySelector('.soft-skill-badge');
          if (badge && s.category) badge.textContent = s.category;

          card.style.display = (s.visible === false) ? 'none' : '';
        });
      }
    },

    // ── 9. SERVICES PROPOSÉS ─────────────────────────────────────────────────
    renderServices(services, secConfig) {
      const section = document.getElementById('services');
      if (!section) return;

      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
      }
    },

    // ── 10. FOOTER & CONTACT ─────────────────────────────────────────────────
    renderFooter(profile, contactConfig) {
      if (contactConfig) {
        const cTitle = document.querySelector('.footer__title, .contact-title');
        if (cTitle && contactConfig.title) cTitle.textContent = contactConfig.title;
        const cSub = document.querySelector('.contact-subtitle');
        if (cSub && contactConfig.subtitle) cSub.textContent = contactConfig.subtitle;
      }

      if (!profile) return;
      const footer = document.querySelector('footer');
      if (!footer) return;

      const tel = footer.querySelector('a[href^="tel:"]');
      if (tel && profile.phone) {
        tel.href = `tel:${(profile.phoneRaw || profile.phone).replace(/\s+/g, '')}`;
        const span = tel.querySelector('span');
        if (span) span.textContent = `Tèl : ${profile.phone}`;
      }

      const email = footer.querySelector('a[href^="mailto:"]');
      if (email && profile.email) {
        email.href = `mailto:${profile.email}`;
      }

      const linkedin = footer.querySelector('a[title="LinkedIn"]');
      if (linkedin && profile.socials?.linkedin) {
        linkedin.href = profile.socials.linkedin;
      }

      const whatsapp = footer.querySelector('a[title="WhatsApp"]');
      if (whatsapp && profile.socials?.whatsapp) {
        whatsapp.href = profile.socials.whatsapp;
      }

      const copyrightSpan = footer.querySelector('.footer-col-right span');
      if (copyrightSpan && profile.fullName) {
        copyrightSpan.textContent = `© 2026 ${profile.fullName}`;
      }
    },

    // ── 11. BALISES SEO ──────────────────────────────────────────────────────
    renderSEO(seo) {
      if (!seo) return;
      if (seo.metaTitle) document.title = seo.metaTitle;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && seo.metaDescription) desc.setAttribute('content', seo.metaDescription);
      const kw = document.querySelector('meta[name="keywords"]');
      if (kw && seo.keywords) kw.setAttribute('content', seo.keywords);
    },

    // ── 12. VISIBILITÉ DES SECTIONS (ON / OFF) ───────────────────────────────
    renderSectionsVisibility(sections) {
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

    // ── 13. ÉCOUTE TEMPS RÉEL MULTI-CANAUX ───────────────────────────────────
    setupLiveSync() {
      // 1. BroadcastChannel (Cross-Tabs instantané)
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

      // 2. Storage event
      window.addEventListener('storage', (e) => {
        if ((e.key === STORAGE_KEY || e.key === DRAFT_KEY) && e.newValue) {
          try {
            this.data = JSON.parse(e.newValue);
            this.renderAll();
          } catch (_) {}
        }
      });

      // 3. postMessage (Iframe Preview dans l'Admin)
      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'PORTFOLIO_PREVIEW_UPDATE' && e.data.payload) {
          this.data = e.data.payload;
          this.renderAll();
        }
      });

      // Signaler à l'admin que le renderer est prêt
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      }
    }
  };

  // Démarrage automatique au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PortfolioEngine.init());
  } else {
    window.PortfolioEngine.init();
  }
})();
