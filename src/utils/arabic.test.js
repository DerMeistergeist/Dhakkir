import { normalizeArabic, splitAllahHighlights, toEasternDigits } from "./arabic";
import { TEXT } from "../data/quran/text";

test("toEasternDigits converts Western digits to Eastern Arabic-Indic numerals", () => {
  expect(toEasternDigits(0)).toBe("٠");
  expect(toEasternDigits(293)).toBe("٢٩٣");
  expect(toEasternDigits(604)).toBe("٦٠٤");
});

test("normalizeArabic strips diacritics and tatweel", () => {
  expect(normalizeArabic("بِسْمِ اللَّهِ")).toBe("بسم الله");
  expect(normalizeArabic("قَالَ")).toBe("قال");
});

test("normalizeArabic collapses alef variants, including the Quranic alef wasla", () => {
  expect(normalizeArabic("ٱللَّهِ")).toBe("الله");
  expect(normalizeArabic("أحمد")).toBe("احمد");
  expect(normalizeArabic("إبراهيم")).toBe("ابراهيم");
  expect(normalizeArabic("آدم")).toBe("ادم");
});

test("normalizeArabic lets a plain-typed query match Uthmani-script text", () => {
  var uthmani = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ";
  expect(normalizeArabic(uthmani)).toContain(normalizeArabic("بسم الله"));
});

test("normalizeArabic does not over-normalize: distinct letters stay distinct", () => {
  expect(normalizeArabic("الله")).not.toBe(normalizeArabic("اللة"));
});

describe("splitAllahHighlights", () => {
  function allahSegments(text) {
    return splitAllahHighlights(text).filter((s) => s.isAllah);
  }

  test("highlights the bare word, diacritics and all, without altering it", () => {
    // Al-Ikhlas 112:1
    var hits = allahSegments("قُلۡ هُوَ ٱللَّهُ أَحَدٌ");
    expect(hits.length).toBe(1);
    expect(hits[0].text).toBe("ٱللَّهُ");
  });

  test("highlights the elided lillah contraction (no alef)", () => {
    // Al-Fatihah 1:2
    var hits = allahSegments("ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ");
    expect(hits.length).toBe(1);
    expect(hits[0].text).toBe("لِلَّهِ");
  });

  test("highlights attached-preposition forms (بِٱللَّهِ)", () => {
    var hits = allahSegments("بِٱللَّهِ وَٱلۡيَوۡمِ ٱلۡأٓخِرِ");
    expect(hits.length).toBe(1);
    expect(hits[0].text).toBe("بِٱللَّهِ");
  });

  test("does NOT highlight اللَّهُمَّ (Allahumma) -- extra letters right after, no boundary", () => {
    var hits = allahSegments("ٱللَّهُمَّ إِنَّا نَسۡتَعِينُكَ");
    expect(hits.length).toBe(0);
  });

  test("recognizes the كَٱللَّهِ (ka-Allah) prefixed form, even though it happens not to occur in the Quran's actual text", () => {
    var hits = allahSegments("كَٱللَّهِ");
    expect(hits.length).toBe(1);
    expect(hits[0].text).toBe("كَٱللَّهِ");
  });

  test("concatenating every segment reproduces the original text exactly", () => {
    var samples = ["بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ", "ٱللَّهُمَّ", "لَآ إِلَـٰهَ إِلَّا ٱللَّهُ", "وَتَٱللَّهِ لَأَكِيدَنَّ أَصۡنَٰمَكُم"];
    samples.forEach((s) => {
      var rebuilt = splitAllahHighlights(s)
        .map((seg) => seg.text)
        .join("");
      expect(rebuilt).toBe(s);
    });
  });

  test("real data: every word containing الله/لله across the whole Quran is handled as expected", () => {
    // Regression-proofs the word list this function's design was actually
    // validated against (see the comment on splitAllahHighlights):
    // matches every genuine occurrence of Allah's name and none of the
    // unrelated/differently-inflected words that merely share a prefix.
    // "كالله" (ka-Allah) is a grammatically valid form the regex also
    // matches (see the dedicated test above), it just never happens to
    // occur in the Quran's actual text, so it isn't in this list.
    var expectedMatches = new Set(["الله", "بالله", "تالله", "فالله", "والله", "ءالله", "ابالله", "لله", "ولله", "فلله", "وتالله"]);
    var expectedExclusions = new Set(["اللهب", "اللهم", "اللهو", "خلله", "خللها", "خللهما", "ظلله", "ظللها", "للهدى", "وظللهم", "يضلله"]);
    var seenMatches = new Set();
    var seenExclusions = new Set();

    TEXT.forEach((surah) => {
      surah.forEach((ayah) => {
        var normalized = normalizeArabic(ayah);
        normalized.split(/\s+/).forEach((word) => {
          if (!word || (word.indexOf("الله") === -1 && word.indexOf("لله") === -1)) return;
          var hits = allahSegments(ayah).map((s) => normalizeArabic(s.text));
          if (hits.indexOf(word) !== -1) seenMatches.add(word);
          else seenExclusions.add(word);
        });
      });
    });

    expectedMatches.forEach((w) => expect(seenMatches.has(w)).toBe(true));
    expectedExclusions.forEach((w) => expect(seenExclusions.has(w)).toBe(true));
    // No word should land in both sets, and nothing beyond the known lists.
    expect([...seenMatches].sort()).toEqual([...expectedMatches].sort());
    expect([...seenExclusions].sort()).toEqual([...expectedExclusions].sort());
  });
});
