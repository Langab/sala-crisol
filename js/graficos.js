/* ============================================================
   SALA CRISOL — MÓDULO DE GRÁFICOS (SVG puro)
   ============================================================
   Un solo global: `Graficos`. Todas las funciones devuelven un
   STRING con un <svg>...</svg> listo para innerHTML.

   Sin dependencias. Sin <script> adentro. Sin canvas.

   API
   ---
   Graficos.barras({ datos, ancho, alto, formato, titulo, orden })
   Graficos.barrasApiladas({ datos, ancho, alto, formato, titulo })
   Graficos.lineas({ series, ancho, alto, formato, titulo })
   Graficos.dona({ datos, ancho, alto, formato, titulo, centro })
   Graficos.sparkline({ valores, color, ancho, alto })

   Decisiones de diseño (por qué está hecho así)
   ---------------------------------------------
   1. LA IDENTIDAD LA LLEVA EL TEXTO, NO EL COLOR.
      La paleta del sitio es pastel y decorativa: medida con el
      validador de accesibilidad da 6 de 7 colores bajo 3:1 de
      contraste sobre el crema, y pares como turquesa/salvia se
      separan sólo ΔE 5.9 (el piso seguro es 15) — o sea, ni una
      persona con visión de color normal los distingue con
      seguridad, menos alguien con daltonismo. Por eso CADA barra,
      segmento, línea y porción lleva su NOMBRE y su MONTO escritos.
      El color acompaña; nunca es el único portador de significado.
   2. Las barras SIEMPRE parten en cero. No hay ejes recortados.
   3. Barras horizontales: los nombres de clase en español son
      largos ("Movimiento Flexible"); como fila se leen enteros en
      vez de amontonarse rotados en un eje X.
   4. `alto` es una ALTURA MÍNIMA. Si hay muchas filas el gráfico
      crece hacia abajo en vez de apretar o cortar el texto.
      Como el SVG sale con height:auto, el contenedor se adapta.
   5. Todo texto que entra se escapa (&, <, >, ", ') y los colores
      se validan contra una lista blanca de formatos: los nombres
      vienen de una planilla que llenan personas.

   Formato chileno: $140.000 (punto de miles, sin decimales).
   ============================================================ */

