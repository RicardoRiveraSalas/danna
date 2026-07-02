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
const scoreEl=document.getElementById('score');
const highScoreEl=document.getElementById('highScore');
const overlay=document.getElementById('overlay');
const startScreen=document.getElementById('startScreen');
const gameOverScreen=document.getElementById('gameOverScreen');
const finalScore=document.getElementById('finalScore');
const finalBest=document.getElementById('finalBest');
const startBtn=document.getElementById('startBtn');
const restartBtn=document.getElementById('restartBtn');

const witchImg=new Image();
witchImg.src='fotos/danna.png';

const R=26;
let W,H;
let running=false,gameOver=false;
let score=0,highScore=parseInt(localStorage.getItem('lumiHighScore'))||0;
highScoreEl.textContent=highScore;
let px,py,tx,ty;
let obstacles=[],particles=[],stars=[];
let difficulty=1,lastSpawn=0,lastTime=0,shakeTimer=0,shakeInt=0,frameState='idle',bobPhase=0;

function resize(){
  const rect=gameArea.getBoundingClientRect();
  canvas.width=rect.width;
  canvas.height=rect.height;
  W=rect.width;
  H=rect.height;
  if(!running&&!gameOver){px=70;py=H/2;tx=px;ty=py}
}
function rand(min,max){return Math.random()*(max-min)+min}
function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

function spawnObstacle(){
  const w=28+rand(0,24),h=28+rand(0,32);
  obstacles.push({
    x:W,y:rand(30,H-h-30),w,h,
    speed:2.5+difficulty*0.003*2,
    type:Math.floor(rand(0,3))
  });
}

function spawnParticles(x,y,n,color){
  for(let i=0;i<n;i++){
    const a=rand(0,Math.PI*2),s=rand(1,4);
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:0.015+rand(0,0.02),size:rand(3,7),color});
  }
}

