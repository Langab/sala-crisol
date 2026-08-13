/* ============================================================
   SALA CRISOL — CONFIGURACIÓN DEL SITIO
   ============================================================
   👋 Hola Consuelo (o quien administre esto):
   Este es el ÚNICO archivo que necesitas editar mes a mes.
   Aquí viven los datos de contacto, los talleres, horarios,
   cupos y precios. Guarda el archivo y recarga la página.

   ⚠️ IMPORTANTE ANTES DE PUBLICAR:
   1. Reemplaza WHATSAPP por el número real (formato: 569XXXXXXXX,
      sin +, sin espacios). Es el número al que llegan las
      inscripciones.
   2. Revisa cupos y horarios de cada taller.
   ============================================================ */

const CRISOL = {

  /* ---------- CONTACTO ---------- */
  // ⚠️ REEMPLAZAR por el número real de WhatsApp de la sala:
  whatsapp: "56900000000",
  instagram: "sala.crisol",
  correo: "", // opcional, ej: "salacrisol@gmail.com" (déjalo vacío si no)

  /* ---------- UBICACIÓN ---------- */
  direccion: "Av. Salvador 2302, Ñuñoa · Santiago",
  metros: [
    "Metro Monseñor Eyzaguirre (L3) — 4 min caminando",
    "Metro Irarrázaval (L3 / L5) — 8 min caminando",
  ],

  /* ---------- MES VISIBLE EN LA PORTADA ---------- */
  mesActual: "Agosto",

  /* ============================================================
     TALLERES
     ------------------------------------------------------------
     Cada taller tiene:
     - id: no lo cambies (conecta la grilla con la página)
     - cupos: total y disponibles POR HORARIO → edítalos cuando
       se llene o se abra un cupo. Si no quieres mostrar cupos,
       pon disponibles: null
     - precios: texto libre, cámbialo cuando cambie el valor
     - estado: "activo" | "pronto" (pronto = sin inscripción,
       muestra "nueva fecha por anunciar")
     ============================================================ */
  talleres: [
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
      estado: "activo",
      horarios: [
        { dia: "Lunes", hora: "19:00 – 21:00", cuposTotal: 10, cuposDisponibles: 4 },
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
      estado: "activo",
      horarios: [
        { dia: "Miércoles", hora: "9:30 – 11:00", cuposTotal: 8, cuposDisponibles: 3 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "pilates-matwork",
      nombre: "Pilates MatWork",
      profe: "Esperanza Fredes",
      profeIg: "fredescarpio",
      frase: "Fuerza que se construye desde el centro.",
      nivel: "Todos los niveles",
      duracion: "1 hora",
      pagina: "talleres/pilates-matwork.html",
      img: null, // sin foto aún → la página genera una portada con la llama
      estado: "activo",
      horarios: [
        { dia: "Consultar", hora: "Horarios por WhatsApp", cuposTotal: null, cuposDisponibles: null },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "entrenamiento-integral",
      nombre: "Entrenamiento Integral",
      profe: "Esperanza Fredes",
      profeIg: "fredescarpio",
      frase: "Un cuerpo listo para todo lo que quieras hacer con él.",
      nivel: "Todos los niveles",
      duracion: "1 hora",
      pagina: "talleres/entrenamiento-integral.html",
      img: null,
      estado: "activo",
      horarios: [
        { dia: "Consultar", hora: "Horarios por WhatsApp", cuposTotal: null, cuposDisponibles: null },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "chair-fusion",
      nombre: "Chair Fusión & Femme Fatale",
      profe: "Ginevra D'Lilith",
      profeIg: "ginev.lilith",
      frase: "Una silla, tacones si quieres, y cero prejuicios.",
      nivel: "Todos los niveles",
      duracion: "1 hora c/u",
      pagina: "talleres/chair-fusion.html",
      img: "img/foto-tertulia-performance.jpg",
      estado: "activo",
      horarios: [
        { dia: "Martes", hora: "Chair Fusión · 19:00", cuposTotal: 10, cuposDisponibles: 5 },
        { dia: "Martes", hora: "Femme Fatale · 20:00", cuposTotal: 10, cuposDisponibles: 5 },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "acroyoga-lunar",
      nombre: "AcroYoga Lunar",
      profe: "Sofía · Volver al Cuerpo",
      profeIg: "volveralcuerpo.cl",
      frase: "Sostener, ser sostenida y crecer en comunidad.",
      nivel: "Multinivel · 8 cupos",
      duracion: "Curso por ciclos + seminarios",
      pagina: "talleres/acroyoga-lunar.html",
      img: "img/foto-acroyoga-vuelo.jpg",
      estado: "activo",
      horarios: [
        { dia: "Jueves", hora: "Curso regular (ciclo de 4 clases)", cuposTotal: 8, cuposDisponibles: 2 },
        { dia: "1 viernes al mes", hora: "Encuentro Lunar · 18:30 – 22:00", cuposTotal: 14, cuposDisponibles: 8 },
        { dia: "1 domingo al mes", hora: "Seminario intensivo · 10:00 – 17:00", cuposTotal: 12, cuposDisponibles: 6 },
      ],
      precios: [
        { nombre: "Encuentro Lunar", valor: "$5.000" },
        { nombre: "Seminario (promo duplas)", valor: "$40.000 c/u" },
      ],
    },
    {
      id: "capoeira",
      nombre: "Capoeira",
      profe: "Escuela Os Angoleiros do Interior",
      profeIg: "richaaard.vd",
      frase: "Juego, música y lucha que se conversan en ronda.",
      nivel: "Todos los niveles",
      duracion: "1,5 horas",
      pagina: "talleres/capoeira.html",
      img: null,
      estado: "activo",
      horarios: [
        { dia: "Sábado", hora: "11:00 – 12:30", cuposTotal: null, cuposDisponibles: null },
      ],
      precios: [
        { nombre: "Clase suelta", valor: "$10.000" },
        { nombre: "Mensual (4 clases)", valor: "$35.000" },
      ],
    },
    {
      id: "masaje-tailandes",
      nombre: "Masaje Tailandés",
      profe: "Sofía · Volver al Cuerpo",
      profeIg: "volveralcuerpo.cl",
      frase: "El contacto consciente también se aprende.",
      nivel: "Sin experiencia previa",
      duracion: "Taller de 3 horas",
      pagina: "talleres/masaje-tailandes.html",
      img: "img/flyer-masaje-tailandes.jpg",
      estado: "pronto", // "pronto" = nueva fecha por anunciar
      horarios: [
        { dia: "Próxima fecha", hora: "Por anunciar", cuposTotal: null, cuposDisponibles: null },
      ],
      precios: [
        { nombre: "Taller completo", valor: "Consultar" },
      ],
    },
  ],

  /* ============================================================
     GRILLA SEMANAL (lo que se pinta en "Horarios")
     tipo: "semanal" (todas las semanas) | "mensual" (una vez al mes)
     ============================================================ */
  grilla: {
    "Lunes": [
      { hora: "19:00", clase: "Movimiento Flexible", profe: "Consuelo", id: "movimiento-flexible", tipo: "semanal" },
    ],
    "Martes": [
      { hora: "19:00", clase: "Chair Fusión", profe: "Ginevra", id: "chair-fusion", tipo: "semanal" },
      { hora: "20:00", clase: "Femme Fatale", profe: "Ginevra", id: "chair-fusion", tipo: "semanal" },
    ],
    "Miércoles": [
      { hora: "9:30", clase: "Equilibrio de Manos", profe: "Consuelo", id: "equilibrio-de-manos", tipo: "semanal" },
    ],
    "Jueves": [
      { hora: "Ciclos", clase: "AcroYoga Lunar · curso", profe: "Sofía", id: "acroyoga-lunar", tipo: "mensual" },
    ],
    "Viernes": [
      { hora: "18:30", clase: "Encuentro Lunar (1 al mes)", profe: "Sofía", id: "acroyoga-lunar", tipo: "mensual" },
    ],
    "Sábado": [
      { hora: "11:00", clase: "Capoeira", profe: "Os Angoleiros", id: "capoeira", tipo: "semanal" },
      { hora: "12:30", clase: "Movimiento Flexible", profe: "Consuelo", id: "movimiento-flexible", tipo: "semanal" },
    ],
    "Domingo": [
      { hora: "Mensual", clase: "Seminario AcroYoga", profe: "Sofía", id: "acroyoga-lunar", tipo: "mensual" },
      { hora: "Especial", clase: "Domingo Popular", profe: "Sala Crisol", id: null, tipo: "mensual" },
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
      acento: "#efa8de",
    },
    {
      numero: "02",
      pelicula: "Perro Bomba",
      subtitulo: "de Juan Cáceres · Chile",
      fecha: "Viernes 29 de mayo · 20:00",
      detalle: "Proyección + tertulia en un espacio más íntimo: música, danza y expresiones artísticas en atmósfera de escucha.",
      img: "img/poster-tertulia-2.jpg",
      acento: "#7dd8e8",
    },
    {
      numero: "03",
      pelicula: "Tetoterapia: El Musical",
      subtitulo: "de Elefante Gonorrea y sus amigxs",
      fecha: "Viernes 26 de junio · 19:30",
      detalle: "Tercer ciclo. Proyección + tertulia con intervención artística. Espacio íntimo, cupos limitados.",
      img: "img/poster-tertulia-3.jpg",
      acento: "#f2e85c",
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
