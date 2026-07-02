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
let currentIndex=0;

images.forEach((src,i)=>{
  const div=document.createElement('div');
  div.className='seed';
  div.dataset.index=i;
  div.setAttribute('role','button');
  div.setAttribute('tabindex','0');
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
const modalBody=document.getElementById('modalBody');
const modalImg=document.getElementById('modalImg');
const modalCounter=document.getElementById('modalCounter');
const modalPrev=document.getElementById('modalPrev');
const modalNext=document.getElementById('modalNext');

function openModal(idx){
  currentIndex=idx;
  modalImg.src=images[currentIndex];
  modal.classList.add('active');
  modalCounter.textContent=(currentIndex+1)+' / '+images.length;
}

function closeModal(){
  modal.classList.remove('active');
  modalImg.src='';
}

function prevPhoto(){
  currentIndex=(currentIndex-1+images.length)%images.length;
  modalImg.src=images[currentIndex];
  modalCounter.textContent=(currentIndex+1)+' / '+images.length;
}

function nextPhoto(){
  currentIndex=(currentIndex+1)%images.length;
  modalImg.src=images[currentIndex];
  modalCounter.textContent=(currentIndex+1)+' / '+images.length;
}

function onSeedClick(e) {
  const seed = e.target.closest('.seed');
  if (!seed) return;
  openModal(parseInt(seed.dataset.index));
}

container.addEventListener('click', onSeedClick);
container.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const seed = e.target.closest('.seed');
    if (seed) { e.preventDefault(); openModal(parseInt(seed.dataset.index)) }
  }
});

modal.addEventListener('click',e=>{
  if(e.target===modal)closeModal();
});
modalBody.addEventListener('click',e=>e.stopPropagation());
modalPrev.addEventListener('click',prevPhoto);
modalNext.addEventListener('click',nextPhoto);

document.addEventListener('keydown',e=>{
  if(!modal.classList.contains('active'))return;
  if(e.key==='ArrowRight')nextPhoto();
  if(e.key==='ArrowLeft')prevPhoto();
  if(e.key==='Escape')closeModal();
});
