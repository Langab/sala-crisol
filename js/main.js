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
        // portada generada con la llama del crisol
        var iniciales = t.nombre.split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("");
        media =
          '<div class="portada-gen">' +
          '<svg viewBox="0 0 400 310" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
          '<rect width="400" height="310" fill="#221610"/>' +
          '<circle cx="' + (90 + (idx * 67) % 220) + '" cy="80" r="130" fill="rgba(240,138,29,0.14)"/>' +
          '<circle cx="' + (310 - (idx * 43) % 180) + '" cy="240" r="100" fill="rgba(201,182,242,0.10)"/>' +
          '<path d="M200 70 C 235 115 260 140 260 185 C 260 232 233 262 200 262 C 167 262 140 232 140 185 C 140 140 165 115 200 70 Z" fill="none" stroke="rgba(255,184,77,0.55)" stroke-width="3"/>' +
          '<text x="200" y="205" text-anchor="middle" font-family="Anton, sans-serif" font-size="64" fill="rgba(245,235,218,0.85)">' + iniciales + "</text>" +
          "</svg>" +
          "</div>";
      }
      return (
        '<a class="tarjeta-taller revelar revelar--retraso-' + (idx % 3 + 1) + '" href="' + base + t.pagina + '">' +
        '<div class="tarjeta-taller__media">' + media +
        '<span class="tarjeta-taller__dia sticker ' + (esPronto ? "sticker--lila" : "sticker--fuego") + '">' +
        (esPronto ? "Nueva fecha pronto" : diasResumen) + "</span></div>" +
        '<div class="tarjeta-taller__cuerpo">' +
        '<h3 class="tarjeta-taller__nombre">' + t.nombre + "</h3>" +
        '<p class="tarjeta-taller__frase">' + t.frase + "</p>" +
        '<div class="tarjeta-taller__meta">' +
        '<span class="mini-chip">' + t.profe + "</span>" +
        '<span class="mini-chip mini-chip--fuego">' + t.nivel + "</span>" +
        "</div>" +
        '<span class="tarjeta-taller__accion">Ver taller e inscribirme <span class="flecha">→</span></span>' +
        "</div></a>"
      );
    }).join("");
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
        '<h3 class="horario__nombre-dia">' + dia + "</h3>" +
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
        taller.horarios.forEach(function (h) {
          var op = document.createElement("option");
          op.value = h.dia + " " + h.hora;
          var agotado = h.cuposDisponibles !== null && h.cuposTotal && h.cuposDisponibles <= 0;
          op.textContent = h.dia + " · " + h.hora + (agotado ? " (sin cupos)" : "");
          if (agotado) op.disabled = true;
          selector.appendChild(op);
        });
      }

      // formulario → WhatsApp con mensaje armado
      var form = panel.querySelector("[data-form-inscripcion]");
      if (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var nombre = form.querySelector('[name="nombre"]').value.trim();
          var horario = selector ? selector.value : "";
          var comentario = form.querySelector('[name="comentario"]');
          var msj = "Hola! Soy " + nombre + " y quiero inscribirme en " + taller.nombre;
          if (horario) msj += " — " + horario;
          if (comentario && comentario.value.trim()) msj += ". " + comentario.value.trim();
          msj += " 🔥 (vengo de la página web)";
          window.open(enlaceWhatsApp(msj), "_blank", "noopener");
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
      msj += " (vengo de la página web ✨)";
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
