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
      profeIg: "fredescarpio",
      frase: "Fuerza que se construye desde el centro.",
      nivel: "Todos los niveles",
      duracion: "1 hora",
      pagina: "talleres/pilates-mat.html",
      img: null,
      color: "salvia",
      estado: "activo",
      horarios: [
        { dia: "Lunes", hora: "10:00 – 11:00", cuposTotal: 10, cuposDisponibles: 6 },
        { dia: "Viernes", hora: "10:00 – 11:00", cuposTotal: 10, cuposDisponibles: 6 },
        { dia: "Sábado", hora: "17:30 – 18:30", cuposTotal: 10, cuposDisponibles: 8 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "danza-contemporanea",
      nombre: "Danza Contemporánea",
      profe: "Esperanza Fredes",
      profeIg: "fredescarpio",
      frase: "El cuerpo que piensa mientras se mueve.",
      nivel: "Todos los niveles",
      duracion: "1 hora",
      pagina: "talleres/danza-contemporanea.html",
      img: "img/foto-clase-danza.jpg",
      color: "turquesa",
      estado: "activo",
      horarios: [
        { dia: "Sábado", hora: "10:30 – 11:30", cuposTotal: 12, cuposDisponibles: 8 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
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
      img: "img/flyer-movimiento-flexible.jpg",
      color: "rosa",
      estado: "activo",
      horarios: [
        { dia: "Lunes", hora: "19:00 – 21:00", cuposTotal: 10, cuposDisponibles: 4 },
        { dia: "Martes", hora: "10:00 – 12:00", cuposTotal: 10, cuposDisponibles: 7 },
        { dia: "Sábado", hora: "12:30 – 14:30", cuposTotal: 10, cuposDisponibles: 6 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "equilibrio-de-manos",
      nombre: "Equilibrio de Manos",
      profe: "Consuelo Ongaro",
      profeIg: "_consuelidad_",
      frase: "El mundo se ve mejor al revés.",
      nivel: "Inicial · sin experiencia",
      duracion: "1,5 horas",
      pagina: "talleres/equilibrio-de-manos.html",
      img: "img/flyer-equilibrio-manos.jpg",
      color: "mostaza",
      estado: "activo",
      horarios: [
        { dia: "Miércoles", hora: "10:00 – 11:30", cuposTotal: 8, cuposDisponibles: 3 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "danza-filosofia",
      nombre: "Danza y Filosofía",
      subtitulo: "Experiencia sensualstyle",
      profe: "Compañía Amor Expresamos",
      profeIg: "",
      frase: "Mover el cuerpo también es una forma de pensar.",
      nivel: "Todos los niveles",
      duracion: "1 hora 15 min",
      pagina: "talleres/danza-filosofia.html",
      img: "img/foto-tertulia-performance.jpg",
      color: "lila",
      estado: "activo",
      horarios: [
        { dia: "Jueves", hora: "18:45 – 20:00", cuposTotal: 12, cuposDisponibles: 9 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
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
      img: "img/foto-tertulia-musica.jpg",
      color: "terracota",
      estado: "activo",
      horarios: [
        { dia: "Viernes", hora: "19:00 – 20:00", cuposTotal: 12, cuposDisponibles: 9 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
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
      { hora: "17:30", clase: "Pilates Mat", profe: "Esperanza", id: "pilates-mat", tipo: "semanal" },
    ],
    "Domingo": [
      { hora: "Mensual", clase: "Domingo Popular", profe: "Sala Crisol", id: null, tipo: "mensual" },
    ],
  },

  /* ============================================================
     TERTULIAS (archivo de ciclos pasados)
     acento: color del ciclo — se usa en el numerito del afiche
     ============================================================ */
  tertulias: [
    {
      numero: "01",
      pelicula: "This is Ballroom",
      subtitulo: "(Salão de Baile)",
      fecha: "Viernes 1 de mayo · 19:00",
      detalle: "Apertura de ciclo. Proyección + tertulia con artistas invitadxs: música y danza en vivo, cruce entre disciplinas.",
      img: "img/poster-tertulia-1.jpg",
      acento: "#E39AA6",
    },
    {
      numero: "02",
      pelicula: "Perro Bomba",
      subtitulo: "de Juan Cáceres · Chile",
      fecha: "Viernes 29 de mayo · 20:00",
      detalle: "Proyección + tertulia en un espacio más íntimo: música, danza y expresiones artísticas en atmósfera de escucha.",
      img: "img/poster-tertulia-2.jpg",
      acento: "#8FC6C9",
    },
    {
      numero: "03",
      pelicula: "Tetoterapia: El Musical",
      subtitulo: "de Elefante Gonorrea y sus amigxs",
      fecha: "Viernes 26 de junio · 19:30",
      detalle: "Tercer ciclo. Proyección + tertulia con intervención artística. Espacio íntimo, cupos limitados.",
      img: "img/poster-tertulia-3.jpg",
      acento: "#E8C583",
    },
  ],

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
