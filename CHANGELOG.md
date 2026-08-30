# Changelog

## Unreleased

### Added — Lafẓ al-Jalālah highlighted in red, Ottoman-style page frame
- **Requested by a real user.** Every standalone occurrence of "الله" (Lafẓ al-Jalālah, incl. attached forms like بِٱللَّهِ, وَتَٱللَّهِ and the elided لِلَّهِ contraction) is now shown in red throughout the Quran section (Mushaf pages, the isolated ayah view, and search results) — `src/utils/arabic.js`'s new `splitAllahHighlights`, validated against every one of the ~6236 ayahs in the actual dataset: it matches all 11 real occurring forms and correctly excludes unrelated/differently-inflected look-alikes ("اللَّهُمَّ" the vocative dua opener, "اللَّهَب" the flame, "اللَّهْو" amusement, etc. — see the exhaustive data-driven test in `arabic.test.js`). Fixing this also closed a real, previously-undetected gap in the shared diacritic-stripping regex used by search normalization: the rub-el-hizb (۞) and place-of-sajdah (۩) section markers and the small waw/yeh letters weren't recognized as non-letter marks, so a "۞" glued directly to a word (as it is at a few Hizb-boundary points in the actual text, with no space) could throw off word-boundary matching.
- A decorative Ottoman-manuscript-style double-line border with a corner flourish in each corner (`src/components/quran/OttomanFrame.jsx`) now frames the Mushaf page text, in both the normal and fullscreen reading modes — built entirely from CSS + inline SVG (reusing the same flourish already used by `OrnateCard`), no external image asset needed.

### Changed — Mushaf swipe direction reversed to match Arabic reading order
- **Reported by a real user.** Swiping right now advances to the next page/ayah and swiping left goes back, instead of the other way around — matching how a printed Mushaf's pages actually turn (right to left, like any Arabic book), rather than the generic left-to-advance convention the feature originally shipped with.

### Changed — Quran pages: justified text like a printed Mushaf
- **Reported by a real user, with a reference screenshot from another Quran app.** Mushaf page text (`MushafPage.jsx`) is now `text-align: justify` instead of right-aligned, so wrapped lines reach both edges evenly like a printed Mushaf, matching the reference. On Safari/WebKit (what the reference screenshot's iOS device actually renders with) this already justifies Arabic script properly via CoreText's native kashida (letter-elongation) support, the same technique real Quran apps use. On Chromium/Android, `justify` only stretches inter-word spacing (no kashida support in Blink) — tried `text-justify: inter-character` as a Chromium-specific improvement, but confirmed it's silently ignored by this engine (never lands in the computed style), so it wasn't a real fix and was dropped; true kashida rendering everywhere would need page-specific glyph fonts, already a documented, deliberate limitation (see TODO.md).

### Changed — Home screen header logo now matches the app's actual logo
- **Reported by the app owner, with the real logo as a reference image.** Clarified after an initial miss: the intended target was the small logo at the top of the *home screen* (not the splash screen, which is back to how it looked before). The app's own 16-point rosette (the same shape already used for the app icon, the tap counter, and every `OrnateCard` corner — reused rather than inventing a new star, for visual consistency) now sits as a soft, blurred glow directly *behind* "ذكّر"/"DHAKKIR" in the home header, with the wordmark centered exactly on top of it — matching the reference logo's composition. Previously this header had a faint, barely-visible star centered on the whole header row (including the settings button), not on the word itself.

### Added — Quran (Mushaf): fullscreen reading mode and swipe navigation
- **Fullscreen/immersive mode**, aimed at readers with weak eyesight: a new button on the Mushaf page hides all of the app's surrounding chrome (its own header/page-jumper, and the app's outer logo header, section tabs and language switcher) down to just the page text and a minimal exit/font-size control bar, plus **adjustable text size** (persisted across visits) that can scale the Quran text up to roughly double its normal size.
- **Swipe left/right to turn the page** (`src/hooks/useSwipe.js`), in addition to the existing prev/next buttons, in both the normal and fullscreen reading modes.

### Added — Quran search now opens an isolated ayah view
- Tapping a search result no longer jumps straight into the middle of a Mushaf page. It now opens a new **single-ayah view** showing just that ayah, with **previous/next-ayah navigation** (walking sequentially across surah boundaries, swipe-enabled the same as the Mushaf reader) and a button to **view the same ayah within its real Mushaf page**, where it's now visually highlighted so it's easy to find on the page. The search box's typed query is preserved when navigating back from the ayah view instead of being cleared.

