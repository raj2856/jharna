// QUIZ LOGIC
const questions = [
  {
    q: "What is Jharna's favourite color?",
    options: ["Sky Blue", "Rose Pink", "Lavender", "Mint Green"],
    correct: 1,
    emoji: "🎨"
  },
  {
    q: "What food does she love the most?",
    options: ["Pizza", "Momo", "Biryani", "Pasta"],
    correct: 1,
    emoji: "🍜"
  },
  {
    q: "What movie should we watch together for the first time?",
    options: ["The Notebook", "La La Land", "Your Name", "Twilight"],
    correct: 2,
    emoji: "🎬"
  },
  {
    q: "Where should we travel first together?",
    options: ["Paris", "Pokhara, Nepal", "Bali", "Maldives"],
    correct: 1,
    emoji: "✈️"
  },
  {
    q: "What nickname does Raj use for Jharna?",
    options: ["Janu", "Baby", "Sweetheart", "Love"],
    correct: 0,
    emoji: "💕"
  },
  {
    q: "What is Jharna's biggest dream?",
    options: ["Travel the world", "Start a business", "Find true love", "Become a doctor"],
    correct: 2,
    emoji: "🌟"
  },
  {
    q: "On what app did Raj and Jharna first meet?",
    options: ["Instagram", "Snapchat", "Kiss Kiss", "WhatsApp"],
    correct: 2,
    emoji: "📱"
  },
  {
    q: "What is our song (the one that reminds us of each other)?",
    options: ["Perfect – Ed Sheeran", "Photograph – Ed Sheeran", "Until I Found You", "All of Me – John Legend"],
    correct: 0,
    emoji: "🎵"
  },
  {
    q: "What kind of dates does Jharna prefer?",
    options: ["Fancy restaurants", "Adventure trips", "Cozy café & long talks", "Movie nights at home"],
    correct: 2,
    emoji: "☕"
  },
  {
    q: "Finish this sentence: 'Raj & Jharna are ___'",
    options: ["Just friends", "Complicated", "A beautiful story", "Netflix characters"],
    correct: 2,
    emoji: "❤️"
  }
];

let currentQ = 0;
let score = 0;
let answered = false;

document.addEventListener('DOMContentLoaded', () => {
  const quizEl = document.getElementById('quiz-area');
  const resultEl = document.getElementById('quiz-result');
  if (!quizEl) return;

  renderQuestion();
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
});

function renderQuestion() {
  const q = questions[currentQ];
  const total = questions.length;

  document.getElementById('question-num').textContent = `Question ${currentQ + 1} of ${total}`;
  document.getElementById('question-emoji').textContent = q.emoji;
  document.getElementById('question-text').textContent = q.q;

  const bar = document.getElementById('progress-bar');
  bar.style.width = ((currentQ / total) * 100) + '%';
  document.getElementById('progress-label').textContent = `${currentQ}/${total}`;

  const optGrid = document.getElementById('options-grid');
  optGrid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span>${opt}`;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    optGrid.appendChild(btn);
  });

  answered = false;
  document.getElementById('next-btn').disabled = true;
  document.getElementById('next-btn').textContent = currentQ === questions.length - 1 ? 'See Results ✨' : 'Next Question →';
}

function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (index === questions[currentQ].correct) {
    score++;
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    allBtns[questions[currentQ].correct].classList.add('correct');
  }

  document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  document.getElementById('quiz-area').style.display = 'none';
  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.add('show');

  const pct = Math.round((score / questions.length) * 100);
  document.getElementById('result-score').textContent = `${score}/${questions.length}`;
  document.getElementById('result-pct').textContent = `${pct}%`;

  let emoji, msg;
  if (score === questions.length) {
    emoji = '🥰'; msg = "You know everything about me ❤️ This score is as perfect as us!";
  } else if (score >= 7) {
    emoji = '😄'; msg = "Not bad at all! You know me pretty well 😊 Keep learning!";
  } else if (score >= 4) {
    emoji = '😊'; msg = "Hmm… you know the basics! We need more conversations 💕";
  } else {
    emoji = '😉'; msg = "Looks like you need to learn more about me! I'll quiz you again 😜";
  }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-msg').textContent = msg;

  document.getElementById('retry-btn').addEventListener('click', () => {
    currentQ = 0; score = 0; answered = false;
    document.getElementById('quiz-area').style.display = 'block';
    resultEl.classList.remove('show');
    renderQuestion();
  });
}
