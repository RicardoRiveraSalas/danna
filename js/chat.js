const STORAGE_KEY = 'danna_chat_history';

const messagesEl = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcome = document.getElementById('welcome');
const statusBar = document.getElementById('statusBar');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const clearBtn = document.getElementById('clearBtn');
const iaBadge = document.getElementById('iaBadge');
const aiBackend = document.getElementById('aiBackend');

let conversationHistory = [];
let noAiWarningShown = false;
let suppressReadyMessage = true;

function saveHistory() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory)); } catch (e) {}
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
    avatar.textContent = '\U0001f464';
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

function updateBadge(backend, status) {
  if (!iaBadge) return;
  const map = {
    gemini: { icon: '\u2728', label: 'Gemini Nano' },
    webllm: { icon: '\u{1F9E0}', label: 'WebLLM' },
    transformers: { icon: '\u{1F916}', label: 'Transformers.js' },
    off: { icon: '\u{1F310}', label: 'Sin IA' }
  };
  let cls, text;
  if (status === 'loading' || status === 'downloading') {
    cls = 'ia-loading';
    text = '\u23f3 Cargando...';
  } else if (backend && map[backend]) {
    cls = 'ia-active';
    text = map[backend].icon + ' ' + map[backend].label;
  } else {
    cls = 'ia-inactive';
    text = map.off.icon + ' ' + map.off.label;
  }
  iaBadge.textContent = text;
  iaBadge.className = 'badge ' + cls;
}

function setLoading(loading) {
  sendBtn.disabled = loading;
  sendBtn.textContent = loading ? '\u2026' : '\u27a4';
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

// ── Status events from chat-ai.js ──

window.addEventListener('ai-status', (e) => {
  const { status, message } = e.detail;

  if (status === 'nogpu') {
    statusBar.style.display = 'none';
    updateBadge('off', '');
  } else if (status === 'downloading') {
    statusIcon.textContent = '\u23f3';
    statusText.textContent = message || 'Descargando...';
    progressBar.style.display = 'flex';
    statusBar.style.display = 'flex';
    const pctMatch = message?.match(/(\d+)%/);
    if (pctMatch) progressFill.style.width = pctMatch[1] + '%';
    updateBadge(window.__ai.currentBackendId, 'loading');
  } else if (status === 'ready') {
    statusBar.style.display = 'none';
    progressBar.style.display = 'none';
    updateBadge(message || window.__ai.currentBackendId, '');
    if (suppressReadyMessage) return;
    if (message === 'gemini') {
      setTimeout(() => addMessage(window.__ai.prompts.readyGemini, 'bot'), 400);
    } else if (message === 'webllm') {
      setTimeout(() => addMessage(window.__ai.prompts.readyWebLLM, 'bot'), 400);
    } else if (message === 'transformers') {
      setTimeout(() => addMessage(window.__ai.prompts.readyTransformers, 'bot'), 400);
    }
  } else if (status === 'error') {
    statusBar.style.display = 'none';
    progressBar.style.display = 'none';
    updateBadge('off', '');
    addMessage(message || 'Error al cargar la IA. Usare respuestas predefinidas.', 'bot');
    // Auto-cambiar selector a 'off' cuando falla un backend
    if (aiBackend && aiBackend.value !== 'off') {
      aiBackend.value = 'off';
    }
  }
});

// ── Fallback ──

function localReply(text) {
  const t = text.toLowerCase();
  if (t.includes('hola') || t.includes('buenas') || t.includes('hey')) {
    return 'Hola! En que puedo ayudarte? Preguntame sobre carreras, estudios, tareas u orientacion vocacional.';
  }
  if (t.includes('carrera') || t.includes('universidad') || t.includes('estudiar')) {
    return 'Para elegir carrera te recomiendo:\n\n1° Identifica tus fortalezas e intereses\n2° Investiga el campo laboral en Costa Rica\n3° Habla con profesionales del area\n4° Prueba la Ruta Vocacional  desde el inicio\n\nQuieres saber mas sobre alguna carrera?';
  }
  if (t.includes('gracias')) {
    return 'De nada!  Explora la Ruta Vocacional  desde la pagina principal para descubrir carreras ideales para ti. Exito!';
  }
  if (t.includes('danna') || t.includes('eres') || t.includes('quien') || t.includes('quien')) {
    return 'Soy un asistente educativo. Esta pagina es de Danna Rivera, estudiante de Diseno en CEDES Don Bosco, Costa Rica. ';
  }
  if (t.includes('materia') || t.includes('clase') || t.includes('curso') || t.includes('estudio') || t.includes('aprender')) {
    return 'Cuantame que materia o curso te interesa. Tambien puedes usar la Ruta Vocacional  para descubrir carreras segun tus intereses.';
  }
  if (t.includes('tarea') || t.includes('ayuda') || t.includes('necesito') || t.includes('puedes')) {
    return 'Claro, dime en que necesitas ayuda y hare mi mejor esfuerzo por orientarte. Para orientacion vocacional, la Ruta Vocacional  es ideal.';
  }
  if (t.includes('adios') || t.includes('chao') || t.includes('bye') || t.includes('nos vemos') || t.includes('salir')) {
    return 'Hasta luego!  Si tienes mas dudas, aqui estare. Mucho exito en tus estudios!';
  }
  return 'Cuantame mas sobre eso. Si tienes dudas sobre carreras, estudios o necesitas orientacion, puedo ayudarte. Tambien prueba la Ruta Vocacional  desde la pagina principal.';
}

// ── Envio ──

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = '';
  userInput.style.height = 'auto';
  addMessage(text, 'user');
  setLoading(true);

  let reply = null;
  if (window.__ai.isReady) {
    const ctx = conversationHistory.slice(-8, -1);
    reply = await window.__ai.generateReply(text, ctx);
  }
  if (!reply) {
    if (!noAiWarningShown && window.__ai.currentBackendId !== 'off') {
      addMessage('La IA no esta disponible en este momento. Usando respuestas predefinidas.', 'system');
      noAiWarningShown = true;
    } else if (!noAiWarningShown) {
      addMessage('Modo sin IA activo. Selecciona un motor de IA arriba para obtener respuestas personalizadas.', 'system');
      noAiWarningShown = true;
    }
    await new Promise(r => setTimeout(r, 200 + Math.random() * 200));
    reply = localReply(text);
  }
  addMessage(reply, 'bot');
  setLoading(false);
}

