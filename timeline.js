// TIMELINE JS - smooth reveal and animations
document.addEventListener('DOMContentLoaded', () => {
  // Timeline items are handled by shared.js fade-in observer
  // Additional stagger for timeline items
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.15}s`;
  });
});
