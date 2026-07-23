/**
 * Recruiter View Role Selector Module.
 *
 * Manages recruiter-oriented role profile selection, URL query parameter state (?role=),
 * keyboard navigation, accessible ARIA attributes, and smooth DOM transitions inside
 * the Overview/Hero section.
 *
 * @module recruiterView
 */

'use strict';

/**
 * Centralized Role Profiles Configuration Object.
 */
export const ROLE_PROFILES = {
  'technical-product': {
    id: 'technical-product',
    title: 'Senior Technical Product Manager',
    headline: 'Senior Technical Product Manager',
    descriptor: 'Platform Delivery, Product Operations & Cross-Functional Execution',
    positioning: 'Translates commercial objectives and complex stakeholder requirements into product roadmaps, engineering specifications, UAT plans, and reliable platform launches. Experienced leading technical delivery across engineering, product design, QA, payment integrations, analytics, and external partners.',
    metrics: [
      { value: '82%', label: 'Open-beta product adoption' },
      { value: '6 months', label: 'Delivery time eliminated through roadmap alignment' },
      { value: '15 engineers', label: 'Technical product delivery team' }
    ],
    skills: [
      'Product Roadmaps',
      'Technical Requirements',
      'Agile Delivery',
      'Jira',
      'QA & UAT',
      'REST APIs',
      'Payment Integration',
      'Stakeholder Alignment'
    ],
    highlights: [
      'Led product roadmap and launch delivery for HotPlay ad-tech and gaming-integration products.',
      'Converted business objectives into engineering specifications and UAT plans.',
      'Coordinated engineering, product design, and QA to deliver roadmap milestones.',
      'Finalized the bondbond community and commerce application across internal teams, outsourced developers, and multiple business stakeholders.'
    ],
    summaryTitle: 'Senior Technical Product Manager',
    summarySubtitle: 'Platform Delivery & Product Operations',
    summaryBullets: [
      { icon: 'fas fa-map-signs', text: 'Product Roadmaps & Technical Specs' },
      { icon: 'fas fa-tasks', text: 'Agile Delivery & UAT Governance' },
      { icon: 'fas fa-code-branch', text: 'REST APIs & Payment Integrations' },
      { icon: 'fas fa-certificate', text: 'PMI-ACP®, FMVA®, Agile Product Owner' }
    ]
  },

  'ai-data-solutions': {
    id: 'ai-data-solutions',
    title: 'Applied AI & Data Solutions Lead',
    headline: 'Applied AI & Data Solutions Lead',
    descriptor: 'Agentic Workflows, Analytics Automation & Behavioral Intelligence',
    positioning: 'Designs applied AI and data systems that turn fragmented operational knowledge into measurable workflows, decision support, and automation. Combines agentic AI, RAG, evaluation harnesses, analytics engineering, and behavioral segmentation with commercial product strategy.',
    metrics: [
      { value: '100M+ users', label: 'Behavioral segmentation scale' },
      { value: '−85%', label: 'User-acquisition cost' },
      { value: '$3K–$10K', label: 'Savings per automated client project' }
    ],
    skills: [
      'Agentic AI',
      'RAG Architecture',
      'AI Evaluation',
      'Python',
      'SQL',
      'BigQuery',
      'Automated ETL',
      'Machine Learning',
      'User Segmentation',
      'OpenAI APIs'
    ],
    highlights: [
      'Built user-classification models that organized more than 100 million users into behavioral segments.',
      'Developed automated data and reporting workflows using Python, SQL, BigQuery, Hive, and analytics platforms.',
      'Researched agentic systems that plan, act, verify, and report.',
      'Designed RAG knowledge pipelines and lightweight evaluation harnesses for accuracy and failure-mode testing.',
      'Applied AI-assisted automation to localization, marketing reporting, and operational workflows.'
    ],
    summaryTitle: 'Applied AI & Data Solutions Lead',
    summarySubtitle: 'Agentic Workflows & Analytics',
    summaryBullets: [
      { icon: 'fas fa-robot', text: 'Agentic Workflows & AI Autopilot' },
      { icon: 'fas fa-database', text: 'RAG Architecture & BigQuery ETL' },
      { icon: 'fas fa-brain', text: 'Behavioral Segmentation & ML' },
      { icon: 'fas fa-certificate', text: 'OpenAI API Master & AI Harnessing' }
    ]
  },

  'it-infrastructure': {
    id: 'it-infrastructure',
    title: 'IT Infrastructure & Systems Manager',
    headline: 'IT Infrastructure & Systems Manager',
    descriptor: 'Enterprise Infrastructure, Service Operations & Technical Team Leadership',
    positioning: 'Leads business-critical infrastructure across networks, servers, storage, security, support operations, and technical teams. Experienced maintaining reliable environments for offices, commerce systems, publishing operations, and high-volume digital services.',
    metrics: [
      { value: '$10M+', label: 'Annual infrastructure cost avoided' },
      { value: '100+ users', label: 'Enterprise support environment' },
      { value: '+22%', label: 'Productivity and profitability improvement' }
    ],
    skills: [
      'Linux and CentOS',
      'NGINX',
      'Redis',
      'MySQL',
      'Cisco Networking',
      'VPN',
      'NAS and SAN',
      'Firewalls',
      'Cloud Storage',
      'IT Service Operations',
      'Technical Team Leadership'
    ],
    highlights: [
      'Managed IT systems, server environments, and network infrastructure for more than 100 office users across three business units.',
      'Configured Cisco networking equipment, VPNs, storage systems, firewalls, and cloud services.',
      'Managed offline publishing-server infrastructure using CentOS, NGINX, Redis, and MySQL.',
      'Supervised and scheduled a technical team of more than 10 technicians supporting multiple business units.',
      'Improved organizational workflows through practical infrastructure and service-management changes.'
    ],
    summaryTitle: 'IT Infrastructure & Systems Manager',
    summarySubtitle: 'Enterprise Infrastructure & Operations',
    summaryBullets: [
      { icon: 'fas fa-server', text: 'Linux, NGINX, Redis & MySQL Stack' },
      { icon: 'fas fa-network-wired', text: 'Cisco Networking, VPN & Firewalls' },
      { icon: 'fas fa-users-cog', text: 'Supervised 10+ Technical Staff' },
      { icon: 'fas fa-certificate', text: 'IT Infrastructure & Enterprise Storage' }
    ]
  },

  'product-marketing': {
    id: 'product-marketing',
    title: 'Product Marketing & GTM Director',
    headline: 'Product Marketing & GTM Director',
    descriptor: 'Positioning, Monetization, Launch Strategy & Strategic Partnerships',
    positioning: 'Connects product capabilities with differentiated market narratives, monetization systems, launch execution, and lifecycle growth. Experienced leading cross-functional teams, rescuing high-pressure releases, optimizing live operations, and developing partnerships with global technology and entertainment companies.',
    metrics: [
      { value: '+151%', label: 'Customer lifetime value' },
      { value: '+237.91%', label: 'Month-over-month revenue growth' },
      { value: '20 people', label: 'Cross-functional product and marketing team' }
    ],
    skills: [
      'Product Positioning',
      'Go-to-Market Strategy',
      'Monetization',
      'Lifecycle Marketing',
      'Marketing Analytics',
      'Product Launches',
      'Strategic Partnerships',
      'Publishing Operations',
      'Localization Strategy',
      'Audience Segmentation'
    ],
    highlights: [
      'Directed positioning, branding, monetization, multi-channel marketing, and release planning for flagship game products.',
      'Led a 20-person cross-functional team across product, design, and marketing.',
      'Improved live-operations and monetization mechanics, increasing customer lifetime value by 151%.',
      'Took over and delivered a high-pressure Thailand product launch involving localization, analytics, CDN, website, and payment infrastructure.',
      'Developed relationships with Tencent, AMD, MIGU, China Literature, and other strategic partners.'
    ],
    summaryTitle: 'Product Marketing & GTM Director',
    summarySubtitle: 'Monetization & Strategic Partnerships',
    summaryBullets: [
      { icon: 'fas fa-chart-line', text: 'GTM Strategy & Product Positioning' },
      { icon: 'fas fa-handshake', text: 'Global Strategic Partnerships (Tencent, AMD)' },
      { icon: 'fas fa-users', text: 'Led 20-person Cross-Functional Team' },
      { icon: 'fas fa-certificate', text: 'Monetization & Live-Ops Specialist' }
    ]
  }
};

