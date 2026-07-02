// ============================================================
// PROMPTS CENTRALIZADOS
// ============================================================

const SYSTEM_PROMPT = `
# IDENTIDAD
Eres un asesor educativo experto, paciente y extremadamente confiable. Actúas como un profesor particular cercano que habla en español neutro y claro.

# MISION PRINCIPAL
No solo des respuestas, sino que acompañes al estudiante en su proceso de aprendizaje. Tu meta es que el/ella termine la conversación sintiendo que entendió el "por qué" de las cosas, no solo el "qué".

# REGLAS ESTRICTAS DE COMPORTAMIENTO
1. Adaptación al nivel: si la pregunta es básica usa ejemplos cotidianos; si es avanzado profundiza con tecnicismos sin perder claridad.
2. Método paso a paso: desglosa problemas complejos en partes. En lugar de dar la respuesta directa, devuelve preguntas guía para fomentar pensamiento crítico.
3. Manejo de errores: nunca digas "estás mal". Usa frases como "Buena intuición! Vamos a revisar ese detalle desde otro ángulo...".
4. Si la pregunta es muy extensa, sugiere dividirla en partes.
5. Si no sabes la respuesta, dilo honestamente y sugiere fuentes confiables. Nunca inventes datos.
6. Tono motivador pero realista. Usa emojis con moderación. Usa saltos de línea, negritas y viñetas para facilitar lectura.
7. Contexto: eres una IA local privada que funciona completamente en el navegador. Este sitio es de Danna Rivera, estudiante de Diseño en CEDES Don Bosco, Costa Rica.
8. Tienes memoria conversacional: retoma temas anteriores si el estudiante vuelve a preguntar.
`;

// Mensajes de interfaz (se pueden usar en la UI)
const UI_MESSAGES = {
  welcome: `
Bienvenido! Soy tu asesor educativo. Arriba puedes seleccionar el motor de IA que prefieras:
- **Gemini Nano** (recomendado) — IA integrada en Chrome, sin descargas.
- **WebLLM** — modelo Llama 3.2 de ~700MB vía WebGPU.
- **Transformers.js** — modelo TinyLlama 1.1B vía Hugging Face (WebGPU o CPU).
- **Sin IA** — solo respuestas predefinidas.

Elige el que más te guste y empieza a preguntar!
`,
  readyGemini: `✨ **Gemini Nano listo!** Tus preguntas se procesan con el modelo de IA integrado en Chrome. Respuestas rápidas y sin descargas. Pregúntame lo que sea!`,
  readyWebLLM: `🧠 **WebLLM listo!** El modelo Llama 3.2 se ha cargado en tu navegador. Todo funciona localmente, sin enviar datos a internet.`,
  readyTransformers: `🤖 **Transformers.js listo!** Modelo TinyLlama 1.1B cargado vía Hugging Face. Funciona con WebGPU o CPU.`
};

// ============================================================
// FUNCIONES DE AYUDA
// ============================================================

function dispatch(status, message) {
  window.__aiStatus = status;
  window.__aiMessage = message || '';
  window.dispatchEvent(new CustomEvent('ai-status', {
    detail: { status, message: message || '' }
  }));
}

/**
 * Construye el prompt para cada backend en el formato esperado.
 */
function buildPrompt(backendId, text, history = []) {
  const historyLimit = 6;
  const recent = history.slice(-historyLimit);
  let systemMessage = { role: 'system', content: SYSTEM_PROMPT };

  if (backendId === 'gemini') {
    // Gemini usa systemPrompt por separado, no en los mensajes
    let prompt = '';
    for (const m of recent) {
      const role = m.role === 'user' ? 'Usuario' : 'Asistente';
      prompt += `${role}: ${m.text}\n\n`;
    }
    prompt += `Usuario: ${text}\n\nAsistente: `;
    return { systemPrompt: SYSTEM_PROMPT, prompt };
  }

  // WebLLM y Transformers usan lista de mensajes
  const messages = [systemMessage];
  for (const m of recent) {
    messages.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    });
  }
  messages.push({ role: 'user', content: text });
  return { messages };
}

// ============================================================
// BACKENDS
// ============================================================

