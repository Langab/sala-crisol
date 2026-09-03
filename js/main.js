/* ============================================================
   SALA CRISOL — comportamiento del sitio
   (no necesitas editar este archivo; los datos van en config.js)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- ruta base (las páginas de talleres viven en /talleres) ---------- */
  var esSubpagina = document.body.hasAttribute("data-subpagina");
  var base = esSubpagina ? "../" : "";

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
  if (tendedero && typeof CRISOL !== "undefined") {
    var conFoto = CRISOL.talleres.filter(function (t) {
      return t.tipo !== "evento" && t.fotos && t.fotos.length;
    });
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
          '<a class="polaroid-col" href="' + base + t.pagina + '" ' +
          'style="--caida:' + caidas[k % caidas.length] + 'px; --giro:' + giros[k % giros.length] + 'deg; --demora:' + (k * 0.7) + 's">' +
            '<span class="polaroid-col__pinza" aria-hidden="true"></span>' +
            '<span class="polaroid-col__marco">' +
              '<img src="' + base + t.fotos[0] + '" alt="" loading="lazy">' +
            "</span>" +
            '<span class="polaroid-col__pie">' + t.nombre + "</span>" +
          "</a>"
        );
        k++;
      });
      html.push("</div>");
    });
    tendedero.innerHTML = html.join("");
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

  /* ---------- cinta / marquesina de talleres ---------- */
  var pista = document.querySelector("[data-cinta]");
  if (pista && typeof CRISOL !== "undefined") {
    var activos = CRISOL.talleres.filter(function (t) { return t.estado === "activo" && t.tipo !== "evento"; });
    var itemsHtml = activos.map(function (t) {
      return '<a class="cinta__item" href="' + base + t.pagina + '">' + t.nombre + "</a>";
    }).join("");
    itemsHtml = '<span class="cinta__item">Clases de ' + CRISOL.mesActual.toLowerCase() + "</span>" + itemsHtml;
    // se duplica para el loop infinito
    pista.innerHTML = itemsHtml + itemsHtml;
  }

  /* ---------- tarjetas de talleres en la portada ---------- */
  var rejilla = document.querySelector("[data-rejilla-talleres]");
  if (rejilla && typeof CRISOL !== "undefined") {
    rejilla.innerHTML = CRISOL.talleres.filter(function (t) { return t.tipo !== "evento"; }).map(function (t, idx) {
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
        salvia: "#9DBE9C", turquesa: "#8FC6C9", lila: "#B7A6D6"
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

      var flyer = base + "img/talleres/" + t.id + "/flyer.jpg";
      var foto1 = (t.fotos && t.fotos[0]) ? base + t.fotos[0] : "";
      // si falla el flyer probamos la foto; si falla la foto, se quita y queda el respaldo
      var alFallar = foto1
        ? "this.onerror=function(){this.remove()};this.src='" + foto1 + "';" +
          "this.closest('.tarjeta-taller__media').classList.remove('es-flyer');"
        : "this.remove()";
      var media = respaldo +
        '<img class="portada-img" src="' + flyer + '" alt="Flyer de ' + t.nombre + '" loading="lazy" ' +
        'onerror="this.onerror=null;' + alFallar + '">';

      return (
        '<a class="tarjeta-taller revelar revelar--retraso-' + (idx % 3 + 1) + '" href="' + base + t.pagina + '">' +
        '<div class="tarjeta-taller__media es-flyer">' + media +
        '<span class="tarjeta-taller__dia">' +
        (esPronto ? "Nueva fecha pronto" : diasResumen) + "</span></div>" +
        '<div class="tarjeta-taller__cuerpo">' +
        '<h3 class="tarjeta-taller__nombre">' + t.nombre + "</h3>" +
        '<p class="tarjeta-taller__frase">' + t.frase + "</p>" +
        '<div class="tarjeta-taller__meta">' +
        '<span class="mini-chip">' + t.profe + "</span>" +
        '<span class="mini-chip mini-chip--fuego">' + t.nivel + "</span>" +
        "</div>" +
        '<span class="tarjeta-taller__accion">Ver clase e inscribirme <span class="flecha">→</span></span>' +
        "</div></a>"
      );
    }).join("");
  }

  /* color del banderín que encabeza cada día: el de su primera clase */
  function colorDia(dia) {
    var bloques = (typeof CRISOL !== "undefined" && CRISOL.grilla[dia]) || [];
    for (var i = 0; i < bloques.length; i++) {
      if (!bloques[i].id) continue;
      var t = CRISOL.talleres.filter(function (x) { return x.id === bloques[i].id; })[0];
      if (t && t.color) return t.color;
    }
    return "mostaza";
  }

  /* ---------- grilla semanal de horarios ---------- */
  var tabla = document.querySelector("[data-grilla]");
  if (tabla && typeof CRISOL !== "undefined") {
    var dias = Object.keys(CRISOL.grilla);
    tabla.innerHTML = dias.map(function (dia) {
      var bloques = CRISOL.grilla[dia];
      var htmlBloques;
      if (!bloques || bloques.length === 0) {
        htmlBloques = '<p class="horario__vacio">Sala disponible para arriendo</p>';
      } else {
        htmlBloques = bloques.map(function (b) {
          var clase = "horario__bloque" + (b.tipo === "mensual" ? " horario__bloque--mensual" : "");
          var interior =
            '<span class="horario__hora">' + b.hora + "</span>" +
            '<span class="horario__clase">' + b.clase + "</span>" +
            '<span class="horario__profe">' + b.profe + "</span>";
          if (b.id) {
            var taller = CRISOL.talleres.find(function (t) { return t.id === b.id; });
            var href = taller ? base + taller.pagina : "#talleres";
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

  /* ---------- enlaces de WhatsApp genéricos ---------- */
  if (typeof CRISOL !== "undefined") {
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
  }

  /* próxima fecha (YYYY-MM-DD) en que cae ese día de la semana */
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

  /* ---------- panel de inscripción en páginas de taller ---------- */
  var panel = document.querySelector("[data-taller]");
  if (panel && typeof CRISOL !== "undefined") {
    var idTaller = panel.getAttribute("data-taller");
    var taller = CRISOL.talleres.find(function (t) { return t.id === idTaller; });

    if (taller) {
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
            '<div class="horario-opcion__info"><b>' + h.dia + "</b><span>" + h.hora + "</span></div>" +
            cuposHtml +
            "</div>"
          );
        }).join("");
      }

      // precios
      var contPrecios = panel.querySelector("[data-precios]");
      if (contPrecios) {
        contPrecios.innerHTML = taller.precios.map(function (p) {
          return '<div class="precio-tag">' + p.nombre + "<b>" + p.valor + "</b></div>";
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

      /* opciones de pago: salen de los precios de ESTA clase, porque
         no todas valen lo mismo. La última deja decir que el pase del
         mes ya está pagado, para no cobrarlo dos veces. */
      var contMod = panel.querySelector("[data-modalidades]");
      if (contMod) {
        var ops = (taller.precios || []).map(function (pr, i) {
          return '<label class="opcion"><input type="radio" name="modalidad" value="' + i + '"' +
                 (i === 0 ? " checked" : "") + '>' +
                 '<span><b>' + pr.nombre + "</b><em>" + pr.valor + "</em></span></label>";
        });
        ops.push('<label class="opcion opcion--pagada"><input type="radio" name="modalidad" value="pagada">' +
                 '<span><b>Ya pagué el pase del mes</b><em>No pago hoy</em></span></label>');
        contMod.innerHTML = ops.join("");
      }

      /* galería de fotos de la clase (sale de `fotos` en config.js) */
      var galeria = document.querySelector("[data-galeria]");
      var contFotos = document.querySelector("[data-galeria-fotos]");
      if (galeria && contFotos && taller.fotos && taller.fotos.length) {
        contFotos.innerHTML = taller.fotos.map(function (ruta, i) {
          return '<figure class="galeria__foto"><img src="' + base + ruta +
                 '" alt="' + taller.nombre + ' en Sala Crisol, foto ' + (i + 1) +
                 '" loading="lazy"></figure>';
        }).join("");
        galeria.hidden = false;
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
                "<h3>Listo, " + nombre.split(" ")[0] + "</h3>" +
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

          var destino = (typeof CRISOL !== "undefined" && CRISOL.inscripcionesURL) || "";
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
  }

  /* ---------- inscripción al Domingo Popular ---------- */
  var cajaDP = document.querySelector("[data-form-domingo]");
  if (cajaDP && typeof CRISOL !== "undefined") {
    var dp = buscarTaller("domingo-popular");
    if (!dp || dp.estado !== "activo") {
      cajaDP.remove();
    } else {
      var h0 = dp.horarios[0] || { dia: "Domingo", hora: "" };
      var meses = ["enero","febrero","marzo","abril","mayo","junio","julio",
                   "agosto","septiembre","octubre","noviembre","diciembre"];
      var fdp = dp.fechaFija ? new Date(dp.fechaFija + "T12:00:00") : null;
      var cuando = fdp
        ? "Domingo " + fdp.getDate() + " de " + meses[fdp.getMonth()]
        : "Próxima fecha por anunciar";

      cajaDP.innerHTML =
        '<h3>Ven al próximo</h3>' +
        '<p class="dp-cuando">' + cuando + (h0.hora ? " · " + h0.hora : "") + "</p>" +
        '<form data-form-dp>' +
          '<div class="campo"><label for="dp-nombre">Tu nombre</label>' +
          '<input id="dp-nombre" name="nombre" type="text" autocomplete="name" placeholder="¿Cómo te llamas?" required></div>' +
          '<div class="campo"><label for="dp-telefono">WhatsApp</label>' +
          '<input id="dp-telefono" name="telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="+56 9 ..." required></div>' +
          '<div class="campo"><label for="dp-cuantos">¿Vienen más contigo?</label>' +
          '<input id="dp-cuantos" name="cuantos" type="text" placeholder="Ej: voy con una amiga"></div>' +
          '<p class="aviso" data-aviso-dp role="status" aria-live="polite"></p>' +
          '<button class="boton boton--fuego" type="submit">Anotarme</button>' +
          '<p class="formulario__nota">Quedas en la lista del día. Es de aporte voluntario.</p>' +
        "</form>";

      var formDP = cajaDP.querySelector("[data-form-dp]");
      formDP.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = function (n) { var el = formDP.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; };
        var nombre = v("nombre");
        var aviso = cajaDP.querySelector("[data-aviso-dp]");
        var boton = formDP.querySelector('button[type="submit"]');
        var ahora = new Date().toISOString();
        var ins = {
          id: "insc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
          creado: ahora, nombre: nombre, telefono: v("telefono"), correo: "",
          claseId: dp.id, claseNombre: dp.nombre, dia: h0.dia, hora: h0.hora,
          fechaSesion: dp.fechaFija || proximaFecha(h0.dia),
          experiencia: "primera-vez", modalidad: "suelta", monto: 0,
          asistio: false, pago: false, metodoPago: "",
          notas: v("cuantos"), estado: "activa", updatedAt: ahora
        };
        var listo = function (ok) {
          if (boton) { boton.disabled = false; boton.textContent = "Anotarme"; }
          aviso.className = "aviso aviso--" + (ok ? "ok" : "error");
          aviso.textContent = ok
            ? "Listo, " + nombre.split(" ")[0] + ". Te esperamos el " + cuando.toLowerCase() + "."
            : "No pudimos anotarte. Escríbenos por WhatsApp y te sumamos a mano.";
          if (ok) formDP.reset();
        };
        var destino = CRISOL.inscripcionesURL || "";
        if (!destino) return listo(true);
        boton.disabled = true; boton.textContent = "Guardando…";
        fetch(destino, {
          method: "POST", redirect: "follow",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ inscripciones: [ins] })
        }).then(function (r) { return r.json(); })
          .then(function (r) { listo(!!(r && r.ok)); })
          .catch(function () { listo(false); });
      });
    }
  }

  /* ---------- formulario general "Hablemos" ---------- */
  var formHablemos = document.querySelector("[data-form-hablemos]");
  if (formHablemos && typeof CRISOL !== "undefined") {
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
});
