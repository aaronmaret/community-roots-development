document.getElementById('year').textContent = new Date().getFullYear();

// Keep the landscape motion subtle, frame-scheduled, and optional.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const landscapes = [...document.querySelectorAll('.landscape-band')];
let parallaxFrame = null;

function updateParallax() {
  parallaxFrame = null;
  for (const section of landscapes) {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const offset = Math.max(-48, Math.min(48,
      (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.12));
    section.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
  }
}

function scheduleParallax() {
  if (!motionPreference.matches && parallaxFrame === null) {
    parallaxFrame = window.requestAnimationFrame(updateParallax);
  }
}

function configureMotion() {
  window.removeEventListener('scroll', scheduleParallax);
  window.removeEventListener('resize', scheduleParallax);
  if (parallaxFrame !== null) window.cancelAnimationFrame(parallaxFrame);
  parallaxFrame = null;
  if (motionPreference.matches) {
    landscapes.forEach(section => section.style.removeProperty('--parallax-y'));
  } else {
    window.addEventListener('scroll', scheduleParallax, { passive: true });
    window.addEventListener('resize', scheduleParallax);
    scheduleParallax();
  }
}

motionPreference.addEventListener('change', configureMotion);
configureMotion();
