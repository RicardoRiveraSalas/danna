const { pipeline, env } = window.transformers;

env.allowCache = true;
env.allowRemoteModels = false;

let generator = null;
let modelReady = false;
let loading = false;

function dispatch(status, progress, msg) {
  window.__aiModelStatus = status;
  window.__aiModelProgress = progress;
  window.__aiModelMessage = msg;
  window.dispatchEvent(new CustomEvent('ai-model-status', {
    detail: { status, progress, message: msg }
  }));
}

async function checkCache() {
  dispatch('checking', 0, 'Verificando si hay IA local disponible...');
  try {
    env.allowRemoteModels = false;
    generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M', {
      progress_callback: () => {},
    });
    modelReady = true;
    return true;
  } catch {
    return false;
  } finally {
    env.allowRemoteModels = true;
  }
}

async function startDownload() {
  if (loading || modelReady) return;
  loading = true;

  dispatch('downloading', 1, 'Preparando descarga del modelo de IA...');

  try {
    generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M', {
      progress_callback: (data) => {
        if (data.status === 'progress' && data.total > 0) {
          const pct = Math.min(99, Math.round((data.loaded / data.total) * 100));
          const mb = (data.loaded / (1024 * 1024)).toFixed(0);
          dispatch('downloading', pct,
            `Descargando IA local... ${pct}% (${mb}MB) — No recargues la página.`);
        }
      },
    });

    modelReady = true;
    dispatch('ready', 100, '');
  } catch (err) {
    console.error('Error loading AI model:', err);
    modelReady = false;
    dispatch('error', 0, '');
  } finally {
    loading = false;
  }
}

async function generateAIResponse(text, history) {
  if (!generator || !modelReady) return null;
  try {
    let context = '';
    if (history && history.length > 0) {
      const recent = history.slice(-6);
      context = '\n\nHistorial de la conversación:\n' + recent.map(m =>
        (m.role === 'user' ? 'Usuario' : 'Tutor') + ': ' + m.text
      ).join('\n');
    }

    const prompt = `Instrucción: Eres un tutor académico y asesor vocacional en español. Ayudas a estudiantes con sus estudios, tareas, orientación vocacional y dudas académicas. Respondes SIEMPRE en español, de forma clara, amigable y útil. El sitio web es de Danna Rivera, estudiante de Diseño en CEDES Don Bosco, Costa Rica.${context}\n\n${text}\n\nRespuesta:`;

    const result = await generator(prompt, {
      max_new_tokens: 300,
      temperature: 0.7,
      do_sample: true,
    });

    let reply = result[0]?.generated_text?.trim() || null;
    if (reply) {
      const prefixes = ['Respuesta:', 'Response:', 'Asistente:', 'Assistant:'];
      for (const p of prefixes) {
        if (reply.startsWith(p)) reply = reply.slice(p.length).trim();
      }
    }
    return reply;
  } catch (err) {
    console.error('AI generation error:', err);
    return null;
  }
}

async function init() {
  const cached = await checkCache();
  if (cached) {
    dispatch('ready', 100, '');
  } else {
    dispatch('needs-download', 0, '');
  }
}

window.__aiGenerateResponse = generateAIResponse;
window.__aiModelReady = () => modelReady;
window.__startAIDownload = startDownload;

init();
