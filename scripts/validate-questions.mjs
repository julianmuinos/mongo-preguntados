import { pathToFileURL } from 'node:url';

const file = process.argv[2];
const { QUESTIONS, CATEGORIES } = await import(pathToFileURL(file).href);

const errors = [];
const REQUIRED = [
  'id',
  'category',
  'difficulty',
  'question',
  'options',
  'correctIndex',
  'explanation',
  'source',
];
const DIFFS = ['facil', 'medio', 'avanzado'];
const catIds = new Set(CATEGORIES.map((c) => c.id));
const ids = new Set();
const perCat = {};
const perDiff = {};
const perIndex = [0, 0, 0, 0];

for (const q of QUESTIONS) {
  for (const k of REQUIRED)
    if (q[k] === undefined || q[k] === '') errors.push(`${q.id}: falta ${k}`);
  if (ids.has(q.id)) errors.push(`${q.id}: id duplicado`);
  ids.add(q.id);
  if (!catIds.has(q.category))
    errors.push(`${q.id}: categoría inválida ${q.category}`);
  if (!DIFFS.includes(q.difficulty))
    errors.push(`${q.id}: dificultad inválida`);
  if (!Array.isArray(q.options) || q.options.length !== 4)
    errors.push(`${q.id}: no tiene 4 opciones`);
  else if (new Set(q.options).size !== 4)
    errors.push(`${q.id}: opciones duplicadas`);
  if (
    !Number.isInteger(q.correctIndex) ||
    q.correctIndex < 0 ||
    q.correctIndex > 3
  )
    errors.push(`${q.id}: correctIndex inválido`);
  else perIndex[q.correctIndex]++;
  if (!String(q.source).startsWith('§')) errors.push(`${q.id}: source sin §`);
  perCat[q.category] = (perCat[q.category] || 0) + 1;
  const key = `${q.category}/${q.difficulty}`;
  perDiff[key] = (perDiff[key] || 0) + 1;
}

for (const c of catIds)
  if (perCat[c] !== 10)
    errors.push(`${c}: tiene ${perCat[c] || 0} preguntas (se esperan 10)`);

console.log('Total:', QUESTIONS.length);
console.log('Por categoría:', perCat);
console.log('Por categoría/dificultad:', perDiff);
console.log('Distribución de correctIndex [0,1,2,3]:', perIndex);
if (errors.length) {
  console.error('ERRORES:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('OK: banco válido');
