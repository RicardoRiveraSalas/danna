// ============================================================
// PROMPTS CENTRALIZADOS
// ============================================================

const PROMPTS = {
  systemPersonality: `
# IDENTIDAD
Eres un asesor educativo experto, paciente y extremadamente confiable. Actúas como un profesor particular cercano que habla en espanol neutro y claro.

# MISION PRINCIPAL
No solo des respuestas, sino que acompannes al estudiante en su proceso de aprendizaje. Tu meta es que el/ella termine la conversacion sintiendo que entendio el "por que" de las cosas, no solo el "que".

# REGLAS ESTRICTAS DE COMPORTAMIENTO
1. Adaptacion al nivel: si la pregunta es basica usa ejemplos cotidianos; si es avanzado profundiza con tecnicismos sin perder claridad.
2. Metodo paso a paso: desglosa problemas complejos en partes. En lugar de dar la respuesta directa, devuelve preguntas guia para fomentar pensamiento critico.
3. Manejo de errores: nunca digas "estas mal". Usa frases como "Buena intuicion! Vamos a revisar ese detalle desde otro angulo...".
4. Si la pregunta es muy extensa, sugiere dividirla en partes.
5. Si no sabes la respuesta, dilo honestamente y sugiere fuentes confiables. Nunca inventes datos.
6. Tono motivador pero realista. Usa emojis con moderacion ( , , , ). Usa saltos de linea, negritas y vinetas para facilitar lectura.
7. Contexto: eres una IA local privada que funciona completamente en el navegador. Este sitio es de Danna Rivera, estudiante de Diseno en CEDES Don Bosco, Costa Rica.
8. Tienes memoria conversacional: retoma temas anteriores si el estudiante vuelve a preguntar.
`,
  welcome: `
Bienvenido! Soy tu asesor educativo. Arriba puedes seleccionar el motor de IA que prefieras:
- **Gemini Nano**  (recomendado) — IA integrada en Chrome, sin descargas.
- **WebLLM**  — modelo Llama 3.2 de ~700MB que se descarga una sola vez.
- **Sin IA** — solo respuestas predefinidas.

Elige el que mas te guste y empieza a preguntar!
`,
  readyGemini: `
 **Gemini Nano listo!** Tus preguntas se procesan con el modelo de IA integrado en Chrome. Respuestas rapidas y sin descargas. Preguntame lo que sea! 
`,
  readyWebLLM: `
 **WebLLM listo!** El modelo Llama 3.2 se ha cargado en tu navegador. Todo funciona localmente, sin enviar datos a internet. 
`
};

// ============================================================
// ESTADO GLOBAL
// ============================================================

let currentBackendId = null;
let webllmEngine = null;
let webllmReady = false;
let webllmLoading = false;

function dispatch(status, message) {
  window.__aiStatus = status;
  window.__aiMessage = message || '';
  window.dispatchEvent(new CustomEvent('ai-status', {
    detail: { status, message: message || '' }
  }));
}

// ============================================================
// BACKENDS
// ============================================================

