/* ============================================================
   SALA CRISOL — comportamiento del sitio
   (no necesitas editar este archivo; el contenido se edita desde
    el panel y vive en datos/contenido.json)
   ============================================================ */

/* El sitio se pinta recién cuando el contenido terminó de cargar. */
document.addEventListener("DOMContentLoaded", function () {
  CONTENIDO_LISTO.then(pintarSitio);
});

function pintarSitio() {

  /* ---------- ruta base (las páginas de talleres viven en /talleres) ---------- */
  var esSubpagina = document.body.hasAttribute("data-subpagina");
  var base = esSubpagina ? "../" : "";

  /* horario semanal armado a partir de los horarios de cada clase */
  var GRILLA = construirGrilla();

  /* ============================================================
     TEXTO DEL PANEL → HTML
     ------------------------------------------------------------
     Lo que se escribe en el panel es texto normal, no HTML: así
     nadie puede romper la página pegando algo de Word. Se permiten
     dos marcas, las mismas de WhatsApp:
        *cursiva*      **negrita**
     ============================================================ */
  function texto(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  /* ============================================================
     IMÁGENES
     ------------------------------------------------------------
     Manda lo que se subió por el panel. Si ahí no hay nada, se usa
     la carpeta de siempre (img/talleres/<id>/), así las fotos que
     publica el script desde Recursos_graficos siguen funcionando.
     ============================================================ */
  function limpiarRuta(r) { return String(r || "").replace(/^\/+/, ""); }

  function fotosDelPanel(t) {
    return (t.fotos || []).filter(Boolean).map(limpiarRuta);
  }

  function primeraFoto(t) {
    var f = fotosDelPanel(t);
    return f.length ? f[0] : "img/talleres/" + t.id + "/fotos/01.jpg";
  }

  function portadaTaller(t) {
    return t.portada ? limpiarRuta(t.portada) : "img/talleres/" + t.id + "/flyer.jpg";
  }

  /* ------------------------------------------------------------
     Cadena de respaldo de una imagen: si la primera no existe se
     prueba la siguiente, y si no queda ninguna la imagen se saca.
     Va enganchada desde acá y no con onerror="" en el HTML, porque
     el CSP del sitio bloquea el código escrito dentro de un atributo.
     ------------------------------------------------------------ */
  function respaldoImagen(img, alternativas, alRendirse) {
    var i = 0;
    img.addEventListener("error", function () {
      if (i < alternativas.length) { img.src = alternativas[i++]; return; }
      if (alRendirse) alRendirse(img); else img.remove();
    });
  }

  /* Relojito que marca la hora de la clase: 17:30 → 🕠 */
  function reloj(hora) {
    var m = String(hora || "").match(/(\d{1,2}):(\d{2})/);
    if (!m) return "🕐";
    var h = parseInt(m[1], 10) % 12 || 12;
    var media = parseInt(m[2], 10) >= 30;
    return String.fromCodePoint((media ? 0x1F55C : 0x1F550) + h - 1);
  }

  /* Qué clase muestra esta página: del <body> en las páginas propias,
     y del ?id= de la dirección en la página genérica. */
  var idTaller = document.body.getAttribute("data-taller-actual") ||
                 new URLSearchParams(location.search).get("id") || "";
  var taller = idTaller ? buscarTaller(idTaller) : null;

  /* ---------- menú móvil ---------- */
  var burger = document.querySelector(".nav__burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    var cerrarMenu = function () {
      links.classList.remove("abierto");
      burger.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("menu-abierto");
    };

    burger.addEventListener("click", function () {
      var abierto = links.classList.toggle("abierto");
      burger.setAttribute("aria-expanded", abierto ? "true" : "false");
      // evita que la página de atrás siga scrolleando con el menú abierto
      document.documentElement.classList.toggle("menu-abierto", abierto);
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) cerrarMenu();
    });

    // cerrar con Escape (y devolver el foco al botón)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("abierto")) {
        cerrarMenu();
        burger.focus();
      }
    });
  }


  /* ============================================================
     GUIRNALDA — banderines de tela colgando de un hilo
     Dibuja un SVG dentro de cada [data-guirnalda]. El ancho se
     mide en píxeles reales para que los banderines no se deformen.
     ============================================================ */
  var COLORES_BANDERIN = ["#E39AA6", "#E8C583", "#8FC6C9", "#D98E6A", "#9DBE9C", "#B7A6D6", "#C4626F"];

  function tramaBanderin(id, color, tipo) {
    var oscuro = "rgba(59,49,41,0.20)";
    var claro = "rgba(255,255,255,0.55)";
    var motivo = "";
    if (tipo === 0) {
      motivo = '<circle cx="4" cy="4" r="1.5" fill="' + claro + '"/>';
    } else if (tipo === 1) {
      motivo = '<path d="M0 4 H8" stroke="' + claro + '" stroke-width="1.6"/>';
    } else if (tipo === 2) {
      motivo = '<circle cx="4" cy="4" r="2.1" fill="none" stroke="' + claro + '" stroke-width="1"/>' +
               '<circle cx="4" cy="4" r="0.7" fill="' + oscuro + '"/>';
    } else {
      motivo = '<path d="M2 2 L6 6 M6 2 L2 6" stroke="' + claro + '" stroke-width="1.1"/>';
    }
    return '<pattern id="' + id + '" width="8" height="8" patternUnits="userSpaceOnUse">' +
           '<rect width="8" height="8" fill="' + color + '"/>' + motivo + '</pattern>';
  }

  function dibujarGuirnalda(cont) {
    var ancho = Math.max(cont.clientWidth || 0, 320);
    var caida = Math.min(Math.max(ancho * 0.035, 16), 46);   // cuánto cuelga el hilo
    var yIni = 4;
    var altoBanderin = 44, anchoBanderin = 30, paso = 46;
    var n = Math.max(Math.round(ancho / paso), 4);
    var alto = yIni + caida + altoBanderin + 12;

    // hilo: bezier cuadrática de (0,yIni) a (ancho,yIni) con caída al centro
    var cx = ancho / 2, cy = yIni + caida * 2;
    var defs = "", flags = "", semilla = cont.getAttribute("data-guirnalda-semilla") || "0";
    var desfase = parseInt(semilla, 10) || 0;

    for (var i = 0; i <= n; i++) {
      var t = i / n;
      var u = 1 - t;
      var px = u * u * 0 + 2 * u * t * cx + t * t * ancho;
      var py = u * u * yIni + 2 * u * t * cy + t * t * yIni;
      // pendiente del hilo, para que el banderín cuelgue inclinado como en la tela real
      var dx = 2 * u * (cx - 0) + 2 * t * (ancho - cx);
      var dy = 2 * u * (cy - yIni) + 2 * t * (yIni - cy);
      var ang = Math.atan2(dy, dx) * 180 / Math.PI;

      var ci = (i + desfase) % COLORES_BANDERIN.length;
      var color = COLORES_BANDERIN[ci];
      var tipo = (i + desfase) % 4;
      var pid = "trama-" + semilla + "-" + i;
      defs += tramaBanderin(pid, color, tipo);

      var mitad = anchoBanderin / 2;
      flags +=
        '<g transform="translate(' + px.toFixed(1) + ',' + py.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')">' +
          '<path d="M' + (-mitad) + ' 0 L' + mitad + ' 0 L0 ' + altoBanderin + ' Z" fill="url(#' + pid + ')"/>' +
          '<path d="M' + (-mitad) + ' 0 L' + mitad + ' 0 L0 ' + altoBanderin + ' Z" fill="none" stroke="rgba(59,49,41,0.10)" stroke-width="1"/>' +
          '<circle cx="0" cy="' + (altoBanderin + 4) + '" r="2.6" fill="' + color + '"/>' +
        "</g>";
    }

    var hilo = '<path d="M0 ' + yIni + ' Q ' + cx + ' ' + cy + ' ' + ancho + ' ' + yIni + '" ' +
               'fill="none" stroke="#B9A894" stroke-width="1.6" stroke-linecap="round"/>';

    cont.innerHTML =
      '<svg viewBox="0 0 ' + ancho + " " + alto + '" width="' + ancho + '" height="' + alto + '" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      "<defs>" + defs + "</defs>" + hilo + flags + "</svg>";
  }

  /* Los colores de los banderines cambian de una clase a otra: la semilla
     es el lugar que ocupa en la lista, así una clase nueva del panel también
     estrena guirnalda sin que nadie toque el HTML. */
  if (idTaller) {
    var puesto = (CRISOL.talleres || []).findIndex(function (t) { return t.id === idTaller; });
    if (puesto >= 0) {
      document.querySelectorAll("[data-guirnalda-semilla]").forEach(function (g) {
        g.setAttribute("data-guirnalda-semilla", String(puesto));
      });
    }
  }

  var guirnaldas = [].slice.call(document.querySelectorAll("[data-guirnalda]"));
  if (guirnaldas.length) {
    guirnaldas.forEach(dibujarGuirnalda);
    var relojGuirnalda;
    window.addEventListener("resize", function () {
      clearTimeout(relojGuirnalda);
      relojGuirnalda = setTimeout(function () { guirnaldas.forEach(dibujarGuirnalda); }, 180);
    });
  }

  /* ============================================================
     TENDEDERO — fotos de las clases colgadas con pinzas
     Extiende el gesto de la guirnalda: en esta sala las cosas
     cuelgan de un hilo. Las fotos salen de config.js, así que se
     renuevan solas cuando cambian las de cada clase.
     ============================================================ */
  var tendedero = document.querySelector("[data-tendedero]");
  if (tendedero) {
    var conFoto = talleresVisibles().filter(function (t) { return t.tipo !== "evento"; });
    // dos hilos de verdad: cada polaroid tiene que colgar de una cuerda
    // que se vea, si no las de abajo quedan flotando de la nada
    var caidas = [14, 46, 6, 34, 10];
    var giros  = [-4.5, 3.2, -2.4, 3.8, -3.1];
    var fotos  = conFoto.slice(0, 5);
    var filas  = [fotos.slice(0, 3), fotos.slice(3)];
    var html = [];
    var k = 0;
    filas.forEach(function (fila) {
      if (!fila.length) return;
      html.push('<div class="tendedero__fila">');
      html.push('<span class="tendedero__hilo" aria-hidden="true"></span>');
      fila.forEach(function (t) {
        html.push(
          '<a class="polaroid-col" href="' + base + paginaTaller(t) + '" ' +
          'style="--caida:' + caidas[k % caidas.length] + 'px; --giro:' + giros[k % giros.length] + 'deg; --demora:' + (k * 0.7) + 's">' +
            '<span class="polaroid-col__pinza" aria-hidden="true"></span>' +
            '<span class="polaroid-col__marco">' +
              '<img src="' + base + primeraFoto(t) + '" alt="" loading="lazy">' +
            "</span>" +
            '<span class="polaroid-col__pie">' + texto(t.nombre) + "</span>" +
          "</a>"
        );
        k++;
      });
      html.push("</div>");
    });
    tendedero.innerHTML = html.join("");
    // si una clase todavía no tiene foto, su polaroid se descuelga sola
    tendedero.querySelectorAll("img").forEach(function (im) {
      respaldoImagen(im, [], function (x) { x.closest(".polaroid-col").remove(); });
    });
  }

  /* ---------- chispas del héroe ---------- */
  var heroe = document.querySelector(".heroe");
  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroe && !sinMovimiento) {
    for (var i = 0; i < 14; i++) {
      var chispa = document.createElement("span");
      chispa.className = "chispa";
      chispa.style.left = (4 + Math.random() * 92) + "%";
      chispa.style.animationDuration = (7 + Math.random() * 9) + "s";
      chispa.style.animationDelay = (Math.random() * 10) + "s";
      chispa.style.setProperty("--deriva", (Math.random() * 120 - 60) + "px");
      var tam = 3 + Math.random() * 5;
      chispa.style.width = tam + "px";
      chispa.style.height = tam + "px";
      if (Math.random() > 0.6) chispa.style.background = "var(--lila)";
      heroe.appendChild(chispa);
    }
  }

  /* ============================================================
     FOTOS POR CARPETA — la carpeta manda, no config.js
     ------------------------------------------------------------
     Un sitio estático no puede listar un directorio, así que las
     va pidiendo en orden (01.jpg, 02.jpg, 03.jpg…) y se detiene en
     la primera que no existe. Por eso la numeración no puede tener
     huecos: si falta la 02, la 03 no se ve.
     ============================================================ */
  function fotosDeTaller(taller, tope, listo) {
    var delPanel = fotosDelPanel(taller);
    if (delPanel.length) {
      listo(delPanel.map(function (r) { return base + r; }));
      return;
    }
    var idTaller = taller.id;
    var rutas = [];
    var max = tope || 12;
    (function probar(n) {
      if (n > max) return listo(rutas);
      var ruta = base + "img/talleres/" + idTaller + "/fotos/" + (n < 10 ? "0" : "") + n + ".jpg";
      var im = new Image();
      im.onload = function () { rutas.push(ruta); probar(n + 1); };
      im.onerror = function () { listo(rutas); };
      im.src = ruta;
    })(1);
  }

  /* ---------- cinta / marquesina de talleres ---------- */
  var pista = document.querySelector("[data-cinta]");
  if (pista) {
    var activos = talleresVisibles().filter(function (t) { return t.estado === "activo" && t.tipo !== "evento"; });
    var itemsHtml = activos.map(function (t) {
      return '<a class="cinta__item" href="' + base + paginaTaller(t) + '">' + texto(t.nombre) + "</a>";
    }).join("");
    itemsHtml = '<span class="cinta__item">Clases de ' + texto(String(CRISOL.sala.mesActual || "").toLowerCase()) + "</span>" + itemsHtml;
    // se duplica para el loop infinito
    pista.innerHTML = itemsHtml + itemsHtml;
  }

  /* ---------- tarjetas de talleres en la portada ---------- */
  var rejilla = document.querySelector("[data-rejilla-talleres]");
  if (rejilla) {
    rejilla.innerHTML = talleresVisibles().filter(function (t) { return t.tipo !== "evento"; }).map(function (t, idx) {
      var diasResumen = t.horarios.map(function (h) { return h.dia; })
        .filter(function (v, i, arr) { return arr.indexOf(v) === i; })
        .join(" · ");
      var esPronto = t.estado === "pronto";
      /* La portada es el flyer del taller, por convención:
         img/talleres/<id>/flyer.jpg. Si esa clase todavía no tiene
         flyer, cae a su primera foto; y si tampoco hay, queda la
         portada de tela generada que está debajo. Así las dueñas
         solo tienen que reemplazar el archivo. */
      var mapaColor = {
        rosa: "#E39AA6", terracota: "#D98E6A", mostaza: "#E8C583",
        salvia: "#9DBE9C", turquesa: "#8FC6C9", lila: "#B7A6D6",
        orquidea: "#B67EC4"
      };
      var tono = mapaColor[t.color] || "#E39AA6";
      var iniciales = t.nombre.split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("");
      var respaldo =
        '<div class="portada-gen" style="background:' + tono + '">' +
        '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%">' +
        '<defs><pattern id="tela-' + t.id + '" width="18" height="18" patternUnits="userSpaceOnUse">' +
        '<rect width="18" height="18" fill="' + tono + '"/>' +
        '<circle cx="9" cy="9" r="3.4" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.2"/>' +
        '<circle cx="9" cy="9" r="1" fill="rgba(255,255,255,0.5)"/>' +
        "</pattern></defs>" +
        '<rect width="400" height="500" fill="url(#tela-' + t.id + ')"/>' +
        "</svg>" +
        '<span style="position:relative">' + iniciales + "</span></div>";

      // si falla el flyer probamos la foto; si falla la foto, se quita y queda el respaldo
      var media = respaldo +
        '<img class="portada-img" src="' + base + portadaTaller(t) + '" alt="Flyer de ' +
        texto(t.nombre) + '" loading="lazy" data-respaldo="' + escHtml(base + primeraFoto(t)) + '">';

      return (
        '<a class="tarjeta-taller revelar revelar--retraso-' + (idx % 3 + 1) + '" href="' + base + paginaTaller(t) + '">' +
        '<div class="tarjeta-taller__media' + (t.portadaEsFoto ? "" : " es-flyer") + '">' + media +
        '<span class="tarjeta-taller__dia">' +
        (esPronto ? "Nueva fecha pronto" : diasResumen) + "</span></div>" +
        '<div class="tarjeta-taller__cuerpo">' +
        '<h3 class="tarjeta-taller__nombre">' + texto(t.nombre) + "</h3>" +
        '<p class="tarjeta-taller__frase">' + texto(t.frase) + "</p>" +
        '<div class="tarjeta-taller__meta">' +
        '<span class="mini-chip">' + texto(t.profe) + "</span>" +
        '<span class="mini-chip mini-chip--fuego">' + texto(t.nivel) + "</span>" +
        "</div>" +
        '<span class="tarjeta-taller__accion">Ver clase e inscribirme <span class="flecha">→</span></span>' +
        "</div></a>"
      );
    }).join("");

    rejilla.querySelectorAll(".portada-img").forEach(function (im) {
      respaldoImagen(im, [im.getAttribute("data-respaldo")], null);
      im.addEventListener("error", function () {
        var marco = im.closest(".tarjeta-taller__media");
        if (marco) marco.classList.remove("es-flyer");   // una foto se recorta distinto que un flyer
      });
    });
  }

  /* color del banderín que encabeza cada día: el de su primera clase */
  function colorDia(dia) {
    var bloques = GRILLA[dia] || [];
    for (var i = 0; i < bloques.length; i++) {
      if (!bloques[i].id) continue;
      var t = buscarTaller(bloques[i].id);
      if (t && t.color) return t.color;
    }
    return "mostaza";
  }

  /* ---------- tertulias: cada afiche lleva a su página ---------- */
  var rejTert = document.querySelector("[data-tertulias]");
  if (rejTert) {
    var tertuliasVisibles = (CRISOL.tertulias || []).filter(function (t) { return t.estado !== "oculta"; });
    var html = tertuliasVisibles.map(function (t, i) {
      return (
        '<a class="afiche revelar revelar--retraso-' + (i % 3 + 1) + '" href="' + base + paginaTertulia(t) + '" ' +
        'style="--acento-afiche:' + texto(t.acento) + '">' +
          '<div class="afiche__marco">' +
            '<img src="' + base + limpiarRuta(t.afiche) + '" alt="Afiche de la tertulia ' + texto(t.numero) + ': ' + texto(t.pelicula) + '" loading="lazy">' +
            '<span class="afiche__numero">Tertulia ' + texto(t.numero) + "</span>" +
          "</div>" +
          '<div class="afiche__cuerpo">' +
            '<h3 class="afiche__pelicula">' + texto(t.pelicula) + "</h3>" +
            '<p class="afiche__detalle">' + texto(t.detalle) + "</p>" +
            '<p class="afiche__fecha">' + texto(t.fecha) + "</p>" +
            '<span class="afiche__ver">Ver cómo fue <span class="flecha">→</span></span>' +
          "</div>" +
        "</a>"
      );
    }).join("");
    html +=
      '<article class="afiche afiche--tba revelar revelar--retraso-3">' +
        '<div class="afiche__marco"><span class="afiche__interrogante">' +
        String(tertuliasVisibles.length + 1).padStart(2, "0") + "</span>" +
        '<span class="afiche__numero">Próximo ciclo</span></div>' +
        '<div class="afiche__cuerpo">' +
          "<h3 class=\"afiche__pelicula\">¿Qué veremos?</h3>" +
          '<p class="afiche__detalle">La cuarta tertulia se está cocinando. Entradas $5.000 (preventa 2×$7.000). Síguenos para enterarte primero.</p>' +
          '<a class="afiche__fecha" data-ig href="#">Avisarme por Instagram →</a>' +
        "</div>" +
      "</article>";
    rejTert.innerHTML = html;
  }

  /* ---------- grilla semanal de horarios ---------- */
  var tabla = document.querySelector("[data-grilla]");
  if (tabla) {
    var dias = Object.keys(GRILLA);
    tabla.innerHTML = dias.map(function (dia) {
      var bloques = GRILLA[dia];
      var htmlBloques;
      if (!bloques || bloques.length === 0) {
        htmlBloques = '<p class="horario__vacio">Sala disponible para arriendo</p>';
      } else {
        htmlBloques = bloques.map(function (b) {
          var clase = "horario__bloque" + (b.tipo === "mensual" ? " horario__bloque--mensual" : "");
          var interior =
            '<span class="horario__hora">' + texto(b.hora) + "</span>" +
            '<span class="horario__clase">' + texto(b.clase) + "</span>" +
            '<span class="horario__profe">' + texto(b.profe) + "</span>";
          if (b.id) {
            var taller = buscarTaller(b.id);
            var href = taller ? base + paginaTaller(taller) : "#talleres";
            return '<a class="' + clase + '" href="' + href + '">' + interior + "</a>";
          }
          return '<span class="' + clase + '" style="cursor:default">' + interior + "</span>";
        }).join("");
      }
      return (
        '<div class="horario__dia revelar">' +
        '<h3 class="horario__nombre-dia"><span class="banderin banderin--' + colorDia(dia) + '"></span>' + dia + "</h3>" +
        htmlBloques +
        "</div>"
      );
    }).join("");
  }

  /* ---------- menú de clases: sale del panel, no se escribe a mano ---------- */
  document.querySelectorAll("[data-nav-clases]").forEach(function (menu) {
    var aqui = document.body.getAttribute("data-taller-actual") || "";
    menu.innerHTML = talleresVisibles()
      .filter(function (t) { return t.tipo !== "evento"; })
      .map(function (t) {
        var dias = (t.horarios || []).map(function (h) { return h.dia; })
          .filter(function (v, i, a) { return a.indexOf(v) === i; }).join(" · ");
        var pie = t.id === aqui ? "Estás aquí ✿" : dias + " · " + texto(t.profeCorto || t.profe);
        return '<a href="' + base + paginaTaller(t) + '">' + texto(t.nombre) +
               " <small>" + pie + "</small></a>";
      }).join("");
  });

  /* ---------- dirección de la sala (va en el pie de cada página) ---------- */
  if (CRISOL.sala.direccion) {
    document.querySelectorAll("[data-direccion]").forEach(function (el) {
      el.innerHTML = texto(CRISOL.sala.direccion);
    });
  }

  /* ---------- precios del arriendo ---------- */
  var listaArriendo = document.querySelector("[data-arriendo]");
  if (listaArriendo) {
    listaArriendo.innerHTML = ((CRISOL.arriendo && CRISOL.arriendo.precios) || []).map(function (p) {
      return "<li><span>" + texto(p.nombre) + '</span> <span class="valor">' + texto(p.valor) + "</span></li>";
    }).join("");
  }

  /* ---------- enlaces de WhatsApp genéricos ---------- */
  document.querySelectorAll("[data-ws]").forEach(function (el) {
    var motivo = el.getAttribute("data-ws") || "Hola! Vengo de la página web de Sala Crisol y quiero más información 🔥";
    el.href = enlaceWhatsApp(motivo);
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-ig]").forEach(function (el) {
    el.href = enlaceInstagram();
    el.target = "_blank";
    el.rel = "noopener";
  });

  /* próxima fecha (YYYY-MM-DD) en que cae ese día de la semana */
  /* Todo lo que escribe una visitante pasa por aquí antes de volver a la
     página. Sin esto, un nombre con < > se interpreta como HTML. */
  function escHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function proximaFecha(nombreDia) {
    var dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    var idx = dias.indexOf(nombreDia);
    var hoy = new Date();
    if (idx < 0) return hoy.toISOString().slice(0, 10);
    var faltan = (idx - hoy.getDay() + 7) % 7;
    if (faltan === 0) faltan = 7;            // si es hoy, la próxima semana
    var f = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + faltan);
    var mm = String(f.getMonth() + 1).padStart(2, "0");
    var dd = String(f.getDate()).padStart(2, "0");
    return f.getFullYear() + "-" + mm + "-" + dd;
  }

  /* ============================================================
     PÁGINA DE UNA CLASE
     ------------------------------------------------------------
     Qué clase es sale de data-taller-actual en el <body>, y si la
     página es la genérica (clase.html), del ?id= de la dirección.
     Todo lo que se lee viene del panel: nada está escrito a mano.
     ============================================================ */
  if (idTaller) pintarPaginaTaller(taller);

  function pintarPaginaTaller(t) {
    var cuerpo = document.querySelector("[data-t-cuerpo]");
    if (!cuerpo) return;

    /* La clase se borró o se ocultó desde el panel: mejor decirlo que
       mostrar una página a medias. */
    if (!t || t.estado === "oculto") {
      cuerpo.innerHTML =
        '<div class="taller-bloque"><h2>Esta clase no está <span class="acento">disponible</span></h2>' +
        "<p>Puede que haya terminado el ciclo o que estemos armando la próxima fecha. " +
        'Mira <a href="' + base + 'index.html#talleres">todas las clases</a> o escríbenos.</p></div>';
      var heroVacio = document.querySelector("[data-t-hero]");
      if (heroVacio) heroVacio.innerHTML = '<h1>Sala <span>Crisol</span></h1>';
      var asideVacio = document.querySelector("[data-panel-inscripcion]");
      if (asideVacio) asideVacio.hidden = true;
      return;
    }

    var TONOS = { rosa: "#E39AA6", terracota: "#D98E6A", mostaza: "#E8C583",
                  salvia: "#9DBE9C", turquesa: "#8FC6C9", lila: "#B7A6D6",
                  orquidea: "#B67EC4" };
    var HALOS = { rosa: "#F7E6E9", terracota: "#F9EAE1", mostaza: "#FAF0DC",
                  salvia: "#EAF1E9", turquesa: "#E4F1F2", lila: "#EFE9F6",
                  orquidea: "#F4E9F8" };
    var tono = TONOS[t.color] || TONOS.rosa;

    document.title = t.nombre + " — Sala Crisol";
    var seccion = document.querySelector(".taller-hero");
    if (seccion) seccion.style.setProperty("--halo", HALOS[t.color] || HALOS.rosa);

    /* título: la primera palabra en negro y el resto en el color de la clase */
    var partes = String(t.nombre).split(" ");
    var h1 = document.querySelector("[data-t-titulo]");
    if (h1) {
      h1.innerHTML = texto(partes[0]) +
        (partes.length > 1 ? ' <span style="color:' + tono + '">' + texto(partes.slice(1).join(" ")) + "</span>" : "");
    }

    var elSub = document.querySelector("[data-t-subtitulo]");
    if (elSub) {
      elSub.innerHTML = texto(t.subtitulo);
      elSub.hidden = !t.subtitulo;
    }

    var elFrase = document.querySelector("[data-t-frase]");
    if (elFrase) elFrase.innerHTML = texto(t.frase);

    var elDesc = document.querySelector("[data-t-desc]");
    if (elDesc) elDesc.innerHTML = texto(t.descripcion);

    var elChips = document.querySelector("[data-t-chips]");
    if (elChips) {
      var chips = (t.horarios || []).map(function (h) {
        return "" + reloj(h.hora) + " " + texto(h.dia + " " + h.hora);
      });
      if (t.nivel) chips.push("✿ " + texto(t.nivel));
      if (t.duracion) chips.push("⏱ " + texto(t.duracion));
      if (t.temporada) chips.push("🌙 " + texto(t.temporada));
      elChips.innerHTML = chips.map(function (c) {
        return '<span class="chip">' + c + "</span>";
      }).join("");
    }

    var elTrabajo = document.querySelector("[data-t-trabajo]");
    if (elTrabajo) {
      var lista = (t.trabajo || []).map(function (b) {
        return "<li><strong>" + texto(b.titulo) + "</strong> — " + texto(b.texto) + "</li>";
      }).join("");
      elTrabajo.innerHTML = lista
        ? '<h2>Qué vas a <span class="acento">trabajar</span></h2><ul class="lista-beneficios">' + lista + "</ul>"
        : "";
      elTrabajo.hidden = !lista;
    }

    var elParaMi = document.querySelector("[data-t-parami]");
    if (elParaMi) {
      var parrafos = (t.paraMi || []).map(function (p) { return "<p>" + texto(p) + "</p>"; }).join("");
      elParaMi.innerHTML = parrafos
        ? '<h2>¿Es <span class="acento">para mí</span>?</h2>' + parrafos
        : "";
      elParaMi.hidden = !parrafos;
    }

    var elProfe = document.querySelector("[data-t-profe]");
    if (elProfe) {
      var iniciales = String(t.profe).split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("");
      var avatar = t.fotoProfe
        ? '<div class="profe-tarjeta__avatar"><img src="' + base + limpiarRuta(t.fotoProfe) +
          '" alt="' + texto(t.profe) + '"></div>'
        : '<div class="profe-tarjeta__avatar" style="background:' + tono +
          ';display:grid;place-items:center;font-family:var(--fuente-display);font-weight:600;font-size:1.3rem;color:#fff">' +
          texto(iniciales) + "</div>";
      elProfe.innerHTML =
        '<h2>Tu <span class="acento">profe</span></h2>' +
        '<div class="profe-tarjeta">' + avatar + "<div>" +
          "<h4>" + texto(t.profe) + "</h4>" +
          "<p>" + texto(t.bioProfe) + "</p>" +
          (t.profeIg
            ? '<a href="https://www.instagram.com/' + encodeURIComponent(t.profeIg) +
              '/" target="_blank" rel="noopener">@' + texto(t.profeIg) + " →</a>"
            : "") +
        "</div></div>";
    }
  }

  /* ---------- panel de inscripción en páginas de taller ---------- */
  var panel = document.querySelector("[data-panel-inscripcion]");
  if (panel && taller && taller.estado !== "oculto") {
      // horarios + cupos
      var contHorarios = panel.querySelector("[data-horarios]");
      if (contHorarios) {
        contHorarios.innerHTML = taller.horarios.map(function (h) {
          var cuposHtml = "";
          if (h.cuposDisponibles !== null && h.cuposTotal) {
            if (h.cuposDisponibles <= 0) {
              cuposHtml = '<span class="cupos cupos--lleno">Sin cupos</span>';
            } else if (h.cuposDisponibles <= 3) {
              cuposHtml = '<span class="cupos cupos--pocos">¡Quedan ' + h.cuposDisponibles + "!</span>";
            } else {
              cuposHtml = '<span class="cupos cupos--ok">' + h.cuposDisponibles + " cupos</span>";
            }
          }
          return (
            '<div class="horario-opcion">' +
            '<div class="horario-opcion__info"><b>' + texto(h.dia) + "</b><span>" + texto(h.hora) + "</span></div>" +
            cuposHtml +
            "</div>"
          );
        }).join("");
      }

      // precios
      var contPrecios = panel.querySelector("[data-precios]");
      if (contPrecios) {
        contPrecios.innerHTML = taller.precios.map(function (p) {
          return '<div class="precio-tag">' + texto(p.nombre) + "<b>" + texto(p.valor) + "</b></div>";
        }).join("");
      }

      // opciones del selector de horario
      var selector = panel.querySelector("[data-selector-horario]");
      if (selector) {
        taller.horarios.forEach(function (h, iH) {
          var op = document.createElement("option");
          op.value = String(iH);
          var agotado = h.cuposDisponibles !== null && h.cuposTotal && h.cuposDisponibles <= 0;
          op.textContent = h.dia + " · " + h.hora + (agotado ? " (sin cupos)" : "");
          if (agotado) op.disabled = true;
          selector.appendChild(op);
        });
      }

      /* Portada de la página: el mismo flyer que en la tarjeta, con la
         misma cadena de respaldo. Antes cada página traía una imagen
         suelta y tres mostraban fotos que no eran ni de esa clase. */
      var figura = document.querySelector("[data-portada-taller]");
      if (figura) {
        var tono2 = ({ rosa:"#E39AA6", terracota:"#D98E6A", mostaza:"#E8C583",
                       salvia:"#9DBE9C", turquesa:"#8FC6C9", lila:"#B7A6D6",
                       orquidea:"#B67EC4" })[taller.color] || "#E39AA6";
        var ini2 = taller.nombre.split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("");
        figura.className = "taller-hero__media" + (taller.portadaEsFoto ? "" : " es-flyer");
        figura.style.background = tono2;
        figura.innerHTML =
          '<span class="taller-hero__ini" aria-hidden="true">' + texto(ini2) + "</span>" +
          '<img src="' + base + portadaTaller(taller) + '" alt="Flyer de ' + texto(taller.nombre) + '">';
        var imgPortada = figura.querySelector("img");
        respaldoImagen(imgPortada, [base + primeraFoto(taller)], null);
        imgPortada.addEventListener("error", function () {
          figura.classList.remove("es-flyer");
        });
      }

      /* opciones de pago: salen de los precios de ESTA clase, porque
         no todas valen lo mismo. La última deja decir que el pase del
         mes ya está pagado, para no cobrarlo dos veces. */
      var contMod = panel.querySelector("[data-modalidades]");
      if (contMod) {
        var ops = (taller.precios || []).map(function (pr, i) {
          return '<label class="opcion"><input type="radio" name="modalidad" value="' + i + '"' +
                 (i === 0 ? " checked" : "") + '>' +
                 '<span><b>' + texto(pr.nombre) + "</b><em>" + texto(pr.valor) + "</em></span></label>";
        });
        ops.push('<label class="opcion opcion--pagada"><input type="radio" name="modalidad" value="pagada">' +
                 '<span><b>Ya pagué el pase del mes</b><em>No pago hoy</em></span></label>');
        contMod.innerHTML = ops.join("");
      }

      /* galería: la arma la carpeta del taller, no config.js */
      var galeria = document.querySelector("[data-galeria]");
      var contFotos = document.querySelector("[data-galeria-fotos]");
      if (galeria && contFotos) {
        fotosDeTaller(taller, 12, function (rutas) {
          if (!rutas.length) return;
          contFotos.innerHTML = rutas.map(function (ruta, i) {
            return '<figure class="galeria__foto"><img src="' + ruta +
                   '" alt="' + texto(taller.nombre) + ' en Sala Crisol, foto ' + (i + 1) +
                   '" loading="lazy"></figure>';
          }).join("");
          galeria.hidden = false;
        });
      }

      // formulario → registra la inscripción en la planilla
      var form = panel.querySelector("[data-form-inscripcion]");
      if (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var val = function (n) {
            var el = form.querySelector('[name="' + n + '"]');
            return el ? el.value.trim() : "";
          };
          var marcado = function (n) {
            var el = form.querySelector('[name="' + n + '"]:checked');
            return el ? el.value : "";
          };
          var aviso = form.querySelector("[data-aviso]");
          var boton = form.querySelector('button[type="submit"]');

          var nombre = val("nombre");
          var comentario = val("comentario");

          // el select guarda el índice del horario: nada de parsear texto
          var iSel = selector ? parseInt(selector.value, 10) : -1;
          var hSel = taller.horarios[iSel] || null;
          var dia = hSel ? hSel.dia : "";
          var hora = hSel ? hSel.hora : "";

          var elegida = marcado("modalidad");
          var yaPagado = elegida === "pagada";
          var precio = yaPagado ? null : (taller.precios || [])[parseInt(elegida, 10) || 0];

          // el contrato de la planilla solo distingue suelta de mensual
          var modalidad = (precio && /suelta/i.test(precio.nombre)) ? "suelta" : "mensual";
          var monto = yaPagado ? 0 : (precio ? (precio.monto || 0) : 0);

          var fechaSesion = taller.fechaFija || proximaFecha(dia);
          var ahora = new Date().toISOString();
          var inscripcion = {
            id: "insc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
            creado: ahora,
            nombre: nombre,
            telefono: val("telefono"),
            correo: val("correo"),
            claseId: taller.id,
            claseNombre: taller.nombre,
            dia: dia,
            hora: hora,
            fechaSesion: fechaSesion,
            experiencia: marcado("experiencia") || "primera-vez",
            modalidad: modalidad,
            monto: monto,
            asistio: false,
            pago: false,
            metodoPago: "",
            notas: (yaPagado ? "Dice tener el pase del mes al día — confirmar. " : "") + comentario,
            estado: "activa",
            updatedAt: ahora
          };

          var msj = "Hola! Soy " + nombre + " y me inscribí en " + taller.nombre;
          if (dia) msj += " — " + dia + " " + hora;
          msj += ". Quiero tomar clases con ustedes ✨";
          var urlWs = enlaceWhatsApp(msj);

          // pantalla de confirmación, en la misma página
          var confirmar = function () {
            var f = new Date(fechaSesion + "T12:00:00");
            var meses = ["enero","febrero","marzo","abril","mayo","junio","julio",
                         "agosto","septiembre","octubre","noviembre","diciembre"];
            var cuando = dia + " " + f.getDate() + " de " + meses[f.getMonth()];
            panel.innerHTML =
              '<div class="inscrita">' +
                '<div class="inscrita__marca">✓</div>' +
                "<h3>Listo, " + escHtml(nombre.split(" ")[0]) + "</h3>" +
                "<p>Quedaste inscrita. Te esperamos:</p>" +
                '<dl class="inscrita__datos">' +
                  "<dt>Clase</dt><dd>" + taller.nombre + "</dd>" +
                  "<dt>Cuándo</dt><dd>" + cuando + " · " + hora + "</dd>" +
                  "<dt>Valor</dt><dd>" + (yaPagado
                      ? "Pase del mes ya pagado"
                      : (precio ? precio.valor + " · " + precio.nombre : "por confirmar")) + "</dd>" +
                "</dl>" +
                "<p class=\"inscrita__nota\">La sala te confirma el cupo por WhatsApp. " +
                  "Si tienes alguna duda antes, escríbenos.</p>" +
                '<a class="boton boton--ws" target="_blank" rel="noopener" href="' + urlWs + '">Escribir por WhatsApp</a>' +
                '<button class="inscrita__otra" type="button">Inscribir a otra persona</button>' +
              "</div>";
            panel.querySelector(".inscrita__otra").addEventListener("click", function () {
              location.reload();
            });
            panel.scrollIntoView({ behavior: "smooth", block: "center" });
          };

          var fallar = function () {
            if (aviso) {
              aviso.className = "aviso aviso--error";
              aviso.innerHTML = "No pudimos guardar tu inscripción. " +
                '<a href="' + urlWs + '" target="_blank" rel="noopener"><strong>Escríbenos por WhatsApp</strong></a>' +
                " y te anotamos a mano.";
            }
            if (boton) { boton.disabled = false; boton.textContent = "Inscribirme"; }
          };

          if (!nombre || !hSel) { fallar(); return; }

          var destino = CRISOL.inscripcionesURL || "";
          if (!destino) { confirmar(); return; }

          // bloquea el doble envío mientras viaja
          if (boton) { boton.disabled = true; boton.textContent = "Guardando…"; }
          if (aviso) { aviso.className = "aviso"; aviso.textContent = ""; }

          fetch(destino, {
            method: "POST",
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ inscripciones: [inscripcion] })
          })
            .then(function (r) { return r.json(); })
            .then(function (r) { if (r && r.ok) confirmar(); else fallar(); })
            .catch(fallar);
        });
    }
  }

  /* ============================================================
     PÁGINA DE UNA TERTULIA
     Igual que las clases: la página es un molde y el contenido
     entero sale del panel.
     ============================================================ */
  var contTert = document.querySelector("[data-tert-cuerpo]");
  if (contTert) {
    var idTert = document.body.getAttribute("data-tertulia-actual") ||
                 new URLSearchParams(location.search).get("id") || "";
    pintarPaginaTertulia(buscarTertulia(idTert));
  }

  function pintarPaginaTertulia(t) {
    var hero = document.querySelector(".evento-hero");

    if (!t || t.estado === "oculta") {
      contTert.innerHTML =
        '<div class="evento-relato"><h2>Esta tertulia no está <span class="acento">disponible</span></h2>' +
        '<p>Mira <a href="' + base + 'index.html#tertulias">todas las tertulias</a> o escríbenos por Instagram.</p></div>';
      var heroTert = document.querySelector("[data-tert-hero]");
      if (heroTert) heroTert.innerHTML = '<h1 class="evento-hero__titulo">Tertulias de cine</h1>';
      return;
    }

    document.title = "Tertulia " + t.numero + " · " + t.pelicula + " — Sala Crisol";

    /* la paleta la manda el afiche del evento */
    var pal = t.paleta || {};
    if (hero) {
      hero.style.setProperty("--ev-fondo", pal.fondo || "#1A0B2E");
      hero.style.setProperty("--ev-tinta", pal.tinta || "#F7E9FF");
      hero.style.setProperty("--ev-acento", pal.acento || t.acento || "#E845C8");
      hero.style.setProperty("--ev-acento2", pal.acento2 || t.acento || "#7B3FF2");
    }

    var poner = function (sel, html) {
      var el = document.querySelector(sel);
      if (el) el.innerHTML = html;
    };
    poner("[data-tert-eyebrow]", "Tertulia " + texto(t.numero) + " · cine + conversación");
    poner("[data-tert-titulo]", texto(t.pelicula));
    poner("[data-tert-subtitulo]", texto(t.subtitulo));
    poner("[data-tert-fecha]", texto(t.fecha));
    poner("[data-tert-bajada]", texto(t.detalle));
    poner("[data-tert-afiche]",
      '<img src="' + base + limpiarRuta(t.afiche) + '" alt="Afiche de Tertulia ' +
      texto(t.numero) + " · " + texto(t.pelicula) + '">');

    var piezas = (t.piezas || []).filter(Boolean);
    var fotos = (t.fotos || []).filter(Boolean);
    contTert.innerHTML =
      '<div class="evento-relato"><h2>Qué pasó esa noche</h2><p>' + texto(t.relato) + "</p></div>" +
      (piezas.length
        ? '<div class="evento-piezas"><h2>Las piezas del ciclo</h2><div class="piezas__grilla">' +
          piezas.map(function (r) {
            return '<figure class="pieza"><img src="' + base + limpiarRuta(r) +
                   '" alt="Pieza gráfica del evento" loading="lazy"></figure>';
          }).join("") + "</div></div>"
        : "") +
      (fotos.length
        /* las fotos de la noche van recortadas en cuadrado (.galeria__grilla),
           a diferencia de las piezas gráficas, que se ven completas */
        ? '<div class="evento-galeria"><h2>Cómo se vivió</h2><div class="galeria__grilla">' +
          fotos.map(function (r) {
            return '<figure class="galeria__foto"><img src="' + base + limpiarRuta(r) +
                   '" alt="' + texto(t.pelicula) + '" loading="lazy"></figure>';
          }).join("") + "</div></div>"
        : '<div class="evento-vacio"><p><strong>Todavía no tenemos fotos de esta tertulia.</strong> ' +
          "Si estuviste y sacaste alguna, escríbenos por Instagram y la sumamos.</p></div>");
  }

  /* ============================================================
     DOMINGO POPULAR
     El afiche de la portada y la página completa de la jornada.
     Cambia todos los meses, así que no hay nada escrito a mano.
     ============================================================ */
  var DP = CRISOL.domingoPopular;

  var aficheDP = document.querySelector("[data-dp-afiche]");
  if (aficheDP && DP && DP.afiche) {
    aficheDP.innerHTML =
      '<img src="' + base + limpiarRuta(DP.afiche) +
      '" alt="Afiche del Domingo Popular · ' + texto(DP.fecha) + '" loading="lazy">';
  }

  var cuerpoDP = document.querySelector("[data-dp-cuerpo]");
  if (cuerpoDP && DP) {
    /* los colores del afiche del mes */
    var heroJornada = document.querySelector(".evento-hero");
    var palDP = DP.paleta || {};
    if (heroJornada) {
      Object.keys(palDP).forEach(function (k) {
        if (palDP[k]) heroJornada.style.setProperty("--ev-" + k, palDP[k]);
      });
    }

    document.querySelectorAll("[data-dp-fecha]").forEach(function (el) {
      el.innerHTML = texto(DP.fecha + " · " + DP.horario);
    });
    document.querySelectorAll("[data-dp-bajada]").forEach(function (el) {
      el.innerHTML = texto(DP.bajada);
    });
    var heroDP = document.querySelector("[data-dp-afiche-hero]");
    if (heroDP && DP.afiche) {
      heroDP.innerHTML = '<img src="' + base + limpiarRuta(DP.afiche) +
        '" alt="Afiche del Domingo Popular · ' + texto(DP.fecha) + '">';
    }

    var jornada = (DP.bloques || []).map(function (b) {
      if (!b.hora) return '<li class="jornada__pausa"><span>' + texto(b.clase) + "</span></li>";
      return '<li class="jornada__bloque"><span class="jornada__hora">' + texto(b.hora) +
             '</span><span class="jornada__clase">' + texto(b.clase) +
             '</span><span class="jornada__profe">' + texto(b.profe) + "</span></li>";
    }).join("");

    var piezasDP = (DP.piezas || []).filter(Boolean);

    cuerpoDP.innerHTML =
      '<div class="evento-relato"><h2>De qué se trata</h2><p>' + texto(DP.descripcion) + "</p></div>" +
      (jornada ? '<div class="jornada"><h2>La jornada</h2><ul class="jornada__lista">' + jornada + "</ul></div>" : "") +
      '<div class="evento-datos">' +
        '<div class="evento-dato"><h3>Aporte monetario</h3><ul class="aporte-precios">' +
          (DP.aporteMonetario || []).map(function (a) {
            return "<li><span>" + texto(a.n) + "</span><b>" + texto(a.valor) + "</b></li>";
          }).join("") +
        "</ul></div>" +
        '<div class="evento-dato"><h3>O aporte material</h3>' +
          '<p class="evento-aporte">' + texto(DP.equivalencia) + "</p>" +
          '<ul class="aporte-materiales">' +
            (DP.aporteMaterial || []).map(function (m) { return "<li>" + texto(m) + "</li>"; }).join("") +
          "</ul></div>" +
      "</div>" +
      (piezasDP.length
        ? '<div class="evento-piezas"><h2>El afiche del mes</h2><div class="piezas__grilla">' +
          piezasDP.map(function (r) {
            return '<figure class="pieza"><img src="' + base + limpiarRuta(r) +
                   '" alt="Información del Domingo Popular" loading="lazy"></figure>';
          }).join("") + "</div></div>"
        : "");
  }

  /* ---------- inscripción al Domingo Popular ---------- */
  var cajaDP = document.querySelector("[data-form-domingo]");
  if (cajaDP && CRISOL.domingoPopular) {
    var dp = CRISOL.domingoPopular;
    var clasesDP = dp.bloques.filter(function (b) { return b.hora; });

    cajaDP.innerHTML =
      '<form class="formulario" data-form-dp>' +
        "<p>Cuéntanos que vienes y te guardamos un lugar. " +
        "<strong>" + texto(dp.fecha) + " · " + texto(dp.horario) + "</strong></p>" +
        '<div class="campo"><label for="dp-nombre">Tu nombre</label>' +
        '<input id="dp-nombre" name="nombre" type="text" autocomplete="name" placeholder="¿Cómo te llamas?" required></div>' +
        '<div class="campo"><label for="dp-tel">WhatsApp</label>' +
        '<input id="dp-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="+56 9 ..." required></div>' +
        '<div class="campo"><label id="dp-lbl">¿A qué clases vienes?</label>' +
        '<div class="opciones opciones--precios" role="group" aria-labelledby="dp-lbl">' +
          clasesDP.map(function (b, i) {
            return '<label class="opcion"><input type="checkbox" name="clase" value="' + escHtml(b.clase) + '">' +
                   "<span><b>" + texto(b.clase) + "</b><em>" + texto(b.hora) + "</em></span></label>";
          }).join("") +
        "</div></div>" +
        '<div class="campo"><label for="dp-aporte">Cómo vas a aportar</label>' +
        '<select id="dp-aporte" name="aporte">' +
          dp.aporteMonetario.map(function (a) {
            return '<option value="' + escHtml(a.n + " — " + a.valor) + '">' + texto(a.n + " — " + a.valor) + "</option>";
          }).join("") +
          '<option value="con materiales">Llevo materiales para la sala</option>' +
        "</select></div>" +
        '<p class="aviso" data-aviso role="status" aria-live="polite"></p>' +
        '<button class="boton boton--ws" type="submit">Anotarme →</button>' +
        '<p class="formulario__nota">Te confirmamos por WhatsApp. ' +
        "Nadie se queda fuera por plata: si no puedes aportar, ven igual.</p>" +
      "</form>";

    var formDP = cajaDP.querySelector("[data-form-dp]");
    formDP.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = formDP.querySelector('[name="nombre"]').value.trim();
      var elegidas = [].slice.call(formDP.querySelectorAll('[name="clase"]:checked'))
        .map(function (c) { return c.value; });
      var aporte = formDP.querySelector('[name="aporte"]').value;
      var msj = "Hola! Soy " + nombre + " y quiero ir al Domingo Popular del " +
                dp.fecha.replace("Domingo ", "") + ".";
      if (elegidas.length) msj += " Me interesan: " + elegidas.join(", ") + ".";
      msj += " Aporte: " + aporte + " 🌿";
      var aviso = formDP.querySelector("[data-aviso]");
      if (aviso) {
        aviso.className = "aviso aviso--ok";
        aviso.textContent = "Listo. Te abrimos WhatsApp para confirmar tu lugar.";
      }
      window.open(enlaceWhatsApp(msj), "_blank", "noopener");
    });
  }

  /* ---------- formulario general "Hablemos" ---------- */
  var formHablemos = document.querySelector("[data-form-hablemos]");
  if (formHablemos) {
    formHablemos.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = formHablemos.querySelector('[name="nombre"]').value.trim();
      var interes = formHablemos.querySelector('[name="interes"]').value;
      var mensaje = formHablemos.querySelector('[name="mensaje"]').value.trim();
      var msj = "Hola! Soy " + nombre + ". Me interesa: " + interes + ".";
      if (mensaje) msj += " " + mensaje;
      msj += " Quiero tomar clases con ustedes ✨";
      window.open(enlaceWhatsApp(msj), "_blank", "noopener");
    });
  }

  /* ---------- aparición al hacer scroll ---------- */
  var revelables = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window && !sinMovimiento) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revelables.forEach(function (el) { observador.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- año en el pie ---------- */
  var anio = document.querySelector("[data-anio]");
  if (anio) anio.textContent = new Date().getFullYear();
}
