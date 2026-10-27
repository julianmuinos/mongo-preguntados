# AGENTS.md - MongoPreguntados (MongoDB Trivia Game)

## 1. Qué es el proyecto

**MongoPreguntados** es una aplicación web interactiva inspirada en la dinámica clásica de _Preguntados_ (Trivia Crack), diseñada para evaluar y reforzar conocimientos teóricos y prácticos sobre **MongoDB y Mongoose**.

> **Fuente única de verdad**: `Documento_MongoDB_y_Mongoose_NodeJS.pdf` (23 secciones; incluye todo el contenido de `Documento MongoDB y Mongoose.docx` más Mongoose). Toda pregunta debe poder justificarse con una sección de ese documento.
>
> **Especificación funcional**: ver [`spec.md`](./spec.md) (requisitos RF-x en notación EARS).

### Características Principales:

- **Temática MongoDB + Mongoose**: Banco de preguntas clasificado en 6 categorías, una por cada sector de la ruleta:
  1. 🟢 _Fundamentos_ (§1–4): base orientada a documentos, BSON, `_id`/ObjectId, notación de puntos, 16 MiB / GridFS, colecciones vs tablas SQL, datos de muestra.
  2. 🔵 _Node.js y Mongoose_ (§5–9): driver oficial vs ODM, Schema / Model / Document, `mongoose.connect()`, connection string y `.env`, roles y menor privilegio, SchemaTypes y validaciones, CRUD (mongosh vs Mongoose) y operadores MQL.
  3. 🟣 _Diseño y consultas_ (§10–14): índices, embedding vs referencing con `populate()`, middleware pre/post, `.lean()`, aggregation pipeline, Atlas Search y Vector Search.
  4. 🟠 _Funciones especiales_ (§15–18): Time Series, Change Streams (`Model.watch()`), transacciones, seguridad y encriptación.
  5. 🔴 _Producción_ (§19–21): replica set, sharding / shard key, replicación vs sharding, checklist de rendimiento.
  6. 🟡 _Herramientas y extras_ (§22–23): Atlas, Compass, mongosh, docs de Mongoose, Charts, Community Edition, University, ruta de aprendizaje.
- **Mecánica estilo Preguntados**:
  - **Ruleta interactiva animada** con secciones temáticas identificadas por colores e íconos.
  - **Modo Corona / Duelo**: Posibilidad de jugar por una insignia/corona de categoría para completar el tablero.
  - **Temporizador dinámico** por pregunta (ej. 20 o 30 segundos) con alerta visual de tiempo restante.
  - **Feedback pedagógico inmediato**: Al responder (acierto o fallo), se muestra una explicación detallada con fragmentos de código o citas teóricas para consolidar el aprendizaje.
  - **Power-ups / Comodines**: _50/50_ (descarta 2 opciones erróneas), _Bomba de Tiempo_ (+15 segundos), _Pase de pregunta_.
  - **Sistema de vidas y racha**: 3 vidas por partida; se recupera 1 vida al ganar una corona (máx. 3). Ver reglas completas en `spec.md`.
  - **Pantalla de Victoria / Estadísticas finales**: Resumen de rendimiento por categoría, porcentaje de aciertos y feedback global.
- **Arquitectura de Software**:
  - Single Page Application (SPA) cliente puro construida con **React + Vite**.
  - **Sin backend**: La lógica de puntuación, banco de preguntas y estado del juego residen en la aplicación (con persistencia opcional en `localStorage` para progreso y récords).

---

## 2. Comandos del Proyecto

El proyecto está configurado con **Node.js**, **React** y **Vite**.

| Comando           | Acción                                                                                   |
| :---------------- | :--------------------------------------------------------------------------------------- |
| `npm install`     | Instala las dependencias del proyecto.                                                   |
| `npm run dev`     | Inicia el servidor de desarrollo local de Vite (por defecto en `http://localhost:5173`). |
| `npm run build`   | Compila y optimiza el bundle de producción en el directorio `dist/`.                     |
| `npm run preview` | Ejecuta un servidor local para previsualizar la compilación de producción.               |
| `npm run lint`    | Ejecuta el linter (ESLint) para verificar calidad de código y buenas prácticas.          |

> **Nota para agentes**: Siempre verificar la compilación ejecutando `npm run build` antes de dar por concluida cualquier etapa o refactorización.

---

## 3. Estilo y Reglas de Desarrollo

### 3.1. Estética y Diseño Visual (Rich Aesthetics)

