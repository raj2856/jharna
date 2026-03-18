// SECRET EASTER EGG
// Click "Jharna" 5 times to unlock secret modal
document.addEventListener('DOMContentLoaded', () => {
  const triggersAll = document.querySelectorAll('.jharna-secret-trigger');
  if (!triggersAll.length) return;

  let clickCount = 0;
  const REQUIRED = 5;
  const SECRET_PW = 'loveyou';

  triggersAll.forEach(trigger => {
    trigger.addEventListener('click', () => {
      clickCount++;
      // Visual feedback
      trigger.style.color = `hsl(${clickCount * 60}, 80%, 55%)`;
      if (clickCount >= REQUIRED) {
        clickCount = 0;
        trigger.style.color = '';
        openSecretModal();
      }
    });
  });

  // Secret modal logic
  const modal = document.getElementById('secret-modal');
  const closeBtn = document.getElementById('secret-close');
  const pwInput = document.getElementById('secret-pw-input');
  const pwBtn = document.getElementById('secret-pw-btn');
  const pwErr = document.getElementById('secret-pw-err');
  const content = document.getElementById('secret-content');
  const pwForm = document.getElementById('secret-pw-form');

  function openSecretModal() {
    modal.classList.add('active');
    if (content) content.classList.remove('show');
    if (pwForm) pwForm.style.display = '';
    if (pwErr) pwErr.classList.remove('show');
    if (pwInput) pwInput.value = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  if (pwBtn) {
    pwBtn.addEventListener('click', checkSecretPw);
  }
  if (pwInput) {
    pwInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkSecretPw(); });
  }

  function checkSecretPw() {
    if (pwInput.value.trim().toLowerCase() === SECRET_PW) {
      pwForm.style.display = 'none';
      content.classList.add('show');
    } else {
      pwErr.classList.add('show');
      pwInput.value = '';
      setTimeout(() => pwErr.classList.remove('show'), 3000);
    }
  }
});
