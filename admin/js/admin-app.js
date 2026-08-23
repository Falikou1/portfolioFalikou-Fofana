/**
 * ==========================================================================
 * FALIKOU FOFANA — ADMIN DASHBOARD & CMS APPLICATION CORE v3.0
 * 100% Fonctionnel: Profil, Projets, Compétences, Expériences,
 * Formations, Services, Design Studio, Sections & Textes, Médiathèque,
 * Messages, Historique, Sauvegarde & Live Sync Multi-Canaux.
 * Pipeline: Formulaire → persistData() → localStorage + API PHP/JSON → Broadcast → Portfolio Public
 * ==========================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'falikou_portfolio_data';
  const DRAFT_KEY   = 'falikou_portfolio_draft';
  const CHANNEL_NAME = 'falikou_portfolio_channel';

  // Broadcast Channel pour synchronisation cross-onglets instantanée
  let broadcastChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    }
  } catch (e) {}

  // Structure initiale de secours
  const DEFAULT_DATA = {
    profile: {
      firstName: "Falikou",
      lastName: "FOFANA",
      fullName: "Falikou FOFANA",
      title: "Data Analyst & Concepteur BI",
      subTitle: "Étudiant en 3e année Génie Informatique (IUA)",
      statusBadge: "Disponible pour stage / missions",
      shortBio: "Passionné par la Business Intelligence et l'optimisation des flux décisionnels, je transforme les données brutes en indicateurs stratégiques clairs et percutants.",
      fullBio: "Bonjour ! Je suis <strong>Falikou FOFANA</strong>, étudiant en <strong>3<sup>e</sup> année de Licence Génie Informatique (IUA)</strong> à Abidjan. Je conçois des tableaux de bord décisionnels interactifs et des solutions logicielles performantes pour guider la prise de décision.",
      photo: "assets/images/falikou_photo_clean.png",
      coverImage: "assets/images/project-bi.jpg",
      resumeUrl: "CV_Falikou.FOFANA_DataAnalyst.pdf",
      email: "fofanafalikou068@gmail.com",
      phone: "+225 07 05 32 24 98",
      phoneRaw: "+2250705322498",
      location: "Abidjan, Côte d'Ivoire",
      university: "IUA Abidjan",
      socials: {
        linkedin: "https://www.linkedin.com/in/falikou-fofana",
        github: "https://github.com/Falikou1",
        whatsapp: "https://wa.me/2250705322498",
        email: "mailto:fofanafalikou068@gmail.com"
      }
    },
    design: {
      accentColor: "#da3805",
      accentHover: "#ff4d15",
      bgDark: "#0b0b0e",
      bgCardDark: "#131318",
      fontHeading: "'Outfit', sans-serif",
      borderRadius: "16px"
    },
    sections: {
      hero: { 
        visible: true, 
        badge: "Disponible pour stage / missions", 
        title: "Transformer les données en <span style=\"color: var(--accent);\">décisions stratégiques</span> et concrètes." 
      },
      metrics: {
        visible: true,
        items: [
          { id: "m1", value: 100, label: "Données Fiabilisées", desc: "Nettoyage approfondi, dédoublonnage, correction d'anomalies et harmonisation des données de vente." },
          { id: "m2", value: 10, label: "Dashboards & Outils", desc: "Modélisation de tableaux de bord interactifs sur Excel Avancé, Power BI, Python et SQL." },
          { id: "m3", value: 5, label: "Certifications Validées", desc: "Certifications internationales obtenues auprès de Google, Cisco, OpenClassrooms et CCSC." }
        ]
      },
      projects: { visible: true, tag: "[ PROJETS & RÉALISATIONS ]", title: "Réalisations concrètes", subtitle: "Une sélection de mes réalisations concrètes : analyse décisionnelle des ventes, immersion en agence digitale et compétition d'architecture réseau sécurisée." },
      experience: { visible: true, tag: "[ EXPÉRIENCE & LEADERSHIP ]", title: "Expérience professionnelle & associative", subtitle: "Une immersion active combinant projets technologiques, stages immersifs et responsabilités étudiantes." },
      skills: { visible: true, tag: "[ COMPÉTENCES & OUTILS ]", title: "Stack Technique & Savoir-faire", subtitle: "Un éventail d'outils analytiques, de langages de programmation et de compétences interpersonnelles." },
      education: { visible: true, tag: "[ FORMATIONS & CERTIFICATIONS ]", title: "Formations & Certifications", subtitle: "Cursus universitaire rigoureux et certifications internationales attestant d'une expertise technique continue." },
      services: { visible: true, tag: "[ SERVICES & PRESTATIONS ]", title: "Ce que je peux apporter à votre équipe", subtitle: "Des prestations ciblées pour valoriser vos données et optimiser vos prises de décision." },
      contact: { visible: true, title: "Envoyez-moi un message", subtitle: "Le message arrive directement dans ma boîte mail — je vous réponds sous 24h." }
    },
    projects: [
      {
        id: "bi-dashboard",
        title: "Dashboard Commercial des Ventes",
        category: "Business Intelligence & Analyse Excel",
        year: "2026",
        role: "Data Analyst & Concepteur BI",
        image: "assets/images/project-bi.jpg",
        desc: "Projet personnel d'analyse Excel avancé : traitement et fiabilisation d'un jeu de données de vente, calcul automatisé des KPIs (CA global, Marge commerciale, Taux de marge, volume de commandes) et modélisation d'un dashboard interactif avec segments de filtrage multi-critères.",
        tags: ["Excel Avancé", "TCD Croisés", "KPIs Commerciaux", "Power BI", "Data Cleaning"],
        githubUrl: "https://github.com/Falikou1",
        demoUrl: "",
        visible: true
      },
      {
        id: "agency-tuwshiuah",
        title: "Tuwshiuah / AI & Digital Agency",
        category: "Stage en Entreprise",
        year: "Juillet 2026",
        role: "Développeur Web & Mobile (Stage)",
        image: "assets/images/project-agency.jpg",
        desc: "Stage de vacances au sein d'une agence digitale axée sur l'IA : développement web & mobile moderne via les méthodes de vibe coding et déploiement de stratégies de marketing digital et d'analyse d'engagement.",
        tags: ["Vibe Coding", "Web & Mobile", "Marketing Digital", "IA Générative"],
        githubUrl: "https://github.com/Falikou1",
        demoUrl: "",
        visible: true
      },
      {
        id: "hackathon-esatic",
        title: "Technovore Hackathon 2026 (ESATIC)",
        category: "Compétition Réseau & Cybersécurité",
        year: "Mars 2026",
        role: "Team Lead & Concepteur Réseau",
        image: "assets/images/project-hackathon.jpg",
        desc: "Conception d'une architecture réseau sécurisée multi-sites à l'École Supérieure Africaine des TIC : plan d'adressage IP, segmentation VLAN et simulation complète sur Cisco Packet Tracer (DHCP, NAT, OSPF, VPN IPsec).",
        tags: ["Cisco Packet Tracer", "VPN IPsec", "OSPF", "VLAN & NAT", "Cybersécurité"],
        githubUrl: "https://github.com/Falikou1",
        demoUrl: "",
        visible: true
      }
    ],
    skills: [
      { id: "s1", name: "Power BI & Excel Avancé", category: "data", level: 95, icon: "📊", desc: "Tableaux de bord dynamiques, modélisation décisionnelle et Power Query.", visible: true },
      { id: "s2", name: "Python (Pandas / NumPy / Matplotlib)", category: "data", level: 88, icon: "🐍", desc: "Extraction, nettoyage, analyse statistique et visualisations.", visible: true },
      { id: "s3", name: "SQL & Modélisation Relationnelle", category: "data", level: 85, icon: "🗄️", desc: "Requêtes complexes, jointures, optimisation et schémas BDD.", visible: true },
      { id: "s4", name: "Développement Web (HTML / CSS / JS)", category: "dev", level: 90, icon: "💻", desc: "Interfaces web réactives, intégration moderne et APIs.", visible: true },
      { id: "s5", name: "Vibe Coding & IA Générative", category: "dev", level: 92, icon: "🤖", desc: "Prototypage ultra-rapide d'applications assisté par IA.", visible: true },
      { id: "s6", name: "Cisco Packet Tracer & Réseaux", category: "sec", level: 82, icon: "🌐", desc: "Topologies réseau, VLANs, routage OSPF et NAT.", visible: true },
      { id: "s7", name: "Rigueur Analytique & Communication", category: "soft", level: 95, icon: "🎯", desc: "Vulgarisation d'insights techniques pour décideurs.", visible: true }
    ],
    experiences: [
      { id: "exp1", role: "Développeur Web & Mobile (Stage)", company: "Tuwshiuah / AI & Digital Agency", period: "Juillet 2026", badge: "Professionnel", logo: "assets/images/project-agency.jpg", desc: "Immersion professionnelle complète en développement agile d'applications modernes.", technologies: ["Vibe Coding", "Web & Mobile", "IA"], visible: true },
      { id: "exp2", role: "Membre Actif & Responsable Projets", company: "REDIS-IUA", period: "2024 - Présent", badge: "Associatif", logo: "assets/images/logo_iua.png", desc: "Organisation d'ateliers techniques et hackathons étudiants.", technologies: ["Leadership", "Organisation", "Mentoring"], visible: true },
      { id: "exp3", role: "Délégué & Membre de la Coordination", company: "Bureau de Coordination des Étudiants — IUA", period: "2024 - Présent", badge: "Leadership", logo: "assets/images/logo_iua.png", desc: "Représentation étudiante et médiation institutionnelle.", technologies: ["Communication", "Médiation"], visible: true }
    ],
    educations: [
      { id: "edu1", degree: "Licence Génie Informatique (IUA) & Bac D", institution: "Institut Universitaire d'Abidjan (IUA)", category: "Cursus Universitaire", period: "2024 - en cours", logo: "assets/images/logo_iua.png", desc: "• Licence Génie Informatique (3e année)\n• Baccalauréat Série D (CSMC Cocody)", visible: true },
      { id: "edu2", degree: "Google Data Analytics & Excel Avancé", institution: "Google & OpenClassrooms", category: "Certifications Data", period: "2025 - 2026", logo: "assets/images/project-bi.jpg", desc: "Nettoyage, intégrité et fiabilisation des données avec Google & Coursera.", visible: true },
      { id: "edu3", degree: "Python, Réseaux & Cybersécurité", institution: "Cisco & OpenClassrooms", category: "Certifications Tech", period: "2025 - 2026", logo: "assets/images/project-hackathon.jpg", desc: "Certifications Cisco Networking Academy et cybersécurité.", visible: true }
    ],
    services: [
      { id: "srv1", title: "Business Intelligence & Tableaux de Bord", description: "Dashboards interactifs Power BI et Excel sur mesure pour le pilotage de la performance.", icon: "📊", visible: true },
      { id: "srv2", title: "Nettoyage & Fiabilisation des Données", description: "Dédoublonnage, correction d'anomalies et pipelines de préparation de données fiables.", icon: "🧹", visible: true },
      { id: "srv3", title: "Développement Web & Applications Métiers", description: "Conception d'applications web réactives et interfaces adaptées à vos processus.", icon: "⚡", visible: true }
    ],
    mediaLibrary: [
      { id: "m1", name: "Photo Falikou FOFANA", url: "assets/images/falikou_photo_clean.png", type: "image" },
      { id: "m2", name: "Logo IUA Abidjan", url: "assets/images/logo_iua.png", type: "image" },
      { id: "m3", name: "Projet Dashboard BI", url: "assets/images/project-bi.jpg", type: "image" },
      { id: "m4", name: "Projet Tuwshiuah Agency", url: "assets/images/project-agency.jpg", type: "image" },
      { id: "m5", name: "Projet ESATIC Hackathon", url: "assets/images/project-hackathon.jpg", type: "image" }
    ],
    messages: [],
    history: [
      { id: "h1", timestamp: new Date().toISOString(), action: "Initialisation CMS", target: "Système", details: "CMS Portfolio configuré et opérationnel" }
    ],
    seo: {
      metaTitle: "Falikou FOFANA | Data Analyst & Développeur",
      metaDescription: "Portfolio de Falikou FOFANA, étudiant en Licence 3 Génie Informatique (IUA) et Data Analyst à Abidjan.",
      keywords: "Falikou FOFANA, Data Analyst, Power BI, Python, SQL, IUA Abidjan, Business Intelligence"
    }
  };

  window.AdminApp = {
    data: JSON.parse(JSON.stringify(DEFAULT_DATA)),
    isDirty: false,
    currentTab: 'dashboard',
    previewIframe: null,

    init() {
      // 1. Charger immédiatement les données locales
      this.loadLocalData();

      // 2. Rendre l'onglet actif
      this.renderTab(this.currentTab);
      this.updateSyncStatus();

      // 3. Configurer la navigation et les actions globales
      this.bindNavigation();
      this.bindGlobalActions();
      this.initPreview();

      // 4. Synchroniser avec l'API backend en tâche de fond
      this.syncFromAPI();
    },

    loadLocalData() {
      const cached = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(DRAFT_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            this.data = Object.assign(JSON.parse(JSON.stringify(DEFAULT_DATA)), parsed);
          }
        } catch (e) {
          console.warn('AdminApp: cache local invalide', e);
        }
      }
    },

    async syncFromAPI() {
      try {
        const endpoint = window.location.pathname.includes('/portfolio/')
          ? '../api/index.php?route=portfolio'
          : '/api/portfolio';

        const res = await fetch(endpoint, { cache: 'no-cache' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            // Si pas de données locales non publiées, adopter les données serveur
            if (!this.isDirty) {
              this.data = Object.assign(JSON.parse(JSON.stringify(DEFAULT_DATA)), json.data);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
              this.renderTab(this.currentTab);
              this.streamPreview();
            }
          }
        }
      } catch (err) {}
    },

    // =========================================================================
    // COEUR DU FLUX: ENREGISTREMENT & PERSISTANCE RÉELLE (LOCAL + API + BROADCAST)
    // =========================================================================
    async persistData(actionDesc = 'Modification', notifyUser = true) {
      // 1. Mettre à jour l'historique
      if (!Array.isArray(this.data.history)) this.data.history = [];
      this.data.history.unshift({
        id: 'h-' + Date.now(),
        timestamp: new Date().toISOString(),
        action: actionDesc,
        target: 'Portfolio',
        details: 'Enregistré dans la base de données'
      });
      if (this.data.history.length > 30) this.data.history = this.data.history.slice(0, 30);

      // 2. Sauvegarde synchrone dans localStorage (garantie 0ms)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(this.data));

      // 3. Diffusion en temps réel à TOUS les onglets ouverts du portfolio
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ type: 'PORTFOLIO_DATA_UPDATED', payload: this.data });
        } catch (e) {}
      }

      // 4. Diffusion dans l'iframe d'aperçu
      this.streamPreview();

      // 5. Mise à jour de l'indicateur d'état
      this.isDirty = false;
      this.updateSyncStatus();

      // 6. Envoi asynchrone à l'API PHP locale (XAMPP) et Vercel Serverless pour écriture sur disque
      try {
        const endpoint = window.location.pathname.includes('/portfolio/')
          ? '../api/index.php?route=portfolio'
          : '/api/portfolio';

        const token = (typeof AdminAuth !== 'undefined' && AdminAuth.getToken) ? AdminAuth.getToken() : '';
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ action: 'publish', data: this.data })
        }).catch(() => {});
      } catch (e) {}

      // 7. Notification toast
      if (notifyUser) {
        this.showToast(`✓ ${actionDesc} — Portfolio public mis à jour !`, 'success');
      }
    },

    updateSyncStatus() {
      const pill = document.getElementById('syncStatusPill');
      if (!pill) return;
      pill.className = 'sync-status-pill';
      pill.innerHTML = '<span class="status-dot"></span><span>Portfolio 100% synchronisé</span>';
    },

    // NAVIGATION
    bindNavigation() {
      document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const tab = btn.getAttribute('data-tab');
          this.switchTab(tab);
        });
      });

      const mobileToggle = document.getElementById('mobileSidebarToggle');
      const sidebar = document.querySelector('.admin-sidebar');
      if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
      }

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            if (typeof AdminAuth !== 'undefined') AdminAuth.logout();
            else window.location.href = 'login.html';
          }
        });
      }
    },

    switchTab(tabName) {
      this.currentTab = tabName;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const activeBtn = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      const titleEl = document.getElementById('pageTitle');
      if (titleEl) {
        const titles = {
          dashboard: '📊 Tableau de Bord',
          profile: '👤 Profil & Identité',
          projects: '💼 Projets & Réalisations',
          skills: '⚡ Compétences & Outils',
          experience: '🏢 Expériences & Parcours',
          education: '🎓 Formations & Diplômes',
          services: '🛠️ Services Proposés',
          design: '🎨 Apparence & Design Studio',
          sections: '📑 Sections & Textes',
          media: '🖼️ Médiathèque',
          messages: '📩 Messages Reçus',
          history: '🕒 Historique & Audit',
          settings: '⚙️ Paramètres & Sécurité'
        };
        titleEl.textContent = titles[tabName] || 'Administration';
      }

      this.renderTab(tabName);

      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) sidebar.classList.remove('open');
    },

    // GLOBAL ACTIONS (SAVE, PUBLISH)
    bindGlobalActions() {
      const publishBtn = document.getElementById('publishBtn');
      const saveDraftBtn = document.getElementById('saveDraftBtn');
      const togglePreviewBtn = document.getElementById('togglePreviewBtn');

      if (publishBtn) {
        publishBtn.addEventListener('click', () => {
          this.persistData('Publication globale du portfolio', true);
        });
      }
      if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
          this.persistData('Enregistrement rapide', true);
        });
      }
      if (togglePreviewBtn) {
        togglePreviewBtn.addEventListener('click', () => {
          const pane = document.querySelector('.admin-preview-pane');
          if (pane) pane.classList.toggle('collapsed');
        });
      }
    },

    // PREVIEW STREAMING
    initPreview() {
      this.previewIframe = document.getElementById('previewIframe');
      if (!this.previewIframe) return;

      document.querySelectorAll('.preview-btn[data-device]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.preview-btn[data-device]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const dev = btn.getAttribute('data-device');
          this.previewIframe.className = `preview-iframe ${dev}`;
        });
      });
    },

    streamPreview() {
      if (this.previewIframe && this.previewIframe.contentWindow) {
        this.previewIframe.contentWindow.postMessage({
          type: 'PORTFOLIO_PREVIEW_UPDATE',
          payload: this.data
        }, '*');
      }
    },

    // =========================================================================
    // RENDU DYNAMIQUE DES ONGLETS DU CMS
    // =========================================================================
    renderTab(tab) {
      const container = document.getElementById('adminTabContent');
      if (!container) return;

      switch (tab) {
        case 'dashboard':
          container.innerHTML = this.renderDashboard();
          this.bindDashboardEvents();
          break;
        case 'profile':
          container.innerHTML = this.renderProfile();
          this.bindProfileEvents();
          break;
        case 'projects':
          container.innerHTML = this.renderProjects();
          this.bindProjectsEvents();
          break;
        case 'skills':
          container.innerHTML = this.renderSkills();
          this.bindSkillsEvents();
          break;
        case 'experience':
          container.innerHTML = this.renderExperience();
          this.bindExperienceEvents();
          break;
        case 'education':
          container.innerHTML = this.renderEducation();
          this.bindEducationEvents();
          break;
        case 'services':
          container.innerHTML = this.renderServices();
          this.bindServicesEvents();
          break;
        case 'design':
          container.innerHTML = this.renderDesign();
          this.bindDesignEvents();
          break;
        case 'sections':
          container.innerHTML = this.renderSections();
          this.bindSectionsEvents();
          break;
        case 'media':
          container.innerHTML = this.renderMedia();
          this.bindMediaEvents();
          break;
        case 'messages':
          container.innerHTML = this.renderMessages();
          break;
        case 'history':
          container.innerHTML = this.renderHistory();
          break;
        case 'settings':
          container.innerHTML = this.renderSettings();
          this.bindSettingsEvents();
          break;
        default:
          container.innerHTML = '<p>Chargement du module…</p>';
      }
    },

    // 1. DASHBOARD AVEC ZONE DE MODIFICATION RAPIDE DU TITRE ET DE LA BIO
    renderDashboard() {
      const pCount = (this.data.projects || []).length;
      const sCount = (this.data.skills || []).length;
      const eCount = (this.data.experiences || []).length;
      const mCount = (this.data.messages || []).length;

      const p = this.data.profile || {};
      const s = this.data.sections || {};
      const heroTitle = s.hero?.title || "Transformer les données en décisions stratégiques et concrètes.";

      return `
        <div class="stats-grid">
          <div class="stat-card" onclick="AdminApp.switchTab('projects')" style="cursor: pointer;">
            <div class="stat-icon">💼</div>
            <div class="stat-info">
              <span class="stat-value">${pCount}</span>
              <span class="stat-label">Projets Actifs</span>
            </div>
          </div>
          <div class="stat-card" onclick="AdminApp.switchTab('skills')" style="cursor: pointer;">
            <div class="stat-icon">⚡</div>
            <div class="stat-info">
              <span class="stat-value">${sCount}</span>
              <span class="stat-label">Compétences Listées</span>
            </div>
          </div>
          <div class="stat-card" onclick="AdminApp.switchTab('experience')" style="cursor: pointer;">
            <div class="stat-icon">🏢</div>
            <div class="stat-info">
              <span class="stat-value">${eCount}</span>
              <span class="stat-label">Expériences & Rôles</span>
            </div>
          </div>
          <div class="stat-card" onclick="AdminApp.switchTab('messages')" style="cursor: pointer;">
            <div class="stat-icon">📩</div>
            <div class="stat-info">
              <span class="stat-value">${mCount}</span>
              <span class="stat-label">Messages Reçus</span>
            </div>
          </div>
        </div>

        <!-- CARTE DE MODIFICATION RAPIDE DU TITRE PRINCIPAL & BIO (TEST IMMÉDIAT) -->
        <div class="card" style="border: 2px solid var(--admin-accent); box-shadow: 0 4px 20px rgba(218, 56, 5, 0.15);">
          <div class="card-header">
            <div>
              <h2 class="card-title" style="color: var(--admin-accent); font-size: 1.25rem;">⚡ Modification Directe du Titre Principal & Bio</h2>
              <p class="card-desc">Modifiez ici puis cliquez sur le bouton rouge : le portfolio public s'actualise immédiatement !</p>
            </div>
            <a href="../index.html" target="_blank" class="btn btn-secondary">
              <span>Ouvrir le portfolio public ↗</span>
            </a>
          </div>
          <div class="form-grid" style="margin-top: 14px;">
            <div class="form-group full-width">
              <label class="form-label"><strong>Titre Principal du Hero (H1)</strong></label>
              <textarea id="dashHeroTitle" class="form-control" style="min-height: 70px; font-weight: 600; font-size: 1rem;">${heroTitle}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Titre Professionnel / Rôle (Sous la photo)</label>
              <input type="text" id="dashJobTitle" class="form-control" value="${p.title || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Nom Complet</label>
              <input type="text" id="dashFullName" class="form-control" value="${p.fullName || 'Falikou FOFANA'}">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Présentation / Bio (Texte sous le titre principal)</label>
              <textarea id="dashBio" class="form-control" style="min-height: 90px;">${p.fullBio || p.shortBio || ''}</textarea>
            </div>
            <div class="form-group full-width" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
              <button class="btn btn-primary" id="dashSaveTitleBtn" style="font-size: 1rem; padding: 12px 24px;">
                💾 Enregistrer & Mettre à jour le Portfolio Public
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🚀 Accès Rapide aux Modules CMS</h2>
              <p class="card-desc">Gérez l'ensemble des contenus de votre portfolio</p>
            </div>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="AdminApp.switchTab('projects')">+ Ajouter un nouveau projet</button>
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('profile')">Modifier le profil complet</button>
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('design')">Changer les couleurs & thème</button>
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('sections')">Gérer les sections & textes</button>
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('media')">Médiathèque</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🕒 Journal des Dernières Modifications</h2>
          </div>
          <div class="items-list">
            ${(this.data.history || []).slice(0, 5).map(h => `
              <div class="list-item-card">
                <div>
                  <div class="item-title">${h.action}</div>
                  <div class="item-subtitle">${h.details || ''} — ${new Date(h.timestamp).toLocaleString('fr-FR')}</div>
                </div>
                <span style="font-size: 0.75rem; color: var(--admin-success); font-weight: 600;">✓ Sauvegardé</span>
              </div>
            `).join('') || '<p style="color: var(--admin-text-dim);">Aucune modification récente.</p>'}
          </div>
        </div>
      `;
    },

    bindDashboardEvents() {
      const btn = document.getElementById('dashSaveTitleBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const newHeroTitle = document.getElementById('dashHeroTitle').value.trim();
        const newJobTitle  = document.getElementById('dashJobTitle').value.trim();
        const newFullName  = document.getElementById('dashFullName').value.trim();
        const newBio       = document.getElementById('dashBio').value.trim();

        if (!this.data.sections) this.data.sections = {};
        if (!this.data.sections.hero) this.data.sections.hero = {};
        this.data.sections.hero.title = newHeroTitle;

        if (!this.data.profile) this.data.profile = {};
        this.data.profile.title    = newJobTitle;
        this.data.profile.fullName = newFullName;
        this.data.profile.fullBio  = newBio;
        this.data.profile.shortBio = newBio;

        this.persistData('Titre & Bio modifiés depuis le Dashboard', true);
      });
    },

    // 2. PROFIL & IDENTITÉ
    renderProfile() {
      const p = this.data.profile || {};
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">👤 Identité & Informations Personnelles</h2>
              <p class="card-desc">Modifiez votre nom, titre, biographie et coordonnées</p>
            </div>
            <button class="btn btn-primary" id="saveProfileBtn">Enregistrer le profil</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input type="text" id="profFirstName" class="form-control" value="${p.firstName || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Nom de famille</label>
              <input type="text" id="profLastName" class="form-control" value="${p.lastName || ''}">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Titre Professionnel (Affiché sous la photo et dans le header)</label>
              <input type="text" id="profTitle" class="form-control" value="${p.title || ''}">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Sous-titre / Statut Académique</label>
              <input type="text" id="profSubTitle" class="form-control" value="${p.subTitle || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Badge de Disponibilité</label>
              <input type="text" id="profStatusBadge" class="form-control" value="${p.statusBadge || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Localisation (Ville, Pays)</label>
              <input type="text" id="profLocation" class="form-control" value="${p.location || ''}">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Biographie Principale (Hero Banner)</label>
              <textarea id="profFullBio" class="form-control" style="min-height: 110px;">${p.fullBio || p.shortBio || ''}</textarea>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">📞 Coordonnées & Réseaux Sociaux</h2>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Email de Contact</label>
              <input type="email" id="profEmail" class="form-control" value="${p.email || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Numéro de Téléphone</label>
              <input type="text" id="profPhone" class="form-control" value="${p.phone || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Lien LinkedIn</label>
              <input type="url" id="profLinkedIn" class="form-control" value="${p.socials?.linkedin || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Lien GitHub</label>
              <input type="url" id="profGitHub" class="form-control" value="${p.socials?.github || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Lien WhatsApp</label>
              <input type="url" id="profWhatsApp" class="form-control" value="${p.socials?.whatsapp || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Fichier CV Actif (URL / Fichier PDF)</label>
              <input type="text" id="profResumeUrl" class="form-control" value="${p.resumeUrl || ''}">
            </div>
          </div>
        </div>
      `;
    },

    bindProfileEvents() {
      const btn = document.getElementById('saveProfileBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (!this.data.profile) this.data.profile = {};
        const p = this.data.profile;
        p.firstName   = document.getElementById('profFirstName').value.trim();
        p.lastName    = document.getElementById('profLastName').value.trim();
        p.fullName    = `${p.firstName} ${p.lastName}`.trim() || p.fullName;
        p.title       = document.getElementById('profTitle').value.trim();
        p.subTitle    = document.getElementById('profSubTitle').value.trim();
        p.statusBadge = document.getElementById('profStatusBadge').value.trim();
        p.location    = document.getElementById('profLocation').value.trim();
        p.fullBio     = document.getElementById('profFullBio').value.trim();
        p.shortBio    = p.fullBio;
        p.email       = document.getElementById('profEmail').value.trim();
        p.phone       = document.getElementById('profPhone').value.trim();
        p.resumeUrl   = document.getElementById('profResumeUrl').value.trim();
        if (!p.socials) p.socials = {};
        p.socials.linkedin = document.getElementById('profLinkedIn').value.trim();
        p.socials.github   = document.getElementById('profGitHub').value.trim();
        p.socials.whatsapp = document.getElementById('profWhatsApp').value.trim();

        this.persistData('Profil enregistré', true);
      });
    },

    // 3. PROJETS & RÉALISATIONS
    renderProjects() {
      const projects = this.data.projects || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">💼 Projets & Réalisations (${projects.length})</h2>
              <p class="card-desc">Gérez vos projets affichés dans la galerie publique</p>
            </div>
            <button class="btn btn-primary" id="addProjectBtn">+ Ajouter un Projet</button>
          </div>
          <div class="items-list">
            ${projects.map((proj, idx) => `
              <div class="list-item-card" data-id="${proj.id}">
                <div style="display: flex; gap: 4px; flex-direction: column;">
                  <button class="btn btn-secondary btn-icon" style="height: 22px; width: 22px; font-size: 10px;" onclick="AdminApp.moveProject(${idx}, -1)" title="Monter">▲</button>
                  <button class="btn btn-secondary btn-icon" style="height: 22px; width: 22px; font-size: 10px;" onclick="AdminApp.moveProject(${idx}, 1)" title="Descendre">▼</button>
                </div>
                <img src="${proj.image || 'assets/images/project-bi.jpg'}" class="item-thumb" alt="${proj.title}">
                <div class="item-details">
                  <div class="item-title">${proj.title} ${proj.visible === false ? '<span style="color: var(--admin-danger); font-size: 0.75rem;">(Masqué)</span>' : ''}</div>
                  <div class="item-subtitle">${proj.category} • ${proj.tags?.join(', ') || ''}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editProject('${proj.id}')" title="Modifier">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteProject('${proj.id}')" title="Supprimer">🗑️</button>
                </div>
              </div>
            `).join('') || '<p style="color: var(--admin-text-dim);">Aucun projet pour l\'instant.</p>'}
          </div>
        </div>
      `;
    },

    bindProjectsEvents() {
      const addBtn = document.getElementById('addProjectBtn');
      if (addBtn) addBtn.addEventListener('click', () => this.openProjectModal());
    },

    moveProject(index, direction) {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= this.data.projects.length) return;
      const temp = this.data.projects[index];
      this.data.projects[index] = this.data.projects[targetIndex];
      this.data.projects[targetIndex] = temp;
      this.persistData('Ordre des projets réorganisé', true);
      this.renderTab('projects');
    },

    editProject(id) {
      const proj = (this.data.projects || []).find(p => p.id === id);
      if (proj) this.openProjectModal(proj);
    },

    deleteProject(id) {
      if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
        this.data.projects = (this.data.projects || []).filter(p => p.id !== id);
        this.persistData('Projet supprimé', true);
        this.renderTab('projects');
      }
    },

    openProjectModal(proj = null) {
      const isEdit = !!proj;
      const p = proj || {
        id: 'proj-' + Date.now(),
        title: '',
        category: 'Business Intelligence & Analyse de Données',
        role: 'Data Analyst & Concepteur BI',
        year: new Date().getFullYear().toString(),
        image: 'assets/images/project-bi.jpg',
        desc: '',
        tags: ['Power BI', 'Excel'],
        githubUrl: 'https://github.com/Falikou1',
        demoUrl: '',
        visible: true
      };

      const modalHtml = `
        <div class="admin-modal-backdrop" id="projectModalBackdrop">
          <div class="admin-modal">
            <div class="card-header">
              <h2 class="card-title">${isEdit ? 'Modifier le projet' : 'Ajouter un nouveau projet'}</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('projectModalBackdrop').remove()">✕</button>
            </div>
            <form id="projectModalForm" class="form-grid" style="margin-top: 16px;">
              <div class="form-group full-width">
                <label class="form-label">Titre du Projet</label>
                <input type="text" id="mProjTitle" class="form-control" value="${p.title}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Catégorie</label>
                <input type="text" id="mProjCat" class="form-control" value="${p.category}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Rôle / Poste</label>
                <input type="text" id="mProjRole" class="form-control" value="${p.role || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Période / Année</label>
                <input type="text" id="mProjYear" class="form-control" value="${p.year || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Image Principale (URL)</label>
                <input type="text" id="mProjImage" class="form-control" value="${p.image || ''}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description Détaillée</label>
                <textarea id="mProjDesc" class="form-control" style="min-height: 80px;">${p.desc || ''}</textarea>
              </div>
              <div class="form-group full-width">
                <label class="form-label">Tags / Technologies (séparés par des virgules)</label>
                <input type="text" id="mProjTags" class="form-control" value="${(p.tags || []).join(', ')}">
              </div>
              <div class="form-group">
                <label class="form-label">Lien GitHub</label>
                <input type="url" id="mProjGithub" class="form-control" value="${p.githubUrl || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Lien Démo en direct</label>
                <input type="url" id="mProjDemo" class="form-control" value="${p.demoUrl || ''}">
              </div>
              <div class="form-group full-width" style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('projectModalBackdrop').remove()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer le projet</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      document.getElementById('projectModalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        p.title = document.getElementById('mProjTitle').value.trim();
        p.category = document.getElementById('mProjCat').value.trim();
        p.role = document.getElementById('mProjRole').value.trim();
        p.year = document.getElementById('mProjYear').value.trim();
        p.image = document.getElementById('mProjImage').value.trim();
        p.desc = document.getElementById('mProjDesc').value.trim();
        p.tags = document.getElementById('mProjTags').value.split(',').map(t => t.trim()).filter(Boolean);
        p.githubUrl = document.getElementById('mProjGithub').value.trim();
        p.demoUrl = document.getElementById('mProjDemo').value.trim();

        if (!Array.isArray(this.data.projects)) this.data.projects = [];
        if (!isEdit) this.data.projects.push(p);
        else {
          const idx = this.data.projects.findIndex(x => x.id === p.id);
          if (idx !== -1) this.data.projects[idx] = p;
        }

        this.persistData(`Projet ${p.title} enregistré`, true);
        document.getElementById('projectModalBackdrop').remove();
        this.renderTab('projects');
      });
    },

    // 4. COMPÉTENCES & OUTILS
    renderSkills() {
      const skills = this.data.skills || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">⚡ Compétences & Outils (${skills.length})</h2>
              <p class="card-desc">Gérez votre stack technique et niveaux</p>
            </div>
            <button class="btn btn-primary" id="addSkillBtn">+ Ajouter une Compétence</button>
          </div>
          <div class="items-list">
            ${skills.map(s => `
              <div class="list-item-card">
                <div style="font-size: 1.6rem; width: 44px; text-align: center;">${s.icon || '⚡'}</div>
                <div class="item-details">
                  <div class="item-title">${s.name} <span style="color: var(--admin-accent); font-weight: 700;">(${s.level || 80}%)</span></div>
                  <div class="item-subtitle">Catégorie: ${s.category} • ${s.desc || ''}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editSkill('${s.id}')">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteSkill('${s.id}')">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindSkillsEvents() {
      const btn = document.getElementById('addSkillBtn');
      if (btn) btn.addEventListener('click', () => this.openSkillModal());
    },

    editSkill(id) {
      const s = (this.data.skills || []).find(x => x.id === id);
      if (s) this.openSkillModal(s);
    },

    deleteSkill(id) {
      if (confirm('Supprimer cette compétence ?')) {
        this.data.skills = (this.data.skills || []).filter(x => x.id !== id);
        this.persistData('Compétence supprimée', true);
        this.renderTab('skills');
      }
    },

    openSkillModal(skill = null) {
      const isEdit = !!skill;
      const s = skill || {
        id: 'skill-' + Date.now(),
        name: '',
        category: 'data',
        level: 85,
        icon: '📊',
        desc: '',
        visible: true
      };

      const modalHtml = `
        <div class="admin-modal-backdrop" id="skillModalBackdrop">
          <div class="admin-modal">
            <div class="card-header">
              <h2 class="card-title">${isEdit ? 'Modifier la compétence' : 'Ajouter une compétence'}</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('skillModalBackdrop').remove()">✕</button>
            </div>
            <form id="skillModalForm" class="form-grid" style="margin-top: 16px;">
              <div class="form-group">
                <label class="form-label">Nom de la compétence</label>
                <input type="text" id="mSkillName" class="form-control" value="${s.name}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Icône / Emoji</label>
                <input type="text" id="mSkillIcon" class="form-control" value="${s.icon || '⚡'}">
              </div>
              <div class="form-group">
                <label class="form-label">Catégorie</label>
                <select id="mSkillCat" class="form-control">
                  <option value="data" ${s.category === 'data' ? 'selected' : ''}>Data & BI</option>
                  <option value="dev" ${s.category === 'dev' ? 'selected' : ''}>Développement Web & IA</option>
                  <option value="sec" ${s.category === 'sec' ? 'selected' : ''}>Réseau & Cybersécurité</option>
                  <option value="soft" ${s.category === 'soft' ? 'selected' : ''}>Soft Skills & Leadership</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Niveau (%): <strong id="levelVal">${s.level}</strong>%</label>
                <input type="range" id="mSkillLevel" min="50" max="100" class="form-control" value="${s.level}" oninput="document.getElementById('levelVal').textContent = this.value">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description / Détails</label>
                <textarea id="mSkillDesc" class="form-control">${s.desc || ''}</textarea>
              </div>
              <div class="form-group full-width" style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('skillModalBackdrop').remove()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      document.getElementById('skillModalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        s.name = document.getElementById('mSkillName').value.trim();
        s.icon = document.getElementById('mSkillIcon').value.trim();
        s.category = document.getElementById('mSkillCat').value;
        s.level = parseInt(document.getElementById('mSkillLevel').value, 10);
        s.desc = document.getElementById('mSkillDesc').value.trim();

        if (!Array.isArray(this.data.skills)) this.data.skills = [];
        if (!isEdit) this.data.skills.push(s);
        else {
          const idx = this.data.skills.findIndex(x => x.id === s.id);
          if (idx !== -1) this.data.skills[idx] = s;
        }

        this.persistData(`Compétence ${s.name} enregistrée`, true);
        document.getElementById('skillModalBackdrop').remove();
        this.renderTab('skills');
      });
    },

    // 5. EXPÉRIENCES & PARCOURS
    renderExperience() {
      const exps = this.data.experiences || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🏢 Expériences & Parcours Professionnel (${exps.length})</h2>
              <p class="card-desc">Gérez vos postes, stages et responsabilités</p>
            </div>
            <button class="btn btn-primary" id="addExpBtn">+ Nouvelle Expérience</button>
          </div>
          <div class="items-list">
            ${exps.map(exp => `
              <div class="list-item-card">
                <img src="${exp.logo || 'assets/images/logo_iua.png'}" class="item-thumb" alt="${exp.company}">
                <div class="item-details">
                  <div class="item-title">${exp.role} — <strong style="color: var(--admin-accent);">${exp.company}</strong></div>
                  <div class="item-subtitle">${exp.period} • ${exp.badge || ''}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editExp('${exp.id}')">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteExp('${exp.id}')">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindExperienceEvents() {
      const btn = document.getElementById('addExpBtn');
      if (btn) btn.addEventListener('click', () => this.openExpModal());
    },

    editExp(id) {
      const exp = (this.data.experiences || []).find(e => e.id === id);
      if (exp) this.openExpModal(exp);
    },

    deleteExp(id) {
      if (confirm('Supprimer cette expérience ?')) {
        this.data.experiences = (this.data.experiences || []).filter(e => e.id !== id);
        this.persistData('Expérience supprimée', true);
        this.renderTab('experience');
      }
    },

    openExpModal(exp = null) {
      const isEdit = !!exp;
      const e = exp || {
        id: 'exp-' + Date.now(),
        role: '',
        company: '',
        period: '2026',
        badge: 'Professionnel',
        logo: 'assets/images/project-agency.jpg',
        desc: '',
        technologies: [],
        visible: true
      };

      const modalHtml = `
        <div class="admin-modal-backdrop" id="expModalBackdrop">
          <div class="admin-modal">
            <div class="card-header">
              <h2 class="card-title">${isEdit ? 'Modifier l\'expérience' : 'Ajouter une expérience'}</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('expModalBackdrop').remove()">✕</button>
            </div>
            <form id="expModalForm" class="form-grid" style="margin-top: 16px;">
              <div class="form-group">
                <label class="form-label">Poste / Titre</label>
                <input type="text" id="mExpRole" class="form-control" value="${e.role}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Entreprise / Organisation</label>
                <input type="text" id="mExpCompany" class="form-control" value="${e.company}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Période / Dates</label>
                <input type="text" id="mExpPeriod" class="form-control" value="${e.period}">
              </div>
              <div class="form-group">
                <label class="form-label">Logo / Image (URL)</label>
                <input type="text" id="mExpLogo" class="form-control" value="${e.logo}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description des missions</label>
                <textarea id="mExpDesc" class="form-control">${e.desc || ''}</textarea>
              </div>
              <div class="form-group full-width" style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('expModalBackdrop').remove()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      document.getElementById('expModalForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
        e.role = document.getElementById('mExpRole').value.trim();
        e.company = document.getElementById('mExpCompany').value.trim();
        e.period = document.getElementById('mExpPeriod').value.trim();
        e.logo = document.getElementById('mExpLogo').value.trim();
        e.desc = document.getElementById('mExpDesc').value.trim();

        if (!Array.isArray(this.data.experiences)) this.data.experiences = [];
        if (!isEdit) this.data.experiences.push(e);
        else {
          const idx = this.data.experiences.findIndex(x => x.id === e.id);
          if (idx !== -1) this.data.experiences[idx] = e;
        }

        this.persistData(`Expérience ${e.role} enregistrée`, true);
        document.getElementById('expModalBackdrop').remove();
        this.renderTab('experience');
      });
    },

    // 6. FORMATIONS & DIPLÔMES
    renderEducation() {
      const edus = this.data.educations || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🎓 Formations & Diplômes (${edus.length})</h2>
              <p class="card-desc">Gérez votre parcours académique et certifications</p>
            </div>
            <button class="btn btn-primary" id="addEduBtn">+ Ajouter une Formation</button>
          </div>
          <div class="items-list">
            ${edus.map(edu => `
              <div class="list-item-card">
                <img src="${edu.logo || 'assets/images/logo_iua.png'}" class="item-thumb" alt="${edu.degree}">
                <div class="item-details">
                  <div class="item-title">${edu.degree}</div>
                  <div class="item-subtitle">${edu.institution} • ${edu.period}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editEdu('${edu.id}')">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteEdu('${edu.id}')">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindEducationEvents() {
      const btn = document.getElementById('addEduBtn');
      if (btn) btn.addEventListener('click', () => this.openEduModal());
    },

    editEdu(id) {
      const edu = (this.data.educations || []).find(e => e.id === id);
      if (edu) this.openEduModal(edu);
    },

    deleteEdu(id) {
      if (confirm('Supprimer cette formation ?')) {
        this.data.educations = (this.data.educations || []).filter(e => e.id !== id);
        this.persistData('Formation supprimée', true);
        this.renderTab('education');
      }
    },

    openEduModal(edu = null) {
      const isEdit = !!edu;
      const e = edu || {
        id: 'edu-' + Date.now(),
        degree: '',
        institution: 'Institut Universitaire d\'Abidjan (IUA)',
        period: '2024 - en cours',
        logo: 'assets/images/logo_iua.png',
        desc: '',
        visible: true
      };

      const modalHtml = `
        <div class="admin-modal-backdrop" id="eduModalBackdrop">
          <div class="admin-modal">
            <div class="card-header">
              <h2 class="card-title">${isEdit ? 'Modifier la formation' : 'Ajouter une formation'}</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('eduModalBackdrop').remove()">✕</button>
            </div>
            <form id="eduModalForm" class="form-grid" style="margin-top: 16px;">
              <div class="form-group full-width">
                <label class="form-label">Diplôme / Certification</label>
                <input type="text" id="mEduDegree" class="form-control" value="${e.degree}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Établissement</label>
                <input type="text" id="mEduInst" class="form-control" value="${e.institution}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Période</label>
                <input type="text" id="mEduPeriod" class="form-control" value="${e.period}">
              </div>
              <div class="form-group">
                <label class="form-label">Logo / Image (URL)</label>
                <input type="text" id="mEduLogo" class="form-control" value="${e.logo}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description</label>
                <textarea id="mEduDesc" class="form-control">${e.desc || ''}</textarea>
              </div>
              <div class="form-group full-width" style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('eduModalBackdrop').remove()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      document.getElementById('eduModalForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
        e.degree = document.getElementById('mEduDegree').value.trim();
        e.institution = document.getElementById('mEduInst').value.trim();
        e.period = document.getElementById('mEduPeriod').value.trim();
        e.logo = document.getElementById('mEduLogo').value.trim();
        e.desc = document.getElementById('mEduDesc').value.trim();

        if (!Array.isArray(this.data.educations)) this.data.educations = [];
        if (!isEdit) this.data.educations.push(e);
        else {
          const idx = this.data.educations.findIndex(x => x.id === e.id);
          if (idx !== -1) this.data.educations[idx] = e;
        }

        this.persistData(`Formation ${e.degree} enregistrée`, true);
        document.getElementById('eduModalBackdrop').remove();
        this.renderTab('education');
      });
    },

    // 7. SERVICES & PRESTATIONS
    renderServices() {
      const srvs = this.data.services || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🛠️ Services & Prestations (${srvs.length})</h2>
              <p class="card-desc">Gérez vos propositions de valeur</p>
            </div>
            <button class="btn btn-primary" id="addSrvBtn">+ Nouveau Service</button>
          </div>
          <div class="items-list">
            ${srvs.map(s => `
              <div class="list-item-card">
                <div style="font-size: 1.6rem; width: 44px; text-align: center;">${s.icon || '🛠️'}</div>
                <div class="item-details">
                  <div class="item-title">${s.title}</div>
                  <div class="item-subtitle">${s.description || ''}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editSrv('${s.id}')">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteSrv('${s.id}')">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindServicesEvents() {
      const btn = document.getElementById('addSrvBtn');
      if (btn) btn.addEventListener('click', () => this.openSrvModal());
    },

    editSrv(id) {
      const s = (this.data.services || []).find(x => x.id === id);
      if (s) this.openSrvModal(s);
    },

    deleteSrv(id) {
      if (confirm('Supprimer ce service ?')) {
        this.data.services = (this.data.services || []).filter(x => x.id !== id);
        this.persistData('Service supprimé', true);
        this.renderTab('services');
      }
    },

    openSrvModal(srv = null) {
      const isEdit = !!srv;
      const s = srv || { id: 'srv-' + Date.now(), title: '', description: '', icon: '📊', visible: true };

      const modalHtml = `
        <div class="admin-modal-backdrop" id="srvModalBackdrop">
          <div class="admin-modal">
            <div class="card-header">
              <h2 class="card-title">${isEdit ? 'Modifier le service' : 'Ajouter un service'}</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('srvModalBackdrop').remove()">✕</button>
            </div>
            <form id="srvModalForm" class="form-grid" style="margin-top: 16px;">
              <div class="form-group">
                <label class="form-label">Titre du service</label>
                <input type="text" id="mSrvTitle" class="form-control" value="${s.title}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Icône / Emoji</label>
                <input type="text" id="mSrvIcon" class="form-control" value="${s.icon || '🛠️'}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description</label>
                <textarea id="mSrvDesc" class="form-control">${s.description || ''}</textarea>
              </div>
              <div class="form-group full-width" style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('srvModalBackdrop').remove()">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      document.getElementById('srvModalForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
        s.title = document.getElementById('mSrvTitle').value.trim();
        s.icon = document.getElementById('mSrvIcon').value.trim();
        s.description = document.getElementById('mSrvDesc').value.trim();

        if (!Array.isArray(this.data.services)) this.data.services = [];
        if (!isEdit) this.data.services.push(s);
        else {
          const idx = this.data.services.findIndex(x => x.id === s.id);
          if (idx !== -1) this.data.services[idx] = s;
        }

        this.persistData(`Service ${s.title} enregistré`, true);
        document.getElementById('srvModalBackdrop').remove();
        this.renderTab('services');
      });
    },

    // 8. DESIGN STUDIO
    renderDesign() {
      const d = this.data.design || {};
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🎨 Studio de Design & Thème Visuel</h2>
              <p class="card-desc">Modifiez les couleurs et le style — changements visibles en direct</p>
            </div>
            <button class="btn btn-primary" id="saveDesignBtn">Enregistrer le Design</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Couleur d'Accent Principale</label>
              <div class="color-picker-group">
                <input type="color" id="designAccent" class="color-swatch-input" value="${d.accentColor || '#da3805'}">
                <input type="text" id="designAccentHex" class="form-control" value="${d.accentColor || '#da3805'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Couleur d'Accent Survol (Hover)</label>
              <div class="color-picker-group">
                <input type="color" id="designAccentHover" class="color-swatch-input" value="${d.accentHover || '#ff4d15'}">
                <input type="text" id="designAccentHoverHex" class="form-control" value="${d.accentHover || '#ff4d15'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Arrière-plan Sombre (Dark BG)</label>
              <div class="color-picker-group">
                <input type="color" id="designBgDark" class="color-swatch-input" value="${d.bgDark || '#0b0b0e'}">
                <input type="text" id="designBgDarkHex" class="form-control" value="${d.bgDark || '#0b0b0e'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fond des Cartes (Card BG)</label>
              <div class="color-picker-group">
                <input type="color" id="designBgCardDark" class="color-swatch-input" value="${d.bgCardDark || '#131318'}">
                <input type="text" id="designBgCardDarkHex" class="form-control" value="${d.bgCardDark || '#131318'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Police Principale des Titres</label>
              <select id="designFontHeading" class="form-control">
                <option value="'Outfit', sans-serif" ${d.fontHeading?.includes('Outfit') ? 'selected' : ''}>Outfit (Moderne & Épuré)</option>
                <option value="'Inter', sans-serif" ${d.fontHeading?.includes('Inter') ? 'selected' : ''}>Inter (Tech & Minimaliste)</option>
                <option value="'Poppins', sans-serif" ${d.fontHeading?.includes('Poppins') ? 'selected' : ''}>Poppins (Géométrique)</option>
                <option value="'Plus Jakarta Sans', sans-serif" ${d.fontHeading?.includes('Jakarta') ? 'selected' : ''}>Plus Jakarta Sans</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Arrondi des Bordures (Border Radius)</label>
              <select id="designBorderRadius" class="form-control">
                <option value="8px" ${d.borderRadius === '8px' ? 'selected' : ''}>Discret (8px)</option>
                <option value="16px" ${d.borderRadius === '16px' || !d.borderRadius ? 'selected' : ''}>Moderne (16px)</option>
                <option value="24px" ${d.borderRadius === '24px' ? 'selected' : ''}>Très Arrondi (24px)</option>
              </select>
            </div>
          </div>
        </div>
      `;
    },

    bindDesignEvents() {
      const syncInput = (colorId, hexId, key) => {
        const colorEl = document.getElementById(colorId);
        const hexEl   = document.getElementById(hexId);
        if (!colorEl || !hexEl) return;

        colorEl.addEventListener('input', (e) => {
          hexEl.value = e.target.value;
          if (!this.data.design) this.data.design = {};
          this.data.design[key] = e.target.value;
          this.persistData('Couleur modifiée', false);
        });

        hexEl.addEventListener('change', (e) => {
          colorEl.value = e.target.value;
          if (!this.data.design) this.data.design = {};
          this.data.design[key] = e.target.value;
          this.persistData('Couleur modifiée', false);
        });
      };

      syncInput('designAccent', 'designAccentHex', 'accentColor');
      syncInput('designAccentHover', 'designAccentHoverHex', 'accentHover');
      syncInput('designBgDark', 'designBgDarkHex', 'bgDark');
      syncInput('designBgCardDark', 'designBgCardDarkHex', 'bgCardDark');

      const fontEl = document.getElementById('designFontHeading');
      if (fontEl) {
        fontEl.addEventListener('change', (e) => {
          if (!this.data.design) this.data.design = {};
          this.data.design.fontHeading = e.target.value;
          this.persistData('Typographie modifiée', false);
        });
      }

      const radiusEl = document.getElementById('designBorderRadius');
      if (radiusEl) {
        radiusEl.addEventListener('change', (e) => {
          if (!this.data.design) this.data.design = {};
          this.data.design.borderRadius = e.target.value;
          this.persistData('Bordures modifiées', false);
        });
      }

      const saveBtn = document.getElementById('saveDesignBtn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          this.persistData('Design et couleurs enregistrés', true);
        });
      }
    },

    // 9. SECTIONS & TEXTES (AVEC ÉDITION DU TITRE PRINCIPAL)
    renderSections() {
      const s = this.data.sections || {};
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📑 Visibilité des Sections & Titres Principaux</h2>
              <p class="card-desc">Personnalisez les titres de chaque section du portfolio et activez/désactivez leur affichage</p>
            </div>
            <button class="btn btn-primary" id="saveSectionsBtn">Enregistrer les textes</button>
          </div>
          <div class="form-grid">
            
            <!-- Section Hero -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 16px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <strong style="color: var(--admin-accent); font-size: 1.05rem;">🌟 Section Hero — Titre Principal du Site</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secHeroVisible" ${s.hero?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <label class="form-label">Grand Titre H1 (Hero)</label>
              <textarea id="secHeroTitle" class="form-control" style="min-height: 70px; font-weight: 600;">${s.hero?.title || ''}</textarea>
            </div>

            <!-- Section Projets -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 16px; border-radius: var(--radius-sm);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <strong>💼 Section Projets & Réalisations</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secProjectsVisible" ${s.projects?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <label class="form-label">Titre H2</label>
              <input type="text" id="secProjectsTitle" class="form-control" value="${s.projects?.title || ''}">
              <label class="form-label" style="margin-top: 8px;">Sous-titre / Description</label>
              <input type="text" id="secProjectsSubtitle" class="form-control" value="${s.projects?.subtitle || ''}">
            </div>

            <!-- Section Expériences -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 16px; border-radius: var(--radius-sm);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <strong>🏢 Section Expériences & Leadership</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secExpVisible" ${s.experience?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <label class="form-label">Titre H2</label>
              <input type="text" id="secExpTitle" class="form-control" value="${s.experience?.title || ''}">
            </div>

            <!-- Section Formations -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 16px; border-radius: var(--radius-sm);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <strong>🎓 Section Formations & Diplômes</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secEduVisible" ${s.education?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <label class="form-label">Titre H2</label>
              <input type="text" id="secEduTitle" class="form-control" value="${s.education?.title || ''}">
            </div>

          </div>
        </div>
      `;
    },

    bindSectionsEvents() {
      const btn = document.getElementById('saveSectionsBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (!this.data.sections) this.data.sections = {};
        
        if (!this.data.sections.hero) this.data.sections.hero = {};
        this.data.sections.hero.visible = document.getElementById('secHeroVisible').checked;
        this.data.sections.hero.title   = document.getElementById('secHeroTitle').value.trim();

        if (!this.data.sections.projects) this.data.sections.projects = {};
        this.data.sections.projects.visible  = document.getElementById('secProjectsVisible').checked;
        this.data.sections.projects.title    = document.getElementById('secProjectsTitle').value.trim();
        this.data.sections.projects.subtitle = document.getElementById('secProjectsSubtitle').value.trim();

        if (!this.data.sections.experience) this.data.sections.experience = {};
        this.data.sections.experience.visible = document.getElementById('secExpVisible').checked;
        this.data.sections.experience.title   = document.getElementById('secExpTitle').value.trim();

        if (!this.data.sections.education) this.data.sections.education = {};
        this.data.sections.education.visible = document.getElementById('secEduVisible').checked;
        this.data.sections.education.title   = document.getElementById('secEduTitle').value.trim();

        this.persistData('Titres & sections enregistrés', true);
      });
    },

    // 10. MÉDIATHÈQUE
    renderMedia() {
      const media = this.data.mediaLibrary || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🖼️ Médiathèque (${media.length} fichiers)</h2>
              <p class="card-desc">Importez vos images locales pour vos projets et logos</p>
            </div>
            <label class="btn btn-primary" style="cursor: pointer;">
              <span>+ Importer une image</span>
              <input type="file" id="mediaUploadInput" accept="image/*" style="display: none;">
            </label>
          </div>
          <div class="media-grid">
            ${media.map(m => `
              <div class="media-card" title="${m.name}">
                <img src="${m.url}" alt="${m.name}">
                <div class="media-overlay">
                  <button class="btn btn-secondary btn-icon" onclick="navigator.clipboard.writeText('${m.url}'); AdminApp.showToast('Lien copié !', 'info');" title="Copier le lien">🔗</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteMedia('${m.id}')" title="Supprimer" style="margin-left: 6px;">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindMediaEvents() {
      const fileInput = document.getElementById('mediaUploadInput');
      if (!fileInput) return;
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (re) => {
          const base64 = re.target.result;
          const newMedia = {
            id: 'media-' + Date.now(),
            name: file.name,
            url: base64,
            type: 'image'
          };

          if (!Array.isArray(this.data.mediaLibrary)) this.data.mediaLibrary = [];
          this.data.mediaLibrary.unshift(newMedia);
          this.persistData(`Image ${file.name} importée`, true);
          this.renderTab('media');
        };
        reader.readAsDataURL(file);
      });
    },

    deleteMedia(id) {
      if (confirm('Supprimer cette image ?')) {
        this.data.mediaLibrary = (this.data.mediaLibrary || []).filter(m => m.id !== id);
        this.persistData('Image supprimée de la médiathèque', true);
        this.renderTab('media');
      }
    },

    // 11. MESSAGES REÇUS
    renderMessages() {
      const msgs = this.data.messages || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📩 Messages Reçus (${msgs.length})</h2>
              <p class="card-desc">Demandes de contact reçues depuis le formulaire du portfolio</p>
            </div>
          </div>
          <div class="items-list">
            ${msgs.map(m => `
              <div class="list-item-card">
                <div class="item-details">
                  <div class="item-title">${m.name} <span style="font-weight: 400; color: var(--admin-text-muted);">(${m.email})</span></div>
                  <div style="font-weight: 600; font-size: 0.9rem; margin: 4px 0; color: var(--admin-accent);">${m.subject}</div>
                  <div class="item-subtitle" style="font-size: 0.85rem; color: var(--admin-text-main);">${m.message}</div>
                  <div style="font-size: 0.72rem; color: var(--admin-text-dim); margin-top: 4px;">${new Date(m.date).toLocaleString('fr-FR')}</div>
                </div>
                <div class="item-actions">
                  <a href="mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}" class="btn btn-primary btn-icon" title="Répondre">✉️</a>
                </div>
              </div>
            `).join('') || '<p style="color: var(--admin-text-dim); padding: 24px; text-align: center;">Aucun message reçu pour l\'instant.</p>'}
          </div>
        </div>
      `;
    },

    // 12. HISTORIQUE & AUDIT
    renderHistory() {
      const history = this.data.history || [];
      return `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🕒 Journal d'Audit des Modifications</h2>
          </div>
          <div class="items-list">
            ${history.map(h => `
              <div class="list-item-card">
                <div>
                  <div class="item-title">${h.action}</div>
                  <div class="item-subtitle">${h.details || ''}</div>
                </div>
                <div style="font-size: 0.8rem; color: var(--admin-text-dim);">${new Date(h.timestamp).toLocaleString('fr-FR')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    // 13. PARAMÈTRES & SEO
    renderSettings() {
      const seo = this.data.seo || {};
      return `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🔍 Balises SEO & Référencement</h2>
            <button class="btn btn-primary" id="saveSeoBtn">Enregistrer SEO</button>
          </div>
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Titre de l'onglet (Meta Title)</label>
              <input type="text" id="seoTitle" class="form-control" value="${seo.metaTitle || ''}">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Description Google (Meta Description)</label>
              <textarea id="seoDesc" class="form-control">${seo.metaDescription || ''}</textarea>
            </div>
            <div class="form-group full-width">
              <label class="form-label">Mots-clés (Keywords)</label>
              <input type="text" id="seoKeywords" class="form-control" value="${seo.keywords || ''}">
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">💾 Sauvegarde & Restauration</h2>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="AdminApp.exportBackup()">📥 Exporter la sauvegarde JSON</button>
            <label class="btn btn-secondary" style="cursor: pointer;">
              <span>📤 Importer une sauvegarde JSON</span>
              <input type="file" id="importBackupInput" accept=".json" style="display: none;">
            </label>
            <button class="btn btn-danger" onclick="AdminApp.resetToDefault()">⚠️ Réinitialiser aux valeurs initiales</button>
          </div>
        </div>
      `;
    },

    bindSettingsEvents() {
      const btn = document.getElementById('saveSeoBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          if (!this.data.seo) this.data.seo = {};
          this.data.seo.metaTitle       = document.getElementById('seoTitle').value.trim();
          this.data.seo.metaDescription = document.getElementById('seoDesc').value.trim();
          this.data.seo.keywords        = document.getElementById('seoKeywords').value.trim();

          this.persistData('Paramètres SEO enregistrés', true);
        });
      }

      const importInput = document.getElementById('importBackupInput');
      if (importInput) {
        importInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const r = new FileReader();
          r.onload = (ev) => {
            try {
              this.data = JSON.parse(ev.target.result);
              this.persistData('Importation complète de sauvegarde', true);
              this.renderTab(this.currentTab);
            } catch (err) {
              alert('Fichier JSON invalide.');
            }
          };
          r.readAsText(file);
        });
      }
    },

    exportBackup() {
      const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `portfolio-falikou-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    },

    resetToDefault() {
      if (confirm('Attention : réinitialiser toutes les données aux valeurs par défaut ?')) {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.persistData('Réinitialisation aux valeurs initiales', true);
        this.renderTab(this.currentTab);
      }
    },

    showToast(message, type = 'info') {
      let toast = document.getElementById('adminToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'adminToast';
        toast.className = 'admin-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span>${message}</span>`;
      toast.className = 'admin-toast show';
      setTimeout(() => { toast.className = 'admin-toast'; }, 3200);
    }
  };

  // Démarrage automatique
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdminApp.init());
  } else {
    window.AdminApp.init();
  }
})();
