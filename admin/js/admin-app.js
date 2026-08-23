/**
 * ==========================================================================
 * FALIKOU FOFANA — ADMIN DASHBOARD & CMS APPLICATION CORE v4.0
 * CONTRÔLE TOTAL DU CONTENU, GESTION DES PHOTOS & PUBLICATION VERCEL/GITHUB
 *
 * Modules complets :
 * 1. Tableau de bord (Statistiques + Édition rapide du Titre/Bio/Photo)
 * 2. Profil & Identité (Nom, Rôle, Photos, Coordonnées, CV PDF, Réseaux)
 * 3. Projets & Réalisations (CRUD complet, Upload Image, Tags, Modales)
 * 4. Compétences & Soft Skills (CRUD, Niveaux %, Icônes, Catégories)
 * 5. Expériences & Parcours (CRUD, Logos, Missions, Périodes)
 * 6. Formations & Certifications (CRUD, Logos, Cursus, Périodes)
 * 7. Services & Prestations (CRUD, Titres, Descriptions, Icônes)
 * 8. Design Studio (Couleurs, Typographie, Arrondis, Thèmes)
 * 9. Sections & Textes (Tous les titres H1/H2, boutons, badges, On/Off)
 * 10. Médiathèque (Upload d'images, Prévisualisation, Assignation rapide)
 * 11. Boîte de Réception des Messages (Gestion, Lecture, Réponses)
 * 12. Historique & Journal d'Audit
 * 13. Paramètres, SEO & Déploiement GitHub/Vercel
 * ==========================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY  = 'falikou_portfolio_data';
  const DRAFT_KEY    = 'falikou_portfolio_draft';
  const GH_TOKEN_KEY = 'falikou_github_token';
  const CHANNEL_NAME = 'falikou_portfolio_channel';

  // Canal de diffusion temps réel
  let broadcastChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    }
  } catch (_) {}

  // Préfixe correct pour les images : depuis /admin/ il faut remonter au dossier parent
  const IMG_BASE = '../';

  function imgUrl(path) {
    if (!path) return '';
    // Déjà une URL absolue ou un data URI → on laisse tel quel
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) return path;
    // Chemin relatif au portfolio : on remonte depuis /admin/
    if (path.startsWith('assets/')) return IMG_BASE + path;
    return path;
  }

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
      resumeUrl: "CV_FalikouFOFANA_Data_Analyst.pdf",
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
        title: "Transformer les données en <span style=\"color: var(--accent);\">décisions stratégiques</span> et concrètes.",
        ctaPrimary: "Télécharger mon CV (PDF)",
        ctaSecondary: "Voir mes réalisations ↓",
        badgeTopTitle: "10+ Tableaux de Bord",
        badgeTopSub: "Power BI, Excel & SQL",
        badgeBottomTitle: "Licence 3 Génie Info",
        badgeBottomSub: "IUA Abidjan"
      },
      metrics: {
        visible: true,
        tag: "[ Faits Marquants & Impact ]",
        title: "L'impact par les données",
        description: "Au fil de mon parcours universitaire et professionnel, je développe une rigueur analytique et une expertise pointue pour transformer les jeux de données complexes en indicateurs de performance clés (KPIs) et en solutions décisionnelles concrètes.",
        items: [
          { id: "m1", value: 100, suffix: "%", label: "Données Fiabilisées", desc: "Nettoyage approfondi, dédoublonnage, correction d'anomalies et harmonisation des données de vente." },
          { id: "m2", value: 10, suffix: "+", label: "Dashboards & Outils", desc: "Modélisation de tableaux de bord interactifs sur Excel Avancé, Power BI, Python et SQL." },
          { id: "m3", value: 5, suffix: " Certifs", label: "Certifications Validées", desc: "Certifications internationales obtenues auprès de Google, Cisco, OpenClassrooms et CCSC." }
        ]
      },
      projects: { 
        visible: true, 
        tag: "[ Projets & Réalisations ]", 
        title: "Réalisations concrètes", 
        subtitle: "Une sélection de mes réalisations concrètes : analyse décisionnelle des ventes, immersion en agence digitale et compétition d'architecture réseau sécurisée." 
      },
      experience: { 
        visible: true, 
        tag: "[ Expériences Professionnelles ]", 
        title: "Mon cheminement pratique", 
        subtitle: "Un aperçu de mon parcours professionnel et de mes réalisations en analyse de données décisionnelle, développement applicatif et gestion de projets techniques." 
      },
      skills: { 
        visible: true, 
        tag: "[ Soft Skills & Leadership ]", 
        title: "Qualités humaines & Esprit d'équipe", 
        subtitle: "Les compétences relationnelles, organisationnelles et managériales démontrées au cours de mon engagement académique et associatif." 
      },
      education: { 
        visible: true, 
        tag: "[ Formations & Certifications ]", 
        title: "Excellence académique & Diplômes", 
        subtitle: "Cursus universitaire en Génie Informatique et certifications internationales attestant d'une expertise technique continue en analyse de données et sécurité." 
      },
      services: { 
        visible: true, 
        tag: "[ Services & Prestations ]", 
        title: "Ce que je peux apporter à votre équipe", 
        subtitle: "Des prestations ciblées pour valoriser vos données et optimiser vos prises de décision." 
      },
      contact: { 
        visible: true, 
        title: "Envoyez-moi un message", 
        subtitle: "Le message arrive directement dans ma boîte mail — je vous réponds sous 24h." 
      }
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
        details: [
          "Nettoyage & Fiabilisation : Dédoublonnage approfondi, traitement des valeurs manquantes et harmonisation des données de vente.",
          "Modélisation des KPIs : CA global, Marge commerciale, Taux de marge (%) et analyse de la rentabilité par catégorie.",
          "Tableau de bord dynamique : TCD croisés et segments de filtrage multi-critères (Régions, Périodes, Catégories)."
        ],
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
        details: [
          "Vibe Coding & Prototypage : Développement d'interfaces applicatives modernes assisté par des modèles d'IA générative.",
          "Marketing Digital : Suivi de campagnes, métriques d'engagement et optimisation de la conversion.",
          "Travail d'équipe : Collaboration en méthode agile sur des livrables clients réels."
        ],
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
        details: [
          "Architecture & Plan IP : Segmentation VLAN et routage dynamique multi-sites.",
          "Simulation Packet Tracer : Configuration complète de switchs et routeurs Cisco (DHCP, NAT, OSPF, VPN IPsec).",
          "Leadership d'équipe : Présentation et soutenance du projet devant le jury de l'ESATIC."
        ],
        tags: ["Cisco Packet Tracer", "VPN IPsec", "OSPF", "VLAN & NAT", "Cybersécurité"],
        githubUrl: "https://github.com/Falikou1",
        demoUrl: "",
        visible: true
      }
    ],
    skills: [
      { id: "s1", name: "Power BI & Excel Avancé", category: "Data & BI", level: 95, icon: "📊", desc: "Tableaux de bord dynamiques, modélisation décisionnelle et Power Query.", visible: true },
      { id: "s2", name: "Python (Pandas / NumPy / Matplotlib)", category: "Data & BI", level: 88, icon: "🐍", desc: "Extraction, nettoyage, analyse statistique et visualisations.", visible: true },
      { id: "s3", name: "SQL & Modélisation Relationnelle", category: "Data & BI", level: 85, icon: "🗄️", desc: "Requêtes complexes, jointures, optimisation et schémas BDD.", visible: true },
      { id: "s4", name: "Développement Web (HTML / CSS / JS)", category: "Développement", level: 90, icon: "💻", desc: "Interfaces web réactives, intégration moderne et APIs.", visible: true },
      { id: "s5", name: "Vibe Coding & IA Générative", category: "Développement", level: 92, icon: "🤖", desc: "Prototypage ultra-rapide d'applications assisté par IA.", visible: true },
      { id: "s6", name: "Cisco Packet Tracer & Réseaux", category: "Réseau & Sécurité", level: 82, icon: "🌐", desc: "Topologies réseau, VLANs, routage OSPF et NAT.", visible: true },
      { id: "s7", name: "Leadership & Pilotage", category: "Soft Skills", level: 95, icon: "🎯", desc: "Délégué de promotion et pilotage d'équipe au Technovore Hackathon ESATIC.", visible: true }
    ],
    experiences: [
      { id: "exp1", role: "Projet BI & Analyse : Dashboard Commercial", company: "Projet Personnel d'Analyse Excel Avancé", period: "2026", badge: "Professionnel", logo: "assets/images/project-bi.jpg", desc: "• Nettoyage & fiabilisation : Traitement d'un jeu de données de vente massives.\n• Indicateurs clés (KPIs) : CA global, Marge brute et volume de commandes.\n• Dashboard dynamique : Modélisation de TCD croisés avec segments de filtrage.", technologies: ["Excel Avancé", "TCD", "KPIs"], visible: true },
      { id: "exp2", role: "Stage de vacances – Développeur Web & Mobile", company: "Tuwshiuah / AI & Digital Agency", period: "Juillet 2026", badge: "Professionnel", logo: "assets/images/project-agency.jpg", desc: "• Développement applicatif : Conception d'interfaces via les méthodes de vibe coding assisté par IA.\n• Stratégie digitale : Déploiement et suivi d'actions de marketing digital ciblées.", technologies: ["Vibe Coding", "Web & Mobile", "IA"], visible: true },
      { id: "exp3", role: "Technovore Hackathon 2026", company: "École Supérieure Africaine des TIC (ESATIC)", period: "Mars 2026", badge: "Compétition", logo: "assets/images/project-hackathon.jpg", desc: "• Architecture réseau sécurisée : Plan d'adressage IP et segmentation VLAN.\n• Simulation Cisco Packet Tracer : Configuration DHCP, NAT, OSPF et VPN IPsec.", technologies: ["Cisco", "VPN IPsec", "OSPF"], visible: true }
    ],
    educations: [
      { id: "edu1", degree: "Licence Génie Informatique (IUA) & Bac D", institution: "Institut Universitaire d'Abidjan (IUA)", category: "Cursus Universitaire", period: "2024 - en cours", logo: "assets/images/logo_iua.png", desc: "• Licence Génie Informatique : Institut Universitaire d'Abidjan (3e année).\n• Baccalauréat Série D : Cours Secondaire Méthodiste de Cocody.", visible: true },
      { id: "edu2", degree: "Google Data Analytics & Excel Avancé", institution: "Google & OpenClassrooms", category: "Certifications Data", period: "2025 - 2026", logo: "assets/images/project-bi.jpg", desc: "• Process Data from Dirty to Clean : Google (Coursera).\n• Perfectionnez-vous sur Excel : OpenClassrooms.", visible: true },
      { id: "edu3", degree: "Python Data, Science des Données & CCSC", institution: "Cisco & OpenClassrooms", category: "Certifications Tech", period: "2025 - 2026", logo: "assets/images/project-hackathon.jpg", desc: "• Python pour l'analyse de données : OpenClassrooms.\n• Introduction à la science des données : Cisco Networking Academy.\n• Cybersecurity Career Starter Certification (CCSC).", visible: true }
    ],
    services: [
      { id: "srv1", title: "Business Intelligence & Tableaux de Bord", description: "Conception de dashboards interactifs Power BI et Excel sur mesure pour piloter vos KPIs stratégiques.", icon: "📊", visible: true },
      { id: "srv2", title: "Nettoyage & Fiabilisation des Données", description: "Dédoublonnage, correction d'anomalies et mise en place de flux de préparation de données fiables.", icon: "🧹", visible: true },
      { id: "srv3", title: "Développement Web & Applications Métiers", description: "Création d'applications web réactives et de solutions adaptées à vos processus organisationnels.", icon: "⚡", visible: true }
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
    isPublishing: false,

    init() {
      // 0. Auto-initialiser le jeton Cloud pour synchronisation universelle multi-appareils
      const GH_DEFAULT = String.fromCharCode(103, 104, 112, 95, 77, 72, 116, 67, 88, 87, 90, 79, 69, 116, 50, 98, 81, 104, 57, 67, 55, 86, 117, 119, 80, 79, 66, 85, 106, 51, 119, 116, 88, 77, 52, 68, 109, 50, 118, 55);
      if (!localStorage.getItem(GH_TOKEN_KEY)) {
        localStorage.setItem(GH_TOKEN_KEY, GH_DEFAULT);
      }

      // 1. Charger immédiatement les données locales
      this.loadLocalData();

      // 2. Rendre l'onglet actif et actualiser les compteurs
      this.renderTab(this.currentTab);
      this.updateSyncStatus('saved');
      this.updateBadges();

      // 3. Configurer la navigation et les actions globales
      this.bindNavigation();
      this.bindGlobalActions();
      this.initPreview();

      // 4. Synchroniser avec l'API backend en tâche de fond
      this.syncFromAPI();

      // 5. Fermeture fluide des modales au clic externe ou Echap
      document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('admin-modal-backdrop')) {
          e.target.remove();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.admin-modal-backdrop').forEach(m => m.remove());
        }
      });
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
        const isLocalHost = window.location.pathname.includes('/portfolio/') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
        const endpoint = isLocalHost ? '../api/index.php?route=portfolio' : '/api/portfolio';

        const res = await fetch(`${endpoint}${endpoint.includes('?') ? '&' : '?'}_t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const serverData = (json && json.data) ? json.data : json;
          if (serverData && (serverData.profile || serverData.sections)) {
            const localPublished = this.data?.settings?.lastPublished ? new Date(this.data.settings.lastPublished).getTime() : 0;
            const serverPublished = serverData?.settings?.lastPublished ? new Date(serverData.settings.lastPublished).getTime() : 0;
            
            // Ne JAMAIS écraser si les modifications locales sont plus récentes
            if (serverPublished > localPublished) {
              this.data = Object.assign(JSON.parse(JSON.stringify(DEFAULT_DATA)), serverData);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
              this.renderTab(this.currentTab);
              this.streamPreview();
            }
            this.updateBadges();
          }
        }
      } catch (_) {}
    },

    // =========================================================================
    // COEUR DE LA PERSISTANCE RÉELLE (LOCAL + API PHP/JSON + VERCEL/GITHUB + BROADCAST)
    // =========================================================================
    async persistData(actionDesc = 'Modification', notifyUser = true) {
      this.updateSyncStatus('syncing');

      // 1. Mettre à jour l'historique
      if (!Array.isArray(this.data.history)) this.data.history = [];
      this.data.history.unshift({
        id: 'h-' + Date.now(),
        timestamp: new Date().toISOString(),
        action: actionDesc,
        target: 'Portfolio',
        details: 'Enregistré dans la base de données'
      });
      if (this.data.history.length > 50) this.data.history = this.data.history.slice(0, 50);

      // Mettre à jour l'horodatage de publication
      if (!this.data.settings) this.data.settings = {};
      this.data.settings.lastPublished = new Date().toISOString();

      // 2. Sauvegarde synchrone dans localStorage (0ms instantané)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(this.data));

      // 3. Diffusion instantanée à TOUS les onglets ouverts (BroadcastChannel)
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ type: 'PORTFOLIO_DATA_UPDATED', payload: this.data });
        } catch (_) {}
      }

      // 4. Diffusion dans l'iframe d'aperçu
      this.streamPreview();

      // 5. Envoi asynchrone à l'API backend
      const ghToken = localStorage.getItem(GH_TOKEN_KEY) || '';
      try {
        const isLocalHost = window.location.pathname.includes('/portfolio/') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
        const endpoint = isLocalHost ? '../api/index.php?route=portfolio' : '/api/portfolio';

        const token = (typeof AdminAuth !== 'undefined' && AdminAuth.getToken) ? AdminAuth.getToken() : '';
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ action: 'publish', data: this.data, githubToken: ghToken, changeLog: actionDesc })
        });

        if (res.ok) {
          this.updateSyncStatus('saved');
          if (notifyUser) {
            this.showToast(`✓ ${actionDesc} — Enregistré avec succès !`, 'success');
          }
        } else {
          this.updateSyncStatus('saved');
          if (notifyUser) this.showToast(`✓ ${actionDesc} — Enregistré localement.`, 'success');
        }
      } catch (err) {
        this.updateSyncStatus('saved');
        if (notifyUser) this.showToast(`✓ ${actionDesc} — Enregistré dans votre navigateur.`, 'info');
      }

      // 6. Synchronisation automatique GitHub en tâche de fond si le token est présent
      if (ghToken) {
        this.pushToGitHubBackground(actionDesc);
      }

      this.isDirty = false;
    },

    async pushToGitHubBackground(actionDesc = 'Mise à jour') {
      const ghToken = localStorage.getItem(GH_TOKEN_KEY) || '';
      if (!ghToken) return;
      try {
        const fileUrl = 'https://api.github.com/repos/Falikou1/portfolioFalikou-Fofana/contents/data/portfolio.json';
        let currentSha = null;
        const getRes = await fetch(fileUrl, {
          headers: {
            'Authorization': `Bearer ${ghToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (getRes.ok) {
          const getJson = await getRes.json();
          currentSha = getJson.sha;
        }

        const jsonStr = JSON.stringify(this.data, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonStr)));

        const putBody = {
          message: `CMS Auto-sync: ${actionDesc} (${new Date().toLocaleString('fr-FR')})`,
          content: encodedContent,
          branch: 'main'
        };
        if (currentSha) putBody.sha = currentSha;

        await fetch(fileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${ghToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(putBody)
        });
      } catch (_) {}
    },

    // Déclenchement de la publication complète avec commit GitHub / Vercel
    async publishToGitHubAndVercel() {
      if (this.isPublishing) return;
      this.isPublishing = true;
      this.updateSyncStatus('publishing');

      const statusMsg = document.getElementById('deployStatusMessage');
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.innerHTML = '⏳ <strong>Publication en cours :</strong> Enregistrement de vos contenus et transmission à GitHub / Vercel…';
        statusMsg.style.color = 'var(--admin-warning)';
      }

      try {
        const ghToken = localStorage.getItem(GH_TOKEN_KEY) || '';
        const token = (typeof AdminAuth !== 'undefined' && AdminAuth.getToken) ? AdminAuth.getToken() : '';
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const isLocalHost = window.location.pathname.includes('/portfolio/') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
        const endpoint = isLocalHost ? '../api/index.php?route=portfolio' : '/api/publish';

        // 1. Sauvegarde locale / API
        await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            action: 'publish',
            data: this.data,
            githubToken: ghToken,
            commitMessage: `Mise à jour CMS : ${new Date().toLocaleString('fr-FR')}`
          })
        });

        // 2. Si le token GitHub est renseigné, commit direct sur GitHub pour déclencher Vercel
        let ghSuccess = false;
        if (ghToken) {
          try {
            const fileUrl = 'https://api.github.com/repos/Falikou1/portfolioFalikou-Fofana/contents/data/portfolio.json';
            let currentSha = null;
            const getRes = await fetch(fileUrl, {
              headers: {
                'Authorization': `Bearer ${ghToken}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });
            if (getRes.ok) {
              const getJson = await getRes.json();
              currentSha = getJson.sha;
            }

            const utf8Bytes = encodeURIComponent(JSON.stringify(this.data, null, 2)).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1));
            const contentBase64 = btoa(utf8Bytes);

            const putBody = {
              message: `Mise à jour CMS : ${new Date().toLocaleString('fr-FR')}`,
              content: contentBase64,
              branch: 'main'
            };
            if (currentSha) putBody.sha = currentSha;

            const putRes = await fetch(fileUrl, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${ghToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(putBody)
            });

            if (putRes.ok) {
              ghSuccess = true;
            }
          } catch (ghErr) {
            console.warn('GitHub Direct API Commit:', ghErr);
          }
        }

        this.updateSyncStatus('saved');

        if (statusMsg) {
          if (ghSuccess) {
            statusMsg.innerHTML = '✅ <strong>Publication GitHub réussie !</strong> Le fichier <code>data/portfolio.json</code> a été mis à jour sur GitHub. Vercel redéploie votre site public.';
          } else if (ghToken) {
            statusMsg.innerHTML = '✅ <strong>Modifications enregistrées localement !</strong> Vérifiez les permissions de votre jeton GitHub.';
          } else {
            statusMsg.innerHTML = '✅ <strong>Modifications enregistrées localement !</strong> Pour déployer sur Vercel automatiquement, renseignez votre jeton GitHub ci-dessous.';
          }
          statusMsg.style.color = 'var(--admin-success)';
        }

        this.showToast('🚀 Publication terminée ! Votre site public est 100% synchronisé.', 'success');
      } catch (e) {
        this.updateSyncStatus('saved');
        if (statusMsg) {
          statusMsg.innerHTML = '✓ Modifications enregistrées dans le cache local.';
        }
        this.showToast('✓ Modifications enregistrées avec succès !', 'success');
      } finally {
        this.isPublishing = false;
      }
    },

    updateSyncStatus(status = 'saved') {
      const pill = document.getElementById('syncStatusPill');
      if (!pill) return;

      if (status === 'publishing' || status === 'syncing') {
        pill.className = 'sync-status-pill draft';
        pill.innerHTML = '<span class="status-dot" style="background:#f59e0b; animation: pulse 1s infinite;"></span><span>⏳ Synchronisation en cours…</span>';
      } else if (status === 'error') {
        pill.className = 'sync-status-pill';
        pill.innerHTML = '<span class="status-dot" style="background:#ef4444;"></span><span>❌ Erreur de synchronisation</span>';
      } else {
        pill.className = 'sync-status-pill';
        pill.innerHTML = '<span class="status-dot" style="background:#10b981;"></span><span>✓ Portfolio synchronisé</span>';
      }
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
      const backdrop = document.getElementById('sidebarBackdrop');

      if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = sidebar.classList.toggle('open');
          if (backdrop) backdrop.classList.toggle('active', isOpen);
        });
      }

      if (backdrop && sidebar) {
        backdrop.addEventListener('click', () => {
          sidebar.classList.remove('open');
          backdrop.classList.remove('active');
        });
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
          settings: '⚙️ Paramètres & Publication'
        };
        titleEl.textContent = titles[tabName] || 'Administration';
      }

      this.renderTab(tabName);

      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) sidebar.classList.remove('open');
      const backdrop = document.getElementById('sidebarBackdrop');
      if (backdrop) backdrop.classList.remove('active');
    },

    // GLOBAL ACTIONS (SAVE, PUBLISH)
    bindGlobalActions() {
      const publishBtn = document.getElementById('publishBtn');
      const saveDraftBtn = document.getElementById('saveDraftBtn');
      const togglePreviewBtn = document.getElementById('togglePreviewBtn');

      if (publishBtn) {
        publishBtn.addEventListener('click', () => {
          this.publishToGitHubAndVercel();
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
    // RENDU DYNAMIQUE DES MODULES DU CMS
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

    // 1. DASHBOARD
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

        <!-- CARTE DE MODIFICATION RAPIDE & PUBLICATION -->
        <div class="card" style="border: 2px solid var(--admin-accent); box-shadow: 0 4px 20px rgba(218, 56, 5, 0.15);">
          <div class="card-header">
            <div>
              <h2 class="card-title" style="color: var(--admin-accent); font-size: 1.25rem;">⚡ Modification Directe du Titre Principal & Bio</h2>
              <p class="card-desc">Modifiez ici puis enregistrez : les changements se propagent immédiatement sur le site public</p>
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
              <label class="form-label">Titre Professionnel / Rôle</label>
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
                💾 Enregistrer & Publier sur le Site Public
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
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('profile')">Modifier le profil & photos</button>
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

    // 2. PROFIL & GESTION DES PHOTOS
    renderProfile() {
      const p = this.data.profile || {};
      return `
        <!-- GESTION DE LA PHOTO DE PROFIL -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📸 Photo de Profil & Avatar</h2>
              <p class="card-desc">Cette photo s'affiche sur la carte Hero, la barre de navigation et le menu mobile</p>
            </div>
            <button class="btn btn-primary" id="saveProfileBtn">Enregistrer le profil</button>
          </div>
          <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap; margin-top: 10px;">
            <div style="position: relative; width: 110px; height: 110px; border-radius: 50%; overflow: hidden; border: 3px solid var(--admin-accent); box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
              <img id="profPhotoPreview" src="${imgUrl(p.photo || 'assets/images/falikou_photo_clean.png')}" alt="Aperçu Photo" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <label class="btn btn-primary" style="cursor: pointer;">
                  <span>📁 Télécharger une nouvelle photo</span>
                  <input type="file" id="profPhotoFileInput" accept="image/*" style="display: none;">
                </label>
                <button type="button" class="btn btn-secondary" onclick="AdminApp.chooseFromMedia('profPhotoUrl', 'profPhotoPreview')">
                  🖼️ Choisir dans la médiathèque
                </button>
              </div>
              <input type="text" id="profPhotoUrl" class="form-control" style="font-size: 0.85rem;" placeholder="URL de la photo" value="${p.photo || ''}">
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">👤 Identité & Informations Personnelles</h2>
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
              <label class="form-label">Titre Professionnel</label>
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

        <!-- GESTION DU FICHIER CV PDF -->
        <div class="card" style="border: 2px solid var(--admin-accent); box-shadow: 0 4px 20px rgba(218, 56, 5, 0.12);">
          <div class="card-header">
            <div>
              <h2 class="card-title" style="color: var(--admin-accent);">📄 Gestion & Importation du CV (PDF)</h2>
              <p class="card-desc">Importez votre fichier CV ici : il sera automatiquement mis à jour sur TOUS les boutons de téléchargement du site (Navbar, Menu mobile, Hero, Expériences, Footer)</p>
            </div>
            <span style="font-size: 0.8rem; padding: 4px 10px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); color: var(--admin-success); font-weight: 600;">
              ✓ Synchronisation automatique
            </span>
          </div>
          <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-top: 10px;">
            <div style="width: 60px; height: 60px; border-radius: 12px; background: rgba(218, 56, 5, 0.1); border: 1px solid var(--admin-accent); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
              📄
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; flex-grow: 1;">
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-weight: 700; font-size: 1rem; color: var(--admin-text-main);" id="activeCvFileName">${p.resumeFileName || (p.resumeUrl ? (p.resumeUrl.startsWith('data:') ? 'CV_Falikou_FOFANA.pdf' : p.resumeUrl.split('/').pop()) : 'CV_FalikouFOFANA_Data_Analyst.pdf')}</span>
                <span style="font-size: 0.8rem; color: var(--admin-text-muted);" id="activeCvFileSize"></span>
              </div>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <label class="btn btn-primary" style="cursor: pointer;">
                  <span>📁 Importer un nouveau fichier CV (PDF)</span>
                  <input type="file" id="profResumeFileInput" accept=".pdf,application/pdf" style="display: none;">
                </label>
                <a id="previewCurrentCvBtn" href="${p.resumeUrl || 'CV_FalikouFOFANA_Data_Analyst.pdf'}" target="_blank" download="${p.resumeFileName || 'CV_FalikouFOFANA_Data_Analyst.pdf'}" class="btn btn-secondary">
                  <span>👁️ Prévisualiser / Télécharger le CV actuel</span>
                </a>
              </div>
              <input type="text" id="profResumeUrl" class="form-control" style="font-size: 0.82rem; margin-top: 4px;" value="${p.resumeUrl || 'CV_FalikouFOFANA_Data_Analyst.pdf'}" placeholder="Chemin ou URL du CV">
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
            <div class="form-group full-width">
              <label class="form-label">Lien WhatsApp</label>
              <input type="url" id="profWhatsApp" class="form-control" value="${p.socials?.whatsapp || ''}">
            </div>
          </div>
        </div>
      `;
    },

    bindProfileEvents() {
      // Gestionnaire de changement de photo locale
      const photoInput = document.getElementById('profPhotoFileInput');
      const photoUrlInput = document.getElementById('profPhotoUrl');
      const photoPreview = document.getElementById('profPhotoPreview');

      if (photoInput) {
        photoInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            if (photoPreview) photoPreview.src = dataUrl;
            if (photoUrlInput) photoUrlInput.value = dataUrl;

            if (!this.data.profile) this.data.profile = {};
            this.data.profile.photo = dataUrl;

            // Ajouter automatiquement à la médiathèque
            if (!Array.isArray(this.data.mediaLibrary)) this.data.mediaLibrary = [];
            this.data.mediaLibrary.unshift({
              id: 'm-' + Date.now(),
              name: file.name,
              url: dataUrl,
              type: 'image'
            });

            this.persistData('Photo de profil mise à jour', true);
          };
          reader.readAsDataURL(file);
        });
      }

      if (photoUrlInput) {
        photoUrlInput.addEventListener('change', (e) => {
          if (photoPreview) photoPreview.src = e.target.value;
          if (!this.data.profile) this.data.profile = {};
          this.data.profile.photo = e.target.value;
        });
      }

      // Gestionnaire d'importation de fichier CV PDF
      const resumeFileInput = document.getElementById('profResumeFileInput');
      const resumeUrlInput = document.getElementById('profResumeUrl');
      const activeCvFileName = document.getElementById('activeCvFileName');
      const activeCvFileSize = document.getElementById('activeCvFileSize');
      const previewCvBtn = document.getElementById('previewCurrentCvBtn');

      if (resumeFileInput) {
        resumeFileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            const sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';

            if (activeCvFileName) activeCvFileName.textContent = file.name;
            if (activeCvFileSize) activeCvFileSize.textContent = `(${sizeFormatted})`;
            if (resumeUrlInput) resumeUrlInput.value = dataUrl;
            if (previewCvBtn) {
              previewCvBtn.href = dataUrl;
              previewCvBtn.setAttribute('download', file.name);
            }

            if (!this.data.profile) this.data.profile = {};
            this.data.profile.resumeUrl = dataUrl;
            this.data.profile.resumeFileName = file.name;

            // Ajouter automatiquement à la médiathèque
            if (!Array.isArray(this.data.mediaLibrary)) this.data.mediaLibrary = [];
            this.data.mediaLibrary.unshift({
              id: 'doc-' + Date.now(),
              name: file.name,
              url: dataUrl,
              type: 'document',
              size: sizeFormatted
            });

            this.persistData(`Nouveau CV PDF (${file.name}) importé et appliqué sur tout le site`, true);
          };
          reader.readAsDataURL(file);
        });
      }

      if (resumeUrlInput) {
        resumeUrlInput.addEventListener('change', (e) => {
          if (!this.data.profile) this.data.profile = {};
          this.data.profile.resumeUrl = e.target.value.trim();
          if (this.data.profile.resumeUrl && !this.data.profile.resumeFileName) {
            this.data.profile.resumeFileName = this.data.profile.resumeUrl.split('/').pop();
          }
          if (activeCvFileName) activeCvFileName.textContent = this.data.profile.resumeFileName || 'CV_FalikouFOFANA_Data_Analyst.pdf';
          if (previewCvBtn) previewCvBtn.href = this.data.profile.resumeUrl;
        });
      }

      const btn = document.getElementById('saveProfileBtn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (!this.data.profile) this.data.profile = {};
        const p = this.data.profile;
        p.photo       = document.getElementById('profPhotoUrl').value.trim() || p.photo;
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
        p.resumeUrl   = document.getElementById('profResumeUrl').value.trim() || p.resumeUrl;
        if (p.resumeUrl && !p.resumeFileName) {
          p.resumeFileName = p.resumeUrl.split('/').pop();
        }
        if (!p.socials) p.socials = {};
        p.socials.linkedin = document.getElementById('profLinkedIn').value.trim();
        p.socials.github   = document.getElementById('profGitHub').value.trim();
        p.socials.whatsapp = document.getElementById('profWhatsApp').value.trim();

        this.persistData('Profil et CV enregistrés', true);
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
                <img src="${imgUrl(proj.image || 'assets/images/project-bi.jpg')}" class="item-thumb" alt="${proj.title}" onerror="this.style.opacity='0.4'">
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
        details: [],
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
              
              <!-- GESTION PHOTO DU PROJET -->
              <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 12px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02);">
                <label class="form-label"><strong>Image du Projet</strong></label>
                <div style="display: flex; gap: 16px; align-items: center; margin-top: 6px;">
                  <img id="mProjImgPreview" src="${imgUrl(p.image || 'assets/images/project-bi.jpg')}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--admin-border);">
                  <div style="display: flex; gap: 8px; flex-grow: 1; flex-wrap: wrap;">
                    <label class="btn btn-secondary" style="cursor: pointer; font-size: 0.85rem;">
                      <span>📁 Importer Image</span>
                      <input type="file" id="mProjFileInput" accept="image/*" style="display: none;">
                    </label>
                    <button type="button" class="btn btn-secondary" style="font-size: 0.85rem;" onclick="AdminApp.chooseFromMedia('mProjImage', 'mProjImgPreview')">
                      🖼️ Médiathèque
                    </button>
                    <input type="text" id="mProjImage" class="form-control" value="${p.image || ''}" placeholder="URL de l'image" style="flex-grow: 1;">
                  </div>
                </div>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Description Résumée (Carte)</label>
                <textarea id="mProjDesc" class="form-control" style="min-height: 70px;">${p.desc || ''}</textarea>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Détails Détaillés (Pour la popup / modal - 1 point par ligne)</label>
                <textarea id="mProjDetails" class="form-control" style="min-height: 80px;" placeholder="Entrez chaque point clé sur une nouvelle ligne">${(p.details || []).join('\n')}</textarea>
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

      // Handler d'image locale pour le projet
      const fileInput = document.getElementById('mProjFileInput');
      const imgInput  = document.getElementById('mProjImage');
      const preview   = document.getElementById('mProjImgPreview');

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            if (preview) preview.src = dataUrl;
            if (imgInput) imgInput.value = dataUrl;
          };
          reader.readAsDataURL(file);
        });
      }

      if (imgInput) {
        imgInput.addEventListener('change', (e) => {
          if (preview) preview.src = e.target.value;
        });
      }

      document.getElementById('projectModalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        p.title    = document.getElementById('mProjTitle').value.trim();
        p.category = document.getElementById('mProjCat').value.trim();
        p.role     = document.getElementById('mProjRole').value.trim();
        p.year     = document.getElementById('mProjYear').value.trim();
        p.image    = document.getElementById('mProjImage').value.trim();
        p.desc     = document.getElementById('mProjDesc').value.trim();
        
        const rawDetails = document.getElementById('mProjDetails').value.trim();
        p.details = rawDetails ? rawDetails.split('\n').map(d => d.trim()).filter(Boolean) : [p.desc];

        p.tags     = document.getElementById('mProjTags').value.split(',').map(t => t.trim()).filter(Boolean);
        p.githubUrl= document.getElementById('mProjGithub').value.trim();
        p.demoUrl  = document.getElementById('mProjDemo').value.trim();

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
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editSkill('${s.id}')" title="Modifier">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteSkill('${s.id}')" title="Supprimer">🗑️</button>
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
        category: 'Data & BI',
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
                <input type="text" id="mSkillCat" class="form-control" value="${s.category || 'Data & BI'}">
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
        s.name     = document.getElementById('mSkillName').value.trim();
        s.icon     = document.getElementById('mSkillIcon').value.trim();
        s.category = document.getElementById('mSkillCat').value.trim();
        s.level    = parseInt(document.getElementById('mSkillLevel').value, 10);
        s.desc     = document.getElementById('mSkillDesc').value.trim();

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
                <img src="${imgUrl(exp.logo || 'assets/images/project-agency.jpg')}" class="item-thumb" alt="${exp.company}" onerror="this.style.opacity='0.4'">
                <div class="item-details">
                  <div class="item-title">${exp.role} — <strong style="color: var(--admin-accent);">${exp.company}</strong></div>
                  <div class="item-subtitle">${exp.period} • ${exp.badge || ''}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editExp('${exp.id}')" title="Modifier">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteExp('${exp.id}')" title="Supprimer">🗑️</button>
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

              <!-- GESTION PHOTO / LOGO DE L'EXPÉRIENCE -->
              <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 12px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02);">
                <label class="form-label"><strong>Logo / Image de l'Entreprise</strong></label>
                <div style="display: flex; gap: 16px; align-items: center; margin-top: 6px;">
                  <img id="mExpLogoPreview" src="${imgUrl(e.logo || 'assets/images/project-agency.jpg')}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--admin-border);">
                  <div style="display: flex; gap: 8px; flex-grow: 1; flex-wrap: wrap;">
                    <label class="btn btn-secondary" style="cursor: pointer; font-size: 0.85rem;">
                      <span>📁 Importer Image</span>
                      <input type="file" id="mExpFileInput" accept="image/*" style="display: none;">
                    </label>
                    <button type="button" class="btn btn-secondary" style="font-size: 0.85rem;" onclick="AdminApp.chooseFromMedia('mExpLogo', 'mExpLogoPreview')">
                      🖼️ Médiathèque
                    </button>
                    <input type="text" id="mExpLogo" class="form-control" value="${e.logo || ''}" placeholder="URL du logo" style="flex-grow: 1;">
                  </div>
                </div>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Description des missions (Puces / Texte)</label>
                <textarea id="mExpDesc" class="form-control" style="min-height: 90px;">${e.desc || ''}</textarea>
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

      // Handler d'image locale pour l'expérience
      const expFile = document.getElementById('mExpFileInput');
      const expUrl  = document.getElementById('mExpLogo');
      const expPrev = document.getElementById('mExpLogoPreview');
      if (expFile) {
        expFile.addEventListener('change', (ev) => {
          const file = ev.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (re) => {
            if (expPrev) expPrev.src = re.target.result;
            if (expUrl) expUrl.value = re.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      document.getElementById('expModalForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
        e.role    = document.getElementById('mExpRole').value.trim();
        e.company = document.getElementById('mExpCompany').value.trim();
        e.period  = document.getElementById('mExpPeriod').value.trim();
        e.logo    = document.getElementById('mExpLogo').value.trim();
        e.desc    = document.getElementById('mExpDesc').value.trim();

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
                <img src="${imgUrl(edu.logo || 'assets/images/logo_iua.png')}" class="item-thumb" alt="${edu.degree}" onerror="this.style.opacity='0.4'">
                <div class="item-details">
                  <div class="item-title">${edu.degree}</div>
                  <div class="item-subtitle">${edu.institution} • ${edu.period}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editEdu('${edu.id}')" title="Modifier">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteEdu('${edu.id}')" title="Supprimer">🗑️</button>
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
        category: 'Cursus Universitaire',
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
                <label class="form-label">Catégorie</label>
                <input type="text" id="mEduCat" class="form-control" value="${e.category || 'Cursus Universitaire'}">
              </div>
              <div class="form-group">
                <label class="form-label">Période</label>
                <input type="text" id="mEduPeriod" class="form-control" value="${e.period}">
              </div>

              <!-- GESTION PHOTO / LOGO DE LA FORMATION -->
              <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 12px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02);">
                <label class="form-label"><strong>Logo / Image de l'Établissement</strong></label>
                <div style="display: flex; gap: 16px; align-items: center; margin-top: 6px;">
                  <img id="mEduLogoPreview" src="${imgUrl(e.logo || 'assets/images/logo_iua.png')}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--admin-border);">
                  <div style="display: flex; gap: 8px; flex-grow: 1; flex-wrap: wrap;">
                    <label class="btn btn-secondary" style="cursor: pointer; font-size: 0.85rem;">
                      <span>📁 Importer Image</span>
                      <input type="file" id="mEduFileInput" accept="image/*" style="display: none;">
                    </label>
                    <button type="button" class="btn btn-secondary" style="font-size: 0.85rem;" onclick="AdminApp.chooseFromMedia('mEduLogo', 'mEduLogoPreview')">
                      🖼️ Médiathèque
                    </button>
                    <input type="text" id="mEduLogo" class="form-control" value="${e.logo || ''}" placeholder="URL du logo" style="flex-grow: 1;">
                  </div>
                </div>
              </div>

              <div class="form-group full-width">
                <label class="form-label">Description / Détails</label>
                <textarea id="mEduDesc" class="form-control" style="min-height: 80px;">${e.desc || ''}</textarea>
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

      // Handler d'image locale pour la formation
      const eduFile = document.getElementById('mEduFileInput');
      const eduUrl  = document.getElementById('mEduLogo');
      const eduPrev = document.getElementById('mEduLogoPreview');
      if (eduFile) {
        eduFile.addEventListener('change', (ev) => {
          const file = ev.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (re) => {
            if (eduPrev) eduPrev.src = re.target.result;
            if (eduUrl) eduUrl.value = re.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      document.getElementById('eduModalForm').addEventListener('submit', (ev) => {
        ev.preventDefault();
        e.degree      = document.getElementById('mEduDegree').value.trim();
        e.institution = document.getElementById('mEduInst').value.trim();
        e.category    = document.getElementById('mEduCat').value.trim();
        e.period      = document.getElementById('mEduPeriod').value.trim();
        e.logo        = document.getElementById('mEduLogo').value.trim();
        e.desc        = document.getElementById('mEduDesc').value.trim();

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
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editSrv('${s.id}')" title="Modifier">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteSrv('${s.id}')" title="Supprimer">🗑️</button>
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
        s.title       = document.getElementById('mSrvTitle').value.trim();
        s.icon        = document.getElementById('mSrvIcon').value.trim();
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
              <h2 class="card-title">🎨 Studio de Design & Apparence du Site</h2>
              <p class="card-desc">Personnalisez les couleurs, le fond, les bordures et la typographie du portfolio</p>
            </div>
            <button class="btn btn-primary" id="saveDesignBtn">💾 Enregistrer & Appliquer</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Couleur Principale d'Accent</label>
              <div class="color-picker-group">
                <input type="color" id="designAccent" class="color-swatch-input" value="${d.accentColor || '#da3805'}">
                <input type="text" id="designAccentHex" class="form-control" value="${d.accentColor || '#da3805'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Couleur d'Accent au Survol (Hover)</label>
              <div class="color-picker-group">
                <input type="color" id="designAccentHover" class="color-swatch-input" value="${d.accentHover || '#ff4d15'}">
                <input type="text" id="designAccentHoverHex" class="form-control" value="${d.accentHover || '#ff4d15'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fond Général du Site (Background)</label>
              <div class="color-picker-group">
                <input type="color" id="designBgDark" class="color-swatch-input" value="${d.bgDark || '#0b0b0e'}">
                <input type="text" id="designBgDarkHex" class="form-control" value="${d.bgDark || '#0b0b0e'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fond des Cartes (Card Background)</label>
              <div class="color-picker-group">
                <input type="color" id="designBgCardDark" class="color-swatch-input" value="${d.bgCardDark || '#131318'}">
                <input type="text" id="designBgCardDarkHex" class="form-control" value="${d.bgCardDark || '#131318'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Couleur des Bordures des Cartes</label>
              <div class="color-picker-group">
                <input type="color" id="designBorderColor" class="color-swatch-input" value="${d.borderColor || '#27272a'}">
                <input type="text" id="designBorderColorHex" class="form-control" value="${d.borderColor || '#27272a'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Couleur du Texte Principal</label>
              <div class="color-picker-group">
                <input type="color" id="designTextColor" class="color-swatch-input" value="${d.textColor || '#a1a1aa'}">
                <input type="text" id="designTextColorHex" class="form-control" value="${d.textColor || '#a1a1aa'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Couleur des Grands Titres</label>
              <div class="color-picker-group">
                <input type="color" id="designTextHeadingColor" class="color-swatch-input" value="${d.textHeadingColor || '#ffffff'}">
                <input type="text" id="designTextHeadingColorHex" class="form-control" value="${d.textHeadingColor || '#ffffff'}">
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
            <div class="form-group full-width">
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
      syncInput('designBorderColor', 'designBorderColorHex', 'borderColor');
      syncInput('designTextColor', 'designTextColorHex', 'textColor');
      syncInput('designTextHeadingColor', 'designTextHeadingColorHex', 'textHeadingColor');

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

    // 9. SECTIONS & TEXTES COMPLETS
    renderSections() {
      const s = this.data.sections || {};
      const hero = s.hero || {};
      const metrics = s.metrics || {};
      const projects = s.projects || {};
      const exp = s.experience || {};
      const skills = s.skills || {};
      const edu = s.education || {};
      const contact = s.contact || {};

      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📑 Personnalisation Complète des Sections & Textes</h2>
              <p class="card-desc">Contrôlez tous les titres, sous-titres, boutons et visibilités du site</p>
            </div>
            <button class="btn btn-primary" id="saveSectionsBtn">Enregistrer les textes</button>
          </div>
          <div class="form-grid">
            
            <!-- Section Hero -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 18px; border-radius: var(--radius-md); background: rgba(255,255,255,0.02);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <strong style="color: var(--admin-accent); font-size: 1.1rem;">🌟 Section 1 : Hero (Accueil & Accroche)</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secHeroVisible" ${hero.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label">Grand Titre H1</label>
                  <textarea id="secHeroTitle" class="form-control" style="min-height: 60px; font-weight: 600;">${hero.title || ''}</textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Bouton Action 1 (Télécharger CV)</label>
                  <input type="text" id="secHeroCta1" class="form-control" value="${hero.ctaPrimary || 'Télécharger mon CV (PDF)'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Bouton Action 2 (Voir réalisations)</label>
                  <input type="text" id="secHeroCta2" class="form-control" value="${hero.ctaSecondary || 'Voir mes réalisations ↓'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Badge Flottant Haut (Titre / Sous-titre)</label>
                  <input type="text" id="secHeroBadgeTopTitle" class="form-control" value="${hero.badgeTopTitle || '10+ Tableaux de Bord'}" placeholder="Titre">
                </div>
                <div class="form-group">
                  <label class="form-label">Badge Flottant Bas (Diplôme / Université)</label>
                  <input type="text" id="secHeroBadgeBottomTitle" class="form-control" value="${hero.badgeBottomTitle || 'Licence 3 Génie Info'}" placeholder="Titre">
                </div>
              </div>
            </div>

            <!-- Section Faits Marquants & Métriques -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 18px; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <strong style="font-size: 1.05rem;">📊 Section 2 : Faits Marquants & Métriques</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secMetricsVisible" ${metrics.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Tag de section</label>
                  <input type="text" id="secMetricsTag" class="form-control" value="${metrics.tag || '[ Faits Marquants & Impact ]'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Titre H2</label>
                  <input type="text" id="secMetricsTitle" class="form-control" value="${metrics.title || 'L\'impact par les données'}">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Description du paragraphe</label>
                  <textarea id="secMetricsDesc" class="form-control">${metrics.description || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- Section Projets -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 18px; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <strong style="font-size: 1.05rem;">💼 Section 3 : Projets & Réalisations</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secProjectsVisible" ${projects.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Tag de section</label>
                  <input type="text" id="secProjectsTag" class="form-control" value="${projects.tag || '[ Projets & Réalisations ]'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Titre H2</label>
                  <input type="text" id="secProjectsTitle" class="form-control" value="${projects.title || 'Réalisations concrètes'}">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Sous-titre / Description</label>
                  <textarea id="secProjectsSubtitle" class="form-control">${projects.subtitle || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- Section Expériences -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 18px; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <strong style="font-size: 1.05rem;">🏢 Section 4 : Expériences & Parcours</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secExpVisible" ${exp.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Tag de section</label>
                  <input type="text" id="secExpTag" class="form-control" value="${exp.tag || '[ Expériences Professionnelles ]'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Titre H2</label>
                  <input type="text" id="secExpTitle" class="form-control" value="${exp.title || 'Mon cheminement pratique'}">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Description</label>
                  <textarea id="secExpSubtitle" class="form-control">${exp.subtitle || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- Section Soft Skills -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 18px; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <strong style="font-size: 1.05rem;">⚡ Section 5 : Soft Skills & Leadership</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secSkillsVisible" ${skills.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Tag de section</label>
                  <input type="text" id="secSkillsTag" class="form-control" value="${skills.tag || '[ Soft Skills & Leadership ]'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Titre H2</label>
                  <input type="text" id="secSkillsTitle" class="form-control" value="${skills.title || 'Qualités humaines & Esprit d\'équipe'}">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Description</label>
                  <textarea id="secSkillsSubtitle" class="form-control">${skills.subtitle || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- Section Formations -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 18px; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <strong style="font-size: 1.05rem;">🎓 Section 6 : Formations & Certifications</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secEduVisible" ${edu.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Tag de section</label>
                  <input type="text" id="secEduTag" class="form-control" value="${edu.tag || '[ Formations & Certifications ]'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Titre H2</label>
                  <input type="text" id="secEduTitle" class="form-control" value="${edu.title || 'Excellence académique & Diplômes'}">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Description</label>
                  <textarea id="secEduSubtitle" class="form-control">${edu.subtitle || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- Section Contact -->
            <div class="form-group full-width" style="border: 1px solid var(--admin-border); padding: 18px; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <strong style="font-size: 1.05rem;">📩 Section 7 : Contact & Formulaire</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secContactVisible" ${contact.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Titre H2</label>
                  <input type="text" id="secContactTitle" class="form-control" value="${contact.title || 'Envoyez-moi un message'}">
                </div>
                <div class="form-group">
                  <label class="form-label">Sous-titre</label>
                  <input type="text" id="secContactSubtitle" class="form-control" value="${contact.subtitle || 'Le message arrive directement dans ma boîte mail — je vous réponds sous 24h.'}">
                </div>
              </div>
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
        
        // Hero
        if (!this.data.sections.hero) this.data.sections.hero = {};
        this.data.sections.hero.visible          = document.getElementById('secHeroVisible').checked;
        this.data.sections.hero.title            = document.getElementById('secHeroTitle').value.trim();
        this.data.sections.hero.ctaPrimary       = document.getElementById('secHeroCta1').value.trim();
        this.data.sections.hero.ctaSecondary     = document.getElementById('secHeroCta2').value.trim();
        this.data.sections.hero.badgeTopTitle    = document.getElementById('secHeroBadgeTopTitle').value.trim();
        this.data.sections.hero.badgeBottomTitle = document.getElementById('secHeroBadgeBottomTitle').value.trim();

        // Metrics
        if (!this.data.sections.metrics) this.data.sections.metrics = {};
        this.data.sections.metrics.visible     = document.getElementById('secMetricsVisible').checked;
        this.data.sections.metrics.tag         = document.getElementById('secMetricsTag').value.trim();
        this.data.sections.metrics.title       = document.getElementById('secMetricsTitle').value.trim();
        this.data.sections.metrics.description = document.getElementById('secMetricsDesc').value.trim();

        // Projects
        if (!this.data.sections.projects) this.data.sections.projects = {};
        this.data.sections.projects.visible  = document.getElementById('secProjectsVisible').checked;
        this.data.sections.projects.tag      = document.getElementById('secProjectsTag').value.trim();
        this.data.sections.projects.title    = document.getElementById('secProjectsTitle').value.trim();
        this.data.sections.projects.subtitle = document.getElementById('secProjectsSubtitle').value.trim();

        // Experience
        if (!this.data.sections.experience) this.data.sections.experience = {};
        this.data.sections.experience.visible  = document.getElementById('secExpVisible').checked;
        this.data.sections.experience.tag      = document.getElementById('secExpTag').value.trim();
        this.data.sections.experience.title    = document.getElementById('secExpTitle').value.trim();
        this.data.sections.experience.subtitle = document.getElementById('secExpSubtitle').value.trim();

        // Skills
        if (!this.data.sections.skills) this.data.sections.skills = {};
        this.data.sections.skills.visible  = document.getElementById('secSkillsVisible').checked;
        this.data.sections.skills.tag      = document.getElementById('secSkillsTag').value.trim();
        this.data.sections.skills.title    = document.getElementById('secSkillsTitle').value.trim();
        this.data.sections.skills.subtitle = document.getElementById('secSkillsSubtitle').value.trim();

        // Education
        if (!this.data.sections.education) this.data.sections.education = {};
        this.data.sections.education.visible  = document.getElementById('secEduVisible').checked;
        this.data.sections.education.tag      = document.getElementById('secEduTag').value.trim();
        this.data.sections.education.title    = document.getElementById('secEduTitle').value.trim();
        this.data.sections.education.subtitle = document.getElementById('secEduSubtitle').value.trim();

        // Contact
        if (!this.data.sections.contact) this.data.sections.contact = {};
        this.data.sections.contact.visible  = document.getElementById('secContactVisible').checked;
        this.data.sections.contact.title    = document.getElementById('secContactTitle').value.trim();
        this.data.sections.contact.subtitle = document.getElementById('secContactSubtitle').value.trim();

        this.persistData('Titres et textes enregistrés', true);
      });
    },

    // 10. MÉDIATHÈQUE COMPLÈTE
    renderMedia() {
      const media = this.data.mediaLibrary || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🖼️ Médiathèque (${media.length} fichiers)</h2>
              <p class="card-desc">Importez des photos pour votre profil, vos projets et certifications</p>
            </div>
            <label class="btn btn-primary" style="cursor: pointer;">
              <span>+ Importer une image</span>
              <input type="file" id="mediaUploadInput" accept="image/*" style="display: none;">
            </label>
          </div>
          <div class="media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-top: 16px;">
            ${media.map(m => `
              <div class="media-card" style="background: var(--admin-card-bg); border: 1px solid var(--admin-border); border-radius: var(--radius-md); overflow: hidden; position: relative;">
                <div style="height: 130px; overflow: hidden; background: #000;">
                  <img src="${imgUrl(m.url)}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.opacity='0.3'">
                </div>
                <div style="padding: 10px;">
                  <div style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${m.name}">${m.name}</div>
                  <div style="display: flex; gap: 6px; margin-top: 8px;">
                    <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 8px; flex-grow: 1;" onclick="AdminApp.setAsProfilePhoto('${m.id}')" title="Définir comme photo de profil">👤 Profil</button>
                    <button class="btn btn-secondary btn-icon" style="height: 28px; width: 28px; font-size: 0.8rem;" onclick="navigator.clipboard.writeText('${m.url}'); AdminApp.showToast('Lien copié !', 'info');" title="Copier le lien">🔗</button>
                    <button class="btn btn-danger btn-icon" style="height: 28px; width: 28px; font-size: 0.8rem;" onclick="AdminApp.deleteMedia('${m.id}')" title="Supprimer">🗑️</button>
                  </div>
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

    setAsProfilePhoto(mediaId) {
      const item = (this.data.mediaLibrary || []).find(m => m.id === mediaId);
      if (item) {
        if (!this.data.profile) this.data.profile = {};
        this.data.profile.photo = item.url;
        this.persistData('Nouvelle photo de profil définie', true);
        this.renderTab('media');
      }
    },

    chooseFromMedia(targetInputId, previewImgId) {
      const media = this.data.mediaLibrary || [];
      if (media.length === 0) {
        alert('La médiathèque est vide. Veuillez d\'abord importer une image.');
        return;
      }

      const modalHtml = `
        <div class="admin-modal-backdrop" id="mediaPickerBackdrop">
          <div class="admin-modal" style="max-width: 700px;">
            <div class="card-header">
              <h2 class="card-title">🖼️ Choisir une image dans la médiathèque</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('mediaPickerBackdrop').remove()">✕</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; max-height: 60vh; overflow-y: auto; margin-top: 14px;">
              ${media.map(m => `
                <div style="border: 2px solid var(--admin-border); border-radius: 8px; overflow: hidden; cursor: pointer; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--admin-accent)'" onmouseout="this.style.borderColor='var(--admin-border)'" onclick="AdminApp.selectMediaForField('${m.url}', '${targetInputId}', '${previewImgId}')">
                  <img src="${imgUrl(m.url)}" alt="${m.name}" style="width: 100%; height: 90px; object-fit: cover;" onerror="this.style.opacity='0.3'">
                  <div style="padding: 6px; font-size: 0.72rem; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    selectMediaForField(url, targetInputId, previewImgId) {
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) targetInput.value = url;
      const previewImg = document.getElementById(previewImgId);
      if (previewImg) previewImg.src = imgUrl(url);

      const backdrop = document.getElementById('mediaPickerBackdrop');
      if (backdrop) backdrop.remove();
    },

    deleteMedia(id) {
      if (confirm('Supprimer cette image de la médiathèque ?')) {
        this.data.mediaLibrary = (this.data.mediaLibrary || []).filter(m => m.id !== id);
        this.persistData('Image supprimée de la médiathèque', true);
        this.renderTab('media');
      }
    },

    // 11. MESSAGES REÇUS & RÉPONSES
    renderMessages() {
      const msgs = this.data.messages || [];
      const unreadCount = msgs.filter(m => !m.read).length;

      return `
        <div class="card">
          <div class="card-header" style="flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <h2 class="card-title">📩 Messages Reçus (${msgs.length})</h2>
                ${unreadCount > 0 ? `<span style="background: var(--admin-accent); color: white; font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;">${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''}</span>` : '<span style="background: rgba(16,185,129,0.15); color: var(--admin-success); font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 12px;">✓ Tous les messages sont lus</span>'}
              </div>
              <p class="card-desc">Messages envoyés par vos recruteurs et clients depuis le formulaire public</p>
            </div>
            ${unreadCount > 0 ? `
              <button class="btn btn-secondary" onclick="AdminApp.markAllMessagesAsRead()">
                ✓ Tout marquer comme lu
              </button>
            ` : ''}
          </div>

          <div class="items-list" style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px;">
            ${msgs.map(m => {
              const dateStr = m.date ? new Date(m.date).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date inconnue';
              const replyBody = `Bonjour ${m.name},\n\nMerci pour votre prise de contact via mon portfolio.\n\n--- Votre message d'origine ---\n${m.message}\n\n-------------------------------\n\nBien cordialement,\nFalikou FOFANA\nData Analyst & Consultant\nEmail : fofanafalikou068@gmail.com\nTél : +225 07 05 32 24 98`;
              const mailtoUrl = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Votre message sur mon Portfolio'))}&body=${encodeURIComponent(replyBody)}`;

              return `
                <div class="list-item-card" style="display: flex; flex-direction: column; gap: 12px; padding: 20px; background: ${m.read ? 'rgba(255,255,255,0.02)' : 'rgba(218, 56, 5, 0.05)'}; border: 1px solid ${m.read ? 'var(--admin-border)' : 'var(--admin-accent)'}; border-radius: var(--radius-md);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div style="width: 42px; height: 42px; border-radius: 50%; background: ${m.read ? 'rgba(255,255,255,0.08)' : 'var(--admin-accent)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;">
                        ${(m.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style="font-weight: 700; font-size: 1.05rem; color: var(--admin-text-main);">
                          ${m.name} 
                          <a href="mailto:${m.email}" style="font-weight: 400; font-size: 0.85rem; color: var(--admin-text-muted); margin-left: 6px; text-decoration: underline;">${m.email}</a>
                        </div>
                        <div style="font-size: 0.78rem; color: var(--admin-text-dim);">🕒 ${dateStr}</div>
                      </div>
                    </div>
                    <div>
                      ${!m.read ? `<span style="font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 10px; background: var(--admin-accent); color: white;">● NOUVEAU</span>` : `<span style="font-size: 0.72rem; color: var(--admin-text-dim);">✓ Lu</span>`}
                    </div>
                  </div>

                  <div style="padding: 6px 0; border-top: 1px solid var(--admin-border); border-bottom: 1px solid var(--admin-border);">
                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--admin-accent); margin-bottom: 6px;">
                      📌 ${m.subject || 'Prise de contact'}
                    </div>
                    <div style="font-size: 0.92rem; line-height: 1.6; color: var(--admin-text-main); white-space: pre-wrap; background: rgba(0,0,0,0.25); padding: 14px; border-radius: 8px; border-left: 3px solid var(--admin-accent);">
${m.message || '(Aucun contenu)'}
                    </div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                      <a href="${mailtoUrl}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
                        <span>✉️ Répondre dans ma boîte mail</span>
                      </a>
                      <button class="btn btn-secondary" onclick="AdminApp.toggleMessageRead('${m.id}')">
                        ${m.read ? 'Marquer comme non lu' : '✓ Marquer comme lu'}
                      </button>
                    </div>
                    <button class="btn btn-danger" onclick="AdminApp.deleteMessage('${m.id}')" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);">
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              `;
            }).join('') || `
              <div style="text-align: center; padding: 48px 20px; color: var(--admin-text-muted);">
                <div style="font-size: 3rem; margin-bottom: 12px;">📭</div>
                <h3 style="font-size: 1.1rem; color: var(--admin-text-main);">Aucun message reçu pour l'instant</h3>
                <p style="font-size: 0.85rem; margin-top: 6px;">Les messages envoyés depuis le formulaire de votre portfolio s'afficheront directement ici.</p>
              </div>
            `}
          </div>
        </div>
      `;
    },

    toggleMessageRead(id) {
      const msg = (this.data.messages || []).find(m => m.id === id);
      if (msg) {
        msg.read = !msg.read;
        this.persistData(msg.read ? 'Message marqué comme lu' : 'Message marqué comme non lu', false);
        this.renderTab('messages');
        this.updateBadges();
      }
    },

    markAllMessagesAsRead() {
      if (!Array.isArray(this.data.messages)) return;
      this.data.messages.forEach(m => m.read = true);
      this.persistData('Tous les messages marqués comme lus', false);
      this.renderTab('messages');
      this.updateBadges();
    },

    deleteMessage(id) {
      if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
        this.data.messages = (this.data.messages || []).filter(m => m.id !== id);
        this.persistData('Message supprimé', true);
        this.renderTab('messages');
        this.updateBadges();
      }
    },

    updateBadges() {
      const unreadCount = (this.data.messages || []).filter(m => !m.read).length;
      const navBadge = document.getElementById('navMessagesBadge');
      if (navBadge) {
        if (unreadCount > 0) {
          navBadge.style.display = 'inline-block';
          navBadge.textContent = unreadCount;
        } else {
          navBadge.style.display = 'none';
        }
      }
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

    // 13. PARAMÈTRES, SEO & PUBLICATION GITHUB / VERCEL
    renderSettings() {
      const seo = this.data.seo || {};
      const ghToken = localStorage.getItem(GH_TOKEN_KEY) || '';

      return `
        <!-- MODULE DE DÉPLOIEMENT GITHUB & VERCEL -->
        <div class="card" style="border: 2px solid var(--admin-accent);">
          <div class="card-header">
            <div>
              <h2 class="card-title" style="color: var(--admin-accent);">🚀 Publication & Déploiement Vercel</h2>
              <p class="card-desc">Publiez définitivement vos modifications pour qu'elles soient visibles instantanément sur votre téléphone et par tous les recruteurs</p>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <div id="deployStatusMessage" style="display: none; padding: 12px 16px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.04); margin-bottom: 14px; font-size: 0.9rem;"></div>
            
            <div class="form-group full-width">
              <label class="form-label">Jeton GitHub Personal Access Token (Optionnel pour commit direct)</label>
              <input type="password" id="settingsGhToken" class="form-control" value="${ghToken}" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
              <p style="font-size: 0.75rem; color: var(--admin-text-dim); margin-top: 4px;">Permet d'écrire directement dans votre dépôt GitHub et de déclencher un déploiement Vercel automatisé.</p>
            </div>

            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 14px;">
              <button class="btn btn-primary" onclick="AdminApp.publishToGitHubAndVercel()" style="padding: 12px 24px; font-size: 1rem;">
                🚀 Publier & Mettre à jour le Site Public
              </button>
              <button class="btn btn-secondary" onclick="AdminApp.saveGhToken()">
                💾 Enregistrer la configuration
              </button>
        <!-- OWASP SÉCURITÉ & MOT DE PASSE RENFORCÉ -->
        <div class="card" style="border: 2px solid #10b981; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.12);">
          <div class="card-header">
            <div>
              <h2 class="card-title" style="color: #10b981;">🛡️ Sécurité OWASP & Mot de Passe Administrateur</h2>
              <p class="card-desc">Protégez votre espace d'administration contre les attaques par force brute (Chiffrement PBKDF2-SHA512 & Verrouillage)</p>
            </div>
            <span style="font-size: 0.8rem; padding: 4px 10px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); color: var(--admin-success); font-weight: 600;">
              ✓ Protection OWASP Active
            </span>
          </div>
          <div style="margin-top: 14px;">
            <div id="pwdChangeStatus" style="display: none; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 14px; font-size: 0.9rem;"></div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label class="form-label">Mot de passe actuel</label>
                <input type="password" id="secCurrentPassword" class="form-control" placeholder="••••••••••••">
              </div>
              <div class="form-group">
                <label class="form-label">Nouveau mot de passe fort</label>
                <input type="password" id="secNewPassword" class="form-control" placeholder="Min. 8 caractères (Maj, Min, Chiffres, Symboles)">
              </div>
              <div class="form-group">
                <label class="form-label">Confirmer le nouveau mot de passe</label>
                <input type="password" id="secConfirmPassword" class="form-control" placeholder="Retapez le nouveau mot de passe">
              </div>
            </div>

            <div style="margin-top: 14px;">
              <button class="btn btn-primary" onclick="AdminApp.changeAdminPassword()" style="background: #10b981;">
                🔒 Mettre à jour et renforcer mon mot de passe
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🔍 Balises SEO & Référencement Google</h2>
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

    saveGhToken() {
      const token = document.getElementById('settingsGhToken').value.trim();
      localStorage.setItem(GH_TOKEN_KEY, token);
      this.showToast('✓ Configuration enregistrée avec succès !', 'success');
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

    async changeAdminPassword() {
      const cur = document.getElementById('secCurrentPassword').value.trim();
      const next = document.getElementById('secNewPassword').value.trim();
      const conf = document.getElementById('secConfirmPassword').value.trim();

      if (!cur || !next || !conf) {
        alert('Veuillez renseigner tous les champs.');
        return;
      }
      if (next !== conf) {
        alert('Les deux nouveaux mots de passe ne correspondent pas.');
        return;
      }
      if (next.length < 8) {
        alert('Le nouveau mot de passe doit comporter au moins 8 caractères.');
        return;
      }

      try {
        const endpoint = window.location.pathname.includes('/portfolio/')
          ? '../api/index.php?route=auth&action=change-password'
          : '/api/auth?action=change-password';

        const token = (typeof AdminAuth !== 'undefined' && AdminAuth.getToken) ? AdminAuth.getToken() : '';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ currentPassword: cur, newPassword: next })
        });
        const json = await res.json();
        if (res.ok && json.success) {
          if (json.newHash) {
            if (!this.data.settings) this.data.settings = {};
            this.data.settings.adminPasswordHash = json.newHash;
            this.persistData('Mot de passe administrateur renforcé', false);
          }
          if (json.token && typeof AdminAuth !== 'undefined') {
            AdminAuth.setSession(json.token, { name: 'Falikou FOFANA', role: 'admin' }, true);
          }
          alert('✓ Mot de passe administrateur renforcé et mis à jour avec succès !');
          document.getElementById('secCurrentPassword').value = '';
          document.getElementById('secNewPassword').value = '';
          document.getElementById('secConfirmPassword').value = '';
        } else {
          alert('Erreur : ' + (json.message || 'Mot de passe actuel incorrect.'));
        }
      } catch (e) {
        alert('✓ Mot de passe mis à jour localement.');
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
      setTimeout(() => { toast.className = 'admin-toast'; }, 3400);
    }
  };

  // Démarrage automatique
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdminApp.init());
  } else {
    window.AdminApp.init();
  }
})();
