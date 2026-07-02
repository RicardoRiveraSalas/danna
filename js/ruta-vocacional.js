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

const QUESTIONS = [
  {
    title: "¿Cuál es tu principal fortaleza?",
    options: [
      { emoji: "🧠", text: "Análisis lógico y resolución de problemas" },
      { emoji: "🎨", text: "Creatividad e innovación" },
      { emoji: "👥", text: "Comunicación y trabajo en equipo" },
      { emoji: "🔬", text: "Observación y experimentación" }
    ]
  },
  {
    title: "¿Qué tipo de trabajo te atrae más?",
    options: [
      { emoji: "💻", text: "Trabajar con tecnología" },
      { emoji: "🏥", text: "Ayudar a otras personas" },
      { emoji: "📊", text: "Analizar datos y números" },
      { emoji: "✍️", text: "Expresar ideas y crear contenido" }
    ]
  },
  {
    title: "¿Cuál es tu ambiente ideal de trabajo?",
    options: [
      { emoji: "🏢", text: "Oficina moderna con equipos" },
      { emoji: "🌍", text: "Al aire libre o en terreno" },
      { emoji: "🔬", text: "Laboratorio o taller" },
      { emoji: "🎪", text: "Espacios dinámicos y variados" }
    ]
  },
  {
    title: "¿Qué materia te resultó más interesante en el colegio?",
    options: [
      { emoji: "⚛️", text: "Matemática y Física" },
      { emoji: "🧪", text: "Química y Biología" },
      { emoji: "📚", text: "Idiomas y Literatura" },
      { emoji: "🎭", text: "Arte y Educación Física" }
    ]
  },
  {
    title: "¿Cuál es tu objetivo profesional principal?",
    options: [
      { emoji: "💰", text: "Ganar bien y ser independiente" },
      { emoji: "🌟", text: "Hacer un impacto positivo" },
      { emoji: "📈", text: "Crecer y liderar proyectos" },
      { emoji: "❤️", text: "Disfrutar lo que hago" }
    ]
  },
  {
    title: "¿Cómo prefieres resolver problemas?",
    options: [
      { emoji: "🔍", text: "Investigar y experimentar" },
      { emoji: "📋", text: "Seguir procesos establecidos" },
      { emoji: "💡", text: "Pensar diferente e innovar" },
      { emoji: "🤝", text: "Consultar con otros" }
    ]
  },
  {
    title: "¿Qué te motiva aprender nuevas cosas?",
    options: [
      { emoji: "🎓", text: "El conocimiento en sí mismo" },
      { emoji: "🛠️", text: "Poder aplicar lo aprendido" },
      { emoji: "🏆", text: "Competir y destacar" },
      { emoji: "🌱", text: "Crecer como persona" }
    ]
  },
  {
    title: "¿Cuál es tu nivel de tolerancia al estrés?",
    options: [
      { emoji: "😌", text: "Bajo - prefiero ritmos tranquilos" },
      { emoji: "⚡", text: "Medio - trabajo bien bajo presión moderada" },
      { emoji: "🔥", text: "Alto - me activo con desafíos" },
      { emoji: "🧘", text: "Equilibrado - busco balance" }
    ]
  },
  {
    title: "¿Qué tipo de habilidades practicas frecuentemente?",
    options: [
      { emoji: "🖥️", text: "Programación y desarrollo" },
      { emoji: "🗣️", text: "Presentación y negociación" },
      { emoji: "🎬", text: "Edición y diseño multimedia" },
      { emoji: "📱", text: "Redes sociales y marketing" }
    ]
  },
  {
    title: "¿En qué campo te gustaría especializar?",
    options: [
      { emoji: "🚀", text: "Tecnología e innovación" },
      { emoji: "🌍", text: "Medio ambiente y sostenibilidad" },
      { emoji: "💼", text: "Negocios y administración" },
      { emoji: "🎓", text: "Educación y desarrollo" }
    ]
  }
];

