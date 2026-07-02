function rand(min, max) { return Math.random() * (max - min) + min }

function lerp(a, b, t) { return a + (b - a) * t }

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) } }

function throttle(fn, ms) { let wait = false; return (...a) => { if (wait) return; wait = true; fn(...a); setTimeout(() => wait = false, ms) } }

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str) } catch { return fallback }
}

function saveJSON(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch { }
}

function loadJSON(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null
  } catch { return null }
}
