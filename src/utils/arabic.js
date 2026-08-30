var EASTERN_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// Converts a non-negative integer to Eastern Arabic-Indic numerals, used
// for ayah/page numbers to match traditional Mushaf typesetting.
export function toEasternDigits(n) {
  return String(n)
    .split("")
    .map(function (c) {
      return /[0-9]/.test(c) ? EASTERN_DIGITS[+c] : c;
    })
    .join("");
}

// Diacritics (tashkeel: fatha/damma/kasra/tanween/shadda/sukun/etc.) and
// Quranic small-sign marks -- stripped for search so a query typed
// without diacritics still matches text that has them.
var DIACRITICS = new RegExp(
  "[" +
    "ً-ٟ" + // tanween, fatha..sukun, small vowel/hamza marks
    "ٰ" + // superscript alef
    // U+06D6-U+06ED as one span: the whole "Quranic annotation signs"
    // sub-block (small high/low pause & recitation marks) *plus* the
    // rub-el-hizb (۞) and place-of-sajdah (۩) section markers and the
    // small waw/yeh letters -- all of it decorative/typographic, never a
    // real letter of the word it's attached to. Found missing (as a
    // fragmented set of sub-ranges that left a couple of gaps) via a
    // real Quran-text bug: a rub-el-hizb mark glued directly to "الله"
    // with no space kept it from being recognized as that standalone
    // word -- see splitAllahHighlights and its test.
    "ۖ-ۭ" +
    "]",
  "g"
);

var TATWEEL = /ـ/g; // ARABIC TATWEEL (ـ), a stretching character, not a letter

// Non-global copies for single-character .test() calls below -- reusing
// a "g"-flagged regex with .test() is stateful (it advances lastIndex
// between calls) and would silently skip characters.
var IS_DIACRITIC = new RegExp(DIACRITICS.source);
var IS_ALEF_VARIANT = /[آأإٱ]/;

// Normalizes text for forgiving Arabic search: strips diacritics/tatweel
// and collapses alef variants (including the Quranic alef wasla "ٱ") to a
// plain alef, so searching "الله" matches the Uthmani-script "ٱللَّهِ".
//
// Known limitation: the superscript/"dagger" alef (ٰ, U+0670) is stripped
// as a diacritic here rather than converted to a full alef. This is
// correct for the Quran's most common words (e.g. الرحمن/الرحيم, whose
// standard spelling has no separate alef letter there), but a smaller
// set of words use tatweel+dagger-alef as the Uthmani stand-in for a
// full alef that *does* appear in the modern spelling -- search for
// those exact words may occasionally miss a match. Resolving this fully
// needs a curated word-form table, which is out of scope here.
export function normalizeArabic(text) {
  if (!text) return "";
  return text
    .replace(DIACRITICS, "")
    .replace(TATWEEL, "")
    .replace(/[آأإٱ]/g, "ا") // آ,أ,إ,ٱ -> ا
    .trim();
}

// Matches a standalone occurrence of "الله" (Lafẓ al-Jalālah), with or
// without an attached و/ف conjunction stacked on top of a ب/ك/ت/ء/ا
// preposition or interrogative hamza (والله، بالله، تالله، فالله،
// كالله، ءالله، وتالله، أَبِٱللَّهِ...), once diacritics/tatweel are
// stripped and alef variants are normalized to a plain alef.
var ALLAH_WORD = /^ا?[وف]?[بكتء]?الله$/;
// The elided "لِلَّهِ" (li-Allah) contraction -- spelled with only one
// extra lam and *no* alef (a genuine, lexicalized exception, not a typo)
// -- optionally with a further attached و/ف (وَلِلَّهِ، فَلِلَّهِ).
var LILLAH_WORD = /^[وف]?لله$/;

/**
 * Splits `text` into segments so a caller can render each standalone
 * occurrence of Allah's name in a different style (e.g. red), while
 * every other character -- including the diacritics attached to the
 * matched word itself -- passes through completely unchanged.
 *
 * Matching is done on a diacritic-stripped, alef-normalized "skeleton"
 * of `text` built with a position map back to the original string, so a
 * match found on the skeleton can be translated into the exact
 * (diacritic-bearing) original substring to highlight.
 *
 * Deliberately excludes words that merely *start* with the same letters
 * but continue without a break -- "اللَّهُمَّ" (Allahumma, the vocative
 * dua opener), "اللَّهْو" (amusement), "اللَّهَب" (the flame) -- since a
 * real attached preposition/conjunction never adds letters *after* the
 * matched word. Verified against the actual Quran text dataset (every
 * distinct word containing "الله"/"لله" across all 6236 ayahs): every
 * word this matches is a genuine occurrence of Allah's name (11 forms
 * actually occurring in the text: الله بالله تالله فالله والله ءالله
 * ابالله لله ولله فلله وتالله -- "كالله" is also matched, matching real
 * Arabic grammar, it just never happens to occur in the Quran's own
 * wording), and every excluded word is a real, unrelated word -- see
 * arabic.test.js.
 */
export function splitAllahHighlights(text) {
  if (!text) return [{ text: text || "", isAllah: false }];

  var skeletonChars = [];
  var skeletonIndices = []; // skeletonChars[i] came from text[skeletonIndices[i]]
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (IS_DIACRITIC.test(ch) || ch === "ـ") continue;
    skeletonChars.push(IS_ALEF_VARIANT.test(ch) ? "ا" : ch);
    skeletonIndices.push(i);
  }
  var skeleton = skeletonChars.join("");

  var segments = [];
  var lastEnd = 0; // index into the ORIGINAL text already emitted
  var wordRe = /\S+/g;
  var m;
  while ((m = wordRe.exec(skeleton))) {
    var word = m[0];
    if (!ALLAH_WORD.test(word) && !LILLAH_WORD.test(word)) continue;
    var origStart = skeletonIndices[m.index];
    var origEnd = skeletonIndices[m.index + word.length - 1] + 1; // exclusive
    // Extend past any diacritics trailing the word's last letter (e.g. the
    // final kasra of "لِلَّهِ") -- they aren't skeleton characters, so
    // without this the highlighted span would silently drop them.
    while (origEnd < text.length && (IS_DIACRITIC.test(text[origEnd]) || text[origEnd] === "ـ")) origEnd++;
    if (origStart > lastEnd) segments.push({ text: text.slice(lastEnd, origStart), isAllah: false });
    segments.push({ text: text.slice(origStart, origEnd), isAllah: true });
    lastEnd = origEnd;
  }
  if (lastEnd < text.length) segments.push({ text: text.slice(lastEnd), isAllah: false });
  return segments.length ? segments : [{ text: text, isAllah: false }];
}
