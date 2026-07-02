// ============================================================
// PROMPTS CENTRALIZADOS (Sistema + Interfaz + Fallback)
// ============================================================

const PROMPTS = {

  // ── Personalidad fija para la IA local ──
  systemPersonality: `Eres un asesor educativo experto, paciente y extremadamente confiable, especializado en acompañar a estudiantes de todos los niveles.

Reglas estrictas de comportamiento:
1. SIEMPRE respondes en español neutro y claro, como un profesor particular cercano.
2. Antes de dar la respuesta final, analiza el nivel del estudiante por su pregunta. Si es básico, usa ejemplos de la vida cotidiana (como hacer pizza, jugar fútbol o usar el celular). Si es avanzado, profundiza con tecnicismos pero sin perder la claridad.
3. Tu método es "paso a paso": desglosas los problemas complejos en partes pequeñas y celebras cada pequeño avance del estudiante.
4. Si el estudiante se equivoca, NUNCA le dices "estás mal". En su lugar, usas frases como: "¡Buena intuición! Vamos a revisar ese detalle desde otro ángulo..." o "Casi llegas, mira esta pista...".
5. Fomentas el pensamiento crítico: en lugar de dar la respuesta directa, a menudo devuelves una pregunta que lo guíe a descubrir la solución por sí mismo.
6. Tu tono es motivador pero realista. Usas emojis moderadamente (🧠, 📚, ✨, 🎯) para hacer la conversación amena.
7. Tienes memoria dentro de la conversación, así que retomas temas anteriores si el estudiante vuelve a preguntar sobre ellos.
8. Si te preguntan por tus capacidades, dices que eres una IA local privada que no guarda datos en internet.
9. El sitio web es de Danna Rivera, estudiante de Diseño en CEDES Don Bosco, Costa Rica.`,

  // ── Pre-contexto que se antepone a cada consulta ──
  preContext: `[CONTEXTO ACTUAL]: Eres un asesor académico. El usuario es un estudiante que busca aprender. Debes responder SÍ o SÍ en español, de forma clara y didáctica. Si la pregunta no es académica, igual la respondes con amabilidad pero enfocas la respuesta hacia el aprendizaje o la curiosidad intelectual.`,

  // ── Mensajes de interfaz ──

  welcomeWithOffer: `👋 **¡Hola, futuro genio!** Veo que es tu primera vez aquí.

Tu navegador tiene una **Inteligencia Artificial propia y LOCAL** (Prompt API). Esto significa que tus preguntas **NO salen de tu computadora**, es súper rápida y totalmente privada.

Con ella puedo ayudarte a resolver ecuaciones, redactar ensayos, entender conceptos difíciles, programar, analizar literatura y prácticamente **TODO** lo que se te ocurra para tus estudios.

¿Quieres activar este superpoder local?
*(Escribe **"Sí"** para activarla o **"No"** para usar el modo de respuestas predefinidas)*.`,

  acceptLocal: `✅ **¡Excelente elección!** Has activado la IA local.

A partir de ahora, todas tus dudas se resuelven aquí en tu navegador, sin enviar datos a ningún servidor. Pregúntame lo que sea sobre tus estudios, ¡estoy listo para asesorarte!`,

  rejectLocal: `🌐 **¡Entendido!** Usaré mi modo de respuestas predefinidas para ayudarte.

No dudes en consultarme, ¡estoy aquí para guiarte en tu aprendizaje!`,

  fallbackPanfo: `🤯 **¡Uy, panfo!**

La IA local se tomó un descanso (su proceso finalizó inesperadamente). Pero ¡tranqui! Automáticamente activo el **modo contextual** para que no te quedes sin ayuda.

Esta modalidad de respuestas **durará todo el tiempo que sigamos conversando**. ¡Sigo siendo tu asesor personal, así que dale con tu pregunta!`,

  welcomeNoLocal: `🌐 **¡Hola!**

Tu navegador no tiene la IA local habilitada (o no es compatible), así que usaré mi **modo de respuestas predefinidas** para ayudarte.

No te preocupes, ¡seguiré siendo tu asesor de confianza para lo que necesites! Dime, ¿qué tema vamos a dominar hoy?`
};

// ============================================================
// ESTADO DE LA IA
// ============================================================

let session = null;
let localAIReady = false;
let panfoMode = false;

function dispatch(status, msg) {
  window.__aiStatus = status;
  window.__aiMessage = msg || '';
  window.dispatchEvent(new CustomEvent('ai-status', {
    detail: { status, message: msg || '' }
  }));
}

// ============================================================
// DETECCIÓN DEL NAVEGADOR (window.ai)
// ============================================================

async function detectLocalAI() {
  dispatch('checking', 'Verificando IA local disponible...');
  try {
    if (window.ai && typeof window.ai.createTextSession === 'function') {
      dispatch('available', '');
      return true;
    }
  } catch (e) { /* seguro */ }
  dispatch('unavailable', '');
  return false;
}

// ============================================================
// CREACIÓN / DESTRUCCIÓN DE SESIÓN
// ============================================================

async function createSession() {
  try {
    session = await window.ai.createTextSession({
      systemPrompt: PROMPTS.systemPersonality
    });
    localAIReady = true;
    dispatch('ready', '');
    return true;
  } catch (err) {
    console.error('Error al crear sesión IA:', err);
    return false;
  }
}

function destroySession() {
  if (session) {
    try { session.destroy(); } catch (e) { /* seguro */ }
    session = null;
  }
  localAIReady = false;
}

// ============================================================
// GENERACIÓN DE RESPUESTA
// ============================================================

async function generateReply(text, history) {
  if (!session || !localAIReady) return null;
  try {
    let context = '';
    if (history && history.length > 0) {
      const recent = history.slice(-6);
      context = '\nHistorial de la conversación:\n' + recent.map(m =>
        (m.role === 'user' ? 'Usuario' : 'Asesor') + ': ' + m.text
      ).join('\n');
    }

    const fullPrompt = [
      PROMPTS.preContext,
      context ? '\n' + context : '',
      '\n\nEl estudiante dice:',
      text,
      '\n\nRespuesta:'
    ].join('');

    const reply = await session.prompt(fullPrompt);
    return reply.trim();
  } catch (err) {
    console.error('Error en IA local:', err);
    localAIReady = false;
    panfoMode = true;
    dispatch('panfo', PROMPTS.fallbackPanfo);
    return null;
  }
}

// ============================================================
// EXPOSICIÓN GLOBAL
// ============================================================

window.__ai = {
  detect: detectLocalAI,
  createSession: createSession,
  generateReply: generateReply,
  destroySession: destroySession,
  get isReady() { return localAIReady; },
  get isPanfo() { return panfoMode; },
  prompts: PROMPTS
};
