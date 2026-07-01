Guía de uso rápido — Ruta Vocacional

Este documento explica cómo funciona `ruta-vocacional.html` y cómo personalizarlo.

1) Estructura principal
- `questions`: Array de 10 objetos con `title` y `options`.
  - Cada `options` es un array de objetos `{ emoji, text }`.
- `answers`: Almacena las respuestas seleccionadas por índice.

2) Flujo del cuestionario
- `startQuiz()` inicia el cuestionario y muestra la pantalla `quiz`.
- `displayQuestion()` renderiza la pregunta actual y opciones.
- `selectOption(index)` marca la opción seleccionada.
- `nextQuestion()` avanza o llama a `analyzeAnswers()` al final.

3) Análisis de resultados
- `callAI(prompt)` intenta primero consultar un servicio local (Ollama) en `http://localhost:11434`.
- Si no hay servicio IA, `useLocalAnalysis()` ejecuta una heurística que compara palabras clave de las respuestas con una base local de carreras.

4) Personalizar preguntas
- Abre `ruta-vocacional.html` y edita el array `questions` al inicio del script.
- Mantén el mismo formato para que el renderizado y el almacenamiento de respuestas sigan funcionando.

5) Añadir/editar carreras localmente
- En `useLocalAnalysis()` hay un array `careers` con objetos que contienen `name`, `tags`, `reason`, `unis`.
- Para mejorar las recomendaciones, añade carreras y etiquetas (`tags`) más representativas.

6) Depuración
- Si el cuestionario se comporta de forma extraña, abre la consola del navegador y revisa errores JS.
- Asegúrate de que `answers` no contenga valores fuera de rango; el código actualizado ya valida accesos a índices indefinidos.

7) Ejecutar servidor local (ejemplo)
```bash
python3 -m http.server 8000 --directory .
```

8) Preguntas frecuentes
- Q: ¿Cómo desactivo la llamada a la IA?
  A: El código ya usa un fallback local si `fetch` falla. No necesitas hacer nada extra.

- Q: ¿Puedo cambiar el número de preguntas?
  A: Sí. Actualiza `questions` y revisa funciones que calculan progreso y guardan respuestas. El código asume longitud dinámica de `questions`.

Si quieres, puedo añadir documentación extra (CONTRIBUTING, LICENCE, CHANGELOG) o generar una versión en HTML de esta guía.