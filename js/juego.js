function setTheme(t){
  document.documentElement.dataset.theme=t==='retro'?'retro':'';
  localStorage.setItem('theme',t)
}
(function(){
  const t=localStorage.getItem('theme')||'modern';
  document.documentElement.dataset.theme=t==='retro'?'retro':'';
})();

const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const gameArea=document.getElementById('gameArea');
const distEl=document.getElementById('dist');
const highScoreEl=document.getElementById('highScore');
const speedEl=document.getElementById('speed');
const overlay=document.getElementById('overlay');
const startScreen=document.getElementById('startScreen');
const gameOverScreen=document.getElementById('gameOverScreen');
const finalScore=document.getElementById('finalScore');
const finalBest=document.getElementById('finalBest');
const startBtn=document.getElementById('startBtn');
const restartBtn=document.getElementById('restartBtn');

const dannaImg=new Image();
dannaImg.src='fotos/danna.png';

let W,H;
let running=false,gameOver=false;
let dist=0,highScore=parseInt(localStorage.getItem('lumiPitScore'))||0;
highScoreEl.textContent=highScore;
let px,baseSpeed=4,maxSpeed=12,enemies=[];
let lastTime=0,spawnTimer=0,roadOffset=0;
let retro=false;

const CAR_W=38,CAR_H=64;
const LANE_COUNT=4;

function resize(){
  const r=gameArea.getBoundingClientRect();
  canvas.width=r.width;
  canvas.height=r.height;
  W=r.width;H=r.height;
  px=!running&&!gameOver?W/2-CAR_W/2:Math.min(px,W-CAR_W-10);
}

function rand(mn,mx){return Math.random()*(mx-mn)+mn}
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v))}

function spawnEnemy(){
  const laneW=(W-60)/LANE_COUNT;
  const lane=Math.floor(rand(0,LANE_COUNT));
  const x=30+lane*laneW+laneW/2-CAR_W/2;
  const w=28+rand(0,16),h=48+rand(0,20);
  enemies.push({x,y:-h-20,w,h,speed:baseSpeed+rand(0.5,1.5)+dist*0.0003,color:hsl(rand(0,360),60,50)});
}

function drawRoad(time){
  retro=document.documentElement.dataset.theme==='retro';
  if(retro){
    ctx.fillStyle='#808080';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#fff';ctx.lineWidth=2;
    ctx.strokeRect(15,0,2,H);ctx.strokeRect(W-17,0,2,H);
    ctx.setLineDash([20,16]);ctx.strokeStyle='#fff';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();
    ctx.setLineDash([]);
    return;
  }
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#2d2d2d');g.addColorStop(1,'#1a1a1a');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);

  ctx.fillStyle='#fff';ctx.globalAlpha=0.08;
  ctx.fillRect(0,0,W,3);ctx.fillRect(W-3,0,W,H);
  ctx.fillRect(0,0,3,H);ctx.fillRect(0,H-3,W,H);
  ctx.globalAlpha=1;

  ctx.fillStyle='#444';
  ctx.fillRect(20,0,2,H);ctx.fillRect(W-22,0,2,H);

  ctx.strokeStyle='rgba(255,255,255,0.25)';
  ctx.lineWidth=3;ctx.setLineDash([20,18]);
  for(let i=0;i<3;i++){
    const lx=28+(W-56)*(i+1)/4;
    ctx.beginPath();
    const yo=roadOffset%(20+18);
    ctx.moveTo(lx,-yo);ctx.lineTo(lx,H);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawCar(x,y,w,h,color,driver){
  ctx.save();ctx.translate(x+w/2,y+h/2);
  retro=document.documentElement.dataset.theme==='retro';
  if(retro){
    ctx.fillStyle='#c0c0c0';ctx.strokeStyle='#000';ctx.lineWidth=1.5;
    ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeRect(-w/2,-h/2,w,h);
    ctx.fillStyle='#fff';ctx.fillRect(-w/2+4,-h/2+4,w-8,h-8);
    ctx.strokeStyle='#000';ctx.strokeRect(-w/2+4,-h/2+4,w-8,h-8);
    ctx.restore();return;
  }
  const g=ctx.createLinearGradient(0,-h/2,0,h/2);
  g.addColorStop(0,color);g.addColorStop(0.5,adjustBrightness(color,30));g.addColorStop(1,color);
  ctx.fillStyle=g;
  ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,8);ctx.fill();

  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.fillRect(-w/2+3,-h/2+8,w-6,12);
  ctx.fillRect(-w/2+3,h/2-20,w-6,12);

  if(driver&&dannaImg.complete&&dannaImg.naturalWidth>0){
    ctx.save();
    ctx.beginPath();ctx.arc(0,-4,12,0,Math.PI*2);ctx.clip();
    ctx.drawImage(dannaImg,-12,-16,24,24);
    ctx.restore();
    ctx.strokeStyle='#ff69b4';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(0,-4,12,0,Math.PI*2);ctx.stroke();
  }else{
    ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('👤',0,-3);
  }

  ctx.fillStyle='rgba(255,255,0,0.7)';
  ctx.fillRect(-w/2+2,-h/2+2,5,4);
  ctx.fillRect(w/2-7,-h/2+2,5,4);
  ctx.fillStyle='rgba(255,0,0,0.7)';
  ctx.fillRect(-w/2+2,h/2-6,5,4);
  ctx.fillRect(w/2-7,h/2-6,5,4);
  ctx.restore();
}

function adjustBrightness(hex,amt){
  const c=parseInt(hex.slice(1),16);
  const r=Math.min(255,(c>>16)+amt);
  const g=Math.min(255,((c>>8)&0xff)+amt);
  const b=Math.min(255,(c&0xff)+amt);
  return `rgb(${r},${g},${b})`;
}

function hit(){
  running=false;gameOver=true;
  const finalDist=Math.floor(dist);
  if(finalDist>highScore){highScore=finalDist;localStorage.setItem('lumiPitScore',highScore);highScoreEl.textContent=highScore}
  setTimeout(()=>{
    finalScore.textContent=finalDist;
    finalBest.textContent=highScore;
    gameOverScreen.style.display='flex';startScreen.style.display='none';overlay.style.display='flex';
  },500);
}

function resetGame(){
  enemies=[];dist=0;spawnTimer=0;baseSpeed=4;
  gameOverScreen.style.display='none';startScreen.style.display='flex';overlay.style.display='flex';
  running=false;gameOver=false;distEl.textContent='0';speedEl.textContent='0';
}

function startGame(){
  resetGame();
  px=W/2-CAR_W/2;
  overlay.style.display='none';startScreen.style.display='none';gameOverScreen.style.display='none';
  running=true;gameOver=false;lastTime=0;
  loop(0);
}

const keys={};
document.addEventListener('keydown',e=>{
  keys[e.key]=true;
  if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!running)startGame()}
});
document.addEventListener('keyup',e=>{keys[e.key]=false});

