function setTheme(t) {
  document.documentElement.dataset.theme = t === 'retro' ? 'retro' : '';
  localStorage.setItem('theme', t);
}

(function () {
  const t = localStorage.getItem('theme') || 'modern';
  document.documentElement.dataset.theme = t === 'retro' ? 'retro' : '';
  const sel = document.getElementById('themeSelect');
  if (sel) sel.value = t;
})();