const backends = {
  gemini: {
    id: 'gemini',
    name: 'Gemini Nano',
    icon: '\u2728',
    async check() {
      try {
        const ai = window.ai || window.chrome?.aiOriginTrial;
        if (!ai || !ai.languageModel) return false;
        const caps = await ai.languageModel.capabilities();
        return caps.available !== 'no';
      } catch { return false; }
    },
    async start() {
      try {
        const ai = window.ai || window.chrome?.aiOriginTrial;
        if (!ai || !ai.languageModel) {
          dispatch('error', 'Chrome no tiene la Prompt API. Activala en:\nchrome://flags/#prompt-api-for-gemini-nano\n\nO usa WebLLM.');
          return;
        }
        const caps = await ai.languageModel.capabilities();
        if (!caps || caps.available === 'no') {
          dispatch('error', 'Gemini Nano no esta disponible en este navegador.\n\nPara activarlo:\n1. Abre chrome://flags/#prompt-api-for-gemini-nano\n2. Selecciona "Enabled"\n3. Reinicia Chrome\n\nMientras, usa WebLLM o modo Sin IA.');
          return;
        }
        if (caps.available === 'after-download') {
          dispatch('downloading', 'Descargando Gemini Nano (modelo integrado de Chrome)...');
          const s = await ai.languageModel.create();
          s.destroy();
        }
        dispatch('ready', 'gemini');
      } catch (err) {
        console.error('Error Gemini:', err);
        dispatch('error', 'Error al iniciar Gemini Nano: ' + (err.message || ''));
      }
    },
    get isReady() { return true; },
    get isLoading() { return false; },
    async generateReply(text, history) {
      try {
        const ai = window.ai || window.chrome?.aiOriginTrial;
        if (!ai || !ai.languageModel) return null;
        let prompt = '';
        if (history && history.length > 0) {
          for (const m of history.slice(-6)) {
            prompt += (m.role === 'user' ? 'Usuario: ' : 'Asistente: ') + m.text + '\n\n';
          }
        }
        prompt += 'Usuario: ' + text + '\n\nAsistente: ';
        const session = await ai.languageModel.create({
          systemPrompt: PROMPTS.systemPersonality
        });
        const result = await session.prompt(prompt);
        session.destroy();
        return (typeof result === 'string') ? result.trim() : String(result).trim();
      } catch (err) {
        console.error('Error Gemini generando:', err);
        return null;
      }
    }
  },

  webllm: {
    id: 'webllm',
    name: 'WebLLM',
    icon: '\U0001f9e0',
    async check() {
      return !!navigator.gpu;
    },
    async start() {
      if (webllmLoading || webllmReady) return;
      webllmLoading = true;
      dispatch('downloading', 'Verificando WebGPU...');
      try {
        if (!navigator.gpu) {
          dispatch('nogpu', 'WebGPU no disponible.');
          return;
        }
        dispatch('downloading', 'Conectando con WebLLM...');
        const { MLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');
        webllmEngine = new MLCEngine({
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
        await webllmEngine.reload('Llama-3.2-1B-Instruct-q4f16_1-MLC');
        webllmReady = true;
        dispatch('ready', 'webllm');
      } catch (err) {
        console.error('Error WebLLM:', err);
        const msg = err.message || '';
        if (msg.includes('maxComputeWorkgroupStorageSize')) {
          dispatch('error', 'WebLLM requiere un GPU con mayor capacidad de memoria de grupo de trabajo.\n\nTu GPU solo soporta 16KB, necesita 32KB.\n\nSugerencias:\n- Actualiza drivers Mesa/Vulkan\n- Usa Chrome con Gemini Nano (si esta disponible)\n- O selecciona "Sin IA" para respuestas predefinidas.');
        } else {
          dispatch('error', 'Error al cargar WebLLM: ' + msg);
        }
      } finally {
        webllmLoading = false;
      }
    },
    get isReady() { return webllmReady; },
    get isLoading() { return webllmLoading; },
    async generateReply(text, history) {
      if (!webllmEngine || !webllmReady) return null;
      try {
        const messages = [{ role: 'system', content: PROMPTS.systemPersonality }];
        if (history && history.length > 0) {
          for (const m of history.slice(-6)) {
            messages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text });
          }
        }
        messages.push({ role: 'user', content: text });
        const reply = await webllmEngine.chat.completions.create({
          messages, stream: false, max_tokens: 500, temperature: 0.7
        });
        return reply.choices[0]?.message?.content?.trim() || null;
      } catch (err) {
        console.error('Error WebLLM:', err);
        return null;
      }
    }
  }
};

// ============================================================
// DETECCION
// ============================================================

async function detectBackends() {
  const result = {};
  for (const [id, backend] of Object.entries(backends)) {
    try { result[id] = await backend.check(); } catch { result[id] = false; }
  }
  return result;
}

// ============================================================
// SELECCION
// ============================================================

async function switchBackend(id) {
  if (!backends[id] && id !== 'off') return;
  currentBackendId = id;
  try { localStorage.setItem('danna_ai_backend', id); } catch {}
  if (id === 'off') {
    dispatch('ready', 'off');
    return;
  }
  try {
    await backends[id].start();
  } catch (err) {
    console.error('Error starting backend', id, err);
    dispatch('error', 'Error al iniciar ' + backends[id].name + ': ' + (err.message || ''));
  }
}

function getCurrentBackend() {
  return currentBackendId === 'off' ? null : (backends[currentBackendId] || null);
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
// EXPOSICION GLOBAL
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
  prompts: PROMPTS
};