function loop(time){
  if(!running)return;
  const dt=lastTime?Math.min(time-lastTime,50)/16:1;
  lastTime=time;

  dist+=dt*0.15*(baseSpeed/4);
  distEl.textContent=Math.floor(dist);

  const spd=Math.min(baseSpeed+dist*0.001,maxSpeed);
  baseSpeed=Math.min(baseSpeed+dt*0.002,maxSpeed);
  speedEl.textContent=Math.floor(spd*18);

  if(keys['ArrowLeft']||keys['a']||keys['A'])px-=spd*0.7*dt;
  if(keys['ArrowRight']||keys['d']||keys['D'])px+=spd*0.7*dt;
  px=clamp(px,20,W-CAR_W-20);

  roadOffset+=spd*dt;

  spawnTimer+=dt*16;
  const si=Math.max(500,1800-dist*0.3);
  if(spawnTimer>=si){spawnTimer=0;if(enemies.length<10)spawnEnemy()}

  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];
    e.y+=e.speed*dt;
    if(e.y>H+50){enemies.splice(i,1);continue}
  }

  const pr=8;
  for(const e of enemies){
    if(px+pr<e.x+e.w-pr&&px+CAR_W-pr>e.x+pr&&
       H-CAR_H+pr<e.y+e.h-pr&&H-pr>e.y+pr){hit();return}
  }

  drawRoad(time);
  for(const e of enemies)drawCar(e.x,e.y,e.w,e.h,e.color,false);
  drawCar(px,H-CAR_H,CAR_W,CAR_H,'#e74c3c',true);

  requestAnimationFrame(loop);
}

startBtn.addEventListener('click',startGame);
restartBtn.addEventListener('click',startGame);
gameArea.addEventListener('touchstart',e=>{
  e.preventDefault();
  const t=e.changedTouches[0],r=gameArea.getBoundingClientRect();
  px=clamp(t.clientX-r.left-CAR_W/2,20,W-CAR_W-20);
  if(!running)startGame();
},{passive:false});
gameArea.addEventListener('touchmove',e=>{
  e.preventDefault();
  const t=e.changedTouches[0],r=gameArea.getBoundingClientRect();
  px=clamp(t.clientX-r.left-CAR_W/2,20,W-CAR_W-20);
},{passive:false});

window.addEventListener('resize',resize);
resize();
resetGame();

if(!('roundRect'in ctx)){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    if(r>w/2)r=w/2;if(r>h/2)r=h/2;
    this.moveTo(x+r,y);this.lineTo(x+w-r,y);
    this.quadraticCurveTo(x+w,y,x+w,y+r);
    this.lineTo(x+w,y+h-r);
    this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    this.lineTo(x+r,y+h);
    this.quadraticCurveTo(x,y+h,x,y+h-r);
    this.lineTo(x,y+r);
    this.quadraticCurveTo(x,y,x+r,y);
    this.closePath();return this;
  };
}
