function setTheme(t){
  document.documentElement.dataset.theme=t==='retro'?'retro':'';
  localStorage.setItem('theme',t)
}
(function(){
  const t=localStorage.getItem('theme')||'modern';
  document.documentElement.dataset.theme=t==='retro'?'retro':'';
  const sel=document.getElementById('themeSelect');
  if(sel)sel.value=t;
})();

const COLORS = {
  red:    '#FF6B6B',
  blue:   '#4ECDC4',
  yellow: '#FFE66D',
  green:  '#95E3A0',
  pink:   '#FFB3D9',
  purple: '#AA96DA',
  orange: '#FF9F43',
  brown:  '#C2956A'
};

const LEVELS = [
  {
    name: 'Corazón',
    cols: 3, rows: 3,
    grid: [
      [null,'red',null],
      ['red','red','red'],
      [null,'red',null]
    ]
  },
  {
    name: 'Mariposa',
    cols: 4, rows: 3,
    grid: [
      ['pink','pink',null,null],
      ['pink','pink','pink','pink'],
      ['pink','pink',null,null]
    ]
  },
  {
    name: 'Estrella',
    cols: 5, rows: 5,
    grid: [
      [null,null,'yellow',null,null],
      [null,'yellow','yellow','yellow',null],
      ['yellow','yellow','yellow','yellow','yellow'],
      [null,'yellow','yellow','yellow',null],
      [null,null,'yellow',null,null]
    ]
  },
  {
    name: 'Casa',
    cols: 5, rows: 5,
    grid: [
      [null,null,'red',null,null],
      [null,'red','red','red',null],
      ['brown','brown','brown','brown','brown'],
      ['brown',null,null,null,'brown'],
      ['brown',null,null,null,'brown']
    ]
  },
  {
    name: 'Flor',
    cols: 5, rows: 5,
    grid: [
      [null,null,'pink',null,null],
      [null,'pink','pink','pink',null],
      ['pink','yellow','yellow','yellow','pink'],
      [null,'pink','yellow','pink',null],
      [null,null,'pink',null,null]
    ]
  }
];

const canvasEl = document.getElementById('canvas');
const paletteEl = document.getElementById('palette');
const statusEl = document.getElementById('status');
const levelBar = document.getElementById('levelBar');

let currentLevel = 0;
let selectedColor = null;
let painted = {};

function getLevelColors(level){
  const set = new Set();
  level.grid.forEach(row => row.forEach(c => { if(c) set.add(c); }));
  return [...set];
}

function renderLevelBar(){
  levelBar.innerHTML = '';
  LEVELS.forEach((lv, i) => {
    const btn = document.createElement('button');
    btn.className = 'level-btn' + (i === currentLevel ? ' active' : '');
    btn.textContent = lv.name;
    btn.onclick = () => loadLevel(i);
    levelBar.appendChild(btn);
  });
}

function loadLevel(idx){
  currentLevel = idx;
  selectedColor = null;
  painted = {};
  statusEl.textContent = 'Selecciona un color y pinta las zonas';
  statusEl.className = 'status';
  renderLevelBar();
  renderCanvas();
  renderPalette();
}

function renderCanvas(){
  const lv = LEVELS[currentLevel];
  canvasEl.style.gridTemplateColumns = `repeat(${lv.cols}, var(--cell-size))`;
  canvasEl.style.gridTemplateRows = `repeat(${lv.rows}, var(--cell-size))`;
  canvasEl.innerHTML = '';

  lv.grid.forEach((row, r) => {
    row.forEach((colorKey, c) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      if(colorKey){
        const hex = COLORS[colorKey];
        cell.style.background = `radial-gradient(circle, ${hex} 3px, var(--cell-bg) 3px)`;
        cell.dataset.color = colorKey;
        cell.onclick = () => paintCell(r, c);
      } else {
        cell.classList.add('cell-empty');
      }
      canvasEl.appendChild(cell);
    });
  });
}

function renderPalette(){
  const colors = getLevelColors(LEVELS[currentLevel]);
  paletteEl.innerHTML = '';
  colors.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.style.background = COLORS[key];
    btn.dataset.paint = key;
    if(key === selectedColor) btn.classList.add('active');
    btn.onclick = () => {
      selectedColor = key;
      renderPalette();
    };
    paletteEl.appendChild(btn);
  });
}

function paintCell(r, c){
  if(!selectedColor) return;
  const key = `${r}-${c}`;
  if(painted[key]) return;

  const lv = LEVELS[currentLevel];
  const target = lv.grid[r][c];
  if(!target) return;

  if(target !== selectedColor){
    statusEl.textContent = '✖ Ese no es el color correcto para esta zona';
    return;
  }

  painted[key] = true;
  const idx = r * lv.cols + c;
  const cell = canvasEl.children[idx];
  cell.style.background = COLORS[target];
  cell.classList.add('painted', 'done');
  setTimeout(() => cell.classList.remove('done'), 300);

  statusEl.textContent = '✓ Bien! Sigue así';
  statusEl.className = 'status';
  checkWin();
}

function checkWin(){
  const lv = LEVELS[currentLevel];
  let total = 0, done = 0;
  lv.grid.forEach((row, r) => {
    row.forEach((colorKey, c) => {
      if(colorKey){
        total++;
        if(painted[`${r}-${c}`]) done++;
      }
    });
  });

  if(total > 0 && done === total){
    statusEl.textContent = '🎉 ¡Cuadro completado!';
    statusEl.className = 'status win';
    if(currentLevel < LEVELS.length - 1){
      setTimeout(() => loadLevel(currentLevel + 1), 1800);
    }
  }
}

renderLevelBar();
loadLevel(0);
