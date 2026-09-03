/* ============================================================
   SALA CRISOL — CONFIGURACIÓN DEL SITIO
   ============================================================
   👋 Hola Consuelo (o quien administre esto):
   Este es el ÚNICO archivo que necesitas editar mes a mes.
   Aquí viven los datos de contacto, las clases, horarios,
   cupos y precios. Guarda el archivo y recarga la página.

   Para publicar los cambios: git add -A && git commit -m "..." && git push
   (o edítalo desde github.com con el lapicito ✏️)
   ============================================================ */

const CRISOL = {

  /* ---------- CONTACTO ---------- */
  // WhatsApp de la sala (Consuelo Ongaro) · +56 9 9175 7042
  // Formato: código de país + número, sin +, sin espacios.
  whatsapp: "56991757042",
  instagram: "sala.crisol",
  correo: "", // opcional, ej: "salacrisol@gmail.com" (déjalo vacío si no)

  /* ---------- UBICACIÓN ---------- */
  direccion: "Av. Salvador 2302, Ñuñoa · Santiago",
  metros: [
    "Metro Monseñor Eyzaguirre (L3) — 4 min caminando",
    "Metro Irarrázaval (L3 / L5) — 8 min caminando",
  ],

  /* ---------- MES VISIBLE EN LA PORTADA ---------- */
  mesActual: "Septiembre",

  /* ============================================================
     INSCRIPCIONES
     ------------------------------------------------------------
     Pega aquí la URL /exec del Apps Script (ver _sistema/LEEME_INSCRIPCIONES.md).
     Si la dejas vacía, el formulario sigue funcionando pero manda
     la inscripción solo por WhatsApp, sin guardarla en la planilla.
     ============================================================ */
  inscripcionesURL: "https://script.google.com/macros/s/AKfycbytOFR00-9flkCPUqjdD1c4wmndc2AXotLS8c9j5_5Yr0-jD83SeRu0_U2c2j9vq_gu-g/exec",

  /* ============================================================
     CLASES
     ------------------------------------------------------------
     Cada clase tiene:
     - id: no lo cambies (conecta la grilla con la página)
     - cupos: total y disponibles POR HORARIO → edítalos cuando
       se llene o se abra un cupo. Si no quieres mostrar cupos,
       pon disponibles: null
     - precios: texto libre, cámbialo cuando cambie el valor
     - estado: "activo" | "pronto" (pronto = sin inscripción,
       muestra "nueva fecha por anunciar")
     - color: el banderín que le toca en la portada
     ============================================================ */
  talleres: [
    {
      id: "pilates-mat",
      nombre: "Pilates Mat",
      profe: "Esperanza Fredes",
      profeIg: "pilates.voy",
      frase: "Fuerza que se construye desde el centro.",
      nivel: "Todos los niveles",
      duracion: "1 hora",
      pagina: "talleres/pilates-mat.html",
      // Portada y fotos salen de img/talleres/<id>/ — ver el LEEME.

      color: "salvia",
      estado: "activo",
      horarios: [
        { dia: "Lunes", hora: "10:00 – 11:00", cuposTotal: 10, cuposDisponibles: 6 },
        { dia: "Viernes", hora: "10:00 – 11:00", cuposTotal: 10, cuposDisponibles: 6 },
        { dia: "Sábado", hora: "17:30 – 18:30", cuposTotal: 10, cuposDisponibles: 8 },
      ],
      // Valores de Esperanza
      precios: [
        { nombre: "Clase suelta", valor: "$10.000", monto: 10000 },
        { nombre: "4 clases al mes", valor: "$35.000", monto: 35000 },
        { nombre: "8 clases al mes", valor: "$45.000", monto: 45000 },
      ],
    },
    {
      id: "danza-contemporanea",
      nombre: "Danza Contemporánea",
      profe: "Esperanza Fredes",
      profeIg: "pilates.voy",
      frase: "El cuerpo que piensa mientras se mueve.",
      nivel: "Todos los niveles",
      duracion: "1 hora",
      pagina: "talleres/danza-contemporanea.html",
      // Portada y fotos salen de img/talleres/<id>/ — ver el LEEME.
      portadaEsFoto: true,

      color: "turquesa",
      estado: "activo",
      horarios: [
        { dia: "Sábado", hora: "10:30 – 11:30", cuposTotal: 12, cuposDisponibles: 8 },
      ],
      // Valores de Esperanza
      precios: [
        { nombre: "Clase suelta", valor: "$10.000", monto: 10000 },
        { nombre: "4 clases al mes", valor: "$35.000", monto: 35000 },
        { nombre: "8 clases al mes", valor: "$45.000", monto: 45000 },
      ],
    },
    {
      id: "movimiento-flexible",
      nombre: "Movimiento Flexible",
      profe: "Consuelo Ongaro",
      profeIg: "_consuelidad_",
      frase: "La flexibilidad no es doblarse: es habitar más cuerpo.",
      nivel: "Todos los niveles",
      duracion: "2 horas",
      pagina: "talleres/movimiento-flexible.html",
      // Portada y fotos salen de img/talleres/<id>/ — ver el LEEME.

      color: "rosa",
      estado: "activo",
      horarios: [
        { dia: "Lunes", hora: "19:00 – 21:00", cuposTotal: 10, cuposDisponibles: 4 },
        { dia: "Martes", hora: "10:00 – 12:00", cuposTotal: 10, cuposDisponibles: 7 },
        { dia: "Sábado", hora: "12:30 – 14:30", cuposTotal: 10, cuposDisponibles: 6 },
      ],
      // Valores de Consuelo
      precios: [
        { nombre: "Clase suelta", valor: "$12.000", monto: 12000 },
        { nombre: "4 clases al mes", valor: "$40.000", monto: 40000 },
        { nombre: "8 clases al mes", valor: "$50.000", monto: 50000 },
      ],
    },
    {
      id: "equilibrio-de-manos",
      nombre: "Equilibrio de Manos",
      profe: "Consuelo Ongaro",
      profeIg: "_consuelidad_",
      frase: "El mundo se ve mejor al revés.",
      nivel: "Inicial · sin experiencia",
      duracion: "2 horas",
      pagina: "talleres/equilibrio-de-manos.html",
      // Portada y fotos salen de img/talleres/<id>/ — ver el LEEME.

      color: "mostaza",
      estado: "activo",
      // horarios del flyer "Taller regular / Inicial"
      horarios: [
        { dia: "Miércoles", hora: "10:00 – 12:00", cuposTotal: 8, cuposDisponibles: 3 },
        { dia: "Sábado", hora: "15:30 – 17:30", cuposTotal: 8, cuposDisponibles: 6 },
      ],
      // Valores de Consuelo
      precios: [
        { nombre: "Clase suelta", valor: "$12.000", monto: 12000 },
        { nombre: "4 clases al mes", valor: "$40.000", monto: 40000 },
        { nombre: "8 clases al mes", valor: "$50.000", monto: 50000 },
      ],
    },
    {
      id: "danza-filosofia",
      nombre: "Danza y Filosofía",
      subtitulo: "Experiencia sensual (Sensuallstyle)",
      profe: "Amar Estefanía",
      profeIg: "",
      frase: "Un espacio para gozar, disfrutar y ser.",
      nivel: "Todos los niveles",
      duracion: "1 hora 15 min",
      pagina: "talleres/danza-filosofia.html",
      // Portada y fotos salen de img/talleres/<id>/ — ver el LEEME.

      color: "lila",
      estado: "activo",
      horarios: [
        { dia: "Jueves", hora: "18:45 – 20:00", cuposTotal: 12, cuposDisponibles: 9 },
      ],
      // valores de Amar Estefanía
      precios: [
        { nombre: "Clase suelta", valor: "$8.000", monto: 8000 },
        { nombre: "4 clases al mes", valor: "$28.000", monto: 28000 },
      ],
    },
    {
      id: "bellydance-fusion",
      nombre: "Bellydance Fusión",
      profe: "Kathia Luminus",
      profeIg: "",
      frase: "Caderas que cuentan historias antiguas.",
      nivel: "Todos los niveles",
      duracion: "1 hora",
      pagina: "talleres/bellydance-fusion.html",
      // Portada y fotos salen de img/talleres/<id>/ — ver el LEEME.

      color: "terracota",
      estado: "activo",
      horarios: [
        { dia: "Viernes", hora: "19:00 – 20:00", cuposTotal: 12, cuposDisponibles: 9 },
      ],
      // ⚠️ Kathia no nos ha pasado sus valores: estos son provisorios
      precios: [
        { nombre: "Clase suelta", valor: "$10.000", monto: 10000 },
        { nombre: "4 clases al mes", valor: "$35.000", monto: 35000 },
      ],
    },
    {
      /* ------------------------------------------------------------
         DOMINGO POPULAR — no es una clase semanal, es la jornada
         mensual. Va acá para que la gente pueda inscribirse y quede
         en la misma planilla que el resto.
         ⚠️ CADA MES hay que actualizar `fechaFija` con la fecha real.
         ------------------------------------------------------------ */
      id: "domingo-popular",
      tipo: "evento",
      nombre: "Domingo Popular",
      profe: "Sala Crisol",
      profeIg: "sala.crisol",
      frase: "Una jornada completa: entrenar, cocinar y quedarse.",
      nivel: "Abierto a todas y todos",
      duracion: "Jornada completa",
      pagina: "index.html#comunidad",
      fechaFija: "2026-09-28",
      fotos: [],
      color: "terracota",
      estado: "activo",
      horarios: [
        { dia: "Domingo", hora: "11:00 – 18:00", cuposTotal: 30, cuposDisponibles: 30 },
      ],
      precios: [
        { nombre: "Aporte voluntario", valor: "Desde $3.000", monto: 3000 },
      ],
    },
  ],

  /* ============================================================
     GRILLA SEMANAL (lo que se pinta en "Horarios")
     tipo: "semanal" (todas las semanas) | "mensual" (una vez al mes)
     ============================================================ */
  grilla: {
    "Lunes": [
      { hora: "10:00", clase: "Pilates Mat", profe: "Esperanza", id: "pilates-mat", tipo: "semanal" },
      { hora: "19:00", clase: "Movimiento Flexible", profe: "Consuelo", id: "movimiento-flexible", tipo: "semanal" },
    ],
    "Martes": [
      { hora: "10:00", clase: "Movimiento Flexible", profe: "Consuelo", id: "movimiento-flexible", tipo: "semanal" },
    ],
    "Miércoles": [
      { hora: "10:00", clase: "Equilibrio de Manos", profe: "Consuelo", id: "equilibrio-de-manos", tipo: "semanal" },
    ],
    "Jueves": [
      { hora: "18:45", clase: "Danza y Filosofía", profe: "Amor Expresamos", id: "danza-filosofia", tipo: "semanal" },
    ],
    "Viernes": [
      { hora: "10:00", clase: "Pilates Mat", profe: "Esperanza", id: "pilates-mat", tipo: "semanal" },
      { hora: "19:00", clase: "Bellydance Fusión", profe: "Kathia", id: "bellydance-fusion", tipo: "semanal" },
    ],
    "Sábado": [
      { hora: "10:30", clase: "Danza Contemporánea", profe: "Esperanza", id: "danza-contemporanea", tipo: "semanal" },
      { hora: "12:30", clase: "Movimiento Flexible", profe: "Consuelo", id: "movimiento-flexible", tipo: "semanal" },
      { hora: "15:30", clase: "Equilibrio de Manos", profe: "Consuelo", id: "equilibrio-de-manos", tipo: "semanal" },
      { hora: "17:30", clase: "Pilates Mat", profe: "Esperanza", id: "pilates-mat", tipo: "semanal" },
    ],
    "Domingo": [
      { hora: "Mensual", clase: "Domingo Popular", profe: "Sala Crisol", id: "domingo-popular", tipo: "mensual" },
    ],
  },

  /* ============================================================
     TERTULIAS (archivo de ciclos pasados)
     acento: color del ciclo — se usa en el numerito del afiche
     ============================================================ */
  tertulias: [
    {
      numero: "01",
      id: "01-this-is-ballroom",
      pagina: "tertulias/this-is-ballroom.html",
      pelicula: "This is Ballroom",
      subtitulo: "(Salão de Baile)",
      fecha: "Viernes 1 de mayo · 19:00",
      detalle: "Apertura de ciclo. Proyección + tertulia con artistas invitadxs: música y danza en vivo, cruce entre disciplinas.",
      img: "img/tertulias/01-this-is-ballroom/afiche.jpg",
      acento: "#E39AA6",
      // la paleta sale del afiche del evento
      paleta: { fondo: "#1A0B2E", tinta: "#F7E9FF", acento: "#E845C8", acento2: "#7B3FF2" },
      relato: "Con esta abrimos el ciclo. Proyectamos <em>This is Ballroom</em>, documental sobre la escena ballroom, y después la sala se transformó: artistas invitadxs cruzaron música y danza en vivo, sin separar el público del escenario. Cupos limitados, entrada general $5.000.",
    },
    {
      numero: "02",
      id: "02-perro-bomba",
      pagina: "tertulias/perro-bomba.html",
      pelicula: "Perro Bomba",
      subtitulo: "de Juan Cáceres · Chile",
      fecha: "Viernes 29 de mayo · 20:00",
      detalle: "Proyección + tertulia en un espacio más íntimo: música, danza y expresiones artísticas en atmósfera de escucha.",
      img: "img/tertulias/02-perro-bomba/afiche.jpg",
      acento: "#8FC6C9",
      paleta: { fondo: "#0E2340", tinta: "#E8F6FF", acento: "#28C8E0", acento2: "#F2C14E" },
      relato: "Segundo ciclo, con <em>Perro Bomba</em> de Juan Cáceres — cine chileno sobre migración y pertenencia. Fue la más íntima de las tres: menos gente, más conversación, y el cierre con música en vivo en penumbra.",
    },
    {
      numero: "03",
      id: "03-tetoterapia",
      pagina: "tertulias/tetoterapia.html",
      pelicula: "Tetoterapia: El Musical",
      subtitulo: "de Elefante Gonorrea y sus amigxs",
      fecha: "Viernes 26 de junio · 19:30",
      detalle: "Tercer ciclo. Proyección + tertulia con intervención artística. Espacio íntimo, cupos limitados.",
      img: "img/tertulias/03-tetoterapia/afiche.jpg",
      acento: "#E8C583",
      paleta: { fondo: "#2B0F26", tinta: "#FFF0FA", acento: "#FF6FC8", acento2: "#F5E14C" },
      relato: "Cerramos el ciclo con <em>Tetoterapia: El Musical</em>, de Elefante Gonorrea y sus amigxs, con Irina la Loca, Hija de Perra y Maggie Lay. Hubo concurso de entradas por Instagram y la sala quedó chica.",
    },
  ],

  /* ============================================================
     DOMINGO POPULAR — la jornada mensual
     ============================================================ */
  domingoPopular: {
    pagina: "tertulias/domingo-popular.html",
    // Datos del afiche de la próxima jornada.
    // Al cambiar de fecha: sube las imágenes nuevas a
    // Recursos_graficos/domingos_populares/<fecha>/ y actualiza esto.
    fecha: "Domingo 6 de septiembre",
    horario: "10:00 – 18:00",
    carpeta: "img/domingos/2026-09-06",
    img: "img/domingos/2026-09-06/afiche.jpg",
    paleta: { fondo: "#5B2A1E", tinta: "#FFF1E6", acento: "#F79A5B", acento2: "#F5C6B0" },
    bloques: [
      { clase: "Pilates Matwork",      profe: "Esperanza Fredes", hora: "10:30 – 11:30" },
      { clase: "Equilibrio Flexible",  profe: "Consuelo Ongaro",  hora: "11:45 – 13:45" },
      { clase: "Almuerzo comunitario", profe: "",                 hora: "" },
      { clase: "Yoga",                 profe: "Niebla",           hora: "15:30 – 16:30" },
      { clase: "Danza Contemporánea",  profe: "Esperanza Fredes", hora: "16:45 – 18:00" },
    ],
    aporteMonetario: [
      { n: "1 clase",  valor: "$5.000" },
      { n: "2 clases", valor: "$8.000" },
      { n: "3 clases", valor: "$10.000" },
      { n: "4 clases", valor: "$12.000" },
    ],
    aporteMaterial: [
      "Papel higiénico", "Jabón líquido", "Esponjas o paños de limpieza",
      "Limpiapisos o limpiador multiuso", "Bolsas de basura",
      "Toalla de papel, diarios, limpiavidrios", "Café, té o azúcar para compartir",
      "Velas e inciensos", "Plantas o maceteros", "Cojines y mantas",
      "Papelería: papel, plumones, masking tape, gaffer",
      "Alargadores, zapatillas, enchufes triples, luces led",
    ],
    equivalencia: "2 materiales equivalen a 1 clase",
  },

  /* ---------- ARRIENDO DE LA SALA ---------- */
  arriendo: {
    precios: [
      { nombre: "1 hora", valor: "$12.000" },
      { nombre: "1 hora y media", valor: "$16.000" },
      { nombre: "Hora para clases regulares del semestre", valor: "$10.000" },
    ],
  },
};

/* ------------------------------------------------------------
   No edites de aquí hacia abajo ✋
   (funciones que usan los formularios y la grilla)
   ------------------------------------------------------------ */

/** Construye un enlace de WhatsApp con mensaje precargado */
function enlaceWhatsApp(mensaje) {
  return "https://wa.me/" + CRISOL.whatsapp + "?text=" + encodeURIComponent(mensaje);
}

/** Enlace directo al Instagram */
function enlaceInstagram() {
  return "https://www.instagram.com/" + CRISOL.instagram + "/";
}

/** Busca una clase por su id */
function buscarTaller(id) {
  return CRISOL.talleres.filter(function (t) { return t.id === id; })[0] || null;
}
