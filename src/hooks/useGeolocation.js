import { useCallback, useState } from "react";
import useLocalStorage from "./useLocalStorage";

// Wraps the browser Geolocation API and persists the last known
// coordinates so the app doesn't have to ask again on every visit.
// Returns { coords, status, error, request } where status is one of
// "idle" | "locating" | "granted" | "denied" | "unavailable" | "timeout" | "insecure" | "unsupported".
//
// The three failure modes are kept distinct on purpose: a GPS timeout or
// "position unavailable" (both common and simply worth retrying) look
// nothing like a user having actually denied the permission, and showing
// the same "permission denied, fix it in browser settings" message for
// all three is misleading.
export default function useGeolocation() {
  const [coords, setCoords] = useLocalStorage("dhakkir.location", null);
  const [status, setStatus] = useState(coords ? "granted" : "idle");
  const [error, setError] = useState(null);

  const request = useCallback(function () {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    // Geolocation is only available in a secure context (HTTPS, or
    // localhost). On plain HTTP the browser silently refuses it.
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setStatus("insecure");
      return;
    }
    setStatus("locating");
    setError(null);

    // Belt-and-braces watchdog: the Geolocation API's own `timeout` option
    // is not reliably honored everywhere -- if the permission prompt is
    // silently dismissed, blocked by an OS/enterprise policy, or the call
    // is made from a restrictive embedded webview, some browsers never
    // invoke *either* callback at all, leaving the UI stuck on "locating"
    // forever. This was reproduced directly (headless Chromium with no
    // permission granted: neither callback fired even 20s past the
    // configured timeout). The watchdog guarantees the request always
    // settles into a recoverable state.
    var settled = false;
    var watchdog = setTimeout(function () {
      if (settled) return;
      settled = true;
      setStatus("timeout");
      setError("watchdog timeout: browser never responded");
    }, 20000);

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        if (settled) return;
        settled = true;
        clearTimeout(watchdog);
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatus("granted");
      },
      function (err) {
        if (settled) return;
        settled = true;
        clearTimeout(watchdog);
        // code 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        var code = err && err.code;
        setStatus(code === 1 ? "denied" : code === 3 ? "timeout" : "unavailable");
        setError(err && err.message ? err.message : "geolocation error");
      },
      { enableHighAccuracy: false, timeout: 18000, maximumAge: 3600000 }
    );
  }, [setCoords]);

  const clear = useCallback(function () {
    setCoords(null);
    setStatus("idle");
  }, [setCoords]);

  return { coords, status, error, request, clear };
}
