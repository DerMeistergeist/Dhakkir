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
// without diacritics still matches text that has them. Built from
// explicit \uXXXX code points rather than pasted glyphs, which are easy
// to mis-copy inside a regex character class.
var DIACRITICS = new RegExp(
  "[" +
    "ً-ٟ" + // tanween, fatha..sukun, small vowel/hamza marks
    "ٰ" + // superscript alef
    "ۖ-ۜ" + // Quranic small high marks
    "۟-ۤ" + // Quranic small high/low marks
    "ۧ-ۨ" + // small high yeh / small high noon
    "۪-ۭ" + // empty centre / low marks, small low meem
    "]",
  "g"
);

var TATWEEL = /ـ/g; // ARABIC TATWEEL (ـ), a stretching character, not a letter

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
