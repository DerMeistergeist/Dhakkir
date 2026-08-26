# Changelog

## Unreleased

Full repository fix-up addressing every item from the initial `TODO.md` review.

### Fixed
- **Broken build.** Moved `index.html` into `public/` and the app source into `src/` so `react-scripts` can find its required files (`npm run build` now succeeds; it previously failed unconditionally).
- **`typescript@7` pulled in transitively** by `react-scripts`' own optional tooling broke its ESLint/TypeScript integration during build (`Cannot read properties of undefined (reading 'Any')`). Pinned a compatible `typescript@^4.9.5` via `overrides` — this project has no TypeScript code, the pin only constrains react-scripts' internal tooling.
- Hardcoded Arabic `"< رجوع"` back-button label on the dhikr and category screens now respects the selected language.
- User progress (dhikr counters, completed state), language, "show translation", and the reminders toggle are now persisted to `localStorage` and restored on load — previously a page refresh silently erased all progress.
- Removed duplicate object keys in the adhkar data (`translit` was defined twice in several entries; the first value was silently discarded by the JS engine).
- Fixed encoding/spelling typos in the English hadith text (`tongü`, `Richneß`, `truthfulneß`, `righteousneß`, `forgiveneß`, `witneß`, `goodneß`, `helplessneß`, `dü` → tongue, Richness, truthfulness, righteousness, forgiveness, witness, goodness, helplessness, due).
- Removed dead code: an entirely unused `S` style object and duplicate `BG`/`GOLD`/`TEXT`/`CARD` constant declarations.
- **Counters displaying backwards in Arabic (RTL) mode**, e.g. progress showing "5 / 0" instead of "0 / 5", and the dhikr position showing "5 / 1" instead of "1 / 5". Cause: the Unicode bidi algorithm reorders digit/slash sequences inside an RTL-directed element. Fixed by isolating each `"X / Y"` counter with `direction: "ltr"` + `unicodeBidi: "isolate"`. Found via manual end-to-end testing while verifying this fix-up, not present in the original review.

### Added
- `.gitignore` (`node_modules`, `build`, env files, OS cruft).
- `package-lock.json` for reproducible installs.
- A basic PWA `manifest.json` plus generated app icons (`public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).
- A best-effort in-app reminders feature (`src/hooks/useReminders.js`) that uses the previously-unused `time` field on adhkar categories to fire a browser Notification at the suggested time, opt-in from Settings. Note: this only fires while the app tab is open in the foreground — true background push would need a Service Worker + push backend, which is out of scope for this static SPA.
- Document direction/`lang` now switch dynamically between `rtl`/`ltr` based on the selected language, instead of being hardcoded to Arabic in `index.html`.
- `aria-label`s on icon-only buttons (settings gear, prev/next, tap-to-count) for basic accessibility.
- Unit tests (`react-scripts test`) covering the app's smoke render and the integrity of the adhkar/hadith data.
- GitHub Actions CI (`.github/workflows/ci.yml`) running `npm test` and `npm run build` on every push/PR.

### Changed
- Split the single ~1300-line `App.jsx` into `src/data/*` (adhkar, hadiths, categories), `src/hooks/*`, and `src/components/*` (Splash, Settings, HomeView, CategoryView, DhikrView, HadithsSection, AdhkarGrid, plus shared `OrnateCard`/`Rosette`), with `src/App.jsx` as a thin orchestrator.

### Removed
- The tracked Android App Bundle binary (`Dhakkir ذكّر .aab`, 3.2MB) — build artifacts should not live in source control. Rebuild it from the web app (e.g. via Bubblewrap/TWA) when a new release is needed, and publish it via GitHub Releases instead.
