// ====================================
// TEMA (Moderno / Win 3.1)
// ====================================
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

// ====================================
// CONFIGURACIÓN Y DATOS
// ====================================

const MAX_QUESTIONS = 10;

const QUESTIONS = [
  // Q0 — define tu identidad
  {
    title: "¿Cuál es tu principal fortaleza?",
    options: [
      { emoji: "🧠", text: "Análisis lógico y resolución de problemas", next: 1 },
      { emoji: "🎨", text: "Creatividad e innovación", next: 2 },
      { emoji: "👥", text: "Comunicación y trabajo en equipo", next: 3 },
      { emoji: "🔬", text: "Observación y experimentación", next: 4 }
    ]
  },
  // Q1a (análisis)
  {
    title: "¿Qué tipo de problemas disfrutas resolver?",
    options: [
      { emoji: "💻", text: "Problemas técnicos y de programación", next: 5 },
      { emoji: "📐", text: "Problemas matemáticos y de ingeniería", next: 5 },
      { emoji: "📊", text: "Problemas de datos y estadísticas", next: 5 },
      { emoji: "🔧", text: "Problemas mecánicos y prácticos", next: 5 }
    ]
  },
  // Q1b (creatividad)
  {
    title: "¿En qué área creativa te gusta trabajar?",
    options: [
      { emoji: "🎨", text: "Arte visual y diseño gráfico", next: 5 },
      { emoji: "✍️", text: "Escritura y contenido creativo", next: 5 },
      { emoji: "🎬", text: "Audiovisual y multimedia", next: 5 },
      { emoji: "🎵", text: "Música y artes escénicas", next: 5 }
    ]
  },
  // Q1c (comunicación)
  {
    title: "¿Cómo prefieres comunicarte?",
    options: [
      { emoji: "🗣️", text: "Hablando en público y presentando", next: 5 },
      { emoji: "✍️", text: "Escribiendo y documentando", next: 5 },
      { emoji: "🤝", text: "Conversando uno a uno", next: 5 },
      { emoji: "📱", text: "A través de medios digitales", next: 5 }
    ]
  },
  // Q1d (observación)
  {
    title: "¿Qué te gusta observar?",
    options: [
      { emoji: "🌿", text: "La naturaleza y los ecosistemas", next: 5 },
      { emoji: "🔬", text: "Procesos científicos y experimentos", next: 5 },
      { emoji: "👥", text: "El comportamiento de las personas", next: 5 },
      { emoji: "🏗️", text: "Sistemas y estructuras", next: 5 }
    ]
  },
  // Q2
  {
    title: "¿Qué tipo de trabajo te atrae más?",
    options: [
      { emoji: "💻", text: "Trabajar con tecnología y herramientas digitales" },
      { emoji: "🏥", text: "Ayudar a otras personas directamente" },
      { emoji: "📊", text: "Analizar datos, números y procesos" },
      { emoji: "✍️", text: "Expresar ideas, crear contenido o enseñar" }
    ]
  },
  // Q3
  {
    title: "¿Cuál es tu ambiente ideal de trabajo?",
    options: [
      { emoji: "🏢", text: "Oficina moderna con equipos multidisciplinarios" },
      { emoji: "🌍", text: "Al aire libre, en terreno o viajando" },
      { emoji: "🔬", text: "Laboratorio, taller o espacio creativo" },
      { emoji: "🎪", text: "Ambientes dinámicos, cambiantes y sociales" }
    ]
  },
  // Q4
  {
    title: "¿Qué materia te resultó más interesante en el colegio?",
    options: [
      { emoji: "⚛️", text: "Matemática, Física o Química" },
      { emoji: "🧪", text: "Biología, Ciencias o Laboratorio" },
      { emoji: "📚", text: "Idiomas, Literatura o Estudios Sociales" },
      { emoji: "🎭", text: "Arte, Música, Teatro o Educación Física" }
    ]
  },
  // Q5
  {
    title: "¿Cuál es tu objetivo profesional principal?",
    options: [
      { emoji: "💰", text: "Estabilidad financiera e independencia" },
      { emoji: "🌟", text: "Hacer un impacto positivo en la sociedad" },
      { emoji: "📈", text: "Crecer, liderar y dirigir proyectos" },
      { emoji: "❤️", text: "Disfrutar cada día y tener propósito" }
    ]
  },
  // Q6
  {
    title: "¿Cómo prefieres resolver problemas?",
    options: [
      { emoji: "🔍", text: "Investigando a fondo y experimentando" },
      { emoji: "📋", text: "Siguiendo procesos bien definidos" },
      { emoji: "💡", text: "Pensando diferente e innovando" },
      { emoji: "🤝", text: "Consultando y colaborando con otros" }
    ]
  },
  // Q7
  {
    title: "¿Qué te motiva a aprender cosas nuevas?",
    options: [
      { emoji: "🎓", text: "El conocimiento y la curiosidad intelectual" },
      { emoji: "🛠️", text: "Poder aplicar lo aprendido en la práctica" },
      { emoji: "🏆", text: "Competir, destacar y alcanzar metas" },
      { emoji: "🌱", text: "Crecer como persona y ayudar a otros" }
    ]
  },
  // Q8
  {
    title: "¿Cuál es tu nivel de tolerancia al estrés?",
    options: [
      { emoji: "😌", text: "Bajo — prefiero ritmos tranquilos y predecibles" },
      { emoji: "⚡", text: "Medio — trabajo bien bajo presión moderada" },
      { emoji: "🔥", text: "Alto — me activo y rindo con desafíos intensos" },
      { emoji: "🧘", text: "Equilibrado — busco balance entre reto y calma" }
    ]
  },
  // Q9 — especialización final
  {
    title: "¿En qué campo te gustaría especializarte?",
    options: [
      { emoji: "🚀", text: "Tecnología, ciencia e innovación" },
      { emoji: "🌍", text: "Medio ambiente, sostenibilidad y naturaleza" },
      { emoji: "💼", text: "Negocios, administración y finanzas" },
      { emoji: "🎓", text: "Educación, artes y desarrollo humano" }
    ]
  }
];

