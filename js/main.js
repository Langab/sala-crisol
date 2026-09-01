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
    var activos = CRISOL.talleres.filter(function (t) { return t.estado === "activo"; });
    var itemsHtml = activos.map(function (t) {
      return '<a class="cinta__item" href="' + base + t.pagina + '">' + t.nombre + "</a>";
    }).join("");
    itemsHtml = '<span class="cinta__item">Talleres ' + CRISOL.mesActual + "</span>" + itemsHtml;
    // se duplica para el loop infinito
    pista.innerHTML = itemsHtml + itemsHtml;
  }

  /* ---------- tarjetas de talleres en la portada ---------- */
  var rejilla = document.querySelector("[data-rejilla-talleres]");
  if (rejilla && typeof CRISOL !== "undefined") {
    rejilla.innerHTML = CRISOL.talleres.map(function (t, idx) {
      var diasResumen = t.horarios.map(function (h) { return h.dia; })
        .filter(function (v, i, arr) { return arr.indexOf(v) === i; })
        .join(" · ");
      var esPronto = t.estado === "pronto";
      var media;
      if (t.img) {
        media = '<img src="' + base + t.img + '" alt="' + t.nombre + ' en Sala Crisol" loading="lazy">';
      } else {
        // portada generada: tela del color de la clase
        var iniciales = t.nombre.split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("");
        var mapaColor = {
          rosa: "#E39AA6", terracota: "#D98E6A", mostaza: "#E8C583",
          salvia: "#9DBE9C", turquesa: "#8FC6C9", lila: "#B7A6D6"
        };
        var tono = mapaColor[t.color] || "#E39AA6";
        media =
          '<div class="portada-gen" style="background:' + tono + '">' +
          '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%">' +
          '<defs><pattern id="tela-' + t.id + '" width="18" height="18" patternUnits="userSpaceOnUse">' +
          '<rect width="18" height="18" fill="' + tono + '"/>' +
          '<circle cx="9" cy="9" r="3.4" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.2"/>' +
          '<circle cx="9" cy="9" r="1" fill="rgba(255,255,255,0.5)"/>' +
          "</pattern></defs>" +
          '<rect width="400" height="300" fill="url(#tela-' + t.id + ')"/>' +
          "</svg>" +
          '<span style="position:relative">' + iniciales + "</span>" +
          "</div>";
      }
      return (
        '<a class="tarjeta-taller revelar revelar--retraso-' + (idx % 3 + 1) + '" href="' + base + t.pagina + '">' +
        '<div class="tarjeta-taller__media">' + media +
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

      // formulario → registra la inscripción y abre WhatsApp
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
          var modalidad = marcado("modalidad") || "suelta";

          // el select guarda el índice del horario: nada de parsear texto
          var iSel = selector ? parseInt(selector.value, 10) : -1;
          var hSel = taller.horarios[iSel] || null;
          var dia = hSel ? hSel.dia : "";
          var hora = hSel ? hSel.hora : "";
          var horario = hSel ? (dia + " · " + hora) : "";

          var precio = (taller.precios || []).filter(function (pr) {
            return modalidad === "mensual"
              ? /mensual/i.test(pr.nombre)
              : /suelta/i.test(pr.nombre);
          })[0];
          var monto = precio ? (parseInt(String(precio.valor).replace(/[^0-9]/g, ""), 10) || 0) : 0;

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
            fechaSesion: proximaFecha(dia),
            experiencia: marcado("experiencia") || "primera-vez",
            modalidad: modalidad,
            monto: monto,
            asistio: false,
            pago: false,
            metodoPago: "",
            notas: comentario,
            estado: "activa",
            updatedAt: ahora
          };

          var msj = "Hola! Soy " + nombre + " y quiero inscribirme en " + taller.nombre;
          if (horario) msj += " — " + horario;
          if (comentario) msj += ". " + comentario;
          msj += ". Quiero tomar clases con ustedes ✨";
          var urlWs = enlaceWhatsApp(msj);

          var seguir = function (ok) {
            if (aviso) {
              aviso.className = "aviso aviso--" + (ok ? "ok" : "error");
              aviso.textContent = ok
                ? "Listo, quedaste anotada. Te abrimos WhatsApp para confirmar."
                : "No pudimos guardar la inscripción, pero te abrimos WhatsApp igual: mándanos el mensaje y te anotamos a mano.";
            }
            if (boton) { boton.disabled = false; boton.textContent = "Inscribirme →"; }
            window.open(urlWs, "_blank", "noopener");
          };

          var destino = (typeof CRISOL !== "undefined" && CRISOL.inscripcionesURL) || "";
          if (!destino) { seguir(true); form.reset(); return; }

          if (boton) { boton.disabled = true; boton.textContent = "Guardando..."; }
          fetch(destino, {
            method: "POST",
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ inscripciones: [inscripcion] })
          })
            .then(function (r) { return r.json(); })
            .then(function (r) { seguir(!!(r && r.ok)); form.reset(); })
            .catch(function () { seguir(false); });
        });
      }
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
