/**
 * Inscripciones a clases de Sala Crisol ←→ Google Sheets.
 *
 * Este script es el "puente": recibe las inscripciones que llegan desde el
 * formulario de la web (y desde la página administrativa) y las guarda en una
 * planilla. También las devuelve cuando alguien las pide.
 *
 * CÓMO INSTALARLO (una sola vez, ~5 minutos):
 * 1. En Google Drive, dentro de la carpeta de Sala Crisol, crea una hoja de
 *    cálculo nueva llamada "Inscripciones Sala Crisol".
 * 2. En esa planilla: menú Extensiones → Apps Script. Borra el código que
 *    aparece y pega TODO este archivo. Guarda (icono de disquete).
 * 3. Botón "Implementar" → "Nueva implementación" → tipo "Aplicación web":
 *      - Ejecutar como: Yo
 *      - Quién tiene acceso: Cualquier persona
 *    Presiona "Implementar" y autoriza los permisos cuando lo pida.
 * 4. Copia la URL que termina en /exec (NO la que termina en /dev) y pégala:
 *      - en js/config.js, campo inscripcionesURL
 *      - y en la página administrativa, donde pide la misma URL.
 *    Listo: cada inscripción del formulario queda guardada en la planilla.
 *
 * OJO: cada vez que edites este código tienes que volver a "Implementar" →
 * "Administrar implementaciones" → lápiz → Versión: Nueva versión → Implementar.
 * Si no, Google sigue sirviendo la versión vieja.
 *
 * La hoja "Inscripciones" se crea sola. No cambies el orden de sus columnas:
 * la web y la página administrativa dependen de ese orden exacto.
 */

var HOJA = 'Inscripciones';

// Orden EXACTO de las columnas. No tocar.
var COLS = ['id', 'creado', 'nombre', 'telefono', 'correo', 'claseId',
            'claseNombre', 'dia', 'hora', 'fechaSesion', 'experiencia',
            'modalidad', 'monto', 'asistio', 'pago', 'metodoPago', 'notas',
            'estado', 'updatedAt'];

/* ------------------------------------------------------------------
   Ayudantes chicos
   ------------------------------------------------------------------ */

// Convierte a booleano lo que venga: true, "SI", "si", "TRUE", 1...
function bool_(v) {
  if (v === true) return true;
  var s = String(v == null ? '' : v).trim().toUpperCase();
  return s === 'SI' || s === 'SÍ' || s === 'TRUE' || s === '1';
}

// Deja una fecha como "YYYY-MM-DD" venga como venga (texto o celda de fecha).
function fecha_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v == null ? '' : v).trim();
}

// Deja una marca de tiempo como texto ISO 8601.
function iso_(v) {
  if (v instanceof Date) return v.toISOString();
  return String(v == null ? '' : v).trim();
}

/* ------------------------------------------------------------------
   La hoja
   ------------------------------------------------------------------ */

function hoja_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(HOJA);
  if (!h) {
    h = ss.insertSheet(HOJA);
    h.appendRow(COLS);
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, COLS.length).setFontWeight('bold');
    // id y creado como texto plano para que Sheets no los convierta
    h.getRange('A2:B').setNumberFormat('@');
    // teléfono como texto (si no, se come el 9 inicial o lo vuelve número)
    h.getRange('D2:D').setNumberFormat('@');
    // fechaSesion como texto plano
    h.getRange('J2:J').setNumberFormat('@');
    // updatedAt como texto plano
    h.getRange('S2:S').setNumberFormat('@');
    h.setColumnWidths(1, COLS.length, 130);
  }
  return h;
}

function leer_() {
  var h = hoja_();
  var vals = h.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    var e = {};
    for (var j = 0; j < COLS.length; j++) e[COLS[j]] = vals[i][j];
    if (!e.id) continue;
    e.id = String(e.id);
    e.creado = iso_(e.creado);
    e.nombre = String(e.nombre || '');
    e.telefono = String(e.telefono || '');
    e.correo = String(e.correo || '');
    e.claseId = String(e.claseId || '');
    e.claseNombre = String(e.claseNombre || '');
    e.dia = String(e.dia || '');
    e.hora = String(e.hora || '');
    e.fechaSesion = fecha_(e.fechaSesion);
    e.experiencia = String(e.experiencia || '');
    e.modalidad = String(e.modalidad || '');
    e.monto = Number(e.monto) || 0;
    e.asistio = bool_(e.asistio);
    e.pago = bool_(e.pago);
    e.metodoPago = String(e.metodoPago || '');
    e.notas = String(e.notas || '');
    e.estado = String(e.estado || 'activa');
    e.updatedAt = iso_(e.updatedAt);
    out.push(e);
  }
  return out;
}

function escribir_(lista) {
  var h = hoja_();
  var n = h.getLastRow();
  if (n > 1) h.getRange(2, 1, n - 1, COLS.length).clearContent();
  if (!lista.length) return;
  // Ordenadas por fecha de la sesión, y dentro del día por hora.
  lista.sort(function (a, b) {
    var fa = String(a.fechaSesion || ''), fb = String(b.fechaSesion || '');
    if (fa !== fb) return fa.localeCompare(fb);
    return String(a.hora || '').localeCompare(String(b.hora || ''));
  });
  var filas = lista.map(function (e) {
    return [String(e.id), iso_(e.creado), e.nombre || '', String(e.telefono || ''),
            e.correo || '', e.claseId || '', e.claseNombre || '', e.dia || '',
            e.hora || '', fecha_(e.fechaSesion), e.experiencia || '',
            e.modalidad || '', Number(e.monto) || 0,
            bool_(e.asistio) ? 'SI' : 'NO', bool_(e.pago) ? 'SI' : 'NO',
            e.metodoPago || '', e.notas || '', e.estado || 'activa',
            iso_(e.updatedAt)];
  });
  h.getRange(2, 1, filas.length, COLS.length).setValues(filas);
}

/* ------------------------------------------------------------------
   Fusión: gana la versión con updatedAt más reciente
   ------------------------------------------------------------------ */

function fusionar_(base, nuevas) {
  var porId = {};
  base.forEach(function (e) { porId[e.id] = e; });
  (nuevas || []).forEach(function (n) {
    if (!n || !n.id) return;
    var mia = porId[n.id];
    if (!mia || String(n.updatedAt || '') > String(mia.updatedAt || '')) {
      porId[n.id] = n;
    }
  });
  return Object.keys(porId).map(function (k) { return porId[k]; });
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------
   Entradas web
   ------------------------------------------------------------------ */

/**
 * doGet — devuelve las inscripciones.
 *
 *   .../exec                          → todas
 *   .../exec?fecha=2026-09-15         → solo las de esa sesión
 *   .../exec?clase=pilates-mat        → solo las de esa clase
 *   .../exec?fecha=2026-09-15&clase=pilates-mat → las dos cosas a la vez
 *
 * Siempre responde { inscripciones: [...] }.
 */
function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var fecha = String(p.fecha || '').trim();
    var clase = String(p.clase || '').trim();
    var lista = leer_();
    if (fecha) {
      lista = lista.filter(function (x) { return x.fechaSesion === fecha; });
    }
    if (clase) {
      lista = lista.filter(function (x) { return x.claseId === clase; });
    }
    return respuesta_({ inscripciones: lista });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  }
}

/**
 * doPost — recibe { inscripciones: [...] }, las fusiona con lo que ya hay
 * (gana la más reciente según updatedAt) y devuelve la lista completa.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var merged = fusionar_(leer_(), body.inscripciones);
    escribir_(merged);
    return respuesta_({ ok: true, inscripciones: merged });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
