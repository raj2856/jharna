// LETTERS - localStorage
const LETTERS_KEY = 'rj_letters';
const LETTERS_PW = 'jharna';

document.addEventListener('DOMContentLoaded', () => {
  // Password gate
  const overlay = document.getElementById('letters-pw-overlay');
  const pwInput = document.getElementById('letters-pw-input');
  const pwBtn = document.getElementById('letters-pw-btn');
  const pwErr = document.getElementById('letters-pw-err');

  if (overlay) {
    pwBtn.addEventListener('click', checkLettersPassword);
    pwInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkLettersPassword(); });
  }

  function checkLettersPassword() {
    if (pwInput.value.trim().toLowerCase() === LETTERS_PW) {
      overlay.classList.add('hidden');
      setTimeout(() => { overlay.style.display = 'none'; }, 650);
      renderLetters();
    } else {
      pwErr.classList.add('show');
      pwInput.value = '';
      pwInput.focus();
      setTimeout(() => pwErr.classList.remove('show'), 3500);
    }
  }

  // Form submission
  const form = document.getElementById('letter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const from = document.getElementById('letter-from').value.trim();
      const subject = document.getElementById('letter-subject').value.trim();
      const body = document.getElementById('letter-body').value.trim();
      if (!from || !body) return;

      const letters = getLetters();
      letters.push({
        id: Date.now(),
        from,
        subject: subject || 'A letter for you',
        body,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });
      saveLetters(letters);
      renderLetters();
      form.reset();
    });
  }

  renderLetters();
});

function getLetters() {
  try { return JSON.parse(localStorage.getItem(LETTERS_KEY)) || []; }
  catch { return []; }
}

function saveLetters(letters) {
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
}

function renderLetters() {
  const container = document.getElementById('letters-list');
  if (!container) return;

  const letters = getLetters();
  const emptyEl = document.getElementById('letters-empty');

  if (letters.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    container.innerHTML = '';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  container.innerHTML = letters.slice().reverse().map(l => `
    <div class="letter-card fade-in visible" data-id="${l.id}">
      <div class="letter-from">✉️ From: ${escapeHtml(l.from)} &nbsp;·&nbsp; <span class="letter-date">${l.date}</span></div>
      <div class="letter-subject">${escapeHtml(l.subject)}</div>
      <div class="letter-body">${escapeHtml(l.body).replace(/\n/g, '<br>')}</div>
      <button class="letter-delete" onclick="deleteLetter(${l.id})" title="Delete">✕</button>
    </div>
  `).join('');
}

function deleteLetter(id) {
  const letters = getLetters().filter(l => l.id !== id);
  saveLetters(letters);
  renderLetters();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
