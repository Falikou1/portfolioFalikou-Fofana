/**
 * ==========================================================================
 * FALIKOU FOFANA — PORTFOLIO DYNAMIC HYDRATION & SYNC ENGINE v5.0 (CV ALIGNED)
 * 1. Synchronisation 0ms (localStorage) + Cloud API
 * 2. Multi-canaux temps réel : BroadcastChannel + StorageEvent + postMessage
 * 3. Séparation nette : Compétences (Logiciels & Outils) ≠ Soft Skills & Formations ≠ Certificats
 * 4. Modale interactive détaillée pour chaque projet
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
      // 1. Rendu synchrone immédiat depuis le cache local (0ms sans scintillement)
      this.loadLocalCache();

      // 2. Établir les écoutes temps réel multi-onglets
      this.setupLiveSync();

      // 3. Injecter la modale globale de projet si absente
      this.injectProjectModal();

      // 4. Charger les données fraîches depuis le serveur / API
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
            'data/default-portfolio.json'
          ]
        : [
            '/api/portfolio',
            'data/portfolio.json',
            'data/default-portfolio.json'
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

              if (serverPublished >= localPublished || !localPublished) {
                this.data = payload;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
                this.renderAll();
                return;
              } else {
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

      // 1. Thème & Styles
      this.applyDesignTheme(d.design);

      // 2. Profil & Identité
      this.renderProfile(d.profile);

      // 3. Hero Section
      this.renderHero(d.profile, d.sections?.hero);

      // 4. Faits Marquants & Métriques
      this.renderMetrics(d.sections?.metrics);

      // 5. Projets (Rendu dynamique complet + modale)
      this.renderProjects(d.projects, d.sections?.projects);

      // 6. Expériences
      this.renderExperiences(d.experiences, d.sections?.experience);

      // 7. Compétences & Outils (Logiciels techniques du CV)
      this.renderTechSkills(d.techSkills || d.skills, d.sections?.techSkills || d.sections?.skills);

      // 8. Soft Skills & Qualités comportementales
      this.renderSoftSkills(d.softSkills, d.sections?.softSkills, d.languagesAndInterests);

      // 9. Formations (Cursus académique)
      this.renderEducations(d.educations, d.sections?.education);

      // 10. Certificats (Certifications officielles)
      this.renderCertifications(d.certifications, d.sections?.certifications);

      // 11. Services Proposés
      this.renderServices(d.services, d.sections?.services);

      // 12. Footer & Contact
      this.renderFooter(d.profile, d.sections?.contact);

      // 13. Balises SEO
      this.renderSEO(d.seo);

      // 14. Visibilité des Sections (Affichage / Masquage)
      this.renderSectionsVisibility(d.sections);

      this.isLoaded = true;
    },

    // ── 1. GESTION DES COULEURS & DU THÈME ───────────────────────────────────
    applyDesignTheme(design) {
      if (!design) return;
      const root = document.documentElement;

      if (design.accentColor) {
        root.style.setProperty('--accent', design.accentColor);
        root.style.setProperty('--accent-glow', `${design.accentColor}40`);
        document.querySelectorAll('.accent-colored').forEach(el => el.style.color = design.accentColor);
      }

      if (design.accentHover) {
        root.style.setProperty('--accent-hover', design.accentHover);
      }

      if (design.bgDark) {
        root.style.setProperty('--black', design.bgDark);
        root.style.setProperty('--black-alt', design.bgDark);
        document.body.style.backgroundColor = design.bgDark;
      }

      if (design.bgCardDark) {
        root.style.setProperty('--card-bg', design.bgCardDark);
      }

      if (design.borderRadius) {
        root.style.setProperty('--radius-lg', design.borderRadius);
        root.style.setProperty('--border-radius-base', design.borderRadius);
      }

      if (design.fontHeading) {
        root.style.setProperty('--font-sans', design.fontHeading);
        document.body.style.fontFamily = design.fontHeading;
      }
    },

    // ── 2. PROFIL & COORDONNÉES ──────────────────────────────────────────────
    renderProfile(profile) {
      if (!profile) return;

      const fullName = profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Falikou FOFANA';

      document.querySelectorAll('.hero-photo-name, .profile-name, .footer-bigname-text, .brand-name').forEach(el => {
        el.textContent = fullName;
      });

      document.querySelectorAll('.hero-photo-sub, .profile-title, .brand-role').forEach(el => {
        if (profile.title) el.textContent = profile.title;
      });

      if (profile.photo) {
        document.querySelectorAll('.hero-img-container img, .brand-avatar, .mobile-drawer-avatar, .hero-photo-img').forEach(img => {
          img.src = profile.photo;
          img.alt = fullName;
        });
      }

      if (profile.resumeUrl) {
        const downloadName = profile.resumeFileName || 'CV_FalikouFOFANA_Data_Analyst.pdf';
        document.querySelectorAll('a[download], .desktop-cv-btn, .mobile-drawer-cv-btn, a[title*="CV"], a[title*="cv"]').forEach(a => {
          a.href = profile.resumeUrl;
          a.setAttribute('download', downloadName);
        });
      }

      if (profile.location) {
        document.querySelectorAll('.badge-location').forEach(el => el.textContent = profile.location);
      }
    },

    // ── 3. HERO SECTION ──────────────────────────────────────────────────────
    renderHero(profile, heroConfig) {
      const heroH1 = document.querySelector('.hero-h1');
      if (heroH1 && heroConfig && heroConfig.title) {
        heroH1.innerHTML = heroConfig.title.replace(/\n/g, '<br>');
      }

      const heroBio = document.querySelector('.hero-bio');
      if (heroBio && profile) {
        const bioText = profile.fullBio || profile.shortBio;
        if (bioText) {
          heroBio.innerHTML = bioText.replace(/\n/g, '<br>');
        }
      }

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

    // ── 4. FAITS MARQUANTS & MÉTRIQUES ───────────────────────────────────────
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

      if (Array.isArray(metricsConfig.items) && metricsConfig.items.length > 0) {
        const container = document.querySelector('.counter__grids');
        if (container) {
          container.innerHTML = metricsConfig.items.map((m, idx) => `
            <div class="counter__box reveal-scale delay-${(idx % 3) + 1} tilt-card active">
              <div class="counter__header">
                <span class="counter__number" data-target="${m.value}">${m.value}</span>
                <span class="counter-suffix">${m.suffix || ''}</span>
              </div>
              <div class="counter__title">${m.label || ''}</div>
              <p class="counter-desc">${m.desc || ''}</p>
            </div>
          `).join('');
        }
      }
    },

    // ── 5. PROJETS & RÉALISATIONS ────────────────────────────────────────────
    renderProjects(projects, secConfig) {
      if (!Array.isArray(projects)) return;

      const section = document.getElementById('projects-experiences') || document.getElementById('projects');
      if (!section) return;

      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
        const desc = section.querySelector('.section__description');
        if (desc && secConfig.subtitle) desc.textContent = secConfig.subtitle;
      }

      // Synchroniser la base de données globale des modales
      window.projectDetailsData = {};
      projects.forEach(p => {
        window.projectDetailsData[p.id] = {
          id: p.id,
          category: p.category || 'Projet',
          title: p.title || '',
          year: p.year || '2026',
          role: p.role || 'Data Analyst',
          image: p.image || 'assets/images/project-bi.jpg',
          desc: p.desc || '',
          details: Array.isArray(p.details) && p.details.length > 0 ? p.details : [p.desc || ''],
          tags: Array.isArray(p.tags) ? p.tags : [],
          githubUrl: p.githubUrl || '',
          demoUrl: p.demoUrl || ''
        };
      });

      const itemsContainer = section.querySelector('.project__items');
      if (itemsContainer) {
        const visibleProjects = projects.filter(p => p.visible !== false);
        itemsContainer.innerHTML = visibleProjects.map((proj, idx) => {
          const tagsHtml = (Array.isArray(proj.tags) ? proj.tags : [])
            .map(t => `<span class="project-tag-pill">${t}</span>`).join(' ');

          const badgeLabel = proj.typeBadge ? `${proj.typeBadge} • ${proj.year || '2026'}` : (proj.year || '2026');

          return `
            <article class="project__card reveal delay-${(idx % 3) + 1} tilt-card active" data-project-id="${proj.id}" style="cursor: pointer;" title="Cliquer pour voir les détails">
              <div class="project-img-box">
                <img src="${proj.image || 'assets/images/project-bi.jpg'}" alt="${proj.title || 'Projet'}" loading="lazy">
                <span class="project-year-tag">${badgeLabel}</span>
              </div>
              <div class="project__content">
                <span class="project__category">${proj.category || 'Projet'}</span>
                <h3 class="project__title">${proj.title || ''}</h3>
                <p class="project__summery">${proj.desc || ''}</p>
                <div style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px;">
                  ${tagsHtml}
                </div>
              </div>
            </article>
          `;
        }).join('');
      }
    },

    // ── 6. EXPÉRIENCES PROFESSIONNELLES ──────────────────────────────────────
    renderExperiences(experiences, secConfig) {
      if (!Array.isArray(experiences)) return;

      const section = document.getElementById('projects-experiences') || document.getElementById('experience');
      if (!section) return;

      const timeline = section.querySelector('.exp-timeline');
      if (timeline) {
        const visibleExp = experiences.filter(e => e.visible !== false);
        timeline.innerHTML = visibleExp.map((exp, idx) => {
          const formattedDesc = (exp.desc || '').replace(/\n/g, '<br>');
          const tagsHtml = (Array.isArray(exp.technologies) ? exp.technologies : [])
            .map(t => `<span class="project-tag-pill">${t}</span>`).join(' ');

          const badgeLabel = exp.typeBadge ? `${exp.typeBadge} • ${exp.period || ''}` : (exp.period || '');

          return `
            <div class="experience__card reveal delay-${(idx % 3) + 1} tilt-card active card-dark" data-exp-id="${exp.id || idx}" style="background: #13141a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
                <span class="exp__meta" style="margin-bottom: 0;">${badgeLabel}</span>
                ${exp.badge ? `<span style="font-size: 0.8rem; padding: 4px 12px; border-radius: 99px; background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: 600;">${exp.badge}</span>` : ''}
              </div>
              <h3 class="exp__title" style="color: #f8fafc; font-size: 1.35rem; margin-bottom: 4px;">${exp.role || ''}</h3>
              <div class="exp-company-text" style="color: var(--accent); font-weight: 600; margin-bottom: 16px;">${exp.company || ''}</div>
              <div class="exp__summery" style="color: #94a3b8; font-size: 0.95rem; line-height: 1.7;">
                <p>${formattedDesc}</p>
              </div>
              ${tagsHtml ? `<div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 6px;">${tagsHtml}</div>` : ''}
            </div>
          `;
        }).join('');
      }
    },

    // ── 7. COMPÉTENCES TECHNIQUES & OUTILS (Logiciels du CV) ─────────────────
    renderTechSkills(skills, secConfig) {
      const section = document.getElementById('skills') || document.getElementById('tech-skills');
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
        const container = section.querySelector('.tech-skills-grid');
        if (container) {
          const themes = ['orange', 'emerald', 'blue', 'purple', 'gold', 'cyan'];
          const visibleSkills = skills.filter(s => s.visible !== false);

          container.innerHTML = visibleSkills.map((s, idx) => {
            const theme = themes[idx % themes.length];
            const iconSvg = window.PortfolioIcons ? window.PortfolioIcons.get(s.icon || s.id, { size: 24 }) : '';
            return `
              <div class="soft-skill-card card-theme-${theme} reveal delay-${(idx % 3) + 1} tilt-card active" data-skill-id="${s.id || idx}">
                <div class="soft-skill-top">
                  <div class="soft-skill-icon">
                    ${iconSvg}
                  </div>
                  <span class="soft-skill-badge">${s.category || 'Outil'}</span>
                </div>
                <h3 class="soft-skill-title">${s.name || ''}</h3>
                <p class="soft-skill-desc">${s.desc || ''}</p>
              </div>
            `;
          }).join('');
        }
      }
    },

    // ── 8. SAVOIR-ÊTRE PROFESSIONNEL (SOFT SKILLS) ───────────────────────────
    renderSoftSkills(softSkills, secConfig, langInterests) {
      const container = document.querySelector('#skills .soft-skills-grid') || 
                        document.querySelector('#soft-skills .soft-skills-grid') || 
                        document.querySelector('.soft-skills-grid');
      if (!container) return;

      if (Array.isArray(softSkills)) {
        const themes = ['orange', 'blue', 'emerald', 'purple', 'rose'];
        const visibleSkills = softSkills.filter(s => s.visible !== false);

        container.innerHTML = visibleSkills.map((s, idx) => {
          const theme = themes[idx % themes.length];
          const iconSvg = window.PortfolioIcons ? window.PortfolioIcons.get(s.icon || s.id, { size: 24 }) : '';
          return `
            <div class="soft-skill-card card-theme-${theme} reveal delay-${(idx % 3) + 1} tilt-card active" data-soft-id="${s.id || idx}">
              <div class="soft-skill-top">
                <div class="soft-skill-icon">
                  ${iconSvg}
                </div>
                <span class="soft-skill-badge">${s.category || 'Soft Skill'}</span>
              </div>
              <h3 class="soft-skill-title">${s.name || ''}</h3>
              <div style="font-size: 0.85rem; color: #ff6b4a; font-weight: 600; margin-bottom: 6px;">${s.proof || ''}</div>
              <p class="soft-skill-desc">${s.desc || ''}</p>
            </div>
          `;
        }).join('');

        // Si Langues & Intérêts sont configurés, injecter la carte dédiée
        if (langInterests) {
          const langHtml = (langInterests.languages || []).map(l => `<strong>${l.name}</strong> (${l.level})`).join(' • ');
          const intHtml = (langInterests.interests || []).map(i => {
            const intSvg = window.PortfolioIcons ? window.PortfolioIcons.get(i.icon || i.name, { size: 16 }) : '';
            return `<span style="display:inline-flex; align-items:center; gap:5px; margin-right:8px;">${intSvg} <span>${i.name}</span></span>`;
          }).join('');

          const globeSvg = window.PortfolioIcons ? window.PortfolioIcons.get('globe', { size: 24 }) : '';

          container.insertAdjacentHTML('beforeend', `
            <div class="soft-skill-card card-theme-gold reveal delay-3 tilt-card active full-width-sm" style="grid-column: 1 / -1; margin-top: 8px;">
              <div class="soft-skill-top">
                <div class="soft-skill-icon">
                  ${globeSvg}
                </div>
                <span class="soft-skill-badge">Langues & Centres d'Intérêt</span>
              </div>
              <h3 class="soft-skill-title">Langues, Mobilité & Centres d'Intérêt</h3>
              <p class="soft-skill-desc" style="margin-bottom: 8px;"><strong>Langues :</strong> ${langHtml}</p>
              <div class="soft-skill-desc" style="display:flex; align-items:center; flex-wrap:wrap; gap:6px;"><strong>Centres d'intérêt :</strong> ${intHtml}</div>
            </div>
          `);
        }
      }
    },

    // ── 9. FORMATIONS ACADÉMIQUES ────────────────────────────────────────────
    renderEducations(educations, secConfig) {
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

      if (Array.isArray(educations)) {
        const container = section.querySelector('.education-items') || section.querySelector('.blog_slider__items');
        if (container) {
          const visibleEdu = educations.filter(e => e.visible !== false);
          container.innerHTML = visibleEdu.map((edu, idx) => {
            const formattedDesc = (edu.desc || '').replace(/\n/g, '<br>');
            return `
              <div class="blog__card reveal-scale delay-${(idx % 3) + 1} tilt-card active" data-edu-id="${edu.id || idx}">
                <div class="blog__figure" style="background: #ffffff; display: flex; align-items: center; justify-content: center;">
                  <img src="${edu.logo || 'assets/images/logo_iua.png'}" alt="${edu.degree || 'Formation'}" style="object-fit: contain; padding: 0.75rem; width: 100%; height: 100%;">
                </div>
                <div class="blog__content">
                  <div class="blog-tag">${edu.category || 'Formation'}</div>
                  <h3 class="blog__title">${edu.degree || ''}</h3>
                  <div style="font-size: 0.85rem; color: #a1a1aa; margin-bottom: 6px;">${edu.institution || ''} • ${edu.period || ''}</div>
                  <p class="blog-desc">${formattedDesc}</p>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    },

    // ── 10. CERTIFICATS (Certifications officielles) ────────────────────────
    renderCertifications(certifications, secConfig) {
      const container = document.querySelector('#education .certifications-grid') || 
                        document.querySelector('#certifications .certifications-grid') || 
                        document.querySelector('.certifications-grid');
      if (!container) return;

      if (Array.isArray(certifications)) {
        const visibleCerts = certifications.filter(c => c.visible !== false);
        container.innerHTML = visibleCerts.map((cert, idx) => `
          <div class="blog__card reveal-scale delay-${(idx % 3) + 1} tilt-card active" data-cert-id="${cert.id || idx}">
            <div class="blog__figure" style="background: #111; display: flex; align-items: center; justify-content: center;">
              <img src="${cert.logo || 'assets/images/project-bi.jpg'}" alt="${cert.title || 'Certification'}" style="object-fit: cover; width: 100%; height: 100%;">
            </div>
            <div class="blog__content">
              <div class="blog-tag">${cert.category || 'Certification'}</div>
              <h3 class="blog__title">${cert.title || ''}</h3>
              <div style="font-size: 0.85rem; color: #ff6b4a; margin-bottom: 6px; font-weight: 600;">${cert.issuer || ''} • ${cert.year || ''}</div>
              <p class="blog-desc">${cert.desc || ''}</p>
            </div>
          </div>
        `).join('');
      }
    },

    // ── 11. SERVICES PROPOSÉS ────────────────────────────────────────────────
    renderServices(services, secConfig) {
      const section = document.getElementById('services');
      if (!section) return;

      if (secConfig) {
        const tag = section.querySelector('.section__title');
        if (tag && secConfig.tag) tag.textContent = secConfig.tag;
        const h2 = section.querySelector('h2');
        if (h2 && secConfig.title) h2.textContent = secConfig.title;
        const desc = section.querySelector('.section__description');
        if (desc && secConfig.subtitle) desc.textContent = secConfig.subtitle;
      }

      if (Array.isArray(services)) {
        const container = section.querySelector('.services-grid');
        if (container) {
          const visibleServices = services.filter(s => s.visible !== false);
          container.innerHTML = visibleServices.map((srv, idx) => {
            const srvSvg = window.PortfolioIcons ? window.PortfolioIcons.get(srv.icon || srv.id, { size: 24 }) : '';
            return `
              <div class="soft-skill-card card-theme-orange reveal delay-${(idx % 3) + 1} tilt-card active">
                <div class="soft-skill-top">
                  <div class="soft-skill-icon">
                    ${srvSvg}
                  </div>
                </div>
                <h3 class="soft-skill-title">${srv.title || ''}</h3>
                <p class="soft-skill-desc">${srv.description || ''}</p>
              </div>
            `;
          }).join('');
        }
      }
    },

    // ── 12. FOOTER & CONTACT ─────────────────────────────────────────────────
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

    // ── 13. BALISES SEO ──────────────────────────────────────────────────────
    renderSEO(seo) {
      if (!seo) return;
      if (seo.metaTitle) document.title = seo.metaTitle;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && seo.metaDescription) desc.setAttribute('content', seo.metaDescription);
      const kw = document.querySelector('meta[name="keywords"]');
      if (kw && seo.keywords) kw.setAttribute('content', seo.keywords);
    },

    // ── 14. VISIBILITÉ DES SECTIONS ──────────────────────────────────────────
    renderSectionsVisibility(sections) {
      if (!sections) return;
      const map = {
        hero: '#hero',
        'fun-fact': '#fun-fact',
        metrics: '#fun-fact',
        projects: '#projects',
        experience: '#experience',
        techSkills: '#skills',
        skills: '#skills',
        softSkills: '#soft-skills',
        education: '#education',
        certifications: '#certifications',
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

    // ── 15. MODALE DÉTAILS PROJET GLOBALE ────────────────────────────────────
    injectProjectModal() {
      if (document.getElementById('portfolioProjectModal')) return;

      const modalHtml = `
        <div id="portfolioProjectModal" class="project-modal-backdrop" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); z-index:999999; align-items:center; justify-content:center; padding:16px; opacity:0; transition:opacity 0.3s ease;" role="dialog" aria-modal="true">
          <div class="project-modal-box" style="background:#131318; border:1px solid rgba(255,255,255,0.12); border-radius:20px; width:100%; max-width:680px; max-height:90vh; overflow-y:auto; padding:24px; position:relative; box-shadow:0 25px 60px rgba(0,0,0,0.8); transform:translateY(20px); transition:transform 0.3s ease;">
            
            <button id="closeProjectModalBtn" style="position:absolute; top:16px; right:16px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#ffffff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s ease;" title="Fermer">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div style="border-radius:14px; overflow:hidden; margin-bottom:18px; max-height:260px; background:#000;">
              <img id="modalProjImage" src="" alt="" style="width:100%; height:100%; object-fit:cover; display:block;">
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
              <span id="modalProjCategory" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent); text-transform:uppercase; font-weight:600; letter-spacing:0.06em;"></span>
              <span id="modalProjYear" style="padding:3px 10px; border-radius:20px; background:rgba(218,56,5,0.15); color:#ff6b4a; font-family:var(--font-mono); font-size:0.75rem; font-weight:600;"></span>
            </div>

            <h2 id="modalProjTitle" style="font-size:1.5rem; margin-bottom:8px; color:#ffffff; line-height:1.3;"></h2>
            <div id="modalProjRole" style="font-size:0.9rem; color:#9ca3af; margin-bottom:14px; font-weight:500;"></div>

            <p id="modalProjDesc" style="font-size:0.95rem; color:#d1d5db; line-height:1.6; margin-bottom:16px;"></p>

            <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:14px; margin-bottom:16px;">
              <div style="font-size:0.85rem; font-weight:700; color:#ffffff; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.04em;">Points Clés & Réalisations :</div>
              <ul id="modalProjDetailsList" style="list-style:none; padding-left:0; margin:0; display:flex; flex-direction:column; gap:8px;"></ul>
            </div>

            <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:14px;">
              <div style="font-size:0.85rem; font-weight:700; color:#ffffff; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.04em;">Technologies & Compétences :</div>
              <div id="modalProjTagsBox" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
            </div>

            <div id="modalProjActions" style="margin-top:20px; display:flex; gap:12px; flex-wrap:wrap;">
              <a id="modalProjGithub" href="" target="_blank" rel="noopener" class="outline__button__light" style="display:none; padding:8px 18px; font-size:0.85rem;">
                <span>Code / GitHub</span>
              </a>
              <a id="modalProjDemo" href="" target="_blank" rel="noopener" class="primary__button" style="display:none; padding:8px 18px; font-size:0.85rem;">
                <span>Démonstration</span>
              </a>
            </div>

          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const modal = document.getElementById('portfolioProjectModal');
      const closeBtn = document.getElementById('closeProjectModalBtn');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeProjectModal());
      }
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeProjectModal();
        });
      }
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeProjectModal();
      });

      document.addEventListener('click', (e) => {
        const card = e.target.closest('.project__card, [data-project-id]');
        if (!card) return;
        if (e.target.closest('a[href^="http"], button')) return;

        const projectId = card.getAttribute('data-project-id');
        if (projectId) {
          this.openProjectModal(projectId);
        }
      });
    },

    openProjectModal(projectId) {
      const modal = document.getElementById('portfolioProjectModal');
      if (!modal) return;

      const data = (window.projectDetailsData && window.projectDetailsData[projectId]) ? window.projectDetailsData[projectId] : null;
      if (!data) return;

      const modalBox = modal.querySelector('.project-modal-box');
      const img = document.getElementById('modalProjImage');
      const cat = document.getElementById('modalProjCategory');
      const year = document.getElementById('modalProjYear');
      const title = document.getElementById('modalProjTitle');
      const role = document.getElementById('modalProjRole');
      const desc = document.getElementById('modalProjDesc');
      const list = document.getElementById('modalProjDetailsList');
      const tagsBox = document.getElementById('modalProjTagsBox');
      const ghBtn = document.getElementById('modalProjGithub');
      const demoBtn = document.getElementById('modalProjDemo');

      if (img) {
        img.src = data.image || 'assets/images/project-bi.jpg';
        img.alt = data.title;
      }
      if (cat) cat.textContent = data.category || 'Projet';
      if (year) year.textContent = data.year || '2026';
      if (title) title.textContent = data.title;
      if (role) role.textContent = data.role ? `Rôle : ${data.role}` : '';
      if (desc) desc.textContent = data.desc || '';

      if (list) {
        list.innerHTML = (Array.isArray(data.details) ? data.details : [data.desc]).map(item => `
          <li style="display:flex; align-items:flex-start; gap:8px; font-size:0.9rem; color:#d1d5db; line-height:1.5;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" style="flex-shrink:0; margin-top:3px;"><polyline points="9 18 15 12 9 6"/></svg>
            <span>${item}</span>
          </li>
        `).join('');
      }

      if (tagsBox) {
        tagsBox.innerHTML = (Array.isArray(data.tags) ? data.tags : []).map(tag => `
          <span class="project-tag-pill">${tag}</span>
        `).join('');
      }

      if (ghBtn) {
        if (data.githubUrl) {
          ghBtn.href = data.githubUrl;
          ghBtn.style.display = 'inline-flex';
        } else {
          ghBtn.style.display = 'none';
        }
      }

      if (demoBtn) {
        if (data.demoUrl) {
          demoBtn.href = data.demoUrl;
          demoBtn.style.display = 'inline-flex';
        } else {
          demoBtn.style.display = 'none';
        }
      }

      modal.style.display = 'flex';
      requestAnimationFrame(() => {
        modal.style.opacity = '1';
        if (modalBox) modalBox.style.transform = 'translateY(0)';
      });
      document.body.style.overflow = 'hidden';
    },

    closeProjectModal() {
      const modal = document.getElementById('portfolioProjectModal');
      if (!modal) return;

      const modalBox = modal.querySelector('.project-modal-box');
      modal.style.opacity = '0';
      if (modalBox) modalBox.style.transform = 'translateY(20px)';

      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    },

    // ── 16. ÉCOUTE TEMPS RÉEL MULTI-CANAUX ───────────────────────────────────
    setupLiveSync() {
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

      window.addEventListener('storage', (e) => {
        if ((e.key === STORAGE_KEY || e.key === DRAFT_KEY) && e.newValue) {
          try {
            this.data = JSON.parse(e.newValue);
            this.renderAll();
          } catch (_) {}
        }
      });

      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'PORTFOLIO_PREVIEW_UPDATE' && e.data.payload) {
          this.data = e.data.payload;
          this.renderAll();
        }
      });

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PortfolioEngine.init());
  } else {
    window.PortfolioEngine.init();
  }
})();
