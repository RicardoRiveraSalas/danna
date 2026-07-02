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
const images=[
  'fotos/img1.webp','fotos/img2.webp','fotos/img3.webp','fotos/img4.png',
  'fotos/img5.jpg','fotos/img6.png','fotos/img7.png','fotos/img8.png',
  'fotos/img9.png','fotos/img10.png','fotos/img11.png','fotos/img12.png',
  'fotos/img13.png','fotos/img14.png','fotos/img15.png','fotos/img16.png',
  'fotos/img17.png','fotos/img18.png','fotos/img19.png','fotos/img20.png',
  'fotos/img21.png','fotos/img22.png','fotos/img23.png','fotos/img24.png',
  'fotos/img25.png','fotos/img26.png','fotos/img27.png','fotos/img28.png'
];
const container=document.getElementById('gallery');
images.forEach((src,i)=>{
  const div=document.createElement('div');
  div.className='seed';
  const x=Math.random()*90;
  const y=Math.random()*85;
  const size=60+Math.random()*50;
  const dur=6+Math.random()*6;
  const delay=Math.random()*5;
  div.style.left=x+'%';
  div.style.top=y+'%';
  div.style.width=size+'px';
  div.style.height=size+'px';
  div.style.animationDuration=dur+'s';
  div.style.animationDelay=delay+'s';
  const img=document.createElement('img');
  img.src=src;
  img.alt='img'+(i+1);
  div.appendChild(img);
  container.appendChild(div);
});
const modal=document.getElementById('modal');
const modalImg=document.getElementById('modalImg');
container.addEventListener('click',e=>{
  const seed=e.target.closest('.seed');
  if(!seed)return;
  modalImg.src=seed.querySelector('img').src;
  modal.classList.add('active');
});
modal.addEventListener('click',()=>{
  modal.classList.remove('active');
  modalImg.src='';
});

