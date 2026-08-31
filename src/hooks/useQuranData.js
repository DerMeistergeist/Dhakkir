import { useEffect, useState } from "react";

// The full Mushaf dataset (~1.3MB, mostly Arabic verse text) is loaded via
// dynamic import() so it lands in its own code-split chunk and is only
// downloaded when the user actually opens the Quran section -- everyone
// else's initial page load stays unaffected.
var cached = null;
var pending = null;

export default function useQuranData() {
  const [data, setData] = useState(cached);

  useEffect(function () {
    if (cached) {
      setData(cached);
      return;
    }
    if (!pending) {
      pending = Promise.all([import("../data/quran/pages"), import("../data/quran/text"), import("../data/quran/surahs"), import("../data/quran/juzHizb")]).then(function (mods) {
        var PAGES = mods[0].PAGES;
        // Reverse index: "sura:ayah" -> 1-indexed page number, used by
        // search results and any future "jump to this ayah" action.
        var pageOfAyah = {};
        PAGES.forEach(function (page, i) {
          page.forEach(function (entry) {
            pageOfAyah[entry[0] + ":" + entry[1]] = i + 1;
          });
        });
        cached = { PAGES: PAGES, TEXT: mods[1].TEXT, SURAHS: mods[2].SURAHS, PAGE_JUZ: mods[3].PAGE_JUZ, PAGE_HIZB: mods[3].PAGE_HIZB, pageOfAyah: pageOfAyah };
        return cached;
      });
    }
    var cancelled = false;
    pending.then(function (result) {
      if (!cancelled) setData(result);
    });
    return function () {
      cancelled = true;
    };
  }, []);

  return data; // null while the chunk is still loading
}
