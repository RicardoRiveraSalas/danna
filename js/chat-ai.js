// ============================================================
// PROMPTS CENTRALIZADOS
// ============================================================

const PROMPTS = {
  systemPersonality: `Eres un asesor educativo experto, paciente y extremadamente confiable, especializado en acompañar a estudiantes de todos los niveles.

Reglas estrictas de comportamiento:
1. SIEMPRE respondes en español neutro y claro, como un profesor particular cercano.
2. Antes de dar la respuesta final, analiza el nivel del estudiante por su pregunta. Si es básico, usa ejemplos de la vida cotidiana (como hacer pizza, jugar fútbol o usar el celular). Si es avanzado, profundiza con tecnicismos pero sin perder la claridad.
3. Tu método es "paso a paso": desglosas los problemas complejos en partes pequeñas y celebras cada pequeño avance del estudiante.
4. Si el estudiante se equivoca, NUNCA le dices "estás mal". En su lugar, usas frases como: "¡Buena intuición! Vamos a revisar ese detalle desde otro ángulo..." o "Casi llegas, mira esta pista...".
5. Fomentas el pensamiento crítico: en lugar de dar la respuesta directa, a menudo devuelves una pregunta que lo guíe a descubrir la solución por sí mismo.
6. Tu tono es motivador pero realista. Usas emojis moderadamente (🧠, 📚, ✨, 🎯) para hacer la conversación amena.
7. Tienes memoria dentro de la conversación, así que retomas temas anteriores si el estudiante vuelve a preguntar sobre ellos.
8. Si te preguntan por tus capacidades, dices que eres una IA local privada que no guarda datos en internet y que funciona completamente en su navegador usando WebGPU.
9. El sitio web es de Danna Rivera, estudiante de Diseño en CEDES Don Bosco, Costa Rica.`,

  welcomeOffer: `👋 **¡Hola, futuro genio!** Veo que es tu primera vez aquí.

Puedo activar una **Inteligencia Artificial LOCAL** en tu navegador usando WebGPU. Tus preguntas **NO salen de tu computadora**, es privada y gratuita.

Con ella puedo ayudarte a resolver ecuaciones, redactar ensayos, entender conceptos difíciles, programar, analizar literatura y prácticamente **TODO** lo que se te ocurra para tus estudios.

La primera vez debe descargar el modelo (~700MB), pero luego queda en caché.

¿Quieres activarla? *(Escribe **"Sí"** para descargar e iniciar, o **"No"** para usar respuestas predefinidas)*.`,

  acceptLocal: `✅ **¡Excelente elección!** Descargando el modelo de IA local...

Esto puede tomar unos minutos dependiendo de tu conexión. **No recargues la página**. Cuando termine, estaré listo para asesorarte.`,

  rejectLocal: `🌐 **¡Entendido!** Usaré mi modo de respuestas predefinidas para ayudarte. No dudes en consultarme.`,

  welcomeNoGPU: `🌐 **¡Hola!**

Tu navegador no tiene **WebGPU** habilitado (necesario para la IA local), o no es compatible. Para activarlo, usa Chrome/Brave y ve a \`brave://flags/#enable-webgpu\` o \`chrome://flags/#enable-webgpu\`.

Mientras tanto, usaré mi **modo de respuestas predefinidas**. ¡Seguiré siendo tu asesor!`,

  readyMessage: `🧠 **¡IA local lista!** El modelo se ha cargado correctamente. Ahora todas tus consultas se procesan aquí en tu navegador, sin internet. ¿En qué necesitas ayuda?`
};

// ============================================================
// ESTADO
// ============================================================

let engine = null;
let modelReady = false;
let loading = false;

function dispatch(status, message) {
  window.__aiStatus = status;
  window.__aiMessage = message || '';
  window.dispatchEvent(new CustomEvent('ai-status', {
    detail: { status, message: message || '' }
  }));
}

// ============================================================
// INICIALIZAR WEBLLM
// ============================================================

async function startWebLLM() {
  if (loading || modelReady) return;
  loading = true;

  dispatch('downloading', 'Verificando WebGPU...');

  try {
    if (!navigator.gpu) {
      dispatch('nogpu', 'WebGPU no disponible.');
      loading = false;
      return;
    }

    dispatch('downloading', 'Conectando con WebLLM...');

    const { MLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');

    engine = new MLCEngine();

    engine.setInitProgressCallback((report) => {
      if (report.progress && report.progress > 0) {
        const pct = Math.min(99, Math.round(report.progress * 100));
        dispatch('downloading', `Descargando IA local... ${pct}% (No recargues la página).`);
      } else if (report.text) {
        dispatch('downloading', report.text);
      }
    });

    dispatch('downloading', 'Iniciando descarga del modelo (~700MB la primera vez)...');
    await engine.reload('Llama-3.2-1B-Instruct-q4f16_0-MLC');

    modelReady = true;
    dispatch('ready', '');
  } catch (err) {
    console.error('Error WebLLM:', err);
    dispatch('error', 'Error al cargar la IA local: ' + (err.message || 'desconocido'));
  } finally {
    loading = false;
  }
}

// ============================================================
// GENERAR RESPUESTA
// ============================================================

async function generateReply(text, history) {
  if (!engine || !modelReady) return null;
  try {
    const messages = [{ role: 'system', content: PROMPTS.systemPersonality }];

    if (history && history.length > 0) {
      const recent = history.slice(-6);
      for (const m of recent) {
        messages.push({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        });
      }
    }

    messages.push({ role: 'user', content: text });

    const reply = await engine.chat.completions.create({
      messages,
      stream: false,
      max_tokens: 500,
      temperature: 0.7
    });

    return reply.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('Error generando respuesta:', err);
    return null;
  }
}

// ============================================================
// EXPOSICIÓN GLOBAL
// ============================================================

window.__ai = {
  start: startWebLLM,
  generateReply,
  get isReady() { return modelReady; },
  get isLoading() { return loading; },
  prompts: PROMPTS
};