const CAREERS_DB = [
  // ===== SALUD =====
  {
    name: "Medicina",
    keywords: { "ayudar": 3, "biología": 3, "ciencia": 2, "impacto": 2, "personas": 2, "salud": 3 },
    reason: "Tu vocación de servicio y profundo interés en ciencias naturales te posicionan para una carrera médica gratificante.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Enfermería",
    keywords: { "ayudar": 3, "personas": 2, "biología": 2, "impacto": 2, "salud": 3, "equipo": 2 },
    reason: "Tu vocación humanitaria y habilidad para trabajar en equipo te preparan para una carrera de cuidado directo.",
    universities: "UCR, UNA, UNED, UTN, Latina"
  },
  {
    name: "Farmacia",
    keywords: { "ciencia": 3, "química": 3, "biología": 2, "precisión": 3, "salud": 2, "experimentación": 2 },
    reason: "Tu interés por la química y la precisión científica te orientan hacia la investigación y producción de medicamentos.",
    universities: "UCR"
  },
  {
    name: "Odontología",
    keywords: { "ayudar": 2, "biología": 2, "salud": 3, "precisión": 3, "personas": 2, "ciencia": 2 },
    reason: "Tu destreza manual y vocación de servicio te preparan para una carrera en salud oral con alta demanda.",
    universities: "UCR, UNA, Latina"
  },
  {
    name: "Microbiología",
    keywords: { "ciencia": 3, "biología": 3, "experimentación": 3, "observación": 2, "laboratorio": 3, "precisión": 2 },
    reason: "Tu fascinación por el mundo microscópico y el análisis de laboratorio te llevan a una carrera científica clave.",
    universities: "UCR"
  },
  {
    name: "Nutrición",
    keywords: { "ayudar": 2, "ciencia": 2, "biología": 2, "salud": 3, "personas": 2, "alimentos": 2 },
    reason: "Tu interés en la alimentación saludable y el bienestar te orientan a una carrera de impacto preventivo.",
    universities: "UCR, UNA, UNED, Hispanoamericana"
  },
  {
    name: "Fisioterapia",
    keywords: { "ayudar": 3, "personas": 2, "salud": 3, "biología": 2, "equipo": 2, "deporte": 2 },
    reason: "Tu vocación de servicio y pasión por el movimiento humano te preparan para rehabilitar y mejorar vidas.",
    universities: "UCR, UNA, UNED, Latina, Hispanoamericana, Fidelitas"
  },
  {
    name: "Psicología",
    keywords: { "personas": 3, "comunicación": 3, "ayudar": 2, "impacto": 2, "equipo": 2, "análisis": 2 },
    reason: "Tu empatía, inteligencia emocional y habilidades comunicativas son fundamentales en esta carrera transformadora.",
    universities: "UCR, UNA, UNED, Latina, Hispanoamericana, Fidelitas, San Marcos, ULAT"
  },
  {
    name: "Medicina Veterinaria",
    keywords: { "naturaleza": 3, "biología": 3, "ayudar": 2, "ciencia": 2, "animales": 3, "experimentación": 2 },
    reason: "Tu amor por los animales y el pensamiento científico se unen en esta carrera de salud y bienestar animal.",
    universities: "UNA, UCR"
  },
  // ===== INGENIERÍAS =====
  {
    name: "Ingeniería en Sistemas Computacionales",
    keywords: { "tecnología": 3, "lógica": 3, "innovación": 2, "programación": 3, "desarrollo": 3, "datos": 2 },
    reason: "Tu perfil muestra fuerte inclinación hacia la tecnología y el análisis lógico. Ideal para diseñar soluciones digitales innovadoras.",
    universities: "TEC, UCR, UNED, Fidelitas, Latina, Hispanoamericana, ULAT, San Marcos, Americana"
  },
  {
    name: "Ingeniería Civil",
    keywords: { "matemática": 3, "física": 3, "proyectos": 2, "liderazgo": 2, "impacto": 2, "construcción": 2 },
    reason: "Tu pensamiento analítico y capacidad de planificación son perfectos para proyectos de infraestructura de alto impacto.",
    universities: "UCR, TEC, UNED, Fidelitas, Latina"
  },
  {
    name: "Ingeniería Eléctrica",
    keywords: { "tecnología": 3, "matemática": 3, "física": 2, "innovación": 2, "precisión": 2, "energía": 2 },
    reason: "Tu dominio en ciencias exactas y tecnología te califica para diseñar sistemas eléctricos y energéticos del futuro.",
    universities: "UCR, TEC, UNED, Fidelitas, Latina"
  },
  {
    name: "Ingeniería Industrial",
    keywords: { "negocios": 2, "liderazgo": 2, "datos": 2, "proyectos": 3, "innovación": 2, "procesos": 3 },
    reason: "Tu visión estratégica y habilidad para optimizar procesos te preparan para liderar la eficiencia empresarial.",
    universities: "UCR, TEC, UNED, Fidelitas, Latina"
  },
  {
    name: "Ingeniería Mecánica",
    keywords: { "física": 3, "matemática": 3, "tecnología": 2, "precisión": 2, "innovación": 2, "diseño": 2 },
    reason: "Tu pasión por la mecánica y las ciencias exactas te orientan a diseñar máquinas y sistemas de alto rendimiento.",
    universities: "TEC, UCR, UNED, Latina"
  },
  {
    name: "Ingeniería Química",
    keywords: { "química": 3, "ciencia": 3, "experimentación": 2, "procesos": 3, "precisión": 2, "innovación": 2 },
    reason: "Tu comprensión profunda de la química y los procesos productivos te lleva a industrias de transformación clave.",
    universities: "UCR, TEC"
  },
  {
    name: "Ingeniería Mecatrónica",
    keywords: { "tecnología": 3, "innovación": 3, "programación": 2, "física": 2, "diseño": 2, "robótica": 3 },
    reason: "Tu fascinación por la robótica y la automatización encaja perfectamente en esta carrera multidisciplinaria del futuro.",
    universities: "TEC, Fidelitas"
  },
  {
    name: "Ingeniería Ambiental",
    keywords: { "sostenibilidad": 3, "innovación": 2, "impacto": 3, "ciencia": 2, "naturaleza": 2, "recursos": 2 },
    reason: "Tu compromiso con el medio ambiente y pensamiento innovador encajan en soluciones sostenibles para el planeta.",
    universities: "TEC, EARTH, UNA, UCR"
  },
  {
    name: "Ingeniería en Computación",
    keywords: { "tecnología": 3, "programación": 3, "lógica": 3, "innovación": 2, "datos": 2, "desarrollo": 3 },
    reason: "Tu habilidad para resolver problemas complejos con tecnología te prepara para la vanguardia de la computación.",
    universities: "TEC, UCR"
  },
  {
    name: "Ingeniería en Producción Industrial",
    keywords: { "procesos": 3, "liderazgo": 2, "proyectos": 2, "innovación": 2, "negocios": 2, "producción": 3 },
    reason: "Tu capacidad para gestionar y optimizar sistemas productivos te lleva a liderar la industria manufacturera.",
    universities: "TEC, UNED"
  },
  {
    name: "Ingeniería en Seguridad Laboral",
    keywords: { "personas": 2, "salud": 2, "procesos": 2, "prevención": 3, "liderazgo": 2, "impacto": 2 },
    reason: "Tu compromiso con el bienestar laboral y la prevención te convierten en un profesional clave en cualquier industria.",
    universities: "UNED, TEC"
  },
  // ===== CIENCIAS NATURALES =====
  {
    name: "Biología",
    keywords: { "ciencia": 3, "biología": 3, "naturaleza": 2, "experimentación": 2, "observación": 2, "laboratorio": 2 },
    reason: "Tu curiosidad por la vida y los ecosistemas te orienta a una carrera científica de descubrimiento y conservación.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Biología Marina",
    keywords: { "ciencia": 3, "naturaleza": 3, "observación": 2, "sostenibilidad": 2, "experimentación": 2, "océano": 3 },
    reason: "Tu fascinación por la vida marina y el océano se funde con el rigor científico para explorar y conservar los mares.",
    universities: "UNA, UNED"
  },
  {
    name: "Química",
    keywords: { "ciencia": 3, "química": 3, "experimentación": 3, "laboratorio": 3, "precisión": 2, "observación": 2 },
    reason: "Tu pasión por entender la composición de la materia te lleva a una carrera de descubrimiento e innovación.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Física",
    keywords: { "ciencia": 3, "física": 3, "matemática": 3, "experimentación": 2, "lógica": 2, "observación": 2 },
    reason: "Tu necesidad de entender las leyes del universo te prepara para una carrera de ciencia pura y aplicada.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Geología",
    keywords: { "ciencia": 3, "naturaleza": 2, "observación": 2, "experimentación": 2, "recursos": 2, "tierra": 3 },
    reason: "Tu interés por la composición y dinámica de la Tierra te orienta a explorar recursos y prevenir desastres naturales.",
    universities: "UCR"
  },
  {
    name: "Estadística",
    keywords: { "datos": 3, "matemática": 3, "números": 3, "análisis": 3, "precisión": 2, "lógica": 2 },
    reason: "Tu capacidad para interpretar y modelar datos te convierte en un profesional clave en la era de la información.",
    universities: "UCR, UNED"
  },
  // ===== AGRONOMÍA Y AMBIENTE =====
  {
    name: "Ingeniería Agronómica",
    keywords: { "naturaleza": 3, "experimentación": 2, "sostenibilidad": 2, "impacto": 2, "producción": 2, "campo": 3 },
    reason: "Tu conexión con el campo y la producción sostenible se alinean con esta carrera práctica y transformadora.",
    universities: "UNA, TEC, UCR"
  },
  {
    name: "Ingeniería Forestal",
    keywords: { "naturaleza": 3, "sostenibilidad": 3, "impacto": 2, "recursos": 2, "observación": 2, "conservación": 3 },
    reason: "Tu pasión por los bosques y la gestión sostenible de recursos naturales te lleva a una carrera de conservación activa.",
    universities: "TEC, UNA"
  },
  {
    name: "Zootecnia",
    keywords: { "naturaleza": 2, "producción": 3, "animales": 3, "biología": 2, "sostenibilidad": 2, "campo": 2 },
    reason: "Tu interés en la producción animal sostenible y el bienestar pecuario te orientan a una carrera agropecuaria.",
    universities: "UNA, TEC"
  },
  {
    name: "Gestión Ambiental",
    keywords: { "sostenibilidad": 3, "naturaleza": 2, "impacto": 2, "recursos": 3, "innovación": 2, "conservación": 2 },
    reason: "Tu compromiso ecológico y visión estratégica te preparan para liderar proyectos de sostenibilidad y gestión ambiental.",
    universities: "UNED, UNA, TEC"
  },
  // ===== NEGOCIOS =====
  {
    name: "Administración de Empresas",
    keywords: { "negocios": 3, "liderazgo": 3, "datos": 2, "independiente": 2, "impacto": 1, "emprendimiento": 2 },
    reason: "Tu orientación empresarial y liderazgo te preparan para gestionar organizaciones y crear tus propios proyectos.",
    universities: "Todas las universidades del país"
  },
  {
    name: "Contaduría Pública",
    keywords: { "datos": 3, "números": 3, "precisión": 2, "negocios": 2, "análisis": 2, "finanzas": 2 },
    reason: "Tu capacidad analítica numérica y atención al detalle te posicionan en el corazón financiero de las empresas.",
    universities: "UCR, UNA, UNED, Latina, Fidelitas, Hispanoamericana, ULAT, San Marcos"
  },
  {
    name: "Economía",
    keywords: { "datos": 3, "números": 2, "análisis": 3, "negocios": 2, "impacto": 2, "finanzas": 2 },
    reason: "Tu capacidad para analizar mercados y tomar decisiones basadas en datos te prepara para entender la economía global.",
    universities: "UCR, UNA, UNED, Latina, ULAT"
  },
  {
    name: "Mercadeo",
    keywords: { "creatividad": 3, "comunicación": 3, "innovación": 2, "contenido": 2, "negocios": 2, "ventas": 2 },
    reason: "Tu creatividad y visión estratégica te convierten en un experto en conectar marcas con consumidores.",
    universities: "ULAT, Fidelitas, Latina, Creativa, Hispanoamericana, UNED"
  },
  {
    name: "Finanzas",
    keywords: { "números": 3, "datos": 3, "negocios": 2, "análisis": 3, "precisión": 2, "independiente": 2 },
    reason: "Tu habilidad para gestionar inversiones y analizar riesgos te prepara para el mundo de las finanzas corporativas.",
    universities: "ULAT, Fidelitas, Latina, UNED"
  },
  {
    name: "Negocios Internacionales",
    keywords: { "negocios": 3, "comunicación": 2, "liderazgo": 2, "innovación": 2, "global": 2, "comercio": 3 },
    reason: "Tu visión global y habilidades interculturales te preparan para liderar el comercio entre países.",
    universities: "ULAT, Fidelitas, Latina, Hispanoamericana"
  },
  {
    name: "Recursos Humanos",
    keywords: { "personas": 3, "comunicación": 3, "liderazgo": 2, "equipo": 3, "organización": 2, "negocios": 2 },
    reason: "Tu habilidad para conectar talento con oportunidades y tu sensibilidad social te destacan en gestión de personas.",
    universities: "UNED, ULAT, Latina, Fidelitas"
  },
  {
    name: "Turismo y Hotelería",
    keywords: { "personas": 2, "comunicación": 2, "creatividad": 2, "organización": 2, "viajes": 3, "servicio": 3 },
    reason: "Tu pasión por viajar y servir a otros te orienta a una carrera dinámica en la industria turística costarricense.",
    universities: "UNA, UNED, UTN, Latina, Fidelitas"
  },
  // ===== EDUCACIÓN =====
  {
    name: "Educación Primaria",
    keywords: { "personas": 3, "comunicación": 3, "impacto": 2, "enseñanza": 3, "equipo": 2, "creatividad": 2 },
    reason: "Tu vocación por formar las mentes del futuro y tu paciencia te hacen un educador excepcional.",
    universities: "UCR, UNA, UNED, Latina, San Marcos, Hispanoamericana"
  },
  {
    name: "Enseñanza del Inglés",
    keywords: { "comunicación": 3, "personas": 2, "enseñanza": 3, "global": 2, "idiomas": 3, "expresión": 2 },
    reason: "Tu dominio de idiomas y pasión por enseñar abren puertas globales para ti y tus estudiantes.",
    universities: "UCR, UNA, UNED, Latina, Fidelitas, San Marcos"
  },
  {
    name: "Educación Física",
    keywords: { "deporte": 3, "personas": 2, "enseñanza": 2, "salud": 2, "equipo": 2, "actividad": 3 },
    reason: "Tu energía y amor por el deporte te preparan para promover salud y bienestar a través de la actividad física.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Educación Especial",
    keywords: { "personas": 3, "ayudar": 3, "enseñanza": 2, "impacto": 3, "equipo": 2, "inclusión": 3 },
    reason: "Tu sensibilidad y compromiso con la inclusión te convierten en un agente de cambio para quienes más lo necesitan.",
    universities: "UCR, UNA, UNED"
  },
  // ===== CIENCIAS SOCIALES =====
  {
    name: "Derecho",
    keywords: { "comunicación": 2, "liderazgo": 2, "análisis": 2, "impacto": 3, "justicia": 3, "personas": 2 },
    reason: "Tu capacidad de análisis crítico y pasión por la justicia te preparan para una carrera de impacto legal y social.",
    universities: "UCR, UNA, UNED, ULAT, Hispanoamericana, Latina, Fidelitas, UACA, San Marcos, Americana"
  },
  {
    name: "Ciencias Políticas",
    keywords: { "comunicación": 2, "liderazgo": 3, "análisis": 2, "impacto": 3, "justicia": 2, "gobierno": 2 },
    reason: "Tu interés por el poder, la sociedad y el cambio social te orientan a entender y transformar la política.",
    universities: "UCR, UNA, ULAT"
  },
  {
    name: "Sociología",
    keywords: { "personas": 3, "análisis": 2, "impacto": 2, "investigación": 2, "sociedad": 3, "cambio": 2 },
    reason: "Tu curiosidad por entender las dinámicas sociales te prepara para investigar y proponer soluciones a problemas colectivos.",
    universities: "UCR, UNA"
  },
  {
    name: "Trabajo Social",
    keywords: { "ayudar": 3, "personas": 3, "comunicación": 2, "impacto": 3, "equipo": 2, "comunidad": 2 },
    reason: "Tu vocación de servicio y compromiso con las comunidades te convierten en un agente de transformación social.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Comunicación Colectiva",
    keywords: { "comunicación": 3, "creatividad": 2, "expresión": 2, "contenido": 3, "innovación": 2, "personas": 2 },
    reason: "Tu talento para contar historias y conectar con audiencias te lleva a los medios y la comunicación estratégica.",
    universities: "UCR, UNA, ULAT, Latina, Fidelitas, Creativa, Hispanoamericana"
  },
  {
    name: "Relaciones Internacionales",
    keywords: { "comunicación": 2, "liderazgo": 2, "global": 3, "impacto": 2, "análisis": 2, "diplomacia": 3 },
    reason: "Tu visión global y habilidades diplomáticas te preparan para representar intereses en el escenario internacional.",
    universities: "UCR, UNA, ULAT, Latina, Fidelitas"
  },
  // ===== ARQUITECTURA Y DISEÑO =====
  {
    name: "Arquitectura",
    keywords: { "creatividad": 3, "diseño": 3, "innovación": 2, "arte": 2, "construcción": 2, "proyectos": 2 },
    reason: "Tu visión creativa y precisión técnica se combinan para diseñar espacios que transforman comunidades.",
    universities: "UCR, UNA, Veritas, Latina, Fidelitas, Creativa"
  },
  {
    name: "Diseño Gráfico",
    keywords: { "creatividad": 3, "arte": 3, "innovación": 2, "expresión": 2, "contenido": 2, "visual": 3 },
    reason: "Tu talento visual y capacidad de comunicar ideas te convierten en un creador de identidades y experiencias.",
    universities: "UNA, Veritas, Creativa, Fidelitas, Latina, San Marcos"
  },
  {
    name: "Diseño Industrial",
    keywords: { "creatividad": 3, "diseño": 3, "innovación": 2, "tecnología": 2, "producción": 2, "productos": 3 },
    reason: "Tu capacidad para crear objetos funcionales y estéticos te lleva a diseñar los productos del mañana.",
    universities: "TEC, UNA, Veritas, Creativa"
  },
  {
    name: "Diseño de Interiores",
    keywords: { "creatividad": 3, "arte": 2, "diseño": 3, "innovación": 2, "estilo": 2, "espacios": 3 },
    reason: "Tu sensibilidad estética y visión espacial te permiten transformar interiores en experiencias únicas.",
    universities: "Veritas, Creativa, Latina, Fidelitas"
  },
  {
    name: "Cine y Producción Audiovisual",
    keywords: { "creatividad": 3, "arte": 2, "expresión": 3, "innovación": 2, "contenido": 2, "visual": 2 },
    reason: "Tu pasión por contar historias a través de imágenes te lleva al mundo del cine, la TV y el contenido digital.",
    universities: "Veritas, Creativa, UNA, ULAT"
  },
  // ===== ARTES =====
  {
    name: "Artes Plásticas",
    keywords: { "creatividad": 3, "arte": 3, "expresión": 3, "innovación": 2, "visual": 2, "estilo": 2 },
    reason: "Tu sensibilidad artística y necesidad de expresarte te llevan a explorar y transformar el mundo del arte.",
    universities: "UCR, UNA"
  },
  {
    name: "Música",
    keywords: { "creatividad": 3, "arte": 3, "expresión": 3, "innovación": 2, "disciplina": 2, "estilo": 2 },
    reason: "Tu talento musical y dedicación te preparan para una carrera de interpretación, composición o educación musical.",
    universities: "UCR, UNA"
  },
  {
    name: "Artes Escénicas (Teatro y Danza)",
    keywords: { "creatividad": 3, "arte": 3, "expresión": 3, "personas": 2, "equipo": 2, "escenario": 3 },
    reason: "Tu pasión por el escenario y la expresión corporal te lleva a una carrera artística de impacto cultural.",
    universities: "UCR, UNA"
  },
  // ===== INFORMÁTICA / TI =====
  {
    name: "Informática Empresarial",
    keywords: { "tecnología": 3, "negocios": 3, "datos": 2, "programación": 2, "innovación": 2, "organización": 2 },
    reason: "Tu visión para integrar tecnología con estrategia empresarial te prepara para liderar la transformación digital.",
    universities: "UCR, UNED, Fidelitas, Latina"
  },
  {
    name: "Ciberseguridad",
    keywords: { "tecnología": 3, "programación": 2, "lógica": 3, "innovación": 2, "protección": 3, "datos": 2 },
    reason: "Tu habilidad para proteger sistemas y anticipar amenazas te convierte en un guardián del mundo digital.",
    universities: "ULAT, Fidelitas, TEC"
  },
  {
    name: "Ciencia de Datos",
    keywords: { "datos": 3, "tecnología": 3, "matemática": 3, "análisis": 3, "programación": 2, "innovación": 2 },
    reason: "Tu capacidad para extraer conocimiento de grandes volúmenes de datos te hace invaluable en la era digital.",
    universities: "ULAT, TEC, Fidelitas, UCR"
  },
  {
    name: "Inteligencia Artificial",
    keywords: { "tecnología": 3, "innovación": 3, "programación": 3, "lógica": 3, "datos": 3, "desarrollo": 2 },
    reason: "Tu fascinación por crear sistemas inteligentes te coloca en la frontera de la innovación tecnológica mundial.",
    universities: "ULAT, Fidelitas, TEC"
  },
  // ===== TECNOLOGÍAS ESPECÍFICAS =====
  {
    name: "Ingeniería Electrónica",
    keywords: { "tecnología": 3, "física": 2, "innovación": 2, "diseño": 2, "precisión": 2, "circuitos": 3 },
    reason: "Tu comprensión de los circuitos y sistemas electrónicos te lleva a diseñar dispositivos que impulsan el mundo moderno.",
    universities: "TEC, UNED, Latina, Fidelitas"
  },
  {
    name: "Ingeniería en Telecomunicaciones",
    keywords: { "tecnología": 3, "innovación": 2, "física": 2, "comunicación": 3, "redes": 3, "global": 2 },
    reason: "Tu interés por conectar personas y sistemas te prepara para diseñar las redes de comunicación del futuro.",
    universities: "TEC, Fidelitas, Latina"
  },
  {
    name: "Ingeniería en Alimentos",
    keywords: { "ciencia": 3, "química": 2, "experimentación": 2, "producción": 2, "salud": 2, "alimentos": 3 },
    reason: "Tu interés por la ciencia aplicada a la producción de alimentos te lleva a innovar en la industria alimentaria.",
    universities: "TEC, UCR"
  },
  {
    name: "Ingeniería en Materiales",
    keywords: { "ciencia": 3, "química": 2, "física": 2, "innovación": 2, "experimentación": 2, "producción": 2 },
    reason: "Tu curiosidad por la composición y propiedades de los materiales te orienta a crear sustancias del futuro.",
    universities: "TEC"
  },
  // ===== OTRAS CARRERAS =====
  {
    name: "Gastronomía",
    keywords: { "creatividad": 3, "arte": 2, "innovación": 2, "expresión": 2, "alimentos": 3, "servicio": 2 },
    reason: "Tu pasión por la cocina y la creatividad culinaria te preparan para destacar en la industria gastronómica.",
    universities: "UTN, INA, Latina"
  },
  {
    name: "Topografía",
    keywords: { "naturaleza": 2, "matemática": 3, "precisión": 3, "proyectos": 2, "construcción": 2, "medición": 3 },
    reason: "Tu precisión y capacidad para medir y representar el terreno te hacen esencial en todo proyecto de construcción.",
    universities: "TEC, UNA"
  },
  {
    name: "Administración de Servicios de Salud",
    keywords: { "salud": 3, "organización": 2, "liderazgo": 2, "personas": 2, "negocios": 2, "impacto": 2 },
    reason: "Tu visión gerencial aplicada al sector salud te prepara para gestionar centros médicos y programas sanitarios.",
    universities: "UNED"
  },
  {
    name: "Gestión del Recurso Hídrico",
    keywords: { "sostenibilidad": 3, "recursos": 3, "ciencia": 2, "naturaleza": 2, "impacto": 2, "conservación": 2 },
    reason: "Tu compromiso con el agua como recurso vital te orienta a una carrera estratégica para el desarrollo sostenible.",
    universities: "TEC, UNA"
  }
];

