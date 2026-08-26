import { CATEGORIES, HADITH_CATS, ADHKAR, HADITHS } from "./index";
import { PRAYER_ORDER } from "../utils/prayerTimes";

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

test("every category's timeAnchor (if set) names a real prayer-time key", () => {
  var anchoredCategories = CATEGORIES.filter((cat) => cat.timeAnchor);
  // Morning/Evening/Sleep/Waking are the ones expected to follow real
  // prayer times; if this count changes, timeAnchor coverage moved --
  // update this test alongside the reminder-scheduling logic.
  expect(anchoredCategories.map((c) => c.id).sort()).toEqual(["evening", "morning", "sleep", "wakeup"]);
  anchoredCategories.forEach((cat) => {
    expect(PRAYER_ORDER).toContain(cat.timeAnchor);
    // A fixed fallback time must still exist for when location isn't granted.
    expect(cat.time).toMatch(/^\d{2}:\d{2}$/);
  });
});