function drawWitch(x,y,state,time){
  const retro=document.documentElement.dataset.theme==='retro';
  const bob=state==='idle'?Math.sin(time/400)*3:0;
  const fy=y+bob;
  let tilt=0,scaleX=1,broomAngle=-8,broomLen=70;
  switch(state){
    case 'up':tilt=-12;broomAngle=-22;broomLen=66;break;
    case 'down':tilt=14;broomAngle=3;broomLen=74;break;
    case 'dodge':tilt=-22;scaleX=0.83;broomAngle=-28;broomLen=68;break;
    case 'hit':tilt=Math.sin(time/50)*15;broomAngle=-30+Math.sin(time/40)*10;broomLen=58;break;
    default:tilt=0;broomAngle=-8;broomLen=70;
  }

  ctx.save();
  ctx.translate(x,y);
  ctx.translate(R,R);

  const shake=shakeTimer>0?(Math.random()-0.5)*shakeInt:0;
  ctx.translate(shake,0);

  ctx.rotate(tilt*Math.PI/180);
  if(state==='dodge')ctx.scale(scaleX,1);

  const broomX=-8,broomY=state==='down'?8:state==='up'?-6:2;
  const ba=broomAngle*Math.PI/180;
  ctx.save();
  ctx.translate(broomX,broomY);
  ctx.rotate(ba);
  const bGrad=ctx.createLinearGradient(0,0,broomLen,0);
  bGrad.addColorStop(0,'#8B6914');
  bGrad.addColorStop(0.4,'#C8A84E');
  bGrad.addColorStop(1,'#8B6914');
  ctx.fillStyle=retro?'#8B6914':bGrad;
  ctx.strokeStyle=retro?'#000':'transparent';
  ctx.lineWidth=retro?1:0;
  ctx.beginPath();
  ctx.roundRect(0,-3,broomLen,6,3);
  ctx.fill();
  if(retro)ctx.stroke();
  ctx.fillStyle=retro?'#8B6914':'#d4a030';
  ctx.beginPath();
  ctx.arc(broomLen-2,0,8,0,Math.PI*2);
  ctx.fill();
  if(retro){ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.stroke()}
  ctx.restore();

  ctx.save();
  const r=retro?0:R;
  ctx.beginPath();
  ctx.arc(0,0,R,0,Math.PI*2);
  ctx.clip();
  if(witchImg.complete&&witchImg.naturalWidth>0){
    ctx.drawImage(witchImg,-R,-R,R*2,R*2);
  }else{
    ctx.fillStyle='#ff69b4';ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='24px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🧙',0,2);
  }
  ctx.restore();

  if(!retro){
    ctx.strokeStyle='#ff69b4';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#00bfff';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(2,2,R-1,0,Math.PI*2);ctx.stroke();
  }else{
    ctx.strokeStyle='#000080';ctx.lineWidth=2;
    ctx.strokeRect(-R,-R,R*2,R*2);
  }

  if(!retro){
    const g=ctx.createRadialGradient(0,0,R*0.3,0,0,R+8);
    g.addColorStop(0,'rgba(255,105,180,0.15)');
    g.addColorStop(1,'rgba(255,105,180,0)');
    ctx.fillStyle=g;
    ctx.beginPath();ctx.arc(0,0,R+8,0,Math.PI*2);ctx.fill();
  }

  ctx.restore();

  if(state==='idle'&&!retro){
    ctx.save();
    ctx.globalAlpha=0.08+Math.sin(time/600)*0.04;
    ctx.fillStyle='#fff';
    for(let i=0;i<3;i++){
      const sx=x+R+8+Math.sin(time/800+i*2)*12;
      const sy=fy+R-10+i*10+Math.sin(time/500+i)*4;
      ctx.beginPath();ctx.arc(sx,sy,1.5+Math.sin(time/300+i)*0.5,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  return fy;
}

function drawStars(time){
  for(let i=stars.length-1;i>=0;i--){
    const s=stars[i];
    s.life-=0.02;
    if(s.life<=0){stars.splice(i,1);continue}
    ctx.save();
    ctx.globalAlpha=s.life;
    ctx.translate(s.x,s.y);
    ctx.rotate(time/300+i);
    ctx.fillStyle=s.color;
    ctx.font='18px sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('✦',0,0);
    ctx.restore();
  }
}

function drawObstacles(time){
  for(const o of obstacles){
    ctx.save();
    const retro=document.documentElement.dataset.theme==='retro';
    ctx.translate(o.x+o.w/2,o.y+o.h/2);
    ctx.rotate(time/1000+o.x*0.01);
    if(retro){
      ctx.fillStyle='#c0c0c0';
      ctx.strokeStyle='#000';
      ctx.lineWidth=1;
      ctx.fillRect(-o.w/2,-o.h/2,o.w,o.h);
      ctx.strokeRect(-o.w/2,-o.h/2,o.w,o.h);
    }else if(o.type===0){
      const g=ctx.createLinearGradient(-o.w/2,-o.h/2,o.w/2,o.h/2);
      g.addColorStop(0,'#ff6b6b');g.addColorStop(1,'#ee5a24');
      ctx.fillStyle=g;
      ctx.beginPath();ctx.roundRect(-o.w/2,-o.h/2,o.w,o.h,6);ctx.fill();
    }else if(o.type===1){
      const g=ctx.createRadialGradient(0,0,2,0,0,o.w/2);
      g.addColorStop(0,'#a29bfe');g.addColorStop(1,'#6c5ce7');
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(0,0,o.w/2,0,Math.PI*2);ctx.fill();
    }else{
      const g=ctx.createLinearGradient(-o.w/2,-o.h/2,o.w/2,o.h/2);
      g.addColorStop(0,'#fd79a8');g.addColorStop(1,'#e84393');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.moveTo(0,-o.h/2);ctx.lineTo(o.w/2,0);
      ctx.lineTo(0,o.h/2);ctx.lineTo(-o.w/2,0);
      ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }
}

function drawParticles(){
  for(const p of particles){
    ctx.save();
    ctx.globalAlpha=clamp(p.life,0,1);
    ctx.fillStyle=p.color;
    ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}

function drawBG(time){
  const retro=document.documentElement.dataset.theme==='retro';
  if(retro){
    ctx.fillStyle='#808080';
    ctx.fillRect(0,0,W,H);
    return;
  }
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1a1a3e');
  g.addColorStop(0.4,'#2a1a4e');
  g.addColorStop(1,'#1a2a3e');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,W,H);

  ctx.fillStyle='rgba(100,80,200,0.06)';
  ctx.fillRect(0,0,W,H*0.5);

  for(let i=0;i<5;i++){
    const sx=(i*137+time/2000)%W-W/2;
    const sy=H*0.15+Math.sin(time/3000+i*2)*20;
    ctx.fillStyle=`hsla(${220+i*30},40%,70%,${0.04+Math.sin(time/2000+i)*0.02})`;
    ctx.beginPath();ctx.arc(sx,sy,12+i*8,0,Math.PI*2);ctx.fill();
  }
}

function hit(){
  running=false;gameOver=true;
  shakeTimer=400;shakeInt=12;
  frameState='hit';
  spawnParticles(px+R,py+R,30,'#ff69b4');
  spawnParticles(px+R,py+R,20,'#00bfff');
  for(let i=0;i<6;i++){
    const a=(i/6)*Math.PI*2;
    stars.push({x:px+R,y:py+R-16,life:1,color:'#FFD700',vx:Math.cos(a)*2,vy:Math.sin(a)*2});
  }
  const s=Math.floor(score);
  if(s>highScore){highScore=s;localStorage.setItem('lumiHighScore',highScore);highScoreEl.textContent=highScore}
  setTimeout(()=>{
    finalScore.textContent=s;
    finalBest.textContent=highScore;
    gameOverScreen.style.display='flex';
    startScreen.style.display='none';
    overlay.style.display='flex';
  },700);
}

function resetGame(){
  obstacles=[];particles=[];stars=[];
  score=0;difficulty=1;lastSpawn=0;lastTime=0;shakeTimer=0;frameState='idle';
  gameOverScreen.style.display='none';startScreen.style.display='flex';overlay.style.display='flex';
  running=false;gameOver=false;
  scoreEl.textContent='0';
}

function startGame(){
  resetGame();
  px=70;py=H/2;tx=px;ty=py;
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
  difficulty+=dt*0.005;
  score+=dt*0.1;
  scoreEl.textContent=Math.floor(score);

  const spd=5;
  let dx=0,dy=0;
  if(keys['ArrowUp']||keys['w']||keys['W'])dy=-spd;
  if(keys['ArrowDown']||keys['s']||keys['S'])dy=spd;
  if(keys['ArrowLeft']||keys['a']||keys['A'])dx=-spd;
  if(keys['ArrowRight']||keys['d']||keys['D'])dx=spd;
  if(dx||dy){const l=Math.sqrt(dx*dx+dy*dy);dx=dx/l*spd;dy=dy/l*spd}
  tx=clamp(tx+dx,10,W-60);ty=clamp(ty+dy,10,H-60);
  px=lerp(px,tx,0.12*dt);py=lerp(py,ty,0.12*dt);

  const moving=Math.abs(tx-px)>1||Math.abs(ty-py)>1;
  if(!moving)frameState='idle';
  else{
    const ddx=tx-px,ddy=ty-py;
    if(Math.abs(ddx)>Math.abs(ddy)*1.5&&Math.abs(ddx)>15)frameState='dodge';
    else if(ddy<-5)frameState='up';
    else if(ddy>5)frameState='down';
    else frameState='idle';
  }

  const si=Math.max(700,1800-difficulty*4);
  lastSpawn=Math.min(lastSpawn+dt*16,si*1.5);
  if(lastSpawn>=si){lastSpawn=0;if(obstacles.length<12)spawnObstacle()}

  for(let i=obstacles.length-1;i>=0;i--){
    const o=obstacles[i];
    o.x-=o.speed*dt;
    if(o.x+o.w<-30){obstacles.splice(i,1);continue}
    o.y+=Math.sin(time/500+i)*0.5*dt;
  }

  const pr=R-4;
  for(let i=obstacles.length-1;i>=0;i--){
    const o=obstacles[i];
    const cx=o.x+o.w/2,cy=o.y+o.h/2;
    if(Math.abs(px+R-cx)<o.w/2+pr&&Math.abs(py+R-cy)<o.h/2+pr){hit();return}
  }

  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    p.vy+=0.08*dt;p.life-=p.decay*dt;
    if(p.life<=0)particles.splice(i,1);
  }

  drawBG(time);
  drawObstacles(time);
  drawParticles();
  drawStars(time);
  const fy=drawWitch(px,py,frameState,time);

  if(shakeTimer>0)shakeTimer-=dt*16;

  requestAnimationFrame(loop);
}

startBtn.addEventListener('click',startGame);
restartBtn.addEventListener('click',startGame);
gameArea.addEventListener('touchstart',e=>{
  e.preventDefault();
  const t=e.changedTouches[0],r=gameArea.getBoundingClientRect();
  tx=t.clientX-r.left-R;ty=t.clientY-r.top-R;
  if(!running)startGame();
},{passive:false});
gameArea.addEventListener('touchmove',e=>{
  e.preventDefault();
  const t=e.changedTouches[0],r=gameArea.getBoundingClientRect();
  tx=clamp(t.clientX-r.left-R,10,W-60);ty=clamp(t.clientY-r.top-R,10,H-60);
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
    this.closePath();
    return this;
  };
}
