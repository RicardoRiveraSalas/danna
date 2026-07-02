
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
const messages = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcome = document.getElementById('welcome');

function addMessage(text, role) {
  welcome?.remove();
  const msg = document.createElement('div');
  msg.className = 'msg ' + role;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function setLoading(loading) {
  sendBtn.disabled = loading;
  sendBtn.textContent = loading ? '…' : '➤';

  const existing = messages.querySelector('.typing');
  if (existing) existing.remove();

  if (loading) {
    const div = document.createElement('div');
    div.className = 'msg bot';
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    div.appendChild(bubble);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
}

function localReply(text) {
  const t = text.toLowerCase();
  if (t.includes('hola') || t.includes('buenas')) {
    return '¡Hola! ¿En qué puedo ayudarte? Pregúntame sobre carreras, estudios o cualquier duda.';
  }
  if (t.includes('carrera') || t.includes('universidad') || t.includes('estudiar')) {
    return 'Para elegir carrera te recomiendo:\n1. Identifica tus fortalezas\n2. Investiga el campo laboral en Costa Rica\n3. Habla con profesionales\n\nPrueba la Ruta Vocacional 🌱 desde la página principal.';
  }
  if (t.includes('gracias')) {
    return '¡De nada! 😊 Aquí estoy para lo que necesites.';
  }
  if (t.includes('danna') || t.includes('eres') || t.includes('quien')) {
    return 'Soy un asistente creado para ayudarte. Esta página es de Danna Rivera, estudiante de Diseño en CEDES Don Bosco Costa Rica.';
  }
  return 'Interesante pregunta. Puedes explorar la Ruta Vocacional 🌱 en la página principal para descubrir carreras ideales para ti.';
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = '';
  addMessage(text, 'user');
  setLoading(true);

  await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
  addMessage(localReply(text), 'bot');

  setLoading(false);
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
