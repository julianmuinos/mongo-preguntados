# spec.md — MongoPreguntados

> Especificación funcional del juego. Complementa a [`AGENTS.md`](./AGENTS.md), que define stack, estilo y verificación.
> Versión 1.0 · 26/10/2026

---

## 1. Contexto

Para la clase 16 de **ITBA – Full Stack Developer** se estudia el documento `Documento_MongoDB_y_Mongoose_NodeJS.pdf`. Es una guía introductoria de 23 secciones basada en el Manual de MongoDB v9.0 y en la documentación oficial de Mongoose v9.x.

Leer teoría de corrido cuesta y se olvida rápido. **MongoPreguntados** convierte ese documento en un juego de trivia estilo *Preguntados*: el jugador gira una ruleta de 6 categorías, responde preguntas contra reloj y, al terminar cada una, ve la explicación con la sección del documento que la respalda.

**Restricciones técnicas**
- SPA en **React + Vite + Tailwind CSS v4**, sin backend.
- El banco de preguntas es estático (`src/data/questions.js`).
- La persistencia es local (`localStorage`).
- El idioma de la interfaz y del contenido es **español (rioplatense)**.

**Categorías** (una por sector de la ruleta)

| ID | Categoría | Secciones del documento |
|---|---|---|
| `fundamentos` | 🟢 Fundamentos | §1–4 |
| `mongoose` | 🔵 Node.js y Mongoose | §5–9 |
| `diseno` | 🟣 Diseño y consultas | §10–14 |
| `especiales` | 🟠 Funciones especiales | §15–18 |
| `produccion` | 🔴 Producción | §19–21 |
| `herramientas` | 🟡 Herramientas y extras | §22–23 |

**Reglas de la partida (valores por defecto)**

| Parámetro | Valor |
|---|---|
| Vidas iniciales | 3 (máximo 3) |
| Tiempo por pregunta | 20 s |
| Racha para jugar por una corona | 3 aciertos consecutivos |
| Condición de victoria | Conseguir las 6 coronas |
| Condición de derrota | Quedarse sin vidas |
| Puntos por acierto | fácil 100 · medio 200 · avanzado 300, más 5 × segundos restantes |
| Comodines | 50/50, +15 s y Pasar; 1 uso de cada uno por partida |

---

## 2. Usuarios

| Usuario | Descripción | Necesidad principal |
|---|---|---|
| **Estudiante principiante** | Alumno del curso con poco o ningún conocimiento previo de MongoDB. Juega solo, en celular o en notebook. | Repasar el documento de forma entretenida y detectar en qué temas falla. |
| **Docente / ayudante** | Proyecta el juego en clase como dinámica grupal de repaso. | Que el juego arranque rápido, que se vea bien en pantalla grande y que cada respuesta se pueda justificar con el material. |

---

## 3. Historias de usuario

| ID | Historia | Criterios de aceptación |
|---|---|---|
| **HU-01** | Como estudiante, quiero **girar una ruleta** para que me toque una categoría al azar. | La ruleta muestra las 6 categorías con su color y emoji. El giro es animado. Al detenerse se indica claramente la categoría elegida. |
| **HU-02** | Como estudiante, quiero **responder preguntas de opción múltiple contra reloj** para poner a prueba lo que sé. | Hay 4 opciones y un temporizador visible de 20 s. Solo puedo elegir una opción. |
| **HU-03** | Como estudiante, quiero **ver la explicación y la sección del documento** después de responder, para aprender de mis errores. | Se marca la correcta en verde y mi elección errónea en rojo. Se muestran la explicación, el `source` (ej. "§9 CRUD") y el `codeSnippet` si existe. |
| **HU-04** | Como estudiante, quiero **ganar coronas por categoría** para tener un objetivo claro. | Con 3 aciertos seguidos puedo jugar por una corona. El tablero muestra las coronas ganadas y las pendientes. |
| **HU-05** | Como estudiante, quiero **usar comodines** cuando dudo, para tener una segunda oportunidad. | Cada comodín se usa una vez por partida y queda deshabilitado después de usarlo. |
| **HU-06** | Como estudiante, quiero **ver mis estadísticas al terminar** para saber qué temas repasar. | Se muestran el puntaje, el % de aciertos total y por categoría, y la categoría más floja con sus secciones del documento. |
| **HU-07** | Como estudiante, quiero que **se guarde mi récord y mis preferencias** entre sesiones. | El récord y la opción de sonido persisten al recargar la página. |
| **HU-08** | Como docente, quiero **proyectar el juego en pantalla grande y usarlo con teclado**, para manejarlo en clase. | El layout se adapta a 1440 px o más. Las opciones se eligen con las teclas 1–4 y se gira con Espacio. |

---

## 4. Requisitos funcionales (notación EARS)

Patrones EARS usados:
- **Ubicuo**: *El sistema deberá…*
- **Por evento**: *Cuando…, el sistema deberá…*
- **Por estado**: *Mientras…, el sistema deberá…*
- **Comportamiento no deseado**: *Si…, entonces el sistema deberá…*
- **Opcional**: *Donde…, el sistema deberá…*

