// Minimal touch-swipe gesture detector. Returns a pair of DOM touch
// handlers to spread onto a container; calls onSwipeLeft/onSwipeRight once
// a completed touch gesture's horizontal movement clears both the
// distance threshold and a mostly-horizontal angle (so a vertical scroll
// doesn't get misread as a swipe).
export default function useSwipe(onSwipeLeft, onSwipeRight, threshold) {
  var min = threshold || 50;
  var start = { x: 0, y: 0 };

  function onTouchStart(e) {
    var touch = e.touches[0];
    start = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchEnd(e) {
    var touch = e.changedTouches[0];
    var dx = touch.clientX - start.x;
    var dy = touch.clientY - start.y;
    if (Math.abs(dx) < min || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) {
      if (onSwipeLeft) onSwipeLeft();
    } else {
      if (onSwipeRight) onSwipeRight();
    }
  }

  return { onTouchStart: onTouchStart, onTouchEnd: onTouchEnd };
}
