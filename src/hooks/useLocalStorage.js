import { useEffect, useState } from "react";

// Persists a piece of state to localStorage under `key`, restoring it on
// mount. Falls back silently to `initialValue` if storage is unavailable
// (private browsing, disabled storage, etc.) or holds invalid JSON.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(function () {
    try {
      var raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(function () {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // storage full / unavailable — persistence is best-effort only.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue];
}
