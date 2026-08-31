import { PAGES } from "./pages";
import { PAGE_JUZ, PAGE_HIZB } from "./juzHizb";

test("604 entries, one Juz'/Hizb per Mushaf page", () => {
  expect(PAGE_JUZ.length).toBe(604);
  expect(PAGE_HIZB.length).toBe(604);
});

test("starts at Juz 1 / Hizb 1, ends at Juz 30 / Hizb 60", () => {
  expect(PAGE_JUZ[0]).toBe(1);
  expect(PAGE_HIZB[0]).toBe(1);
  expect(PAGE_JUZ[603]).toBe(30);
  expect(PAGE_HIZB[603]).toBe(60);
});

test("every value is in range and all 30 Juz'/60 Hizb are represented", () => {
  PAGE_JUZ.forEach((j) => {
    expect(j).toBeGreaterThanOrEqual(1);
    expect(j).toBeLessThanOrEqual(30);
  });
  PAGE_HIZB.forEach((h) => {
    expect(h).toBeGreaterThanOrEqual(1);
    expect(h).toBeLessThanOrEqual(60);
  });
  expect(new Set(PAGE_JUZ).size).toBe(30);
  expect(new Set(PAGE_HIZB).size).toBe(60);
});

test("both only ever increase (or stay the same) as pages advance -- never go backwards", () => {
  for (var i = 1; i < PAGE_JUZ.length; i++) {
    expect(PAGE_JUZ[i]).toBeGreaterThanOrEqual(PAGE_JUZ[i - 1]);
    expect(PAGE_HIZB[i]).toBeGreaterThanOrEqual(PAGE_HIZB[i - 1]);
  }
});

test("Hizb is structurally consistent with Juz (each Juz spans exactly Hizb 2j-1 and 2j)", () => {
  PAGE_JUZ.forEach((juz, i) => {
    var hizb = PAGE_HIZB[i];
    expect([2 * juz - 1, 2 * juz]).toContain(hizb);
  });
});

test("well-known Juz boundaries land on the expected page: Juz 2 at 2:142, Juz 30 ('Amma') at 78:1", () => {
  var juz2Page = PAGES.findIndex(function (page) {
    return page[0][0] === 2 && page[0][1] === 142;
  });
  var juz30Page = PAGES.findIndex(function (page) {
    return page[0][0] === 78 && page[0][1] === 1;
  });
  expect(juz2Page).toBeGreaterThanOrEqual(0);
  expect(juz30Page).toBeGreaterThanOrEqual(0);
  expect(PAGE_JUZ[juz2Page]).toBe(2);
  expect(PAGE_JUZ[juz30Page]).toBe(30);
});