var Graficos = (function () {
  "use strict";

  /* ---------------------------------------------------------
     PALETA DEL SITIO
     --------------------------------------------------------- */
  var PALETA = {
    rosa: "#E39AA6",
    terracota: "#D98E6A",
    mostaza: "#E8C583",
    salvia: "#9DBE9C",
    turquesa: "#8FC6C9",
    lila: "#B7A6D6",
    frambuesa: "#C4626F"
  };

  // Orden fijo de asignación cuando el dato no trae color propio.
  // Fijo = el mismo dato siempre recibe el mismo color, aunque se
  // filtren otros (el color sigue a la entidad, no a su posición).
  var SERIE = [
    PALETA.salvia, PALETA.terracota, PALETA.turquesa, PALETA.mostaza,
    PALETA.lila, PALETA.rosa, PALETA.frambuesa
  ];

  var TINTA = "#3B3129";
  var TINTA_SUAVE = "#7A6A5A";
  var LINEA = "#E7DACA";
  var CREMA = "#FBF6EE";
  var FUENTE = "Archivo, system-ui, -apple-system, sans-serif";

  /* ---------------------------------------------------------
     SEGURIDAD: escapado y validación de color
     --------------------------------------------------------- */
  function esc(v) {
    if (v === null || v === undefined) return "";
    return String(v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Sólo se aceptan hex de 3, 4, 6 u 8 dígitos. Cualquier otra cosa
  // (incluido un intento de romper el atributo) cae al color de reserva.
  function color(v, reserva) {
    if (typeof v === "string" && /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v.trim())) {
      return v.trim();
    }
    return reserva || SERIE[0];
  }

  /* ---------------------------------------------------------
     NÚMEROS (formato chileno)
     --------------------------------------------------------- */
  function miles(n) {
    var neg = n < 0;
    var s = String(Math.round(Math.abs(n)));
    var out = "";
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 === 0) out += ".";
      out += s.charAt(i);
    }
    return (neg ? "-" : "") + out;
  }

  function fmt(n, formato) {
    if (typeof n !== "number" || !isFinite(n)) n = 0;
    if (formato === "clp") return (n < 0 ? "-$" : "$") + miles(Math.abs(n));
    return miles(n);
  }

  // Versión corta para espacios apretados: $1,4M / $95k / $140.000
  function fmtCorto(n, formato) {
    if (typeof n !== "number" || !isFinite(n)) n = 0;
    var a = Math.abs(n);
    var sig = n < 0 ? "-" : "";
    var pre = formato === "clp" ? "$" : "";
    if (a >= 1000000) {
      var m = a / 1000000;
      return sig + pre + (m >= 10 ? Math.round(m) : (Math.round(m * 10) / 10).toString().replace(".", ",")) + "M";
    }
    if (a >= 10000) return sig + pre + Math.round(a / 1000) + "k";
    return fmt(n, formato);
  }

  /* ---------------------------------------------------------
     MEDICIÓN DE TEXTO (aproximada pero conservadora)
     Sin canvas ni DOM: tabla de anchos por carácter para una
     sans tipo Archivo. Se redondea hacia arriba a propósito —
     preferimos truncar de más que dejar texto encimado.
     --------------------------------------------------------- */
  function anchoChar(c) {
    if (c === " ") return 0.28;
    if (c === "." || c === "," || c === ":" || c === ";" || c === "'") return 0.28;
    if (c === "·" || c === "|") return 0.32;
    if (c === "(" || c === ")" || c === "[" || c === "]" || c === "/") return 0.34;
    if (c === "i" || c === "l" || c === "í" || c === "ï" || c === "j" || c === "t" || c === "f" || c === "r") return 0.36;
    if (c === "-" || c === "–") return 0.38;
    if (c === "$" || c === "%") return 0.60;
    if (c >= "0" && c <= "9") return 0.58;
    if (c === "m" || c === "w" || c === "M" || c === "W") return 0.88;
    if (c >= "A" && c <= "Z") return 0.66;
    return 0.545; // minúsculas y acentuadas
  }

  function anchoTexto(txt, px) {
    var s = String(txt === null || txt === undefined ? "" : txt);
    var u = 0;
    for (var i = 0; i < s.length; i++) u += anchoChar(s.charAt(i));
    return u * px;
  }

  function truncar(txt, maxPx, px) {
    var s = String(txt === null || txt === undefined ? "" : txt);
    if (anchoTexto(s, px) <= maxPx) return s;
    var corte = s;
    while (corte.length > 1 && anchoTexto(corte + "…", px) > maxPx) {
      corte = corte.slice(0, -1);
    }
    corte = corte.replace(/[\s·,\-]+$/, "");
    return corte.length ? corte + "…" : "…";
  }

  /* ---------------------------------------------------------
     COLOR: contraste y tono legible
     Un pastel de 2px sobre crema es invisible. Para trazos finos
     y puntos oscurecemos el mismo tono hasta alcanzar 3:1 contra
     el fondo, manteniendo el matiz de marca.
     --------------------------------------------------------- */
  function aRGB(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3 || h.length === 4) {
      h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    }
    h = h.slice(0, 6);
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  }

  function aHex(rgb) {
    return "#" + rgb.map(function (v) {
      var s = Math.max(0, Math.min(255, Math.round(v))).toString(16);
      return s.length === 1 ? "0" + s : s;
    }).join("");
  }

  function lum(hex) {
    var c = aRGB(hex).map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function contraste(a, b) {
    var la = lum(a), lb = lum(b);
    var hi = Math.max(la, lb), lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
  }

  // Oscurece en luz lineal (conserva bien el matiz) hasta llegar al ratio.
  function tonoLegible(hex, fondo, ratio) {
    fondo = fondo || CREMA;
    ratio = ratio || 3.0;
    if (contraste(hex, fondo) >= ratio) return hex;
    var rgb = aRGB(hex);
    var lin = rgb.map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    for (var k = 0.97; k >= 0.02; k -= 0.03) {
      var cand = aHex(lin.map(function (v) {
        var x = v * k;
        x = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
        return x * 255;
      }));
      if (contraste(cand, fondo) >= ratio) return cand;
    }
    return TINTA;
  }

  // Texto sobre un relleno de color: blanco o tinta, el que contraste más.
  function tintaSobre(fondoHex) {
    return contraste("#FFFFFF", fondoHex) >= contraste(TINTA, fondoHex) ? "#FFFFFF" : TINTA;
  }

  /* ---------------------------------------------------------
     GEOMETRÍA
     --------------------------------------------------------- */
  // Rectángulo con radios por esquina: {tl, tr, br, bl}
  function rutaRect(x, y, w, h, r) {
    r = r || {};
    var tl = Math.max(0, Math.min(r.tl || 0, w / 2, h / 2));
    var tr = Math.max(0, Math.min(r.tr || 0, w / 2, h / 2));
    var br = Math.max(0, Math.min(r.br || 0, w / 2, h / 2));
    var bl = Math.max(0, Math.min(r.bl || 0, w / 2, h / 2));
    return "M" + (x + tl) + "," + y +
      "H" + (x + w - tr) + (tr ? "a" + tr + "," + tr + " 0 0 1 " + tr + "," + tr : "") +
      "V" + (y + h - br) + (br ? "a" + br + "," + br + " 0 0 1 " + (-br) + "," + br : "") +
      "H" + (x + bl) + (bl ? "a" + bl + "," + bl + " 0 0 1 " + (-bl) + "," + (-bl) : "") +
      "V" + (y + tl) + (tl ? "a" + tl + "," + tl + " 0 0 1 " + tl + "," + (-tl) : "") +
      "Z";
  }

  function n(v) { return Math.round(v * 100) / 100; }

  /* ---------------------------------------------------------
     ENVOLTORIO SVG
     --------------------------------------------------------- */
  function svg(w, h, etiquetaAria, desc, cuerpo) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n(w) + " " + n(h) + '"' +
      ' width="100%" preserveAspectRatio="xMidYMid meet"' +   /* la altura la pone el style: height="auto" no es válido como atributo SVG */
      // Sin overflow:visible a propósito. Si un rótulo se saliera del
      // viewBox invadiría la tarjeta vecina; preferimos que el cálculo
      // de layout lo mantenga adentro (y que la prueba lo detecte).
      ' style="width:100%;height:auto;display:block"' +
      ' role="img" aria-label="' + esc(etiquetaAria) + '"' +
      ' font-family="' + FUENTE + '">' +
      "<desc>" + esc(desc) + "</desc>" +
      cuerpo +
      "</svg>";
  }

  // Paso "redondo" para las marcas del eje (1 · 2 · 2,5 · 5 · 10 ×10^k)
  function pasoLindo(rango, nAprox) {
    if (!(rango > 0)) return 1;
    var bruto = rango / Math.max(1, nAprox);
    var mag = Math.pow(10, Math.floor(Math.log(bruto) / Math.LN10));
    var norm = bruto / mag;
    var p = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
    return p * mag;
  }

  // Registro de cajas ocupadas: evita que dos rótulos se encimen.
  // Si un rótulo no encuentra hueco NO se dibuja encima de otro —
  // se omite, y el valor sigue estando en el <title> y en el aria.
  function Cajas() {
    var lista = [];
    return {
      // `propio` permite que un rótulo ignore la caja de SU PROPIO punto
      // (si no, el punto bloquearía a su propia cifra y no se rotularía).
      libre: function (x, y, w, h, propio) {
        for (var i = 0; i < lista.length; i++) {
          var c = lista[i];
          if (propio !== undefined && c.duenio === propio) continue;
          if (x < c.x + c.w + 4 && x + w + 4 > c.x && y < c.y + c.h + 2 && y + h + 2 > c.y) return false;
        }
        return true;
      },
      ocupar: function (x, y, w, h, duenio) { lista.push({ x: x, y: y, w: w, h: h, duenio: duenio }); }
    };
  }

  function texto(x, y, str, opciones) {
    var o = opciones || {};
    return '<text x="' + n(x) + '" y="' + n(y) + '"' +
      ' font-size="' + (o.px || 14) + '"' +
      (o.peso ? ' font-weight="' + o.peso + '"' : "") +
      ' fill="' + (o.color || TINTA) + '"' +
      (o.ancla ? ' text-anchor="' + o.ancla + '"' : "") +
      (o.tabular ? ' style="font-variant-numeric:tabular-nums"' : "") +
      ">" + esc(str) + "</text>";
  }

  function vacio(w, h, mensaje) {
    var m = mensaje || "Sin datos para mostrar";
    return svg(w, h, m, m,
      '<rect x="1" y="1" width="' + n(w - 2) + '" height="' + n(h - 2) + '" rx="10"' +
      ' fill="none" stroke="' + LINEA + '" stroke-width="1"/>' +
      texto(w / 2, h / 2 + 6, m, { px: 17, color: TINTA_SUAVE, ancla: "middle" })
    );
  }

  /* ---------------------------------------------------------
     UTILIDADES DE DATOS
     --------------------------------------------------------- */
  function num(v) {
    var x = typeof v === "number" ? v : parseFloat(v);
    return isFinite(x) ? x : 0;
  }

  // Para la geometría: los negativos no deberían existir, pero si
  // llegan uno no reventamos — se dibujan como cero y el ROTULO
  // muestra el valor real (nunca mentimos sobre la cifra).
  function paraDibujar(v) { return Math.max(0, num(v)); }

  function resumen(pares, formato, tope) {
    tope = tope || 8;
    var partes = pares.slice(0, tope).map(function (p) {
      return p[0] + " " + fmt(p[1], formato);
    });
    if (pares.length > tope) partes.push("y " + (pares.length - tope) + " más");
    return partes.join(", ");
  }

  /* =========================================================
     1) BARRAS  (horizontales, siempre desde cero)
     ========================================================= */
  function barras(cfg) {
    cfg = cfg || {};
    var datos = Array.isArray(cfg.datos) ? cfg.datos : [];
    var W = Math.max(260, num(cfg.ancho) || 640);
    var formato = cfg.formato === "clp" ? "clp" : "numero";
    var titulo = cfg.titulo ? String(cfg.titulo) : "Gráfico de barras";

    if (!datos.length) return vacio(W, Math.max(120, num(cfg.alto) || 260), "Sin datos para mostrar");

    var filas = datos.map(function (d, i) {
      return {
        etiqueta: (d && d.etiqueta !== undefined && d.etiqueta !== null && String(d.etiqueta) !== "")
          ? String(d.etiqueta) : "(sin nombre)",
        valor: num(d && d.valor),
        color: color(d && d.color, SERIE[i % SERIE.length])
      };
    });

    // orden: "dado" (por defecto, respeta el orden de entrada) | "valor" (mayor a menor)
    if (cfg.orden === "valor") filas.sort(function (a, b) { return b.valor - a.valor; });

    // Tamaños pensados para que un gráfico de 640 unidades metido en una
    // tarjeta de 360 px (escala 0,56) siga sobre los ~10 px: 18×0,56 = 10,1.
    var PX_ET = 17, PX_VAL = 18;
    var padX = 14, padTop = 10, padBot = 12;
    var altoFila = 42;
    var grosorBarra = Math.min(24, altoFila - 16);

    // Canaleta izquierda para los nombres: hasta 40% del ancho.
    var maxGutter = Math.min(W * 0.40, 230);
    var necesario = 0;
    filas.forEach(function (f) { necesario = Math.max(necesario, anchoTexto(f.etiqueta, PX_ET)); });
    var gutter = Math.min(maxGutter, Math.max(70, necesario + 10));

    // Reserva a la derecha para el rótulo del valor.
    var maxVal = 0;
    filas.forEach(function (f) { maxVal = Math.max(maxVal, anchoTexto(fmt(f.valor, formato), PX_VAL)); });
    var reservaVal = Math.min(W * 0.32, maxVal + 12);

    var x0 = padX + gutter;
    var pista = W - padX - reservaVal - x0;
    if (pista < 40) { // ancho muy chico: achicamos la canaleta antes que la pista
      gutter = Math.max(48, gutter - (40 - pista));
      x0 = padX + gutter;
      pista = Math.max(30, W - padX - reservaVal - x0);
    }

    var tope = 0;
    filas.forEach(function (f) { tope = Math.max(tope, paraDibujar(f.valor)); });

    var altoNecesario = padTop + filas.length * altoFila + padBot;
    var H = Math.max(num(cfg.alto) || 0, altoNecesario, 80);
    // Si sobra alto lo repartimos en filas más aireadas (hasta 52).
    if (H > altoNecesario && filas.length) {
      altoFila = Math.min(52, (H - padTop - padBot) / filas.length);
      grosorBarra = Math.min(24, Math.max(12, altoFila - 16));
    }

    var cuerpo = "";
    // Línea base en cero (hairline, sólida, recesiva)
    cuerpo += '<line x1="' + n(x0 - 0.5) + '" y1="' + n(padTop) + '" x2="' + n(x0 - 0.5) +
      '" y2="' + n(padTop + filas.length * altoFila) + '" stroke="' + LINEA + '" stroke-width="1"/>';

    filas.forEach(function (f, i) {
      var yTop = padTop + i * altoFila;
      var yc = yTop + altoFila / 2;
      var v = paraDibujar(f.valor);
      var ancho = tope > 0 ? (v / tope) * pista : 0;
      // Piso visible de 2u para que un valor 100x menor no desaparezca.
      // (0,5% de la pista: no distorsiona la lectura y el monto va rotulado.)
      if (v > 0 && ancho < 2) ancho = 2;

      var etq = truncar(f.etiqueta, gutter - 8, PX_ET);
      cuerpo += '<title>' + esc(f.etiqueta + ": " + fmt(f.valor, formato)) + "</title>";
      cuerpo += texto(padX, yc + PX_ET * 0.35, etq, { px: PX_ET, color: TINTA });

      if (ancho > 0) {
        cuerpo += '<path d="' + rutaRect(x0, yc - grosorBarra / 2, ancho, grosorBarra, { tr: 4, br: 4 }) +
          '" fill="' + f.color + '">' +
          "<title>" + esc(f.etiqueta + ": " + fmt(f.valor, formato)) + "</title></path>";
      }

      // Rótulo del valor: fuera de la punta si cabe; si no, dentro.
      var txtVal = fmt(f.valor, formato);
      var wVal = anchoTexto(txtVal, PX_VAL);
      var xFuera = x0 + ancho + 8;
      if (xFuera + wVal <= W - padX + 0.5) {
        cuerpo += texto(xFuera, yc + PX_VAL * 0.35, txtVal, { px: PX_VAL, peso: 600, color: TINTA, tabular: true });
      } else if (ancho >= wVal + 16) {
        cuerpo += texto(x0 + ancho - 8, yc + PX_VAL * 0.35, txtVal,
          { px: PX_VAL, peso: 600, color: tintaSobre(f.color), ancla: "end", tabular: true });
      } else {
        // No cabe ni fuera ni dentro: versión corta al final de la fila.
        cuerpo += texto(W - padX, yc + PX_VAL * 0.35, fmtCorto(f.valor, formato),
          { px: PX_VAL, peso: 600, color: TINTA, ancla: "end", tabular: true });
      }
    });

    var pares = filas.map(function (f) { return [f.etiqueta, f.valor]; });
    var aria = titulo + ": " + resumen(pares, formato);
    var desc = titulo + ". " + filas.length + " " + (filas.length === 1 ? "categoría" : "categorías") +
      ". Barras desde cero. " + pares.map(function (p) { return p[0] + ": " + fmt(p[1], formato); }).join("; ") + ".";

    return svg(W, H, aria, desc, cuerpo);
  }

  /* =========================================================
     2) BARRAS APILADAS (horizontales)
     ========================================================= */
  function barrasApiladas(cfg) {
    cfg = cfg || {};
    var datos = Array.isArray(cfg.datos) ? cfg.datos : [];
    var W = Math.max(260, num(cfg.ancho) || 640);
    var formato = cfg.formato === "clp" ? "clp" : "numero";
    var titulo = cfg.titulo ? String(cfg.titulo) : "Gráfico de barras apiladas";

    if (!datos.length) return vacio(W, Math.max(120, num(cfg.alto) || 260), "Sin datos para mostrar");

    // Un color por NOMBRE de serie (la entidad), no por posición:
    // si mañana se filtra una fila, las demás no cambian de color.
    var mapaColor = {};
    var ordenSeries = [];
    datos.forEach(function (d) {
      var ss = (d && Array.isArray(d.series)) ? d.series : [];
      ss.forEach(function (s) {
        var nom = (s && s.nombre !== undefined && s.nombre !== null && String(s.nombre) !== "")
          ? String(s.nombre) : "(sin nombre)";
        if (!(nom in mapaColor)) {
          mapaColor[nom] = color(s && s.color, SERIE[ordenSeries.length % SERIE.length]);
          ordenSeries.push(nom);
        } else if (s && s.color) {
          mapaColor[nom] = color(s.color, mapaColor[nom]);
        }
      });
    });

    var filas = datos.map(function (d) {
      var ss = (d && Array.isArray(d.series)) ? d.series : [];
      var segs = ss.map(function (s) {
        var nom = (s && s.nombre !== undefined && s.nombre !== null && String(s.nombre) !== "")
          ? String(s.nombre) : "(sin nombre)";
        return { nombre: nom, valor: num(s && s.valor), color: mapaColor[nom] };
      });
      var total = 0;
      segs.forEach(function (s) { total += num(s.valor); });
      return {
        etiqueta: (d && d.etiqueta !== undefined && d.etiqueta !== null && String(d.etiqueta) !== "")
          ? String(d.etiqueta) : "(sin nombre)",
        segs: segs,
        total: total
      };
    });

    var PX_ET = 17, PX_VAL = 18, PX_LEY = 15, PX_SEG = 14;
    var padX = 14, padBot = 12;
    var GAP = 2; // separación en color de fondo entre segmentos (nunca borde)

    // Leyenda arriba (siempre presente con 2+ series)
    var hayLeyenda = ordenSeries.length >= 2;
    var altoLeyenda = 0;
    var lineasLeyenda = [];
    if (hayLeyenda) {
      var libre = W - padX * 2;
      var actual = [], usado = 0;
      ordenSeries.forEach(function (nom) {
        var w = 12 + 6 + anchoTexto(nom, PX_LEY) + 16;
        if (actual.length && usado + w > libre) { lineasLeyenda.push(actual); actual = []; usado = 0; }
        actual.push({ nombre: nom, w: w });
        usado += w;
      });
      if (actual.length) lineasLeyenda.push(actual);
      altoLeyenda = lineasLeyenda.length * 20 + 8;
    }

    var padTop = 10 + altoLeyenda;
    var altoFila = 44;
    var grosorBarra = Math.min(24, altoFila - 16);

    var maxGutter = Math.min(W * 0.38, 220);
    var nec = 0;
    filas.forEach(function (f) { nec = Math.max(nec, anchoTexto(f.etiqueta, PX_ET)); });
    var gutter = Math.min(maxGutter, Math.max(70, nec + 10));

    var maxTot = 0;
    filas.forEach(function (f) { maxTot = Math.max(maxTot, anchoTexto(fmt(f.total, formato), PX_VAL)); });
    var reservaVal = Math.min(W * 0.32, maxTot + 12);

    var x0 = padX + gutter;
    var pista = W - padX - reservaVal - x0;
    if (pista < 40) {
      gutter = Math.max(48, gutter - (40 - pista));
      x0 = padX + gutter;
      pista = Math.max(30, W - padX - reservaVal - x0);
    }

    var tope = 0;
    filas.forEach(function (f) { tope = Math.max(tope, Math.max(0, f.total)); });

    var altoNecesario = padTop + filas.length * altoFila + padBot;
    var H = Math.max(num(cfg.alto) || 0, altoNecesario, 100);
    if (H > altoNecesario && filas.length) {
      altoFila = Math.min(54, (H - padTop - padBot) / filas.length);
      grosorBarra = Math.min(24, Math.max(12, altoFila - 16));
    }

    var cuerpo = "";

    if (hayLeyenda) {
      var yL = 16;
      lineasLeyenda.forEach(function (ln) {
        var xL = padX;
        ln.forEach(function (it) {
          cuerpo += '<rect x="' + n(xL) + '" y="' + n(yL - 9) + '" width="12" height="12" rx="3" fill="' +
            mapaColor[it.nombre] + '"/>';
          cuerpo += texto(xL + 18, yL + 1, it.nombre, { px: PX_LEY, color: TINTA_SUAVE });
          xL += it.w;
        });
        yL += 20;
      });
    }

    cuerpo += '<line x1="' + n(x0 - 0.5) + '" y1="' + n(padTop) + '" x2="' + n(x0 - 0.5) +
      '" y2="' + n(padTop + filas.length * altoFila) + '" stroke="' + LINEA + '" stroke-width="1"/>';

    filas.forEach(function (f, i) {
      var yTop = padTop + i * altoFila;
      var yc = yTop + altoFila / 2;
      var yB = yc - grosorBarra / 2;

      var etq = truncar(f.etiqueta, gutter - 8, PX_ET);
      cuerpo += texto(padX, yc + PX_ET * 0.35, etq, { px: PX_ET, color: TINTA });

      var visibles = f.segs.filter(function (s) { return paraDibujar(s.valor) > 0; });
      var anchoTotal = tope > 0 ? (Math.max(0, f.total) / tope) * pista : 0;
      var gapsTot = GAP * Math.max(0, visibles.length - 1);
      var util = Math.max(0, anchoTotal - gapsTot);
      var sumaVis = 0;
      visibles.forEach(function (s) { sumaVis += paraDibujar(s.valor); });

      var x = x0;
      visibles.forEach(function (s, k) {
        var w = sumaVis > 0 ? (paraDibujar(s.valor) / sumaVis) * util : 0;
        if (w < 2) w = 2;
        var esUlt = k === visibles.length - 1;
        var esPri = k === 0;
        var r = {};
        if (esPri) { r.tl = 0; r.bl = 0; }
        if (esUlt) { r.tr = 4; r.br = 4; }
        cuerpo += '<path d="' + rutaRect(x, yB, w, grosorBarra, r) + '" fill="' + s.color + '">' +
          "<title>" + esc(f.etiqueta + " · " + s.nombre + ": " + fmt(s.valor, formato)) + "</title></path>";

        // Rótulo dentro del segmento SÓLO si cabe con holgura. Nunca se recorta.
        var t = fmtCorto(s.valor, formato);
        if (anchoTexto(t, PX_SEG) + 12 <= w && grosorBarra >= 16) {
          cuerpo += texto(x + w / 2, yc + PX_SEG * 0.35, t,
            { px: PX_SEG, peso: 600, color: tintaSobre(s.color), ancla: "middle", tabular: true });
        }
        x += w + GAP;
      });

      // Total al final de la fila (siempre visible: es el dato que se compara)
      var txtTot = fmt(f.total, formato);
      var wTot = anchoTexto(txtTot, PX_VAL);
      var xFuera = x0 + Math.max(anchoTotal, 0) + 8;
      if (xFuera + wTot <= W - padX + 0.5) {
        cuerpo += texto(xFuera, yc + PX_VAL * 0.35, txtTot, { px: PX_VAL, peso: 600, color: TINTA, tabular: true });
      } else {
        cuerpo += texto(W - padX, yc + PX_VAL * 0.35, fmtCorto(f.total, formato),
          { px: PX_VAL, peso: 600, color: TINTA, ancla: "end", tabular: true });
      }
    });

    var detalle = filas.map(function (f) {
      return f.etiqueta + " total " + fmt(f.total, formato) +
        (f.segs.length ? " (" + f.segs.map(function (s) { return s.nombre + " " + fmt(s.valor, formato); }).join(", ") + ")" : "");
    }).join("; ");

    var aria = titulo + ": " + filas.map(function (f) {
      return f.etiqueta + " " + fmt(f.total, formato);
    }).slice(0, 8).join(", ") + (filas.length > 8 ? ", y " + (filas.length - 8) + " más" : "") +
      (ordenSeries.length ? ". Series: " + ordenSeries.join(", ") + "." : "");

    return svg(W, H, aria, titulo + ". " + detalle + ".", cuerpo);
  }

  /* =========================================================
     3) LÍNEAS (eje X categórico, eje Y desde cero)
     ========================================================= */
  function lineas(cfg) {
    cfg = cfg || {};
    var entrada = Array.isArray(cfg.series) ? cfg.series : [];
    var W = Math.max(260, num(cfg.ancho) || 640);
    var H = Math.max(140, num(cfg.alto) || 260);
    var formato = cfg.formato === "clp" ? "clp" : "numero";
    var titulo = cfg.titulo ? String(cfg.titulo) : "Gráfico de líneas";

    var series = entrada.map(function (s, i) {
      var pts = (s && Array.isArray(s.puntos)) ? s.puntos : [];
      return {
        nombre: (s && s.nombre !== undefined && s.nombre !== null && String(s.nombre) !== "")
          ? String(s.nombre) : "Serie " + (i + 1),
        color: color(s && s.color, SERIE[i % SERIE.length]),
        puntos: pts.map(function (p) {
          return { x: String(p && p.x !== undefined && p.x !== null ? p.x : ""), y: num(p && p.y) };
        })
      };
    }).filter(function (s) { return s.puntos.length > 0; });

    if (!series.length) return vacio(W, H, "Sin datos para mostrar");

    // Eje X: unión de categorías en orden de aparición.
    var ejeX = [], vistos = {};
    series.forEach(function (s) {
      s.puntos.forEach(function (p) {
        if (!(p.x in vistos)) { vistos[p.x] = ejeX.length; ejeX.push(p.x); }
      });
    });

    var PX_EJE = 15, PX_VAL = 17, PX_LEY = 15;
    var padL = 14, padR = 14, padTop = 12, padBot = 8;

    var hayLeyenda = series.length >= 2;
    var altoLeyenda = 0, lineasLeyenda = [];
    if (hayLeyenda) {
      var libre = W - padL - padR;
      var actual = [], usado = 0;
      series.forEach(function (s) {
        var w = 14 + 6 + anchoTexto(s.nombre, PX_LEY) + 16;
        if (actual.length && usado + w > libre) { lineasLeyenda.push(actual); actual = []; usado = 0; }
        actual.push({ s: s, w: w });
        usado += w;
      });
      if (actual.length) lineasLeyenda.push(actual);
      altoLeyenda = lineasLeyenda.length * 20 + 6;
    }

    // Máximo (siempre desde cero: no hay línea base recortada).
    // El tope se redondea a un número limpio para que las marcas del
    // eje digan 0 / 10 / 20 y no 0 / 6,7 / 13,3.
    var maxY = 0;
    series.forEach(function (s) { s.puntos.forEach(function (p) { maxY = Math.max(maxY, paraDibujar(p.y)); }); });
    var pasoY = pasoLindo(maxY, 3);
    var topeY = maxY > 0 ? Math.ceil(maxY / pasoY) * pasoY : 1;
    var nTicks = maxY > 0 ? Math.min(5, Math.max(1, Math.round(topeY / pasoY))) : 1;

    // Canaleta izquierda para las marcas del eje Y
    var etqMax = fmtCorto(topeY, formato);
    var gutterY = Math.max(28, anchoTexto(etqMax, PX_EJE) + 10);

    var xIni = padL + gutterY;
    var xFin = W - padR;
    var yTop = padTop + altoLeyenda + 12;   // aire para los rótulos de valor
    var yBase = H - padBot - 20;            // banda del eje X dentro del alto
    if (yBase - yTop < 50) yBase = yTop + 50;

    var paso = ejeX.length > 1 ? (xFin - xIni) / (ejeX.length - 1) : 0;
    function px(i) { return ejeX.length > 1 ? xIni + i * paso : (xIni + xFin) / 2; }
    function py(v) { return yBase - (paraDibujar(v) / topeY) * (yBase - yTop); }

    var cuerpo = "";

    if (hayLeyenda) {
      var yL = 16;
      lineasLeyenda.forEach(function (ln) {
        var xL = padL;
        ln.forEach(function (it) {
          var trazo = tonoLegible(it.s.color, CREMA, 3);
          cuerpo += '<line x1="' + n(xL) + '" y1="' + n(yL - 4) + '" x2="' + n(xL + 14) + '" y2="' + n(yL - 4) +
            '" stroke="' + trazo + '" stroke-width="3" stroke-linecap="round"/>';
          cuerpo += texto(xL + 20, yL + 1, it.s.nombre, { px: PX_LEY, color: TINTA_SUAVE });
          xL += it.w;
        });
        yL += 20;
      });
    }

    // Grilla: líneas horizontales sólidas hairline. El rótulo va POR
    // ENCIMA de su línea, no centrado en ella: así el "0" no choca con
    // las etiquetas del eje X que van justo debajo de la línea base.
    for (var t = 0; t <= nTicks; t++) {
      var val = (topeY / nTicks) * t;
      var y = py(val);
      cuerpo += '<line x1="' + n(xIni) + '" y1="' + n(y) + '" x2="' + n(xFin) + '" y2="' + n(y) +
        '" stroke="' + LINEA + '" stroke-width="1"/>';
      cuerpo += texto(xIni - 8, y - 5, fmtCorto(maxY > 0 ? val : 0, formato),
        { px: PX_EJE, color: TINTA_SUAVE, ancla: "end", tabular: true });
    }

    // Etiquetas del eje X. La primera se ancla a la izquierda y la
    // última a la derecha para que ninguna se salga del viewBox.
    var anchoCelda = ejeX.length > 1 ? paso : (xFin - xIni);
    var saltar = 1;
    var maxEtq = 0;
    ejeX.forEach(function (e) { maxEtq = Math.max(maxEtq, anchoTexto(e, PX_EJE)); });
    while (maxEtq > anchoCelda * saltar - 6 && saltar < ejeX.length) saltar++;
    ejeX.forEach(function (e, i) {
      if (i % saltar !== 0 && i !== ejeX.length - 1) return;
      var esPri = i === 0, esUlt = i === ejeX.length - 1;
      var ancla = esUlt ? "end" : (esPri ? "start" : "middle");
      var xe = esUlt ? xFin : (esPri ? xIni - gutterY : px(i));
      var disp = esPri || esUlt ? Math.max(anchoCelda * saltar, 60) : anchoCelda * saltar - 4;
      cuerpo += texto(xe, yBase + 19, truncar(e, Math.max(disp, 34), PX_EJE),
        { px: PX_EJE, color: TINTA_SUAVE, ancla: ancla });
    });

    // ¿Rotulamos todos los puntos? Sólo si hay pocos y no chocan.
    var totalPtos = 0;
    series.forEach(function (s) { totalPtos += s.puntos.length; });
    var anchoVal = 0;
    series.forEach(function (s) {
      s.puntos.forEach(function (p) { anchoVal = Math.max(anchoVal, anchoTexto(fmt(p.y, formato), PX_VAL)); });
    });
    var rotularTodos = series.length <= 2 && ejeX.length <= 7 && anchoVal + 8 <= (paso || (xFin - xIni));

    // Las marcas del eje ya ocupan la canaleta izquierda: se registran
    // para que ningún rótulo de valor se les encime.
    var cajas = Cajas();
    for (var tt = 0; tt <= nTicks; tt++) {
      var yv = py((topeY / nTicks) * tt);
      var wv = anchoTexto(fmtCorto(maxY > 0 ? (topeY / nTicks) * tt : 0, formato), PX_EJE);
      cajas.ocupar(xIni - 8 - wv, yv - 5 - PX_EJE * 0.8, wv, PX_EJE);
    }

    // DOS PASADAS a propósito:
    //   1) líneas y puntos de TODAS las series,
    //   2) después los rótulos.
    // Si se dibujara serie por serie, la línea de la serie 2 pasaría
    // por encima de los números de la serie 1. Además los puntos se
    // registran como ocupados: un rótulo nunca cae sobre un punto.
    var candidatos = [];
    series.forEach(function (s) {
      var trazo = tonoLegible(s.color, CREMA, 3);
      var pts = s.puntos.map(function (p) {
        return { i: vistos[p.x], x: px(vistos[p.x]), y: py(p.y), v: p.y, cat: p.x };
      }).sort(function (a, b) { return a.i - b.i; });

      if (pts.length > 1) {
        var d = pts.map(function (p, k) { return (k ? "L" : "M") + n(p.x) + "," + n(p.y); }).join(" ");
        cuerpo += '<path d="' + d + '" fill="none" stroke="' + trazo + '" stroke-width="2"' +
          ' stroke-linejoin="round" stroke-linecap="round"/>';
      }

      pts.forEach(function (p, k) {
        // Anillo de 2u en color de fondo: el punto se lee aunque cruce otra línea.
        cuerpo += '<circle cx="' + n(p.x) + '" cy="' + n(p.y) + '" r="4.5" fill="' + trazo +
          '" stroke="' + CREMA + '" stroke-width="2">' +
          "<title>" + esc(s.nombre + " · " + p.cat + ": " + fmt(p.v, formato)) + "</title></circle>";
        cajas.ocupar(p.x - 6.5, p.y - 6.5, 13, 13, p); // el punto ocupa lugar
        if (rotularTodos || k === pts.length - 1) candidatos.push(p);
      });
    });

    candidatos.forEach(function (p) {
      var txt = fmt(p.v, formato);
      var w = anchoTexto(txt, PX_VAL);
      // Horizontal: centrado, salvo que se saliera por un costado.
      var ancla = "middle", xt = p.x, izq = p.x - w / 2;
      if (izq < 2) { ancla = "start"; xt = 2; izq = 2; }
      else if (p.x + w / 2 > W - 2) { ancla = "end"; xt = W - 2; izq = W - 2 - w; }
      // Vertical: primero arriba del punto, si no abajo. Si ninguna
      // posición está libre, NO se dibuja: el valor sigue estando en el
      // <title> del punto y en el aria-label, y encimar sería peor.
      var arriba = p.y - 13, abajo = p.y + 20;
      var yt = null;
      if (arriba - PX_VAL * 0.8 >= 0 && cajas.libre(izq, arriba - PX_VAL * 0.8, w, PX_VAL, p)) yt = arriba;
      else if (abajo <= yBase + 2 && cajas.libre(izq, abajo - PX_VAL * 0.8, w, PX_VAL, p)) yt = abajo;
      if (yt !== null) {
        cajas.ocupar(izq, yt - PX_VAL * 0.8, w, PX_VAL);
        cuerpo += texto(xt, yt, txt, { px: PX_VAL, peso: 600, color: TINTA, ancla: ancla, tabular: true });
      }
    });

    // (La línea base en cero ya la dibuja la marca t=0 de la grilla, antes
    // que las series. Repetirla aquí la pondría encima de los rótulos.)

    var detalle = series.map(function (s) {
      return s.nombre + ": " + s.puntos.map(function (p) { return p.x + " " + fmt(p.y, formato); }).join(", ");
    }).join(". ");
    var aria = titulo + ". " + series.map(function (s) {
      var vs = s.puntos.map(function (p) { return paraDibujar(p.y); });
      var ult = s.puntos[s.puntos.length - 1];
      return s.nombre + ": de " + fmt(s.puntos[0].y, formato) + " a " + fmt(ult.y, formato) +
        ", máximo " + fmt(Math.max.apply(null, vs), formato);
    }).join("; ") + ". Eje vertical desde cero.";

    return svg(W, H, aria, titulo + ". " + detalle + ". Eje vertical desde cero.", cuerpo);
  }

  /* =========================================================
     4) DONA (anillo + lista rotulada al lado)
     La lista es el canal de identidad: la porción sola no basta
     para comparar, y menos con colores pastel.
     ========================================================= */
  function dona(cfg) {
    cfg = cfg || {};
    var datos = Array.isArray(cfg.datos) ? cfg.datos : [];
    var W = Math.max(260, num(cfg.ancho) || 560);
    var formato = cfg.formato === "clp" ? "clp" : "numero";
    var titulo = cfg.titulo ? String(cfg.titulo) : "Gráfico de dona";

    if (!datos.length) return vacio(W, Math.max(120, num(cfg.alto) || 240), "Sin datos para mostrar");

    var items = datos.map(function (d, i) {
      return {
        etiqueta: (d && d.etiqueta !== undefined && d.etiqueta !== null && String(d.etiqueta) !== "")
          ? String(d.etiqueta) : "(sin nombre)",
        valor: num(d && d.valor),
        color: color(d && d.color, SERIE[i % SERIE.length])
      };
    });

    // Más de 6 porciones no se distinguen: la cola se agrupa en "Otros".
    if (items.length > 6) {
      var cabeza = items.slice(0, 5);
      var cola = items.slice(5);
      var suma = 0;
      cola.forEach(function (it) { suma += it.valor; });
      // "Otros" NO es una entidad: va en un neutro cálido, nunca en un
      // color de la serie (con lila chocaba con la 5ª porción).
      cabeza.push({
        etiqueta: "Otros (" + cola.length + ")",
        valor: suma,
        color: "#CFC3B2",
        detalle: cola.map(function (it) { return it.etiqueta + " " + fmt(it.valor, formato); }).join(", ")
      });
      items = cabeza;
    }

    var total = 0;
    items.forEach(function (it) { total += paraDibujar(it.valor); });

    var PX_LI = 17, PX_LIV = 17, PX_CENTRO = 26;
    var padX = 16, padY = 14;
    var filaLista = 29;

    var altoLista = items.length * filaLista;

    // El nombre más largo de la lista manda: si al lado del anillo no
    // le queda espacio decente, la lista se va ABAJO a todo el ancho en
    // vez de truncar los nombres a "Efe…" y encimarlos con los montos.
    var nomMax = 0, valMax = 0;
    items.forEach(function (it) {
      nomMax = Math.max(nomMax, anchoTexto(it.etiqueta, PX_LI));
      valMax = Math.max(valMax, anchoTexto(fmt(it.valor, formato) + (total > 0 ? "  100%" : ""), PX_LIV));
    });
    var minLista = Math.min(nomMax, 120) + valMax + 34;
    var lado = Math.min(W * 0.42, 190);
    var apilado = (W - padX - (padX + lado + 18)) < minLista;

    var cx, cy, rExt, rInt, xLista, yLista, anchoLista, H;

    if (apilado) {
      lado = Math.min(W - padX * 2, 170);
      H = Math.max(num(cfg.alto) || 0, padY + lado + 12 + altoLista + padY, 160);
      cx = W / 2;
      cy = padY + lado / 2;
      xLista = padX;
      anchoLista = W - padX * 2;
      yLista = padY + lado + 12 + filaLista / 2;
    } else {
      H = Math.max(num(cfg.alto) || 0, altoLista + padY * 2, lado + padY * 2, 150);
      cx = padX + lado / 2;
      cy = H / 2;
      xLista = padX + lado + 18;
      anchoLista = W - padX - xLista;
      yLista = cy - altoLista / 2 + filaLista / 2;
    }
    rExt = lado / 2 - 2;
    rInt = rExt * 0.62;

    var cuerpo = "";

    if (total <= 0) {
      // Todos en cero: anillo vacío, no una dona falsa.
      cuerpo += '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n((rExt + rInt) / 2) +
        '" fill="none" stroke="' + LINEA + '" stroke-width="' + n(rExt - rInt) + '"/>';
    } else if (items.filter(function (it) { return paraDibujar(it.valor) > 0; }).length === 1) {
      // Una sola porción: anillo completo (evita el artefacto del arco de 360°).
      var unico = items.filter(function (it) { return paraDibujar(it.valor) > 0; })[0];
      cuerpo += '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n((rExt + rInt) / 2) +
        '" fill="none" stroke="' + unico.color + '" stroke-width="' + n(rExt - rInt) + '">' +
        "<title>" + esc(unico.etiqueta + ": " + fmt(unico.valor, formato) + " (100%)") + "</title></circle>";
    } else {
      var ang = -Math.PI / 2;
      var gapAng = 0.02; // separación en fondo, no borde
      items.forEach(function (it) {
        var v = paraDibujar(it.valor);
        if (v <= 0) return;
        var barrido = (v / total) * Math.PI * 2;
        var a0 = ang + gapAng / 2;
        var a1 = ang + barrido - gapAng / 2;
        if (a1 <= a0) a1 = a0 + 0.005;
        var largo = a1 - a0 > Math.PI ? 1 : 0;
        var p = [
          "M", n(cx + rExt * Math.cos(a0)), n(cy + rExt * Math.sin(a0)),
          "A", n(rExt), n(rExt), 0, largo, 1, n(cx + rExt * Math.cos(a1)), n(cy + rExt * Math.sin(a1)),
          "L", n(cx + rInt * Math.cos(a1)), n(cy + rInt * Math.sin(a1)),
          "A", n(rInt), n(rInt), 0, largo, 0, n(cx + rInt * Math.cos(a0)), n(cy + rInt * Math.sin(a0)),
          "Z"
        ].join(" ");
        cuerpo += '<path d="' + p + '" fill="' + it.color + '">' +
          "<title>" + esc(it.etiqueta + ": " + fmt(it.valor, formato) +
            " (" + Math.round((v / total) * 100) + "%)") + "</title></path>";
        ang += barrido;
      });
    }

    // Texto central
    var centro = cfg.centro !== undefined && cfg.centro !== null && String(cfg.centro) !== ""
      ? String(cfg.centro) : fmt(total, formato);
    var pxc = PX_CENTRO;
    while (pxc > 12 && anchoTexto(centro, pxc) > rInt * 1.85) pxc -= 1;
    cuerpo += texto(cx, cy + pxc * 0.35, centro, { px: pxc, peso: 700, color: TINTA, ancla: "middle" });

    // Lista rotulada: swatch + nombre + monto + %
    var y0 = yLista;
    items.forEach(function (it, i) {
      var y = y0 + i * filaLista;
      var v = paraDibujar(it.valor);
      var pct = total > 0 ? Math.round((v / total) * 100) : 0;
      var txtVal = fmt(it.valor, formato) + (total > 0 ? "  " + pct + "%" : "");
      var wVal = anchoTexto(txtVal, PX_LIV);
      var xVal = W - padX;
      var maxNom = anchoLista - 18 - wVal - 10;

      cuerpo += '<rect x="' + n(xLista) + '" y="' + n(y - 6) + '" width="11" height="11" rx="3" fill="' + it.color + '">' +
        "<title>" + esc(it.etiqueta + ": " + fmt(it.valor, formato)) + "</title></rect>";
      cuerpo += texto(xLista + 17, y + PX_LI * 0.32,
        truncar(it.etiqueta, Math.max(maxNom, 40), PX_LI), { px: PX_LI, color: TINTA });
      cuerpo += texto(xVal, y + PX_LIV * 0.32, txtVal,
        { px: PX_LIV, peso: 600, color: TINTA, ancla: "end", tabular: true });
    });

    var pares = items.map(function (it) { return [it.etiqueta, it.valor]; });
    var aria = titulo + ": total " + fmt(total, formato) + ". " + items.map(function (it) {
      var v = paraDibujar(it.valor);
      return it.etiqueta + " " + fmt(it.valor, formato) +
        (total > 0 ? " (" + Math.round((v / total) * 100) + "%)" : "");
    }).join(", ");
    var desc = titulo + ". Total " + fmt(total, formato) + ". " +
      pares.map(function (p) { return p[0] + ": " + fmt(p[1], formato); }).join("; ") + ".";

    return svg(W, H, aria, desc, cuerpo);
  }

  /* =========================================================
     5) SPARKLINE (micro-tendencia, sin rótulos)
     ========================================================= */
  function sparkline(cfg) {
    cfg = cfg || {};
    var vals = Array.isArray(cfg.valores) ? cfg.valores.map(num) : [];
    var W = Math.max(30, num(cfg.ancho) || 90);
    var H = Math.max(14, num(cfg.alto) || 26);
    var base = color(cfg.color, PALETA.frambuesa);
    var trazo = tonoLegible(base, CREMA, 3);

    if (!vals.length) {
      return svg(W, H, "Sin datos de tendencia", "Sin datos de tendencia",
        '<line x1="2" y1="' + n(H / 2) + '" x2="' + n(W - 2) + '" y2="' + n(H / 2) +
        '" stroke="' + LINEA + '" stroke-width="1"/>');
    }

    var pad = 4;
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var rango = max - min;
    var xI = pad, xF = W - pad;
    var yI = pad, yF = H - pad;
    var paso = vals.length > 1 ? (xF - xI) / (vals.length - 1) : 0;

    function X(i) { return vals.length > 1 ? xI + i * paso : (xI + xF) / 2; }
    function Y(v) { return rango > 0 ? yF - ((v - min) / rango) * (yF - yI) : (yI + yF) / 2; }

    var cuerpo = "";
    if (vals.length > 1) {
      var d = vals.map(function (v, i) { return (i ? "L" : "M") + n(X(i)) + "," + n(Y(v)); }).join(" ");
      cuerpo += '<path d="' + d + '" fill="none" stroke="' + trazo + '" stroke-width="2"' +
        ' stroke-linejoin="round" stroke-linecap="round"/>';
    }
    var iU = vals.length - 1;
    cuerpo += '<circle cx="' + n(X(iU)) + '" cy="' + n(Y(vals[iU])) + '" r="2.6" fill="' + trazo +
      '" stroke="' + CREMA + '" stroke-width="1.5"/>';

    var resu = "Tendencia de " + vals.length + " " + (vals.length === 1 ? "valor" : "valores") +
      ": mínimo " + miles(min) + ", máximo " + miles(max) + ", último " + miles(vals[iU]) + ".";
    return svg(W, H, resu, resu, "<title>" + esc(resu) + "</title>" + cuerpo);
  }

  /* --------------------------------------------------------- */
  return {
    barras: barras,
    barrasApiladas: barrasApiladas,
    lineas: lineas,
    dona: dona,
    sparkline: sparkline,
    // Auxiliares expuestos por si el panel los necesita
    PALETA: PALETA,
    SERIE: SERIE,
    formatearCLP: function (v) { return fmt(num(v), "clp"); },
    formatearNumero: function (v) { return fmt(num(v), "numero"); }
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Graficos;
