/**
 * ==========================================================================
 * FALIKOU FOFANA — PORTFOLIO DYNAMIC HYDRATION & SYNC ENGINE v3.5
 * CONTRÔLE TOTAL ET EN TEMPS RÉEL DU SITE PUBLIC DEPUIS L'ADMIN CMS
 *
 * Fonctionnalités clés :
 * 1. Synchronisation 0ms locale (localStorage) + Backend API (PHP/JSON/Vercel)
 * 2. Écoute temps réel : BroadcastChannel + StorageEvent + postMessage
 * 3. Contrôle 100% dynamique de TOUS les éléments visibles :
 *    - Textes, Titres H1/H2/H6, Descriptions et Biographies
 *    - Projets (Création/Édition/Suppression dynamique de cartes & Modals)
 *    - Expériences, Formations et Certifications
 *    - Soft Skills, Compétences et Niveaux
 *    - Métriques d'impact & Compteurs animés
 *    - Coordonnées, Liens de réseaux sociaux et Téléchargement CV
 *    - Couleurs du thème (--accent, --bg-dark, etc.), Polices et Bordures
 *    - Affichage/Masquage de n'importe quelle section
 *    - Balises SEO (Meta Title, Description, Keywords)
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
      // 1. Rendu instantané depuis le cache local (0 milliseconde de latence)
      this.loadLocalCache();

      // 2. Établir les canaux de synchronisation temps réel
      this.setupLiveSync();

      // 3. Récupérer les données fraîches depuis le serveur / API / JSON
      await this.fetchServerData();
    },

    loadLocalCache() {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(DRAFT_KEY);
      if (raw) {
        try {
          this.data = JSON.parse(raw);
          this.renderAll();
        } catch (e) {
          console.warn('PortfolioEngine: Erreur lecture cache local', e);
        }
      }
    },

    async fetchServerData() {
      const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const endpoints = isLocalHost
        ? ['api/index.php?route=portfolio', 'data/portfolio.json', 'data/default-portfolio.json']
        : ['/api/portfolio', 'data/portfolio.json', 'data/default-portfolio.json'];

      for (const url of endpoints) {
        try {
          const res = await fetch(url, { cache: 'no-cache' });
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

    // =========================================================================
    // RENDU GLOBAL ET EXHAUSTIF DU PORTFOLIO
    // =========================================================================
    renderAll() {
      if (!this.data) return;
      const d = this.data;

      // 1. Thème & Styles globaux
      this.applyDesignTheme(d.design);

      // 2. Profil, Identité & Coordonnées
      this.renderProfile(d.profile);

      // 3. Section Hero (Grand Titre, Bio, Badges, CV)
      this.renderHero(d.profile, d.sections?.hero);

      // 4. Section Métriques / Faits Marquants
      this.renderMetrics(d.sections?.metrics);

      // 5. Section Projets & Réalisations (Cartes & Modals)
      this.renderProjects(d.projects, d.sections?.projects);

      // 6. Section Expériences & Leadership
      this.renderExperiences(d.experiences, d.sections?.experience);

      // 7. Section Formations & Diplômes
      this.renderEducations(d.educations, d.sections?.education);

      // 8. Section Compétences & Soft Skills
      this.renderSkills(d.skills, d.sections?.skills);

      // 9. Section Services
      this.renderServices(d.services, d.sections?.services);

      // 10. Footer & Liens Sociaux
      this.renderFooter(d.profile);

      // 11. Balises SEO
      this.renderSEO(d.seo);

      // 12. Visibilité des Sections (Afficher / Masquer)
      this.renderSectionsVisibility(d.sections);

      this.isLoaded = true;
    },

    // ── 1. THÈME & DESIGN STUDIO ─────────────────────────────────────────────
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

      // Noms complets
      document.querySelectorAll('.hero-photo-name, .profile-name, .footer-bigname-text, .mobile-drawer-title').forEach(el => {
        if (el && !el.classList.contains('mobile-drawer-title')) el.textContent = fullName;
      });

      // Titres & rôles
      document.querySelectorAll('.hero-photo-sub, .profile-title, .hero-author-role').forEach(el => {
        if (profile.title) el.textContent = profile.title;
      });

      // Photos et Avatars
      if (profile.photo) {
        document.querySelectorAll('.hero-img-container img, .brand-avatar, .mobile-drawer-avatar, .hero-photo-img').forEach(img => {
          img.src = profile.photo;
          img.alt = fullName;
        });
      }

      // Liens de téléchargement du CV (PDF)
      if (profile.resumeUrl) {
        document.querySelectorAll('a[download], .desktop-cv-btn, .mobile-drawer-cv-btn, .primary__button[href$=".pdf"]').forEach(a => {
          a.href = profile.resumeUrl;
          a.setAttribute('download', profile.resumeUrl.split('/').pop());
        });
      }

      // Localisation
      if (profile.location) {
        document.querySelectorAll('.badge-location').forEach(el => el.textContent = profile.location);
      }
    },

    // ── 3. HERO SECTION (TITRE PRINCIPAL & BIO) ──────────────────────────────
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

      // Badges flottants du Hero
      if (profile) {
        const academicSub = document.querySelector('.hero-badge-bottom .badge-text-sub');
        if (academicSub && profile.university) academicSub.textContent = profile.university;

        const academicTitle = document.querySelector('.hero-badge-bottom .badge-text-title');
        if (academicTitle && profile.subTitle) academicTitle.textContent = profile.subTitle;

        const statusBadge = document.querySelector('.hero-badge-top .badge-text-title');
        if (statusBadge && profile.statusBadge) statusBadge.textContent = profile.statusBadge;
      }
    },

    // ── 4. FAITS MARQUANTS & MÉTRIQUES (COMPTEURS) ───────────────────────────
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

    // ── 5. PROJETS & RÉALISATIONS (CARTES ET MODALS) ─────────────────────────
    renderProjects(projects, secConfig) {
      if (!Array.isArray(projects)) return;

      const section = document.getElementById('projects');
      if (!section) return;

      // En-têtes de la section
      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
        const desc = section.querySelector('.section__description');
        if (desc && secConfig.subtitle) desc.textContent = secConfig.subtitle;
      }

      // Synchroniser la base de données globale des modals de projets
      if (!window.projectDetailsData) window.projectDetailsData = {};
      projects.forEach(p => {
        window.projectDetailsData[p.id] = {
          category: p.category,
          title: p.title,
          year: p.year || '',
          role: p.role || 'Data Analyst & Concepteur BI',
          image: p.image || 'assets/images/project-bi.jpg',
          desc: p.desc || '',
          details: p.details || [p.desc || ''],
          tags: p.tags || []
        };
      });

      // Cartes de projets dans le DOM
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
        const tagsContainer = card.querySelector('div:last-child');
        if (tagsContainer && Array.isArray(proj.tags) && proj.tags.length > 0) {
          tagsContainer.innerHTML = proj.tags.map(t => `<span class="project-tag-pill">${t}</span>`).join(' ');
        }

        // Visibilité
        card.style.display = (proj.visible === false) ? 'none' : '';
      });
    },

    // ── 6. EXPÉRIENCES & LEADERSHIP ──────────────────────────────────────────
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

    // ── 7. FORMATIONS & DIPLÔMES ─────────────────────────────────────────────
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

    // ── 8. COMPÉTENCES & SOFT SKILLS ─────────────────────────────────────────
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

    // ── 10. FOOTER & LIENS SOCIAUX ───────────────────────────────────────────
    renderFooter(profile) {
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

    // ── 12. GESTION DE LA VISIBILITÉ DES SECTIONS ────────────────────────────
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
      // Canal 1 : BroadcastChannel (Synchronisation instantanée entre onglets)
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

      // Canal 2 : Événement Storage (Quand localStorage est modifié depuis un autre onglet)
      window.addEventListener('storage', (e) => {
        if ((e.key === STORAGE_KEY || e.key === DRAFT_KEY) && e.newValue) {
          try {
            this.data = JSON.parse(e.newValue);
            this.renderAll();
          } catch (_) {}
        }
      });

      // Canal 3 : postMessage (Pour l'iframe d'aperçu dans l'administration)
      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'PORTFOLIO_PREVIEW_UPDATE' && e.data.payload) {
          this.data = e.data.payload;
          this.renderAll();
        }
      });

      // Signaler à l'administration que le portfolio est prêt à recevoir des flux
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
