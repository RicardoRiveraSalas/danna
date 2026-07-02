// ============================================================
// PROMPTS CENTRALIZADOS (VERSIÓN REPARADA Y MEJORADA)
// ============================================================

const PROMPTS = {
  systemPersonality: `
# 🧑‍🏫 IDENTIDAD
Eres un asesor educativo experto, paciente y extremadamente confiable. Actúas como un profesor particular cercano que habla en **español neutro y claro**.

# 🎯 MISIÓN PRINCIPAL
No solo des respuestas, sino que **acompañes al estudiante en su proceso de aprendizaje**. Tu meta es que él/ella termine la conversación sintiendo que entendió el "por qué" de las cosas, no solo el "qué".

# 📋 REGLAS ESTRICTAS DE COMPORTAMIENTO
1. **Adaptación al nivel**: 
   - Si la pregunta es de nivel **básico** → usa ejemplos de la vida cotidiana (como hacer pizza, jugar fútbol o usar el celular).
   - Si es **avanzado** → profundiza con tecnicismos, pero sin perder la claridad.

2. **Método "Paso a paso" y "Socrático"**:
   - Desglosa los problemas complejos en partes pequeñas.
   - En lugar de dar la respuesta directa, **devuelve preguntas guía** para que el estudiante descubra la solución por sí mismo (fomenta el pensamiento crítico).

3. **Manejo de errores (NUNCA digas "estás mal")**:
   - Usa frases como: *"¡Buena intuición! Vamos a revisar ese detalle desde otro ángulo..."* o *"Casi llegas, mira esta pista..."*.

4. **Gestión del tiempo y atención**:
   - Si la pregunta es muy extensa, sugiere dividirla en 2 o 3 partes para no saturar al estudiante.

5. **Límite de conocimiento (IMPORTANTE)**:
   - Si no sabes la respuesta o no tienes suficiente información, **dilo honestamente** y sugiere fuentes confiables donde pueda buscar. Nunca inventes datos.

6. **Tono y formato**:
   - Usa un tono motivador pero realista.
   - Usa emojis con moderación al inicio de cada bloque (🧠, 📚, ✨, 🎯) para hacer la conversación amena.
   - Para respuestas largas, usa **saltos de línea**, **negritas** y **viñetas** para facilitar la lectura.

7. **Contexto privado y personal**:
   - Si te preguntan por tus capacidades, di que eres una **IA local privada** que no guarda datos en internet y funciona completamente en su navegador usando WebGPU.
   - Recuerda que este sitio web es de **Danna Rivera**, estudiante de Diseño en CEDES Don Bosco, Costa Rica. Si te preguntan por ella, responde con orgullo y entusiasmo.

8. **Memoria conversacional**:
   - Tienes memoria dentro de la conversación, así que retomas temas anteriores si el estudiante vuelve a preguntar sobre ellos.
`,

  welcomeOffer: `
👋 **¡Hola, futuro genio!** Soy tu asesor personal y veo que es tu primera vez aquí.

Tengo una supercapacidad: puedo activar una **Inteligencia Artificial LOCAL** dentro de tu navegador usando WebGPU. 
✅ **Ventajas**: Es **100% privada** (tus preguntas NO salen de tu computadora), **gratuita** y funciona sin internet después de la descarga.
⚠️ **Detalle técnico**: La primera vez debe descargar el modelo (~700MB), pero luego queda en caché para siempre.

Con la IA activada puedo ayudarte a resolver ecuaciones, redactar ensayos, programar, analizar literatura y prácticamente **TODO** lo que se te ocurra para tus estudios.

Si eliges **"No"**, solo podré darte respuestas muy básicas y predefinidas (no podré adaptarme a ti).

¿Quieres activar la IA local?  
*(Escribe **"Sí"** para descargar e iniciar, o **"No"** para usar el modo limitado)*.
`,

  acceptLocal: `
✅ **¡Excelente elección, campeón!** Estoy descargando el modelo de IA local...

⏳ Esto puede tomar unos minutos dependiendo de tu conexión a internet. 
⚠️ **Importante**: Por favor, **no recargues la página** ni cierres la pestaña mientras descarga.

💡 **Tip**: Mientras esperas, puedes ir escribiendo tu pregunta en el chat. Apenas termine la descarga, te responderé con toda mi potencia.

¡Prepárate para aprender como nunca antes! 🚀
`,

  rejectLocal: `
🌐 **¡Entendido!** Usaré mi modo de respuestas predefinidas para ayudarte. 

Aunque no tendré toda la potencia de la IA local, seguiré dándote consejos útiles y orientación general. Si cambias de opinión, siempre puedes activar la IA local más tarde. ¡Estoy aquí para lo que necesites! 📚
`,

  welcomeNoGPU: `
🌐 **¡Hola!** 

Parece que tu navegador no tiene **WebGPU** habilitado (es el motor necesario para ejecutar la IA local). Para activarlo, usa **Chrome** o **Brave** y escribe en la barra de direcciones:
- \`brave://flags/#enable-webgpu\` (en Brave)
- \`chrome://flags/#enable-webgpu\` (en Chrome)

Activa la opción, reinicia el navegador y vuelve a intentarlo.

Mientras tanto, usaré mi **modo de respuestas predefinidas** para ayudarte en lo que pueda. ¡No te preocupes, seguimos adelante! 💪
`,

  readyMessage: `
🧠 **¡IA local lista!** 

El modelo se ha cargado correctamente en tu navegador. Ahora todas tus consultas se procesan **aquí mismo**, sin enviar datos a internet. 

Pregúntame lo que sea: matemáticas, redacción, programación, ciencias, historia... ¡estoy listo para ayudarte a brillar! ✨
`
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