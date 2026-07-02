Guía de uso rápido — Ruta Vocacional

Este documento explica cómo funciona `ruta-vocacional.html` y cómo personalizarlo.

1) Estructura principal
- `QUESTIONS`: Array de 10 objetos con `title` y `options`.
  - Cada `options` es un array de objetos `{ emoji, text }`.
- `answers`: Almacena las respuestas seleccionadas por índice.

2) Flujo del cuestionario
- `startQuiz()` inicia el cuestionario y muestra la pantalla `quiz`.
- `displayQuestion()` renderiza la pregunta actual y opciones.
- `selectOption(index)` marca la opción seleccionada.
- `nextQuestion()` avanza o llama a `analyzeAnswers()` al final.

3) Análisis de resultados
- `performAnalysis()` ejecuta una heurística que compara palabras clave de las respuestas con una base local de carreras (`CAREERS_DB`).

4) Personalizar preguntas
- Abre `ruta-vocacional.html` y edita el array `QUESTIONS` al inicio del script.
- Mantén el mismo formato para que el renderizado y el almacenamiento de respuestas sigan funcionando.

5) Añadir/editar carreras localmente
- En `CAREERS_DB` hay objetos con `name`, `keywords` (objeto peso), `reason`, `universities`.
- Para mejorar las recomendaciones, añade carreras y palabras clave con pesos más representativos.

6) Depuración
- Si el cuestionario se comporta de forma extraña, abre la consola del navegador y revisa errores JS.
- Asegúrate de que `answers` no contenga valores fuera de rango; el código valida accesos a índices indefinidos.

7) Ejecutar servidor local (ejemplo)
```bash
python3 -m http.server 8000 --directory .
```

8) Preguntas frecuentes
- Q: ¿Cómo personalizo las recomendaciones?
  A: Edita `CAREERS_DB` en el script con las carreras y keywords que prefieras.

- Q: ¿Puedo cambiar el número de preguntas?
  A: Sí. Actualiza `QUESTIONS` y revisa funciones que calculan progreso y guardan respuestas. El código asume longitud dinámica de `QUESTIONS`.

Si quieres, puedo añadir documentación extra (CONTRIBUTING, LICENCE, CHANGELOG) o generar una versión en HTML de esta guía.