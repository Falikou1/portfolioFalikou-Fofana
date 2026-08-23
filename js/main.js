/**
 * PORTFOLIO JAVASCRIPT LOGIC
 * Falikou FOFANA - Data Analyst & Développeur
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navBackdrop = document.querySelector('.nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const cvDownloadButtons = document.querySelectorAll('.cv-download-btn');
  const toastNotification = document.getElementById('cvToast');
  
  // Project Modal Elements
  const modal = document.getElementById('projectModal');
  const modalClose = document.querySelector('.modal-close-btn');
  const modalImage = document.getElementById('modalImage');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalRole = document.getElementById('modalRole');
  const modalYear = document.getElementById('modalYear');
  const modalDesc = document.getElementById('modalDesc');
  const modalDetails = document.getElementById('modalDetails');
  const modalTags = document.getElementById('modalTags');

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // =========================================================================
  // 2. NAVBAR SCROLL EFFECT
  // =========================================================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // =========================================================================
  // 3. MOBILE MENU TOGGLE
  // =========================================================================
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.remove('open');
      navBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('open');
      navBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', toggleMobileMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // =========================================================================
  // 4. ACTIVE NAVIGATION LINK ON SCROLL
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);

  // =========================================================================
  // 5. SKILL FILTER TABS
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 6. PROJECT MODAL DATA & HANDLER
  // =========================================================================
  const projectDetailsData = {
    'bi-dashboard': {
      category: 'Business Intelligence & Analyse de Données',
      title: 'Dashboard Commercial des Ventes',
      year: '2026',
      role: 'Data Analyst & Concepteur BI',
      image: 'assets/images/project-bi.jpg',
      desc: 'Projet complet d\'analyse et d\'optimisation de données de vente massives. Structuration, modélisation décisionnelle et conception d\'un tableau de bord interactif pour le pilotage de la performance commerciale.',
      details: [
        '<strong>Nettoyage & Fiabilisation :</strong> Dédoublonnage approfondi, traitement des valeurs manquantes, détection des anomalies et harmonisation des données régionales et produits.',
        '<strong>Modélisation des KPIs :</strong> Calcul automatisé du Chiffre d\'Affaires global, de la Marge commerciale brute, du Taux de marge (%) et de la vélocité des commandes.',
        '<strong>Tableau de bord dynamique :</strong> Conception de tableaux croisés dynamiques (TCD) avancés interconnectés avec segments de filtrage multi-critères (Régions, Périodes, Catégories).'
      ],
      tags: ['Excel Avancé', 'TCD Croisés', 'KPIs Commerciaux', 'Power BI', 'Data Cleaning', 'Data Viz']
    },
    'agency-tuwshiuah': {
      category: 'Développement Web & Mobile',
      title: 'Tuwshiuah / AI & Digital Agency',
      year: 'Juillet 2026',
      role: 'Développeur Web & Mobile (Stage)',
      image: 'assets/images/project-agency.jpg',
      desc: 'Immersion professionnelle au sein d\'une agence innovante alliant Intelligence Artificielle, développement d\'interfaces applicatives et stratégies de marketing numérique.',
      details: [
        '<strong>Vibe Coding & Prototypage :</strong> Développement rapide et itératif d\'applications web et mobiles modernes assisté par des outils d\'IA générative.',
        '<strong>Stratégie Digitale :</strong> Élaboration et déploiement de campagnes marketing ciblées, optimisation de l\'engagement utilisateur et analyse de conversion web.',
        '<strong>Collaboration Agile :</strong> Travail en équipe pluridisciplinaire sur des livrables clients à haute valeur ajoutée.'
      ],
      tags: ['Vibe Coding', 'Web & Mobile', 'Intelligence Artificielle', 'Marketing Digital', 'UI/UX']
    },
    'hackathon-esatic': {
      category: 'Architecture Réseau & Sécurité',
      title: 'Technovore Hackathon 2026 – ESATIC',
      year: 'Mars 2026',
      role: 'Team Lead & Concepteur Réseau',
      image: 'assets/images/project-hackathon.jpg',
      desc: 'Compétition technologique majeure à l\'École Supérieure Africaine des TIC. Conception complète et sécurisation d\'une infrastructure réseau d\'entreprise multi-sites.',
      details: [
        '<strong>Architecture & Topologie :</strong> Élaboration d\'un plan d\'adressage IP optimisé, segmentation sécurisée en VLANs et interconnexion multi-sites.',
        '<strong>Simulation Cisco Packet Tracer :</strong> Déploiement et tests des protocoles DHCP, NAT, OSPF dynamique et tunnels chiffrés VPN IPsec.',
        '<strong>Leadership d\'Équipe :</strong> Coordination technique du groupe de projet et présentation des résultats devant le jury de l\'ESATIC.'
      ],
      tags: ['Cisco Packet Tracer', 'VPN IPsec', 'OSPF', 'VLAN & NAT', 'Cybersécurité', 'Leadership']
    }
  };

  // Attach globally for dynamic CMS hydration
  window.projectDetailsData = projectDetailsData;

  // Support both .project-card and .project__card selectors
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card, .project__card, [data-project-id]');
    if (!card) return;

    // Prevent trigger if clicking an external link inside the card
    if (e.target.closest('a[href^="http"], button')) return;

    const projectId = card.getAttribute('data-project-id') || (
      card.querySelector('.project__title, h3')?.textContent?.includes('Commercial') ? 'bi-dashboard' :
      card.querySelector('.project__title, h3')?.textContent?.includes('Tuwshiuah') ? 'agency-tuwshiuah' :
      card.querySelector('.project__title, h3')?.textContent?.includes('Hackathon') ? 'hackathon-esatic' : null
    );

    const data = (window.projectDetailsData && projectId) ? window.projectDetailsData[projectId] : null;

    if (data && modal) {
      if (modalCategory) modalCategory.textContent = data.category || '';
      if (modalTitle) modalTitle.textContent = data.title || '';
      if (modalRole) modalRole.textContent = data.role || '';
      if (modalYear) modalYear.textContent = data.year || '';
      if (modalDesc) modalDesc.textContent = data.desc || '';
      if (modalImage) {
        modalImage.src = data.image || 'assets/images/project-bi.jpg';
        modalImage.alt = data.title || '';
      }

      // Populate details
      if (modalDetails) {
        modalDetails.innerHTML = '';
        (data.details || []).forEach(detailText => {
          const li = document.createElement('li');
          li.className = 'modal-details-item';
          li.innerHTML = detailText;
          modalDetails.appendChild(li);
        });
      }

      // Populate tags
      if (modalTags) {
        modalTags.innerHTML = '';
        (data.tags || []).forEach(tagText => {
          const span = document.createElement('span');
          span.className = 'badge badge-accent';
          span.textContent = tagText;
          modalTags.appendChild(span);
        });
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // =========================================================================
  // 7. CV DOWNLOAD FEEDBACK TOAST
  // =========================================================================
  cvDownloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (toastNotification) {
        toastNotification.classList.add('active');
        setTimeout(() => {
          toastNotification.classList.remove('active');
        }, 4500);
      }
    });
  });

  // =========================================================================
  // 8. ANIMATED COUNTERS
  // =========================================================================
  const counters = document.querySelectorAll('.metric-number');
  let counted = false;

  function runCounters() {
    const metricsSection = document.querySelector('.metrics-section');
    if (!metricsSection) return;

    const sectionPos = metricsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;

    if (sectionPos < screenPos && !counted) {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = 25;
        const increment = target / 40;

        const updateCount = () => {
          count += increment;
          if (count < target) {
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, speed);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
      });
      counted = true;
    }
  }

  window.addEventListener('scroll', runCounters);

  // =========================================================================
  // 9. SCROLL REVEAL OBSERVER
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================================
  // 10. CONTACT FORM SUBMISSION
  // =========================================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value || 'Prise de contact portfolio';
      const message = document.getElementById('message').value;

      if (formStatus) {
        formStatus.innerHTML = `<div style="padding: 12px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 0.9rem; font-family: var(--font-mono);">
          ✓ Merci ${name} ! Votre message a été préparé. Redirection vers votre messagerie en cours...
        </div>`;
      }

      // Open mailto fallback with structured body
      setTimeout(() => {
        const mailtoLink = `mailto:fofanafalikou068@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Bonjour Falikou,\n\nNom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoLink;
      }, 1000);
    });
  }
});
