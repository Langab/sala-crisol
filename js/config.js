/* ============================================================
   SALA CRISOL — AJUSTES TÉCNICOS
   ============================================================
   ⚠️ Este archivo ya NO tiene los datos de las clases.

   Todo lo que se cambia seguido —clases, horarios, cupos, precios,
   tertulias, fotos, textos— vive ahora en:

       datos/contenido.json

   y se edita desde el panel, sin tocar código:  salacrisol.cl/admin/
   (ver COMO_EDITAR_EL_SITIO.md)

   Acá abajo quedan solo las conexiones técnicas. Si no sabes qué
   es algo de esto, no lo toques: no es lo que estás buscando.
   ============================================================ */

var CRISOL = {

  /* Planilla de inscripciones (Apps Script /exec).
     Ver _sistema/LEEME_INSCRIPCIONES.md. Si la dejas vacía, las
     inscripciones siguen llegando por WhatsApp pero no se guardan. */
  inscripcionesURL: "https://script.google.com/macros/s/AKfycbytOFR00-9flkCPUqjdD1c4wmndc2AXotLS8c9j5_5Yr0-jD83SeRu0_U2c2j9vq_gu-g/exec",

  /* Se rellenan solos con datos/contenido.json. Quedan vacíos acá
     para que nada se caiga si el archivo no alcanza a cargar. */
  sala: { whatsapp: "56991757042", instagram: "sala.crisol", correo: "",
          direccion: "", metros: [], mesActual: "" },
  talleres: [],
  grillaExtra: [],
  tertulias: [],
  domingoPopular: null,
  arriendo: { precios: [] },
};

/* ------------------------------------------------------------
   No edites de aquí hacia abajo ✋
   ------------------------------------------------------------ */

/* Ruta a datos/contenido.json calculada desde este mismo archivo,
   para que funcione igual en la portada y en /talleres/algo.html */
var RUTA_CONTENIDO = (function () {
  var s = (document.currentScript && document.currentScript.src) || "";
  return s ? s.replace(/js\/config\.js.*$/, "datos/contenido.json") : "datos/contenido.json";
})();

/* Promesa que se cumple cuando el contenido está cargado.
   main.js y panel.html esperan esto antes de pintar nada. */
var CONTENIDO_LISTO = fetch(RUTA_CONTENIDO, { cache: "no-cache" })
  .then(function (r) {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then(function (datos) {
    Object.keys(datos).forEach(function (k) { CRISOL[k] = datos[k]; });
    return CRISOL;
  })
  .catch(function (err) {
    console.error("Sala Crisol: no se pudo cargar " + RUTA_CONTENIDO, err);
    return CRISOL;
  });

/** Las clases que se muestran en el sitio (las ocultas no salen) */
function talleresVisibles() {
  return (CRISOL.talleres || []).filter(function (t) { return t.estado !== "oculto"; });
}

/** Dirección de la página de una clase. Si no tiene una propia,
    usa la página genérica, así una clase nueva creada desde el
    panel ya tiene dónde vivir sin que nadie escriba código. */
function paginaTaller(t) {
  return t.pagina || ("talleres/clase.html?id=" + encodeURIComponent(t.id));
}

/** Lo mismo para las tertulias */
function paginaTertulia(t) {
  return t.pagina || ("tertulias/tertulia.html?id=" + encodeURIComponent(t.id));
}

/** Construye el horario semanal a partir de los horarios de cada
    clase, para que nadie tenga que escribir la grilla dos veces. */
function construirGrilla() {
  var dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  var grilla = {};
  dias.forEach(function (d) { grilla[d] = []; });

  talleresVisibles().forEach(function (t) {
    /* Un evento de una sola fecha (una fonda, un taller puntual) no es
       parte de la semana: sale en su propia tarjeta, no en el horario.
       El Domingo Popular sí va, porque se repite todos los meses. */
    if (t.enHorario === false) return;
    (t.horarios || []).forEach(function (h) {
      if (!grilla[h.dia]) return;
      grilla[h.dia].push({
        hora: t.tipo === "evento" ? "Mensual" : String(h.hora).split("–")[0].trim(),
        orden: String(h.hora).split("–")[0].trim(),
        clase: t.nombre,
        profe: t.profeCorto || String(t.profe || "").split(" ")[0],
        id: t.id,
        tipo: t.tipo === "evento" ? "mensual" : "semanal",
      });
    });
  });

  /* filas sueltas que no pertenecen a ninguna clase (ver el panel) */
  (CRISOL.grillaExtra || []).forEach(function (b) {
    if (!grilla[b.dia]) return;
    grilla[b.dia].push({
      hora: b.hora, orden: b.hora, clase: b.clase,
      profe: b.profe, id: b.id || "", tipo: b.tipo || "semanal",
    });
  });

  dias.forEach(function (d) {
    grilla[d].sort(function (a, b) { return a.orden.localeCompare(b.orden); });
  });
  return grilla;
}

/** Construye un enlace de WhatsApp con mensaje precargado */
function enlaceWhatsApp(mensaje) {
  return "https://wa.me/" + CRISOL.sala.whatsapp + "?text=" + encodeURIComponent(mensaje);
}

/** Enlace directo al Instagram */
function enlaceInstagram() {
  return "https://www.instagram.com/" + CRISOL.sala.instagram + "/";
}

/** Busca una clase por su id */
function buscarTaller(id) {
  return (CRISOL.talleres || []).filter(function (t) { return t.id === id; })[0] || null;
}

/** Busca una tertulia por su id */
function buscarTertulia(id) {
  return (CRISOL.tertulias || []).filter(function (t) { return t.id === id; })[0] || null;
}
