import { useEffect, useRef } from "react";
import { CATEGORIES } from "../data/categories";
import { PRAYER_ORDER, PRAYER_LABELS } from "../utils/prayerTimes";

var STORAGE_KEY = "dhakkir.remindersFiredAt";

function todayKey() {
  var d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function loadFired() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveFired(map) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    // best-effort only
  }
}

// Best-effort local reminders for adhkar categories that carry a suggested
// `time` (see src/data/categories.js), plus the day's Adhan times when
// `prayerTimes` (from usePrayerTimes) is available. Limitation: this only
// fires while the app tab is open in the foreground — it is not a
// background push notification. A real background reminder needs a
// Service Worker + Push subscription with a backend, which is out of
// scope for this static SPA.
export default function useReminders(enabled, lang, prayerTimes) {
  var firedRef = useRef(loadFired());

  useEffect(function () {
    if (!enabled) return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [enabled]);

  useEffect(function () {
    if (!enabled) return;
    if (typeof Notification === "undefined") return;

    function notify(id, title, body) {
      var today = todayKey();
      if (firedRef.current[id] === today) return;
      firedRef.current[id] = today;
      saveFired(firedRef.current);
      try {
        new Notification(title, { body: body, tag: "dhakkir-" + id });
      } catch (e) {
        // Notification constructor can throw on some platforms (e.g. iOS
        // Safari); reminders are best-effort so we just skip silently.
      }
    }

    function tick() {
      if (Notification.permission !== "granted") return;
      var now = new Date();
      var current = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

      CATEGORIES.forEach(function (cat) {
        // Prefer the real astronomical anchor (sunrise/asr/isha/fajr) for
        // this category's reminder when we have today's computed prayer
        // times for the user's location; otherwise fall back to the fixed
        // default clock time so reminders still work without location.
        var anchorTime = cat.timeAnchor && prayerTimes && prayerTimes[cat.timeAnchor];
        var target = anchorTime ? String(anchorTime.getHours()).padStart(2, "0") + ":" + String(anchorTime.getMinutes()).padStart(2, "0") : cat.time;
        if (!target || target !== current) return;
        var title = lang === "ar" ? cat.ar : lang === "de" ? cat.de || cat.en : cat.en;
        notify(cat.id, "ذكّر", title);
      });

      if (prayerTimes) {
        PRAYER_ORDER.forEach(function (key) {
          if (key === "sunrise") return; // not a prayer
          var pTime = prayerTimes[key];
          if (!pTime) return;
          var pCurrent = String(pTime.getHours()).padStart(2, "0") + ":" + String(pTime.getMinutes()).padStart(2, "0");
          if (pCurrent !== current) return;
          var name = PRAYER_LABELS[key][lang] || PRAYER_LABELS[key].en;
          notify(
            "prayer-" + key,
            "ذكّر",
            lang === "ar" ? "حان الآن وقت صلاة " + name : lang === "de" ? "Zeit für das " + name + "-Gebet" : "It's time for " + name + " prayer"
          );
        });
      }
    }

    tick();
    var id = setInterval(tick, 20000);
    return function () {
      clearInterval(id);
    };
  }, [enabled, lang, prayerTimes]);
}
