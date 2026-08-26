import { useCallback, useState } from "react";
import useLocalStorage from "./useLocalStorage";

// Wraps the browser Geolocation API and persists the last known
// coordinates so the app doesn't have to ask again on every visit.
// Returns { coords, status, error, request } where status is one of
// "idle" | "locating" | "granted" | "denied" | "unsupported".
export default function useGeolocation() {
  const [coords, setCoords] = useLocalStorage("dhakkir.location", null);
  const [status, setStatus] = useState(coords ? "granted" : "idle");
  const [error, setError] = useState(null);

  const request = useCallback(function () {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatus("granted");
      },
      function (err) {
        setStatus("denied");
        setError(err && err.message ? err.message : "geolocation error");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 }
    );
  }, [setCoords]);

  const clear = useCallback(function () {
    setCoords(null);
    setStatus("idle");
  }, [setCoords]);

  return { coords, status, error, request, clear };
}
