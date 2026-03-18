// DAYS COUNTER + LOVE METER
document.addEventListener('DOMContentLoaded', () => {
  // Days counter
  const startDate = new Date('2026-03-05');
  const now = new Date();
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const counter = document.getElementById('days-counter');
  if (counter) {
    animateCount(counter, 0, diffDays, 1800);
  }

  // Love meter
  const bar = document.querySelector('.love-meter-bar');
  if (bar) {
    setTimeout(() => { bar.style.width = '100%'; }, 400);
  }

  // Additional stats
  const hoursEl = document.getElementById('hours-talking');
  if (hoursEl) {
    animateCount(hoursEl, 0, diffDays * 3, 2000);
  }
});

function animateCount(el, start, end, duration) {
  const range = end - start;
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(start + range * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
