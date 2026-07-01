# Danna — Portfolio y Ruta Vocacional

Pequeño sitio estático que muestra una galería de fotos y una herramienta interactiva "Ruta Vocacional" para ayudar a estudiantes a explorar opciones de carrera.

Contenido principal:
- `index.html`: galería de fotos con modal interactivo.
- `ruta-vocacional.html`: cuestionario interactivo de 10 preguntas que sugiere carreras.
- `fotos/`: carpeta con imágenes usadas por la galería.

Cómo ejecutar (desarrollo local):
1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta un servidor HTTP estático (ejemplo con Python 3):

```bash
python3 -m http.server 8000 --directory .
```

3. Abre `http://localhost:8000` en tu navegador.

Notas y personalización:
- Para añadir/quitar imágenes, deposítalas en la carpeta `fotos/` y nómbralas siguiendo el patrón usado (`img1.webp`, `img2.webp`, ...), o actualiza el array `images` en `index.html`.
- Para modificar las preguntas o respuestas del cuestionario, edita el array `questions` en `ruta-vocacional.html`.
- La función de análisis intenta usar un servidor local de IA (Ollama) si está disponible; si no, se usa un análisis local heurístico.

Contribuciones:
- Haz forks y pull requests para mejoras.
- Mantén los cambios enfocados y documenta las modificaciones en el PR.

Licencia: revisa con el autor del repositorio para añadir información de licencia.
