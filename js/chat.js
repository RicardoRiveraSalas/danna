const STORAGE_KEY = 'danna_chat_history';
const PREF_KEY = 'danna_ai_preference';

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

let aiEnabled = false;
let awaitingOffer = false;
let conversationHistory = [];

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

function getPreference() { return localStorage.getItem(PREF_KEY); }
function setPreference(v) { try { localStorage.setItem(PREF_KEY, v); } catch (e) {} }
function clearPreference() { try { localStorage.removeItem(PREF_KEY); } catch (e) {} }

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

// ── Status events from chat-ai.js ──

window.addEventListener('ai-status', (e) => {
  const { status, message } = e.detail;

  if (status === 'nogpu') {
    statusBar.style.display = 'none';
    awaitingOffer = false;
  } else if (status === 'downloading') {
    statusIcon.textContent = '⏳';
    statusText.textContent = message || 'Descargando IA local...';
    progressBar.style.display = 'flex';
    statusBar.style.display = 'flex';
    const pctMatch = message?.match(/(\d+)%/);
    if (pctMatch) progressFill.style.width = pctMatch[1] + '%';
  } else if (status === 'ready') {
    statusBar.style.display = 'none';
    progressBar.style.display = 'none';
    aiEnabled = true;
    setTimeout(() => addMessage(window.__ai.prompts.readyMessage, 'bot'), 400);
  } else if (status === 'error') {
    statusBar.style.display = 'none';
    progressBar.style.display = 'none';
    aiEnabled = false;
    addMessage(message || '😅 No se pudo cargar la IA local. Usaré respuestas predefinidas.', 'bot');
  }
});

// ── Fallback ──

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

// ── Envío ──

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = '';
  userInput.style.height = 'auto';
  addMessage(text, 'user');
  setLoading(true);

  // ── Offer state: waiting for sí/no ──
  if (awaitingOffer) {
    awaitingOffer = false;
    const lower = text.toLowerCase();
    if (lower === 'sí' || lower === 'si' || lower === 'sisí' || lower === 's' || lower === 'yes') {
      setPreference('yes');
      addMessage(window.__ai.prompts.acceptLocal, 'bot');
      window.__ai.start();
      setLoading(false);
      return;
    }
    // no or anything else → reject + answer
    setPreference('no');
    aiEnabled = false;
    addMessage(window.__ai.prompts.rejectLocal, 'bot');
    await new Promise(r => setTimeout(r, 200 + Math.random() * 200));
    addMessage(localReply(text), 'bot');
    setLoading(false);
    return;
  }

  // ── Normal response ──
  let reply = null;
  if (aiEnabled) {
    const ctx = conversationHistory.slice(-8, -1);
    reply = await window.__ai.generateReply(text, ctx);
  }
  if (!reply) {
    await new Promise(r => setTimeout(r, 200 + Math.random() * 200));
    reply = localReply(text);
  }
  addMessage(reply, 'bot');
  setLoading(false);
}

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
  if (conversationHistory.length === 0 && !getPreference()) return;
  conversationHistory = [];
  localStorage.removeItem(STORAGE_KEY);
  clearPreference();
  messagesEl.querySelectorAll('.msg').forEach(el => el.remove());
  welcome.style.display = 'flex';
  awaitingOffer = false;
  aiEnabled = false;
  userInput.focus();
  setTimeout(() => {
    if (navigator.gpu) {
      addMessage(window.__ai.prompts.welcomeOffer, 'bot');
      awaitingOffer = true;
    } else {
      addMessage(window.__ai.prompts.welcomeNoGPU, 'bot');
    }
  }, 300);
});

// ── Inicio ──

const hasHistory = loadHistory();

if (!hasHistory) {
  setTimeout(() => {
    if (navigator.gpu) {
      addMessage(window.__ai.prompts.welcomeOffer, 'bot');
      awaitingOffer = true;
    } else {
      addMessage(window.__ai.prompts.welcomeNoGPU, 'bot');
    }
  }, 300);
}
