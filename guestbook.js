// GUESTBOOK - localStorage persistence
const GB_KEY = 'rj_guestbook';

document.addEventListener('DOMContentLoaded', () => {
  renderMessages();

  const form = document.getElementById('gb-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('gb-name').value.trim();
    const msg = document.getElementById('gb-msg').value.trim();
    if (!name || !msg) return;

    const messages = getMessages();
    messages.push({
      id: Date.now(),
      name,
      msg,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    saveMessages(messages);
    renderMessages();
    form.reset();

    // Confetti effect
    showHeartBurst();
  });
});

function getMessages() {
  try { return JSON.parse(localStorage.getItem(GB_KEY)) || []; }
  catch { return []; }
}

function saveMessages(msgs) {
  localStorage.setItem(GB_KEY, JSON.stringify(msgs));
}

function renderMessages() {
  const container = document.getElementById('gb-messages');
  if (!container) return;

  const messages = getMessages();
  const emptyEl = document.getElementById('gb-empty');

  if (messages.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    container.innerHTML = '';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  const html = messages.slice().reverse().map(m => `
    <div class="gb-message fade-in visible" data-id="${m.id}">
      <div class="gb-avatar">${m.name.charAt(0).toUpperCase()}</div>
      <div class="gb-msg-body">
        <div class="gb-msg-name">${escapeHtml(m.name)}</div>
        <div class="gb-msg-date">${m.date}</div>
        <div class="gb-msg-text">${escapeHtml(m.msg)}</div>
      </div>
      <button class="gb-delete" onclick="deleteMessage(${m.id})" title="Delete">✕</button>
    </div>
  `).join('');
  container.innerHTML = html;
}

function deleteMessage(id) {
  const messages = getMessages().filter(m => m.id !== id);
  saveMessages(messages);
  renderMessages();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showHeartBurst() {
  for (let i = 0; i < 8; i++) {
    const heart = document.createElement('div');
    heart.textContent = '♥';
    heart.style.cssText = `
      position:fixed; left:${25+Math.random()*50}%; top:${30+Math.random()*40}%;
      font-size:${1+Math.random()*2}rem; color:#ff6b81; pointer-events:none; z-index:9999;
      animation: heartUp 1.2s ease forwards; opacity:0.8;
    `;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1400);
  }
  if (!document.getElementById('heartup-style')) {
    const s = document.createElement('style');
    s.id = 'heartup-style';
    s.textContent = '@keyframes heartUp { to { transform:translateY(-120px) scale(0.5); opacity:0; } }';
    document.head.appendChild(s);
  }
}
