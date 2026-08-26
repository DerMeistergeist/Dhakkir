// Truncates Arabic text on word boundaries to roughly `maxLen` characters,
// appending an ellipsis when it was cut short. Used for list previews.
export function truncateArabic(text, maxLen) {
  if (!text) return "";
  var words = text.split(" ");
  var result = "";
  for (var i = 0; i < words.length; i++) {
    if ((result + " " + words[i]).length > maxLen) break;
    result = result ? result + " " + words[i] : words[i];
  }
  return result + (text.length > result.length ? " ..." : "");
}
