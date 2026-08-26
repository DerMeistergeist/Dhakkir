import { PAGES, TEXT, SURAHS } from "./index";

test("604 Mushaf pages, matching the standard King Fahd Complex layout", () => {
  expect(PAGES.length).toBe(604);
});

test("114 surahs with correct total ayah/verse count (6236)", () => {
  expect(SURAHS.length).toBe(114);
  var totalFromSurahs = SURAHS.reduce((sum, s) => sum + s.totalVerses, 0);
  expect(totalFromSurahs).toBe(6236);
});

test("every ayah referenced by the page layout has matching text", () => {
  var seen = 0;
  PAGES.forEach((page) => {
    page.forEach(([sura, ayah]) => {
      expect(TEXT[sura - 1]).toBeDefined();
      expect(TEXT[sura - 1][ayah - 1]).toEqual(expect.any(String));
      expect(TEXT[sura - 1][ayah - 1].length).toBeGreaterThan(0);
      seen++;
    });
  });
  expect(seen).toBe(6236);
});

test("page layout is contiguous and in order: each surah's ayahs run 1..N with no gaps", () => {
  var expected = {}; // sura -> next expected ayah number
  SURAHS.forEach((s) => (expected[s.id] = 1));
  PAGES.forEach((page) => {
    page.forEach(([sura, ayah]) => {
      expect(ayah).toBe(expected[sura]);
      expected[sura] = ayah + 1;
    });
  });
  SURAHS.forEach((s) => {
    expect(expected[s.id]).toBe(s.totalVerses + 1);
  });
});

test("each surah's recorded start page matches where its ayah 1 actually appears in the page layout", () => {
  SURAHS.forEach((s) => {
    var page = PAGES[s.startPage - 1];
    var hasAyah1 = page.some(([sura, ayah]) => sura === s.id && ayah === 1);
    expect(hasAyah1).toBe(true);
  });
});

test("Al-Fatihah occupies page 1 and An-Nas ends on page 604", () => {
  expect(SURAHS[0].startPage).toBe(1);
  var lastEntry = PAGES[603][PAGES[603].length - 1];
  expect(lastEntry).toEqual([114, 6]);
});

test("At-Tawbah (9) is the only surah without a Bismillah convention in this app's renderer logic", () => {
  // Sanity check on the data this logic relies on: surah 9 exists with the
  // expected id/verse count so MushafPage's `sura !== 9` special-case
  // stays correct if the data source is ever regenerated.
  expect(SURAHS[8].id).toBe(9);
  expect(SURAHS[8].totalVerses).toBe(129);
});