### 4.1. Inicio y ruleta
- **RF-1** *(Ubicuo)* — El sistema deberá mostrar una pantalla de inicio con el título, el récord guardado y los botones "Jugar" y "Cómo se juega".
- **RF-2** *(Por evento)* — Cuando el jugador presione "Jugar", el sistema deberá iniciar una partida con 3 vidas, 0 puntos, 0 coronas, racha en 0 y los 3 comodines disponibles.
- **RF-3** *(Ubicuo)* — El sistema deberá mostrar una ruleta dividida en 6 sectores iguales, uno por categoría, con su color y emoji.
- **RF-4** *(Por evento)* — Cuando el jugador presione "Girar" (o la tecla Espacio), el sistema deberá elegir una categoría al azar con la misma probabilidad para todas y animar la ruleta hasta que se detenga sobre ese sector.
- **RF-5** *(Por estado)* — Mientras la ruleta esté girando, el sistema deberá deshabilitar el botón "Girar" y cualquier otra acción del juego.

### 4.2. Preguntas y temporizador
- **RF-6** *(Por evento)* — Cuando la ruleta se detenga, el sistema deberá mostrar una pregunta de la categoría elegida que no haya salido en la partida actual, con sus 4 opciones.
- **RF-7** *(Por estado)* — Mientras una pregunta esté activa, el sistema deberá mostrar una cuenta regresiva de 20 s que se actualice cada segundo y cambie a un estilo de alerta en los últimos 5 s.
- **RF-8** *(Por evento)* — Cuando el jugador elija una opción (clic o teclas 1–4), el sistema deberá detener el temporizador, bloquear el resto de las opciones y evaluar la respuesta.
- **RF-9** *(Por evento)* — Cuando la respuesta sea correcta, el sistema deberá resaltar la opción en verde, sumar los puntos según dificultad y tiempo restante, y aumentar la racha en 1.
- **RF-10** *(Por evento)* — Cuando la respuesta sea incorrecta, el sistema deberá resaltar la opción elegida en rojo y la correcta en verde, restar 1 vida y poner la racha en 0.
- **RF-11** *(Comportamiento no deseado)* — Si el temporizador llega a 0 sin respuesta, entonces el sistema deberá tratarlo como respuesta incorrecta (RF-10) e indicar "¡Tiempo agotado!".
- **RF-12** *(Por evento)* — Cuando se resuelva una pregunta, el sistema deberá mostrar un panel con la explicación, la sección del documento (`source`), el `codeSnippet` si existe, y un botón "Continuar".

### 4.3. Coronas y progreso
- **RF-13** *(Por evento)* — Cuando la racha llegue a 3, el sistema deberá ofrecer jugar por una corona, permitiendo elegir una categoría que todavía no tenga corona.
- **RF-14** *(Por evento)* — Cuando el jugador acierte la pregunta de corona, el sistema deberá otorgar la corona de esa categoría, recuperar 1 vida (sin superar 3), poner la racha en 0 y lanzar una animación de celebración.
- **RF-15** *(Por evento)* — Cuando el jugador falle la pregunta de corona, el sistema deberá aplicar RF-10 sin otorgar la corona.
- **RF-16** *(Ubicuo)* — El sistema deberá mostrar siempre un tablero con las vidas, el puntaje, la racha actual y las 6 coronas (ganadas o pendientes).

### 4.4. Comodines
- **RF-17** *(Por evento)* — Cuando el jugador use el comodín **50/50**, el sistema deberá ocultar exactamente 2 opciones incorrectas elegidas al azar.
- **RF-18** *(Por evento)* — Cuando el jugador use el comodín **+15 s**, el sistema deberá sumar 15 segundos al temporizador de la pregunta activa.
- **RF-19** *(Por evento)* — Cuando el jugador use el comodín **Pasar**, el sistema deberá descartar la pregunta sin sumar ni restar vidas, puntos o racha, y volver a la ruleta.
- **RF-20** *(Por estado)* — Mientras un comodín ya se haya usado en la partida, o no haya ninguna pregunta activa, el sistema deberá mostrarlo deshabilitado.

### 4.5. Fin de partida y persistencia
- **RF-21** *(Por evento)* — Cuando el jugador consiga las 6 coronas, el sistema deberá mostrar la pantalla de **Victoria**.
- **RF-22** *(Por evento)* — Cuando las vidas lleguen a 0, el sistema deberá mostrar la pantalla de **Derrota**.
- **RF-23** *(Ubicuo)* — Las pantallas de Victoria y Derrota deberán mostrar el puntaje final, el % de aciertos total y por categoría, la categoría con menor % de aciertos junto con sus secciones del documento, y un botón "Jugar de nuevo".
- **RF-24** *(Por evento)* — Cuando el jugador presione "Jugar de nuevo", el sistema deberá reiniciar todo el estado de la partida (RF-2) sin borrar el récord.
- **RF-25** *(Por evento)* — Cuando una partida termine con un puntaje mayor al récord guardado, el sistema deberá guardar el nuevo récord en `localStorage` y avisar "¡Nuevo récord!".
- **RF-26** *(Opcional)* — Donde el sonido esté activado, el sistema deberá reproducir efectos cortos al girar, al acertar, al fallar y al ganar una corona.
- **RF-27** *(Ubicuo)* — El sistema deberá ofrecer un botón para activar o desactivar el sonido (desactivado por defecto) y guardar esa preferencia en `localStorage`.