const backends = {
  gemini: {
    id: 'gemini',
    name: 'Gemini Nano',
    icon: '✨',
    async check() {
      try {
        const ai = window.ai || window.chrome?.aiOriginTrial;
        if (!ai?.languageModel) return false;
        const caps = await ai.languageModel.capabilities();
        return caps.available !== 'no';
      } catch {
        return false;
      }
    },
    async start() {
      try {
        const ai = window.ai || window.chrome?.aiOriginTrial;
        if (!ai?.languageModel) {
          dispatch('error', 'Chrome no tiene la Prompt API. Actívala en:\nchrome://flags/#prompt-api-for-gemini-nano\n\nO usa WebLLM.');
          return;
        }
        const caps = await ai.languageModel.capabilities();
        if (!caps || caps.available === 'no') {
          dispatch('error', 'Gemini Nano no está disponible en este navegador.\n\nPara activarlo:\n1. Abre chrome://flags/#prompt-api-for-gemini-nano\n2. Selecciona "Enabled"\n3. Reinicia Chrome\n\nMientras, usa WebLLM o modo Sin IA.');
          return;
        }
        // Si está en 'after-download', forzamos la descarga creando una sesión efímera
        if (caps.available === 'after-download') {
          dispatch('downloading', 'Descargando Gemini Nano (modelo integrado de Chrome)...');
          const session = await ai.languageModel.create({ systemPrompt: SYSTEM_PROMPT });
          session.destroy();
        }
        dispatch('ready', 'gemini');
      } catch (err) {
        console.error('Error Gemini:', err);
        dispatch('error', `Error al iniciar Gemini Nano: ${err.message || ''}`);
      }
    },
    get isReady() {
      // Verificamos nuevamente las capacidades en cada llamado (puede cambiar)
      return true; // simplificado, pero se puede mejorar con caché
    },
    get isLoading() { return false; },
    async generateReply(text, history) {
      try {
        const ai = window.ai || window.chrome?.aiOriginTrial;
        if (!ai?.languageModel) return null;
        const { systemPrompt, prompt } = buildPrompt('gemini', text, history);
        const session = await ai.languageModel.create({ systemPrompt });
        const result = await session.prompt(prompt);
        session.destroy();
        return typeof result === 'string' ? result.trim() : String(result).trim();
      } catch (err) {
        console.error('Error Gemini generando:', err);
        return null;
      }
    }
  },

  webllm: {
    id: 'webllm',
    name: 'WebLLM',
    icon: '🧠',
    _engine: null,
    _ready: false,
    _loading: false,
    async check() {
      return !!navigator.gpu;
    },
    async start() {
      if (this._loading || this._ready) return;
      this._loading = true;
      dispatch('downloading', 'Verificando WebGPU...');
      try {
        if (!navigator.gpu) {
          dispatch('nogpu', 'WebGPU no disponible.');
          return;
        }
        dispatch('downloading', 'Conectando con WebLLM...');
        const { MLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');
        this._engine = new MLCEngine({
          initProgressCallback: (report) => {
            if (report.progress && report.progress > 0) {
              const pct = Math.min(99, Math.round(report.progress * 100));
              dispatch('downloading', `Descargando IA local... ${pct}%`);
            } else if (report.text) {
              dispatch('downloading', report.text);
            }
          }
        });
        dispatch('downloading', 'Iniciando descarga del modelo (~700MB la primera vez)...');
        await this._engine.reload('Llama-3.2-1B-Instruct-q4f16_1-MLC');
        this._ready = true;
        dispatch('ready', 'webllm');
      } catch (err) {
        console.error('Error WebLLM:', err);
        const msg = err.message || '';
        if (msg.includes('maxComputeWorkgroupStorageSize')) {
          dispatch('error', 'WebLLM requiere un GPU con mayor capacidad de memoria de grupo de trabajo.\n\nTu GPU solo soporta 16KB, necesita 32KB.\n\nSugerencias:\n- Actualiza drivers Mesa/Vulkan\n- Usa Chrome con Gemini Nano (si está disponible)\n- O selecciona "Sin IA" para respuestas predefinidas.');
        } else {
          dispatch('error', `Error al cargar WebLLM: ${msg}`);
        }
      } finally {
        this._loading = false;
      }
    },
    get isReady() { return this._ready; },
    get isLoading() { return this._loading; },
    async generateReply(text, history) {
      if (!this._engine || !this._ready) return null;
      try {
        const { messages } = buildPrompt('webllm', text, history);
        const reply = await this._engine.chat.completions.create({
          messages,
          stream: false,
          max_tokens: 500,
          temperature: 0.7
        });
        return reply.choices[0]?.message?.content?.trim() || null;
      } catch (err) {
        console.error('Error WebLLM:', err);
        return null;
      }
    }
  },

  transformers: {
    id: 'transformers',
    name: 'Transformers.js',
    icon: '🤖',
    _pipeline: null,
    _loading: false,
    async check() {
      return true;
    },
    async start() {
      if (this._pipeline || this._loading) return;
      this._loading = true;
      dispatch('downloading', 'Cargando Transformers.js...');
      try {
        const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers');
        dispatch('downloading', 'Descargando modelo TinyLlama 1.1B (~700MB la primera vez)...');
        this._pipeline = await pipeline('text-generation', 'Xenova/TinyLlama-1.1B-Chat-v1.0', {
          dtype: 'q4',
          progress_callback: (p) => {
            if (p.status === 'progress') {
              dispatch('downloading', `Descargando modelo... ${Math.round(p.progress)}%`);
            }
          }
        });
        dispatch('ready', 'transformers');
      } catch (err) {
        console.error('Error Transformers:', err);
        dispatch('error', `Error al cargar Transformers.js: ${err.message || ''}`);
      } finally {
        this._loading = false;
      }
    },
    get isReady() { return !!this._pipeline; },
    get isLoading() { return this._loading; },
    async generateReply(text, history) {
      if (!this._pipeline) return null;
      try {
        const { messages } = buildPrompt('transformers', text, history);
        // Transformers espera un solo string con el prompt en formato especial
        let prompt = '<|system|>\n' + SYSTEM_PROMPT + '\n<|end|>\n';
        for (const m of messages) {
          if (m.role === 'system') continue; // ya incluido
          const role = m.role === 'user' ? 'user' : 'assistant';
          prompt += `<|${role}|>\n${m.content}\n<|end|>\n`;
        }
        prompt += '<|assistant|>\n';
        const result = await this._pipeline(prompt, {
          max_new_tokens: 500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        });
        return result[0]?.generated_text?.trim() || null;
      } catch (err) {
        console.error('Error Transformers generando:', err);
        return null;
      }
    }
  }
};

// ============================================================
// GESTIÓN DE ESTADO
// ============================================================

let currentBackendId = null;

// Recuperar selección previa
try {
  const saved = localStorage.getItem('danna_ai_backend');
  if (saved && backends[saved]) {
    currentBackendId = saved;
  }
} catch {}

// ============================================================
// DETECCIÓN PARALELA
// ============================================================

async function detectBackends() {
  const checks = Object.entries(backends).map(async ([id, backend]) => {
    try {
      const available = await backend.check();
      return [id, available];
    } catch {
      return [id, false];
    }
  });
  const results = await Promise.all(checks);
  return Object.fromEntries(results);
}

// ============================================================
// SELECCIÓN
// ============================================================

async function switchBackend(id) {
  if (id !== 'off' && !backends[id]) return;
  currentBackendId = id;
  try {
    localStorage.setItem('danna_ai_backend', id);
  } catch {}
  if (id === 'off') {
    dispatch('ready', 'off');
    return;
  }
  try {
    await backends[id].start();
  } catch (err) {
    console.error('Error starting backend', id, err);
    dispatch('error', `Error al iniciar ${backends[id].name}: ${err.message || ''}`);
  }
}

function getCurrentBackend() {
  if (currentBackendId === 'off') return null;
  return backends[currentBackendId] || null;
}

// ============================================================
// GENERAR RESPUESTA
// ============================================================

async function generateReply(text, history) {
  const backend = getCurrentBackend();
  if (!backend) return null;
  return await backend.generateReply(text, history);
}

// ============================================================
// EXPOSICIÓN GLOBAL (API pública sin cambios)
// ============================================================

window.__ai = {
  backends,
  detectBackends,
  switchBackend,
  getCurrentBackend,
  get currentBackendId() { return currentBackendId; },
  start: () => currentBackendId && backends[currentBackendId]?.start(),
  generateReply,
  get isReady() {
    if (currentBackendId === 'off') return false;
    const b = getCurrentBackend();
    return b ? b.isReady : false;
  },
  get isLoading() {
    const b = getCurrentBackend();
    return b ? b.isLoading : false;
  },
  // Se mantienen los prompts para compatibilidad con la UI
  prompts: {
    systemPersonality: SYSTEM_PROMPT,
    ...UI_MESSAGES
  }
};