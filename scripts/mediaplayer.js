(function loadMediaPlayerCSS()
{
  const link = document.createElement('link');

  let scriptUrl = document.currentScript.src; 
  let scriptDir = scriptUrl.substring(0, scriptUrl.lastIndexOf("/") + 1);

  let root = scriptDir.replace(/scripts\/$/, "");

  link.rel = `stylesheet`;
  link.href = `${root}scripts/mediaplayer.css`;
  document.head.appendChild(link);
})();

const video = document.getElementById('myVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFilled = progressBar.querySelector('.progress-filled');

playPauseBtn.addEventListener('click', () => {
  if (video.paused || video.ended) {
    if (video.ended) video.currentTime = 0;

    video.play();
    playPauseBtn.textContent = 'Pause';
  }
  else
  {
    video.pause();
    if (video.currentTime > 0 && video.currentTime < video.duration)
        playPauseBtn.textContent = 'Resume';
    else
        playPauseBtn.textContent = 'Play';
  }
});

video.addEventListener('ended', () => {
  playPauseBtn.textContent = 'Replay';
});

video.addEventListener('play', () => {
  playPauseBtn.textContent = 'Pause';
  updateProgress();
});

video.addEventListener('pause', () => {
  if (!video.ended) {
    if (video.currentTime > 0 && video.currentTime < video.duration)
        playPauseBtn.textContent = 'Resume';
    else
        playPauseBtn.textContent = 'Play';
  }
  cancelAnimationFrame(animationFrameId);
});

let animationFrameId;
const progressThumb = document.getElementById('progressThumb');

function updateProgress()
{
    const percent = (video.currentTime / video.duration) * 100;
    progressFilled.style.width = `${percent}%`;

    const barWidth = progressBar.offsetWidth;
    const thumbX = (percent / 100) * barWidth;
    progressThumb.style.left = `${thumbX}px`;

    animationFrameId = requestAnimationFrame(updateProgress);
}

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / progressBar.offsetWidth) * video.duration;
    video.currentTime = newTime;

    progressThumb.style.left = `${clickX}px`;
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const newTime = (clickX / progressBar.offsetWidth) * video.duration;
  video.currentTime = newTime;
});

let isDragging = false;

progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    seek(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        seek(e);
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
    }
});

function seek(e)
{
    const rect = progressBar.getBoundingClientRect();
    let clickX = e.clientX - rect.left;

    clickX = Math.max(0, Math.min(clickX, rect.width));

    const newTime = (clickX / rect.width) * video.duration;
    video.currentTime = newTime;

    progressFilled.style.width = `${(newTime / video.duration) * 100}%`;
    progressThumb.style.left = `${clickX}px`;
}

progressBar.addEventListener('touchstart', (e) => {
    isDragging = true;
    seek(e.touches[0]);
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) seek(e.touches[0]);
});

document.addEventListener('touchend', () => {
    isDragging = false;
});