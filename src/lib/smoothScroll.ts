/**
 * Butter-smooth scroll animation for HTML elements using requestAnimationFrame with cubic-bezier easing.
 * 
 * @param element The target scroll container element
 * @param distance The amount to scroll (positive for right, negative for left)
 * @param duration Duration of the scroll animation in milliseconds
 */
export function smoothScrollBy(
  element: HTMLDivElement,
  distance: number,
  duration: number = 400
) {
  const start = element.scrollLeft;
  const target = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, start + distance));
  const change = target - start;
  
  if (change === 0) return;

  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: easeOutCubic (starts fast, slows down smoothly)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);

    element.scrollLeft = start + change * easeOutCubic;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
