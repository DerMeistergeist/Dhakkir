import React, { useEffect, useState } from "react";
import { CATEGORIES, ADHKAR } from "./data";
import { DEFAULT_METHOD } from "./utils/prayerTimes";
import useLocalStorage from "./hooks/useLocalStorage";
import useReminders from "./hooks/useReminders";
import useGeolocation from "./hooks/useGeolocation";
import usePrayerTimes from "./hooks/usePrayerTimes";
import Splash from "./components/Splash";
import Settings from "./components/Settings";
import HomeView from "./components/HomeView";
import CategoryView from "./components/CategoryView";
import DhikrView from "./components/DhikrView";

export default function App() {
  // Persisted across sessions.
  const [lang, setLang] = useLocalStorage("dhakkir.lang", "ar");
  const [showTr, setShowTr] = useLocalStorage("dhakkir.showTranslation", true);
  const [remindersOn, setRemindersOn] = useLocalStorage("dhakkir.remindersOn", false);
  const [counts, setCounts] = useLocalStorage("dhakkir.counts", {});
  const [done, setDone] = useLocalStorage("dhakkir.done", {});
  const [calcMethod, setCalcMethod] = useLocalStorage("dhakkir.calcMethod", DEFAULT_METHOD);
  const [asrMadhab, setAsrMadhab] = useLocalStorage("dhakkir.asrMadhab", "STANDARD");
  const [lastQuranPage, setLastQuranPage] = useLocalStorage("dhakkir.lastQuranPage", null);

  const geolocation = useGeolocation();
  const { times: prayerTimes, next: nextPrayer, now: prayerNow } = usePrayerTimes(geolocation.coords, calcMethod, asrMadhab);

  // Session-only navigation state.
  const [section, setSection] = useState("adhkar");
  const [view, setView] = useState("home");
  const [selCat, setSelCat] = useState(null);
  const [dhikrIdx, setDhikrIdx] = useState(0);
  const [showSet, setShowSet] = useState(false);
  const [hCat, setHCat] = useState(null);
  const [hIdx, setHIdx] = useState(0);
  const [hList, setHList] = useState(false);
  const [splash, setSplash] = useState(true);
  const [fade, setFade] = useState(false);

  useReminders(remindersOn, lang, prayerTimes);

  useEffect(function () {
    var t1 = setTimeout(function () {
      setFade(true);
    }, 2800);
    var t2 = setTimeout(function () {
      setSplash(false);
    }, 3500);
    return function () {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Inject the shared font import + a couple of keyframes/scrollbar rules
  // used across views.
  useEffect(function () {
    var el = document.createElement("style");
    el.textContent =
      "@import url(https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap);*{box-sizing:border-box;margin:0;padding:0}body{background:#f5f0e8}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#c9a84c44;border-radius:4px}@keyframes sIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fin{animation:fIn 0.3s ease}";
    document.head.appendChild(el);
    return function () {
      document.head.removeChild(el);
    };
  }, []);

  // Keep the document direction/lang in sync with the selected language,
  // instead of leaving it hardcoded to Arabic RTL from index.html.
  useEffect(function () {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  var list = selCat ? ADHKAR[selCat] || [] : [];
  var dhikr = list[dhikrIdx] || null;
  var cKey = (selCat || "") + "-" + dhikrIdx;
  var cCount = counts[cKey] || 0;
  var req = dhikr ? dhikr.count || 1 : 1;
  var isDone = cCount >= req;
  var pct = req > 0 ? Math.min(100, (cCount / req) * 100) : 0;
  var doneInCat = list.filter(function (_, i) {
    return done[(selCat || "") + "-" + i];
  }).length;
  var selCategory = CATEGORIES.find(function (c) {
    return c.id === selCat;
  });

  function tap() {
    if (!dhikr || isDone) return;
    var n = cCount + 1;
    var nc = Object.assign({}, counts);
    nc[cKey] = n;
    setCounts(nc);
    if (n >= req) {
      var nd = Object.assign({}, done);
      nd[cKey] = true;
      setDone(nd);
    }
  }

  function reset() {
    var nc = Object.assign({}, counts);
    nc[cKey] = 0;
    setCounts(nc);
  }

  var FF = lang === "ar" ? "Amiri,serif" : "Arial,sans-serif";

  var hadithsProps = {
    showTr: showTr,
    hCat: hCat,
    hIdx: hIdx,
    hList: hList,
    onSelectCategory: function (id) {
      setHCat(id);
      setHIdx(0);
      setHList(true);
    },
    onSelectHadith: function (i) {
      setHIdx(i);
      setHList(false);
    },
    onShowList: function () {
      setHList(true);
    },
    onBackToCategories: function () {
      setHCat(null);
    },
    onPrev: function () {
      if (hIdx > 0) setHIdx(hIdx - 1);
    },
    onNext: function () {
      setHIdx(hIdx + 1);
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f3e8", color: "#2c1810", maxWidth: 430, margin: "0 auto", fontFamily: FF }}>
      {splash && <Splash fade={fade} />}

      {!splash && showSet && (
        <Settings
          lang={lang}
          setLang={setLang}
          showTr={showTr}
          setShowTr={setShowTr}
          remindersOn={remindersOn}
          setRemindersOn={setRemindersOn}
          calcMethod={calcMethod}
          setCalcMethod={setCalcMethod}
          asrMadhab={asrMadhab}
          setAsrMadhab={setAsrMadhab}
          geolocation={geolocation}
          onBack={function () {
            setShowSet(false);
          }}
        />
      )}

      {!splash && !showSet && view === "dhikr" && dhikr && (
        <DhikrView
          lang={lang}
          category={selCategory}
          dhikr={dhikr}
          dhikrIdx={dhikrIdx}
          listLength={list.length}
          cCount={cCount}
          req={req}
          isDone={isDone}
          pct={pct}
          showTr={showTr}
          onPrev={function () {
            if (dhikrIdx > 0) setDhikrIdx(dhikrIdx - 1);
          }}
          onNext={function () {
            if (dhikrIdx < list.length - 1) setDhikrIdx(dhikrIdx + 1);
          }}
          onTap={tap}
          onReset={reset}
          onBack={function () {
            setView("category");
          }}
          onOpenSettings={function () {
            setShowSet(true);
          }}
        />
      )}

      {!splash && !showSet && view === "category" && selCat && (
        <CategoryView
          lang={lang}
          category={selCategory}
          list={list}
          counts={counts}
          done={done}
          doneInCat={doneInCat}
          onSelectDhikr={function (i) {
            setDhikrIdx(i);
            setView("dhikr");
          }}
          onBack={function () {
            setView("home");
            setSelCat(null);
          }}
          onOpenSettings={function () {
            setShowSet(true);
          }}
        />
      )}

      {!splash && !showSet && view === "home" && (
        <HomeView
          lang={lang}
          setLang={setLang}
          section={section}
          setSection={function (id) {
            setSection(id);
            setHCat(null);
          }}
          done={done}
          onOpenSettings={function () {
            setShowSet(true);
          }}
          onSelectAdhkarCategory={function (id) {
            setSelCat(id);
            setDhikrIdx(0);
            setView("category");
          }}
          hadithsProps={hadithsProps}
          prayerTimesProps={{ geolocation: geolocation, method: calcMethod, times: prayerTimes, next: nextPrayer, now: prayerNow }}
          quranProps={{ lastPage: lastQuranPage, setLastPage: setLastQuranPage, onOpenSettings: function () { setShowSet(true); } }}
        />
      )}
    </div>
  );
}
