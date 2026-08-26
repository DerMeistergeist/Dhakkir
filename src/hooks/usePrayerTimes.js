import { useEffect, useMemo, useState } from "react";
import { computePrayerTimes, PRAYER_ORDER } from "../utils/prayerTimes";

// Computes today's prayer times for `coords` and keeps a live "now" so
// callers can highlight/count down to the next prayer. Recomputes when
// the calendar day rolls over, or when location/method/madhab change.
export default function usePrayerTimes(coords, method, asrMadhab) {
  const [now, setNow] = useState(function () {
    return new Date();
  });

  useEffect(function () {
    var id = setInterval(function () {
      setNow(new Date());
    }, 30000);
    return function () {
      clearInterval(id);
    };
  }, []);

  var dayKey = now.toDateString();

  const times = useMemo(
    function () {
      if (!coords) return null;
      return computePrayerTimes({ latitude: coords.latitude, longitude: coords.longitude, method: method, asrMadhab: asrMadhab, date: now });
    },
    // `now` itself is intentionally excluded -- only a new calendar day
    // (via dayKey) should force a recompute; the 30s tick is only for the
    // "next prayer" countdown below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coords, method, asrMadhab, dayKey]
  );

  var next = null;
  if (times) {
    for (var i = 0; i < PRAYER_ORDER.length; i++) {
      var key = PRAYER_ORDER[i];
      if (times[key].getTime() > now.getTime()) {
        next = key;
        break;
      }
    }
  }

  return { times: times, next: next, now: now };
}