const DEFAULT_ROLE_ID = 'technical-product';

/**
 * Gets initial role ID from URL search params with fallback to default.
 *
 * @returns {string} Valid role ID
 */
function getRoleFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam && ROLE_PROFILES[roleParam]) {
      return roleParam;
    }
  } catch (err) {
    console.warn('[RecruiterView] Failed to parse URL parameters:', err);
  }
  return DEFAULT_ROLE_ID;
}

/**
 * Updates URL search parameter ?role= without page reload or scroll movement.
 * Preserves unrelated existing query parameters.
 *
 * @param {string} roleId - Target role ID
 */
function updateUrlRoleState(roleId) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('role', roleId);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  } catch (err) {
    console.warn('[RecruiterView] Failed to update history state:', err);
  }
}

/**
 * Updates dynamic Overview section elements with data from the given role profile.
 * Performs DOM updates safely using textContent and structured DOM creation.
 *
 * @param {object} profile - Selected role profile object
 */
function renderRoleProfile(profile) {
  // 1. Role headline & descriptor
  const headlineEl = document.getElementById('overview-role-headline');
  const descriptorEl = document.getElementById('overview-role-descriptor');
  if (headlineEl) headlineEl.textContent = profile.headline;
  if (descriptorEl) descriptorEl.textContent = profile.descriptor;

  // 2. Positioning statement
  const positioningEl = document.getElementById('overview-positioning-statement');
  if (positioningEl) positioningEl.textContent = profile.positioning;

  // 3. Metric cards
  const metricsGrid = document.getElementById('overview-metrics-grid');
  if (metricsGrid && profile.metrics) {
    metricsGrid.replaceChildren(); // Safe clear
    const metricColors = [
      'text-indigo-600 dark:text-sky-400',
      'text-emerald-600 dark:text-emerald-400',
      'text-purple-600 dark:text-purple-400'
    ];

    profile.metrics.forEach((metric, index) => {
      const card = document.createElement('div');
      card.className = 'p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all';
      
      const valDiv = document.createElement('div');
      valDiv.className = `font-display font-extrabold text-xl sm:text-2xl ${metricColors[index % metricColors.length]}`;
      valDiv.textContent = metric.value;

      const lblDiv = document.createElement('div');
      lblDiv.className = 'text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5';
      lblDiv.textContent = metric.label;

      card.appendChild(valDiv);
      card.appendChild(lblDiv);
      metricsGrid.appendChild(card);
    });
  }

  // 4. Skills chips
  const skillsContainer = document.getElementById('overview-skills-chips');
  if (skillsContainer && profile.skills) {
    skillsContainer.replaceChildren();
    profile.skills.forEach(skill => {
      const chip = document.createElement('span');
      chip.className = 'px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/70 dark:border-indigo-800/70 text-indigo-700 dark:text-sky-300 text-xs font-semibold';
      chip.textContent = skill;
      skillsContainer.appendChild(chip);
    });
  }

  // 5. Experience highlights
  const highlightsContainer = document.getElementById('overview-experience-highlights');
  if (highlightsContainer && profile.highlights) {
    highlightsContainer.replaceChildren();
    profile.highlights.forEach(highlight => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2.5';
      
      const icon = document.createElement('i');
      icon.className = 'fas fa-check-circle text-indigo-500 dark:text-sky-400 mt-1 text-xs shrink-0';

      const textSpan = document.createElement('span');
      textSpan.textContent = highlight;

      li.appendChild(icon);
      li.appendChild(textSpan);
      highlightsContainer.appendChild(li);
    });
  }

  // 6. Right Profile Summary Card
  const profileTitleEl = document.getElementById('profile-card-role-title');
  const profileSubtitleEl = document.getElementById('profile-card-role-subtitle');
  const profileBulletsEl = document.getElementById('profile-card-bullets');

  if (profileTitleEl) profileTitleEl.textContent = profile.summaryTitle;
  if (profileSubtitleEl) profileSubtitleEl.textContent = profile.summarySubtitle;

  if (profileBulletsEl && profile.summaryBullets) {
    profileBulletsEl.replaceChildren();
    profile.summaryBullets.forEach(item => {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-3';

      const iconEl = document.createElement('i');
      iconEl.className = `${item.icon} text-indigo-500 w-4 text-center shrink-0`;

      const textSpan = document.createElement('span');
      textSpan.textContent = item.text;

      row.appendChild(iconEl);
      row.appendChild(textSpan);
      profileBulletsEl.appendChild(row);
    });
  }

  // 7. Dynamic email Inquiry subjects
  const subjectText = "Portfolio Inquiry — " + profile.title;
  const encodedSubject = encodeURIComponent(subjectText);
  const emailUrl = `mailto:thananate.t@gmail.com?subject=${encodedSubject}`;

  const inquiryBtn = document.getElementById('hero-inquiry-btn');
  if (inquiryBtn) {
    inquiryBtn.setAttribute('href', emailUrl);
    inquiryBtn.setAttribute('data-analytics-param-selected-role', profile.id);
  }

  const emailTextLink = document.getElementById('hero-email-text-link');
  if (emailTextLink) {
    emailTextLink.setAttribute('href', emailUrl);
  }

  const cardEmailLink = document.getElementById('card-email-link');
  if (cardEmailLink) {
    cardEmailLink.setAttribute('href', emailUrl);
  }
}

