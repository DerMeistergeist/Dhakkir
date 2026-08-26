import { normalizeArabic, toEasternDigits } from "./arabic";

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
