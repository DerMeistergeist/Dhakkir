import { useEffect, useRef } from "react";
import { CATEGORIES } from "../data/categories";

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
// `time` (see src/data/categories.js). Limitation: this only fires while
// the app tab is open in the foreground — it is not a background push
// notification. A real background reminder needs a Service Worker + Push
// subscription with a backend, which is out of scope for this static SPA.
export default function useReminders(enabled, lang) {
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

    function tick() {
      if (Notification.permission !== "granted") return;
      var now = new Date();
      var hh = String(now.getHours()).padStart(2, "0");
      var mm = String(now.getMinutes()).padStart(2, "0");
      var current = hh + ":" + mm;
      var today = todayKey();

      CATEGORIES.forEach(function (cat) {
        if (!cat.time || cat.time !== current) return;
        if (firedRef.current[cat.id] === today) return;
        firedRef.current[cat.id] = today;
        saveFired(firedRef.current);
        try {
          var title = lang === "ar" ? cat.ar : lang === "de" ? cat.de || cat.en : cat.en;
          new Notification("ذكّر", { body: title, tag: "dhakkir-" + cat.id });
        } catch (e) {
          // Notification constructor can throw on some platforms (e.g. iOS
          // Safari); reminders are best-effort so we just skip silently.
        }
      });
    }

    tick();
    var id = setInterval(tick, 20000);
    return function () {
      clearInterval(id);
    };
  }, [enabled, lang]);
}
