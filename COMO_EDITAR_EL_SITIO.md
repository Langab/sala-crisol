# Cómo editar el sitio de Sala Crisol 🔥

Este sitio es **estático**: no necesita servidor, base de datos ni mantenciones.
Se puede subir gratis a Netlify, Vercel, GitHub Pages o cualquier hosting.

## ⚠️ Lo ÚNICO obligatorio antes de publicar

Abre `js/config.js` con cualquier editor de texto (Bloc de notas sirve) y:

1. **Reemplaza el número de WhatsApp** en la línea:
   ```js
   whatsapp: "56900000000",
   ```
   Pon el número real en formato `569XXXXXXXX` (sin +, sin espacios).
   Todos los botones y formularios del sitio mandan los mensajes a ese número.

2. Revisa que los horarios y cupos estén al día (ver abajo).

## Ediciones de cada mes (5 minutos)

Todo se hace en `js/config.js`:

- **Mes visible en portada**: cambia `mesActual: "Agosto"`.
- **Cupos disponibles**: en cada taller, edita `cuposDisponibles`. Cuando alguien
  se inscribe, réstale 1. Si pones `0` aparece "Sin cupos"; si pones `null` no
  se muestran cupos.
- **Horarios**: edita `dia` y `hora` de cada taller, y la sección `grilla`
  (lo que se pinta en la tabla semanal de la portada).
- **Precios**: edita los textos de `precios` (son texto libre).
- **Taller pausado**: cambia `estado: "activo"` por `estado: "pronto"` para que
  aparezca "Nueva fecha por anunciar".

## Cuando haya una nueva tertulia

1. Guarda el afiche en `img/` (ej: `img/poster-tertulia-4.jpg`).
2. En `index.html`, busca `<!-- Próxima tertulia (marco vacío) -->` y copia el
   bloque de una tertulia anterior, cambiando imagen, título, fecha y color
   (`--acento-afiche`). Deja el marco vacío al final para la tertulia 05.

## Para agregar un taller nuevo

1. Agrega el bloque en `talleres: [...]` de `js/config.js` (copia uno existente
   y cambia los datos). Con eso ya aparece en la portada, la cinta y la grilla.
2. Duplica una página de `talleres/` (ej: copia `capoeira.html`), renómbrala
   igual que la `pagina` que pusiste en config, y edita los textos.
3. Agrégala al menú desplegable de todas las páginas (busca `nav__despliegue`).

## Videos 🎥

Los reels de Instagram no se pudieron descargar automáticamente, pero el sitio
está listo para recibirlos:

- **Opción simple**: descarga tu reel (en Instagram: ⋯ → Guardar, o con la app
  oficial de Meta), guárdalo como `img/video-clase.mp4` y en la página del
  taller reemplaza la `<img>` del hero por:
  ```html
  <video src="../img/video-clase.mp4" autoplay muted loop playsinline
         style="width:100%; height:100%; object-fit:cover;"></video>
  ```
- Videos cortos (10–20 s), en silencio y en loop = página viva sin marear.

## Estructura de archivos

```
sala_crisol_web/
├── index.html            ← portada
├── nosotros.html         ← página "Nosotras"
├── talleres/             ← una página por taller
├── css/estilo.css        ← todos los estilos (colores arriba del archivo)
├── js/config.js          ← ★ EL ARCHIVO QUE SE EDITA ★
├── js/main.js            ← funcionamiento (no tocar)
└── img/                  ← fotos, flyers y afiches
```

## Cómo publicarlo gratis (Netlify, 10 minutos)

1. Crea una cuenta en https://app.netlify.com (con tu correo).
2. Arrastra la carpeta `sala_crisol_web` completa a la página de Netlify
   ("Drag and drop your site folder here").
3. Listo: te da una URL tipo `salacrisol.netlify.app`. Puedes cambiar el
   nombre en Site settings → Change site name.
4. Pon esa URL en la bio de Instagram. 🎯

Cuando edites algo, vuelve a arrastrar la carpeta y se actualiza.
