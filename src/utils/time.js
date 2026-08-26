// Formats a Date's local clock time (e.g. "05:12 ص" / "5:12 AM") using the
// given UI language for the AM/PM marker; Arabic and German use 24h.
export function formatClock(date, lang) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var mm = String(minutes).padStart(2, "0");

  if (lang === "en") {
    var period = hours >= 12 ? "PM" : "AM";
    var h12 = hours % 12 || 12;
    return h12 + ":" + mm + " " + period;
  }

  var hh = String(hours).padStart(2, "0");
  return hh + ":" + mm;
}

// Formats a millisecond duration as "Hس Mد" / "Hh Mm" for a countdown.
export function formatDuration(ms, lang) {
  var totalMinutes = Math.max(0, Math.round(ms / 60000));
  var h = Math.floor(totalMinutes / 60);
  var m = totalMinutes % 60;
  if (lang === "ar") {
    return (h > 0 ? h + "س " : "") + m + "د";
  }
  if (lang === "de") {
    return (h > 0 ? h + "Std " : "") + m + "Min";
  }
  return (h > 0 ? h + "h " : "") + m + "m";
}