const ADVICE_TEMPLATES = [
  "Tu perfil refleja una combinación única de habilidades y motivaciones. Te recomendamos investigar profundamente cada opción, visitar universidades, conectar con profesionales del área y realizar voluntariados para confirmar tu elección. Tu pasión será tu mejor guía en este viaje profesional.",
  "Tus respuestas revelan una verdadera vocación orientada al crecimiento integral. Explora estas carreras a través de charlas informativas, prácticas estudiantiles y mentorías con profesionales. Recuerda que la mejor carrera es aquella que te permite crecer constantemente.",
  "Tu potencial es evidente en cada respuesta. Encuentra la intersección entre lo que amas, lo que sabes hacer bien y lo que el mundo necesita. Mantén apertura mental, cultiva habilidades complementarias y confía en tu proceso de decisión.",
  "Las carreras recomendadas se alinean perfectamente con tu perfil vocacional. Te sugiero conectar con profesionales activos en estos campos, participar en ferias vocacionales y talleres especializados. Tu futuro depende de decisiones informadas y apasionadas.",
  "Tu análisis vocacional muestra fortalezas destacables en múltiples áreas. La clave está en encontrar la carrera donde tu pasión, tus habilidades naturales y el impacto social convergen. Sigue explorando y aprendiendo continuamente."
];

