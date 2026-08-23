/**
 * FALIKOU FOFANA — ADMIN DASHBOARD & CMS CORE CONTROLLER
 * Full Management: Profile, Projects, Skills, Experiences, Education, Services,
 * Design Studio (Colors/Typography), Sections & Text Overrides, Media Library,
 * Messages Inbox, Audit History, Live Split-View Preview & Cloud Sync.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'falikou_portfolio_data';
  const DRAFT_KEY = 'falikou_portfolio_draft';

  window.AdminApp = {
    data: null,
    isDirty: false,
    currentTab: 'dashboard',
    previewIframe: null,

    async init() {
      // 1. Verify authentication
      const isAuth = await AdminAuth.checkAuth(true);
      if (!isAuth) return;

      // 2. Load Portfolio Data
      await this.loadData();

      // 3. Bind UI Components & Navigation
      this.bindNavigation();
      this.bindGlobalActions();
      this.initLivePreview();

      // 4. Render initial tab
      this.renderTab(this.currentTab);
      this.updateSyncStatus();
    },

    async loadData() {
      // Check draft first, then local storage, then fetch from API
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          this.data = JSON.parse(draft);
          this.isDirty = true;
          return;
        } catch (e) {}
      }

      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          this.data = JSON.parse(cached);
        } catch (e) {}
      }

      try {
        const endpoint = window.location.pathname.includes('/portfolio/')
          ? '../api/index.php?route=portfolio'
          : '/api/portfolio';

        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${AdminAuth.getToken()}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            this.data = json.data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            return;
          }
        }
      } catch (err) {
        console.log('Using local fallback data');
      }

      if (!this.data) {
        const def = await fetch('../data/default-portfolio.json');
        this.data = await def.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      }
    },

    // =========================================================================
    // NAVIGATION & TAB SWITCHING
    // =========================================================================
    bindNavigation() {
      document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          this.switchTab(tab);
        });
      });

      // Mobile sidebar toggle
      const mobileToggle = document.getElementById('mobileSidebarToggle');
      const sidebar = document.querySelector('.admin-sidebar');
      if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
          sidebar.classList.toggle('open');
        });
      }

      // Logout button
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('Voulez-vous vraiment vous déconnecter de l\'administration ?')) {
            AdminAuth.logout();
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
          history: '🕒 Historique & Restauration',
          settings: '⚙️ Paramètres & Sécurité'
        };
        titleEl.textContent = titles[tabName] || 'Administration';
      }

      this.renderTab(tabName);

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) sidebar.classList.remove('open');
    },

    // =========================================================================
    // GLOBAL ACTIONS (SAVE, PUBLISH, DISCARD)
    // =========================================================================
    bindGlobalActions() {
      const publishBtn = document.getElementById('publishBtn');
      const saveDraftBtn = document.getElementById('saveDraftBtn');
      const togglePreviewBtn = document.getElementById('togglePreviewBtn');

      if (publishBtn) {
        publishBtn.addEventListener('click', () => this.publishData());
      }
      if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => this.saveDraft());
      }
      if (togglePreviewBtn) {
        togglePreviewBtn.addEventListener('click', () => {
          const pane = document.querySelector('.admin-preview-pane');
          if (pane) pane.classList.toggle('collapsed');
        });
      }
    },

    markDirty(changeDescription = 'Modification apportée') {
      this.isDirty = true;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(this.data));
      this.updateSyncStatus();
      this.streamPreviewUpdate();
    },

    updateSyncStatus() {
      const pill = document.getElementById('syncStatusPill');
      if (!pill) return;

      if (this.isDirty) {
        pill.className = 'sync-status-pill draft';
        pill.innerHTML = '<span class="status-dot"></span><span>Brouillon non synchronisé</span>';
      } else {
        pill.className = 'sync-status-pill';
        pill.innerHTML = '<span class="status-dot"></span><span>Portfolio synchronisé</span>';
      }
    },

    async publishData() {
      const publishBtn = document.getElementById('publishBtn');
      if (publishBtn) {
        publishBtn.disabled = true;
        publishBtn.innerHTML = '<span>Publication en cours…</span>';
      }

      try {
        const endpoint = window.location.pathname.includes('/portfolio/')
          ? '../api/index.php?route=portfolio'
          : '/api/portfolio';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuth.getToken()}`
          },
          body: JSON.stringify({
            action: 'publish',
            data: this.data,
            changeLog: 'Publication des modifications depuis le dashboard admin'
          })
        });

        const json = await res.json();
        if (json.success) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
          localStorage.removeItem(DRAFT_KEY);
          this.isDirty = false;
          this.updateSyncStatus();
          this.showToast('✓ Portfolio publié et synchronisé avec succès !', 'success');
        } else {
          throw new Error(json.message);
        }
      } catch (err) {
        // Fallback save to local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        localStorage.removeItem(DRAFT_KEY);
        this.isDirty = false;
        this.updateSyncStatus();
        this.showToast('✓ Modifications enregistrées localement !', 'success');
      } finally {
        if (publishBtn) {
          publishBtn.disabled = false;
          publishBtn.innerHTML = '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Publier les modifications</span>';
        }
      }
    },

    saveDraft() {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(this.data));
      this.isDirty = true;
      this.updateSyncStatus();
      this.showToast('Brouillon sauvegardé.', 'info');
    },

    // =========================================================================
    // LIVE PREVIEW STREAMING
    // =========================================================================
    initLivePreview() {
      this.previewIframe = document.getElementById('previewIframe');
      if (!this.previewIframe) return;

      // Device buttons
      document.querySelectorAll('.preview-btn[data-device]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.preview-btn[data-device]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const dev = btn.getAttribute('data-device');
          this.previewIframe.className = `preview-iframe ${dev}`;
        });
      });
    },

    streamPreviewUpdate() {
      if (this.previewIframe && this.previewIframe.contentWindow) {
        this.previewIframe.contentWindow.postMessage({
          type: 'PORTFOLIO_PREVIEW_UPDATE',
          payload: this.data
        }, '*');
      }
    },

    // =========================================================================
    // TAB RENDERERS
    // =========================================================================
    renderTab(tab) {
      const container = document.getElementById('adminTabContent');
      if (!container) return;

      switch (tab) {
        case 'dashboard':
          container.innerHTML = this.renderDashboardHTML();
          break;
        case 'profile':
          container.innerHTML = this.renderProfileHTML();
          this.bindProfileEvents();
          break;
        case 'projects':
          container.innerHTML = this.renderProjectsHTML();
          this.bindProjectsEvents();
          break;
        case 'skills':
          container.innerHTML = this.renderSkillsHTML();
          this.bindSkillsEvents();
          break;
        case 'experience':
          container.innerHTML = this.renderExperienceHTML();
          this.bindExperienceEvents();
          break;
        case 'education':
          container.innerHTML = this.renderEducationHTML();
          this.bindEducationEvents();
          break;
        case 'services':
          container.innerHTML = this.renderServicesHTML();
          this.bindServicesEvents();
          break;
        case 'design':
          container.innerHTML = this.renderDesignHTML();
          this.bindDesignEvents();
          break;
        case 'sections':
          container.innerHTML = this.renderSectionsHTML();
          this.bindSectionsEvents();
          break;
        case 'media':
          container.innerHTML = this.renderMediaHTML();
          this.bindMediaEvents();
          break;
        case 'messages':
          container.innerHTML = this.renderMessagesHTML();
          this.bindMessagesEvents();
          break;
        case 'history':
          container.innerHTML = this.renderHistoryHTML();
          this.bindHistoryEvents();
          break;
        case 'settings':
          container.innerHTML = this.renderSettingsHTML();
          this.bindSettingsEvents();
          break;
        default:
          container.innerHTML = '<p>Module en cours de chargement…</p>';
      }
    },

    // --- 1. DASHBOARD ---
    renderDashboardHTML() {
      const pCount = (this.data.projects || []).length;
      const sCount = (this.data.skills || []).length;
      const eCount = (this.data.experiences || []).length;
      const mCount = (this.data.messages || []).length;

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
              <span class="stat-label">Compétences Répertoriées</span>
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

        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🚀 Accès Rapide & Actions Majeures</h2>
              <p class="card-desc">Gérez votre portfolio instantanément sans aucune ligne de code</p>
            </div>
            <a href="../index.html" target="_blank" class="btn btn-secondary">
              <span>Voir le portfolio public ↗</span>
            </a>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="AdminApp.switchTab('projects')">+ Ajouter un nouveau projet</button>
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('profile')">Modifier mes coordonnées & bio</button>
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('design')">Changer les couleurs & thème</button>
            <button class="btn btn-secondary" onclick="AdminApp.switchTab('media')">Gérer la médiathèque</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🕒 Dernières Modifications & Synchronisations</h2>
            <button class="btn btn-secondary btn-icon" onclick="AdminApp.renderTab('dashboard')" title="Rafraîchir">↻</button>
          </div>
          <div class="items-list">
            ${(this.data.history || []).slice(0, 5).map(h => `
              <div class="list-item-card">
                <div>
                  <div class="item-title">${h.action} (${h.target})</div>
                  <div class="item-subtitle">${h.details || ''} — ${new Date(h.timestamp).toLocaleString('fr-FR')}</div>
                </div>
                <span class="nav-badge" style="background: var(--admin-border); color: var(--admin-text-muted);">Enregistré</span>
              </div>
            `).join('') || '<p style="color: var(--admin-text-dim);">Aucune modification récente enregistrée.</p>'}
          </div>
        </div>
      `;
    },

    // --- 2. PROFILE ---
    renderProfileHTML() {
      const p = this.data.profile || {};
      return `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Informations Personnelles & Présentation</h2>
            <button class="btn btn-primary" id="saveProfileBtn">Enregistrer les informations</button>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input type="text" id="profFirstName" class="form-control" value="${p.firstName || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Nom</label>
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
              <label class="form-label">Localisation</label>
              <input type="text" id="profLocation" class="form-control" value="${p.location || ''}">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Présentation Courte (Hero)</label>
              <textarea id="profShortBio" class="form-control">${p.shortBio || ''}</textarea>
            </div>
            <div class="form-group full-width">
              <label class="form-label">Biographie Complète (À propos)</label>
              <textarea id="profFullBio" class="form-control" style="min-height: 120px;">${p.fullBio || ''}</textarea>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Coordonnées & Réseaux Sociaux</h2>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Email Principal</label>
              <input type="email" id="profEmail" class="form-control" value="${p.email || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Téléphone Affiché</label>
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
              <label class="form-label">Fichier CV Actif (URL / Chemin)</label>
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
        p.firstName = document.getElementById('profFirstName').value;
        p.lastName = document.getElementById('profLastName').value;
        p.fullName = `${p.firstName} ${p.lastName}`.trim();
        p.title = document.getElementById('profTitle').value;
        p.subTitle = document.getElementById('profSubTitle').value;
        p.statusBadge = document.getElementById('profStatusBadge').value;
        p.location = document.getElementById('profLocation').value;
        p.shortBio = document.getElementById('profShortBio').value;
        p.fullBio = document.getElementById('profFullBio').value;
        p.email = document.getElementById('profEmail').value;
        p.phone = document.getElementById('profPhone').value;
        p.resumeUrl = document.getElementById('profResumeUrl').value;
        if (!p.socials) p.socials = {};
        p.socials.linkedin = document.getElementById('profLinkedIn').value;
        p.socials.github = document.getElementById('profGitHub').value;
        p.socials.whatsapp = document.getElementById('profWhatsApp').value;

        this.markDirty('Mise à jour du profil personnel');
        this.showToast('Profil mis à jour !', 'success');
      });
    },

    // --- 3. PROJECTS ---
    renderProjectsHTML() {
      const projects = this.data.projects || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">💼 Projets & Réalisations (${projects.length})</h2>
              <p class="card-desc">Ajoutez, modifiez ou réorganisez vos projets présentés au public</p>
            </div>
            <button class="btn btn-primary" id="addProjectBtn">+ Nouveau Projet</button>
          </div>
          <div class="items-list" id="projectsList">
            ${projects.map((proj, idx) => `
              <div class="list-item-card" data-id="${proj.id}">
                <img src="${proj.image || '../assets/images/project-bi.jpg'}" class="item-thumb" alt="${proj.title}">
                <div class="item-details">
                  <div class="item-title">${proj.title}</div>
                  <div class="item-subtitle">${proj.category} • ${proj.year || ''} • ${proj.tags?.join(', ') || ''}</div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-icon" onclick="AdminApp.editProject('${proj.id}')" title="Modifier">✏️</button>
                  <button class="btn btn-danger btn-icon" onclick="AdminApp.deleteProject('${proj.id}')" title="Supprimer">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindProjectsEvents() {
      const addBtn = document.getElementById('addProjectBtn');
      if (addBtn) {
        addBtn.addEventListener('click', () => this.openProjectModal());
      }
    },

    editProject(id) {
      const proj = (this.data.projects || []).find(p => p.id === id);
      if (proj) this.openProjectModal(proj);
    },

    deleteProject(id) {
      if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
        this.data.projects = (this.data.projects || []).filter(p => p.id !== id);
        this.markDirty(`Suppression du projet ${id}`);
        this.renderTab('projects');
        this.showToast('Projet supprimé.', 'warning');
      }
    },

    openProjectModal(proj = null) {
      const isEdit = !!proj;
      const p = proj || {
        id: 'proj-' + Date.now(),
        title: '',
        category: 'Business Intelligence & Analyse de Données',
        role: 'Data Analyst',
        year: new Date().getFullYear().toString(),
        image: 'assets/images/project-bi.jpg',
        desc: '',
        details: [],
        tags: [],
        githubUrl: 'https://github.com/Falikou1',
        demoUrl: '',
        visible: true
      };

      const modalHtml = `
        <div class="admin-modal-backdrop active" id="projectModalBackdrop">
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
                <label class="form-label">Année / Période</label>
                <input type="text" id="mProjYear" class="form-control" value="${p.year || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Image Principale (URL)</label>
                <input type="text" id="mProjImage" class="form-control" value="${p.image || ''}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Description Globale</label>
                <textarea id="mProjDesc" class="form-control">${p.desc || ''}</textarea>
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
                <label class="form-label">Lien Démo / En Ligne</label>
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
        p.title = document.getElementById('mProjTitle').value;
        p.category = document.getElementById('mProjCat').value;
        p.role = document.getElementById('mProjRole').value;
        p.year = document.getElementById('mProjYear').value;
        p.image = document.getElementById('mProjImage').value;
        p.desc = document.getElementById('mProjDesc').value;
        p.tags = document.getElementById('mProjTags').value.split(',').map(t => t.trim()).filter(Boolean);
        p.githubUrl = document.getElementById('mProjGithub').value;
        p.demoUrl = document.getElementById('mProjDemo').value;

        if (!Array.isArray(this.data.projects)) this.data.projects = [];
        if (!isEdit) {
          this.data.projects.push(p);
        } else {
          const idx = this.data.projects.findIndex(x => x.id === p.id);
          if (idx !== -1) this.data.projects[idx] = p;
        }

        this.markDirty(`Enregistrement du projet ${p.title}`);
        document.getElementById('projectModalBackdrop').remove();
        this.renderTab('projects');
        this.showToast('Projet enregistré avec succès !', 'success');
      });
    },

    // --- 4. SKILLS ---
    renderSkillsHTML() {
      const skills = this.data.skills || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">⚡ Compétences & Outils (${skills.length})</h2>
              <p class="card-desc">Gérez votre stack technique, niveaux de maîtrise et catégories</p>
            </div>
            <button class="btn btn-primary" id="addSkillBtn">+ Nouvelle Compétence</button>
          </div>
          <div class="items-list">
            ${skills.map(s => `
              <div class="list-item-card">
                <div style="font-size: 1.5rem; width: 40px; text-align: center;">${s.icon || '⚡'}</div>
                <div class="item-details">
                  <div class="item-title">${s.name} (${s.level || 80}%)</div>
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
      const addBtn = document.getElementById('addSkillBtn');
      if (addBtn) addBtn.addEventListener('click', () => this.openSkillModal());
    },

    editSkill(id) {
      const skill = (this.data.skills || []).find(s => s.id === id);
      if (skill) this.openSkillModal(skill);
    },

    deleteSkill(id) {
      if (confirm('Supprimer cette compétence ?')) {
        this.data.skills = (this.data.skills || []).filter(s => s.id !== id);
        this.markDirty('Suppression de compétence');
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
        <div class="admin-modal-backdrop active" id="skillModalBackdrop">
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
                <label class="form-label">Niveau de maîtrise (%): <span id="levelVal">${s.level}</span>%</label>
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
        s.name = document.getElementById('mSkillName').value;
        s.icon = document.getElementById('mSkillIcon').value;
        s.category = document.getElementById('mSkillCat').value;
        s.level = parseInt(document.getElementById('mSkillLevel').value, 10);
        s.desc = document.getElementById('mSkillDesc').value;

        if (!Array.isArray(this.data.skills)) this.data.skills = [];
        if (!isEdit) this.data.skills.push(s);
        else {
          const idx = this.data.skills.findIndex(x => x.id === s.id);
          if (idx !== -1) this.data.skills[idx] = s;
        }

        this.markDirty(`Enregistrement compétence ${s.name}`);
        document.getElementById('skillModalBackdrop').remove();
        this.renderTab('skills');
      });
    },

    // --- 5. EXPERIENCE ---
    renderExperienceHTML() {
      const exps = this.data.experiences || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🏢 Expériences & Parcours Professionnel (${exps.length})</h2>
              <p class="card-desc">Gérez vos postes, stages, missions et engagements associatifs</p>
            </div>
            <button class="btn btn-primary" id="addExpBtn">+ Nouvelle Expérience</button>
          </div>
          <div class="items-list">
            ${exps.map(exp => `
              <div class="list-item-card">
                <img src="${exp.logo || '../assets/images/logo_iua.png'}" class="item-thumb" alt="${exp.company}">
                <div class="item-details">
                  <div class="item-title">${exp.role} — <span style="color: var(--admin-accent);">${exp.company}</span></div>
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
        this.markDirty('Suppression expérience');
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
        <div class="admin-modal-backdrop active" id="expModalBackdrop">
          <div class="admin-modal">
            <div class="card-header">
              <h2 class="card-title">${isEdit ? 'Modifier l\'expérience' : 'Ajouter une expérience'}</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('expModalBackdrop').remove()">✕</button>
            </div>
            <form id="expModalForm" class="form-grid" style="margin-top: 16px;">
              <div class="form-group">
                <label class="form-label">Poste / Rôle</label>
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
              <div class="form-group full-width">
                <label class="form-label">Technologies / Compétences clés</label>
                <input type="text" id="mExpTech" class="form-control" value="${(e.technologies || []).join(', ')}">
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
        e.role = document.getElementById('mExpRole').value;
        e.company = document.getElementById('mExpCompany').value;
        e.period = document.getElementById('mExpPeriod').value;
        e.logo = document.getElementById('mExpLogo').value;
        e.desc = document.getElementById('mExpDesc').value;
        e.technologies = document.getElementById('mExpTech').value.split(',').map(t => t.trim()).filter(Boolean);

        if (!Array.isArray(this.data.experiences)) this.data.experiences = [];
        if (!isEdit) this.data.experiences.push(e);
        else {
          const idx = this.data.experiences.findIndex(x => x.id === e.id);
          if (idx !== -1) this.data.experiences[idx] = e;
        }

        this.markDirty(`Enregistrement expérience ${e.role}`);
        document.getElementById('expModalBackdrop').remove();
        this.renderTab('experience');
      });
    },

    // --- 6. EDUCATION ---
    renderEducationHTML() {
      const edus = this.data.educations || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🎓 Formations & Certifications (${edus.length})</h2>
              <p class="card-desc">Gérez votre cursus académique et vos certifications internationales</p>
            </div>
            <button class="btn btn-primary" id="addEduBtn">+ Nouvelle Formation / Certif</button>
          </div>
          <div class="items-list">
            ${edus.map(edu => `
              <div class="list-item-card">
                <img src="${edu.logo || '../assets/images/logo_iua.png'}" class="item-thumb" alt="${edu.degree}">
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
      if (confirm('Supprimer cette entrée de formation ?')) {
        this.data.educations = (this.data.educations || []).filter(e => e.id !== id);
        this.markDirty('Suppression formation');
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
        <div class="admin-modal-backdrop active" id="eduModalBackdrop">
          <div class="admin-modal">
            <div class="card-header">
              <h2 class="card-title">${isEdit ? 'Modifier la formation' : 'Ajouter une formation / certification'}</h2>
              <button class="btn btn-secondary btn-icon" onclick="document.getElementById('eduModalBackdrop').remove()">✕</button>
            </div>
            <form id="eduModalForm" class="form-grid" style="margin-top: 16px;">
              <div class="form-group full-width">
                <label class="form-label">Intitulé du Diplôme / Certification</label>
                <input type="text" id="mEduDegree" class="form-control" value="${e.degree}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Établissement / Organisme</label>
                <input type="text" id="mEduInst" class="form-control" value="${e.institution}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Période / Année</label>
                <input type="text" id="mEduPeriod" class="form-control" value="${e.period}">
              </div>
              <div class="form-group">
                <label class="form-label">Logo / Image (URL)</label>
                <input type="text" id="mEduLogo" class="form-control" value="${e.logo}">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Détails / Description</label>
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
        e.degree = document.getElementById('mEduDegree').value;
        e.institution = document.getElementById('mEduInst').value;
        e.period = document.getElementById('mEduPeriod').value;
        e.logo = document.getElementById('mEduLogo').value;
        e.desc = document.getElementById('mEduDesc').value;

        if (!Array.isArray(this.data.educations)) this.data.educations = [];
        if (!isEdit) this.data.educations.push(e);
        else {
          const idx = this.data.educations.findIndex(x => x.id === e.id);
          if (idx !== -1) this.data.educations[idx] = e;
        }

        this.markDirty(`Enregistrement formation ${e.degree}`);
        document.getElementById('eduModalBackdrop').remove();
        this.renderTab('education');
      });
    },

    // --- 7. SERVICES ---
    renderServicesHTML() {
      const srvs = this.data.services || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🛠️ Services Proposés (${srvs.length})</h2>
              <p class="card-desc">Gérez vos offres de prestations analytiques et de développement</p>
            </div>
            <button class="btn btn-primary" id="addSrvBtn">+ Nouveau Service</button>
          </div>
          <div class="items-list">
            ${srvs.map(s => `
              <div class="list-item-card">
                <div style="font-size: 1.5rem; width: 40px; text-align: center;">${s.icon || '🛠️'}</div>
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
        this.markDirty('Suppression service');
        this.renderTab('services');
      }
    },

    openSrvModal(srv = null) {
      const isEdit = !!srv;
      const s = srv || {
        id: 'srv-' + Date.now(),
        title: '',
        description: '',
        icon: '📊',
        visible: true
      };

      const modalHtml = `
        <div class="admin-modal-backdrop active" id="srvModalBackdrop">
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
                <label class="form-label">Description de la prestation</label>
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
        s.title = document.getElementById('mSrvTitle').value;
        s.icon = document.getElementById('mSrvIcon').value;
        s.description = document.getElementById('mSrvDesc').value;

        if (!Array.isArray(this.data.services)) this.data.services = [];
        if (!isEdit) this.data.services.push(s);
        else {
          const idx = this.data.services.findIndex(x => x.id === s.id);
          if (idx !== -1) this.data.services[idx] = s;
        }

        this.markDirty(`Enregistrement service ${s.title}`);
        document.getElementById('srvModalBackdrop').remove();
        this.renderTab('services');
      });
    },

    // --- 8. DESIGN STUDIO ---
    renderDesignHTML() {
      const d = this.data.design || {};
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🎨 Studio de Design & Palette de Couleurs</h2>
              <p class="card-desc">Modifiez l'identité visuelle en direct — les changements sont immédiatement visibles sur l'aperçu à droite</p>
            </div>
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
              <label class="form-label">Couleur d'Accent Hover</label>
              <div class="color-picker-group">
                <input type="color" id="designAccentHover" class="color-swatch-input" value="${d.accentHover || '#ff4d15'}">
                <input type="text" id="designAccentHoverHex" class="form-control" value="${d.accentHover || '#ff4d15'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Arrière-plan Sombre (Dark Background)</label>
              <div class="color-picker-group">
                <input type="color" id="designBgDark" class="color-swatch-input" value="${d.bgDark || '#0b0b0e'}">
                <input type="text" id="designBgDarkHex" class="form-control" value="${d.bgDark || '#0b0b0e'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Cartes Sombres (Card Background)</label>
              <div class="color-picker-group">
                <input type="color" id="designBgCardDark" class="color-swatch-input" value="${d.bgCardDark || '#131318'}">
                <input type="text" id="designBgCardDarkHex" class="form-control" value="${d.bgCardDark || '#131318'}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Police des Titres</label>
              <select id="designFontHeading" class="form-control">
                <option value="'Outfit', sans-serif">Outfit (Moderne & Premium)</option>
                <option value="'Inter', sans-serif">Inter (Épuré & Tech)</option>
                <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                <option value="'Poppins', sans-serif">Poppins (Géométrique)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Rayon des Bordures (Border Radius)</label>
              <select id="designBorderRadius" class="form-control">
                <option value="8px">Discret (8px)</option>
                <option value="16px" selected>Arrondi Moderne (16px)</option>
                <option value="24px">Très Arrondi (24px)</option>
              </select>
            </div>
          </div>
        </div>
      `;
    },

    bindDesignEvents() {
      const syncInput = (colorId, hexId, key) => {
        const colorEl = document.getElementById(colorId);
        const hexEl = document.getElementById(hexId);
        if (!colorEl || !hexEl) return;

        colorEl.addEventListener('input', (e) => {
          hexEl.value = e.target.value;
          if (!this.data.design) this.data.design = {};
          this.data.design[key] = e.target.value;
          this.markDirty();
        });

        hexEl.addEventListener('change', (e) => {
          colorEl.value = e.target.value;
          if (!this.data.design) this.data.design = {};
          this.data.design[key] = e.target.value;
          this.markDirty();
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
          this.markDirty();
        });
      }

      const radiusEl = document.getElementById('designBorderRadius');
      if (radiusEl) {
        radiusEl.addEventListener('change', (e) => {
          if (!this.data.design) this.data.design = {};
          this.data.design.borderRadius = e.target.value;
          this.markDirty();
        });
      }
    },

    // --- 9. SECTIONS & TEXT OVERRIDES ---
    renderSectionsHTML() {
      const s = this.data.sections || {};
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📑 Visibilité des Sections & Textes</h2>
              <p class="card-desc">Activez ou masquez chaque section et personnalisez les titres</p>
            </div>
            <button class="btn btn-primary" id="saveSectionsBtn">Enregistrer les textes</button>
          </div>
          <div class="form-grid">
            <div class="form-group full-width" style="border-bottom: 1px solid var(--admin-border); padding-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <strong>Section Hero (Accueil)</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secHeroVisible" ${s.hero?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <input type="text" id="secHeroTitle" class="form-control" style="margin-top: 10px;" value="${s.hero?.title || ''}">
            </div>

            <div class="form-group full-width" style="border-bottom: 1px solid var(--admin-border); padding-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <strong>Section Projets & Réalisations</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secProjectsVisible" ${s.projects?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <input type="text" id="secProjectsTitle" class="form-control" style="margin-top: 10px;" value="${s.projects?.title || ''}">
            </div>

            <div class="form-group full-width" style="border-bottom: 1px solid var(--admin-border); padding-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <strong>Section Expériences & Leadership</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secExpVisible" ${s.experience?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <input type="text" id="secExpTitle" class="form-control" style="margin-top: 10px;" value="${s.experience?.title || ''}">
            </div>

            <div class="form-group full-width" style="border-bottom: 1px solid var(--admin-border); padding-bottom: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <strong>Section Formations & Certifications</strong>
                <label class="toggle-switch">
                  <input type="checkbox" id="secEduVisible" ${s.education?.visible !== false ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>
              <input type="text" id="secEduTitle" class="form-control" style="margin-top: 10px;" value="${s.education?.title || ''}">
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
        this.data.sections.hero.title = document.getElementById('secHeroTitle').value;

        if (!this.data.sections.projects) this.data.sections.projects = {};
        this.data.sections.projects.visible = document.getElementById('secProjectsVisible').checked;
        this.data.sections.projects.title = document.getElementById('secProjectsTitle').value;

        if (!this.data.sections.experience) this.data.sections.experience = {};
        this.data.sections.experience.visible = document.getElementById('secExpVisible').checked;
        this.data.sections.experience.title = document.getElementById('secExpTitle').value;

        if (!this.data.sections.education) this.data.sections.education = {};
        this.data.sections.education.visible = document.getElementById('secEduVisible').checked;
        this.data.sections.education.title = document.getElementById('secEduTitle').value;

        this.markDirty('Mise à jour des sections et titres');
        this.showToast('Sections enregistrées !', 'success');
      });
    },

    // --- 10. MEDIA LIBRARY ---
    renderMediaHTML() {
      const media = this.data.mediaLibrary || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🖼️ Médiathèque (${media.length} fichiers)</h2>
              <p class="card-desc">Importez et sélectionnez vos photos, visuels de projets et logos</p>
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
            type: 'image',
            size: `${(file.size / 1024).toFixed(0)} KB`
          };

          if (!Array.isArray(this.data.mediaLibrary)) this.data.mediaLibrary = [];
          this.data.mediaLibrary.unshift(newMedia);
          this.markDirty(`Upload image ${file.name}`);
          this.renderTab('media');
          this.showToast('Image importée dans la médiathèque !', 'success');
        };
        reader.readAsDataURL(file);
      });
    },

    deleteMedia(id) {
      if (confirm('Supprimer cette image de la médiathèque ?')) {
        this.data.mediaLibrary = (this.data.mediaLibrary || []).filter(m => m.id !== id);
        this.markDirty('Suppression média');
        this.renderTab('media');
      }
    },

    // --- 11. MESSAGES INBOX ---
    renderMessagesHTML() {
      const msgs = this.data.messages || [];
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📩 Messages Reçus (${msgs.length})</h2>
              <p class="card-desc">Demandes de contact envoyées depuis votre formulaire portfolio</p>
            </div>
          </div>
          <div class="items-list">
            ${msgs.map(m => `
              <div class="list-item-card">
                <div class="item-details">
                  <div class="item-title">${m.name} <span style="font-weight: 400; color: var(--admin-text-muted);">(${m.email})</span></div>
                  <div style="font-weight: 600; font-size: 0.88rem; margin: 4px 0; color: var(--admin-accent);">${m.subject}</div>
                  <div class="item-subtitle" style="font-size: 0.85rem; color: var(--admin-text-main);">${m.message}</div>
                  <div style="font-size: 0.72rem; color: var(--admin-text-dim); margin-top: 6px;">${new Date(m.date).toLocaleString('fr-FR')}</div>
                </div>
                <div class="item-actions">
                  <a href="mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}" class="btn btn-primary btn-icon" title="Répondre">✉️</a>
                </div>
              </div>
            `).join('') || '<p style="color: var(--admin-text-dim); padding: 20px; text-align: center;">Aucun message reçu pour le moment.</p>'}
          </div>
        </div>
      `;
    },

    bindMessagesEvents() {},

    // --- 12. HISTORY ---
    renderHistoryHTML() {
      const history = this.data.history || [];
      return `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🕒 Journal d'Audit & Historique des Modifications</h2>
          </div>
          <div class="items-list">
            ${history.map(h => `
              <div class="list-item-card">
                <div>
                  <div class="item-title">${h.action} (${h.target || 'Portfolio'})</div>
                  <div class="item-subtitle">${h.details || ''}</div>
                </div>
                <div style="font-size: 0.8rem; color: var(--admin-text-dim);">${new Date(h.timestamp).toLocaleString('fr-FR')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    bindHistoryEvents() {},

    // --- 13. SETTINGS & SEO ---
    renderSettingsHTML() {
      const seo = this.data.seo || {};
      return `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🔍 Référencement Naturel & Balises SEO</h2>
            <button class="btn btn-primary" id="saveSeoBtn">Enregistrer les paramètres SEO</button>
          </div>
          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">Titre de l'onglet (Meta Title)</label>
              <input type="text" id="seoTitle" class="form-control" value="${seo.metaTitle || ''}">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Description pour Google (Meta Description)</label>
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
            <h2 class="card-title">💾 Sauvegarde & Exportation Complète</h2>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="AdminApp.exportBackup()">📥 Exporter la sauvegarde JSON</button>
            <label class="btn btn-secondary" style="cursor: pointer;">
              <span>📤 Importer une sauvegarde JSON</span>
              <input type="file" id="importBackupInput" accept=".json" style="display: none;">
            </label>
            <button class="btn btn-danger" onclick="AdminApp.resetToDefault()">⚠️ Réinitialiser aux valeurs par défaut</button>
          </div>
        </div>
      `;
    },

    bindSettingsEvents() {
      const btn = document.getElementById('saveSeoBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          if (!this.data.seo) this.data.seo = {};
          this.data.seo.metaTitle = document.getElementById('seoTitle').value;
          this.data.seo.metaDescription = document.getElementById('seoDesc').value;
          this.data.seo.keywords = document.getElementById('seoKeywords').value;

          this.markDirty('Mise à jour paramètres SEO');
          this.showToast('Paramètres SEO enregistrés !', 'success');
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
              const imported = JSON.parse(ev.target.result);
              this.data = imported;
              this.markDirty('Importation complète d\'une sauvegarde');
              this.renderTab(this.currentTab);
              this.showToast('Sauvegarde restaurée avec succès !', 'success');
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
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    },

    resetToDefault() {
      if (confirm('Attention : toutes les modifications non publiées seront écrasées. Continuer ?')) {
        fetch('../data/default-portfolio.json')
          .then(r => r.json())
          .then(def => {
            this.data = def;
            this.markDirty('Réinitialisation aux valeurs par défaut');
            this.renderTab(this.currentTab);
            this.showToast('Données réinitialisées.', 'info');
          });
      }
    },

    // --- UTILITIES ---
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

      setTimeout(() => {
        toast.className = 'admin-toast';
      }, 3500);
    }
  };

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => window.AdminApp.init());
})();