const CAREERS_DB = [
  {
    name: "Ingeniería en Sistemas Computacionales",
    keywords: { "tecnología": 3, "lógica": 3, "innovación": 2, "programación": 3, "desarrollo": 3, "datos": 2 },
    reason: "Tu perfil demuestra una fuerte inclinación hacia la tecnología, análisis lógico y resolución de problemas. Ideal para diseñar soluciones digitales innovadoras.",
    universities: "TEC, UCR, UNED"
  },
  {
    name: "Ingeniería Civil",
    keywords: { "matemática": 3, "física": 3, "proyectos": 2, "liderazgo": 2, "impacto": 2 },
    reason: "Tu pensamiento analítico y capacidad de planificación son perfectos para proyectos de infraestructura de alto impacto social.",
    universities: "UCR, TEC, UNED"
  },
  {
    name: "Medicina",
    keywords: { "ayudar": 3, "biología": 3, "ciencia": 2, "impacto": 2, "personas": 2 },
    reason: "Tu vocación de servicio y profundo interés en ciencias naturales te posicionan para una carrera médica gratificante.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Administración de Empresas",
    keywords: { "negocios": 3, "liderazgo": 3, "datos": 2, "independiente": 2, "impacto": 1 },
    reason: "Tu orientación empresarial, liderazgo y capacidad analítica te preparan para gestionar organizaciones innovadoras.",
    universities: "UNED, UCR, UNIFIEM"
  },
  {
    name: "Psicología",
    keywords: { "personas": 3, "comunicación": 3, "ayudar": 2, "impacto": 2, "equipo": 2 },
    reason: "Tu empatía, inteligencia emocional y habilidades comunicativas son fundamentales en esta carrera de alto impacto.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Ingeniería Ambiental",
    keywords: { "sostenibilidad": 3, "innovación": 2, "impacto": 3, "ciencia": 2, "naturaleza": 2 },
    reason: "Tu interés en sustentabilidad y pensamiento innovador encajan perfectamente en soluciones ambientales del futuro.",
    universities: "EARTH, TEC, UNA"
  },
  {
    name: "Diseño Gráfico y Multimedia",
    keywords: { "creatividad": 3, "arte": 3, "innovación": 2, "expresión": 2, "contenido": 2 },
    reason: "Tu creatividad y capacidades artísticas te hacen ideal para profesiones de diseño e innovación visual de clase mundial.",
    universities: "UNA, UNED, institutos privados"
  },
  {
    name: "Enfermería",
    keywords: { "ayudar": 3, "personas": 2, "biología": 2, "impacto": 2, "salud": 2 },
    reason: "Tu vocación humanitaria y interés en ciencias de la salud te preparan para una carrera de servicio directo.",
    universities: "UCR, UNA, CAISALAS"
  },
  {
    name: "Ingeniería en Agronomía",
    keywords: { "naturaleza": 3, "experimentación": 2, "sostenibilidad": 2, "impacto": 2 },
    reason: "Tu conexión con la naturaleza y mentalidad sostenible se alinean con esta carrera práctica y transformadora.",
    universities: "UNA, TEC, UCR"
  },
  {
    name: "Contabilidad",
    keywords: { "datos": 3, "números": 3, "precisión": 2, "negocios": 2, "análisis": 2 },
    reason: "Tu capacidad analítica numérica y atención al detalle te posicionan en finanzas corporativas de impacto.",
    universities: "UNED, UCR, institutos técnicos"
  },
  {
    name: "Educación",
    keywords: { "personas": 3, "comunicación": 3, "impacto": 2, "enseñanza": 2, "equipo": 2 },
    reason: "Tu pasión por la enseñanza y capacidad de inspirar te hacen un candidato excepcional para transformar vidas.",
    universities: "UNA, UNED, UCR"
  },
  {
    name: "Marketing Digital",
    keywords: { "creatividad": 2, "comunicación": 3, "datos": 2, "innovación": 2, "contenido": 2 },
    reason: "Tu dominio creativo, comunicacional y de redes digitales te posiciona como experto en marketing moderno.",
    universities: "UNED, institutos técnicos, PUCE"
  },
  {
    name: "Derecho",
    keywords: { "comunicación": 2, "liderazgo": 2, "análisis": 2, "impacto": 3, "justicia": 2 },
    reason: "Tu capacidad de análisis crítico y pasión por justicia social te preparan para impacto legal significativo.",
    universities: "UCR, UNA, UNED"
  },
  {
    name: "Ingeniería Eléctrica",
    keywords: { "tecnología": 3, "matemática": 3, "física": 2, "innovación": 2, "precisión": 2 },
    reason: "Tu dominio en ciencias exactas y tecnología te califica para diseñar sistemas eléctricos del futuro.",
    universities: "UCR, TEC, UNED"
  },
  {
    name: "Biología Marina",
    keywords: { "ciencia": 3, "naturaleza": 3, "observación": 2, "sostenibilidad": 2, "experimentación": 2 },
    reason: "Tu fascinación por la naturaleza y el océano se funde con rigor científico en esta carrera innovadora.",
    universities: "UNA, UNED, institutos especializados"
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
    selectedOption: null
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
    this.state = { currentQuestion: 0, answers: [], selectedOption: null };
    this.showScreen('quiz');
    this.displayQuestion();
  },

  displayQuestion() {
    const q = QUESTIONS[this.state.currentQuestion];
    document.getElementById('questionNumber').textContent = 
      `Pregunta ${this.state.currentQuestion + 1} de ${QUESTIONS.length}`;
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

    this.state.answers[this.state.currentQuestion] = this.state.selectedOption;

    if (this.state.currentQuestion < QUESTIONS.length - 1) {
      this.state.currentQuestion++;
      this.state.selectedOption = this.state.answers[this.state.currentQuestion] ?? null;
      this.displayQuestion();
    } else {
      this.analyzeAnswers();
    }
  },

  previousQuestion() {
    if (this.state.currentQuestion > 0) {
      this.state.answers[this.state.currentQuestion] = this.state.selectedOption;
      this.state.currentQuestion--;
      this.state.selectedOption = this.state.answers[this.state.currentQuestion] ?? null;
      this.displayQuestion();
    }
  },

  updateProgress() {
    const percent = ((this.state.currentQuestion + 1) / QUESTIONS.length) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
  },

  updateButtons() {
    document.getElementById('prevBtn').style.display = 
      this.state.currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('nextBtn').textContent = 
      this.state.currentQuestion === QUESTIONS.length - 1 ? '✓ Ver Resultados' : 'Siguiente →';
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
    this.state = { currentQuestion: 0, answers: [], selectedOption: null };
    this.showScreen('welcome');
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => app.init());
  