// ====================================
// APLICACIÓN PRINCIPAL (ARQUITECTURA)
// ====================================

const app = {
  state: {
    currentQuestion: 0,
    answers: [],
    selectedOption: null,
    path: [0]
  },

  // Inicialización
  init() {
    this.setupParticles();
    this.attachEventListeners();
  },

  setupParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth > 768 ? 30 : 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${15 + Math.random() * 20}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(particle);
    }
  },

  attachEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && this.state.selectedOption !== null) this.nextQuestion();
      if (e.key === 'ArrowLeft') this.previousQuestion();
    });
  },

  // Flujo del cuestionario
  startQuiz() {
    this.state = { currentQuestion: 0, answers: [], selectedOption: null, path: [0] };
    this.showScreen('quiz');
    this.displayQuestion();
  },

  displayQuestion() {
    const q = QUESTIONS[this.state.currentQuestion];
    document.getElementById('questionNumber').textContent = 
      `Pregunta ${this.state.path.length} de ${MAX_QUESTIONS}`;
    document.getElementById('questionText').textContent = q.title;

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `option-btn ${this.state.selectedOption === idx ? 'selected' : ''}`;
      btn.innerHTML = `<span class="emoji">${opt.emoji}</span><span class="text">${opt.text}</span>`;
      btn.onclick = () => this.selectOption(idx);
      container.appendChild(btn);
    });

    this.updateProgress();
    this.updateButtons();
  },

  selectOption(idx) {
    this.state.selectedOption = idx;
    this.displayQuestion();
  },

  nextQuestion() {
    if (this.state.selectedOption === null) return;

    const q = QUESTIONS[this.state.currentQuestion];
    const opt = q.options[this.state.selectedOption];
    const nextIdx = opt.next !== undefined ? opt.next : this.state.currentQuestion + 1;

    this.state.answers[this.state.currentQuestion] = this.state.selectedOption;

    if (nextIdx < QUESTIONS.length) {
      this.state.path.push(nextIdx);
      this.state.currentQuestion = nextIdx;
      this.state.selectedOption = this.state.answers[nextIdx] ?? null;
      this.displayQuestion();
    } else {
      this.analyzeAnswers();
    }
  },

  previousQuestion() {
    if (this.state.path.length > 1) {
      this.state.answers[this.state.currentQuestion] = this.state.selectedOption;
      this.state.path.pop();
      this.state.currentQuestion = this.state.path[this.state.path.length - 1];
      this.state.selectedOption = this.state.answers[this.state.currentQuestion] ?? null;
      this.displayQuestion();
    }
  },

  updateProgress() {
    const percent = (this.state.path.length / MAX_QUESTIONS) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
  },

  updateButtons() {
    const q = QUESTIONS[this.state.currentQuestion];
    const opt = this.state.selectedOption !== null ? q.options[this.state.selectedOption] : null;
    const nextIdx = opt ? (opt.next !== undefined ? opt.next : this.state.currentQuestion + 1) : -1;
    const isLast = nextIdx >= QUESTIONS.length;

    document.getElementById('prevBtn').style.display = 
      this.state.path.length > 1 ? 'block' : 'none';
    document.getElementById('nextBtn').textContent = 
      isLast ? '✓ Ver Resultados' : 'Siguiente →';
    document.getElementById('nextBtn').disabled = this.state.selectedOption === null;
  },

  // Análisis y resultados
  analyzeAnswers() {
    this.state.answers[this.state.currentQuestion] = this.state.selectedOption;
    this.showScreen('loading');
    
    // Simular análisis con pequeño delay
    setTimeout(() => this.performAnalysis(), 800);
  },

  performAnalysis() {
    const userProfile = this.extractUserProfile();
    const scoredCareers = this.scoreCareers(userProfile);
    const topCareers = scoredCareers.slice(0, 4);
    const advice = this.generateAdvice(userProfile);

    this.displayResults(topCareers, advice);
  },

  extractUserProfile() {
    return this.state.answers.map((ansIdx, qIdx) => {
      if (ansIdx === undefined) return '';
      return QUESTIONS[qIdx]?.options[ansIdx]?.text.toLowerCase() || '';
    });
  },

  scoreCareers(profile) {
    return CAREERS_DB.map(career => {
      let score = 0;

      profile.forEach(answer => {
        if (!answer) return;
        Object.entries(career.keywords).forEach(([keyword, weight]) => {
          if (answer.includes(keyword.toLowerCase())) {
            score += weight;
          }
        });
      });

      return { ...career, score };
    }).sort((a, b) => b.score - a.score);
  },

  generateAdvice(profile) {
    return ADVICE_TEMPLATES[Math.floor(Math.random() * ADVICE_TEMPLATES.length)];
  },

  displayResults(careers, advice) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = careers.map((c, idx) => `
      <div class="result-card">
        <div class="result-rank">${idx + 1}</div>
        <div class="result-title">${c.name}</div>
        <div class="result-reason">${c.reason}</div>
        <div class="result-unis">📍 ${c.universities}</div>
      </div>
    `).join('');

    document.getElementById('adviceContainer').innerHTML = `
      <div class="advice-title">💬 Tu Análisis Personalizado</div>
      <div class="advice-text">${advice}</div>
    `;

    this.showScreen('results');
  },

  shareResults() {
    const careers = Array.from(document.querySelectorAll('.result-title'))
      .map(el => el.textContent)
      .join(', ');

    const text = `Acabo de descubrir mis carreras ideales en Ruta Vocacional: ${careers}. ¡Descubre la tuya! 🌱`;

    if (navigator.share) {
      navigator.share({ title: 'Ruta Vocacional', text });
    } else {
      alert(`Mis carreras recomendadas:\n${careers}\n\n${text}`);
    }
  },

  restartQuiz() {
    this.state = { currentQuestion: 0, answers: [], selectedOption: null, path: [0] };
    this.showScreen('welcome');
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => app.init());
  