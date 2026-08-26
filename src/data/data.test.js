import { CATEGORIES, HADITH_CATS, ADHKAR, HADITHS } from "./index";

test("every adhkar category has at least one dhikr", () => {
  CATEGORIES.forEach((cat) => {
    expect(Array.isArray(ADHKAR[cat.id])).toBe(true);
    expect(ADHKAR[cat.id].length).toBeGreaterThan(0);
  });
});

test("every hadith category has at least one hadith", () => {
  HADITH_CATS.forEach((cat) => {
    expect(Array.isArray(HADITHS[cat.id])).toBe(true);
    expect(HADITHS[cat.id].length).toBeGreaterThan(0);
  });
});

test("every dhikr has arabic text and a positive repeat count", () => {
  Object.values(ADHKAR).forEach((list) => {
    list.forEach((d) => {
      expect(d.arabic).toBeTruthy();
      expect(d.count).toBeGreaterThan(0);
    });
  });
});
