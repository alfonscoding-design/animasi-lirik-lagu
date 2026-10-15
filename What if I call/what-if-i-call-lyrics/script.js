const audio = document.getElementById("audio");
const stage = document.getElementById("lyricsStage");
const notesLayer = document.querySelector(".floating-notes");
const startOverlay = document.getElementById("startOverlay");
const startBtn = document.getElementById("startBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const restartBtn = document.getElementById("restartBtn");
const progress = document.getElementById("progress");
const timeLabel = document.getElementById("timeLabel");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let currentIndex = -1;
let noteTimer = null;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function showLyric(index) {
  if (index === currentIndex) return;
  currentIndex = index;

  stage.innerHTML = "";
  if (index < 0 || index >= timeline.length) return;

  const box = document.createElement("div");
  box.className = `lyric-box ${index % 2 === 0 ? "red" : "white"}`;

  const text = document.createElement("span");
  text.className = "lyric-text";
  text.textContent = timeline[index].text;

  box.appendChild(text);
  stage.appendChild(box);

  // Same V1 note effect whenever a new lyric box appears.
  for (let i = 0; i < 3; i++) {
    setTimeout(() => spawnNote(), i * 170);
  }
}

function getActiveLyricIndex(time) {
  for (let i = 0; i < timeline.length; i++) {
    const item = timeline[i];
    if (time >= item.startSeconds && time < item.endSeconds) {
      return i;
    }
  }
  return -1;
}

function spawnNote() {
  const note = document.createElement("span");
  note.className = "note";
  note.textContent = ["♪", "♫", "♬"][Math.floor(Math.random() * 3)];

  const size = 18 + Math.random() * 28;
  const left = 5 + Math.random() * 90;
  const drift = (Math.random() * 2 - 1) * 130;
  const dur = 4.5 + Math.random() * 3.5;

  note.style.left = `${left}%`;
  note.style.setProperty("--size", `${size}px`);
  note.style.setProperty("--drift", `${drift}px`);
  note.style.setProperty("--dur", `${dur}s`);

  notesLayer.appendChild(note);
  setTimeout(() => note.remove(), dur * 1000 + 200);
}

function startNotes() {
  if (noteTimer) return;
  noteTimer = setInterval(() => {
    if (!audio.paused) spawnNote();
  }, 1100);
}

function stopNotes() {
  clearInterval(noteTimer);
  noteTimer = null;
}

async function playAudio() {
  try {
    await audio.play();
    startOverlay.classList.add("hidden");
    playPauseBtn.textContent = "❚❚ Pause";
    startNotes();
  } catch (err) {
    // Browser autoplay policy may require the user to click.
    startOverlay.classList.remove("hidden");
  }
}

function pauseAudio() {
  audio.pause();
  playPauseBtn.textContent = "▶ Play";
  stopNotes();
}

startBtn.addEventListener("click", playAudio);

playPauseBtn.addEventListener("click", async () => {
  if (audio.paused) {
    await playAudio();
  } else {
    pauseAudio();
  }
});

restartBtn.addEventListener("click", async () => {
  audio.currentTime = 0;
  currentIndex = -1;
  stage.innerHTML = "";
  progress.style.width = "0%";
  timeLabel.textContent = "0:00";
  showLyric(getActiveLyricIndex(0));
  await playAudio();
});

audio.addEventListener("timeupdate", () => {
  const duration = audio.duration || 1;
  const ratio = audio.currentTime / duration;
  progress.style.width = `${ratio * 100}%`;
  timeLabel.textContent = formatTime(audio.currentTime);

  // V1 visual behavior, but the lyric timing now follows the manual timeline.
  const index = getActiveLyricIndex(audio.currentTime);
  showLyric(index);
});

audio.addEventListener("loadedmetadata", () => {
  showLyric(getActiveLyricIndex(audio.currentTime));
});

audio.addEventListener("play", () => {
  playPauseBtn.textContent = "❚❚ Pause";
  startNotes();
});

audio.addEventListener("pause", () => {
  playPauseBtn.textContent = "▶ Play";
  stopNotes();
});

audio.addEventListener("ended", () => {
  stopNotes();
  playPauseBtn.textContent = "▶ Play";
  startOverlay.classList.remove("hidden");
  currentIndex = -1;
  stage.innerHTML = "";
});

fullscreenBtn.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (_) {}
});

// Same V1 startup behavior.
window.addEventListener("load", () => {
  showLyric(getActiveLyricIndex(audio.currentTime));
  playAudio();
});