/**
 * Initializes the Recruiter View role selector.
 *
 * DOM dependencies:
 * - Reads tab buttons matching `.recruiter-role-btn`.
 * - Reads dynamic container `#overview-dynamic-content`.
 *
 * Side effects:
 * - Reads and updates URL search parameters.
 * - Updates button active state classes and ARIA attributes.
 * - Updates DOM text and elements inside Overview section.
 * - Dispatches optional analytics telemetry event.
 */
export function initRecruiterView() {
  const roleButtons = document.querySelectorAll('.recruiter-role-btn');
  const dynamicContainer = document.getElementById('overview-dynamic-content');

  if (!roleButtons.length) return;

  const activeRoleId = getRoleFromUrl();

  /**
   * Switches the active role profile with UI updates and subtle transition.
   *
   * @param {string} roleId - Target role ID
   * @param {boolean} [skipAnalytics=false] - Whether to skip telemetry dispatch
   */
  function selectRole(roleId, skipAnalytics = false) {
    const profile = ROLE_PROFILES[roleId];
    if (!profile) return;

    // 1. Update button styling & ARIA states
    roleButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-role') === roleId;
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      btn.setAttribute('tabindex', isTarget ? '0' : '-1');

      if (isTarget) {
        btn.className = 'recruiter-role-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border bg-indigo-600 text-white dark:bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-600/20 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900';
      } else {
        btn.className = 'recruiter-role-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border glass-card hover:bg-slate-200/70 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300/80 dark:border-slate-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900';
      }
    });

    // 2. Perform smooth transition update
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (dynamicContainer && !prefersReducedMotion) {
      dynamicContainer.classList.add('overview-fade-out');
      setTimeout(() => {
        renderRoleProfile(profile);
        dynamicContainer.classList.remove('overview-fade-out');
        dynamicContainer.classList.add('overview-fade-in');
        setTimeout(() => {
          dynamicContainer.classList.remove('overview-fade-in');
        }, 150);
      }, 100);
    } else {
      renderRoleProfile(profile);
    }

    // 3. Update URL parameter
    updateUrlRoleState(roleId);

    // 4. Optional analytics telemetry
    if (!skipAnalytics && typeof window.trackAnalyticsEvent === 'function') {
      try {
        window.trackAnalyticsEvent('recruiter_role_selected', { role: roleId });
      } catch (e) {
        // Silent failure for analytics
      }
    }
  }

  // Attach event handlers to role buttons
  const roleArray = Array.from(roleButtons);

  roleArray.forEach((btn, index) => {
    // Click listener
    btn.addEventListener('click', () => {
      const roleId = btn.getAttribute('data-role');
      if (roleId) selectRole(roleId);
    });

    // Accessible keyboard navigation (ArrowRight / ArrowLeft / Home / End)
    btn.addEventListener('keydown', (e) => {
      let targetIndex = -1;

      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % roleArray.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + roleArray.length) % roleArray.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = roleArray.length - 1;
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        const targetBtn = roleArray[targetIndex];
        const roleId = targetBtn.getAttribute('data-role');
        targetBtn.focus();
        if (roleId) selectRole(roleId);
      }
    });
  });

  // Handle popstate for browser Back/Forward buttons
  window.addEventListener('popstate', () => {
    const currentRole = getRoleFromUrl();
    selectRole(currentRole, true);
  });

  // Initial load execution
  selectRole(activeRoleId, true);
}