### Fixed — Fajr computed after Sunrise at real, populated latitudes
- **Reported by a real user:** Fajr was showing later than Sunrise. Root cause: in `computePrayerTimes`'s high-latitude fallback (used whenever the sun doesn't reach the configured Fajr angle below the horizon that day — which happens every summer at roughly 49-50°N and above with MWL's 18°, covering much of Canada, Germany, the Netherlands, Poland, and similar latitudes, not just the Arctic), the fallback offset's sign was backwards: `fajrH = sunriseH - 1.5` instead of `sunriseH + 1.5`. Because `fajr = dhuhrUTC - fajrH`, a *smaller* fajrH produces a *later* clock time — so the fallback placed Fajr 1.5h *after* sunrise instead of 1.5h before it. Fixed, and a regression test added (Berlin, June solstice, MWL) that reproduces the fallback path and asserts full chronological ordering — confirmed this test fails on the old code and passes on the fix.

### Changed — Adhkar reminders now follow real prayer times
- Morning/Evening/Sleep/Waking-up adhkar reminders (`src/data/categories.js`'s new `timeAnchor` field) now fire at the real, location-based Sunrise/Asr/Isha/Fajr times when the user has granted location access, instead of always using the fixed default clock times (05:00/17:00/21:00/06:00) regardless of season or where the user actually is. Falls back to the fixed times gracefully when location isn't available. Settings now explains which mode is active. Data-integrity test added confirming the anchors are valid and every anchored category still has a fixed fallback.

### Added — Quran (Mushaf)
- **A full Quran reading section**, restoring the "و القرآن الكريم" the original app's manifest advertised but whose source code was never actually present in this repository (confirmed by inspecting the previously-tracked `.aab`: it's a thin TWA wrapper around a hosted URL, containing no Quran code itself). New `src/data/quran/` (`pages.js`, `text.js`, `surahs.js`) built from two open-data npm packages via `scripts/build-quran-data.js`:
  - Real Mushaf-page browsing (604 pages, matching the King Fahd Complex Madani Mushaf layout used in most printed copies) with prev/next navigation and a "go to page" jumper.
  - A 114-surah index (Arabic name, transliteration, Meccan/Medinan, verse count, start page) to jump straight to any surah.
  - Word/partial-ayah search, tolerant of missing diacritics and Uthmani-script alef variants (`src/utils/arabic.js`'s `normalizeArabic`), with results linking straight to their page.
  - Automatically remembers and offers to resume the last page read (`localStorage`).
  - The ~1.3MB Arabic text dataset is dynamically `import()`-ed (a separate webpack chunk) and only downloaded when the Quran section is opened, so it doesn't affect the initial page load for anyone not using it.
- Data integrity verified with automated tests (`src/data/quran/quran.test.js`): exactly 604 pages and 6236 ayahs, every page-referenced ayah has matching text, each surah's ayahs run contiguously 1..N with no gaps, and Al-Fatihah/An-Nas correctly bookend the Mushaf — plus targeted manual verification (Ayat al-Kursi, Al-Ikhlas, and the last ayah of the Quran all spot-checked character-for-character correct).
- `src/utils/arabic.js` (`normalizeArabic`, `toEasternDigits`) with its own unit tests, including a documented, deliberate limitation around the Quranic "dagger alef" in search normalization (see TODO.md).
- Sources credited both in-app (Quran section footer) and in README, per their licenses (quran-json is CC-BY-4.0; the King Fahd Complex page-layout data ships under MIT via the `mushaf-engine` package).

### Fixed — Geolocation hang
- **The "Enable Location" request could hang forever with no error.** Reproduced directly: when the browser never resolves the geolocation permission prompt (silently denied, blocked by policy, or called from a restrictive embedded webview), neither the success nor the error callback of `getCurrentPosition` fires — not even past its own configured `timeout`. Fixed with a client-side watchdog in `useGeolocation` that always settles the request within 20s, plus distinct, accurate messaging for permission-denied vs. GPS-timeout vs. position-unavailable (previously all three showed the same "permission denied" message).

### Added — Prayer times
- **Prayer times (astronomical calculation).** New "Prayer Times" tab computes Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha entirely on-device from the user's geolocation (`src/utils/prayerTimes.js`), using standard low-precision solar-position equations (declination + equation of time) and the conventional hour-angle construction — no network call, no external API/key. Supports 5 calculation methods (MWL, ISNA, Egyptian, Umm al-Qura, Karachi) and both Asr conventions (Shafi/Maliki/Hanbali vs Hanafi), selectable from Settings, plus a live "next prayer" countdown. `useReminders` now also fires a notification at each computed prayer time when reminders are enabled and location is set.
- Validated the astronomical engine with 8 unit tests checking real invariants rather than hardcoded outputs: chronological ordering, ~12h day length at the equator in every season, sunrise/sunset symmetry around solar noon at the equinox, Hanafi Asr always later than standard, larger Isha angle -> later Isha, Umm al-Qura's fixed 90-minute Isha offset, graceful (non-throwing) fallback near the poles, and Mecca's Dhuhr landing in the expected clock-time window for its time zone. Cross-checked manually against a real device/timezone scenario (Cairo, Africa/Cairo, DST-aware) via an end-to-end browser smoke test.
- **Known limitation, documented rather than silently assumed:** the calculated instants are timezone-correct (real absolute moments), but their *display* relies on the device's own local timezone matching its physical location — true whenever coordinates come from the device's own geolocation (the only source this app uses), but not if the system clock's timezone is manually set to somewhere else. Times may also differ by a few minutes from official local tables that layer manual, committee-decided adjustments on top of pure astronomical calculation.

### Repo review fix-up

Full repository fix-up addressing every item from the initial `TODO.md` review.

#### Fixed
- **Broken build.** Moved `index.html` into `public/` and the app source into `src/` so `react-scripts` can find its required files (`npm run build` now succeeds; it previously failed unconditionally).
- **`typescript@7` pulled in transitively** by `react-scripts`' own optional tooling broke its ESLint/TypeScript integration during build (`Cannot read properties of undefined (reading 'Any')`). Pinned a compatible `typescript@^4.9.5` via `overrides` — this project has no TypeScript code, the pin only constrains react-scripts' internal tooling.
- Hardcoded Arabic `"< رجوع"` back-button label on the dhikr and category screens now respects the selected language.
- User progress (dhikr counters, completed state), language, "show translation", and the reminders toggle are now persisted to `localStorage` and restored on load — previously a page refresh silently erased all progress.
- Removed duplicate object keys in the adhkar data (`translit` was defined twice in several entries; the first value was silently discarded by the JS engine).
- Fixed encoding/spelling typos in the English hadith text (`tongü`, `Richneß`, `truthfulneß`, `righteousneß`, `forgiveneß`, `witneß`, `goodneß`, `helplessneß`, `dü` → tongue, Richness, truthfulness, righteousness, forgiveness, witness, goodness, helplessness, due).
- Removed dead code: an entirely unused `S` style object and duplicate `BG`/`GOLD`/`TEXT`/`CARD` constant declarations.
- **Counters displaying backwards in Arabic (RTL) mode**, e.g. progress showing "5 / 0" instead of "0 / 5", and the dhikr position showing "5 / 1" instead of "1 / 5". Cause: the Unicode bidi algorithm reorders digit/slash sequences inside an RTL-directed element. Fixed by isolating each `"X / Y"` counter with `direction: "ltr"` + `unicodeBidi: "isolate"`. Found via manual end-to-end testing while verifying this fix-up, not present in the original review.

#### Added
- `.gitignore` (`node_modules`, `build`, env files, OS cruft).
- `package-lock.json` for reproducible installs.
- A basic PWA `manifest.json` plus generated app icons (`public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).
- A best-effort in-app reminders feature (`src/hooks/useReminders.js`) that uses the previously-unused `time` field on adhkar categories to fire a browser Notification at the suggested time, opt-in from Settings. Note: this only fires while the app tab is open in the foreground — true background push would need a Service Worker + push backend, which is out of scope for this static SPA.
- Document direction/`lang` now switch dynamically between `rtl`/`ltr` based on the selected language, instead of being hardcoded to Arabic in `index.html`.
- `aria-label`s on icon-only buttons (settings gear, prev/next, tap-to-count) for basic accessibility.
- Unit tests (`react-scripts test`) covering the app's smoke render and the integrity of the adhkar/hadith data.
- GitHub Actions CI (`.github/workflows/ci.yml`) running `npm test` and `npm run build` on every push/PR.

#### Changed
- Split the single ~1300-line `App.jsx` into `src/data/*` (adhkar, hadiths, categories), `src/hooks/*`, and `src/components/*` (Splash, Settings, HomeView, CategoryView, DhikrView, HadithsSection, AdhkarGrid, plus shared `OrnateCard`/`Rosette`), with `src/App.jsx` as a thin orchestrator.

#### Removed
- The tracked Android App Bundle binary (`Dhakkir ذكّر .aab`, 3.2MB) — build artifacts should not live in source control. Rebuild it from the web app (e.g. via Bubblewrap/TWA) when a new release is needed, and publish it via GitHub Releases instead.
