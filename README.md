# Klao Thongchan — Technical Product & Applied AI

The professional portfolio and printable CV of **Thongchan Thananate (Klao)**, covering technical product delivery, applied AI, analytics, integrations, and digital product launches.

**Production release: v1.3.1 · 3 November 2026**

- [Live portfolio](https://klao-thongchan.github.io/)
- [Curriculum vitae](https://klao-thongchan.github.io/cv/)
- [Test environment](https://klao-thongchan.github.io/test/)

## What’s in the portfolio

- A concise introduction, career snapshot, and contact actions.
- Selected projects with business context, responsibilities, outcomes, and expandable walkthroughs.
- Hiring perspectives for Engineering & Solutions and Product & Delivery, shareable through the `role` query parameter.
- Experience, capabilities, education, credentials, and languages.
- Light and dark themes, with separate production and test preferences.
- A printable CV with a native browser print / save-as-PDF action.
- A cursor-responsive Three.js contour background behind the introduction.

## Background performance

The contour field uses one draw call, 1,664 vertices, and 1,638 line segments. It renders at up to 30 fps only while responding to movement and stops once settled or offscreen. Its drawing buffer is capped at 720,000 pixels, with no textures, lighting, post-processing, or multisampling. Hidden tabs and page exits release graphics resources.

Three.js is loaded locally after startup only on eligible fine-pointer devices. Reduced-motion preferences, touch-only devices, Save-Data, reported memory of 2 GiB or less, and unavailable WebGL use a static CSS fallback. These limits reduce the effect’s work; total browser memory use varies by device and browser.

The pinned dependency is Three.js 0.180.0, built with esbuild 0.25.9: approximately 474 KiB uncompressed (119 KiB gzip). See [dependency and rebuild notes](js/vendor/README.md) and the [MIT license](js/vendor/THREE-LICENSE.txt).

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Production portfolio content and metadata |
| `css/portfolio.css` | Active portfolio layout, themes, responsive styles, and background |
| `js/app.js` | Theme controls, hiring perspectives, and project anchors |
| `js/cursor-field.js` | Optional Three.js field and rendering lifecycle |
| `js/vendor/` | Local Three.js bundle, license, and build instructions |
| `js/theme.js`, `js/utilities.js` | Preferences, copyright year, and release footer |
| `cv/` | Printable CV, styles, and print controls |
| `test/` | Isolated preview of the portfolio, CV, and staging architecture |
| `edge/` | Reverse-proxy ingress (NGINX) and Cloudflare Worker edge inspection |
| `services/` | Node.js 22 LTS microservices, stateless HMAC auth, schema validation, and database engine |
| `specs/` | Architectural specifications for Phases 0 through 4 (LTS migration, threat models, runbooks) |
| `version.json`, `test/version.json` | Independent release versions |
| `scripts/generate-version.js` | Build date, commit, and environment metadata |
| `verify_prod.js`, `test/verify.js` | Asset, reference, and environment checks |
| `scripts/verify-cursor-field.html` | Browser-based rendering lifecycle checks |

The active portfolio uses static HTML, custom CSS, and native JavaScript modules; no framework or runtime CSS compiler is needed. Existing Tailwind assets, older feature modules, Jekyll layouts, and posts remain in the repository for historical content. The portfolio entrypoint does not load those legacy modules. The CV retains its existing Google Analytics, font, and icon integrations; the portfolio page loads only local resources.

## Local preview and checks

From the repository root:

```sh
python3 -m http.server 8000
```

Open [production locally](http://localhost:8000/) or [test locally](http://localhost:8000/test/).

Before releasing:

```sh
node scripts/generate-version.js
node verify_prod.js
node test/verify.js
node --check js/app.js
node --check js/cursor-field.js
```

Open `/scripts/verify-cursor-field.html` on the local server in an active desktop WebGL2 browser with reduced motion disabled. The harness checks canvas creation, cursor response, the frame budget, idle and offscreen pauses, the pixel budget, and cleanup. Also inspect light/dark themes, narrow layouts, project disclosures, role selection, and CV printing.

## Production and test separation

Production uses `klao:prod:theme`; test uses `klao:test:theme`. Test pages retain their preview label and `noindex, nofollow, noarchive` metadata. `robots.txt` excludes `/test/`. Production pages have canonical URLs and allow indexing.

The production `robots.txt` also publishes the shared `__usage_ai-training` preference token. Its `Disallow: /` signals that production content should not be used to train generative AI models while leaving normal crawling and search indexing controls separate. Provider support is being rolled out independently, so existing provider-specific crawler rules should be retained where applicable.

To promote a future test release, copy its portfolio and CV assets to their production paths, adjust favicon paths, remove the preview label and its JavaScript dependency, apply production theme keys and indexing metadata, and update `version.json`, `sitemap.xml`, and this README. Generate version metadata and run both verification scripts before pushing. Keep `test/version.json` independent for the next preview.

## Deployment

GitHub Pages currently publishes the repository root from the `main` branch (branch-based Pages deployment). The root `.nojekyll` permits direct static publication. Pushing `main` triggers the configured Pages build; verify its completion and check the live portfolio and CV.

A historical Jekyll Actions workflow remains under `.github/workflows/pages.yml`; it is not the currently configured Pages publishing mode. For branch-based releases, generate and commit version metadata before pushing. The displayed commit identifies the source revision used when generating metadata.

## Version History

### v1.3.1 — Shared AI training preference
**Release date:** 3 November 2026

- Added the shared `__usage_ai-training` robots.txt preference for production content.
- Documented that the preference is voluntary, controls training use rather than crawling or traditional search indexing, and is being adopted by providers on different timelines.

### v1.3.0 — Architecture modernization: PHP replacement, Edge Ingress & LTS transition
**Release date:** 22 October 2026

- **Phase 0 (Threat Modeling & Inventory):** Audited environment and certified zero-PHP runtime immunity against CGI Argument Injection (CVE-2024-4577) and PHP2Shell (CVE-2026-109618 / CVE-2026-109619). Cataloged active runtime modules and identified legacy structures for scheduled retirement (`specs/phase0-inventory.json`).
- **Phase 1 (Edge Façade & Zero-Trust Ingress):** Configured edge reverse-proxy (`edge/nginx-ingress.conf`) and Cloudflare Worker script (`edge/cloudflare-worker.js`) to intercept CGI argument injection signatures (`-d+allow_url_include`) and drop legacy automated scans (`.php`, `/wp-admin`, `/xmlrpc.php`) before origin processing. Added zero-script isolated 404 handler (`test/404.html`) and enforced strict headers.
- **Phase 2 (Core Services & Container Hardening):** Replaced legacy PHP session handling and unvalidated mailers with modern Node.js 22 LTS microservices (`services/server.js`). Implemented stateless HMAC-SHA256 tokens (`signToken`/`verifyToken`), strict schema validation with prototype pollution guards, and cryptographic webhook verification. Added non-root, read-only multi-stage Docker configurations (`services/Dockerfile`, `services/docker-compose.yml`).
- **Phase 3 (Data Layer Modernization & Cutover):** Transitioned from legacy raw SQL concatenation to strictly parameterized prepared statements using Node.js 22 LTS SQLite (`services/data/db.js`), guaranteeing SQL injection immunity. Added automated shadow data consistency verification helper (`verifyShadowDataConsistency`) to support zero-drift cutovers.
- **Phase 4 (Legacy Decommissioning & LTS Governance):** Documented full PHP runtime host power-down procedures and quarterly/annual LTS upgrade policies (`specs/phase4-decommission-spec.json`). Cleanly archived unreferenced legacy assets (`tailwind.config.js`, legacy Tailwind CSS, and older navigation scripts) into `test/legacy_archive/` with full historical manifests.
- **Verification & Metadata:** Integrated in-process unit, security, and schema test suites across `verify_prod.js` and `test/verify.js`. Bumped production release to `v1.3.0` and test preview to `v1.3.1`.

### v1.2.1 — Security audit and test environment synchronization
**Release date:** 22 October 2026

- **Security review & hardening:** Assessed production and test environments against recent PHP engine exploits (PHP2Shell CVE-2026-109618 / CVE-2026-109619 and CGI Argument Injection CVE-2024-4577). Confirmed environment immunity as a purely static site with zero PHP runtimes, interpreters, SAPIs, or scripts. Verified Content Security Policy headers (`form-action 'none'`, `object-src 'none'`, `script-src 'self'`) and hardened static 404 routing against automated bot scans.
- **Test environment synchronization:** Reverted test preview portfolio files (`test/index.html`, `test/css/portfolio.css`, `test/js/app.js`) to match production structure and hiring perspectives, while preserving test-specific isolation (preview banner, `noindex, nofollow, noarchive` robots directives, and isolated `klao:test:theme` preferences).
- **Metadata and version bump:** Updated release versions across production (`version.json`) and test (`test/version.json`) to `v1.2.1`, and regenerated build metadata.

### v1.2.0 — Portfolio and interactive background release
**Release date:** 14 September 2026

- Promoted the test portfolio and CV assets to production.
- Introduced hiring perspectives, project walkthroughs, and the refreshed green visual theme.
- Added the lightweight cursor-responsive Three.js contour field with rendering and accessibility safeguards.
- Separated production theme preferences, removed preview UI, and updated canonical URLs, indexing metadata, and sitemap dates.
- Updated release metadata, production verification, and this README to describe the active site.



### v1.1.0 — Portfolio Promotion Release
**Release Date:** 22 August 2026

#### Changed
- Promoted the validated Test portfolio implementation to Production.
- Simplified the Overview into a concise positioning statement, two primary actions, three quantified proof points, and a recruiter-focused career snapshot.
- Updated Production navigation, timeline rendering, analytics, responsive styling, and CV assets to match Test.
- Standardized Overview metric cards on the shared glass-card treatment with supported internal padding.
- Incremented release metadata across Production and Test to `1.1.0`.

---

### v1.0.4 — CV Update Release
**Release Date:** 18 July 2026

#### Changed
- Redesigned printable CV layout from 3 pages to 2 pages to align with updated physical resume.
- Updated all professional experience history, roles, taglines, and bullet points.
- Refactored contact grid layout to support 5 responsive items, adding LinkedIn and Website links, and removing Medium link.
- Incremented release version across production and test environments to `1.0.4`.

---

### v1.0.3 — Technical Documentation Release
**Release Date:** 18 July 2026

#### Added
- Complete project-specific technical documentation replacement for `README.md`.
- Architecture overview and Mermaid systems interaction diagram.
- Active technology-stack specifications and source file mappings.
- ES-module frontend architecture layout.
- Detailed Google Analytics 4 tracking specifications and privacy safeguards.
- CSP constraints and security model configurations.
- Directory tree mapping active, generated, and legacy components.
- Local development workflow documentation and verification checklist.

#### Fixed
- Restored missing `css/tailwind.css` to the production environment directory.
- Integrated `css/tailwind.css` verification checks inside `verify_prod.js`.

#### Changed
- Replaced the inherited Adam Blog theme README.
- Incremented release version across production and test environments to `1.0.3`.

---

### v1.0.2 — Version & Text Sync
**Release Date:** 18 July 2026

#### Added
- Added custom dynamic version metadata indicators in footers.
- Version generator build script `scripts/generate-version.js`.

#### Changed
- Incremented site release version to `1.0.2`.

---

### v1.0.1 — Security and Layout Hardening
**Release Date:** 18 July 2026

#### Added
- Integrated strict Content Security Policy (CSP) headers.
- Implemented Referrer-Policy configurations.
- Audited external links for `noopener noreferrer` tags.
- Programmatic staging security checking script `test/verify.js`.

---

## R. Attribution and Licensing

* **License:** The portfolio content and custom source code are licensed under the [GNU General Public License v3.0](LICENSE).
* **Attribution:** This codebase was historically derived from the [Adam Blog 2.0 Jekyll Theme](https://github.com/the-mvm/the-mvm.github.io) by Armando Maynez, based on [Adam Blog 1.0](https://github.com/artemsheludko/adam-blog) by Artem Sheludko. Legacy layout components are preserved in compliance with original theme licensing terms.
