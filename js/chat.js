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

const STORAGE_KEY = 'danna_chat_history';

const messagesEl = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcome = document.getElementById('welcome');
const modelStatusEl = document.getElementById('modelStatus');
const modelStatusIcon = document.getElementById('modelStatusIcon');
const modelStatusText = document.getElementById('modelStatusText');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const downloadActions = document.getElementById('downloadActions');
const clearBtn = document.getElementById('clearBtn');

let aiEnabled = false;
let aiWelcomeShown = false;
let conversationHistory = [];

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
  } catch (e) {}
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        conversationHistory = parsed;
        conversationHistory.forEach(m => renderMessage(m.text, m.role, m.ts));
        return true;
      }
    }
  } catch (e) {}
  return false;
}

function getTime(ts) {
  const d = ts ? new Date(ts) : new Date();
  return d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
}

function renderMessage(text, role, ts) {
  welcome?.remove();

  const msg = document.createElement('div');
  msg.className = 'msg ' + role;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  if (role === 'user') {
    avatar.textContent = '👤';
  } else {
    const img = document.createElement('img');
    img.src = 'fotos/danna.png';
    img.className = 'avatar-img';
    avatar.appendChild(img);
  }

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = getTime(ts);

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  msg.appendChild(time);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addMessage(text, role) {
  const entry = { text, role, ts: Date.now() };
  conversationHistory.push(entry);
  saveHistory();
  renderMessage(text, role, entry.ts);
}

function setLoading(loading) {
  sendBtn.disabled = loading;
  sendBtn.textContent = loading ? '…' : '➤';

  const existing = messagesEl.querySelector('.typing');
  if (existing) existing.remove();

  if (loading) {
    const div = document.createElement('div');
    div.className = 'msg bot';
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    const img = document.createElement('img');
    img.src = 'fotos/danna.png';
    img.className = 'avatar-img';
    avatar.appendChild(img);
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

window.addEventListener('ai-model-status', (e) => {
  const { status, progress } = e.detail;
  if (!modelStatusEl) return;

  downloadActions.style.display = 'none';

  if (status === 'checking') {
    modelStatusIcon.textContent = '🔍';
    modelStatusText.textContent = 'Verificando si hay IA local disponible...';
    progressBar.style.display = 'none';
    modelStatusEl.style.display = 'flex';
  } else if (status === 'downloading') {
    modelStatusIcon.textContent = '⏳';
    modelStatusText.textContent = e.detail.message;
    progressBar.style.display = 'flex';
    progressFill.style.width = progress + '%';
    modelStatusEl.style.display = 'flex';
  } else if (status === 'ready') {
    modelStatusEl.style.display = 'none';
    aiEnabled = true;
    if (!aiWelcomeShown && conversationHistory.length === 0) {
      aiWelcomeShown = true;
      setTimeout(() => {
        addMessage('¡Hola! Soy tu asistente con IA local 🧠\n\nPuedo ayudarte con tus estudios, tareas, orientación vocacional o cualquier duda. Todo funciona directamente en tu navegador, sin enviar datos a internet. ¿En qué necesitas ayuda?', 'bot');
      }, 500);
    }
  } else if (status === 'error') {
    modelStatusEl.style.display = 'none';
    aiEnabled = false;
    if (!aiWelcomeShown && conversationHistory.length === 0) {
      aiWelcomeShown = true;
      setTimeout(() => {
        addMessage('¡Hola! 👋\n\nNo se pudo activar la IA local, pero igual puedo ayudarte con información sobre carreras, estudios y orientación vocacional. ¿En qué te puedo ayudar?', 'bot');
      }, 500);
    }
  } else if (status === 'needs-download') {
    modelStatusIcon.textContent = '🧠';
    modelStatusText.innerHTML =
      'Este chat puede usar <strong>inteligencia artificial directamente en tu navegador</strong>, sin enviar tus mensajes a ningún servidor. Es privada, gratuita y funciona completamente en tu equipo.<br><br>Para activarla, descarga el modelo (~300MB) <strong>solo la primera vez</strong>. ¿Quieres hacerlo?';
    progressBar.style.display = 'none';
    downloadActions.style.display = 'flex';
    modelStatusEl.style.display = 'flex';
  }
});

document.getElementById('btnDownloadYes').addEventListener('click', () => {
  modelStatusIcon.textContent = '⏳';
  modelStatusText.textContent = 'Descargando IA local... no recargues la página.';
  downloadActions.style.display = 'none';
  progressBar.style.display = 'flex';
  window.__startAIDownload?.();
});

document.getElementById('btnDownloadNo').addEventListener('click', () => {
  modelStatusEl.style.display = 'none';
  aiEnabled = false;
  if (!aiWelcomeShown && conversationHistory.length === 0) {
    aiWelcomeShown = true;
    addMessage('¡Hola! 🙌\n\nEstá bien, usaré el modo básico. Pregúntame sobre carreras, estudios u orientación vocacional. Si después quieres activar la IA local, recarga la página.', 'bot');
  }
});

clearBtn?.addEventListener('click', () => {
  if (conversationHistory.length === 0) return;
  conversationHistory = [];
  localStorage.removeItem(STORAGE_KEY);
  messagesEl.querySelectorAll('.msg').forEach(el => el.remove());
  welcome.style.display = 'flex';
  userInput.focus();
});

function localReply(text) {
  const t = text.toLowerCase();
  if (t.includes('hola') || t.includes('buenas') || t.includes('hey')) {
    return '¡Hola! ¿En qué puedo ayudarte? Pregúntame sobre carreras, estudios, tareas u orientación vocacional.';
  }
  if (t.includes('carrera') || t.includes('universidad') || t.includes('estudiar')) {
    return 'Para elegir carrera te recomiendo:\n\n1️⃣ Identifica tus fortalezas e intereses\n2️⃣ Investiga el campo laboral en Costa Rica\n3️⃣ Habla con profesionales del área\n4️⃣ Prueba la Ruta Vocacional 🌱 desde el inicio\n\n¿Quieres saber más sobre alguna carrera?';
  }
  if (t.includes('gracias')) {
    return '¡De nada! 😊 Explora la Ruta Vocacional 🌱 desde la página principal para descubrir carreras ideales para ti. ¡Éxito!';
  }
  if (t.includes('danna') || t.includes('eres') || t.includes('quien') || t.includes('quién')) {
    return 'Soy un asistente educativo. Esta página es de Danna Rivera, estudiante de Diseño en CEDES Don Bosco, Costa Rica. 🌟';
  }
  if (t.includes('materia') || t.includes('clase') || t.includes('curso') || t.includes('estudio') || t.includes('aprender')) {
    return 'Cuéntame qué materia o curso te interesa. También puedes usar la Ruta Vocacional 🌱 para descubrir carreras según tus intereses.';
  }
  if (t.includes('tarea') || t.includes('ayuda') || t.includes('necesito') || t.includes('puedes')) {
    return 'Claro, dime en qué necesitas ayuda y haré mi mejor esfuerzo por orientarte. Para orientación vocacional, la Ruta Vocacional 🌱 es ideal.';
  }
  if (t.includes('adiós') || t.includes('chao') || t.includes('bye') || t.includes('nos vemos') || t.includes('salir')) {
    return '¡Hasta luego! 😊 Si tienes más dudas, aquí estaré. ¡Mucho éxito en tus estudios!';
  }
  return 'Cuéntame más sobre eso. Si tienes dudas sobre carreras, estudios o necesitas orientación, puedo ayudarte. También prueba la Ruta Vocacional 🌱 desde la página principal.';
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = '';
  userInput.style.height = 'auto';
  addMessage(text, 'user');
  setLoading(true);

  let reply;
  if (aiEnabled) {
    const ctx = conversationHistory.slice(-8, -1);
    reply = await window.__aiGenerateResponse?.(text, ctx);
  }
  if (!reply) {
    await new Promise(r => setTimeout(r, 300 + Math.random() * 300));
    reply = localReply(text);
  }
  addMessage(reply, 'bot');
  setLoading(false);
}

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
});

sendBtn.addEventListener('click', sendMessage);

const hasHistory = loadHistory();
if (hasHistory) {
  aiWelcomeShown = true;
}
