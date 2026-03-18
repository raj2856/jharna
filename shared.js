// SHARED NAV + UTILS
document.addEventListener('DOMContentLoaded', () => {
  // Hamburger toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active link highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // Fade-in observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Floating hearts background
  const heartsContainer = document.querySelector('.floating-hearts');
  if (heartsContainer) {
    const symbols = ['♥', '♡', '❤', '💗', '💕'];
    for (let i = 0; i < 14; i++) {
      const span = document.createElement('span');
      span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      span.style.left = Math.random() * 100 + '%';
      span.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      span.style.animationDuration = (8 + Math.random() * 12) + 's';
      span.style.animationDelay = (Math.random() * 8) + 's';
      heartsContainer.appendChild(span);
    }
  }

  // Auth guard: redirect to password page if not unlocked
  const protectedPages = ['index.html', 'story.html', 'gallery.html', 'timeline.html', 'quiz.html', 'guestbook.html', 'music.html', 'map.html'];
  const isProtected = protectedPages.some(p => currentPage === p || currentPage === '');
  if (isProtected && !sessionStorage.getItem('rj_unlocked')) {
    window.location.href = 'password.html';
  }
});