// ── Backend selector ──

aiBackend?.addEventListener('change', async () => {
  const id = aiBackend.value;
  noAiWarningShown = false;
  suppressReadyMessage = false;
  updateBadge(id, 'loading');
  await window.__ai.switchBackend(id);
});

// ── Eventos ──

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

clearBtn?.addEventListener('click', () => {
  if (conversationHistory.length === 0) return;
  conversationHistory = [];
  localStorage.removeItem(STORAGE_KEY);
  messagesEl.querySelectorAll('.msg').forEach(el => el.remove());
  welcome.style.display = 'flex';
  noAiWarningShown = false;
  userInput.focus();
  setTimeout(() => {
    addMessage(window.__ai.prompts.welcome, 'bot');
  }, 300);
});

// ── Inicio ──

async function init() {
  const hasHistory = loadHistory();

  // Detectar backends disponibles y poblar selector
  const available = await window.__ai.detectBackends();
  for (const opt of aiBackend.options) {
    if (opt.value === 'off') continue;
    if (!available[opt.value]) {
      opt.disabled = true;
      opt.textContent += ' (no disponible)';
    }
  }

  // Determinar backend inicial
  const saved = localStorage.getItem('danna_ai_backend');
  let initial = saved && available[saved] ? saved : null;
  if (!initial) {
    if (available.gemini) initial = 'gemini';
    else if (available.webllm) initial = 'webllm';
    else if (available.transformers) initial = 'transformers';
    else initial = 'off';
  }

  aiBackend.value = initial;
  updateBadge(initial, initial === 'off' ? '' : 'loading');
  await window.__ai.switchBackend(initial);
  suppressReadyMessage = false;

  if (!hasHistory) {
    setTimeout(() => {
      addMessage(window.__ai.prompts.welcome, 'bot');
    }, 600);
  }
}

init();
