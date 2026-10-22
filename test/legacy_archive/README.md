# Legacy Archive (Retired in Phase 4)

This directory preserves deprecated, unreferenced assets from earlier site versions for audit and historical continuity.

## Retired Asset Manifest

| Path | Original Category | Retirement Reason |
| :--- | :--- | :--- |
| `tailwind.config.js` | Build Configuration | Superseded by native CSS tokens in `css/portfolio.css`. |
| `css/tailwind.css` | Generated CSS | Replaced by bespoke layout styles; eliminated runtime compiler/build step. |
| `css/tailwind-input.css` | Source CSS | Replaced by bespoke layout styles. |
| `css/site.css` | Legacy Theme | Consolidated into `portfolio.css`. |
| `css/components.css` | Legacy Components | Consolidated into modern native disclosures and layout classes. |
| `css/print.css` | Legacy Print CSS | Consolidated into media query print rules in `cv/css/cv.css`. |
| `js/navigation.js` | Legacy Navigation | Replaced by native HTML anchor links and CSS sticky headers. |
| `js/timeline.js` | Legacy Timeline UI | Replaced by modern semantic case cards and disclosure elements. |
| `js/project-filter.js` | Legacy Filter Scripts | Replaced by native URL query parameters (`?role=...`). |
| `js/recruiter-view.js` | Legacy Recruiter Modal | Replaced by modern hiring perspective pills in `js/app.js`. |

These assets are not loaded or imported by any active page in the staging or production environments.
