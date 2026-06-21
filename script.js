const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const checkButtons = [...document.querySelectorAll('.check-btn')];
const totalSteps = checkButtons.length;

menuBtn?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('time-codeman-misiones')) || [];
  } catch {
    return [];
  }
}

function saveProgress(progress) {
  localStorage.setItem('time-codeman-misiones', JSON.stringify(progress));
}

function updateProgressUI() {
  const progress = getProgress();
  checkButtons.forEach(btn => {
    const step = btn.dataset.step;
    const isDone = progress.includes(step);
    btn.classList.toggle('done', isDone);
    btn.textContent = isDone ? 'Misión completada ✓' : 'Marcar misión';
  });
  const completed = progress.length;
  progressText.textContent = `${completed} de ${totalSteps} misiones completadas`;
  progressFill.style.width = `${(completed / totalSteps) * 100}%`;
}

checkButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;
    const progress = getProgress();
    const index = progress.indexOf(step);
    if (index >= 0) progress.splice(index, 1);
    else progress.push(step);
    saveProgress(progress);
    updateProgressUI();
  });
});

document.querySelectorAll('.video-box video').forEach(video => {
  video.addEventListener('error', () => {
    video.closest('.video-box')?.classList.add('missing');
  });

  const source = video.querySelector('source');
  if (source?.getAttribute('src')) {
    fetch(source.getAttribute('src'), { method: 'HEAD' })
      .then(response => {
        if (!response.ok) video.dispatchEvent(new Event('error'));
      })
      .catch(() => video.dispatchEvent(new Event('error')));
  }
});

updateProgressUI();