- **Identidad visual moderna y temática**:
  - Paleta de colores inspirada en el ecosistema MongoDB con estética _dark mode_ premium:
    - Fondos: Deep Slate / Obsidian (`#0b0f19`, `#111827`, `#1f2937`).
    - Color Primario (MongoDB Emerald): `#00ED64` / `#00684A` / `#023430`.
    - Colores de categorías (Ruleta): Verde esmeralda, Violeta/Púrpura, Azul cyan, Naranja cálido, Fucsia neón, Amarillo ámbar.
    - Textos: Alto contraste, tipografía legible y moderna (Google Fonts como _Outfit_, _Inter_ o _Plus Jakarta Sans_).
  - **Glassmorphism y Microanimaciones**:
    - Tarjetas con bordes sutiles iluminados, sombras suaves y fondos translúcidos (`backdrop-filter: blur(...)`).
    - Animación física y fluida del giro de la ruleta (curva de aceleración y desaceleración `cubic-bezier`).
    - Efectos de partículas / confetti al ganar una corona o acertar rachas.
    - Pulsaciones de color al acertar (verde esmeralda brillante) o fallar (rojo carmesí suave).
  - **Efectos de Sonido / Audio Web (Opcional con toggle)**:
    - Feedback sonoro mediante la API de Web Audio o efectos sutiles activables/desactivables.

### 3.2. Reglas de Código y Arquitectura

1. **Tecnologías Core**:
   - React 18+ con Hooks (`useState`, `useReducer`, `useEffect`, `useCallback`, `useMemo`).
   - **Tailwind CSS v4** vía el plugin `@tailwindcss/vite` (configuración con `@import "tailwindcss";` y `@theme` en CSS; sin `tailwind.config.js`).
   - Componentes limpios, desacoplados y con responsabilidad única (`Wheel`, `QuestionCard`, `Timer`, `ScoreBoard`, `BadgeCollector`, `ExplanationModal`).
2. **Estructura de Datos de Preguntas**:
   - Cada pregunta debe contener: `id`, `category`, `difficulty` ('facil' | 'medio' | 'avanzado'), `question`, `options` (array de 4 opciones), `correctIndex`, `explanation` (justificación teórica), `source` (sección del documento que la respalda, ej. `'§9 CRUD'`) y opcionalmente `codeSnippet` (ejemplo de consulta/código en sintaxis MongoDB o Mongoose).
   - El banco vive en `src/data/questions.js`. **Prohibido** agregar preguntas sobre temas que no figuren en el documento fuente.
3. **Persistencia y Estado**:
   - Uso de `localStorage` para guardar récords, categorías desbloqueadas y preferencias (sonido activado/desactivado).
4. **Responsive Design & Accesibilidad**:
   - Adaptable tanto a dispositivos móviles (vista tipo app nativa vertical) como a pantallas de escritorio (centrado con layout envolvente).
   - Uso de elementos semánticos HTML5 (`<main>`, `<section>`, `<article>`, `<button>`).
   - Elementos interactivos con identificadores (`id`) o atributos accesibles para pruebas automatizadas.

---

## 4. Verificación Obligatoria al Terminar

Antes de marcar cualquier tarea o iteración como finalizada, es **mandatorio** ejecutar y aprobar la siguiente lista de verificación:

1. **Compilación sin errores**:
   - Ejecutar `npm run build` y corroborar que el proceso finaliza con código de salida 0 (sin errores de sintaxis, imports rotos o problemas de tipado/variables no declaradas).
2. **Inspección en Navegador / Consola**:
   - Levantar el entorno de desarrollo y verificar que en la consola del navegador (`F12` / DevTools) no existan errores de ejecución (`Uncaught TypeError`, bucles infinitos en `useEffect`, advertencias de keys faltantes en listas React, etc.).
3. **Validación del Flujo Completo del Juego**:
   - [ ] **Giro de Ruleta**: La ruleta gira suavemente, se detiene en una categoría aleatoria y lanza la pregunta correspondiente.
   - [ ] **Manejo de Temporizador**: El contador decrece segundo a segundo y, si llega a 0, cuenta como respuesta incorrecta y avanza el turno.
   - [ ] **Interacción de Opciones**: Permite seleccionar una respuesta, bloquea clics posteriores durante la resolución y resalta en verde la correcta y en rojo la errónea.
   - [ ] **Modal / Panel de Explicación**: Se despliega la explicación teórica de MongoDB explicando el porqué de la respuesta.
   - [ ] **Actualización de Puntuación/Coronas**: Los aciertos suman puntos y/o asignan la insignia de la categoría en el panel de progreso.
   - [ ] **Uso de Comodines**: Al usar 50/50 se ocultan exactamente 2 respuestas incorrectas; el comodín de tiempo suma los segundos correspondientes.
   - [ ] **Fin de Partida**: Se muestra la pantalla final (Victoria al completar todas las categorías o Derrota al agotar vidas) con botón para reiniciar la partida limpiando el estado.
4. **Calidad Visual**:
   - Comprobar que no existan desbordamientos de texto en preguntas largas o bloques de código BSON/MQL.
   - Asegurarse de que no haya imágenes o recursos rotos ni placeholders vacíos.
