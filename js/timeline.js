/**
 * Career Timeline Disclosures Module.
 *
 * Handles expanding and collapsing professional timeline cards,
 * maintaining accessibility attributes, and updating toggle text/icons.
 *
 * @module timeline
 */

"use strict";

/**
 * Centralized data structure for Experience Timeline entries.
 */
export const EXPERIENCE_ENTRIES = [
  {
    id: "treg",
    startDate: "JUN 2024",
    endDate: "SEP 2025",
    title: "Senior Product Manager",
    organization: "Tree Roots Entertainment Group Co., Ltd. (TREG)",
    engagementType: "Entertainment & Tech",
    summary:
      "Translated deep-tech capabilities into marketable narratives driving adoption and engagement. Rescued flagship title releases and nurtured global strategic partnerships with Tencent, AMD, MIGU, and China Literature.",
    detailLabel: "Expand Ash Echoes Rescue & Strategic Partnerships",
    achievementsTitle: "Key Achievements & Impact",
    achievements: [
      "<strong>Ash Echoes Thailand Rescue</strong>: Took over post-signing under extreme time pressure with minimal infrastructure. Spearheaded setup of MNP, Google Analytics, CDN, official website, and third-party payment integration to reduce platform fees.",
      "<strong>Global Strategic Alliances</strong>: Nurtured partnerships with Tencent, AMD, MIGU, Fanshu, Noctua, and China Literature. Participated in ChinaJoy (Shanghai) to expand TREG's licensing and IP sourcing footprint.",
      "<strong>Platform Delivery</strong>: Finalized the <em>bondbond</em> community and commerce application across UX/UI teams, outsourced developers, and four business stakeholders.",
      '<strong>New Revenue Incubation</strong>: Incubated cross-industry "Idol Meeting" and "Trading" projects (RTE Squid, Kombucha) to explore non-gaming monetization models.',
    ],
    skillsTitle: "Tools & Skills",
    skills: [
      "Strategic Alliances (Tencent/AMD)",
      "AI-Assisted Localization",
      "IP Sourcing (ChinaJoy)",
      "Payment Gateway Integration",
    ],
    iconClass: "fas fa-gamepad",
    markerColor: "purple-600",
    textClass: "text-purple-600 dark:text-purple-400",
    badgeClass:
      "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
  },
  {
    id: "giantwhale",
    startDate: "MAY 2023",
    endDate: "FEB 2024",
    title: "Product Marketing Director & Lead Game Designer",
    organization: "Giant Whale Studio Co., Ltd.",
    engagementType: "Director Level",
    summary:
      "Led development and marketing for flagship game products, heading a 20-person cross-functional team across product, design, and marketing.",
    detailLabel: "Expand Details & Impact",
    achievementsTitle: "Key Achievements",
    achievements: [
      "Directed product positioning, branding, monetization models, multi-channel marketing, and release planning.",
      "<strong>Reduced project turnaround time by six months</strong> by aligning roadmap priorities and team delivery cadence.",
      "Enhanced game features and customer satisfaction by deploying robust player feedback mechanisms.",
    ],
    skillsTitle: "Tools",
    skills: [
      "Product Positioning",
      "Monetization Design",
      "Multi-Channel Marketing",
    ],
    iconClass: "fas fa-bullhorn",
    markerColor: "amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeClass:
      "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  },
  {
    id: "hotplay",
    startDate: "AUG 2022",
    endDate: "NOV 2022",
    title: "Technical Product Manager",
    organization: "HotPlay (Thailand) / NextPlay Technologies (NASDAQ: NXTP)",
    engagementType: "NASDAQ Entity",
    summary:
      "Led product roadmap and launch delivery for HotPlay ad-tech and gaming integration products with an engineering team of 15.",
    detailLabel: "Expand Details & UAT",
    achievementsTitle: "Key Achievements",
    achievements: [
      "Served as technical product lead, translating business goals into engineering specifications and UAT plans.",
      "Coordinated across engineering, product design, and QA to successfully deliver roadmap milestones.",
      "<strong>Achieved an 82% adoption rate</strong> during the open beta rollout of reward delivery products.",
    ],
    iconClass: "fas fa-laptop-code",
    markerColor: "blue-600",
    textClass: "text-blue-600 dark:text-blue-400",
    badgeClass:
      "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  },
  {
    id: "garena",
    startDate: "OCT 2015",
    endDate: "DEC 2021",
    title: "Product Lead (Publishing & Analytics)",
    organization: "Garena Online (Thailand) Co., Ltd. (Sea Limited, NYSE: SE)",
    engagementType: "NYSE Entity",
    summary:
      "Managed publishing teams of up to 40 across PC/Mobile flagship titles (Free Fire, Blade & Soul). Increased customer LTV by 151% and reduced delivery cycles from 14 to 5 days.",
    detailLabel: "Expand Analytics & Ops Impact",
    achievementsTitle: "Analytics & Multi-Role Impact",
    achievements: [
      "<strong>Product Strategy</strong>: Boosted revenue by 237.91% MoM (1527% YTD) and increased operational efficiency by 24%.",
      "<strong>Data Specialist</strong>: Built ML user classification models reducing acquisition costs by 85% for 100M+ users.",
      "<strong>IT Specialist</strong>: Managed offline game server networks (CentOS/NGINX/Redis/MySQL) saving &gt;$10M annually vs outsourcing.",
      "<strong>Localization Manager</strong>: Managed a team of 6 translators localizing English, Korean, and Chinese to Thai using CAT tools, saving over $1M per project.",
    ],
    iconClass: "fas fa-cubes",
    markerColor: "slate-600",
    textClass: "text-slate-500 dark:text-slate-400",
    badgeClass:
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
  },
  {
    id: "morethanfree",
    startDate: "JAN 2012",
    endDate: "DEC 2015",
    title: "Assistant IT Manager",
    organization: "More Than Free Co., Ltd. (Subsidiary of Bangkok Airways)",
    engagementType: "Aviation Subsidiary",
    summary:
      "Managed IT support systems, server setups, and network infrastructures for 100+ office users across three business units (duty-free retail & e-commerce).",
    detailLabel: "Expand Details & Infrastructure Setup",
    achievementsTitle: "Key Achievements & Responsibilities",
    achievements: [
      "Configured Cisco enterprise networking devices, managing VPN, NAS, SAN, firewalls, and cloud storage systems.",
      "<strong>Increased company productivity & profitability by 22%</strong> through strategic IT infrastructure improvements that streamlined workflows.",
    ],
    iconClass: "fas fa-network-wired",
    markerColor: "slate-600",
    textClass: "text-slate-500 dark:text-slate-400",
    badgeClass:
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
  },
  {
    id: "ananfactory",
    startDate: "JAN 2012",
    endDate: "DEC 2014",
    title: "IT Solutions Specialist",
    organization: "Anan Factory",
    engagementType: "",
    summary:
      "Administered company networks, mobile devices, and server configurations for 50+ users across 5 business units. Trained, scheduled, and supervised a technical team of 10+ technicians.",
    iconClass: "fas fa-tools",
    markerColor: "slate-600",
    textClass: "text-slate-500 dark:text-slate-400",
    badgeClass:
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
  },
  {
    id: "pirsquare",
    startDate: "JUN 2008",
    endDate: "DEC 2011",
    title: "Front End Developer",
    organization: "Pi R Square Co., Ltd. (formerly Pixage Studio)",
    engagementType: "",
    summary:
      "Designed and built user interfaces for websites and interactive media agencies using Flash and ActionScript 3.0. Visualized and presented 50+ UI/UX designs to align with stakeholders.",
    detailLabel: "Expand Graphic Projects",
    achievementsTitle: "Key Achievements & Impact",
    achievements: [
      "Developed over 10 Flash-based websites and completed 300+ graphic projects (infographics, ads).",
      "<strong>Increased client customer engagement metrics by over 30%</strong> through dynamic designs.",
    ],
    iconClass: "fas fa-code",
    markerColor: "slate-600",
    textClass: "text-slate-500 dark:text-slate-400",
    badgeClass:
      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
  },
];

/**
 * Centralized data structure for Consulting & R&D Timeline entries.
 */
export const CONSULTING_ENTRIES = [
  {
    id: "applied-ai-behavioral-researcher",
    startDate: "2026",
    endDate: "Present",
    title: "Applied AI & Behavioral Researcher",
    organization: "Independent AI R&D & Systems Architect",
    engagementType: "Independent Research",
    summary:
      "Researching applied AI systems that turn complex workflows into structured agentic processes, with emphasis on planning, verification, knowledge retrieval, user trust, adoption friction, and behavioral incentives.",
    detailLabel: "Expand Research Focus & Systems Work",
    achievementsTitle: "Research Focus & Systems Work",
    achievements: [
      "<strong>Behavioral Economics</strong>: Applied to trust and AI adoption.",
      "<strong>Agentic Pipelines</strong>: That plan, act, verify, and report.",
      "<strong>Evaluation Harnesses</strong>: Designed to test accuracy and failure modes.",
    ],
    skillsTitle: "Skills",
    skills: [
      "Agentic AI",
      "AI Evaluation",
      "Behavioral Technology",
      "RAG",
      "Workflow Automation",
    ],
    iconClass: "fas fa-robot",
    markerColor: "indigo-600",
    textClass: "text-indigo-600 dark:text-sky-400",
    badgeClass:
      "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
  },
  {
    id: "ai-it-consultant",
    startDate: "2025",
    endDate: "",
    title: "AI & IT Consultant",
    organization: "Freelance / Remote",
    engagementType: "Client Consulting",
    summary:
      "Designed and deployed AI-enabled workflows, automated marketing dashboards, and payment-operations improvements for international client projects.",
    detailLabel: "Expand Consulting Projects & Outcomes",
    achievementsTitle: "Core Projects & Outcomes",
    achievements: [
      "<strong>AI Localization</strong>: Reduced localization and translation overhead through AI-assisted workflows.",
      "<strong>Marketing Analytics</strong>: Developed reporting and telemetry synchronization for marketing dashboards.",
      "<strong>Payment Gateways</strong>: Improved payment and checkout workflows to reduce operational friction.",
    ],
    skillsTitle: "Skills",
    skills: [
      "AI Workflows",
      "Marketing Analytics",
      "Payment Gateways",
      "ETL",
      "Automation",
    ],
    iconClass: "fas fa-laptop",
    markerColor: "sky-500",
    textClass: "text-sky-600 dark:text-sky-400",
    badgeClass:
      "bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
  },
  {
    id: "product-data-localization-consultant",
    startDate: "2015",
    endDate: "2025",
    title: "Product, Data & Localization Consultant",
    organization: "Self-employed · Bangkok, Thailand",
    engagementType: "Independent Consulting",
    summary:
      "Delivered product advisory, automated data pipelines, audience-segmentation analysis, and localization workflows for international developers and digital-product teams.",
    detailLabel: "Expand Product, Data & Localization Work",
    achievementsTitle: "Core Services & Achievements",
    achievements: [
      "<strong>ETL Data Pipelines</strong>: Built ETL and reporting workflows producing approximately $3,000–$10,000 in savings per project.",
      "<strong>Audience Segmentation</strong>: Produced telemetry and audience-segmentation reporting.",
      "<strong>Cross-Border Localization</strong>: Supported cross-border game localization using established CAT workflows.",
    ],
    skillsTitle: "Skills",
    skills: [
      "Product Consulting",
      "Python",
      "SQL",
      "ETL",
      "Audience Segmentation",
      "Trados",
      "memoQ",
    ],
    iconClass: "fas fa-network-wired",
    markerColor: "emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  },
];

/**
 * Reusable timeline rendering function that constructs timeline HTML dynamically.
 *
 * @param {string} containerId - Target container element ID
 * @param {Array} entries - Timeline entry data objects
 * @param {string} variant - Timeline type variant ('employment' or 'consulting')
 */
export function renderTimeline(containerId, entries, variant) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className =
    "relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-36 space-y-10";

  let html = "";
  entries.forEach((entry) => {
    // Marker configuration
    let markerHtml = "";
    if (variant === "consulting") {
      markerHtml = `
        <div class="absolute -left-3.5 top-1.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-sky-400 flex items-center justify-center text-xs ring-4 ring-slate-50 dark:ring-slate-950 shadow-md border-2 border-indigo-600 dark:border-sky-400">
          <i class="${entry.iconClass || "fas fa-briefcase"}"></i>
        </div>
      `;
    } else {
      markerHtml = `
        <div class="absolute -left-3.5 top-1.5 w-7 h-7 rounded-full bg-${entry.markerColor || "slate-600"} text-white flex items-center justify-center text-xs ring-4 ring-slate-50 dark:ring-slate-950 shadow-md">
          <i class="${entry.iconClass || "fas fa-briefcase"}"></i>
        </div>
      `;
    }

    // Date range labels
    const dateTextClass =
      variant === "consulting"
        ? "text-indigo-600 dark:text-sky-400"
        : entry.textClass || "text-slate-500 dark:text-slate-400";
    const endDateHtml = entry.endDate
      ? `
      <span class="experience-date-separator">to</span>
      <span class="experience-date-end">${entry.endDate}</span>
    `
      : "";

    // Card background/borders
    const cardClasses =
      variant === "consulting"
        ? "glass-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm border-l-4 border-indigo-600 dark:border-sky-400"
        : "glass-card rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm";

    // Achievements disclosure content
    let achievementsHtml = "";
    if (entry.achievements && entry.achievements.length > 0) {
      const achTitleText =
        entry.achievementsTitle ||
        (variant === "consulting"
          ? "Key Contributions & Evidence"
          : "Key Achievements & Impact");
      const achItems = entry.achievements
        .map((ach) => `<li>${ach}</li>`)
        .join("");
      achievementsHtml = `
        <div>
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">${achTitleText}</h5>
          <ul class="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            ${achItems}
          </ul>
        </div>
      `;
    }

    // Skills chips
    let skillsHtml = "";
    if (entry.skills && entry.skills.length > 0) {
      const skillsTitleText = entry.skillsTitle || "Skills";
      const skillChips = entry.skills
        .map(
          (sk) => `
        <span class="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">${sk}</span>
      `,
        )
        .join("");
      skillsHtml = `
        <div>
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">${skillsTitleText}</h5>
          <div class="flex flex-wrap gap-1.5">
            ${skillChips}
          </div>
        </div>
      `;
    }

    // Accordion toggle button & details panel
    let toggleBtnHtml = "";
    let detailsPanelHtml = "";
    if (achievementsHtml || skillsHtml) {
      const detailsId = `timeline-details-${entry.id}`;
      toggleBtnHtml = `
        <button type="button" class="timeline-toggle flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:text-indigo-700 dark:hover:text-sky-300 transition-colors focus:outline-none" aria-expanded="false" aria-controls="${detailsId}">
          <span class="toggle-text">${entry.detailLabel || "Expand Details"}</span>
          <i class="toggle-icon fas fa-chevron-down text-xs transition-transform duration-300"></i>
        </button>
      `;
      detailsPanelHtml = `
        <div id="${detailsId}" class="timeline-details pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
          ${achievementsHtml}
          ${skillsHtml}
        </div>
      `;
    }

    html += `
      <div class="relative pl-6 sm:pl-10 timeline-card">
        ${markerHtml}
        <div class="sm:absolute sm:-left-40 sm:top-1 text-xs font-bold ${dateTextClass} uppercase tracking-wider mb-2 sm:mb-0 sm:text-right sm:w-32">
          <div class="experience-date-range">
            <span class="experience-date-start">${entry.startDate}</span>
            ${endDateHtml}
          </div>
        </div>
        <div class="${cardClasses}">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h4 class="font-display text-xl font-bold text-slate-900 dark:text-white">${entry.title}</h4>
              <p class="text-sm font-semibold ${variant === "consulting" ? "text-indigo-600 dark:text-sky-400" : entry.textClass || "text-slate-500 dark:text-slate-400"}">${entry.organization}</p>
            </div>
            ${
              entry.engagementType
                ? `
              <span class="px-3 py-1 rounded-full text-xs font-semibold ${variant === "consulting" ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800" : entry.badgeClass || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700"}">
                ${entry.engagementType}
              </span>
            `
                : ""
            }
          </div>
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">${entry.summary}</p>
          ${toggleBtnHtml}
          ${detailsPanelHtml}
        </div>
      </div>
    `;
  });

  wrapper.innerHTML = html;
  container.appendChild(wrapper);
}

/**
 * Initializes rendering of the experience and consulting timelines dynamically.
 */
export function initTimelineRendering() {
  renderTimeline(
    "experience-timeline-container",
    EXPERIENCE_ENTRIES,
    "employment",
  );
  renderTimeline(
    "consulting-timeline-container",
    CONSULTING_ENTRIES,
    "consulting",
  );
}

/**
 * Initializes interactive accordion disclosures on career timeline items.
 *
 * Purpose:
 * Binds click events to timeline expand/collapse buttons, toggles active class names
 * on card details, updates ARIA states, and changes text/chevron icons dynamically.
 *
 * Invocation:
 * Called once by initializeApplication() in app.js on DOMContentLoaded.
 *
 * DOM dependencies:
 * - Reads all elements matching `.timeline-toggle`.
 * - For each button:
 *   - Resolves closest `.timeline-card`.
 *   - Reads `.timeline-details` within the card.
 *   - Reads `.toggle-icon` and `.toggle-text` inside the button.
 *   - Updates `aria-expanded` status on the button.
 *   - Toggles 'open' class on the details container.
 *
 * Side effects:
 * Attaches click event listeners to timeline toggle buttons.
 * Stores original button text in `data-original-text` attribute for accurate restoration.
 *
 * Failure behavior:
 * Fails silently if no timeline toggle buttons are present in the DOM.
 *
 * Accessibility:
 * Correctly maintains `aria-expanded` state. Uses unique target IDs in the DOM
 * to satisfy W3C disclosure specifications (ARIA controls).
 *
 * @returns {void}
 */
export function initTimelineAccordion() {
  const toggleBtns = document.querySelectorAll(".timeline-toggle");
  if (!toggleBtns.length) return;

  // Initialize buttons with their original text so we can restore it on collapse
  toggleBtns.forEach((btn) => {
    const textSpan = btn.querySelector(".toggle-text");
    if (textSpan && !btn.hasAttribute("data-original-text")) {
      btn.setAttribute("data-original-text", textSpan.textContent.trim());
    }

    // Attach click listener
    btn.addEventListener("click", () => {
      const card = btn.closest(".timeline-card");
      if (!card) return;

      const details = card.querySelector(".timeline-details");
      if (!details) return;

      const icon = btn.querySelector(".toggle-icon");
      const textSpan = btn.querySelector(".toggle-text");

      const isOpen = details.classList.contains("open");

      if (isOpen) {
        // Collapse
        details.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");

        if (icon) {
          icon.className =
            "toggle-icon fas fa-chevron-down text-xs transition-transform duration-300";
        }
        if (textSpan) {
          const originalText =
            btn.getAttribute("data-original-text") || "Expand Details";
          textSpan.textContent = originalText;
        }
      } else {
        // Expand
        details.classList.add("open");
        btn.setAttribute("aria-expanded", "true");

        if (icon) {
          icon.className =
            "toggle-icon fas fa-chevron-up text-xs transition-transform duration-300";
        }
        if (textSpan) {
          textSpan.textContent = "Collapse Details";
        }
      }
    });
  });
}
