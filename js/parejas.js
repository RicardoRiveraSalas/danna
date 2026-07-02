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

const IMGS=[
  'fotos/img1.webp','fotos/img2.webp','fotos/img3.webp','fotos/img4.png',
  'fotos/img5.jpg','fotos/img6.png','fotos/img7.png','fotos/img8.png',
  'fotos/img9.png','fotos/img10.png','fotos/img11.png','fotos/img12.png',
  'fotos/img13.png','fotos/img14.png','fotos/img15.png','fotos/img16.png',
  'fotos/img17.png','fotos/img18.png','fotos/img19.png','fotos/img20.png',
  'fotos/img21.png','fotos/img22.png','fotos/img23.png','fotos/img24.png',
  'fotos/img25.png','fotos/img26.png','fotos/img27.png','fotos/img28.png'
];
const AVATAR='fotos/danna.png';
const BASE_PAIRS=6;

const board=document.getElementById('board');
const levelEl=document.getElementById('level');
const pairsEl=document.getElementById('pairs');
const totalPairsEl=document.getElementById('totalPairs');
const movesEl=document.getElementById('moves');
const overlay=document.getElementById('overlay');
const startScreen=document.getElementById('startScreen');
const winScreen=document.getElementById('winScreen');
const winLevel=document.getElementById('winLevel');
const winStats=document.getElementById('winStats');
const startBtn=document.getElementById('startBtn');
const nextBtn=document.getElementById('nextBtn');

let level=1;
let numPairs=BASE_PAIRS;
let cards=[];
let flipped=[];
let matched=0;
let moves=0;
let locked=false;
let gameRunning=false;

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function buildCards(){
  const n=Math.min(numPairs,IMGS.length);
  const chosen=shuffle([...IMGS]).slice(0,n);
  const deck=[];
  chosen.forEach((src,i)=>{
    deck.push({id:i,src,flipped:false,matched:false});
    deck.push({id:i,src,flipped:false,matched:false});
  });
  return shuffle(deck);
}

function render(){
  board.innerHTML='';
  const n=cards.length;
  let cols;
  if(n<=12)cols=4;
  else if(n<=16)cols=4;
  else if(n<=20)cols=5;
  else cols=6;
  const rows=Math.ceil(n/cols);
  board.style.gridTemplateColumns=`repeat(${cols},1fr)`;
  board.style.gridTemplateRows=`repeat(${rows},auto)`;

  cards.forEach((c,i)=>{
    const card=document.createElement('div');
    card.className='card'+(c.flipped||c.matched?' flipped':'');
    card.dataset.idx=i;

    const inner=document.createElement('div');
    inner.className='card-inner';

    const front=document.createElement('div');
    front.className='card-front';
    const fi=document.createElement('img');
    fi.src=AVATAR;
    fi.alt='';
    front.appendChild(fi);

    const back=document.createElement('div');
    back.className='card-back';
    const bi=document.createElement('img');
    bi.src=c.src;
    bi.alt='';
    bi.loading='lazy';
    back.appendChild(bi);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    if(!c.matched){
      card.addEventListener('click',()=>flip(i));
    }
    board.appendChild(card);
  });
  updateHUD();
}

function flip(idx){
  if(locked||!gameRunning)return;
  const c=cards[idx];
  if(c.flipped||c.matched)return;
  if(flipped.length>=2)return;

  c.flipped=true;
  flipped.push(idx);
  const el=board.children[idx];
  if(el)el.classList.add('flipped');

  if(flipped.length===2){
    moves++;
    movesEl.textContent=moves;
    checkMatch();
  }
}

function checkMatch(){
  locked=true;
  const [a,b]=flipped;
  if(cards[a].id===cards[b].id){
    cards[a].matched=true;
    cards[b].matched=true;
    matched+=2;
    pairsEl.textContent=matched/2;
    flipped=[];
    locked=false;
    if(matched===cards.length)win();
  }else{
    setTimeout(()=>{
      cards[a].flipped=false;
      cards[b].flipped=false;
      const ea=board.children[a];
      const eb=board.children[b];
      if(ea)ea.classList.remove('flipped');
      if(eb)eb.classList.remove('flipped');
      flipped=[];
      locked=false;
    },900);
  }
}

function win(){
  gameRunning=false;
  setTimeout(()=>{
    winLevel.textContent=level;
    winStats.textContent=numPairs+' pares en '+moves+' movimientos';
    winScreen.style.display='flex';
    startScreen.style.display='none';
    overlay.style.display='flex';
  },500);
}

function nextLevel(){
  level++;
  numPairs++;
  winScreen.style.display='none';
  startScreen.style.display='none';
  overlay.style.display='none';
  initLevel();
}

function initLevel(){
  const n=Math.min(numPairs,IMGS.length);
  cards=buildCards();
  matched=0;
  moves=0;
  flipped=[];
  locked=false;
  gameRunning=true;
  levelEl.textContent=level;
  pairsEl.textContent='0';
  totalPairsEl.textContent=n;
  movesEl.textContent='0';
  render();
}

function startGame(){
  level=1;
  numPairs=BASE_PAIRS;
  overlay.style.display='none';
  startScreen.style.display='none';
  winScreen.style.display='none';
  initLevel();
}

startBtn.addEventListener('click',startGame);
nextBtn.addEventListener('click',nextLevel);

if(!CSS.supports('aspect-ratio',1)){
  document.documentElement.classList.add('no-aspect-ratio');
}
