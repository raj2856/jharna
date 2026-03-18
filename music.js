// MUSIC PLAYER
let defaultSongs = [
  { title: "Sweet Moment 1", artist: "Recording", icon: "📱", duration: "0:15", src: "assets/music/Snapchat-1779602450.mp4", type: 'local' },
  { title: "Sweet Moment 2", artist: "Recording", icon: "📱", duration: "0:20", src: "assets/music/Snapchat-990696011.mp4", type: 'local' },
  { title: "Until I Found You", artist: "Stephen Sanchez", icon: "💫", duration: "2:57", src: "GxldQ9GyXQM", type: 'youtube' },
  { title: "Perfect", artist: "Ed Sheeran", icon: "🎵", duration: "4:23", src: "2Vv-BfVoq4g", type: 'youtube' },
  { title: "Photograph", artist: "Ed Sheeran", icon: "📸", duration: "4:19", src: "nSDgHB63EQw", type: 'youtube' }
];

let songs = [...defaultSongs];
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();
let progressInterval = null;
let ytPlayer = null;
let isYtReady = false;

// YouTube API initialization
window.onYouTubeIframeAPIReady = () => {
  ytPlayer = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: '',
    playerVars: { 'autoplay': 0, 'controls': 0, 'disablekb': 1, 'enablejsapi': 1 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  isYtReady = true;
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    updatePlayPauseUI(true);
    startProgressTracker();
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.BUFFERING) {
    // Only update if we were playing
  } else if (event.data === YT.PlayerState.ENDED) {
    nextSong();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('playlist')) return;
  
  // Load from local storage
  const saved = localStorage.getItem('rj_custom_playlist');
  if (saved) {
    const customSongs = JSON.parse(saved);
    songs = [...defaultSongs, ...customSongs];
  }

  buildPlaylist();
  loadSong(0);
  bindControls();
  
  const addBtn = document.getElementById('add-song-btn');
  if (addBtn) addBtn.addEventListener('click', addCustomSong);
});

function buildPlaylist() {
  const pl = document.getElementById('playlist');
  pl.innerHTML = songs.map((s, i) => `
    <div class="playlist-item ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="selectSong(${i})">
      <span class="pl-num">${i + 1}</span>
      <span class="pl-icon">${s.icon || '🎵'}</span>
      <div class="pl-info">
        <div class="pl-title">${s.title}</div>
        <div class="pl-artist">${s.artist}</div>
      </div>
      <span class="pl-dur">${s.duration || '--:--'}</span>
      <div class="pl-bars">
        <span></span><span></span><span></span>
      </div>
    </div>
  `).join('');
}

function loadSong(index) {
  const s = songs[index];
  document.getElementById('song-title').textContent = s.title;
  document.getElementById('song-artist').textContent = s.artist;
  document.getElementById('album-icon').textContent = s.icon || '🎵';

  // Stop everything
  audio.pause();
  if (isYtReady && ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();
  clearInterval(progressInterval);

  if (s.type === 'youtube') {
    if (isYtReady) ytPlayer.cueVideoById(s.src);
  } else {
    audio.src = s.src;
    audio.load();
  }

  document.getElementById('current-time').textContent = '0:00';
  document.getElementById('duration-time').textContent = s.duration || '--:--';
  document.getElementById('progress').value = 0;

  document.querySelectorAll('.playlist-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
    el.classList.remove('paused');
  });
  currentSongIndex = index;
}

function selectSong(index) {
  const wasPlaying = isPlaying;
  loadSong(index);
  if (wasPlaying) playCurrent();
}

function bindControls() {
  document.getElementById('play-btn').addEventListener('click', togglePlay);
  document.getElementById('prev-btn').addEventListener('click', prevSong);
  document.getElementById('next-btn').addEventListener('click', nextSong);

  const volSlider = document.getElementById('volume');
  if (volSlider) {
    volSlider.addEventListener('input', () => {
      const v = volSlider.value / 100;
      audio.volume = v;
      if (isYtReady && ytPlayer) ytPlayer.setVolume(volSlider.value);
    });
  }

  const progressSlider = document.getElementById('progress');
  progressSlider.addEventListener('input', () => {
    const s = songs[currentSongIndex];
    if (s.type === 'youtube') {
      if (isYtReady) {
        const dur = ytPlayer.getDuration();
        ytPlayer.seekTo((progressSlider.value / 100) * dur);
      }
    } else {
      if (audio.duration) audio.currentTime = (progressSlider.value / 100) * audio.duration;
    }
  });
}

function togglePlay() {
  if (isPlaying) pauseCurrent(); else playCurrent();
}

function playCurrent() {
  const s = songs[currentSongIndex];
  isPlaying = true;
  updatePlayPauseUI(true);

  if (s.type === 'youtube') {
    if (isYtReady) ytPlayer.playVideo();
  } else {
    audio.play().catch(e => console.log("Play error:", e));
    startProgressTracker();
  }
}

function pauseCurrent() {
  const s = songs[currentSongIndex];
  isPlaying = false;
  updatePlayPauseUI(false);

  if (s.type === 'youtube') {
    if (isYtReady) ytPlayer.pauseVideo();
  } else {
    audio.pause();
  }
  clearInterval(progressInterval);
}

function prevSong() {
  let idx = (currentSongIndex - 1 + songs.length) % songs.length;
  selectSong(idx);
}

function nextSong() {
  let idx = (currentSongIndex + 1) % songs.length;
  selectSong(idx);
}

function updatePlayPauseUI(playing) {
  const playBtn = document.getElementById('play-btn');
  const albumArt = document.getElementById('album-art');
  if (playing) {
    playBtn.innerHTML = `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    albumArt.classList.add('playing');
  } else {
    playBtn.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>`;
    albumArt.classList.remove('playing');
  }
}

function startProgressTracker() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    const s = songs[currentSongIndex];
    let current = 0, duration = 0;

    if (s.type === 'youtube') {
      if (isYtReady) {
        current = ytPlayer.getCurrentTime();
        duration = ytPlayer.getDuration();
      }
    } else {
      current = audio.currentTime;
      duration = audio.duration;
    }

    if (duration > 0) {
      const pct = (current / duration) * 100;
      document.getElementById('progress').value = pct;
      document.getElementById('current-time').textContent = formatTime(Math.floor(current));
      if (!s.duration || s.duration === '--:--') {
         document.getElementById('duration-time').textContent = formatTime(Math.floor(duration));
      }
    }
  }, 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function addCustomSong() {
  const title = document.getElementById('new-title').value.trim();
  const artist = document.getElementById('new-artist').value.trim();
  const url = document.getElementById('new-url').value.trim();

  if (!title || !url) {
    alert("Please enter at least a title and a link! 💖");
    return;
  }

  let type = 'url';
  let src = url;

  // Detect YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    type = 'youtube';
    src = ytMatch[1];
  }

  const newSong = { title, artist: artist || 'Unknown', icon: type === 'youtube' ? '📺' : '🎵', src, type, duration: '--:--' };
  
  const saved = JSON.parse(localStorage.getItem('rj_custom_playlist') || '[]');
  saved.push(newSong);
  localStorage.setItem('rj_custom_playlist', JSON.stringify(saved));
  
  songs.push(newSong);
  buildPlaylist();
  
  document.getElementById('new-title').value = '';
  document.getElementById('new-artist').value = '';
  document.getElementById('new-url').value = '';
  
  alert("Added to your playlist! 🌸");
}