---

## 5. Casos límite

| # | Caso | Comportamiento esperado |
|---|---|---|
| CL-1 | **Se agotan las preguntas** de una categoría en la partida. | Se vuelve a mezclar el mazo de esa categoría, evitando que la primera pregunta nueva sea la última que salió. |
| CL-2 | El jugador **responde justo cuando el temporizador llega a 0**. | Gana el primer evento que se procese y el segundo se ignora. Nunca se descuentan 2 vidas por una misma pregunta. |
| CL-3 | **Doble clic** sobre una opción o sobre "Girar". | Solo se procesa el primer clic (ver RF-5 y RF-8). |
| CL-4 | Se usan **50/50 y +15 s** en la misma pregunta. | Se permite: las dos acciones son independientes. |
| CL-5 | Se usa **50/50 en una pregunta de corona**. | Se permite, igual que en una pregunta normal. |
| CL-6 | La ruleta cae en una **categoría que ya tiene corona**. | Se juega igual: el acierto suma puntos y racha, pero no da otra corona. |
| CL-7 | Se llega a racha 3 cuando **solo falta 1 corona**. | La elección de categoría se resuelve sola con la única categoría pendiente. |
| CL-8 | **`localStorage` no está disponible** (modo privado) o tiene **JSON corrupto**. | El juego funciona igual con valores por defecto, sin errores en consola, y se sobrescribe el dato inválido. |
| CL-9 | La **pestaña pasa a segundo plano** durante una pregunta. | El temporizador se calcula con marcas de tiempo (`Date.now()`), no contando *ticks*, así que al volver muestra el tiempo real. |
| CL-10 | **Pregunta o `codeSnippet` muy largo** en una pantalla de 375 px. | El texto hace salto de línea y el código tiene scroll horizontal propio. No hay desborde de la página. |
| CL-11 | Se **recarga la página a mitad de partida**. | La partida en curso no se restaura (fuera de alcance) y se vuelve al inicio. El récord se conserva. |
| CL-12 | Se **gana la 6.ª corona con la última vida**. | Se prioriza la Victoria (RF-21). |
| CL-13 | Se usa **Pasar con 1 vida**. | No se pierde la vida y se vuelve a la ruleta. |

---

## 6. Fuera de alcance

- Backend, base de datos real o API (el juego no se conecta a MongoDB).
- Multijugador online, duelos entre usuarios o ranking global.
- Cuentas de usuario, login o sincronización entre dispositivos.
- Restaurar una partida en curso después de recargar la página.
- Recuperar vidas con el paso del tiempo.
- Editor o carga de preguntas desde la interfaz.
- Preguntas sobre temas que no estén en el documento fuente.
- Otros idiomas además del español.
- Publicación o deploy (solo se pide que `npm run build` funcione).

---

## 7. Criterios de finalización

El proyecto se considera terminado cuando se cumple **todo** lo siguiente:

1. Los requisitos **RF-1 a RF-27** están implementados y verificados manualmente.
2. Los casos límite **CL-1 a CL-13** tienen el comportamiento esperado.
3. `src/data/questions.js` tiene **60 preguntas (10 por categoría)** que pasan la validación automática: esquema completo, 4 opciones únicas, `correctIndex` válido, `id` únicos y `source` presente.
4. `npm run build` y `npm run lint` terminan **sin errores**.
5. La consola del navegador queda **sin errores ni advertencias de React** durante una partida completa.
6. El checklist de la sección 4 de `AGENTS.md` está aprobado.
7. El diseño funciona sin desbordes en **375 px** (móvil) y **1440 px** (escritorio).

---

## 8. Dudas abiertas

| # | Duda | Valor provisional |
|---|---|---|
| DA-1 | ¿Hace falta un **modo práctica** (sin vidas ni tiempo, eligiendo la categoría)? | No incluido en v1. |
| DA-2 | ¿El **tiempo por pregunta** debería depender de la dificultad (ej. 15 / 20 / 30 s)? | 20 s fijo. |
| DA-3 | ¿La **pregunta de corona** debería ser siempre de dificultad avanzada? | Cualquier dificultad. Si no hay avanzadas disponibles, cualquiera. |
| DA-4 | ¿Se amplía el banco a **más de 10 preguntas por categoría** para que se repitan menos? | 10 por categoría en v1. |
| DA-5 | ¿El **sonido** debería estar activado por defecto? | Desactivado (pensado para usarlo en el aula). |
| DA-6 | ¿Se agrega una **pantalla de repaso** que liste las preguntas falladas con su `source`? | No incluido en v1. Candidata para v1.1. |
