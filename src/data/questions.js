/**
 * Banco de preguntas de MongoPreguntados.
 * Fuente única: Documento_MongoDB_y_Mongoose_NodeJS.pdf (§ = sección del documento).
 * Esquema: ver AGENTS.md §3.2 y spec.md.
 */

export const CATEGORIES = [
  {
    id: 'fundamentos',
    label: 'Fundamentos',
    emoji: '🟢',
    color: '#00ED64',
    sections: '§1–4',
  },
  {
    id: 'mongoose',
    label: 'Node.js y Mongoose',
    emoji: '🔵',
    color: '#22D3EE',
    sections: '§5–9',
  },
  {
    id: 'diseno',
    label: 'Diseño y consultas',
    emoji: '🟣',
    color: '#A855F7',
    sections: '§10–14',
  },
  {
    id: 'especiales',
    label: 'Funciones especiales',
    emoji: '🟠',
    color: '#FB923C',
    sections: '§15–18',
  },
  {
    id: 'produccion',
    label: 'Producción',
    emoji: '🔴',
    color: '#F43F5E',
    sections: '§19–21',
  },
  {
    id: 'herramientas',
    label: 'Herramientas y extras',
    emoji: '🟡',
    color: '#FACC15',
    sections: '§22–23',
  },
];

export const QUESTIONS = [
  // ───────────────────────── 🟢 FUNDAMENTOS (§1–4) ─────────────────────────
  {
    id: 'fund-01',
    category: 'fundamentos',
    difficulty: 'facil',
    question: '¿Qué tipo de base de datos es MongoDB?',
    options: [
      'Relacional, basada en tablas con filas y columnas',
      'Orientada a documentos',
      'Orientada a grafos',
      'Clave-valor exclusivamente en memoria',
    ],
    correctIndex: 1,
    explanation:
      'MongoDB es una base de datos orientada a documentos: en lugar de tablas rígidas (como MySQL o PostgreSQL) guarda documentos flexibles parecidos a los objetos JSON de JavaScript.',
    codeSnippet: null,
    source: '§1 ¿Qué es MongoDB?',
  },
  {
    id: 'fund-02',
    category: 'fundamentos',
    difficulty: 'facil',
    question: 'En la analogía del archivero, ¿qué representa una colección?',
    options: [
      'El archivero completo',
      'Una ficha',
      'Un cajón',
      'La llave del archivero',
    ],
    correctIndex: 2,
    explanation:
      'La base de datos es el archivero, la colección es un cajón y el documento es una ficha dentro de ese cajón.',
    codeSnippet: null,
    source: '§3 Bases de datos y colecciones',
  },
  {
    id: 'fund-03',
    category: 'fundamentos',
    difficulty: 'facil',
    question: '¿En qué formato guarda MongoDB internamente los documentos?',
    options: ['BSON (Binary JSON)', 'XML', 'CSV', 'YAML'],
    correctIndex: 0,
    explanation:
      'Los documentos se guardan en BSON, una versión binaria de JSON que admite tipos enriquecidos como ObjectId, Date y Decimal128.',
    codeSnippet: null,
    source: '§2 Documentos',
  },
  {
    id: 'fund-04',
    category: 'fundamentos',
    difficulty: 'facil',
    question:
      '¿A qué equivale, de forma aproximada, una colección en una base relacional?',
    options: ['A una fila', 'A una columna', 'A un JOIN', 'A una tabla'],
    correctIndex: 3,
    explanation:
      'Una colección equivale aproximadamente a una tabla, con la diferencia de que no obliga a que todos los documentos tengan los mismos campos.',
    codeSnippet: null,
    source: '§3 Bases de datos y colecciones',
  },
  {
    id: 'fund-05',
    category: 'fundamentos',
    difficulty: 'medio',
    question: '¿Cuál es el tamaño máximo de un documento en MongoDB?',
    options: ['4 MiB', '16 MiB', '64 MiB', 'No tiene límite'],
    correctIndex: 1,
    explanation:
      'Un documento puede pesar hasta 16 MiB. Para almacenar archivos más grandes se utiliza GridFS.',
    codeSnippet: null,
    source: '§2 Documentos',
  },
  {
    id: 'fund-06',
    category: 'fundamentos',
    difficulty: 'medio',
    question:
      'Dado el documento de abajo, ¿qué devuelve la notación de puntos "contribs.1"?',
    options: [
      '"Turing machine"',
      '"Turing test"',
      'Nada: las posiciones empiezan en 1',
      '"Turing"',
    ],
    correctIndex: 1,
    explanation:
      'Las posiciones de un arreglo empiezan en 0: "contribs.0" es "Turing machine" y "contribs.1" es "Turing test".',
    codeSnippet: `{
  _id: ObjectId("5099803df3f4948bd2f98391"),
  name: { first: "Alan", last: "Turing" },
  contribs: [ "Turing machine", "Turing test" ]
}`,
    source: '§2 Documentos',
  },
  {
    id: 'fund-07',
    category: 'fundamentos',
    difficulty: 'medio',
    question: '¿Qué ocurre si insertás un documento sin indicar el campo _id?',
    options: [
      'La inserción falla',
      'El campo _id queda en null',
      'Se usa un número autoincremental como en SQL',
      'MongoDB genera automáticamente un ObjectId',
    ],
    correctIndex: 3,
    explanation:
      'Cada documento tiene un _id único que actúa como clave primaria; si no lo indicás, MongoDB genera automáticamente un ObjectId.',
    codeSnippet: null,
    source: '§2 Documentos',
  },
  {
    id: 'fund-08',
    category: 'fundamentos',
    difficulty: 'medio',
    question:
      '¿Qué servicio ofrece conjuntos de datos de muestra (películas, restaurantes…) listos para practicar?',
    options: ['MongoDB Atlas', 'Mongoose', 'GridFS', 'Change Streams'],
    correctIndex: 0,
    explanation:
      'MongoDB Atlas permite cargar datasets de muestra en un clúster con unos pocos clics, ideales para probar consultas y agregaciones.',
    codeSnippet: null,
    source: '§4 Datos de muestra',
  },
  {
    id: 'fund-09',
    category: 'fundamentos',
    difficulty: 'avanzado',
    question:
      '¿Cuál de estas afirmaciones sobre el orden de los campos de un documento es correcta?',
    options: [
      'El orden de los campos importa al comparar documentos enteros',
      'MongoDB reordena los campos alfabéticamente al guardar',
      'El orden de los campos nunca tiene importancia',
      'Solo importa el orden del campo _id',
    ],
    correctIndex: 0,
    explanation:
      'Los campos de un documento tienen un orden, y ese orden importa al comparar documentos enteros en MongoDB.',
    codeSnippet: null,
    source: '§2 Documentos',
  },
  {
    id: 'fund-10',
    category: 'fundamentos',
    difficulty: 'avanzado',
    question:
      'En SQL, la ficha de un cliente requiere 3 tablas (Clientes, Direcciones, Intereses) y JOINs. ¿Cómo lo resuelve MongoDB?',
    options: [
      'Con tres colecciones relacionadas por claves foráneas obligatorias',
      'Guardando el JSON completo como un string dentro de una tabla',
      'Con un solo documento autocontenido: la dirección anidada y los intereses en un arreglo',
      'Creando una vista materializada que une las tres tablas',
    ],
    correctIndex: 2,
    explanation:
      'MongoDB guarda la ficha en un solo documento autocontenido y natural: un subdocumento "direccion" y un arreglo "intereses", sin JOINs.',
    codeSnippet: `{
  nombre: "Lucía Gómez",
  direccion: { calle: "Av. Corrientes 1234", ciudad: "Buenos Aires" },
  intereses: ["Tecnología", "Lectura", "Diseño UX"]
}`,
    source: '§2 Documentos (comparación SQL vs. MongoDB)',
  },

  // ───────────────────── 🔵 NODE.JS Y MONGOOSE (§5–9) ─────────────────────
  {
    id: 'mong-01',
    category: 'mongoose',
    difficulty: 'facil',
    question: '¿Qué es Mongoose?',
    options: [
      'Un driver oficial de MongoDB para Python',
      'Un ODM (Object Document Mapper) construido sobre el driver oficial de Node.js',
      'Una aplicación gráfica para explorar colecciones',
      'El servicio en la nube de MongoDB',
    ],
    correctIndex: 1,
    explanation:
      'Mongoose es un ODM construido sobre el driver oficial de Node.js: define contratos claros, valida tipos, resuelve relaciones con populate() y permite hooks y métodos.',
    codeSnippet: null,
    source: '§5 Drivers en Node.js y el rol de Mongoose',
  },
  {
    id: 'mong-02',
    category: 'mongoose',
    difficulty: 'facil',
    question:
      '¿Dónde se debe guardar la cadena de conexión (connection string) de MongoDB?',
    options: [
      'Escrita directamente en el código fuente',
      'En el README del repositorio',
      'En variables de entorno (.env), leyéndola con process.env.MONGODB_URI',
      'En un comentario del frontend',
    ],
    correctIndex: 2,
    explanation:
      'La cadena de conexión es la dirección y la llave de tu base: nunca la subas a un repositorio público; guardala en .env y leela con process.env.MONGODB_URI.',
    codeSnippet: `await mongoose.connect(process.env.MONGODB_URI);`,
    source: '§6 Conectar a un clúster desde Node.js',
  },
  {
    id: 'mong-03',
    category: 'mongoose',
    difficulty: 'facil',
    question:
      '¿Qué método de Mongoose equivale a insertOne() de la consola para crear un documento?',
    options: [
      'Producto.create()',
      'Producto.find()',
      'Producto.findById()',
      'Producto.lean()',
    ],
    correctIndex: 0,
    explanation:
      'En Mongoose se crea con await Producto.create({...}) (o insertMany([...]) para lotes), equivalente a db.productos.insertOne() en mongosh.',
    codeSnippet: `await Producto.create({ nombre: "Mesa", precio: 5000 });`,
    source: '§9 Operaciones CRUD',
  },
  {
    id: 'mong-04',
    category: 'mongoose',
    difficulty: 'facil',
    question: '¿Qué operador MQL significa "dentro de una lista"?',
    options: ['$nin', '$or', '$set', '$in'],
    correctIndex: 3,
    explanation:
      '$in busca valores dentro de una lista; $nin es su opuesto (fuera de una lista).',
    codeSnippet: `{ categoria: { $in: ["Muebles", "Iluminación"] } }`,
    source: '§9 Operadores MQL',
  },
  {
    id: 'mong-05',
    category: 'mongoose',
    difficulty: 'medio',
    question:
      'Entre los 3 pilares de Mongoose (Schema, Model, Document), ¿qué es el Model?',
    options: [
      'El plano que define campos, tipos y validaciones',
      'La "fábrica": un constructor compilado a partir del Schema que provee métodos para consultar la colección',
      'Una instancia individual con método .save()',
      'Un hook que se ejecuta antes de guardar',
    ],
    correctIndex: 1,
    explanation:
      'El Schema es el plano, el Model es la fábrica (compilado con mongoose.model()) y el Document es la instancia individual.',
    codeSnippet: `const Producto = mongoose.model('Producto', productoSchema);`,
    source: '§5 Los 3 pilares de Mongoose',
  },
  {
    id: 'mong-06',
    category: 'mongoose',
    difficulty: 'medio',
    question:
      "Con mongoose.model('Producto', productoSchema), ¿a qué colección apunta el modelo?",
    options: ['Producto', 'producto', 'productos', 'Productos'],
    correctIndex: 2,
    explanation:
      "Mongoose pluraliza y pasa a minúsculas el nombre automáticamente: 'Producto' apunta a la colección productos.",
    codeSnippet: null,
    source: '§5 Los 3 pilares de Mongoose',
  },
  {
    id: 'mong-07',
    category: 'mongoose',
    difficulty: 'medio',
    question:
      '¿Qué opción de un SchemaType oculta un campo en las consultas por defecto (ideal para contraseñas)?',
    options: ['select: false', 'immutable: true', 'trim: true', 'enum'],
    correctIndex: 0,
    explanation:
      'select: false oculta el campo por defecto en las consultas. immutable impide modificarlo y trim quita espacios sobrantes.',
    codeSnippet: null,
    source: '§8 Schemas, Models y Validaciones',
  },
  {
    id: 'mong-08',
    category: 'mongoose',
    difficulty: 'medio',
    question:
      '¿Qué operador de actualización suma o resta un número a un campo?',
    options: ['$set', '$push', '$inc', '$gte'],
    correctIndex: 2,
    explanation:
      '$inc suma o resta un número. $set asigna un valor, $push agrega a un arreglo y $gte es de comparación.',
    codeSnippet: `{ $inc: { compras_totales: 1 }, $push: { intereses: "Node.js" } }`,
    source: '§9 Operadores MQL',
  },
  {
    id: 'mong-09',
    category: 'mongoose',
    difficulty: 'avanzado',
    question:
      '¿Qué opciones conviene pasar SIEMPRE a findByIdAndUpdate() en Mongoose?',
    options: [
      '{ lean: true, select: false }',
      '{ strict: false }',
      '{ timestamps: true }',
      '{ new: true, runValidators: true }',
    ],
    correctIndex: 3,
    explanation:
      'new: true devuelve el documento ya actualizado y runValidators: true aplica las validaciones del Schema durante la modificación.',
    codeSnippet: `await Producto.findByIdAndUpdate(id,
  { $set: { precio: 5500 } },
  { new: true, runValidators: true });`,
    source: '§9 Operaciones CRUD',
  },
  {
    id: 'mong-10',
    category: 'mongoose',
    difficulty: 'avanzado',
    question:
      'Con el Schema de abajo, ¿qué pasa al hacer await producto.save() con precio: -10?',
    options: [
      'Se guarda y Mongoose corrige el precio a 0',
      'Mongoose frena la operación con un error de validación antes de tocar la base de datos',
      'Se guarda, pero MongoDB lo marca como inválido',
      'Se guarda con una advertencia en consola',
    ],
    correctIndex: 1,
    explanation:
      'La validación se ejecuta automáticamente al llamar a validate() o save(): si el precio es negativo, Mongoose frena la operación antes de llegar a la base.',
    codeSnippet: `precio: { type: Number, required: true,
  min: [0, 'El precio no puede ser negativo'] }`,
    source: '§8 Schemas, Models y Validaciones',
  },

  // ───────────────────── 🟣 DISEÑO Y CONSULTAS (§10–14) ─────────────────────
  {
    id: 'dis-01',
    category: 'diseno',
    difficulty: 'facil',
    question: '¿Para qué sirve un índice en MongoDB?',
    options: [
      'Para acelerar las búsquedas',
      'Para encriptar los documentos',
      'Para validar los tipos de datos',
      'Para replicar los datos en otro servidor',
    ],
    correctIndex: 0,
    explanation:
      'Un índice acelera las búsquedas: sin él, MongoDB revisa todos los documentos (collection scan); con él va directo al dato, como el índice de un libro.',
    codeSnippet: `db.productos.createIndex({ nombre: 1 })`,
    source: '§10 Índices',
  },
  {
    id: 'dis-02',
    category: 'diseno',
    difficulty: 'facil',
    question: '¿Qué permite la búsqueda vectorial (Vector Search) de Atlas?',
    options: [
      'Buscar solo coincidencias exactas de texto',
      'Crear gráficos a partir de los datos',
      'Buscar por significado semántico mediante embeddings',
      'Comprimir datos de series de tiempo',
    ],
    correctIndex: 2,
    explanation:
      'Vector Search busca por significado semántico usando embeddings, no solo por palabras exactas. Es clave en aplicaciones con IA y RAG.',
    codeSnippet: null,
    source: '§14 Búsqueda y búsqueda vectorial',
  },
  {
    id: 'dis-03',
    category: 'diseno',
    difficulty: 'facil',
    question: '¿Cuál es la "regla de oro" del modelado de datos en MongoDB?',
    options: [
      'Normalizar siempre como en una base relacional',
      'Referenciar siempre, nunca incrustar',
      'Crear una colección por cada campo',
      'Modelar según cómo la aplicación usa los datos (lo que se consulta junto se guarda junto)',
    ],
    correctIndex: 3,
    explanation:
      'Se modela según cómo la aplicación usa los datos, no según cómo "debería" verse una tabla relacional.',
    codeSnippet: null,
    source: '§11 Modelado de datos',
  },
  {
    id: 'dis-04',
    category: 'diseno',
    difficulty: 'facil',
    question: '¿Qué es un pipeline de agregación?',
    options: [
      'Un conjunto de etapas que se ejecutan en paralelo sobre los datos originales',
      'Una cadena de etapas donde la salida de una es la entrada de la siguiente',
      'Un tipo especial de índice',
      'Un servidor secundario de un replica set',
    ],
    correctIndex: 1,
    explanation:
      'La agregación se hace con un pipeline: una cadena de etapas donde la salida de una etapa es la entrada de la siguiente.',
    codeSnippet: null,
    source: '§13 Operaciones de agregación',
  },
  {
    id: 'dis-05',
    category: 'diseno',
    difficulty: 'medio',
    question: '¿Por qué no conviene crear índices en todos los campos?',
    options: [
      'Porque MongoDB permite como máximo un índice por colección',
      'Porque los índices hacen más lentas las lecturas',
      'Porque los índices borran el índice automático de _id',
      'Porque ocupan espacio y hacen un poco más lentas las escrituras',
    ],
    correctIndex: 3,
    explanation:
      'Los índices aceleran las lecturas, pero ocupan espacio y hacen más lentas las escrituras: conviene crear solo los que usan los filtros reales.',
    codeSnippet: null,
    source: '§10 Índices',
  },
  {
    id: 'dis-06',
    category: 'diseno',
    difficulty: 'medio',
    question: '¿Cuándo conviene INCRUSTAR (embedding) datos relacionados?',
    options: [
      'Cuando los datos crecen sin límite',
      'Cuando se comparten entre muchos documentos',
      'Cuando se leen siempre juntos y tienen un tamaño acotado',
      'Cuando cambian muy seguido',
    ],
    correctIndex: 2,
    explanation:
      'Se incrusta cuando los datos se leen siempre juntos y tienen tamaño acotado (ej.: la dirección dentro del cliente). Los otros casos favorecen referenciar.',
    codeSnippet: null,
    source: '§11 Modelado de datos',
  },
  {
    id: 'dis-07',
    category: 'diseno',
    difficulty: 'medio',
    question: "¿Qué hace .populate('cliente') en una consulta de Pedido?",
    options: [
      'Reemplaza el ObjectId guardado por los datos reales del cliente referenciado',
      'Crea un cliente nuevo si no existe',
      'Copia los datos del cliente dentro del pedido de forma permanente',
      'Agrega un índice sobre el campo cliente',
    ],
    correctIndex: 0,
    explanation:
      'populate() resuelve la referencia ({ type: Schema.Types.ObjectId, ref: "Cliente" }) reemplazando el ObjectId por el documento real al consultar.',
    codeSnippet: `await Pedido.find({ estado: 'entregado' })
  .populate('cliente', 'nombre email');`,
    source: '§11 Modelado de datos con populate()',
  },
  {
    id: 'dis-08',
    category: 'diseno',
    difficulty: 'medio',
    question:
      '¿Qué ventaja tiene agregar .lean() a una consulta de solo lectura?',
    options: [
      'Valida los documentos antes de devolverlos',
      'Devuelve objetos planos de JavaScript (POJOs), reduciendo memoria y tiempo de respuesta',
      'Permite llamar a .save() sobre los resultados',
      'Crea automáticamente un índice para la consulta',
    ],
    correctIndex: 1,
    explanation:
      'Sin lean() Mongoose devuelve documentos hidratados (con seguimiento de cambios, getters y .save()). Con lean() devuelve POJOs, mucho más livianos.',
    codeSnippet: `await Producto.find({ enStock: true }).select('nombre precio').lean();`,
    source: '§12 Middleware y .lean()',
  },
  {
    id: 'dis-09',
    category: 'diseno',
    difficulty: 'avanzado',
    question:
      '¿En qué momento deben declararse los hooks schema.pre(...) de Mongoose?',
    options: [
      'Después de compilar el modelo con mongoose.model()',
      'Dentro de la función mongoose.connect()',
      'En cualquier momento, el orden no importa',
      'Antes de compilar el modelo con mongoose.model()',
    ],
    correctIndex: 3,
    explanation:
      'Regla importante: todos los hooks pre/post deben declararse antes de compilar el modelo con mongoose.model().',
    codeSnippet: `usuarioSchema.pre('save', async function () {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
});`,
    source: '§12 Middleware (hooks pre y post)',
  },
  {
    id: 'dis-10',
    category: 'diseno',
    difficulty: 'avanzado',
    question:
      'En Model.aggregate(), querés filtrar con $match por un _id que tenés como string. ¿Qué debés hacer?',
    options: [
      'Nada: Mongoose convierte el string automáticamente como en find()',
      'Agregar .lean() al final del pipeline',
      'Instanciar new mongoose.Types.ObjectId(idString) explícitamente',
      'Usar .populate() antes del $match',
    ],
    correctIndex: 2,
    explanation:
      'A diferencia de find(), Model.aggregate() no hace casting de tipos y devuelve objetos planos: hay que crear el ObjectId explícitamente.',
    codeSnippet: `{ $match: { _id: new mongoose.Types.ObjectId(idString) } }`,
    source: '§13 Agregación (Queries vs. Aggregation)',
  },

  // ─────────────────── 🟠 FUNCIONES ESPECIALES (§15–18) ───────────────────
  {
    id: 'esp-01',
    category: 'especiales',
    difficulty: 'facil',
    question:
      '¿Para qué tipo de datos están pensadas las colecciones de series de tiempo (Time Series)?',
    options: [
      'Contraseñas y datos sensibles',
      'Lecturas de sensores IoT, métricas de servidores o cotizaciones financieras',
      'Archivos de más de 16 MiB',
      'Relaciones entre clientes y pedidos',
    ],
    correctIndex: 1,
    explanation:
      'Las Time Series almacenan y comprimen de forma eficiente datos registrados secuencialmente a lo largo del tiempo.',
    codeSnippet: null,
    source: '§15 Colecciones de series de tiempo',
  },
  {
    id: 'esp-02',
    category: 'especiales',
    difficulty: 'facil',
    question: '¿Qué permiten los flujos de cambio (Change Streams)?',
    options: [
      'Enterarse en tiempo real de inserciones, modificaciones o borrados sin consultar repetidamente',
      'Cambiar el tipo de un campo en todos los documentos',
      'Migrar datos de SQL a MongoDB',
      'Repartir datos entre varios servidores',
    ],
    correctIndex: 0,
    explanation:
      'Los Change Streams notifican a la aplicación en tiempo real cuando algo cambia en la base, sin hacer polling.',
    codeSnippet: null,
    source: '§16 Flujos de cambio',
  },
  {
    id: 'esp-03',
    category: 'especiales',
    difficulty: 'facil',
    question: '¿Qué es una transacción?',
    options: [
      'Una consulta optimizada con índices',
      'Una copia de seguridad automática',
      'Un grupo de operaciones que se completan todas o no se aplica ninguna',
      'Un tipo de colección para datos financieros',
    ],
    correctIndex: 2,
    explanation:
      'Una transacción agrupa varias operaciones como una sola unidad atómica: o se completan todas, o no se aplica ninguna.',
    codeSnippet: null,
    source: '§17 Transacciones',
  },
  {
    id: 'esp-04',
    category: 'especiales',
    difficulty: 'facil',
    question: '¿Cuál es el ejemplo clásico de uso de una transacción?',
    options: [
      'Leer el catálogo de productos',
      'Registrar la temperatura de un sensor',
      'Buscar productos con autocompletado',
      'Una transferencia bancaria: restar saldo de una cuenta y sumarlo en otra',
    ],
    correctIndex: 3,
    explanation:
      'En una transferencia, restar de una cuenta y sumar en otra debe ocurrir junto o revertirse por completo.',
    codeSnippet: null,
    source: '§17 Transacciones',
  },
  {
    id: 'esp-05',
    category: 'especiales',
    difficulty: 'medio',
    question:
      '¿Por qué en MongoDB muchas veces NO hace falta usar transacciones?',
    options: [
      'Porque las operaciones sobre un único documento (incluidos sus subdocumentos) ya son atómicas',
      'Porque MongoDB no admite transacciones',
      'Porque los índices garantizan la atomicidad',
      'Porque Mongoose revierte los errores automáticamente',
    ],
    correctIndex: 0,
    explanation:
      'Las operaciones sobre un solo documento, incluidos sus subdocumentos incrustados, son atómicas por defecto.',
    codeSnippet: null,
    source: '§17 Transacciones',
  },
  {
    id: 'esp-06',
    category: 'especiales',
    difficulty: 'medio',
    question: '¿Qué requisito de infraestructura tienen los Change Streams?',
    options: [
      'Usar una colección Time Series',
      'Estar conectado a un conjunto de réplicas (replica set)',
      'Usar .lean() en todas las consultas',
      'Almacenar los datos con GridFS',
    ],
    correctIndex: 1,
    explanation:
      'Los Change Streams requieren estar conectado a un replica set, como los clústeres de MongoDB Atlas.',
    codeSnippet: null,
    source: '§16 Flujos de cambio',
  },
  {
    id: 'esp-07',
    category: 'especiales',
    difficulty: 'medio',
    question:
      '¿Qué método de un Modelo de Mongoose permite escuchar cambios en tiempo real?',
    options: [
      'Model.lean()',
      'Model.populate()',
      'Model.aggregate()',
      'Model.watch()',
    ],
    correctIndex: 3,
    explanation:
      'Model.watch() abre un Change Stream desde un Modelo de Mongoose.',
    codeSnippet: null,
    source: '§16 Flujos de cambio',
  },
  {
    id: 'esp-08',
    category: 'especiales',
    difficulty: 'medio',
    question: '¿Qué protege la encriptación en uso (In-Use Encryption)?',
    options: [
      'Solo los datos guardados en disco',
      'Solo los datos que viajan por la red',
      'Los datos sensibles incluso mientras se procesan en memoria',
      'Las contraseñas de los usuarios de Atlas',
    ],
    correctIndex: 2,
    explanation:
      'Además de la encriptación en tránsito y en reposo, la encriptación en uso protege los datos incluso mientras se procesan en memoria.',
    codeSnippet: null,
    source: '§18 Seguridad y encriptación',
  },
  {
    id: 'esp-09',
    category: 'especiales',
    difficulty: 'avanzado',
    question:
      '¿Qué particularidad tienen los documentos de una colección Time Series respecto del _id?',
    options: [
      'No requieren un índice único sobre _id',
      'Su _id debe ser siempre una fecha',
      'No pueden tener campo _id',
      'Su _id se genera con Decimal128',
    ],
    correctIndex: 0,
    explanation:
      'Los documentos de una colección Time Series no requieren un índice único sobre _id.',
    codeSnippet: null,
    source: '§15 Colecciones de series de tiempo',
  },
  {
    id: 'esp-10',
    category: 'especiales',
    difficulty: 'avanzado',
    question: '¿En qué caso SÍ se justifica usar una transacción?',
    options: [
      'Al actualizar un campo de un único documento',
      'Al agregar un ítem al arreglo de un subdocumento incrustado',
      'Cuando una operación de negocio modifica varios documentos en distintas colecciones a la vez',
      'Cuando una consulta de lectura es muy lenta',
    ],
    correctIndex: 2,
    explanation:
      'Las transacciones se usan cuando hay que modificar varios documentos (en distintas colecciones) como una unidad; un solo documento ya es atómico.',
    codeSnippet: null,
    source: '§17 Transacciones',
  },

  // ─────────────────────── 🔴 PRODUCCIÓN (§19–21) ───────────────────────
  {
    id: 'prod-01',
    category: 'produccion',
    difficulty: 'facil',
    question: '¿Qué hace la replicación en MongoDB?',
    options: [
      'Reparte los datos entre servidores para escalar',
      'Comprime los documentos grandes',
      'Crea índices automáticamente',
      'Mantiene copias sincronizadas de los mismos datos en varios servidores',
    ],
    correctIndex: 3,
    explanation:
      'La replicación mantiene copias sincronizadas de los mismos datos en varios servidores (un replica set).',
    codeSnippet: null,
    source: '§19 Replicación',
  },
  {
    id: 'prod-02',
    category: 'produccion',
    difficulty: 'facil',
    question: '¿Qué es el sharding (particionado)?',
    options: [
      'Hacer copias de seguridad diarias',
      'Repartir los datos entre varios servidores para escalar horizontalmente',
      'Dividir un documento grande en subdocumentos',
      'Encriptar los datos en reposo',
    ],
    correctIndex: 1,
    explanation:
      'El sharding reparte los datos entre varios servidores cuando un solo servidor no alcanza: es la forma de escalar horizontalmente.',
    codeSnippet: null,
    source: '§20 Particionado (Sharding)',
  },
  {
    id: 'prod-03',
    category: 'produccion',
    difficulty: 'facil',
    question: 'En un replica set, ¿qué pasa si el servidor primario falla?',
    options: [
      'Un nodo secundario toma su lugar automáticamente en cuestión de segundos',
      'La base de datos queda fuera de servicio hasta reiniciarlo',
      'Se pierden los datos del primario',
      'Hay que promover un secundario manualmente',
    ],
    correctIndex: 0,
    explanation:
      'Si el primario falla, un secundario toma su lugar automáticamente en segundos: eso brinda alta disponibilidad.',
    codeSnippet: null,
    source: '§19 Replicación',
  },
  {
    id: 'prod-04',
    category: 'produccion',
    difficulty: 'facil',
    question: '¿Qué beneficio principal aporta la replicación?',
    options: [
      'Consultas de agregación más rápidas',
      'Validación automática de esquemas',
      'Alta disponibilidad, tolerancia a fallos y protección contra pérdida de datos',
      'Mayor capacidad de almacenamiento repartiendo datos',
    ],
    correctIndex: 2,
    explanation:
      'Replicación = copias de los mismos datos → alta disponibilidad y tolerancia a fallos. Repartir datos para ganar capacidad es sharding.',
    codeSnippet: null,
    source: '§20 Replicación vs. Sharding',
  },
  {
    id: 'prod-05',
    category: 'produccion',
    difficulty: 'medio',
    question:
      '¿Qué utiliza el sharding para decidir cómo repartir los datos entre servidores?',
    options: [
      'El ObjectId de cada documento, siempre',
      'El índice automático de _id',
      'Una clave de partición (shard key)',
      'La cadena de conexión',
    ],
    correctIndex: 2,
    explanation:
      'El sharding reparte los datos utilizando una clave de partición (shard key).',
    codeSnippet: null,
    source: '§20 Particionado (Sharding)',
  },
  {
    id: 'prod-06',
    category: 'produccion',
    difficulty: 'medio',
    question:
      'El volumen de datos creció tanto que un solo servidor no alcanza. ¿Qué técnica corresponde?',
    options: ['Replicación', 'Sharding', 'Time Series', 'Transacciones'],
    correctIndex: 1,
    explanation:
      'Cuando el volumen o el tráfico superan a un servidor, se usa sharding para escalar horizontalmente.',
    codeSnippet: null,
    source: '§20 Particionado (Sharding)',
  },
  {
    id: 'prod-07',
    category: 'produccion',
    difficulty: 'medio',
    question:
      'Según la lista de comprobación, ¿cómo se logran "consultas livianas"?',
    options: [
      'Usando siempre populate() en todas las consultas',
      'Desactivando los índices',
      'Trayendo todos los campos para evitar consultas extra',
      'Usando .select() para traer solo los campos necesarios y .lean() en rutas de solo lectura',
    ],
    correctIndex: 3,
    explanation:
      'La checklist recomienda .select() para limitar campos y .lean() en las rutas de solo lectura.',
    codeSnippet: null,
    source: '§21 Rendimiento y lista de comprobación',
  },
  {
    id: 'prod-08',
    category: 'produccion',
    difficulty: 'medio',
    question:
      'Antes de ir a producción, ¿qué deben tener los campos usados frecuentemente en find() y sort()?',
    options: [
      'Su índice correspondiente',
      'La opción select: false',
      'Un hook pre-save',
      'Tipo Decimal128',
    ],
    correctIndex: 0,
    explanation:
      'La checklist pide verificar que los campos usados en filtros y ordenamientos tengan su índice.',
    codeSnippet: null,
    source: '§21 Rendimiento y lista de comprobación',
  },
  {
    id: 'prod-09',
    category: 'produccion',
    difficulty: 'avanzado',
    question:
      'Según la checklist, ¿qué hay que activar en cada findByIdAndUpdate o updateOne?',
    options: [
      'lean: true',
      'runValidators: true',
      'timestamps: false',
      'upsert: true',
    ],
    correctIndex: 1,
    explanation:
      'Hay que activar runValidators: true para que las reglas del Schema también se apliquen en las actualizaciones.',
    codeSnippet: null,
    source: '§21 Rendimiento y lista de comprobación',
  },
  {
    id: 'prod-10',
    category: 'produccion',
    difficulty: 'avanzado',
    question:
      'Una app necesita más capacidad porque un servidor no alcanza, y además seguir funcionando si un nodo falla. ¿Qué combinación corresponde?',
    options: [
      'Solo replicación',
      'Solo transacciones multi-documento',
      'Time Series con índices compuestos',
      'Sharding para la capacidad y replicación para la disponibilidad',
    ],
    correctIndex: 3,
    explanation:
      'Sharding reparte datos (capacidad y velocidad a gran escala) y replicación mantiene copias (alta disponibilidad): resuelven problemas distintos y se complementan.',
    codeSnippet: null,
    source: '§19–20 Replicación y Sharding',
  },

  // ─────────────────── 🟡 HERRAMIENTAS Y EXTRAS (§22–23) ───────────────────
  {
    id: 'herr-01',
    category: 'herramientas',
    difficulty: 'facil',
    question:
      '¿Qué herramienta es una aplicación gráfica (GUI) para explorar y editar datos sin escribir código?',
    options: ['mongosh', 'Charts', 'MongoDB Compass', 'Atlas Search'],
    correctIndex: 2,
    explanation:
      'MongoDB Compass permite explorar colecciones, editar documentos, analizar esquemas y probar agregaciones de forma visual.',
    codeSnippet: null,
    source: '§22 Herramientas y recursos',
  },
  {
    id: 'herr-02',
    category: 'herramientas',
    difficulty: 'facil',
    question:
      '¿Cuál es el servicio oficial de MongoDB en la nube, que permite crear un clúster gratuito?',
    options: [
      'MongoDB Atlas',
      'Community Edition',
      'Mongoose',
      'MongoDB University',
    ],
    correctIndex: 0,
    explanation:
      'MongoDB Atlas es el servicio gestionado en la nube; permite crear un clúster gratis en pocos minutos.',
    codeSnippet: null,
    source: '§22 Herramientas y recursos',
  },
  {
    id: 'herr-03',
    category: 'herramientas',
    difficulty: 'facil',
    question: '¿Qué es mongosh?',
    options: [
      'Un ODM para Node.js',
      'La consola interactiva (REPL) para conectarse al clúster y ejecutar comandos',
      'Un servicio de búsqueda de texto completo',
      'Una herramienta para crear gráficos',
    ],
    correctIndex: 1,
    explanation:
      'MongoDB Shell (mongosh) es una consola interactiva de JavaScript para ejecutar comandos como db.productos.find().',
    codeSnippet: `db.productos.find()`,
    source: '§22 Herramientas y recursos',
  },
  {
    id: 'herr-04',
    category: 'herramientas',
    difficulty: 'facil',
    question:
      '¿Cuál es la versión gratuita de MongoDB para instalar localmente en tu computadora?',
    options: [
      'MongoDB Atlas',
      'MongoDB Charts',
      'MongoDB Compass',
      'Community Edition',
    ],
    correctIndex: 3,
    explanation:
      'Community Edition es la versión gratuita para instalar MongoDB de forma local.',
    codeSnippet: null,
    source: '§22 Herramientas y recursos',
  },
  {
    id: 'herr-05',
    category: 'herramientas',
    difficulty: 'medio',
    question: '¿Para qué sirve MongoDB Charts?',
    options: [
      'Para ejecutar transacciones',
      'Para crear tableros visuales a partir de los datos en Atlas',
      'Para definir Schemas',
      'Para monitorear Change Streams',
    ],
    correctIndex: 1,
    explanation:
      'Charts permite crear tableros y visualizaciones desde los datos alojados en Atlas.',
    codeSnippet: null,
    source: '§22 Herramientas y recursos',
  },
  {
    id: 'herr-06',
    category: 'herramientas',
    difficulty: 'medio',
    question: '¿Qué ofrece MongoDB University?',
    options: [
      'Un clúster gratuito en la nube',
      'Soporte técnico pago',
      'Cursos oficiales gratuitos con rutas para desarrolladores de Node.js',
      'El registro de novedades de cada versión',
    ],
    correctIndex: 2,
    explanation:
      'MongoDB University ofrece cursos oficiales gratuitos, con rutas para desarrolladores de Node.js.',
    codeSnippet: null,
    source: '§22 Herramientas y recursos',
  },
  {
    id: 'herr-07',
    category: 'herramientas',
    difficulty: 'medio',
    question: 'Según la ruta de aprendizaje sugerida, ¿qué se estudia primero?',
    options: [
      'Documentos, colecciones y formato BSON, para cambiar el chip de tablas SQL a documentos',
      'Aggregation Pipeline',
      'Sharding y replicación',
      'Búsqueda vectorial',
    ],
    correctIndex: 0,
    explanation:
      'La ruta empieza por documentos, colecciones y BSON (§1–3); los temas de arquitectura quedan para el final.',
    codeSnippet: null,
    source: '§23 Ruta de aprendizaje sugerida',
  },
  {
    id: 'herr-08',
    category: 'herramientas',
    difficulty: 'medio',
    question:
      '¿Qué temas cubren las guías oficiales de Mongoose mencionadas en el documento?',
    options: [
      'Replica sets y sharding',
      'Instalación de Community Edition',
      'Gráficos con Charts',
      'Schemas, SchemaTypes, Models, Queries, Populate, Subdocumentos, Middleware y Lean',
    ],
    correctIndex: 3,
    explanation:
      'La documentación de Mongoose incluye guías de Schemas, SchemaTypes, Models, Queries, Populate, Subdocumentos, Middleware y Lean.',
    codeSnippet: null,
    source: '§22 Herramientas y recursos',
  },
  {
    id: 'herr-09',
    category: 'herramientas',
    difficulty: 'avanzado',
    question:
      'Según la ruta de aprendizaje, ¿qué representa "el 80% del trabajo diario en el código"?',
    options: [
      'Configurar sharding y replicación',
      'Escribir pipelines de agregación',
      'Diseñar Schemas, validaciones y operaciones CRUD con async/await',
      'Implementar búsqueda vectorial',
    ],
    correctIndex: 2,
    explanation:
      'Diseñar Schemas, validaciones y CRUD con async/await (§8 y 9) representa el 80% del trabajo diario.',
    codeSnippet: null,
    source: '§23 Ruta de aprendizaje sugerida',
  },
  {
    id: 'herr-10',
    category: 'herramientas',
    difficulty: 'avanzado',
    question:
      'Según la ruta de aprendizaje, ¿qué se combina con Subdocumentos y populate() para "escribir código limpio y rápido"?',
    options: [
      'Change Streams y transacciones',
      'Charts y Compass',
      'GridFS y Time Series',
      'Índices y optimización con .lean()',
    ],
    correctIndex: 3,
    explanation:
      'El paso 4 de la ruta: modelar relaciones con Subdocumentos y populate(), aplicar índices y optimizar con .lean() (§10–12).',
    codeSnippet: null,
    source: '§23 Ruta de aprendizaje sugerida',
  },
];
