// ====================================
// CONFIGURACIÓN Y DATOS
// ====================================

const MAX_QUESTIONS = QUESTIONS.length;

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
  // (el resto del array CAREERS_DB permanece sin cambios)
];

const ADVICE_TEMPLATES = [
  "Tu perfil refleja una combinación de habilidades técnicas y humanas. Investiga cada opción, asiste a charlas universitarias y habla con profesionales del área.",
  "Tus respuestas apuntan a carreras con impacto social. Considera prácticas y voluntariados para confirmar tu interés antes de decidir.",
  "Tienes inclinación por el análisis y la tecnología: explora cursos intro de programación y datos para validar tu aptitud.",
  "Muestras creatividad y gusto por lo visual: realiza pequeños proyectos (portafolio) y contacta diseñadores para orientación práctica.",
  "Busca la intersección entre lo que disfrutas y lo que eres bueno: prueba cursos cortos, participa en talleres y conversa con estudiantes de las carreras recomendadas."
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
      `Pregunta ${this.state.path.length} de ${QUESTIONS.length}`;
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
    const percent = (this.state.path.length / QUESTIONS.length) * 100;
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
    return QUESTIONS.map((q, qIdx) => {
      const ansIdx = this.state.answers[qIdx];
      if (ansIdx === undefined || !q || !q.options || !q.options[ansIdx]) return '';
      return q.options[ansIdx].text.toLowerCase();
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

    const url = location.href;
    const text = `Acabo de descubrir mis carreras ideales en Ruta Vocacional: ${careers}. ${url} 🌱`;

    if (navigator.share) {
      navigator.share({ title: 'Ruta Vocacional', text, url }).catch(()=>{});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Resultados copiados al portapapeles:\n' + careers);
      }).catch(()=>alert(text));
    } else {
      prompt('Copiar resultados', text);
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
